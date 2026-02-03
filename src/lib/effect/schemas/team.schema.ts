/**
 * Drupal Team (node--team) Schema
 *
 * Football team pages with information about:
 * - Team ID and league information
 * - Team image
 * - Player roster references
 * - Body content
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from "effect";
import {
  BaseDrupalNodeAttributes,
  DrupalBody,
  DrupalImage,
  JsonApiVersion,
  JsonApiLinks,
  DrupalResource,
} from "./common.schema";
import { MediaImage } from "./media.schema";
import { File } from "./file.schema";

/**
 * Team node attributes
 */
export class TeamAttributes extends S.Class<TeamAttributes>("TeamAttributes")({
  ...BaseDrupalNodeAttributes,
  field_league_id: S.optional(S.Number),
  field_league: S.optional(S.String),
  field_division: S.optional(S.String),
  field_season: S.optional(S.String),
  body: S.optional(DrupalBody),
  /** Footbalisto team ID (displayed as watermark) - string like "3B" */
  field_fb_id: S.optional(S.NullOr(S.String)),
  /** Secondary Footbalisto ID (for teams in multiple leagues) */
  field_fb_id_2: S.optional(S.NullOr(S.String)),
  /** VoetbalVlaanderen ID (used for matches/rankings API) - string like "1" */
  field_vv_id: S.optional(S.NullOr(S.String)),
  /** Secondary VoetbalVlaanderen ID (for teams in multiple leagues) */
  field_vv_id_2: S.optional(S.NullOr(S.String)),
  /** Full division name (e.g., "3de Afdeling VV B") */
  field_division_full: S.optional(S.NullOr(S.String)),
  /** Team tagline or motto */
  field_tagline: S.optional(S.NullOr(S.String)),
  /** Contact info HTML content */
  field_contact_info: S.optional(S.NullOr(DrupalBody)),
}) {}

/**
 * Team relationships
 *
 * Defines relationships to other entities:
 * - field_media_article_image: Team photo (can be resolved DrupalImage or reference)
 * - field_image: Alternative image field (for compatibility)
 * - field_players: Player roster references
 * - field_staff: Staff member references (coaches, trainers)
 */
export class TeamRelationships extends S.Class<TeamRelationships>(
  "TeamRelationships",
)({
  /**
   * Team image (via media entity)
   * Can be either:
   * - DrupalImage: Fully resolved with uri.url (after mapIncluded processing)
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_media_article_image: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Union(
            DrupalImage,
            S.Struct({
              type: S.Literal("media--image"),
              id: S.String,
            }),
          ),
        ),
      ),
    }),
  ),

  /**
   * Alternative team image field (for backward compatibility)
   */
  field_image: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Union(
            DrupalImage,
            S.Struct({
              type: S.Literal("media--image"),
              id: S.String,
            }),
          ),
        ),
      ),
    }),
  ),

  /**
   * Team players
   * Array of player references
   */
  field_players: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Array(
            S.Struct({
              id: S.String,
              type: S.Literal("node--player"),
            }),
          ),
        ),
      ),
    }),
  ),

  /**
   * Staff members (coaches, trainers)
   * Can be either node--player or node--staff depending on Drupal config
   */
  field_staff: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Array(
            S.Struct({
              id: S.String,
              type: S.Union(
                S.Literal("node--player"),
                S.Literal("node--staff"),
              ),
            }),
          ),
        ),
      ),
    }),
  ),
}) {}

/**
 * Complete Team node
 */
export class Team extends S.Class<Team>("Team")({
  id: S.String,
  type: S.Literal("node--team"),
  attributes: TeamAttributes,
  relationships: TeamRelationships,
}) {}

/**
 * Array of teams
 */
export const TeamsArray = S.Array(Team);

/**
 * Discriminated union of all possible included resource types for teams
 *
 * When fetching teams with include parameters, the response includes
 * various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the team image
 * - File: The actual image file with URL
 * - DrupalResource: Fallback for players, staff, and other types
 *
 * Note: Players and staff (node--player) are handled via DrupalResource fallback
 * to avoid circular dependencies, then decoded separately when needed.
 *
 * @example
 * ```typescript
 * const included: TeamIncludedResource[] = response.included || []
 *
 * included.forEach(resource => {
 *   if (resource.type === 'media--image') {
 *     console.log(resource.attributes.name)
 *   } else if (resource.type === 'file--file') {
 *     console.log(resource.attributes.uri.url)
 *   } else if (resource.type === 'node--player') {
 *     // Decode as Player separately
 *   }
 * })
 * ```
 */
export const TeamIncludedResource = S.Union(
  MediaImage,
  File,
  DrupalResource, // Fallback for players, staff, and other types
);

/**
 * Drupal JSON:API response for team collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of team entities
 * - included: Related entities (media, files)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 *
 * @example
 * ```typescript
 * const response: TeamsResponse = await fetch('/jsonapi/node/team')
 * const teams = response.data  // Team[]
 * const links = response.links  // JsonApiLinks
 * ```
 */
export class TeamsResponse extends S.Class<TeamsResponse>("TeamsResponse")({
  data: TeamsArray,
  included: S.optional(S.Array(TeamIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    }),
  ),
}) {}

/**
 * Drupal JSON:API response for single team
 *
 * Similar to TeamsResponse but data is a single Team instead of array.
 * Used when fetching by slug/ID.
 *
 * @example
 * ```typescript
 * const response: TeamResponse = await fetch('/jsonapi/node/team/abc-123')
 * const team = response.data  // Team (not array)
 * ```
 */
export class TeamResponse extends S.Class<TeamResponse>("TeamResponse")({
  data: Team,
  included: S.optional(S.Array(TeamIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
