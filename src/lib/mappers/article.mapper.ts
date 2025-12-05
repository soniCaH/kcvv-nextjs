/**
 * Article Mappers
 * Transform article data between different formats
 */

import type { Article } from '@/lib/effect/schemas/article.schema'
import { formatArticleDate } from '@/lib/utils/dates'
import { isDrupalImage } from '@/lib/utils/drupal-content'

/**
 * Homepage article interface
 * Simplified article format for homepage components
 */
export interface HomepageArticle {
  href: string
  title: string
  description?: string
  imageUrl?: string
  imageAlt: string
  date: string
  dateIso: string
  tags: Array<{ name: string }>
}

/**
 * Map Drupal Article to Homepage Article format
 *
 * @param article - Drupal Article from domain layer
 * @param includeDescription - Whether to include the article body summary
 * @returns HomepageArticle object for UI consumption
 */
export function mapArticleToHomepageArticle(
  article: Article,
  includeDescription = false
): HomepageArticle {
  const imageData = article.relationships.field_media_article_image?.data
  const hasValidImage = imageData && isDrupalImage(imageData)

  return {
    href: article.attributes.path.alias,
    title: article.attributes.title,
    ...(includeDescription && { description: article.attributes.body?.summary || undefined }),
    imageUrl: hasValidImage ? imageData.uri.url : undefined,
    imageAlt: hasValidImage ? imageData.alt || article.attributes.title : article.attributes.title,
    date: formatArticleDate(article.attributes.created),
    dateIso: article.attributes.created.toISOString(),
    tags:
      article.relationships.field_tags?.data
        ?.map((tag) => ('attributes' in tag && tag.attributes?.name ? { name: tag.attributes.name } : null))
        .filter((tag): tag is { name: string } => tag !== null) || [],
  }
}

/**
 * Map array of Articles to Homepage Articles
 *
 * @param articles - Array of Drupal Articles
 * @param includeDescription - Whether to include descriptions
 * @returns Array of HomepageArticle objects
 */
export function mapArticlesToHomepageArticles(
  articles: readonly Article[],
  includeDescription = false
): HomepageArticle[] {
  return articles.map((article) => mapArticleToHomepageArticle(article, includeDescription))
}
