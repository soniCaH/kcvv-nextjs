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
  ArticleIncludedResource,
  Team,
  TeamsResponse,
  TeamResponse,
  Player,
  PlayersResponse,
  PlayerResponse,
  Event,
  EventsResponse,
  TaxonomyTerm,
  TaxonomyTermsResponse,
  DrupalError,
  NotFoundError,
  ValidationError,
  JsonApiLinks,
} from "../schemas";

/**
 * Drupal Service Interface
 * Defines all operations for fetching Drupal content
 */
export class DrupalService extends Context.Tag("DrupalService")<
  DrupalService,
  {
    // Articles
    readonly getArticles: (params?: {
      page?: number;
      limit?: number;
      categoryId?: number;
      sort?: string;
    }) => Effect.Effect<
      { articles: readonly Article[]; links: JsonApiLinks | undefined },
      DrupalError | ValidationError
    >;

    readonly getArticleBySlug: (
      slug: string
    ) => Effect.Effect<Article, DrupalError | NotFoundError | ValidationError>;

    readonly getArticleById: (
      id: string
    ) => Effect.Effect<Article, DrupalError | NotFoundError | ValidationError>;

    // Teams
    readonly getTeams: () => Effect.Effect<
      readonly Team[],
      DrupalError | ValidationError
    >;

    readonly getTeamBySlug: (
      slug: string
    ) => Effect.Effect<Team, DrupalError | NotFoundError | ValidationError>;

    readonly getTeamById: (
      id: string
    ) => Effect.Effect<Team, DrupalError | NotFoundError | ValidationError>;

    // Players
    readonly getPlayers: (params?: {
      teamId?: string;
      limit?: number;
    }) => Effect.Effect<readonly Player[], DrupalError | ValidationError>;

    readonly getPlayerBySlug: (
      slug: string
    ) => Effect.Effect<Player, DrupalError | NotFoundError | ValidationError>;

    readonly getPlayerById: (
      id: string
    ) => Effect.Effect<Player, DrupalError | NotFoundError | ValidationError>;

    // Events
    readonly getEvents: (params?: {
      upcoming?: boolean;
      limit?: number;
    }) => Effect.Effect<readonly Event[], DrupalError | ValidationError>;

    readonly getEventBySlug: (
      slug: string
    ) => Effect.Effect<Event, DrupalError | NotFoundError | ValidationError>;

    // Taxonomy
    readonly getTags: (params?: {
      vocabulary?: string;
      limit?: number;
    }) => Effect.Effect<readonly TaxonomyTerm[], DrupalError | ValidationError>;
  }
>() {}

/**
 * Drupal Service Implementation
 * Uses Effect HttpClient for requests
 */
export const DrupalServiceLive = Layer.effect(
  DrupalService,
  Effect.gen(function* () {
    const baseUrl = process.env.DRUPAL_API_URL || "https://api.kcvvelewijt.be";
    const jsonApiBase = `${baseUrl}/jsonapi`;

    /**
     * Build JSON:API URL with query parameters
     */
    const buildUrl = (
      path: string,
      params?: Record<string, string | number | boolean>
    ): string => {
      const url = new URL(`${jsonApiBase}/${path}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.set(key, String(value));
        });
      }

      return url.toString();
    };

    /**
     * Fetch JSON from URL with retry and timeout
     */
    const fetchJson = <A, I>(url: string, schema: S.Schema<A, I>) =>
      Effect.gen(function* () {
        const response =
          yield *
          Effect.tryPromise({
            try: () =>
              fetch(url, {
                headers: {
                  Accept: "application/vnd.api+json",
                  "Content-Type": "application/vnd.api+json",
                },
              }),
            catch: (error) =>
              new DrupalError({
                message: `Failed to fetch from ${url}`,
                cause: error,
              }),
          });

        if (!response.ok) {
          return (
            yield *
            Effect.fail(
              new DrupalError({
                message: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
              })
            )
          );
        }

        const json =
          yield *
          Effect.tryPromise({
            try: () => response.json(),
            catch: (error) =>
              new DrupalError({
                message: "Failed to parse JSON response",
                cause: error,
              }),
          });

        const decoded =
          yield *
          S.decodeUnknown(schema)(json).pipe(
            Effect.mapError(
              (error) => {
                console.error('[DrupalService] Schema validation failed:');
                console.error('[DrupalService] Error details:', {
                  _id: error._id,
                  message: error.message,
                });
                console.error('[DrupalService] Response URL:', url);
                console.error('[DrupalService] Response data sample:', JSON.stringify(json, null, 2).substring(0, 1000));

                return new ValidationError({
                  message: "Schema validation failed",
                  errors: error,
                });
              }
            )
          );

        return decoded;
      }).pipe(
        Effect.retry(
          Schedule.exponential("1 second").pipe(
            Schedule.intersect(Schedule.recurs(3))
          )
        ),
        Effect.timeout("30 seconds"),
        Effect.mapError((error) => {
          if (error._tag === "TimeoutException") {
            return new DrupalError({
              message: "Request timed out after 30 seconds",
              cause: error,
            });
          }
          return error;
        })
      );

    /**
     * Map included data to main resources
     *
     * Resolves relationships from the JSON:API included section into the main entities.
     * For articles, this primarily resolves:
     * - Featured images: media--image -> file--file -> URL
     * - Tags: taxonomy term references
     *
     * @param data - Array of article entities
     * @param included - Array of related entities from JSON:API included section
     * @returns Articles with resolved relationships
     *
     * @example
     * ```typescript
     * // Before: article.relationships.field_media_article_image.data = { type: "media--image", id: "123" }
     * // After:  article.relationships.field_media_article_image.data = { uri: { url: "..." }, alt: "..." }
     * ```
     */
    const mapIncluded = (
      data: readonly Article[],
      included: readonly ArticleIncludedResource[] = []
    ): readonly Article[] => {
      const includedMap = new Map<string, ArticleIncludedResource>(
        included.map((item) => [`${item.type}:${item.id}`, item])
      );

      return data.map((article) => {
        // Clone article to avoid mutation issues
        const newArticle: Article = {
          ...article,
          relationships: { ...article.relationships },
        };

        // Resolve featured image: media--image -> file--file -> URL
        const mediaRef =
          newArticle.relationships.field_media_article_image?.data;
        if (mediaRef && "id" in mediaRef && "type" in mediaRef) {
          const media = includedMap.get(`media--image:${mediaRef.id}`);

          // Type guard: verify this is a MediaImage
          if (media && media.type === "media--image") {
            const fileRef = media.relationships?.field_media_image?.data;

            if (fileRef) {
              const file = includedMap.get(`file--file:${fileRef.id}`);

              // Type guard: verify this is a File
              if (file && file.type === "file--file") {
                // Construct DrupalImage structure matching schema
                // file.attributes.uri.url is guaranteed to exist by schema
                const fileUrl = file.attributes.uri.url;
                const absoluteUrl = fileUrl.startsWith("http")
                  ? fileUrl
                  : `${baseUrl}${fileUrl}`;

                newArticle.relationships.field_media_article_image.data = {
                  uri: { url: absoluteUrl },
                  alt: fileRef.meta?.alt || "",
                  width: fileRef.meta?.width,
                  height: fileRef.meta?.height,
                };
              }
            }
          }
        }

        // Resolve taxonomy terms (tags)
        const tagsData = newArticle.relationships.field_tags?.data;
        if (tagsData && Array.isArray(tagsData)) {
          newArticle.relationships.field_tags.data = tagsData.map((tagRef) => {
            // If already resolved (has attributes.name), return as-is
            if ("attributes" in tagRef && tagRef.attributes) {
              return tagRef;
            }

            // Otherwise, resolve from included
            if ("id" in tagRef && "type" in tagRef) {
              const resolvedTag = includedMap.get(
                `${tagRef.type}:${tagRef.id}`
              );

              // Type guard: verify this is a TaxonomyTerm
              if (
                resolvedTag &&
                resolvedTag.type.startsWith("taxonomy_term--")
              ) {
                return resolvedTag;
              }
            }

            // Fallback: return reference as-is
            return tagRef;
          });
        }

        return newArticle;
      });
    };

    /**
     * Get articles with optional filtering
     */
    const getArticles = (params?: {
      page?: number;
      limit?: number;
      categoryId?: number;
      sort?: string;
    }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          include: "field_media_article_image.field_media_image,field_tags",
          sort: params?.sort || "-created",
          "filter[status]": 1, // Only fetch published articles
        };

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        if (params?.page && params?.limit) {
          queryParams["page[offset]"] = (params.page - 1) * params.limit;
        }

        if (params?.categoryId) {
          queryParams["filter[field_tags.drupal_internal__tid]"] = params.categoryId;
        }

        const url = buildUrl("node/article", queryParams);
        const response = yield * fetchJson(url, ArticlesResponse);

        return {
          articles: mapIncluded(response.data, response.included),
          links: response.links,
        };
      });

    /**
     * Get article by path alias
     */
    const getArticleBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith("/") ? slug : `/news/${slug}`;
        const limit = 50;
        let page = 1;
        let foundArticle: Article | undefined;

        // Workaround: API crashes on filter[path.alias], so we fetch all articles and filter in memory
        // We paginate until we find it or run out of articles
        while (!foundArticle) {
          const { articles, links } = yield * getArticles({ page, limit });

          console.log(
            `[getArticleBySlug] Page ${page}: Fetched ${articles.length} articles`
          );
          if (articles.length > 0) {
            console.log(
              `[getArticleBySlug] Sample slugs:`,
              articles.slice(0, 3).map((a) => a.attributes.path.alias)
            );
            console.log(`[getArticleBySlug] Searching for: ${normalizedSlug}`);
          }

          if (articles.length === 0) break;

          foundArticle = articles.find(
            (a) => a.attributes.path.alias === normalizedSlug
          );

          if (foundArticle) break;

          if (!links?.next) break; // End of list
          page++;

          if (page > 20) break; // Safety break to prevent infinite loops
        }

        if (!foundArticle) {
          return (
            yield *
            Effect.fail(
              new NotFoundError({
                resource: "article",
                identifier: slug,
                message: `Article with slug "${slug}" not found`,
              })
            )
          );
        }

        return foundArticle;
      });

    /**
     * Get article by ID
     */
    const getArticleById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/article/${id}`, {
          include: "field_media_article_image.field_media_image,field_tags",
        });
        const response = yield* fetchJson(url, ArticleResponse);
        const mapped = mapIncluded([response.data], response.included);
        return mapped[0];
      });

    /**
     * Get all teams
     */
    const getTeams = () =>
      Effect.gen(function* () {
        const url = buildUrl("node/team", {
          sort: "title",
          include: "field_image",
        });
        const response = yield* fetchJson(url, TeamsResponse);
        return response.data;
      });

    /**
     * Get team by path alias
     */
    const getTeamBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith("/") ? slug : `/team/${slug}`;

        const url = buildUrl("node/team", {
          "filter[path.alias]": normalizedSlug,
          include: "field_image",
        });
        const response = yield * fetchJson(url, TeamsResponse);

        if (!response.data || response.data.length === 0) {
          return (
            yield *
            Effect.fail(
              new NotFoundError({
                resource: "team",
                identifier: slug,
                message: `Team with slug "${slug}" not found`,
              })
            )
          );
        }

        return response.data[0];
      });

    /**
     * Get team by ID
     */
    const getTeamById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/team/${id}`, {
          include: "field_image",
        });
        const response = yield* fetchJson(url, TeamResponse);
        return response.data;
      });

    /**
     * Get players with optional filtering
     */
    const getPlayers = (params?: { teamId?: string; limit?: number }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          include: "field_image,field_team",
          sort: "field_number",
        };

        if (params?.teamId) {
          queryParams["filter[field_team.id]"] = params.teamId;
        }

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        const url = buildUrl("node/player", queryParams);
        const response = yield * fetchJson(url, PlayersResponse);

        return response.data;
      });

    /**
     * Get player by path alias
     */
    const getPlayerBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith("/") ? slug : `/player/${slug}`;

        const url = buildUrl("node/player", {
          "filter[path.alias]": normalizedSlug,
          include: "field_image,field_team",
        });
        const response = yield * fetchJson(url, PlayersResponse);

        if (!response.data || response.data.length === 0) {
          return (
            yield *
            Effect.fail(
              new NotFoundError({
                resource: "player",
                identifier: slug,
                message: `Player with slug "${slug}" not found`,
              })
            )
          );
        }

        return response.data[0];
      });

    /**
     * Get player by ID
     */
    const getPlayerById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/player/${id}`, {
          include: "field_image,field_team",
        });
        const response = yield* fetchJson(url, PlayerResponse);
        return response.data;
      });

    /**
     * Get events with optional filtering
     */
    const getEvents = (params?: { upcoming?: boolean; limit?: number }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          include: "field_image",
          sort: params?.upcoming ? "field_event_date" : "-field_event_date",
        };

        if (params?.upcoming) {
          const now = new Date().toISOString();
          queryParams["filter[field_event_date][condition][path]"] =
            "field_event_date";
          queryParams["filter[field_event_date][condition][operator]"] = ">=";
          queryParams["filter[field_event_date][condition][value]"] = now;
        }

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        const url = buildUrl("node/event", queryParams);
        const response = yield * fetchJson(url, EventsResponse);

        return response.data;
      });

    /**
     * Get event by path alias
     */
    const getEventBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith("/") ? slug : `/events/${slug}`;

        const url = buildUrl("node/event", {
          "filter[path.alias]": normalizedSlug,
          include: "field_image",
        });
        const response = yield * fetchJson(url, EventsResponse);

        if (!response.data || response.data.length === 0) {
          return (
            yield *
            Effect.fail(
              new NotFoundError({
                resource: "event",
                identifier: slug,
                message: `Event with slug "${slug}" not found`,
              })
            )
          );
        }

        return response.data[0];
      });

    /**
     * Get taxonomy terms (tags/categories)
     */
    const getTags = (params?: { vocabulary?: string; limit?: number }) =>
      Effect.gen(function* () {
        const vocabulary = params?.vocabulary || "category";
        const queryParams: Record<string, string | number> = {
          sort: "name",
        };

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        const url = buildUrl(`taxonomy_term/${vocabulary}`, queryParams);

        console.log('[getTags] Fetching from URL:', url);
        const response = yield* fetchJson(url, TaxonomyTermsResponse);
        console.log('[getTags] Response received, data length:', response.data.length);

        return response.data;
      });

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
      getTags,
    };
  })
);
