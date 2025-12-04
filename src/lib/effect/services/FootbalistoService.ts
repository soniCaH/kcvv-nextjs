/**
 * Footbalisto API Service
 * Effect-based service for fetching match data and statistics
 */

import { Context, Effect, Layer, Schedule, Cache, Duration } from 'effect'
import { Schema as S } from 'effect'
import {
  Match,
  MatchesResponse,
  RankingEntry,
  RankingResponse,
  TeamStats,
  FootbalistoError,
  ValidationError,
} from '../schemas'

/**
 * Footbalisto Service Interface
 */
export class FootbalistoService extends Context.Tag('FootbalistoService')<
  FootbalistoService,
  {
    readonly getMatches: (teamId: number) => Effect.Effect<
      readonly Match[],
      FootbalistoError | ValidationError
    >

    readonly getNextMatches: () => Effect.Effect<
      readonly Match[],
      FootbalistoError | ValidationError
    >

    readonly getMatchById: (matchId: number) => Effect.Effect<
      Match,
      FootbalistoError | ValidationError
    >

    readonly getRanking: (leagueId: number) => Effect.Effect<
      readonly RankingEntry[],
      FootbalistoError | ValidationError
    >

    readonly getTeamStats: (teamId: number) => Effect.Effect<
      TeamStats,
      FootbalistoError | ValidationError
    >

    readonly clearCache: () => Effect.Effect<void>
  }
>() {}

/**
 * Footbalisto Service Implementation
 * Includes caching layer for performance
 */
export const FootbalistoServiceLive = Layer.effect(
  FootbalistoService,
  Effect.gen(function* () {
    const baseUrl = process.env.FOOTBALISTO_API_URL || 'https://footbalisto.be'

    /**
     * Fetch JSON with retry and timeout
     */
    const fetchJson = <A, I>(url: string, schema: S.Schema<A, I>) =>
      Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetch(url, {
              headers: {
                Accept: 'application/json',
              },
            }),
          catch: (error) =>
            new FootbalistoError({
              message: `Failed to fetch from ${url}`,
              cause: error,
            }),
        })

        if (!response.ok) {
          return yield* Effect.fail(
            new FootbalistoError({
              message: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            })
          )
        }

        const json = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: (error) =>
            new FootbalistoError({
              message: 'Failed to parse JSON response',
              cause: error,
            }),
        })

        const decoded = yield* S.decodeUnknown(schema)(json).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError({
                message: 'Schema validation failed',
                errors: error,
              })
          )
        )

        return decoded
      }).pipe(
        Effect.retry(
          Schedule.exponential('1 second').pipe(
            Schedule.intersect(Schedule.recurs(3))
          )
        ),
        Effect.timeout('30 seconds'),
        Effect.mapError((error) => {
          if (error._tag === 'TimeoutException') {
            return new FootbalistoError({
              message: 'Request timed out after 30 seconds',
              cause: error,
            })
          }
          return error
        })
      )

    /**
     * Create cache for matches (5 minute TTL)
     */
    const matchesCache = yield* Cache.make({
      capacity: 100,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/matches/${teamId}`
          const response = yield* fetchJson(url, MatchesResponse)
          return response.matches
        }),
    })

    /**
     * Create cache for next matches (1 minute TTL for freshness)
     */
    const nextMatchesCache = yield* Cache.make({
      capacity: 1,
      timeToLive: Duration.minutes(1),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      lookup: (_key: 'next') =>
        Effect.gen(function* () {
          const url = `${baseUrl}/matches/next`
          const response = yield* fetchJson(url, MatchesResponse)
          return response.matches
        }),
    })

    /**
     * Create cache for rankings (5 minute TTL)
     */
    const rankingCache = yield* Cache.make({
      capacity: 50,
      timeToLive: Duration.minutes(5),
      lookup: (leagueId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/ranking/${leagueId}`
          const response = yield* fetchJson(url, RankingResponse)
          return response.ranking
        }),
    })

    /**
     * Create cache for team stats (5 minute TTL)
     */
    const teamStatsCache = yield* Cache.make({
      capacity: 50,
      timeToLive: Duration.minutes(5),
      lookup: (teamId: number) =>
        Effect.gen(function* () {
          const url = `${baseUrl}/stats/team/${teamId}`
          const response = yield* fetchJson(url, TeamStats)
          return response
        }),
    })

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
            })
          )
        )
      )

    /**
     * Get next/upcoming matches (cached)
     */
    const getNextMatches = () =>
      nextMatchesCache.get('next').pipe(
        Effect.catchAll((error) =>
          Effect.fail(
            new FootbalistoError({
              message: 'Failed to fetch next matches',
              cause: error,
            })
          )
        )
      )

    /**
     * Get single match by ID (not cached - for live updates)
     */
    const getMatchById = (matchId: number) =>
      Effect.gen(function* () {
        const url = `${baseUrl}/match/${matchId}`
        const response = yield* fetchJson(url, Match)
        return response
      })

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
            })
          )
        )
      )

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
            })
          )
        )
      )

    /**
     * Clear all caches (useful for testing or forced refresh)
     */
    const clearCache = () =>
      Effect.gen(function* () {
        yield* matchesCache.invalidateAll
        yield* nextMatchesCache.invalidateAll
        yield* rankingCache.invalidateAll
        yield* teamStatsCache.invalidateAll
      })

    return {
      getMatches,
      getNextMatches,
      getMatchById,
      getRanking,
      getTeamStats,
      clearCache,
    }
  })
)
