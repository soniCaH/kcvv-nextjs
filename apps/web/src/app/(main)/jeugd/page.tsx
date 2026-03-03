/**
 * Youth Teams Overview Page
 * Displays all youth teams in a grid layout grouped by age category
 */

import { Effect } from "effect";
import type { Metadata } from "next";
import { runPromise } from "@/lib/effect/runtime";
import { DrupalService } from "@/lib/effect/services/DrupalService";
import { TeamOverview, type TeamData } from "@/components/team/TeamOverview";
import type { Team } from "@/lib/effect/schemas";
import { parseAgeGroup } from "@/app/(main)/team/[slug]/utils";

export const metadata: Metadata = {
  title: "Jeugdploegen | KCVV Elewijt",
  description:
    "Ontdek alle jeugdploegen van KCVV Elewijt. Van U6 tot U21, onze jeugdopleiding begeleidt jonge talenten naar hun volle potentieel.",
  openGraph: {
    title: "Jeugdploegen | KCVV Elewijt",
    description:
      "Ontdek alle jeugdploegen van KCVV Elewijt. Van U6 tot U21, onze jeugdopleiding begeleidt jonge talenten naar hun volle potentieel.",
    type: "website",
  },
};

/**
 * Transform Drupal Team to TeamData for TeamOverview component
 */
function transformTeamToData(team: Team): TeamData | null {
  const ageGroup = parseAgeGroup(team);

  // Only include youth teams (those with age groups)
  if (!ageGroup) return null;

  // Extract final path segment from alias (e.g., "/team/u15a" -> "u15a")
  const pathAlias = team.attributes.path?.alias || "";
  const slug = pathAlias.split("/").filter(Boolean).pop() || team.id;

  // Log the generated slug (server-side). Useful to verify links from Drupal.
  console.info(
    `[jeugd] Overview link -> /team/${slug} (alias: ${pathAlias || team.id})`,
  );

  return {
    id: team.id,
    name: team.attributes.title,
    href: `/team/${slug}`,
    ageGroup,
    teamType: "youth",
    tagline:
      team.attributes.field_division_full ||
      team.attributes.field_tagline ||
      undefined,
  };
}

/**
 * Fetch all youth teams from Drupal
 */
async function fetchYouthTeams(): Promise<TeamData[]> {
  try {
    const teams = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getTeams();
      }),
    );

    // Transform and filter to only youth teams
    const youthTeams = teams
      .map(transformTeamToData)
      .filter((team): team is TeamData => team !== null);

    return youthTeams;
  } catch (error) {
    console.error("Failed to fetch youth teams:", error);
    return [];
  }
}

/**
 * Render the youth teams overview page
 */
export default async function JeugdPage() {
  const teams = await fetchYouthTeams();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-title">
          Jeugdploegen
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          KCVV Elewijt investeert volop in de jeugdopleiding. Onze gediplomeerde
          trainers begeleiden jonge voetballers van U6 tot U21 met aandacht voor
          plezier, techniek en teamspirit.
        </p>
      </header>

      {/* Teams Grid */}
      <TeamOverview
        teams={teams}
        teamType="youth"
        groupByAge={true}
        variant="grid"
        emptyMessage="Er zijn momenteel geen jeugdploegen beschikbaar."
      />
    </div>
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
