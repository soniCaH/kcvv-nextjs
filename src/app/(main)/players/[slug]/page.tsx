/**
 * Player Detail Page
 * Displays individual player profiles from Drupal
 */

import { Effect } from "effect";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { runPromise } from "@/lib/effect/runtime";
import { DrupalService } from "@/lib/effect/services/DrupalService";
import { PlayerProfile, PlayerShare } from "@/components/player";
import type { Team, Player } from "@/lib/effect/schemas";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Extract team name from player's resolved team relationship
 */
function getTeamName(player: Player): string {
  const teamData = player.relationships.field_team?.data;
  if (teamData && "attributes" in teamData) {
    return (teamData as Team).attributes.title;
  }
  return "KCVV Elewijt";
}

/**
 * Generate route parameters for player pages from Drupal players.
 *
 * Paginates through all players in the Drupal API and derives each route
 * `slug` by removing the "/player/" prefix from the player path alias.
 *
 * @returns An array of route parameter objects, each with a `slug` property
 */
export async function generateStaticParams() {
  try {
    const allPlayers: Player[] = [];
    const limit = 50;
    let page = 1;
    let hasMore = true;

    // Paginate through all players
    while (hasMore) {
      const { players, links } = await runPromise(
        Effect.gen(function* () {
          const drupal = yield* DrupalService;
          return yield* drupal.getPlayers({ limit, page });
        }),
      );

      allPlayers.push(...players);

      // Check if there are more pages
      hasMore = !!links?.next;
      page++;

      // Safety limit to prevent infinite loops
      if (page > 20) {
        console.warn("Reached maximum page limit (20) for player generation");
        break;
      }
    }

    console.log(`Generated static params for ${allPlayers.length} players`);

    return allPlayers.map((player) => ({
      slug: player.attributes.path.alias.replace("/player/", ""),
    }));
  } catch (error) {
    console.error("Failed to generate static params for players:", error);
    return [];
  }
}

/**
 * Build SEO and Open Graph metadata for the player identified by `params.slug`.
 *
 * Fetches the player by slug and returns a metadata object containing `title`,
 * optional `description`, and an `openGraph` block with `title`, `description`,
 * `type`, `firstName`, `lastName`, and optional `images`.
 *
 * @param params - A promise-resolved object containing the route `slug`
 * @returns A metadata object for the player
 */
export async function generateMetadata({
  params,
}: PlayerPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const player = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug(slug);
      }),
    );

    const firstName = player.attributes.field_first_name || "";
    const lastName = player.attributes.field_last_name || "";
    const fullName =
      `${firstName} ${lastName}`.trim() || player.attributes.title;
    const position = player.attributes.field_position || "";
    const teamName = getTeamName(player);

    const description = player.attributes.body?.summary
      ? player.attributes.body.summary
      : `${position} bij ${teamName}`;

    // Get image URL if available
    const imageData = player.relationships.field_image?.data;
    const hasImage = imageData && "uri" in imageData;
    const imageUrl = hasImage ? imageData.uri.url : undefined;

    return {
      title: `${fullName} | ${teamName} | KCVV Elewijt`,
      description,
      openGraph: {
        title: fullName,
        description,
        type: "profile",
        firstName,
        lastName,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: fullName,
              },
            ]
          : undefined,
      },
    };
  } catch {
    return {
      title: "Speler niet gevonden | KCVV Elewijt",
    };
  }
}

/**
 * Render the player detail page for the given slug.
 *
 * Triggers a 404 route if the player cannot be loaded.
 *
 * @param params - Promise resolving to an object with a `slug` string
 * @returns The player detail page element
 */
export default async function PlayerPage({ params }: PlayerPageProps) {
  const { slug } = await params;

  // Fetch player from Drupal
  const player = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService;
      return yield* drupal.getPlayerBySlug(slug);
    }),
  ).catch(() => {
    notFound();
  });

  // Extract player data
  const firstName = player.attributes.field_first_name || "";
  const lastName = player.attributes.field_last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || player.attributes.title;
  const position = player.attributes.field_position || "";
  const number = player.attributes.field_number;
  const biography = player.attributes.body?.processed;

  // Format birth date if available
  const birthDate = player.attributes.field_birth_date
    ? player.attributes.field_birth_date.toISOString().split("T")[0]
    : undefined;

  const teamName = getTeamName(player);

  // Get image URL if available
  const imageData = player.relationships.field_image?.data;
  const hasImage = imageData && "uri" in imageData;
  const imageUrl = hasImage ? imageData.uri.url : undefined;

  return (
    <>
      {/* Player Profile */}
      <PlayerProfile
        firstName={firstName}
        lastName={lastName}
        position={position}
        number={number}
        imageUrl={imageUrl}
        teamName={teamName}
        birthDate={birthDate}
        biography={biography}
      />

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <PlayerShare
          playerName={fullName}
          playerSlug={slug}
          teamName={teamName}
          showQR
        />
      </section>
    </>
  );
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600;
