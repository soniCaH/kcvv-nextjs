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

interface NewsPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

/**
 * Generate page title and description for the news archive, optionally tailored to a category filter.
 *
 * If a category slug is provided and matches a known category, the returned metadata includes that
 * category's name in the title and description. On error or when no matching category is found,
 * returns the default archive title and description.
 *
 * @returns Metadata object containing `title` and `description`; when a category match is found
 * the values include the category name, otherwise they are the default archive metadata.
 */
export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams
  const categorySlug = params.category

  // If no category filter, return default metadata
  if (!categorySlug) {
    return {
      title: 'Nieuwsarchief | KCVV Elewijt',
      description: 'Bekijk al het nieuws van KCVV Elewijt. Filter op categorie of zoek naar specifieke artikelen.',
    }
  }

  // Fetch tags to find category name
  try {
    const tags = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getTags({ vocabulary: 'category' })
      })
    )

    // Find matching category
    const category = tags.find((tag) => {
      const slug = tag.attributes.path?.alias?.split('/').pop()
      return slug === categorySlug
    })

    if (category) {
      return {
        title: `${category.attributes.name} - Nieuwsarchief | KCVV Elewijt`,
        description: `Bekijk al het ${category.attributes.name} nieuws van KCVV Elewijt.`,
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error)
  }

  // Fallback if category not found
  return {
    title: 'Nieuwsarchief | KCVV Elewijt',
    description: 'Bekijk al het nieuws van KCVV Elewijt. Filter op categorie of zoek naar specifieke artikelen.',
  }
}

/**
 * Renders the news listing page with category filters, a paginated article grid, and navigation controls.
 *
 * @param searchParams - Promise resolving to an object with optional `category` and `page` string values used to determine the active category filter and current page
 * @returns The JSX element for the news listing page
 */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const categorySlug = params.category

  // Parse and validate page parameter
  const parsedPage = params.page ? parseInt(params.page, 10) : 1
  const page = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1

  const limit = 9 // 3 complete rows in 3-column grid

  // First fetch tags to look up category ID
  const tags = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService
      return yield* drupal.getTags({ vocabulary: 'category' })
    })
  )

  // Extract slug from path and find matching category
  const activeCategory = categorySlug
    ? tags.find((tag) => {
        const slug = tag.attributes.path?.alias?.split('/').pop()
        return slug === categorySlug
      })
    : undefined

  const categoryId = activeCategory?.attributes.drupal_internal__tid

  // Fetch articles with category filter
  const { articles, links } = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService
      return yield* drupal.getArticles({
        page,
        limit,
        categoryId,
        sort: '-created',
      })
    })
  )

  // Generate dynamic page title
  const pageTitle = activeCategory
    ? `${activeCategory.attributes.name} - Nieuwsarchief KCVV Elewijt`
    : 'Nieuwsarchief KCVV Elewijt'

  return (
    <>
      <PageTitle title={pageTitle} />

      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        {/* Category filters */}
        <section className="mb-6 uppercase">
          <h5 className="mb-2">Filter op categorie</h5>
          <CategoryFilters
            categories={tags.map((tag) => ({
              id: tag.id,
              attributes: {
                name: tag.attributes.name,
                slug: tag.attributes.path?.alias?.split('/').pop() || '',
              },
            }))}
            activeCategory={categorySlug}
          />
        </section>

        {/* Articles grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mb-6">
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
                href={`/news${categorySlug ? `?category=${categorySlug}&page=${page - 1}` : `?page=${page - 1}`}`}
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
                href={`/news${categorySlug ? `?category=${categorySlug}&page=${page + 1}` : `?page=${page + 1}`}`}
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