/**
 * Drupal JSON:API Service
 * Effect-based service for fetching content from Drupal CMS
 */

import { Context, Effect, Layer, Schedule } from "effect";
import { Schema as S } from "effect";
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
  Sponsor,
  SponsorsResponse,
  SponsorIncludedResource,
  TaxonomyTerm,
  TaxonomyTermsResponse,
  DrupalError,
  NotFoundError,
  ValidationError,
  JsonApiLinks,
  MediaImage,
  File,
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
      slug: string,
    ) => Effect.Effect<Article, DrupalError | NotFoundError | ValidationError>;

    readonly getArticleById: (
      id: string,
    ) => Effect.Effect<Article, DrupalError | NotFoundError | ValidationError>;

    // Teams
    readonly getTeams: () => Effect.Effect<
      readonly Team[],
      DrupalError | ValidationError
    >;

    readonly getTeamBySlug: (
      slug: string,
    ) => Effect.Effect<Team, DrupalError | NotFoundError | ValidationError>;

    readonly getTeamById: (
      id: string,
    ) => Effect.Effect<Team, DrupalError | NotFoundError | ValidationError>;

    // Players
    readonly getPlayers: (params?: {
      teamId?: string;
      limit?: number;
      page?: number;
    }) => Effect.Effect<
      { players: readonly Player[]; links: JsonApiLinks | undefined },
      DrupalError | ValidationError
    >;

    readonly getPlayerBySlug: (
      slug: string,
    ) => Effect.Effect<Player, DrupalError | NotFoundError | ValidationError>;

    readonly getPlayerById: (
      id: string,
    ) => Effect.Effect<Player, DrupalError | NotFoundError | ValidationError>;

    // Events
    readonly getEvents: (params?: {
      upcoming?: boolean;
      limit?: number;
    }) => Effect.Effect<readonly Event[], DrupalError | ValidationError>;

    readonly getEventBySlug: (
      slug: string,
    ) => Effect.Effect<Event, DrupalError | NotFoundError | ValidationError>;

    // Sponsors
    readonly getSponsors: (params?: {
      type?: string | string[];
      promoted?: boolean;
      limit?: number;
      sort?: string;
    }) => Effect.Effect<readonly Sponsor[], DrupalError | ValidationError>;

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
      params?: Record<string, string | number | boolean>,
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
        const response = yield* Effect.tryPromise({
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
          return yield* Effect.fail(
            new DrupalError({
              message: `HTTP ${response.status}: ${response.statusText}`,
              status: response.status,
            }),
          );
        }

        const json = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: (error) =>
            new DrupalError({
              message: "Failed to parse JSON response",
              cause: error,
            }),
        });

        const decoded = yield* S.decodeUnknown(schema)(json).pipe(
          Effect.mapError((error) => {
            return new ValidationError({
              message: "Schema validation failed",
              errors: error,
            });
          }),
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
            return new DrupalError({
              message: "Request timed out after 30 seconds",
              cause: error,
            });
          }
          return error;
        }),
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
      included: readonly S.Schema.Type<typeof ArticleIncludedResource>[] = [],
    ): readonly Article[] => {
      const includedMap = new Map<
        string,
        S.Schema.Type<typeof ArticleIncludedResource>
      >(included.map((item) => [`${item.type}:${item.id}`, item]));

      return data.map((article) => {
        // Resolve featured image: media--image -> file--file -> URL
        const mediaRef = article.relationships.field_media_article_image?.data;
        const resolvedMediaImage = (() => {
          if (!mediaRef || !("id" in mediaRef) || !("type" in mediaRef)) {
            return article.relationships.field_media_article_image;
          }

          const media = includedMap.get(`media--image:${mediaRef.id}`);
          if (!media || media.type !== "media--image") {
            return article.relationships.field_media_article_image;
          }

          // Decode media to ensure it's a valid MediaImage
          const decodedMedia = S.decodeUnknownSync(MediaImage)(media);
          const fileRef = decodedMedia.relationships?.field_media_image?.data;
          if (!fileRef) {
            return article.relationships.field_media_article_image;
          }

          const file = includedMap.get(`file--file:${fileRef.id}`);
          if (!file || file.type !== "file--file") {
            return article.relationships.field_media_article_image;
          }

          // Decode file to ensure it's a valid File
          const decodedFile = S.decodeUnknownSync(File)(file);
          const fileUrl = decodedFile.attributes.uri.url;
          const absoluteUrl = fileUrl.startsWith("http")
            ? fileUrl
            : `${baseUrl}${fileUrl}`;

          return {
            data: {
              uri: { url: absoluteUrl },
              alt: fileRef.meta?.alt || "",
              width: fileRef.meta?.width,
              height: fileRef.meta?.height,
            },
          };
        })();

        // Resolve taxonomy terms (tags)
        const tagsData = article.relationships.field_tags?.data;
        const resolvedTags = (() => {
          if (!tagsData || !Array.isArray(tagsData)) {
            return article.relationships.field_tags;
          }

          const mappedTags = tagsData.map((tagRef) => {
            // If already resolved (has attributes.name), return as-is
            if ("attributes" in tagRef && tagRef.attributes) {
              return tagRef;
            }

            // Otherwise, resolve from included
            if ("id" in tagRef && "type" in tagRef) {
              const resolvedTag = includedMap.get(
                `${tagRef.type}:${tagRef.id}`,
              );

              // Decode and verify this is a valid TaxonomyTerm
              if (
                resolvedTag &&
                resolvedTag.type.startsWith("taxonomy_term--")
              ) {
                // Use Schema decoding to validate the taxonomy term - returns validated TaxonomyTerm
                return S.decodeUnknownSync(TaxonomyTerm)(resolvedTag);
              }
            }

            // Fallback: return reference as-is
            return tagRef;
          });

          return { data: mappedTags };
        })();

        // Return article with resolved relationships
        // Note: Article is already validated from API response, no need to decode again
        return {
          ...article,
          relationships: {
            ...article.relationships,
            field_media_article_image: resolvedMediaImage,
            field_tags: resolvedTags,
          },
        };
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
          queryParams["filter[field_tags.drupal_internal__tid]"] =
            params.categoryId;
        }

        const url = buildUrl("node/article", queryParams);
        const response = yield* fetchJson(url, ArticlesResponse);

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
          const { articles, links } = yield* getArticles({ page, limit });

          if (articles.length === 0) break;

          foundArticle = articles.find(
            (a) => a.attributes.path.alias === normalizedSlug,
          );

          if (foundArticle) break;

          if (!links?.next) break; // End of list
          page++;

          if (page > 20) break; // Safety break to prevent infinite loops
        }

        if (!foundArticle) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "article",
              identifier: slug,
              message: `Article with slug "${slug}" not found`,
            }),
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
        const response = yield* fetchJson(url, TeamsResponse);

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "team",
              identifier: slug,
              message: `Team with slug "${slug}" not found`,
            }),
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
     * Get players with optional filtering and pagination
     */
    const getPlayers = (params?: {
      teamId?: string;
      limit?: number;
      page?: number;
    }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          include: "field_image,field_team",
          sort: "field_shirtnumber",
        };

        if (params?.teamId) {
          queryParams["filter[field_team.id]"] = params.teamId;
        }

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        if (params?.page && params?.limit) {
          queryParams["page[offset]"] = (params.page - 1) * params.limit;
        }

        const url = buildUrl("node/player", queryParams);
        const response = yield* fetchJson(url, PlayersResponse);

        return {
          players: response.data,
          links: response.links,
        };
      });

    /**
     * Get player by path alias
     *
     * Workaround: API crashes on filter[path.alias], so we fetch all players
     * and filter in memory. We paginate until we find it or run out of players.
     */
    const getPlayerBySlug = (slug: string) =>
      Effect.gen(function* () {
        const normalizedSlug = slug.startsWith("/") ? slug : `/player/${slug}`;
        const limit = 50;
        let page = 1;
        let foundPlayer: Player | undefined;

        while (!foundPlayer) {
          const { players, links } = yield* getPlayers({ page, limit });

          if (players.length === 0) break;

          foundPlayer = players.find(
            (p) => p.attributes.path.alias === normalizedSlug,
          );

          if (foundPlayer) break;

          if (!links?.next) break;
          page++;

          // Safety limit
          if (page > 20) break;
        }

        if (!foundPlayer) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "player",
              identifier: slug,
              message: `Player with slug "${slug}" not found`,
            }),
          );
        }

        return foundPlayer;
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
        const response = yield* fetchJson(url, EventsResponse);

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
        const response = yield* fetchJson(url, EventsResponse);

        if (!response.data || response.data.length === 0) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "event",
              identifier: slug,
              message: `Event with slug "${slug}" not found`,
            }),
          );
        }

        return response.data[0];
      });

    /**
     * Get sponsors with optional filtering
     */
    const getSponsors = (params?: {
      type?: string | string[];
      promoted?: boolean;
      limit?: number;
      sort?: string;
    }) =>
      Effect.gen(function* () {
        const queryParams: Record<string, string | number> = {
          include: "field_media_image.field_media_image",
          "filter[status]": 1, // Only fetch published sponsors
        };

        // Default sort: field_type then title (mirrors Gatsby)
        // Note: Sort string is comma-separated
        queryParams["sort"] = params?.sort || "field_type,title";

        if (params?.promoted) {
          queryParams["filter[promote]"] = 1;
        }

        if (params?.type) {
          if (Array.isArray(params.type)) {
            // Use IN operator for multiple types
            queryParams["filter[field_type][condition][path]"] = "field_type";
            queryParams["filter[field_type][condition][operator]"] = "IN";
            params.type.forEach((t, i) => {
              queryParams[`filter[field_type][condition][value][${i}]`] = t;
            });
          } else {
            queryParams["filter[field_type]"] = params.type;
          }
        }

        if (params?.limit) {
          queryParams["page[limit]"] = params.limit;
        }

        const url = buildUrl("node/sponsor", queryParams);
        const response = yield* fetchJson(url, SponsorsResponse);

        // Map included media/file relationships to sponsor logos
        const mapped = mapSponsorIncluded(response.data, response.included);
        return mapped;
      });

    /**
     * Map included data for sponsors
     * Similar to mapIncluded but for sponsor logo images
     */
    const mapSponsorIncluded = (
      data: readonly Sponsor[],
      included: readonly S.Schema.Type<typeof SponsorIncludedResource>[] = [],
    ): readonly Sponsor[] => {
      const includedMap = new Map<
        string,
        S.Schema.Type<typeof SponsorIncludedResource>
      >(included.map((item) => [`${item.type}:${item.id}`, item]));

      return data.map((sponsor) => {
        // Resolve sponsor logo: media--image -> file--file -> URL
        const mediaRef = sponsor.relationships.field_media_image?.data;
        const resolvedMediaImage = (() => {
          if (!mediaRef || !("id" in mediaRef) || !("type" in mediaRef)) {
            return sponsor.relationships.field_media_image;
          }

          const media = includedMap.get(`media--image:${mediaRef.id}`);
          if (!media || media.type !== "media--image") {
            return sponsor.relationships.field_media_image;
          }

          // Decode media to ensure it's a valid MediaImage
          const decodedMedia = S.decodeUnknownSync(MediaImage)(media);
          const fileRef = decodedMedia.relationships?.field_media_image?.data;
          if (!fileRef) {
            return sponsor.relationships.field_media_image;
          }

          const file = includedMap.get(`file--file:${fileRef.id}`);
          if (!file || file.type !== "file--file") {
            return sponsor.relationships.field_media_image;
          }

          // Decode file to ensure it's a valid File
          const decodedFile = S.decodeUnknownSync(File)(file);
          const fileUrl = decodedFile.attributes.uri.url;
          const absoluteUrl = fileUrl.startsWith("http")
            ? fileUrl
            : `${baseUrl}${fileUrl}`;

          return {
            data: {
              uri: { url: absoluteUrl },
              alt: fileRef.meta?.alt || sponsor.attributes.title,
              width: fileRef.meta?.width,
              height: fileRef.meta?.height,
            },
          };
        })();

        // Return sponsor with resolved relationships
        return {
          ...sponsor,
          relationships: {
            ...sponsor.relationships,
            field_media_image: resolvedMediaImage,
          },
        };
      });
    };

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

        const response = yield* fetchJson(url, TaxonomyTermsResponse);

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
      getSponsors,
      getTags,
    };
  }),
);
