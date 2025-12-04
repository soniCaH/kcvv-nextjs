/**
 * Homepage
 * Main landing page for KCVV Elewijt website
 */

import { Effect } from 'effect'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { FootbalistoService } from '@/lib/effect/services/FootbalistoService'
import { FeaturedArticles, LatestNews, UpcomingMatches } from '@/components/domain/home'
import { formatArticleDate } from '@/lib/utils/dates'
import { isDrupalImage } from '@/lib/utils/drupal-content'
import type { Metadata } from 'next'
import type { Article } from '@/lib/effect/schemas/article.schema'
import type { Match } from '@/lib/effect/schemas/match.schema'
import type { UpcomingMatch } from '@/components/domain/home'

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
 * Maps a Drupal Article record to the simplified homepage article shape.
 *
 * @param article - Drupal Article record to map
 * @param includeDescription - If true, include the article body summary as `description`
 * @returns An object with `href`, `title`, optional `description`, `imageUrl`, `imageAlt`, `date`, `dateIso`, and `tags` (array of `{ name }`)
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
 * Convert a Match from Footbalisto API to UpcomingMatch format for the component.
 *
 * @param match - Match data from Footbalisto API
 * @returns An UpcomingMatch object with camelCase properties
 */
function mapMatchForHomepage(match: Match): UpcomingMatch {
  return {
    id: match.id,
    date: match.date,
    time: match.time,
    venue: match.venue,
    homeTeam: {
      id: match.home_team.id,
      name: match.home_team.name,
      logo: match.home_team.logo,
      score: match.home_team.score,
    },
    awayTeam: {
      id: match.away_team.id,
      name: match.away_team.name,
      logo: match.away_team.logo,
      score: match.away_team.score,
    },
    status: match.status,
    round: match.round,
    competition: match.competition,
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
  // Fetch latest articles and upcoming matches in parallel with error handling
  const [articlesResult, matchesResult] = await Promise.all([
    runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService
        // Get 9 latest articles (3 featured + 6 latest news)
        return yield* drupal.getArticles({
          page: 1,
          limit: 9,
          sort: '-created',
        })
      }).pipe(
        // Graceful fallback: return empty articles array on error
        Effect.catchAll(() => Effect.succeed({ articles: [], links: undefined }))
      )
    ),
    runPromise(
      Effect.gen(function* () {
        const footbalisto = yield* FootbalistoService
        return yield* footbalisto.getNextMatches()
      }).pipe(
        // Graceful fallback: return empty matches array on error
        Effect.catchAll(() => Effect.succeed([]))
      )
    ),
  ])

  const { articles } = articlesResult
  const matches = matchesResult

  // Split articles: first 3 for featured carousel, remaining 6 for latest news
  const featuredArticles = articles.slice(0, 3).map((article) => mapArticleForHomepage(article, true))

  const latestNewsArticles = articles.slice(3, 9).map((article) => mapArticleForHomepage(article, false))

  // Map matches to component format
  const upcomingMatches = matches.map(mapMatchForHomepage)

  // Show fallback message if no articles could be loaded
  if (articles.length === 0) {
    return (
      <div className="max-w-inner-lg mx-auto px-3 lg:px-0 py-16 text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-kcvv-green-dark mb-4">
          Welkom bij KCVV Elewijt
        </h1>
        <p className="text-lg text-gray-600">
          Artikelen kunnen momenteel niet worden geladen. Probeer het later opnieuw.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Featured Articles Hero Carousel */}
      {featuredArticles.length > 0 && (
        <FeaturedArticles articles={featuredArticles} autoRotate={true} autoRotateInterval={5000} />
      )}

      {/* Upcoming Matches Slider */}
      {upcomingMatches.length > 0 && (
        <UpcomingMatches matches={upcomingMatches} title="Volgende wedstrijden" showViewAll={true} viewAllHref="/matches" />
      )}

      {/* Latest News Section */}
      {latestNewsArticles.length > 0 && (
        <LatestNews articles={latestNewsArticles} title="Laatste nieuws" showViewAll={true} viewAllHref="/news" />
      )}

      {/* TODO: Add more homepage sections:
       * - Team standings/rankings
       * - Youth news section (frontpage__main_content__youth)
       * - Sponsors/Advertisement (frontpage__advertisement)
       *
       * Note: KCVVTV video section (frontpage__kcvvtv) - On hold (no cameraman available)
       */}
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600