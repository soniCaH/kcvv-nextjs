/**
 * Common Drupal JSON:API Schema Types
 * Used across multiple content types
 */

import { Schema as S } from 'effect'

/**
 * Flexible date schema that accepts both ISO date strings and Date objects
 * Useful for handling data that may have been serialized/deserialized
 *
 * - Decoding: Accepts both string and Date, outputs Date
 * - Encoding: Accepts Date, outputs ISO string
 */
export const DateFromStringOrDate = S.Union(
  S.DateFromString,  // Handles string → Date (decode) and Date → string (encode)
  S.DateFromSelf     // Handles Date → Date (passthrough)
)

/**
 * Drupal JSON:API Image field structure
 * Plain struct (not class) since API returns plain objects
 */
export const DrupalImage = S.Struct({
  uri: S.Struct({
    url: S.String,
  }),
  alt: S.optional(S.String),
  title: S.optional(S.String),
  width: S.optional(S.Number),
  height: S.optional(S.Number),
})

/**
 * Drupal path alias structure
 */
export class DrupalPath extends S.Class<DrupalPath>('DrupalPath')({
  alias: S.String,
  pid: S.optional(S.Number),
  langcode: S.optional(S.String),
}) {}

/**
 * Drupal body/text field with processed HTML
 */
export class DrupalBody extends S.Class<DrupalBody>('DrupalBody')({
  value: S.String,
  format: S.optional(S.String),
  processed: S.String,
  summary: S.optional(S.String),
}) {}

/**
 * Drupal taxonomy term reference
 */
export class DrupalTermReference extends S.Class<DrupalTermReference>('DrupalTermReference')({
  id: S.String,
  type: S.String,
}) {}

/**
 * Drupal node reference
 */
export class DrupalNodeReference extends S.Class<DrupalNodeReference>('DrupalNodeReference')({
  id: S.String,
  type: S.String,
}) {}

/**
 * JSON:API Relationship Metadata
 *
 * Contains additional metadata about a relationship reference.
 * Commonly used for image fields to store alt text, dimensions, etc.
 *
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 *
 * @example
 * ```typescript
 * // Image reference with alt text
 * {
 *   data: {
 *     id: "file-123",
 *     type: "file--file",
 *     meta: {
 *       alt: "Team photo 2024",
 *       width: 1920,
 *       height: 1080
 *     }
 *   }
 * }
 * ```
 */
export class RelationshipMeta extends S.Class<RelationshipMeta>('RelationshipMeta')({
  /**
   * Alt text for images
   */
  alt: S.optional(S.String),

  /**
   * Title text for images/links
   */
  title: S.optional(S.String),

  /**
   * Image width in pixels
   */
  width: S.optional(S.Number),

  /**
   * Image height in pixels
   */
  height: S.optional(S.Number),
}) {}

/**
 * JSON:API Relationship Reference with Metadata
 *
 * A relationship reference that includes optional metadata.
 * Used when the relationship carries additional information beyond just the ID.
 *
 * @example
 * ```typescript
 * {
 *   id: "file-abc-123",
 *   type: "file--file",
 *   meta: {
 *     alt: "Homepage hero image",
 *     width: 1920,
 *     height: 1080
 *   }
 * }
 * ```
 */
export class RelationshipReference extends S.Class<RelationshipReference>('RelationshipReference')({
  id: S.String,
  type: S.String,
  meta: S.optional(RelationshipMeta),
}) {}

/**
 * Base attributes shared by all Drupal nodes
 */
export const BaseDrupalNodeAttributes = {
  drupal_internal__nid: S.optional(S.Number),
  drupal_internal__vid: S.optional(S.Number),
  langcode: S.optional(S.String),
  revision_timestamp: S.optional(DateFromStringOrDate),
  status: S.optional(S.Boolean),
  title: S.String,
  created: DateFromStringOrDate,
  changed: S.optional(DateFromStringOrDate),
  promote: S.optional(S.Boolean),
  sticky: S.optional(S.Boolean),
  path: DrupalPath,
}

/**
 * JSON:API version object
 * Part of the JSON:API specification metadata
 * @see https://jsonapi.org/format/#document-jsonapi-object
 */
export class JsonApiVersion extends S.Class<JsonApiVersion>('JsonApiVersion')({
  version: S.String,
  meta: S.optional(S.Unknown), // Vendor-specific extensions
}) {}

/**
 * JSON:API link object
 * Individual link with href and optional metadata
 */
export class JsonApiLink extends S.Class<JsonApiLink>('JsonApiLink')({
  href: S.String,
  meta: S.optional(S.Unknown),
}) {}

/**
 * JSON:API links object
 * Pagination and self links for collections
 * @see https://jsonapi.org/format/#document-links
 */
export class JsonApiLinks extends S.Class<JsonApiLinks>('JsonApiLinks')({
  self: S.optional(JsonApiLink),
  next: S.optional(JsonApiLink),
  prev: S.optional(JsonApiLink),
  first: S.optional(JsonApiLink),
  last: S.optional(JsonApiLink),
}) {}

/**
 * Base JSON:API resource
 * Fallback type for resources that don't have a specific schema
 * Used in discriminated unions when the exact type isn't known
 */
export class DrupalResource extends S.Class<DrupalResource>('DrupalResource')({
  id: S.String,
  type: S.String,
  attributes: S.optional(S.Unknown), // Attributes vary by resource type
  relationships: S.optional(S.Unknown), // Relationships vary by resource type
  links: S.optional(S.Unknown),
}) {}
