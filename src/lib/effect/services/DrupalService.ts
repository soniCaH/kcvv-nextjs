/**
 * Drupal JSON:API Service
 * Effect-based service for fetching content from Drupal CMS
 */

import { Context, Effect, Layer, Schedule } from 'effect'
import { Schema as S } from 'effect'
import {
  Article,
  ArticlesResponse,
  ArticleResponse,
  Team,
  TeamsResponse,
  TeamResponse,
  Player,
  PlayersResponse,
  PlayerResponse,
  Event,
  EventsResponse,
  DrupalError,
  NotFoundError,
  ValidationError,
} from '../schemas'

/**
 * Drupal Service Interface
 * Defines all operations for fetching Drupal content
 */
export class DrupalService extends Context.Tag('DrupalService')<
  DrupalService,
  {
    // Articles
    readonly getArticles: (params?: {
      page?: number
      limit?: number
      category?: string
      sort?: string
    }) => Effect.Effect<readonly Article[], DrupalError | ValidationError>

    readonly getArticleBySlug: (slug: string) => Effect.Effect<
      Article,
      DrupalError | NotFoundError | ValidationError
    >

    readonly getArticleById: (id: string) => Effect.Effect<
      Article,
      DrupalError | NotFoundError | ValidationError
    >

    // Teams
    readonly getTeams: () => Effect.Effect<readonly Team[], DrupalError | ValidationError>

    readonly getTeamBySlug: (slug: string) => Effect.Effect<
      Team,
      DrupalError | NotFoundError | ValidationError
    >

    readonly getTeamById: (id: string) => Effect.Effect<
      Team,
      DrupalError | NotFoundError | ValidationError
    >

    // Players
    readonly getPlayers: (params?: {
      teamId?: string
      limit?: number
    }) => Effect.Effect<readonly Player[], DrupalError | ValidationError>

    readonly getPlayerBySlug: (slug: string) => Effect.Effect<
      Player,
      DrupalError | NotFoundError | ValidationError
    >

    readonly getPlayerById: (id: string) => Effect.Effect<
      Player,
      DrupalError | NotFoundError | ValidationError
    >

    // Events
    readonly getEvents: (params?: {
      upcoming?: boolean
      limit?: number
    }) => Effect.Effect<readonly Event[], DrupalError | ValidationError>

    readonly getEventBySlug: (slug: string) => Effect.Effect<
      Event,
      DrupalError | NotFoundError | ValidationError
    >
  }
>() {}

/**
 * Drupal Service Implementation
 * Uses Effect HttpClient for requests
 */
export const DrupalServiceLive = Layer.effect(
  DrupalService,
  Effect.gen(function* () {
    const baseUrl = process.env.DRUPAL_API_URL || 'https://api.kcvvelewijt.be'
    const jsonApiBase = `${baseUrl}/jsonapi`

    /**
     * Build JSON:API URL with query parameters
     */
    const buildUrl = (
      path: string,
      params?: Record<string, string | number | boolean>
    ): string => {
      const url = new URL(`${jsonApiBase}/${path}`)

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, String(value))
        })
      }

      return url.toString()
    }

    /**
     * Fetch JSON from URL with retry and timeout
     */
    const fetchJson = <A, I>(url: string, schema: S.Schema<A, I>) =>
      Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () => fetch(url, {
            headers: {
              'Accept': 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
            },
          }),
          catch: (error) =>
            new DrupalError({
              message: `Failed to fetch from ${url}`,
              cause: error,
            }),
        })

        if (!response.ok) {
          return yield* Effect.fail(
            new DrupalError({
              message: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            })
          )
        }

        const json = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: (error) =>
            new DrupalError({
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
            return new DrupalError({
              message: 'Request timed out after 30 seconds',
              cause: error,
            })
          }
          return error
        })
      )

    /**
     * Get articles with optional filtering
     */
    const getArticles = (params?: {
      page?: number
      limit?: number
      category?: string
      sort?: string
    }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          'include': 'field_image,field_category',
          'sort': params?.sort || '-created',
        }

        if (params?.limit) {
          queryParams['page[limit]'] = params.limit
        }

        if (params?.page && params?.limit) {
          queryParams['page[offset]'] = (params.page - 1) * params.limit
        }

        if (params?.category) {
          queryParams['filter[field_category.name]'] = params.category
        }

        const url = buildUrl('node/article', queryParams)
        const response = yield* fetchJson(url, ArticlesResponse)

        return response.data
      })

    /**
     * Get article by path alias
     */
    const getArticleBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/news/${slug}`

        const queryParams = {
          'filter[path.alias]': normalizedSlug,
          'include': 'field_image,field_category',
        }

        const url = buildUrl('node/article', queryParams)
        const response = yield* fetchJson(url, ArticlesResponse)

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: 'article',
              identifier: slug,
              message: `Article with slug "${slug}" not found`,
            })
          )
        }

        return response.data[0]
      })

    /**
     * Get article by ID
     */
    const getArticleById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/article/${id}`, {
          include: 'field_image,field_category',
        })
        const response = yield* fetchJson(url, ArticleResponse)
        return response.data
      })

    /**
     * Get all teams
     */
    const getTeams = () =>
      Effect.gen(function* () {
        const url = buildUrl('node/team', {
          sort: 'title',
          include: 'field_image',
        })
        const response = yield* fetchJson(url, TeamsResponse)
        return response.data
      })

    /**
     * Get team by path alias
     */
    const getTeamBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/team/${slug}`

        const url = buildUrl('node/team', {
          'filter[path.alias]': normalizedSlug,
          'include': 'field_image',
        })
        const response = yield* fetchJson(url, TeamsResponse)

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: 'team',
              identifier: slug,
              message: `Team with slug "${slug}" not found`,
            })
          )
        }

        return response.data[0]
      })

    /**
     * Get team by ID
     */
    const getTeamById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/team/${id}`, {
          include: 'field_image',
        })
        const response = yield* fetchJson(url, TeamResponse)
        return response.data
      })

    /**
     * Get players with optional filtering
     */
    const getPlayers = (params?: { teamId?: string; limit?: number }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          'include': 'field_image,field_team',
          'sort': 'field_number',
        }

        if (params?.teamId) {
          queryParams['filter[field_team.id]'] = params.teamId
        }

        if (params?.limit) {
          queryParams['page[limit]'] = params.limit
        }

        const url = buildUrl('node/player', queryParams)
        const response = yield* fetchJson(url, PlayersResponse)

        return response.data
      })

    /**
     * Get player by path alias
     */
    const getPlayerBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/player/${slug}`

        const url = buildUrl('node/player', {
          'filter[path.alias]': normalizedSlug,
          'include': 'field_image,field_team',
        })
        const response = yield* fetchJson(url, PlayersResponse)

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: 'player',
              identifier: slug,
              message: `Player with slug "${slug}" not found`,
            })
          )
        }

        return response.data[0]
      })

    /**
     * Get player by ID
     */
    const getPlayerById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/player/${id}`, {
          include: 'field_image,field_team',
        })
        const response = yield* fetchJson(url, PlayerResponse)
        return response.data
      })

    /**
     * Get events with optional filtering
     */
    const getEvents = (params?: { upcoming?: boolean; limit?: number }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          'include': 'field_image',
          'sort': params?.upcoming ? 'field_event_date' : '-field_event_date',
        }

        if (params?.upcoming) {
          const now = new Date().toISOString()
          queryParams['filter[field_event_date][condition][path]'] = 'field_event_date'
          queryParams['filter[field_event_date][condition][operator]'] = '>='
          queryParams['filter[field_event_date][condition][value]'] = now
        }

        if (params?.limit) {
          queryParams['page[limit]'] = params.limit
        }

        const url = buildUrl('node/event', queryParams)
        const response = yield* fetchJson(url, EventsResponse)

        return response.data
      })

    /**
     * Get event by path alias
     */
    const getEventBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith('/') ? slug : `/events/${slug}`

        const url = buildUrl('node/event', {
          'filter[path.alias]': normalizedSlug,
          'include': 'field_image',
        })
        const response = yield* fetchJson(url, EventsResponse)

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: 'event',
              identifier: slug,
              message: `Event with slug "${slug}" not found`,
            })
          )
        }

        return response.data[0]
      })

    return {
      getArticles,
      getArticleBySlug,
      getArticleById,
      getTeams,
      getTeamBySlug,
      getTeamById,
      getPlayers,
      getPlayerBySlug,
      getPlayerById,
      getEvents,
      getEventBySlug,
    }
  })
)
