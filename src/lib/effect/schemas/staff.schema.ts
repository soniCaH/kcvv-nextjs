/**
 * Drupal Staff (node--staff) Schema
 *
 * Staff member profiles with information about:
 * - Name, position, role
 * - Birth date, join date
 * - Profile image
 * - Bio content
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from 'effect'
import {
  BaseDrupalNodeAttributes,
  DateFromStringOrDate,
  DrupalBody,
  DrupalImage,
  JsonApiVersion,
  JsonApiLinks,
  DrupalResource,
} from './common.schema'
import { MediaImage } from './media.schema'
import { File } from './file.schema'

/**
 * Staff node attributes
 */
export class StaffAttributes extends S.Class<StaffAttributes>('StaffAttributes')({
  ...BaseDrupalNodeAttributes,
  field_firstname: S.optional(S.String),
  field_lastname: S.optional(S.String),
  field_position_staff: S.optional(S.String),
  field_position_short: S.optional(S.String),
  field_birth_date: S.optional(DateFromStringOrDate),
  field_join_date: S.optional(DateFromStringOrDate),
  field_vv_id: S.optional(S.String),
  body: S.optional(DrupalBody),
}) {}

/**
 * Staff relationships
 *
 * Defines relationships to other entities:
 * - field_image: Staff profile photo (can be resolved DrupalImage or reference)
 */
export class StaffRelationships extends S.Class<StaffRelationships>('StaffRelationships')({
  /**
   * Staff profile image
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
            type: S.Literal('media--image'),
            id: S.String,
          })
        )
      ),
    })
  ),
}) {}

/**
 * Complete Staff node
 */
export class Staff extends S.Class<Staff>('Staff')({
  id: S.String,
  type: S.Literal('node--staff'),
  attributes: StaffAttributes,
  relationships: StaffRelationships,
}) {}

/**
 * Array of staff members
 */
export const StaffArray = S.Array(Staff)

/**
 * Discriminated union of all possible included resource types for staff
 *
 * When fetching staff with ?include=field_image.field_media_image
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the staff image
 * - File: The actual image file with URL
 * - DrupalResource: Fallback for unknown/future types
 *
 * This union provides full type safety and runtime validation for included entities.
 */
export const StaffIncludedResource = S.Union(
  MediaImage,
  File,
  DrupalResource // Fallback for unknown types
)

/**
 * Drupal JSON:API response for staff collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of staff entities
 * - included: Related entities (media, files)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 */
export class StaffResponse extends S.Class<StaffResponse>('StaffResponse')({
  data: StaffArray,
  included: S.optional(S.Array(StaffIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    })
  ),
}) {}

/**
 * Drupal JSON:API response for single staff member
 *
 * Similar to StaffResponse but data is a single Staff instead of array.
 * Used when fetching by slug/ID.
 */
export class SingleStaffResponse extends S.Class<SingleStaffResponse>('SingleStaffResponse')({
  data: Staff,
  included: S.optional(S.Array(StaffIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
