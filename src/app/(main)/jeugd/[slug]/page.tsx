/**
 * Team Detail Page
 * Displays individual team pages for youth teams
 */

import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import * as Tabs from "@radix-ui/react-tabs";
import { runPromise } from "@/lib/effect/runtime";
import {
  DrupalService,
  type TeamWithRoster,
} from "@/lib/effect/services/DrupalService";
import { TeamHeader } from "@/components/team/TeamHeader";
import { TeamRoster } from "@/components/team/TeamRoster";
import {
  parseAgeGroup,
  transformPlayerToRoster,
  transformStaffToMember,
  getTeamType,
  getTeamTagline,
} from "./utils";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generates route parameters for youth team pages by listing all teams from Drupal.
 *
 * Filters teams with path aliases starting with /team/u (youth teams).
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

    // Filter youth teams (path starts with /team/u)
    const youthTeams = teams.filter((team) => {
      const alias = team.attributes.path?.alias || "";
      return alias.match(/^\/team\/u\d/i);
    });

    console.log(`Generated static params for ${youthTeams.length} youth teams`);

    return youthTeams.map((team) => ({
      slug: team.attributes.path.alias.replace("/team/", ""),
    }));
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

    const description = tagline
      ? `${title} - ${tagline}`
      : `${title} - KCVV Elewijt jeugdploeg`;

    return {
      title: `${title} | Jeugd | KCVV Elewijt`,
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
 */
async function fetchTeamOrNotFound(slug: string): Promise<TeamWithRoster> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeamWithRoster(slug);
      }),
    );
  } catch {
    notFound();
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

  // Fetch team with roster from Drupal
  const { team, staff, players, teamImageUrl } =
    await fetchTeamOrNotFound(slug);

  // Transform data for display
  const ageGroup = parseAgeGroup(team);
  const teamType = getTeamType(team);
  const tagline = getTeamTagline(team);

  // Transform players and staff for TeamRoster component
  const rosterPlayers = players.map(transformPlayerToRoster);
  const staffMembers = staff.map(transformStaffToMember);

  // Determine if we have content for different tabs
  const hasPlayers = rosterPlayers.length > 0;
  const hasStaff = staffMembers.length > 0;
  const hasContactInfo = !!team.attributes.field_contact_info?.processed;

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

      {/* Tab Navigation */}
      <Tabs.Root defaultValue="info" className="container mx-auto px-4 py-8">
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
      </Tabs.Root>
    </>
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
