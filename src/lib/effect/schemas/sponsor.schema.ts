/**
 * Drupal Sponsor (node--sponsor) Schema
 *
 * Sponsor entities from the Drupal CMS.
 *
 * Sponsor entities include:
 * - Title (sponsor name)
 * - Logo image (via media--image entity)
 * - Website URL
 * - Sponsor type/tier (crossing, training, white, green, panel, other)
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from 'effect'
import {
  BaseDrupalNodeAttributes,
  DrupalImage,
  DrupalResource,
  JsonApiVersion,
  JsonApiLinks,
} from './common.schema'
import { MediaImage } from './media.schema'
import { File } from './file.schema'

/**
 * Sponsor Type/Tier
 * Different sponsor categories based on sponsorship level
 */
export const SponsorType = S.Literal('crossing', 'training', 'white', 'green', 'panel', 'other')

export type SponsorTypeEnum = S.Schema.Type<typeof SponsorType>

/**
 * Sponsor node attributes
 */
export class SponsorAttributes extends S.Class<SponsorAttributes>('SponsorAttributes')({
  ...BaseDrupalNodeAttributes,
  field_type: S.optional(SponsorType),
  field_website: S.optional(
    S.NullOr(
      S.Struct({
        uri: S.String,
        title: S.optional(S.String),
        options: S.optional(S.Unknown),
      })
    )
  ),
}) {}

/**
 * Sponsor relationships
 *
 * Defines relationships to other entities:
 * - field_media_image: Sponsor logo (can be resolved DrupalImage or reference)
 * - uid: Author user reference
 * - node_type: Drupal internal bundle reference
 * - revision_uid: User who created this revision
 */
export class SponsorRelationships extends S.Class<SponsorRelationships>('SponsorRelationships')({
  /**
   * Sponsor logo image
   * Can be either:
   * - DrupalImage: Fully resolved with uri.url (after mapIncluded processing)
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_media_image: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Union(
            DrupalImage,
            S.Struct({
              type: S.Literal('media--image'),
              id: S.String,
            })
          )
        )
      ),
    })
  ),

  /**
   * Sponsor author (user entity)
   */
  uid: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal('user--user'),
        })
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    })
  ),

  /**
   * Drupal internal node type reference
   * Points to node_type--node_type bundle config
   */
  node_type: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal('node_type--node_type'),
        })
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    })
  ),

  /**
   * User who created this revision
   */
  revision_uid: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal('user--user'),
        })
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    })
  ),
}) {}

/**
 * Complete Sponsor node
 */
export class Sponsor extends S.Class<Sponsor>('Sponsor')({
  id: S.String,
  type: S.Literal('node--sponsor'),
  attributes: SponsorAttributes,
  relationships: SponsorRelationships,
}) {}

/**
 * Array of sponsors
 */
export const SponsorsArray = S.Array(Sponsor)

/**
 * Discriminated union of all possible included resource types for sponsors
 *
 * When fetching sponsors with ?include=field_media_image.field_media_image
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the image
 * - File: The actual image file with URL
 * - DrupalResource: Fallback for unknown/future types
 *
 * This union provides full type safety and runtime validation for included entities.
 *
 * @example
 * ```typescript
 * const included: SponsorIncludedResource[] = response.included || []
 *
 * included.forEach(resource => {
 *   if (resource.type === 'media--image') {
 *     // TypeScript knows this is MediaImage
 *     console.log(resource.attributes.name)
 *   } else if (resource.type === 'file--file') {
 *     // TypeScript knows this is File
 *     console.log(resource.attributes.uri.url)
 *   }
 * })
 * ```
 */
export const SponsorIncludedResource = S.Union(
  MediaImage,
  File,
  DrupalResource // Fallback for unknown types
)

/**
 * Drupal JSON:API response for sponsor collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of sponsor entities
 * - included: Related entities (media, files)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 *
 * @example
 * ```typescript
 * const response: SponsorsResponse = await fetch('/jsonapi/node/sponsor')
 * const sponsors = response.data  // Sponsor[]
 * const links = response.links     // JsonApiLinks
 * ```
 */
export class SponsorsResponse extends S.Class<SponsorsResponse>('SponsorsResponse')({
  data: SponsorsArray,
  included: S.optional(S.Array(SponsorIncludedResource)), // ✅ Strongly typed
  jsonapi: S.optional(JsonApiVersion), // ✅ Strongly typed
  links: S.optional(JsonApiLinks), // ✅ Strongly typed
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    })
  ),
}) {}

/**
 * Drupal JSON:API response for single sponsor
 *
 * Similar to SponsorsResponse but data is a single Sponsor instead of array.
 * Used when fetching by slug/ID.
 *
 * @example
 * ```typescript
 * const response: SponsorResponse = await fetch('/jsonapi/node/sponsor/abc-123')
 * const sponsor = response.data  // Sponsor (not array)
 * ```
 */
export class SponsorResponse extends S.Class<SponsorResponse>('SponsorResponse')({
  data: Sponsor,
  included: S.optional(S.Array(SponsorIncludedResource)), // ✅ Strongly typed
  jsonapi: S.optional(JsonApiVersion), // ✅ Strongly typed
  links: S.optional(JsonApiLinks), // ✅ Strongly typed
}) {}
