/**
 * Footbalisto API Service
 * Effect-based service for fetching match data and statistics
 */

import { Context, Effect, Layer, Schedule, Cache, Duration } from "effect";
import { Schema as S } from "effect";
import {
  Match,
  MatchDetail,
  MatchLineupPlayer,
  FootbalistoMatch,
  FootbalistoMatchesArray,
  FootbalistoMatchDetailResponse,
  FootbalistoLineupPlayer,
  FootbalistoMatchEvent,
  CardType,
  RankingEntry,
  FootbalistoRankingArray,
  FootbalistoRankingEntry,
  TeamStats,
  FootbalistoError,
  ValidationError,
} from "../schemas";

// =============================================================================
// Shared Helpers
// =============================================================================

/** Match status type */
type MatchStatusType =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

/** Numeric status to string status mapping */
const STATUS_MAP: Record<number, MatchStatusType> = {
  0: "scheduled",
  1: "finished",
  2: "live",
  3: "postponed",
  4: "cancelled",
};

/**
 * Convert a Footbalisto datetime string into a Date object and the original time string.
 *
 * @param dateStr - Datetime in the format "YYYY-MM-DD HH:MM" or "YYYY-MM-DD" (time defaults to "00:00")
 * @returns An object with `date` set to the parsed Date and `time` set to the "HH:MM" portion of the input
 */
function parseDateString(dateStr: string): { date: Date; time: string } {
  const [datePart, timePart = "00:00"] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return {
    date: new Date(year, month - 1, day, hour, minute),
    time: timePart,
  };
}

/**
 * Convert a numeric Footbalisto status code to a human-readable match status.
 *
 * @param status - Numeric status code from the Footbalisto API
 * @returns The mapped `MatchStatusType`; `scheduled` if the code is not recognized
 */
function mapNumericStatus(status: number): MatchStatusType {
  return STATUS_MAP[status] || "scheduled";
}

// =============================================================================
// Transform Functions
// =============================================================================

/**
 * Convert a Footbalisto API match object into the library's normalized Match structure.
 *
 * @param fbMatch - Match object returned by the Footbalisto API
 * @returns The normalized Match with parsed `date` and `time`, mapped `status`, `home_team` and `away_team` (including optional `logo` and `score`), `round` label when available, and `competition`
 */
function transformFootbalistoMatch(fbMatch: FootbalistoMatch): Match {
  const { date: matchDate, time: timePart } = parseDateString(fbMatch.date);
  const status = mapNumericStatus(fbMatch.status);

  // Determine round label based on teamId and age
  let roundLabel: string | undefined = fbMatch.age
    ? `${fbMatch.age}`
    : undefined;

  // For senior teams (teamId 1 = A-ploeg, teamId 2 = B-ploeg), use team-based label
  if (fbMatch.teamId === 1) {
    roundLabel = "A-ploeg";
  } else if (fbMatch.teamId === 2) {
    roundLabel = "B-ploeg";
  }

  return {
    id: fbMatch.id,
    date: matchDate,
    time: timePart,
    venue: undefined, // Not provided by API
    home_team: {
      // Use VV team ID (homeTeamId) for matching with teamId prop, fall back to club ID
      id: fbMatch.homeTeamId ?? fbMatch.homeClub.id,
      name: fbMatch.homeClub.name,
      logo: fbMatch.homeClub.logo ?? undefined,
      score: fbMatch.goalsHomeTeam ?? undefined,
    },
    away_team: {
      // Use VV team ID (awayTeamId) for matching with teamId prop, fall back to club ID
      id: fbMatch.awayTeamId ?? fbMatch.awayClub.id,
      name: fbMatch.awayClub.name,
      logo: fbMatch.awayClub.logo ?? undefined,
      score: fbMatch.goalsAwayTeam ?? undefined,
    },
    status,
    round: roundLabel,
    competition: fbMatch.competitionType,
  };
}

/**
 * Normalize a Footbalisto lineup status into one of the canonical status labels.
 *
 * @param status - Original Footbalisto status value (for example `"basis"`, `"invaller"`, `"bank"`, or `"wissel"`).
 * @param changed - Whether the player's status indicates a change (e.g., was substituted).
 * @returns `starter` if started and not substituted, `substituted` if started and later taken off or legacy `"wissel"`, `subbed_in` if entered as a substitute, `substitute` if listed as a substitute but did not play, `unknown` if the input is unrecognized.
 */
function transformLineupStatus(
  status?: string,
  changed?: boolean,
): "starter" | "substitute" | "substituted" | "subbed_in" | "unknown" {
  if (status === "basis") {
    return changed ? "substituted" : "starter";
  }
  // "invaller" and "bank" both indicate bench/substitute players
  if (status === "invaller" || status === "bank") {
    return changed ? "subbed_in" : "substitute";
  }
  if (status === "wissel") return "substituted";
  return "unknown";
}

/**
 * Normalize a Footbalisto lineup player into the internal MatchLineupPlayer representation.
 *
 * @param player - Footbalisto lineup player to convert
 * @returns The normalized lineup player with mapped id, name, number, minutesPlayed, captain flag, and computed status
 */
function transformLineupPlayer(
  player: FootbalistoLineupPlayer,
): MatchLineupPlayer {
  return {
    id: player.playerId ?? undefined,
    name: player.playerName,
    number: player.number ?? undefined,
    minutesPlayed: player.minutesPlayed ?? undefined,
    isCaptain: player.captain ?? false,
    status: transformLineupStatus(player.status, player.changed),
  };
}

/**
 * Parse card type from a Footbalisto match event.
 *
 * Uses the action object's type and subtype fields.
 * Supports both structured format (type: "CARD", subtype: "YELLOW") and
 * legacy Dutch values (subtype: "geel", "rood", "tweedegeel").
 *
 * @param event - The Footbalisto match event to parse
 * @returns The card type if this is a card event, undefined otherwise
 */
function parseCardType(event: FootbalistoMatchEvent): CardType | undefined {
  const type = event.action.type.toUpperCase();
  const subtype = event.action.subtype?.toLowerCase();

  // Only process CARD type events
  if (type !== "CARD") {
    return undefined;
  }

  // Map subtype to card type (supports both structured and legacy Dutch values)
  switch (subtype) {
    case "yellow":
    case "geel":
      return "yellow";
    case "red":
    case "rood":
      return "red";
    case "double_yellow":
    case "yellowred":
    case "tweedegeel":
    case "tweede_geel":
      return "double_yellow";
    default:
      return undefined;
  }
}

/**
 * Build a map of player IDs to their card types from match events.
 *
 * @param events - Array of match events from the API
 * @returns Map where key is playerId and value is the card type
 */
function buildPlayerCardMap(
  events: readonly FootbalistoMatchEvent[],
): Map<number, CardType> {
  const cardMap = new Map<number, CardType>();

  for (const event of events) {
    const cardType = parseCardType(event);
    const playerId = event.playerId;

    if (cardType && playerId) {
      // If player already has a yellow and gets another, it becomes double_yellow
      const existingCard = cardMap.get(playerId);
      if (existingCard === "yellow" && cardType === "yellow") {
        cardMap.set(playerId, "double_yellow");
      } else if (cardType === "red" || cardType === "double_yellow") {
        // Red or double_yellow always takes precedence
        cardMap.set(playerId, cardType);
      } else if (!existingCard) {
        cardMap.set(playerId, cardType);
      }
    }
  }

  return cardMap;
}

/**
 * Transform a player and add card info from the card map.
 */
function transformPlayerWithCard(
  player: FootbalistoLineupPlayer,
  cardMap: Map<number, CardType> | null,
): MatchLineupPlayer {
  const basePlayer = transformLineupPlayer(player);
  const card =
    cardMap && basePlayer.id ? cardMap.get(basePlayer.id) : undefined;
  return card ? { ...basePlayer, card } : basePlayer;
}

/**
 * Normalize a Footbalisto match detail response into the internal MatchDetail shape.
 *
 * @param response - The Footbalisto API match detail response to convert
 * @returns The normalized MatchDetail containing match id, date, time, teams (with optional scores and logos), status, competition, optional lineup, and `hasReport`
 */
function transformFootbalistoMatchDetail(
  response: FootbalistoMatchDetailResponse,
): MatchDetail {
  const general = response.general;
  const { date: matchDate, time: timePart } = parseDateString(general.date);
  const status = mapNumericStatus(general.status);

  // Build card map from events
  const cardMap = response.events ? buildPlayerCardMap(response.events) : null;

  // Transform lineup if available, adding card info from events
  // Merge starters (lineup) with substitutes (substitutes)
  let lineup:
    | { home: MatchLineupPlayer[]; away: MatchLineupPlayer[] }
    | undefined;

  if (response.lineup || response.substitutes) {
    const homeStarters = response.lineup?.home ?? [];
    const awayStarters = response.lineup?.away ?? [];
    const homeSubs = response.substitutes?.home ?? [];
    const awaySubs = response.substitutes?.away ?? [];

    lineup = {
      home: [
        ...homeStarters.map((p) => transformPlayerWithCard(p, cardMap)),
        ...homeSubs.map((p) => transformPlayerWithCard(p, cardMap)),
      ],
      away: [
        ...awayStarters.map((p) => transformPlayerWithCard(p, cardMap)),
        ...awaySubs.map((p) => transformPlayerWithCard(p, cardMap)),
      ],
    };
  }

  return {
    id: general.id,
    date: matchDate,
    time: timePart,
    venue: undefined, // Not provided by API
    home_team: {
      id: general.homeClub.id,
      name: general.homeClub.name,
      logo: general.homeClub.logo ?? undefined,
      score: general.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: general.awayClub.id,
      name: general.awayClub.name,
      logo: general.awayClub.logo ?? undefined,
      score: general.goalsAwayTeam ?? undefined,
    },
    status,
    competition: general.competitionType,
    lineup,
    hasReport: general.viewGameReport,
  };
}

/**
 * Create a Match object from a MatchDetail by removing lineup information.
 *
 * @param detail - The detailed match object to convert
 * @returns A Match containing id, date, time, venue, teams, status, round, and competition (lineup removed)
 */
function convertDetailToMatch(detail: MatchDetail): Match {
  return {
    id: detail.id,
    date: detail.date,
    time: detail.time,
    venue: detail.venue,
    home_team: detail.home_team,
    away_team: detail.away_team,
    status: detail.status,
    round: detail.round,
    competition: detail.competition,
  };
}

/** Footbalisto CDN base URL for team logos (configurable via env) */
const FOOTBALISTO_LOGO_CDN =
  process.env.FOOTBALISTO_LOGO_CDN_URL ||
  "https://dfaozfi7c7f3s.cloudfront.net/logos";

/**
 * Construct a team logo URL from a club ID
 *
 * @param clubId - The club ID from Footbalisto API
 * @returns Full URL to the team logo
 */
function getTeamLogoUrl(clubId: number): string {
  return `${FOOTBALISTO_LOGO_CDN}/extra_groot/${clubId}.png`;
}

/**
 * Transform a raw Footbalisto ranking entry to normalized RankingEntry format.
 *
 * @param entry - Raw ranking entry from Footbalisto API
 * @returns Normalized RankingEntry for UI consumption
 */
function transformFootbalistoRankingEntry(
  entry: FootbalistoRankingEntry,
): RankingEntry {
  const teamName =
    entry.team.club.localName || entry.team.club.name || "Unknown Team";

  return {
    position: entry.rank,
    team_id: entry.team.id, // Use team.id, not club.id, to preserve unique team identity
    team_name: teamName,
    team_logo: getTeamLogoUrl(entry.team.club.id),
    played: entry.matchesPlayed,
    won: entry.wins,
    drawn: entry.draws,
    lost: entry.losses,
    goals_for: entry.goalsScored,
    goals_against: entry.goalsConceded,
    goal_difference: entry.goalsScored - entry.goalsConceded,
    points: entry.points,
    form: undefined, // Form not provided in ranking API - would need to calculate from recent matches
  };
}

/**
 * Footbalisto Service Interface
 */
export class FootbalistoService extends Context.Tag("FootbalistoService")<
  FootbalistoService,
  {
    readonly getMatches: (
      teamId: number,
    ) => Effect.Effect<readonly Match[], FootbalistoError | ValidationError>;

    readonly getNextMatches: () => Effect.Effect<
      readonly Match[],
      FootbalistoError | ValidationError
    >;

    readonly getMatchById: (
      matchId: number,
    ) => Effect.Effect<Match, FootbalistoError | ValidationError>;

    readonly getRanking: (
      teamId: number,
    ) => Effect.Effect<
      readonly RankingEntry[],
      FootbalistoError | ValidationError
    >;

    readonly getTeamStats: (
      teamId: number,
    ) => Effect.Effect<TeamStats, FootbalistoError | ValidationError>;

    readonly getMatchDetail: (
      matchId: number,
    ) => Effect.Effect<MatchDetail, FootbalistoError | ValidationError>;

    readonly clearCache: () => Effect.Effect<void>;
  }
>() {}

/**
 * Footbalisto Service Implementation
 * Includes caching layer for performance
 */
export const FootbalistoServiceLive = Layer.effect(
  FootbalistoService,
  Effect.gen(function* () {
    const baseUrl = process.env.FOOTBALISTO_API_URL || "https://footbalisto.be";

    /**
     * Fetch JSON with retry and timeout
     */
    const fetchJson = <A, I>(url: string, schema: S.Schema<A, I>) =>
      Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetch(url, {
              headers: {
                Accept: "application/json",
              },
            }),
          catch: (error) =>
            new FootbalistoError({
              message: `Failed to fetch from ${url}`,
              cause: error,
            }),
        });

        if (!response.ok) {
          return yield* Effect.fail(
            new FootbalistoError({
              message: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            }),
          );
        }

        const json = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: (error) =>
            new FootbalistoError({
              message: "Failed to parse JSON response",
              cause: error,
            }),
        });

        const decoded = yield* S.decodeUnknown(schema)(json).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError({
                message: "Schema validation failed",
                errors: error,
              }),
          ),
        );

        return decoded;
      }).pipe(
        Effect.retry(
          Schedule.exponential("1 second").pipe(
            Schedule.intersect(Schedule.recurs(3)),
          ),
        ),
        Effect.timeout("30 seconds"),
        Effect.mapError((error) => {
          if (error._tag === "TimeoutException") {
            return new FootbalistoError({
              message: "Request timed out after 30 seconds",
              cause: error,
            });
          }
          return error;
        }),
      );

    /**
     * Create cache for matches (5 minute TTL)
     * The API returns a raw array of FootbalistoMatch objects, not wrapped in { matches: [...] }
     */
    const matchesCache = yield* Cache.make({
      capacity: 100,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/matches/${teamId}`;
          // API returns raw array of FootbalistoMatch
          const rawMatches = yield* fetchJson(url, FootbalistoMatchesArray);
          // Transform to normalized Match format
          return rawMatches.map(transformFootbalistoMatch);
        }),
    });

    /**
     * Create cache for next matches (1 minute TTL for freshness)
     */
    const nextMatchesCache = yield* Cache.make({
      capacity: 1,
      timeToLive: Duration.minutes(1),
      lookup: (_: "next") =>
        Effect.gen(function* () {
          const url = `${baseUrl}/matches/next`;
          // Fetch raw Footbalisto matches array
          const rawMatches = yield* fetchJson(url, FootbalistoMatchesArray);
          // Filter out Weitse Gans (teamId 23 - not our club, but plays on our pitch)
          const filteredMatches = rawMatches.filter(
            (match) => match.teamId !== 23,
          );
          // Transform to normalized Match format
          return filteredMatches.map(transformFootbalistoMatch);
        }),
    });

    /**
     * Create cache for rankings (5 minute TTL)
     * The API returns an array of competitions, each with teams.
     * We find the first competition with teams (preferring league over cup/friendly).
     */
    const rankingCache = yield* Cache.make({
      capacity: 50,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/ranking/${teamId}`;
          const competitions = yield* fetchJson(url, FootbalistoRankingArray);

          // Find the first competition with teams, preferring league competitions
          // Priority: 1) Non-CUP/FRIENDLY with teams, 2) Any with teams
          const competitionWithTeams =
            competitions.find(
              (c) =>
                c.teams.length > 0 && c.type !== "CUP" && c.type !== "FRIENDLY",
            ) || competitions.find((c) => c.teams.length > 0);

          if (
            !competitionWithTeams ||
            competitionWithTeams.teams.length === 0
          ) {
            return [] as readonly RankingEntry[];
          }

          // Transform to normalized RankingEntry format
          return competitionWithTeams.teams.map(
            transformFootbalistoRankingEntry,
          );
        }),
    });

    /**
     * Create cache for team stats (5 minute TTL)
     */
    const teamStatsCache = yield* Cache.make({
      capacity: 50,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/stats/team/${teamId}`;
          const response = yield* fetchJson(url, TeamStats);
          return response;
        }),
    });

    /**
     * Get matches for a team (cached)
     */
    const getMatches = (teamId: number) =>
      matchesCache.get(teamId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: `Failed to fetch matches for team ${teamId}`,
              cause: error,
            }),
          ),
        ),
      );

    /**
     * Get next/upcoming matches (cached)
     */
    const getNextMatches = () =>
      nextMatchesCache.get("next").pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: "Failed to fetch next matches",
              cause: error,
            }),
          ),
        ),
      );

    /**
     * Get single match by ID (not cached - for live updates)
     * Uses the same endpoint as getMatchDetail but returns only basic match info
     */
    const getMatchById = (matchId: number) =>
      Effect.gen(function* () {
        const url = `${baseUrl}/match/${matchId}`;
        const response = yield* fetchJson(url, FootbalistoMatchDetailResponse);
        const detail = transformFootbalistoMatchDetail(response);
        return convertDetailToMatch(detail);
      });

    /**
     * Get detailed match info including lineup (not cached - for live updates)
     */
    const getMatchDetail = (matchId: number) =>
      Effect.gen(function* () {
        const url = `${baseUrl}/match/${matchId}`;
        const response = yield* fetchJson(url, FootbalistoMatchDetailResponse);
        return transformFootbalistoMatchDetail(response);
      });

    /**
     * Get league ranking (cached)
     */
    const getRanking = (teamId: number) =>
      rankingCache.get(teamId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: `Failed to fetch ranking for team ${teamId}`,
              cause: error,
            }),
          ),
        ),
      );

    /**
     * Get team statistics (cached)
     */
    const getTeamStats = (teamId: number) =>
      teamStatsCache.get(teamId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: `Failed to fetch stats for team ${teamId}`,
              cause: error,
            }),
          ),
        ),
      );

    /**
     * Clear all caches (useful for testing or forced refresh)
     */
    const clearCache = () =>
      Effect.gen(function* () {
        yield* matchesCache.invalidateAll;
        yield* nextMatchesCache.invalidateAll;
        yield* rankingCache.invalidateAll;
        yield* teamStatsCache.invalidateAll;
      });

    return {
      getMatches,
      getNextMatches,
      getMatchById,
      getMatchDetail,
      getRanking,
      getTeamStats,
      clearCache,
    };
  }),
);
