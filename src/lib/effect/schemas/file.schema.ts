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
   *
   * ⚠️ SECURITY WARNING: MIME type validation alone is INSUFFICIENT for security!
   *
   * This schema validates common image MIME types from Drupal, but MIME types
   * can be easily spoofed. For production security, the server MUST perform:
   *
   * 1. **Magic Byte Validation**: Check file signatures (first bytes of file)
   *    - JPEG: FF D8 FF
   *    - PNG: 89 50 4E 47 0D 0A 1A 0A
   *    - GIF: 47 49 46 38
   *    - WebP: 52 49 46 46 ... 57 45 42 50
   *
   * 2. **File Extension Validation**: Verify extension matches MIME type
   *    - Cross-check filename extension with MIME type and magic bytes
   *
   * 3. **Content Validation**: Use image processing libraries to verify
   *    - Attempt to decode/process as image
   *    - Reject malformed or malicious files
   *
   * 4. **Drupal Configuration**: Ensure Drupal's file upload validation is
   *    properly configured with allowed extensions and MIME types
   *
   * This schema validation is a defense-in-depth layer but NOT the primary
   * security control. Proper validation must happen server-side in Drupal.
   *
   * Common image types: 'image/jpeg', 'image/png', 'image/gif', 'image/webp'
   * Note: 'image/svg+xml' is excluded - see SECURITY.md for SVG handling
   */
  filemime: S.optional(
    S.Literal('image/jpeg', 'image/png', 'image/gif', 'image/webp')
  ),

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
