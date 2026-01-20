/**
 * Drupal Player (node--player) Schema
 *
 * Player profiles with information about:
 * - Name, position, number
 * - Birth date, nationality
 * - Physical stats (height, weight)
 * - Profile image
 * - Team association
 * - Bio content
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from "effect";
import {
  BaseDrupalNodeAttributes,
  DateFromStringOrDate,
  DrupalBody,
  DrupalImage,
  DrupalNodeReference,
  JsonApiVersion,
  JsonApiLinks,
  DrupalResource,
} from "./common.schema";
import { MediaImage } from "./media.schema";
import { File } from "./file.schema";
import { Team } from "./team.schema";

/**
 * Player node attributes
 */
export class PlayerAttributes extends S.Class<PlayerAttributes>(
  "PlayerAttributes",
)({
  ...BaseDrupalNodeAttributes,
  field_firstname: S.optional(S.String),
  field_lastname: S.optional(S.String),
  field_position: S.optional(S.String),
  field_shirtnumber: S.optional(S.Number),
  field_birth_date: S.optional(DateFromStringOrDate),
  field_nationality: S.optional(S.String),
  field_height: S.optional(S.Number),
  field_weight: S.optional(S.Number),
  body: S.optional(DrupalBody),
}) {}

/**
 * Player relationships
 *
 * Defines relationships to other entities:
 * - field_image: Player profile photo (can be resolved DrupalImage or reference)
 * - field_team: Team association
 */
export class PlayerRelationships extends S.Class<PlayerRelationships>(
  "PlayerRelationships",
)({
  /**
   * Player profile image
   * Can be either:
   * - DrupalImage: Fully resolved with uri.url (after mapIncluded processing)
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_image: S.optional(
    S.Struct({
      data: S.optional(
        S.Union(
          DrupalImage,
          S.Struct({
            type: S.Literal("media--image"),
            id: S.String,
          }),
        ),
      ),
    }),
  ),

  /**
   * Team association
   * Can be either:
   * - Team: Fully resolved team entity
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_team: S.optional(
    S.Struct({
      data: S.optional(S.Union(Team, DrupalNodeReference)),
    }),
  ),
}) {}

/**
 * Complete Player node
 */
export class Player extends S.Class<Player>("Player")({
  id: S.String,
  type: S.Literal("node--player"),
  attributes: PlayerAttributes,
  relationships: PlayerRelationships,
}) {}

/**
 * Array of players
 */
export const PlayersArray = S.Array(Player);

/**
 * Discriminated union of all possible included resource types for players
 *
 * When fetching players with ?include=field_image.field_media_image,field_team
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the player image
 * - File: The actual image file with URL
 * - Team: The team this player belongs to
 * - DrupalResource: Fallback for unknown/future types
 *
 * This union provides full type safety and runtime validation for included entities.
 *
 * @example
 * ```typescript
 * const included: PlayerIncludedResource[] = response.included || []
 *
 * included.forEach(resource => {
 *   if (resource.type === 'media--image') {
 *     // TypeScript knows this is MediaImage
 *     console.log(resource.attributes.name)
 *   } else if (resource.type === 'file--file') {
 *     // TypeScript knows this is File
 *     console.log(resource.attributes.uri.url)
 *   } else if (resource.type === 'node--team') {
 *     // TypeScript knows this is Team
 *     console.log(resource.attributes.title)
 *   }
 * })
 * ```
 */
export const PlayerIncludedResource = S.Union(
  MediaImage,
  File,
  Team,
  DrupalResource, // Fallback for unknown types
);

/**
 * Drupal JSON:API response for player collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of player entities
 * - included: Related entities (media, files, teams)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 *
 * @example
 * ```typescript
 * const response: PlayersResponse = await fetch('/jsonapi/node/player')
 * const players = response.data  // Player[]
 * const links = response.links  // JsonApiLinks
 * ```
 */
export class PlayersResponse extends S.Class<PlayersResponse>(
  "PlayersResponse",
)({
  data: PlayersArray,
  included: S.optional(S.Array(PlayerIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    }),
  ),
}) {}

/**
 * Drupal JSON:API response for single player
 *
 * Similar to PlayersResponse but data is a single Player instead of array.
 * Used when fetching by slug/ID.
 *
 * @example
 * ```typescript
 * const response: PlayerResponse = await fetch('/jsonapi/node/player/abc-123')
 * const player = response.data  // Player (not array)
 * ```
 */
export class PlayerResponse extends S.Class<PlayerResponse>("PlayerResponse")({
  data: Player,
  included: S.optional(S.Array(PlayerIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
