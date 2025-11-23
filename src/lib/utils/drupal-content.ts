/**
 * Drupal Content Utilities
 * Functions for processing Drupal HTML content
 */
import { Schema as S } from 'effect'
import { Option } from 'effect'
import { DrupalImage } from '@/lib/effect/schemas'

// Type derived from the DrupalImage schema
type DrupalImageData = S.Schema.Type<typeof DrupalImage>

/**
 * Type guard to check if image data is a fully-resolved DrupalImage
 *
 * @param data - Image data that could be either a DrupalImage or a raw relationship reference
 * @returns True if the data is a DrupalImage with uri.url properties
 *
 * @example
 * ```ts
 * const imageData = article.relationships.field_media_article_image?.data
 * if (isDrupalImage(imageData)) {
 *   console.log(imageData.uri.url) // TypeScript knows this exists
 * }
 * ```
 */
export function isDrupalImage(
  data: unknown
): data is DrupalImageData {
  return Option.isSome(S.decodeUnknownOption(DrupalImage)(data))
}

/**
 * Converts relative Drupal image URLs to absolute URLs
 *
 * @param html - HTML content containing img tags
 * @param baseUrl - Base URL for the Drupal API (defaults to DRUPAL_API_URL env var)
 * @returns HTML with absolute image URLs
 *
 * @example
 * ```ts
 * const html = '<img src="/sites/default/files/image.jpg">'
 * const result = convertDrupalImagesToAbsolute(html)
 * // '<img src="https://api.kcvvelewijt.be/sites/default/files/image.jpg">'
 * ```
 */
export function convertDrupalImagesToAbsolute(
  html: string,
  baseUrl: string = process.env.DRUPAL_API_URL || 'https://api.kcvvelewijt.be'
): string {
  // Replace all img src attributes that start with /sites/default/
  return html.replace(
    /(<img[^>]+src=["'])(\/{1}sites\/default\/[^"']+)(["'])/gi,
    `$1${baseUrl}$2$3`
  )
}
