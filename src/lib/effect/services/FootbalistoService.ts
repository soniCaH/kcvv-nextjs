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
  MatchesResponse,
  RankingEntry,
  RankingResponse,
  TeamStats,
  FootbalistoError,
  ValidationError,
} from "../schemas";

/**
 * Transform Footbalisto API match to normalized Match format
 */
function transformFootbalistoMatch(fbMatch: FootbalistoMatch): Match {
  // Parse date string "2025-12-06 09:00" to Date
  // Manual parsing for reliability across all JavaScript environments
  const [datePart, timePart = "00:00"] = fbMatch.date.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Construct Date object manually (month is 0-indexed)
  const matchDate = new Date(year, month - 1, day, hour, minute);

  // Map numeric status to string status
  const statusMap: Record<
    number,
    "scheduled" | "live" | "finished" | "postponed" | "cancelled"
  > = {
    0: "scheduled",
    1: "finished",
    2: "live",
    3: "postponed",
    4: "cancelled",
  };
  const status = statusMap[fbMatch.status] || "scheduled";

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
      id: fbMatch.homeClub.id,
      name: fbMatch.homeClub.name,
      logo: fbMatch.homeClub.logo ?? undefined,
      score: fbMatch.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: fbMatch.awayClub.id,
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
 * Transform lineup player status from Footbalisto format to normalized format
 *
 * Status mapping:
 * - "basis" (starter) + changed: false → "starter" (played full match)
 * - "basis" (starter) + changed: true → "substituted" (was subbed out)
 * - "invaller" (sub) + changed: true → "subbed_in" (came on as sub)
 * - "invaller" (sub) + changed: false → "substitute" (unused sub)
 * - "wissel" → "substituted" (legacy: player who was subbed out)
 */
function transformLineupStatus(
  status?: string,
  changed?: boolean,
): "starter" | "substitute" | "substituted" | "subbed_in" | "unknown" {
  if (status === "basis") {
    return changed ? "substituted" : "starter";
  }
  if (status === "invaller") {
    return changed ? "subbed_in" : "substitute";
  }
  if (status === "wissel") return "substituted";
  return "unknown";
}

/**
 * Transform lineup player from Footbalisto format to normalized format
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
 * Transform Footbalisto match detail response to normalized MatchDetail format
 */
function transformFootbalistoMatchDetail(
  response: FootbalistoMatchDetailResponse,
): MatchDetail {
  const general = response.general;

  // Parse date string "2025-12-06 09:00" to Date
  const [datePart, timePart = "00:00"] = general.date.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const matchDate = new Date(year, month - 1, day, hour, minute);

  // Map numeric status to string status
  const statusMap: Record<
    number,
    "scheduled" | "live" | "finished" | "postponed" | "cancelled"
  > = {
    0: "scheduled",
    1: "finished",
    2: "live",
    3: "postponed",
    4: "cancelled",
  };
  const status = statusMap[general.status] || "scheduled";

  // Transform lineup if available
  const lineup = response.lineup
    ? {
        home: response.lineup.home.map(transformLineupPlayer),
        away: response.lineup.away.map(transformLineupPlayer),
      }
    : undefined;

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
      leagueId: number,
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
     */
    const matchesCache = yield* Cache.make({
      capacity: 100,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/matches/${teamId}`;
          const response = yield* fetchJson(url, MatchesResponse);
          return response.matches;
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
     */
    const rankingCache = yield* Cache.make({
      capacity: 50,
      timeToLive: Duration.minutes(5),
      lookup: (leagueId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/ranking/${leagueId}`;
          const response = yield* fetchJson(url, RankingResponse);
          return response.ranking;
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
     */
    const getMatchById = (matchId: number) =>
      Effect.gen(function* () {
        const url = `${baseUrl}/match/${matchId}`;
        const response = yield* fetchJson(url, Match);
        return response;
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
    const getRanking = (leagueId: number) =>
      rankingCache.get(leagueId).pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: `Failed to fetch ranking for league ${leagueId}`,
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
