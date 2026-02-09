/**
 * Search API Route
 * Handles search queries across multiple content types
 */

import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { Schema as S } from "effect";
import { DrupalService, DrupalServiceLive } from "@/lib/effect/services";
import { StaffResponse } from "@/lib/effect/schemas";

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
 * Search across staff members by name
 * Staff are stored as node--staff in Drupal (separate from players)
 *
 * NOTE: Currently disabled because staff detail pages don't exist yet.
 * Prefixed with _ to indicate intentionally unused until staff pages are implemented.
 */
const _searchStaff = (query: string, limit = 200) =>
  Effect.gen(function* () {
    const baseUrl = process.env.DRUPAL_API_URL || "https://api.kcvvelewijt.be";
    const url = `${baseUrl}/jsonapi/node/staff?page[limit]=${limit}`;

    console.log(`[Search API] Fetching staff from: ${url}`);

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        }),
      catch: (error) => new Error(`Failed to fetch staff: ${error}`),
    });

    if (!response.ok) {
      console.error(
        `[Search API] Staff fetch failed: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new Error("Failed to parse staff JSON"),
    });

    const staffResponse = yield* S.decodeUnknown(StaffResponse)(json).pipe(
      Effect.mapError(
        (error) => new Error(`Staff validation failed: ${error}`),
      ),
    );

    console.log(
      `[Search API] Total staff fetched: ${staffResponse.data.length}`,
    );

    const queryLower = query.toLowerCase();

    // Filter and transform staff to SearchResult format
    const results: SearchResult[] = [];
    for (const staff of staffResponse.data) {
      const firstName = staff.attributes.field_firstname || "";
      const lastName = staff.attributes.field_lastname || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase().trim();
      const title = staff.attributes.title.toLowerCase();

      // Search in name fields or title
      const nameMatch =
        fullName.includes(queryLower) || title.includes(queryLower);

      // Search in position fields
      const positionStaff = staff.attributes.field_position_staff || "";
      const positionShort = staff.attributes.field_position_short || "";
      const positionMatch =
        positionStaff.toLowerCase().includes(queryLower) ||
        positionShort.toLowerCase().includes(queryLower);

      if (nameMatch || positionMatch) {
        const displayName = `${firstName} ${lastName}`.trim() || title;

        // Get image URL if available
        const imageData = staff.relationships.field_image?.data;
        const imageUrl =
          imageData && "uri" in imageData ? imageData.uri.url : undefined;

        results.push({
          id: staff.id,
          type: "player", // Use "player" type for consistency in UI
          title: displayName,
          description: positionStaff || positionShort || "Staff",
          url: staff.attributes.path.alias,
          imageUrl,
        });

        console.log(
          `[Search API] Staff match: "${displayName}" (${staff.attributes.path.alias})`,
        );
      }
    }

    return results;
  });

/**
 * Search across players by name
 * Note: Players are stored as node--player in Drupal
 */
const searchPlayers = (query: string) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;

    // Fetch ALL players by paginating through all pages
    // Drupal API has a max limit per page (~50), so we need to fetch multiple pages
    const allPlayers = [];
    let page = 1;
    let hasMore = true;

    console.log(`[Search API] Fetching all players (paginated)...`);

    while (hasMore && page <= 20) {
      // Safety limit of 20 pages
      const { players, links } = yield* drupal.getPlayers({
        limit: 50,
        page,
      });

      console.log(
        `[Search API] Page ${page}: fetched ${players.length} players`,
      );

      allPlayers.push(...players);

      hasMore = !!links?.next;
      page++;
    }

    console.log(`\n[Search API] ========== PLAYER SEARCH ==========`);
    console.log(`[Search API] Query: "${query}"`);
    console.log(
      `[Search API] Total players fetched: ${allPlayers.length} (across ${page - 1} pages)`,
    );

    // Log first few and last few players to see the data structure
    if (allPlayers.length > 0) {
      console.log(`\n[Search API] First 3 players:`);
      allPlayers.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. "${p.attributes.title}"`);
        console.log(`     firstName: "${p.attributes.field_firstname}"`);
        console.log(`     lastName: "${p.attributes.field_lastname}"`);
        console.log(`     position: "${p.attributes.field_position}"`);
        console.log(
          `     position_short: "${p.attributes.field_position_short}"`,
        );
        console.log(`     shirt: ${p.attributes.field_shirtnumber}`);
      });

      console.log(`\n[Search API] Last 3 players:`);
      allPlayers.slice(-3).forEach((p, i) => {
        console.log(`  ${allPlayers.length - 2 + i}. "${p.attributes.title}"`);
        console.log(`     firstName: "${p.attributes.field_firstname}"`);
        console.log(`     lastName: "${p.attributes.field_lastname}"`);
        console.log(`     position: "${p.attributes.field_position}"`);
        console.log(
          `     position_short: "${p.attributes.field_position_short}"`,
        );
        console.log(`     shirt: ${p.attributes.field_shirtnumber}`);
      });
    }

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

    console.log(`\n[Search API] Matches found: ${filtered.length}`);
    if (filtered.length > 0) {
      console.log(`[Search API] Matched players:`);
      filtered.forEach((p) => {
        console.log(`  - "${p.attributes.title}" (${p.attributes.path.alias})`);
      });
    }
    console.log(`[Search API] ========================================\n`);

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
  const q = rawQuery?.trim();
  if (!q || q.length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  if (q.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 },
    );
  }

  // Normalize and validate type against whitelist
  const allowedTypes = ["article", "player", "team"];
  const t = rawType?.toLowerCase().trim();
  if (t && !allowedTypes.includes(t)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Use normalized values
  const query = q;
  const type = t;

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

        // TODO: Add staff search once staff detail pages are implemented
        // Staff pages don't exist yet, so we're excluding them from search
        // console.log("[Search API] Searching staff...");
        // const staff = yield* searchStaff(query);
        // console.log(`[Search API] Found ${staff.length} staff`);
        // results.push(...staff);
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
