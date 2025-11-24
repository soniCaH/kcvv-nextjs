/**
 * FootbalistoService Tests
 * Comprehensive test suite for Footbalisto API integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Effect } from 'effect'
import { FootbalistoService, FootbalistoServiceLive } from './FootbalistoService'

// Mock fetch globally
global.fetch = vi.fn()

describe('FootbalistoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMatches', () => {
    it('should fetch matches for a team', async () => {
      const mockResponse = {
        matches: [
          {
            id: 1,
            date: '2025-01-15T00:00:00Z',
            home_team: {
              id: 123,
              name: 'KCVV Elewijt',
              score: 3,
            },
            away_team: {
              id: 456,
              name: 'Opponent FC',
              score: 1,
            },
            status: 'finished',
          },
        ],
        total: 1,
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        return yield* footbalisto.getMatches(123)
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result).toHaveLength(1)
      expect(result[0].home_team.name).toBe('KCVV Elewijt')
      expect(result[0].status).toBe('finished')
    })

    it('should cache match results', async () => {
      const mockResponse = {
        matches: [
          {
            id: 1,
            date: '2025-01-15T00:00:00Z',
            home_team: { id: 123, name: 'Team A', score: 2 },
            away_team: { id: 456, name: 'Team B', score: 1 },
            status: 'finished',
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        const first = yield* footbalisto.getMatches(123)
        const second = yield* footbalisto.getMatches(123)
        return { first, second }
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result.first).toEqual(result.second)
      expect(global.fetch).toHaveBeenCalledTimes(1) // Cached on second call
    })
  })

  describe('getMatchById', () => {
    it('should fetch a single match', async () => {
      const mockMatch = {
        id: 999,
        date: '2025-01-20T00:00:00Z',
        home_team: { id: 123, name: 'Home Team', score: 2 },
        away_team: { id: 456, name: 'Away Team', score: 2 },
        status: 'finished',
        venue: 'Stadium Name',
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMatch,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        return yield* footbalisto.getMatchById(999)
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result.id).toBe(999)
      expect(result.venue).toBe('Stadium Name')
    })

    it('should not cache individual match requests', async () => {
      const mockMatch = {
        id: 999,
        date: '2025-01-20T00:00:00Z',
        home_team: { id: 123, name: 'Home', score: 1 },
        away_team: { id: 456, name: 'Away', score: 0 },
        status: 'live',
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockMatch,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        yield* footbalisto.getMatchById(999)
        yield* footbalisto.getMatchById(999)
      })

      await Effect.runPromise(program.pipe(Effect.provide(FootbalistoServiceLive)))

      expect(global.fetch).toHaveBeenCalledTimes(2) // Not cached
    })
  })

  describe('getRanking', () => {
    it('should fetch league ranking', async () => {
      const mockResponse = {
        ranking: [
          {
            position: 1,
            team_id: 123,
            team_name: 'KCVV Elewijt',
            played: 15,
            won: 12,
            drawn: 2,
            lost: 1,
            goals_for: 40,
            goals_against: 10,
            goal_difference: 30,
            points: 38,
            form: 'WWDWW',
          },
        ],
        season: '2024-2025',
        competition: 'Provincial League',
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        return yield* footbalisto.getRanking(1)
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result).toHaveLength(1)
      expect(result[0].position).toBe(1)
      expect(result[0].points).toBe(38)
      expect(result[0].form).toBe('WWDWW')
    })

    it('should cache ranking results', async () => {
      const mockResponse = {
        ranking: [
          {
            position: 1,
            team_id: 123,
            team_name: 'Team A',
            played: 10,
            won: 8,
            drawn: 1,
            lost: 1,
            goals_for: 25,
            goals_against: 10,
            goal_difference: 15,
            points: 25,
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        yield* footbalisto.getRanking(1)
        yield* footbalisto.getRanking(1)
      })

      await Effect.runPromise(program.pipe(Effect.provide(FootbalistoServiceLive)))

      expect(global.fetch).toHaveBeenCalledTimes(1) // Cached
    })
  })

  describe('getTeamStats', () => {
    it('should fetch team statistics', async () => {
      const mockStats = {
        team_id: 123,
        team_name: 'KCVV Elewijt',
        total_matches: 15,
        wins: 12,
        draws: 2,
        losses: 1,
        goals_scored: 40,
        goals_conceded: 10,
        clean_sheets: 8,
        top_scorers: [
          {
            player_id: 1,
            player_name: 'Top Scorer',
            team_id: 123,
            matches_played: 15,
            goals: 15,
            assists: 5,
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        return yield* footbalisto.getTeamStats(123)
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result.team_id).toBe(123)
      expect(result.total_matches).toBe(15)
      expect(result.top_scorers).toHaveLength(1)
      expect(result.top_scorers![0].goals).toBe(15)
    })
  })

  describe('clearCache', () => {
    it('should clear all caches', async () => {
      const mockResponse = {
        matches: [
          {
            id: 1,
            date: '2025-01-15T00:00:00Z',
            home_team: { id: 123, name: 'Team A', score: 1 },
            away_team: { id: 456, name: 'Team B', score: 0 },
            status: 'finished',
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService

        // First call - should hit API
        yield* footbalisto.getMatches(123)

        // Clear cache
        yield* footbalisto.clearCache()

        // Second call - should hit API again (not cached)
        yield* footbalisto.getMatches(123)
      })

      await Effect.runPromise(program.pipe(Effect.provide(FootbalistoServiceLive)))

      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should handle HTTP errors', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        // Use getMatchById instead since it doesn't cache
        return yield* footbalisto.getMatchById(999)
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(FootbalistoServiceLive)))
      ).rejects.toThrow()
    }, 15000)

    it('should retry on network failures', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ matches: [] }),
        })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        // Clear cache first to ensure fresh state
        yield* footbalisto.clearCache()
        return yield* footbalisto.getMatches(888) // Use unique teamId to avoid cache
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(FootbalistoServiceLive))
      )

      expect(result).toEqual([])
      expect(global.fetch).toHaveBeenCalledTimes(3)
    }, 15000)

    it('should handle validation errors', async () => {
      const invalidResponse = {
        // Invalid match response
        id: 'invalid', // Should be number
        home_team: {},
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidResponse,
      })

      const program = Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        // Use getMatchById instead since it doesn't cache
        return yield* footbalisto.getMatchById(777)
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(FootbalistoServiceLive)))
      ).rejects.toThrow()
    }, 15000)
  })
})
