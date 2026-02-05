/**
 * Search API Route
 * Handles search queries across multiple content types
 */

import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { DrupalService, DrupalServiceLive } from "@/lib/effect/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Search result type
 */
interface SearchResult {
  id: string;
  type: "article" | "player" | "team";
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
  date?: string;
}

/**
 * Search across articles by title and tags
 */
const searchArticles = (query: string, limit = 50) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;
    const { articles } = yield* drupal.getArticles({ limit });

    const queryLower = query.toLowerCase();

    return articles
      .filter((article) => {
        const titleMatch = article.attributes.title
          .toLowerCase()
          .includes(queryLower);
        const tagMatch =
          article.relationships.field_tags?.data?.some((tag) => {
            if ("attributes" in tag && tag.attributes?.name) {
              return tag.attributes.name.toLowerCase().includes(queryLower);
            }
            return false;
          }) || false;
        return titleMatch || tagMatch;
      })
      .map((article): SearchResult => {
        const imageData = article.relationships.field_media_article_image?.data;
        const imageUrl =
          imageData && "uri" in imageData ? imageData.uri.url : undefined;

        const tags =
          article.relationships.field_tags?.data
            ?.map((tag) =>
              "attributes" in tag && tag.attributes?.name
                ? tag.attributes.name
                : null,
            )
            .filter((tag): tag is string => tag !== null) || [];

        // Use summary if available, otherwise strip HTML from body
        let description: string | undefined;
        if (article.attributes.body?.summary) {
          description = article.attributes.body.summary.substring(0, 150);
        } else if (article.attributes.body?.value) {
          // Strip HTML tags and get first 150 chars
          description = article.attributes.body.value
            .replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 150);
        }

        return {
          id: article.id,
          type: "article",
          title: article.attributes.title,
          description,
          url: article.attributes.path.alias,
          imageUrl,
          tags,
          date: article.attributes.created.toISOString(),
        };
      });
  });

/**
 * Search across players and staff by name
 * Note: Staff members are stored as node--player in Drupal
 */
const searchPlayers = (query: string, limit = 500) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;
    // Fetch more players to include staff members (who are also stored as players)
    // Staff typically don't have shirt numbers so they appear at the end when sorted
    const { players } = yield* drupal.getPlayers({ limit });

    console.log(`[Search API] Total players fetched: ${players.length}`);
    if (players.length > 0) {
      console.log(`[Search API] Sample player: ${players[0].attributes.title}`);
      console.log(
        `[Search API] First name: "${players[0].attributes.field_firstname}"`,
      );
      console.log(
        `[Search API] Last name: "${players[0].attributes.field_lastname}"`,
      );
    }

    const queryLower = query.toLowerCase();

    const filtered = players.filter((player) => {
      const firstName = player.attributes.field_firstname || "";
      const lastName = player.attributes.field_lastname || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase().trim();
      const title = player.attributes.title.toLowerCase();

      // Search in name fields or title
      const nameMatch =
        fullName.includes(queryLower) || title.includes(queryLower);

      // Search in position (for players) and position_short (for staff like T1, T2)
      const position = player.attributes.field_position || "";
      const positionShort = player.attributes.field_position_short || "";
      const positionMatch =
        position.toLowerCase().includes(queryLower) ||
        positionShort.toLowerCase().includes(queryLower);

      const matches = nameMatch || positionMatch;

      if (matches) {
        console.log(
          `[Search API] Player match: "${title}" (firstName: "${firstName}", lastName: "${lastName}", position: "${position}", positionShort: "${positionShort}")`,
        );
      }

      return matches;
    });

    console.log(`[Search API] Filtered players: ${filtered.length}`);

    return filtered.map((player): SearchResult => {
      const firstName = player.attributes.field_firstname || "";
      const lastName = player.attributes.field_lastname || "";
      const fullName =
        `${firstName} ${lastName}`.trim() || player.attributes.title;

      const imageData = player.relationships.field_image?.data;
      const imageUrl =
        imageData && "uri" in imageData ? imageData.uri.url : undefined;

      // Use field_position for players, field_position_short for staff (e.g., T1, T2)
      const description =
        player.attributes.field_position ||
        player.attributes.field_position_short ||
        undefined;

      return {
        id: player.id,
        type: "player",
        title: fullName,
        description,
        url: player.attributes.path.alias,
        imageUrl,
      };
    });
  });

/**
 * Search across teams by name
 */
const searchTeams = (query: string) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;
    const teams = yield* drupal.getTeams();

    const queryLower = query.toLowerCase();

    return teams
      .filter((team) => {
        const nameMatch = team.attributes.title
          .toLowerCase()
          .includes(queryLower);
        return nameMatch;
      })
      .map((team): SearchResult => {
        const imageData = team.relationships.field_image?.data;
        const imageUrl =
          imageData && "uri" in imageData ? imageData.uri.url : undefined;

        return {
          id: team.id,
          type: "team",
          title: team.attributes.title,
          description: undefined,
          url: team.attributes.path.alias,
          imageUrl,
        };
      });
  });

/**
 * GET /api/search
 * Search across all content types
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const type = searchParams.get("type"); // Filter by content type

  // Validate query
  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 },
    );
  }

  try {
    console.log(`[Search API] Query: "${query}", Type: ${type || "all"}`);

    // Search across content types based on filter
    const searchProgram = Effect.gen(function* () {
      const results: SearchResult[] = [];

      // Search articles
      if (!type || type === "article") {
        console.log("[Search API] Searching articles...");
        const articles = yield* searchArticles(query);
        console.log(`[Search API] Found ${articles.length} articles`);
        results.push(...articles);
      }

      // Search players
      if (!type || type === "player") {
        console.log("[Search API] Searching players...");
        const players = yield* searchPlayers(query);
        console.log(`[Search API] Found ${players.length} players`);
        results.push(...players);
      }

      // Search teams
      if (!type || type === "team") {
        console.log("[Search API] Searching teams...");
        const teams = yield* searchTeams(query);
        console.log(`[Search API] Found ${teams.length} teams`);
        results.push(...teams);
      }

      console.log(`[Search API] Total results: ${results.length}`);
      return results;
    });

    // Execute the program
    const results = await Effect.runPromise(
      searchProgram.pipe(Effect.provide(DrupalServiceLive)),
    );

    // Sort by relevance (simple: prioritize title matches)
    const sorted = results.sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();

      // Exact match first
      if (aTitle === queryLower && bTitle !== queryLower) return -1;
      if (bTitle === queryLower && aTitle !== queryLower) return 1;

      // Starts with query
      if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower))
        return -1;
      if (bTitle.startsWith(queryLower) && !aTitle.startsWith(queryLower))
        return 1;

      // Alphabetical
      return aTitle.localeCompare(bTitle);
    });

    console.log(`[Search API] Returning ${sorted.length} sorted results`);

    return NextResponse.json({
      query,
      count: sorted.length,
      results: sorted,
    });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
