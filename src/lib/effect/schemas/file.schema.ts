/**
 * Drupal File Entity Schemas
 *
 * File entities represent uploaded files in Drupal's file system.
 * They are referenced by media entities and other content types.
 *
 * Key distinction:
 * - file--file: The actual uploaded file with URL, size, mime type
 * - media--image: Wrapper around file with additional metadata (alt, title, etc.)
 *
 * Files appear in JSON:API included section when you traverse from:
 * node -> media entity -> file entity
 *
 * @see https://www.drupal.org/docs/8/core/modules/file
 */

import { Schema as S } from 'effect'
import { DateFromStringOrDate } from './common.schema'

/**
 * File URI structure
 *
 * Drupal stores file URIs in a structured format.
 * The URL can be:
 * - Relative: /sites/default/files/image.jpg
 * - Absolute: https://api.kcvvelewijt.be/sites/default/files/image.jpg
 *
 * @example
 * ```typescript
 * {
 *   url: "https://api.kcvvelewijt.be/sites/default/files/2024-01/hero.jpg"
 * }
 * ```
 */
export class FileUri extends S.Class<FileUri>('FileUri')({
  /**
   * Public URL to access the file
   * May be relative or absolute depending on Drupal configuration
   */
  url: S.String,
}) {}

/**
 * File entity attributes
 *
 * Contains metadata about an uploaded file including:
 * - filename: Original filename
 * - uri: Public URL structure
 * - filemime: MIME type (image/jpeg, application/pdf, etc.)
 * - filesize: Size in bytes
 * - created/changed: Timestamps
 *
 * @example
 * ```typescript
 * {
 *   drupal_internal__fid: 42,
 *   filename: "hero-banner.jpg",
 *   uri: { url: "https://api.kcvvelewijt.be/sites/default/files/hero-banner.jpg" },
 *   filemime: "image/jpeg",
 *   filesize: 245678,
 *   created: new Date("2024-01-15T10:30:00")
 * }
 * ```
 */
export class FileAttributes extends S.Class<FileAttributes>('FileAttributes')({
  /**
   * Internal Drupal file ID
   */
  drupal_internal__fid: S.optional(S.Number),

  /**
   * Language code (e.g., 'nl', 'en')
   */
  langcode: S.optional(S.String),

  /**
   * Original filename as uploaded
   */
  filename: S.optional(S.String),

  /**
   * File URI with public URL
   * This is the primary way to access the file
   */
  uri: FileUri,

  /**
   * MIME type of the file
   * Validated to only accept image/jpeg and image/png for security
   * Examples: 'image/jpeg', 'image/png'
   */
  filemime: S.optional(S.Literal('image/jpeg', 'image/png')),

  /**
   * File size in bytes
   */
  filesize: S.optional(S.Number),

  /**
   * Publication status (true = published, accessible)
   */
  status: S.optional(S.Boolean),

  /**
   * Creation timestamp
   */
  created: S.optional(DateFromStringOrDate),

  /**
   * Last changed timestamp
   */
  changed: S.optional(DateFromStringOrDate),
}) {}

/**
 * Complete File entity
 *
 * Represents a file--file entity as it appears in JSON:API included section.
 * This is the final destination when resolving image URLs.
 *
 * Typical resolution path for article images:
 * 1. Article has relationships.field_media_article_image -> media--image ID
 * 2. Media image has relationships.field_media_image -> file--file ID
 * 3. File has attributes.uri.url -> actual image URL
 *
 * @example
 * ```typescript
 * // From JSON:API response
 * const file: File = {
 *   id: "def-456",
 *   type: "file--file",
 *   attributes: {
 *     filename: "article-hero.jpg",
 *     uri: { url: "https://api.kcvvelewijt.be/sites/default/files/article-hero.jpg" },
 *     filemime: "image/jpeg",
 *     filesize: 156789
 *   }
 * }
 *
 * // Access the image URL
 * const imageUrl = file.attributes.uri.url
 * ```
 */
export class File extends S.Class<File>('File')({
  id: S.String,
  type: S.Literal('file--file'),
  attributes: FileAttributes,
  links: S.optional(S.Unknown),
}) {}
