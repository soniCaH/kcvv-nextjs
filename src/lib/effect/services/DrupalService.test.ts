/**
 * DrupalService Tests
 * Comprehensive test suite for Drupal API integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Effect } from 'effect'
import { DrupalService, DrupalServiceLive } from './DrupalService'

// Mock fetch globally
global.fetch = vi.fn()

describe('DrupalService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getArticles', () => {
    it('should fetch articles successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'node--article',
            attributes: {
              title: 'Test Article',
              created: '2025-01-01T00:00:00Z',
              path: {
                alias: '/news/test-article',
              },
            },
            relationships: {
              field_image: {},
              field_category: {
                data: [],
              },
            },
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles({ limit: 10 })
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive))
      )

      expect(result).toHaveLength(1)
      expect(result[0].attributes.title).toBe('Test Article')
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/jsonapi/node/article'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.api+json',
          }),
        })
      )
    })

    it('should handle network errors', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles()
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))
      ).rejects.toThrow()
    }, 15000)

    it('should handle HTTP errors', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles()
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))
      ).rejects.toThrow()
    }, 15000)

    it('should apply pagination parameters', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles({ page: 2, limit: 18 })
      })

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page%5Blimit%5D=18'),
        expect.anything()
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page%5Boffset%5D=18'),
        expect.anything()
      )
    })

    it('should filter by category', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles({ category: 'youth' })
      })

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter%5Bfield_category.name%5D=youth'),
        expect.anything()
      )
    })
  })

  describe('getArticleBySlug', () => {
    it('should fetch article by slug', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'node--article',
            attributes: {
              title: 'Test Article',
              created: '2025-01-01T00:00:00Z',
              path: {
                alias: '/news/test-article',
              },
            },
            relationships: {
              field_image: {},
              field_category: { data: [] },
            },
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticleBySlug('test-article')
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive))
      )

      expect(result.attributes.title).toBe('Test Article')
    })

    it('should throw NotFoundError when article not found', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticleBySlug('non-existent')
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))
      ).rejects.toThrow()
    })

    it('should normalize slug with leading slash', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticleBySlug('/news/test-article')
      })

      await Effect.runPromise(
        program.pipe(
          Effect.provide(DrupalServiceLive),
          Effect.catchAll(() => Effect.succeed(null))
        )
      )

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter%5Bpath.alias%5D=%2Fnews%2Ftest-article'),
        expect.anything()
      )
    })
  })

  describe('getTeams', () => {
    it('should fetch all teams', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'node--team',
            attributes: {
              title: 'First Team',
              field_team_id: 123,
              created: '2025-01-01T00:00:00Z',
              path: {
                alias: '/team/first-team',
              },
            },
            relationships: {
              field_image: {},
            },
          },
        ],
      }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getTeams()
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive))
      )

      expect(result).toHaveLength(1)
      expect(result[0].attributes.field_team_id).toBe(123)
    })
  })

  describe('getPlayers', () => {
    it('should fetch players with team filter', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getPlayers({ teamId: 'team-123' })
      })

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter%5Bfield_team.id%5D=team-123'),
        expect.anything()
      )
    })
  })

  describe('getEvents', () => {
    it('should fetch upcoming events', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getEvents({ upcoming: true })
      })

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter%5Bfield_event_date%5D'),
        expect.anything()
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=field_event_date'),
        expect.anything()
      )
    })

    it('should fetch past events with descending sort', async () => {
      const mockResponse = { data: [] }

      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getEvents({ upcoming: false })
      })

      await Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=-field_event_date'),
        expect.anything()
      )
    })
  })

  describe('error handling', () => {
    it('should retry on transient failures', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>)
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [] }),
        })

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles()
      })

      const result = await Effect.runPromise(
        program.pipe(Effect.provide(DrupalServiceLive))
      )

      expect(result).toEqual([])
      expect(global.fetch).toHaveBeenCalledTimes(3)
    }, 15000)

    it('should timeout after 30 seconds', async () => {
      ;(global.fetch as unknown as ReturnType<typeof vi.fn>).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 35000)
          })
      )

      const program = Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles()
      })

      await expect(
        Effect.runPromise(program.pipe(Effect.provide(DrupalServiceLive)))
      ).rejects.toThrow()
    }, 40000)
  })
})
