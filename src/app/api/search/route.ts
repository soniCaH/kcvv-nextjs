/**
 * Search API Route
 * Handles search queries across multiple content types
 */

import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { unstable_cache } from "next/cache";
import { DrupalService, DrupalServiceLive } from "@/lib/effect/services";
import type { SearchResult } from "@/types/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Debug logging helper - only logs in development or when DEBUG_SEARCH is enabled
 */
const debugLog = (...args: unknown[]) => {
  if (
    process.env.DEBUG_SEARCH === "true" ||
    process.env.NODE_ENV === "development"
  ) {
    console.log(...args);
  }
};

/**
 * Search across articles by title, tags, and body
 */
const searchArticles = (query: string) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;

    // Fetch ALL articles by paginating through all pages
    // Similar to searchPlayers, we need to paginate to avoid missing matches
    const allArticles = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 20) {
      // Safety limit of 20 pages
      const { articles, links } = yield* drupal.getArticles({
        limit: 50,
        page,
      });

      allArticles.push(...articles);
      hasMore = !!links?.next;
      page++;
    }

    debugLog(
      `[Search API] Total articles fetched: ${allArticles.length} (across ${page} pages)`,
    );

    const queryLower = query.toLowerCase();

    return allArticles
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

        // Also search in article body text
        const bodyText =
          article.attributes.body?.value ||
          article.attributes.body?.processed ||
          "";
        const bodyMatch = bodyText
          ? bodyText.toLowerCase().includes(queryLower)
          : false;

        return titleMatch || tagMatch || bodyMatch;
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
          // Strip ALL HTML tags uniformly using iterative sanitization
          // This approach is more robust than targeting specific tags like <script>
          // because it handles all variations, incomplete tags, and nested structures
          let sanitized = article.attributes.body.value;
          let previousLength = 0;

          // Repeat until no more tags are removed (handles incomplete/nested/malformed tags)
          while (sanitized.length !== previousLength) {
            previousLength = sanitized.length;
            sanitized = sanitized.replace(/<[^>]*>/g, "");
          }

          // Since output is plain text, no HTML preservation needed - universal stripping is safest
          description = sanitized.replace(/\s+/g, " ").trim().substring(0, 150);
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
 * Fetch all players with caching
 * Cached for 5 minutes since player data changes infrequently
 */
const getAllPlayers = unstable_cache(
  async () => {
    const fetchProgram = Effect.gen(function* () {
      const drupal = yield* DrupalService;

      // Fetch ALL players by paginating through all pages
      // Drupal API has a max limit per page (~50), so we need to fetch multiple pages
      const allPlayers = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 20) {
        // Safety limit of 20 pages
        const { players, links } = yield* drupal.getPlayers({
          limit: 50,
          page,
        });

        allPlayers.push(...players);

        hasMore = !!links?.next;
        page++;
      }

      debugLog(
        `[Search API] Fetched ${allPlayers.length} players (across ${page - 1} pages)`,
      );

      return allPlayers;
    });

    return await Effect.runPromise(
      fetchProgram.pipe(Effect.provide(DrupalServiceLive)),
    );
  },
  ["all-players"],
  {
    revalidate: 300, // 5 minutes
    tags: ["players"],
  },
);

/**
 * Search across players by name
 * Note: Players are stored as node--player in Drupal
 */
const searchPlayers = (query: string) =>
  Effect.gen(function* () {
    // Use cached player data to avoid repeated API calls
    const allPlayers = yield* Effect.promise(() => getAllPlayers());

    const queryLower = query.toLowerCase();

    const filtered = allPlayers.filter((player) => {
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

      return matches;
    });

    debugLog(`[Search API] Found ${filtered.length} player matches`);

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

      // Transform Drupal path from /player/slug to /players/slug (app uses plural)
      const slug =
        player.attributes.path.alias.replace("/player/", "") || player.id;
      const url = `/players/${slug}`;

      return {
        id: player.id,
        type: "player",
        title: fullName,
        description,
        url,
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
  const rawQuery = searchParams.get("q");
  const rawType = searchParams.get("type"); // Filter by content type

  // Normalize and validate query
  const query = rawQuery?.trim();
  if (!query || query.length === 0) {
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

  // Normalize and validate type against whitelist
  const allowedTypes = ["article", "player", "team"];
  const type = rawType?.toLowerCase().trim();
  if (type && !allowedTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    debugLog(`[Search API] Query: "${query}", Type: ${type || "all"}`);

    // Search across content types based on filter
    const searchProgram = Effect.gen(function* () {
      const results: SearchResult[] = [];

      // Search articles
      if (!type || type === "article") {
        debugLog("[Search API] Searching articles...");
        const articles = yield* searchArticles(query);
        debugLog(`[Search API] Found ${articles.length} articles`);
        results.push(...articles);
      }

      // Search players
      if (!type || type === "player") {
        debugLog("[Search API] Searching players...");
        const players = yield* searchPlayers(query);
        debugLog(`[Search API] Found ${players.length} players`);
        results.push(...players);

        // TODO: Add staff search once staff detail pages are implemented
        // Staff pages don't exist yet, so we're excluding them from search
        // console.log("[Search API] Searching staff...");
        // const staff = yield* searchStaff(query);
        // console.log(`[Search API] Found ${staff.length} staff`);
        // results.push(...staff);
      }

      // Search teams
      if (!type || type === "team") {
        debugLog("[Search API] Searching teams...");
        const teams = yield* searchTeams(query);
        debugLog(`[Search API] Found ${teams.length} teams`);
        results.push(...teams);
      }

      debugLog(`[Search API] Total results: ${results.length}`);
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

    debugLog(`[Search API] Returning ${sorted.length} sorted results`);

    return NextResponse.json({
      query,
      count: sorted.length,
      results: sorted,
    });
  } catch (error) {
    // Log full error server-side for debugging
    console.error("[Search API] Error:", error);
    // Return only generic error message to client (no internal details)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
