/**
 * Drupal Media Entity Schemas
 *
 * Media entities in Drupal are wrappers around files that provide additional
 * metadata and reusability. Common media types include:
 * - media--image: Images with alt text, captions
 * - media--video: Video embeds
 * - media--document: PDF/document files
 *
 * This file defines schemas for media entities as they appear in JSON:API responses,
 * particularly in the "included" section when using include parameters.
 *
 * @see https://www.drupal.org/docs/8/core/modules/media
 */

import { Schema as S } from 'effect'
import { DrupalPath } from './common.schema'

/**
 * Media Image attributes
 *
 * Drupal's media--image bundle stores images with additional metadata.
 * The actual file reference is in relationships.field_media_image
 *
 * @example
 * ```typescript
 * {
 *   drupal_internal__mid: 42,
 *   name: "Hero banner for homepage",
 *   created: new Date("2024-01-15T10:30:00"),
 *   status: true
 * }
 * ```
 */
export class MediaImageAttributes extends S.Class<MediaImageAttributes>('MediaImageAttributes')({
  /**
   * Internal Drupal media ID
   */
  drupal_internal__mid: S.optional(S.Number),

  /**
   * Revision ID for this media entity
   */
  drupal_internal__vid: S.optional(S.Number),

  /**
   * Language code (e.g., 'nl', 'en')
   */
  langcode: S.optional(S.String),

  /**
   * Media entity name/label
   */
  name: S.optional(S.String),

  /**
   * Creation timestamp
   */
  created: S.optional(S.DateFromString),

  /**
   * Last changed timestamp
   */
  changed: S.optional(S.DateFromString),

  /**
   * Publication status (true = published)
   */
  status: S.optional(S.Boolean),

  /**
   * Path alias for this media entity
   */
  path: S.optional(DrupalPath),
}) {}

/**
 * Media Image relationships
 *
 * The key relationship is field_media_image which references the actual file entity.
 * When included in the JSON:API response, you can traverse:
 * media--image -> field_media_image -> file--file
 */
export class MediaImageRelationships extends S.Class<MediaImageRelationships>('MediaImageRelationships')({
  /**
   * Reference to the actual file entity (file--file)
   * This can be either a reference (just id/type) or the full file entity when included
   */
  field_media_image: S.optional(
    S.Struct({
      data: S.optional(
        S.Struct({
          id: S.String,
          type: S.Literal('file--file'),
        })
      ),
    })
  ),

  /**
   * Drupal internal bundle reference
   */
  bundle: S.optional(S.Unknown),
}) {}

/**
 * Complete Media Image entity
 *
 * Represents a media--image entity as it appears in JSON:API included section.
 * To get the actual image URL, you need to:
 * 1. Get the media--image entity
 * 2. Follow relationships.field_media_image.data to get file ID
 * 3. Find the file--file entity in included
 * 4. Use file.attributes.uri.url
 *
 * @example
 * ```typescript
 * // From JSON:API response
 * const mediaImage: MediaImage = {
 *   id: "abc-123",
 *   type: "media--image",
 *   attributes: {
 *     name: "Hero image",
 *     status: true
 *   },
 *   relationships: {
 *     field_media_image: {
 *       data: { id: "def-456", type: "file--file" }
 *     }
 *   }
 * }
 * ```
 */
export class MediaImage extends S.Class<MediaImage>('MediaImage')({
  id: S.String,
  type: S.Literal('media--image'),
  attributes: MediaImageAttributes,
  relationships: S.optional(MediaImageRelationships),
  links: S.optional(S.Unknown),
}) {}
