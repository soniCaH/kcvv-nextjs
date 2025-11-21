/**
 * Drupal Content Utilities
 * Functions for processing Drupal HTML content
 */

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
): data is { uri: { url: string }; alt?: string; width?: number; height?: number } {
  return !!(data && typeof data === 'object' && 'uri' in data && data.uri && 'url' in data.uri)
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
