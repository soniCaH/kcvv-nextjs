/**
 * Team Detail Page
 * Displays individual team pages for all teams (senior and youth)
 */

import { Suspense } from "react";
import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import * as Tabs from "@radix-ui/react-tabs";
import { runPromise } from "@/lib/effect/runtime";
import { UrlTabs } from "@/components/ui/url-tabs";
import {
  DrupalService,
  type TeamWithRoster,
  NotFoundError,
} from "@/lib/effect/services/DrupalService";
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { Match, RankingEntry } from "@/lib/effect/schemas";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamRoster } from "@/components/team/TeamRoster";
import { TeamSchedule } from "@/components/team/TeamSchedule";
import { TeamStandings } from "@/components/team/TeamStandings";
import {
  parseAgeGroup,
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamType,
  getTeamTagline,
  transformMatchToSchedule,
  transformRankingToStandings,
} from "./utils";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

/**
 * Generates route parameters for all team pages by listing all teams from Drupal.
 *
 * Drupal stores teams with different path prefixes:
 * - Senior teams: /team/a-ploeg
 * - Youth teams: /jeugd/u15
 * - Club teams: /club/bestuur
 *
 * We extract the slug (last segment) to create unified /team/[slug] routes.
 * The DrupalService uses Decoupled Router which can resolve both
 * /team/u15 and /jeugd/u15 to the same entity.
 *
 * @returns An array of route parameter objects, each with a `slug` property
 */
export async function generateStaticParams() {
  try {
    const teams = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeams();
      }),
    );

    console.log(`Generated static params for ${teams.length} teams`);

    // Extract slug from path alias - handles /team/*, /jeugd/*, /club/*
    // Use Set to deduplicate slugs (in case multiple teams share the same last segment)
    const validPrefixes = ["/team/", "/jeugd/", "/club/"];
    const slugSet = new Set<string>();

    for (const team of teams) {
      const alias = team.attributes.path?.alias || "";

      // Validate that the alias starts with an expected prefix
      const hasValidPrefix = validPrefixes.some((prefix) =>
        alias.startsWith(prefix),
      );
      if (!hasValidPrefix) {
        console.warn(
          `[team] Unexpected path alias "${alias}" for team ${team.id} (${team.attributes.title}). Expected prefix: ${validPrefixes.join(", ")}`,
        );
        continue;
      }

      // Extract last path segment as slug (e.g., "/jeugd/u15" -> "u15")
      const parts = alias.split("/").filter(Boolean);
      const slug = parts[parts.length - 1] || "";
      if (slug) {
        slugSet.add(slug);
      }
    }

    const slugs = Array.from(slugSet);
    console.info(`[team] Static slugs: ${slugs.join(", ")}`);

    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate static params for teams:", error);
    return [];
  }
}

/**
 * Create SEO and Open Graph metadata for the team identified by `params.slug`.
 *
 * @param params - An awaited route parameter object containing the `slug`
 * @returns A Metadata object with title, description, and openGraph
 */
export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { team, teamImageUrl } = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(slug);
      }),
    );

    const tagline = getTeamTagline(team);
    const title = team.attributes.title;
    const teamType = getTeamType(team);

    const typeLabel = teamType === "youth" ? "Jeugdploeg" : "Ploeg";
    const description = tagline
      ? `${title} - ${tagline}`
      : `${title} - KCVV Elewijt ${typeLabel}`;

    return {
      title: `${title} | KCVV Elewijt`,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: teamImageUrl
          ? [
              {
                url: teamImageUrl,
                alt: `${title} teamfoto`,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Team niet gevonden | KCVV Elewijt",
    };
  }
}

/**
 * Fetch team with roster and trigger 404 if not found
 *
 * Only catches NotFoundError to show 404 page. Network and validation
 * errors propagate to the error boundary.
 */
async function fetchTeamOrNotFound(slug: string): Promise<TeamWithRoster> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(slug);
      }),
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}

/**
 * Footbalisto data for team matches and standings
 */
interface FootbalistoData {
  matches: readonly Match[];
  standings: readonly RankingEntry[];
  teamId: number;
}

/**
 * Fetch matches and standings from Footbalisto if team has a VoetbalVlaanderen ID
 *
 * Uses field_vv_id (with field_vv_id_2 as fallback) for team ID.
 * Uses field_league_id for the ranking/standings API.
 *
 * Returns null if team doesn't have a VV ID or if fetching fails.
 * Failures are logged but don't break the page - the tabs just won't show.
 */
async function fetchFootbalistoData(
  vvId: string | null | undefined,
  leagueId: number | null | undefined,
): Promise<FootbalistoData | null> {
  if (!vvId) {
    return null;
  }

  const teamId = parseInt(vvId, 10);
  if (isNaN(teamId)) {
    console.warn(`[team] Invalid VoetbalVlaanderen ID: ${vvId}`);
    return null;
  }

  // Use league ID if provided, otherwise fall back to team ID
  const rankingId = leagueId ?? teamId;

  try {
    const [matches, standings] = await runPromise(
      Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService;

        // Fetch matches and standings in parallel using Effect.all
        const [matchesResult, standingsResult] = yield* Effect.all(
          [
            footbalisto
              .getMatches(teamId)
              .pipe(
                Effect.catchAll(() => Effect.succeed([] as readonly Match[])),
              ),
            footbalisto
              .getRanking(rankingId)
              .pipe(
                Effect.catchAll(() =>
                  Effect.succeed([] as readonly RankingEntry[]),
                ),
              ),
          ],
          { concurrency: "unbounded" },
        );

        return [matchesResult, standingsResult] as const;
      }),
    );

    return { matches, standings, teamId };
  } catch (error) {
    console.error(`[team] Failed to fetch Footbalisto data:`, error);
    return null;
  }
}

/**
 * Render the team detail page for the given slug.
 *
 * @param params - Promise resolving to an object with a `slug` string
 * @param searchParams - Promise resolving to query parameters (e.g., ?tab=lineup)
 * @returns The team detail page element
 */
export default async function TeamPage({
  params,
  searchParams: _searchParams,
}: TeamPageProps) {
  const { slug } = await params;
  // searchParams is used by UrlTabs client component via useSearchParams hook
  void _searchParams;

  // Log the requested slug (server-side)
  console.info(`[team] Requested team slug: ${slug}`);

  // Fetch team with roster from Drupal
  const { team, staff, players, teamImageUrl } =
    await fetchTeamOrNotFound(slug);

  // Log resolved team alias/id after fetch
  console.info(
    `[team] Resolved team -> id: ${team.id}, alias: ${team.attributes.path?.alias}`,
  );

  // Compute Footbalisto ID with fallback (field_vv_id_2 for teams in multiple leagues)
  const vvId = team.attributes.field_vv_id || team.attributes.field_vv_id_2;

  // Fetch Footbalisto data if team has a VoetbalVlaanderen ID
  const footbalistoData = vvId
    ? await fetchFootbalistoData(vvId, team.attributes.field_league_id)
    : null;

  // Transform data for display
  const ageGroup = parseAgeGroup(team);
  const teamType = getTeamType(team);
  const tagline = getTeamTagline(team);

  // Transform players and staff for TeamRoster component
  const rosterPlayers = players.map(transformPlayerToRoster);
  const staffMembers = staff.map(transformStaffToMember);

  // Transform Footbalisto data for components
  const scheduleMatches = footbalistoData
    ? footbalistoData.matches.map(transformMatchToSchedule)
    : [];

  const standingsEntries = footbalistoData
    ? footbalistoData.standings.map(transformRankingToStandings)
    : [];

  // Determine if we have content for different tabs
  const hasPlayers = rosterPlayers.length > 0;
  const hasStaff = staffMembers.length > 0;
  const hasContactInfo = !!team.attributes.field_contact_info?.processed;
  const hasMatches = scheduleMatches.length > 0;
  const hasStandings = standingsEntries.length > 0;

  // Build list of valid tabs based on available content
  const validTabs = [
    "info",
    ...(hasPlayers || hasStaff ? ["lineup"] : []),
    ...(hasMatches ? ["matches"] : []),
    ...(hasStandings ? ["standings"] : []),
  ];

  return (
    <>
      {/* Team Header */}
      <TeamHeader
        name={team.attributes.title}
        imageUrl={teamImageUrl}
        ageGroup={ageGroup}
        teamType={teamType}
        tagline={tagline}
      />

      {/* Tab Navigation - URL synced for direct linking */}
      {/* Suspense boundary required for useSearchParams in UrlTabs during static generation */}
      <Suspense
        fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}
      >
        <UrlTabs
          defaultValue="info"
          validTabs={validTabs}
          className="container mx-auto px-4 py-8"
        >
          <Tabs.List
            className="flex border-b border-gray-200 mb-6"
            aria-label="Team informatie"
          >
            <Tabs.Trigger
              value="info"
              className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent data-[state=active]:border-kcvv-green-bright data-[state=active]:text-kcvv-green-bright transition-colors"
            >
              Info
            </Tabs.Trigger>
            {(hasPlayers || hasStaff) && (
              <Tabs.Trigger
                value="lineup"
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent data-[state=active]:border-kcvv-green-bright data-[state=active]:text-kcvv-green-bright transition-colors"
              >
                Lineup
              </Tabs.Trigger>
            )}
            {hasMatches && (
              <Tabs.Trigger
                value="matches"
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent data-[state=active]:border-kcvv-green-bright data-[state=active]:text-kcvv-green-bright transition-colors"
              >
                Wedstrijden
              </Tabs.Trigger>
            )}
            {hasStandings && (
              <Tabs.Trigger
                value="standings"
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent data-[state=active]:border-kcvv-green-bright data-[state=active]:text-kcvv-green-bright transition-colors"
              >
                Stand
              </Tabs.Trigger>
            )}
          </Tabs.List>

          {/* Info Tab */}
          <Tabs.Content value="info" className="focus:outline-none">
            <div className="space-y-8">
              {/* Contact Info */}
              {hasContactInfo && (
                <section className="prose prose-gray max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Contactinformatie</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: team.attributes.field_contact_info!.processed!,
                    }}
                  />
                </section>
              )}

              {/* Staff only (when no players - show staff in info tab) */}
              {!hasPlayers && hasStaff && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Technische Staf</h2>
                  <TeamRoster
                    players={[]}
                    staff={staffMembers}
                    teamName={team.attributes.title}
                    groupByPosition={false}
                    showStaff={true}
                  />
                </section>
              )}

              {/* Team body content if available */}
              {team.attributes.body?.processed && (
                <section className="prose prose-gray max-w-none">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: team.attributes.body.processed,
                    }}
                  />
                </section>
              )}

              {/* No content message */}
              {!hasContactInfo &&
                !hasStaff &&
                !team.attributes.body?.processed && (
                  <p className="text-gray-500 text-center py-8">
                    Geen extra informatie beschikbaar voor dit team.
                  </p>
                )}
            </div>
          </Tabs.Content>

          {/* Lineup Tab */}
          {(hasPlayers || hasStaff) && (
            <Tabs.Content value="lineup" className="focus:outline-none">
              <TeamRoster
                players={rosterPlayers}
                staff={staffMembers}
                teamName={team.attributes.title}
                groupByPosition={true}
                showStaff={hasStaff}
              />
            </Tabs.Content>
          )}

          {/* Matches Tab */}
          {hasMatches && footbalistoData && (
            <Tabs.Content value="matches" className="focus:outline-none">
              <TeamSchedule
                matches={scheduleMatches}
                teamId={footbalistoData.teamId}
                showPast={true}
                highlightNext={true}
              />
            </Tabs.Content>
          )}

          {/* Standings Tab */}
          {hasStandings && footbalistoData && (
            <Tabs.Content value="standings" className="focus:outline-none">
              <TeamStandings
                standings={standingsEntries}
                highlightTeamId={footbalistoData.teamId}
              />
            </Tabs.Content>
          )}
        </UrlTabs>
      </Suspense>
    </>
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
