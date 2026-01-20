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
import type { Player } from "@/lib/effect/schemas";
import { getTeamName } from "./utils";

interface PlayerPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generates route parameters for player pages by listing players from Drupal.
 *
 * Paginates the Drupal players endpoint, derives each `slug` by removing the "/player/" prefix from the player's path alias, and stops after at most 20 pages as a safety limit.
 *
 * @returns An array of route parameter objects, each with a `slug` property for a player
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
 * Create SEO and Open Graph metadata for the player identified by `params.slug`.
 *
 * Builds a metadata object containing a page `title`, a `description` derived
 * from the player's summary or position/team fallback, and an `openGraph` block
 * with profile fields and an optional image.
 *
 * @param params - An awaited route parameter object containing the `slug` of the player
 * @returns A Metadata object with `title`, `description`, and an `openGraph` section (including `title`, `description`, `type`, `firstName`, `lastName`, and `images` when available)
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

    const firstName = player.attributes.field_firstname || "";
    const lastName = player.attributes.field_lastname || "";
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
 * Retrieve a player by slug and trigger a 404 response if the player cannot be found.
 *
 * Calls the framework's notFound behavior on failure, causing the route to render a 404.
 *
 * @returns The requested `Player` object
 */
async function fetchPlayerOrNotFound(slug: string): Promise<Player> {
  try {
    return await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService;
        return yield* drupal.getPlayerBySlug(slug);
      }),
    );
  } catch {
    notFound();
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

  // Fetch player from Drupal (notFound() throws if not found)
  const player = await fetchPlayerOrNotFound(slug);

  // Extract player data
  const firstName = player.attributes.field_firstname || "";
  const lastName = player.attributes.field_lastname || "";
  const fullName = `${firstName} ${lastName}`.trim() || player.attributes.title;
  const position = player.attributes.field_position || "";
  const number = player.attributes.field_shirtnumber ?? undefined;
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