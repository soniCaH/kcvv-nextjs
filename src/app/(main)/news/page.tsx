/**
 * News Listing Page
 * Displays paginated list of articles with category filters
 */

import { Effect } from 'effect'
import Link from 'next/link'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { ArticleCard, CategoryFilters } from '@/components/domain/article'
import { PageTitle } from '@/components/layout'
import { formatArticleDate } from '@/lib/utils/dates'
import { isDrupalImage } from '@/lib/utils/drupal-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nieuwsarchief | KCVV Elewijt',
  description: 'Bekijk al het nieuws van KCVV Elewijt. Filter op categorie of zoek naar specifieke artikelen.',
}

interface NewsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

/**
 * News listing page
 */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const category = params.category
  const page = params.page ? parseInt(params.page, 10) : 1
  const limit = 12

  // Fetch articles and tags in parallel
  const [{ articles, links }, tags] = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService

      const articlesEffect = drupal.getArticles({
        page,
        limit,
        category,
        sort: '-created',
      })

      const tagsEffect = drupal.getTags({ vocabulary: 'category' })

      // Run both requests in parallel
      return yield* Effect.all([articlesEffect, tagsEffect])
    })
  )

  return (
    <>
      <PageTitle title="Nieuwsarchief KCVV Elewijt" />

      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        {/* Category filters */}
        <section className="mb-6 uppercase">
          <h5 className="mb-2">Filter op categorie</h5>
          <CategoryFilters
            categories={tags.map((tag) => ({
              id: tag.id,
              attributes: { name: tag.attributes.name },
            }))}
            activeCategory={category}
          />
        </section>

        {/* Articles grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10 mb-6">
          {articles.map((article) => {
            const imageData = article.relationships.field_media_article_image?.data
            const hasValidImage = imageData && isDrupalImage(imageData)
            const tags =
              article.relationships.field_tags?.data
                ?.map((tag) => ('attributes' in tag && tag.attributes?.name ? { name: tag.attributes.name } : null))
                .filter((tag): tag is { name: string } => tag !== null) || []

            return (
              <ArticleCard
                key={article.id}
                title={article.attributes.title}
                href={article.attributes.path.alias}
                imageUrl={hasValidImage ? imageData.uri.url : undefined}
                imageAlt={hasValidImage ? imageData.alt || article.attributes.title : article.attributes.title}
                date={formatArticleDate(article.attributes.created)}
                tags={tags}
              />
            )
          })}
        </main>

        {/* Pagination */}
        <footer className="border-t border-kcvv-green-100 pt-6 grid grid-cols-2 gap-4">
          <div>
            {links?.prev && (
              <Link
                href={`/news${category ? `?category=${category}&page=${page - 1}` : `?page=${page - 1}`}`}
                className="text-kcvv-green-bright hover:underline"
              >
                &laquo; Vorige
              </Link>
            )}
            {!links?.prev && <span className="text-gray-400">&laquo; Vorige</span>}
          </div>
          <div className="text-right">
            {links?.next && (
              <Link
                href={`/news${category ? `?category=${category}&page=${page + 1}` : `?page=${page + 1}`}`}
                className="text-kcvv-green-bright hover:underline"
              >
                Volgende &raquo;
              </Link>
            )}
            {!links?.next && <span className="text-gray-400">Volgende &raquo;</span>}
          </div>
        </footer>
      </div>
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600
