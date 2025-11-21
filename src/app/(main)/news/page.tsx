/**
 * News Listing Page
 * Displays paginated list of articles with category filters
 */

import { Effect } from 'effect'
import Link from 'next/link'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { ArticleCard } from '@/components/domain/article'
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

  // Fetch articles
  const { articles, links } = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService
      return yield* drupal.getArticles({
        page,
        limit,
        category,
        sort: '-created',
      })
    })
  )

  // TODO: Fetch categories for filter (will be added in next iteration)
  // For now, we'll just have "Alles" link

  return (
    <>
      <header
        className="px-3 pt-4 pb-4 xl:px-0"
        style={{
          background: '#4acf52',
          backgroundImage: 'url(/images/header-pattern.png)',
          backgroundPosition: '50% -7vw',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100vw auto',
        }}
      >
        <div className="w-full max-w-[70rem] mx-auto">
          <h1 className="text-white text-[2.5rem] leading-[0.92] font-bold">
            Nieuwsarchief KCVV Elewijt
          </h1>
        </div>
      </header>

      <div className="w-full max-w-[70rem] mx-auto px-3 lg:px-0 py-6">
        {/* Category filters */}
        <section className="mb-6 uppercase">
          <h5 className="mb-2">Filter op categorie</h5>
          <div className="flex gap-4 flex-nowrap overflow-x-auto scrollbar-none pb-1 scroll-smooth">
            <Link
              href="/news"
              className="flex-shrink-0 lg:text-xs lg:font-medium lg:px-2 lg:py-1 lg:bg-kcvv-green-bright lg:text-white lg:transition-all lg:duration-300 lg:hover:bg-transparent lg:hover:text-kcvv-green-bright"
            >
              Alles
            </Link>
            {/* TODO: Add dynamic category links */}
          </div>
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
        <footer className="border-t border-[rgba(74,207,82,0.25)] pt-6 grid grid-cols-2 gap-4">
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
