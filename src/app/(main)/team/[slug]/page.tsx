/**
 * Team Detail Page
 * Displays individual team pages for all teams (senior and youth)
 */

import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { runPromise } from "@/lib/effect/runtime";
import {
  DrupalService,
  type TeamWithRoster,
  NotFoundError,
} from "@/lib/effect/services/DrupalService";
import { FootbalistoService } from "@/lib/effect/services/FootbalistoService";
import type { Match, RankingEntry } from "@/lib/effect/schemas";
import { TeamDetail } from "@/components/team/TeamDetail";
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
 * @returns The team detail page element
 */
export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;

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

  return (
    <TeamDetail
      header={{
        name: team.attributes.title,
        imageUrl: teamImageUrl,
        ageGroup,
        teamType,
        tagline,
      }}
      contactInfo={team.attributes.field_contact_info?.processed ?? undefined}
      bodyContent={team.attributes.body?.processed ?? undefined}
      players={players.map(transformPlayerToRoster)}
      staff={staff.map(transformStaffToMember)}
      matches={footbalistoData?.matches.map(transformMatchToSchedule) ?? []}
      standings={
        footbalistoData?.standings.map(transformRankingToStandings) ?? []
      }
      highlightTeamId={footbalistoData?.teamId}
      teamSlug={slug}
    />
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
