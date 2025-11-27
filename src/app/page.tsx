/**
 * Homepage
 * Main landing page for KCVV Elewijt website
 */

import { Effect } from 'effect'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { FeaturedArticles, LatestNews } from '@/components/domain/home'
import { formatArticleDate } from '@/lib/utils/dates'
import { isDrupalImage } from '@/lib/utils/drupal-content'
import type { Metadata } from 'next'
import type { Article } from '@/lib/effect/schemas/article.schema'

/**
 * Provide metadata for the homepage.
 *
 * @returns The page metadata object containing `title`, `description`, and `keywords`.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Er is maar één plezante compagnie | KCVV Elewijt',
    description: 'Startpagina van stamnummer 00055: KCVV Elewijt.',
    keywords: 'KCVV, Voetbal, Elewijt, Crossing, KCVVE, Zemst, 00055, 55, 1982, 1980',
  }
}

/**
 * Convert a Drupal Article record into the simplified shape used by the homepage.
 *
 * @param article - Drupal article to map
 * @param includeDescription - When true, include the article summary as `description`
 * @returns An object with properties:
 * - `href`: article URL path alias
 * - `title`: article title
 * - `description`: optional article summary (present only if `includeDescription` is true)
 * - `imageUrl`: URL of the article image, or `undefined` if none
 * - `imageAlt`: image alt text if available, otherwise the article title
 * - `date`: human-friendly formatted date
 * - `dateIso`: ISO string of the article creation date
 * - `tags`: array of tag objects `{ name }`, empty if no tags
 */
function mapArticleForHomepage(article: Article, includeDescription = false) {
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
 * Render the homepage with a featured articles carousel and a latest-news list.
 *
 * Fetches nine most-recent articles, uses the first three as featured items (including descriptions)
 * and the remaining six as latest-news items, then returns the composed homepage element.
 *
 * @returns The homepage React element containing the featured articles carousel and latest news section
 */
export default async function HomePage() {
  // Fetch latest articles for homepage
  const { articles } = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService
      // Get 9 latest articles (3 featured + 6 latest news)
      return yield* drupal.getArticles({
        page: 1,
        limit: 9,
        sort: '-created',
      })
    })
  )

  // Split articles: first 3 for featured carousel, remaining 6 for latest news
  const featuredArticles = articles.slice(0, 3).map((article) => mapArticleForHomepage(article, true))

  const latestNewsArticles = articles.slice(3, 9).map((article) => mapArticleForHomepage(article, false))

  return (
    <>
      {/* Featured Articles Hero Carousel */}
      {featuredArticles.length > 0 && (
        <FeaturedArticles articles={featuredArticles} autoRotate={true} autoRotateInterval={5000} />
      )}

      {/* Latest News Section */}
      {latestNewsArticles.length > 0 && (
        <LatestNews articles={latestNewsArticles} title="Laatste nieuws" showViewAll={true} viewAllHref="/news" />
      )}

      {/* TODO: Add more homepage sections:
       * - Upcoming matches slider (frontpage__matches_slider)
       * - Team standings/rankings
       * - KCVVTV video section (frontpage__kcvvtv)
       * - Youth news section (frontpage__main_content__youth)
       * - Sponsors/Advertisement (frontpage__advertisement)
       */}
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600