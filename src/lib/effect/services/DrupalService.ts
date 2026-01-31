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
  TeamIncludedResource,
  Player,
  PlayersResponse,
  PlayerResponse,
  PlayerIncludedResource,
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
 * Extended team data including resolved staff and players
 */
export interface TeamWithRoster {
  team: Team;
  staff: readonly Player[];
  players: readonly Player[];
  teamImageUrl?: string;
}

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

    readonly getTeamWithRoster: (
      slug: string,
    ) => Effect.Effect<
      TeamWithRoster,
      DrupalError | NotFoundError | ValidationError
    >;

    readonly getTeamWithRosterById: (
      id: string,
    ) => Effect.Effect<
      TeamWithRoster,
      DrupalError | NotFoundError | ValidationError
    >;

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
     *
     * Uses Decoupled Router to resolve slug to UUID, then fetches by ID.
     * This is a 2-request approach but much faster than filter[path.alias]
     * which can cause timeouts with complex includes.
     */
    const getTeamBySlug = (slug: string) =>
      Effect.gen(function* () {
        const path = slug.startsWith("/") ? slug : `/team/${slug}`;

        // Step 1: Resolve path to entity UUID via Decoupled Router
        const routerResult = yield* resolvePathAlias(path).pipe(
          Effect.mapError((error) => {
            if (error instanceof NotFoundError) {
              return new NotFoundError({
                resource: "team",
                identifier: slug,
                message: `Team with slug "${slug}" not found`,
              });
            }
            return error;
          }),
        );

        // Verify it's a team
        if (
          routerResult.entity.type !== "node" ||
          routerResult.entity.bundle !== "team"
        ) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "team",
              identifier: slug,
              message: `Path "${slug}" is not a team`,
            }),
          );
        }

        // Step 2: Fetch full team data by UUID
        const team = yield* getTeamById(routerResult.entity.uuid);
        return team;
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
     * Map included data for teams
     *
     * Resolves team image from included media/file resources.
     *
     * @param team - Team entity
     * @param included - Array of related entities from JSON:API included section
     * @returns Object with resolved team image URL
     */
    const mapTeamIncluded = (
      team: Team,
      included: readonly S.Schema.Type<typeof TeamIncludedResource>[] = [],
    ): { teamImageUrl?: string } => {
      const includedMap = new Map<
        string,
        S.Schema.Type<typeof TeamIncludedResource>
      >(included.map((item) => [`${item.type}:${item.id}`, item]));

      // Resolve team image: media--image -> file--file -> URL
      const mediaRef = team.relationships.field_image?.data;
      if (!mediaRef || !("id" in mediaRef) || !("type" in mediaRef)) {
        return {};
      }

      const media = includedMap.get(`media--image:${mediaRef.id}`);
      if (!media || media.type !== "media--image") {
        return {};
      }

      const decodedMedia = S.decodeUnknownSync(MediaImage)(media);
      const fileRef = decodedMedia.relationships?.field_media_image?.data;
      if (!fileRef) {
        return {};
      }

      const file = includedMap.get(`file--file:${fileRef.id}`);
      if (!file || file.type !== "file--file") {
        return {};
      }

      const decodedFile = S.decodeUnknownSync(File)(file);
      const fileUrl = decodedFile.attributes.uri.url;
      const absoluteUrl = fileUrl.startsWith("http")
        ? fileUrl
        : `${baseUrl}${fileUrl}`;

      return { teamImageUrl: absoluteUrl };
    };

    /**
     * Extract and decode players from included resources
     *
     * Filters included resources for player nodes and decodes them.
     * Also resolves player images from the included array.
     *
     * @param playerIds - Array of player IDs to extract
     * @param included - Array of related entities from JSON:API included section
     * @returns Array of decoded Player entities with resolved images
     */
    const extractPlayersFromIncluded = (
      playerIds: readonly string[],
      included: readonly S.Schema.Type<typeof TeamIncludedResource>[] = [],
    ): readonly Player[] => {
      // Build a map of player ID -> included item for quick lookup
      const playerMap = new Map<
        string,
        S.Schema.Type<typeof TeamIncludedResource>
      >();
      for (const item of included) {
        if (item.type === "node--player") {
          playerMap.set(item.id, item);
        }
      }

      // Extract players in the order specified by playerIds (preserves relationship order)
      const players: Player[] = [];
      for (const id of playerIds) {
        const item = playerMap.get(id);
        if (item) {
          try {
            const decoded = S.decodeUnknownSync(Player)(item);
            players.push(decoded);
          } catch {
            // Skip invalid player data
          }
        }
      }

      // Then resolve their images using mapPlayerIncluded
      // Convert TeamIncludedResource to PlayerIncludedResource (they're compatible)
      const playerIncluded = included.map(
        (item) =>
          item as unknown as S.Schema.Type<typeof PlayerIncludedResource>,
      );
      return mapPlayerIncluded(players, playerIncluded);
    };

    /**
     * Get team with full roster by ID (UUID)
     *
     * Fetches a team by UUID and resolves all related data:
     * - Team image
     * - Staff members with their images
     * - Players with their images
     *
     * This is the core method used by getTeamWithRoster after resolving the slug.
     */
    const getTeamWithRosterById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/team/${id}`, {
          include: [
            // Team image: media -> file
            "field_image.field_media_image",
            // Staff images: direct file reference
            "field_staff.field_image",
            // Staff images: nested media -> file (when field_image is media--image)
            "field_staff.field_image.field_media_image",
            // Player images: direct file reference
            "field_players.field_image",
            // Player images: nested media -> file (when field_image is media--image)
            "field_players.field_image.field_media_image",
          ].join(","),
        });
        const response = yield* fetchJson(url, TeamResponse);

        const team = response.data;
        const included = response.included || [];

        // Resolve team image
        const { teamImageUrl } = mapTeamIncluded(team, included);

        // Extract staff member IDs
        const staffIds =
          team.relationships.field_staff?.data?.map((ref) => ref.id) || [];
        const staff = extractPlayersFromIncluded(staffIds, included);

        // Extract player IDs
        const playerIds =
          team.relationships.field_players?.data?.map((ref) => ref.id) || [];
        const players = extractPlayersFromIncluded(playerIds, included);

        return {
          team,
          staff,
          players,
          teamImageUrl,
        };
      });

    /**
     * Get team with full roster (staff + players) by slug
     *
     * Uses Decoupled Router to resolve slug to UUID, then fetches by ID.
     * This 2-step approach is much faster than filter[path.alias] which
     * can cause timeouts with complex includes.
     */
    const getTeamWithRoster = (slug: string) =>
      Effect.gen(function* () {
        const path = slug.startsWith("/") ? slug : `/team/${slug}`;

        // Step 1: Resolve path to entity UUID via Decoupled Router
        const routerResult = yield* resolvePathAlias(path).pipe(
          Effect.mapError((error) => {
            if (error instanceof NotFoundError) {
              return new NotFoundError({
                resource: "team",
                identifier: slug,
                message: `Team with slug "${slug}" not found`,
              });
            }
            return error;
          }),
        );

        // Verify it's a team
        if (
          routerResult.entity.type !== "node" ||
          routerResult.entity.bundle !== "team"
        ) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "team",
              identifier: slug,
              message: `Path "${slug}" is not a team`,
            }),
          );
        }

        // Step 2: Fetch full team data with roster by UUID
        return yield* getTeamWithRosterById(routerResult.entity.uuid);
      });

    /**
     * Map included data for players
     *
     * Resolves image references in player relationships to their actual URLs.
     * Handles both reference types:
     * - file--file: Direct file references resolved via includedMap lookup
     * - media--image: Media entities resolved by following the nested
     *   field_media_image relationship to the underlying file--file
     *
     * @param data - Array of player entities
     * @param included - Array of related entities from JSON:API included section
     * @returns Players with resolved image URLs
     */
    const mapPlayerIncluded = (
      data: readonly Player[],
      included: readonly S.Schema.Type<typeof PlayerIncludedResource>[] = [],
    ): readonly Player[] => {
      const includedMap = new Map<
        string,
        S.Schema.Type<typeof PlayerIncludedResource>
      >(included.map((item) => [`${item.type}:${item.id}`, item]));

      return data.map((player) => {
        // Resolve player image reference (file--file or media--image) to URL
        const fileRef = player.relationships.field_image?.data;
        const resolvedImage = (() => {
          if (!fileRef || !("id" in fileRef) || !("type" in fileRef)) {
            return player.relationships.field_image;
          }

          // Handle file--file references
          if (fileRef.type === "file--file") {
            const file = includedMap.get(`file--file:${fileRef.id}`);
            if (!file || file.type !== "file--file") {
              return player.relationships.field_image;
            }

            // Decode file to ensure it's valid
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
          }

          // Handle media--image references
          // Schema validation ensures fileRef.type is "media--image" here
          const media = includedMap.get(`media--image:${fileRef.id}`);
          if (!media || media.type !== "media--image") {
            return player.relationships.field_image;
          }

          const decodedMedia = S.decodeUnknownSync(MediaImage)(media);
          const mediaFileRef =
            decodedMedia.relationships?.field_media_image?.data;
          if (!mediaFileRef) {
            return player.relationships.field_image;
          }

          const file = includedMap.get(`file--file:${mediaFileRef.id}`);
          if (!file || file.type !== "file--file") {
            return player.relationships.field_image;
          }

          const decodedFile = S.decodeUnknownSync(File)(file);
          const fileUrl = decodedFile.attributes.uri.url;
          const absoluteUrl = fileUrl.startsWith("http")
            ? fileUrl
            : `${baseUrl}${fileUrl}`;

          return {
            data: {
              uri: { url: absoluteUrl },
              alt: mediaFileRef.meta?.alt || "",
              width: mediaFileRef.meta?.width,
              height: mediaFileRef.meta?.height,
            },
          };
        })();

        return {
          ...player,
          relationships: {
            ...player.relationships,
            field_image: resolvedImage,
          },
        };
      });
    };

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
          include: "field_image",
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
          players: mapPlayerIncluded(response.data, response.included),
          links: response.links,
        };
      });

    /**
     * Schema for Decoupled Router response
     */
    const RouterResponse = S.Struct({
      resolved: S.String,
      isHomePath: S.Boolean,
      entity: S.Struct({
        canonical: S.String,
        type: S.String,
        bundle: S.String,
        id: S.String,
        uuid: S.String,
      }),
      label: S.String,
      jsonapi: S.Struct({
        individual: S.String,
        resourceName: S.String,
        pathPrefix: S.optional(S.String),
        basePath: S.String,
        entryPoint: S.String,
      }),
    });

    /**
     * Resolve a path alias to entity info using Decoupled Router
     *
     * Uses the same retry and timeout pattern as fetchJson for resilience.
     * Returns NotFoundError for 404 responses (non-retryable).
     */
    const resolvePathAlias = (path: string) => {
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      const url = `${baseUrl}/router/translate-path?path=${encodeURIComponent(normalizedPath)}&_format=json`;

      return Effect.gen(function* () {
        const response = yield* Effect.tryPromise({
          try: () =>
            fetch(url, {
              headers: { Accept: "application/json" },
              next: { revalidate: 3600 },
            }),
          catch: (error) =>
            new DrupalError({
              status: 0,
              message: `Network error fetching ${url}: ${error instanceof Error ? error.message : "Unknown error"}`,
            }),
        });

        // Handle 404 specially - this is not retryable
        if (response.status === 404) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "path",
              identifier: path,
              message: `Path "${path}" not found`,
            }),
          );
        }

        if (!response.ok) {
          return yield* Effect.fail(
            new DrupalError({
              status: response.status,
              message: `HTTP ${response.status} fetching ${url}`,
            }),
          );
        }

        const json = yield* Effect.tryPromise({
          try: () => response.json(),
          catch: () =>
            new DrupalError({
              status: response.status,
              message: `Failed to parse JSON response from ${url}`,
            }),
        });

        return yield* S.decodeUnknown(RouterResponse)(json).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError({
                message: `Router response validation failed: ${error.message}`,
                errors: [],
              }),
          ),
        );
      }).pipe(
        // Retry on DrupalError (network/HTTP errors), but not on NotFoundError or ValidationError
        Effect.retry({
          schedule: Schedule.exponential("1 second").pipe(
            Schedule.intersect(Schedule.recurs(3)),
          ),
          while: (error) => error instanceof DrupalError,
        }),
        Effect.timeout("30 seconds"),
        Effect.mapError((error) => {
          if (error._tag === "TimeoutException") {
            return new DrupalError({
              message: `Router request timed out after 30 seconds for path "${path}"`,
              cause: error,
            });
          }
          return error;
        }),
      );
    };

    /**
     * Get player by path alias
     *
     * Uses Decoupled Router to resolve slug to UUID, then fetches by ID.
     * This is a 2-request approach but much more efficient than paginating
     * through all players.
     */
    const getPlayerBySlug = (slug: string) =>
      Effect.gen(function* () {
        const path = slug.startsWith("/") ? slug : `/player/${slug}`;

        // Step 1: Resolve path to entity UUID via Decoupled Router
        const routerResult = yield* resolvePathAlias(path).pipe(
          Effect.mapError((error) => {
            if (error instanceof NotFoundError) {
              return new NotFoundError({
                resource: "player",
                identifier: slug,
                message: `Player with slug "${slug}" not found`,
              });
            }
            return error;
          }),
        );

        // Verify it's a player
        if (
          routerResult.entity.type !== "node" ||
          routerResult.entity.bundle !== "player"
        ) {
          return yield* Effect.fail(
            new NotFoundError({
              resource: "player",
              identifier: slug,
              message: `Path "${slug}" is not a player`,
            }),
          );
        }

        // Step 2: Fetch full player data by UUID
        const player = yield* getPlayerById(routerResult.entity.uuid);
        return player;
      });

    /**
     * Get player by ID (UUID)
     */
    const getPlayerById = (id: string) =>
      Effect.gen(function* () {
        const url = buildUrl(`node/player/${id}`, {
          include: "field_image",
        });
        const response = yield* fetchJson(url, PlayerResponse);
        const mapped = mapPlayerIncluded([response.data], response.included);
        return mapped[0];
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
      getTeamWithRoster,
      getTeamWithRosterById,
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
