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
 * Search across staff members by name
 * Staff are stored as node--staff in Drupal (separate from players)
 */
const searchStaff = (query: string, limit = 200) =>
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
const searchPlayers = (query: string, limit = 500) =>
  Effect.gen(function* () {
    const drupal = yield* DrupalService;
    // Fetch more players to include staff members (who are also stored as players)
    // Staff typically don't have shirt numbers so they appear at the end when sorted
    console.log(`[Search API] Requesting ${limit} players from Drupal...`);
    const { players, links } = yield* drupal.getPlayers({ limit });

    console.log(`\n[Search API] ========== PLAYER SEARCH ==========`);
    console.log(`[Search API] Query: "${query}"`);
    console.log(`[Search API] Total players fetched: ${players.length}`);
    console.log(`[Search API] Has next page: ${!!links?.next}`);

    // Log first few and last few players to see the data structure
    if (players.length > 0) {
      console.log(`\n[Search API] First 3 players:`);
      players.slice(0, 3).forEach((p, i) => {
        console.log(`  ${i + 1}. "${p.attributes.title}"`);
        console.log(`     firstName: "${p.attributes.field_firstname}"`);
        console.log(`     lastName: "${p.attributes.field_lastname}"`);
        console.log(`     position: "${p.attributes.field_position}"`);
        console.log(
          `     position_short: "${p.attributes.field_position_short}"`,
        );
        console.log(`     shirt: ${p.attributes.field_shirtnumber}`);
      });

      console.log(`\n[Search API] Last 3 players (likely staff):`);
      players.slice(-3).forEach((p, i) => {
        console.log(`  ${players.length - 2 + i}. "${p.attributes.title}"`);
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

      // Search players and staff
      if (!type || type === "player") {
        console.log("[Search API] Searching players...");
        const players = yield* searchPlayers(query);
        console.log(`[Search API] Found ${players.length} players`);
        results.push(...players);

        console.log("[Search API] Searching staff...");
        const staff = yield* searchStaff(query);
        console.log(`[Search API] Found ${staff.length} staff`);
        results.push(...staff);
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
