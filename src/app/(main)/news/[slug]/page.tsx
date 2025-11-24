/**
 * Article Detail Page
 * Displays individual news articles from Drupal
 */

import { Effect } from 'effect'
import { notFound } from 'next/navigation'
import { runPromise } from '@/lib/effect/runtime'
import { DrupalService } from '@/lib/effect/services/DrupalService'
import { isDrupalImage } from '@/lib/utils/drupal-content'
import { formatArticleDate } from '@/lib/utils/dates'
import {
  ArticleHeader,
  ArticleMetadata,
  ArticleBody,
  ArticleFooter,
} from '@/components/domain/article'
import type { RelatedContent } from '@/components/domain/article'
import { TaxonomyTerm } from '@/lib/effect/schemas'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate route parameters for article pages from Drupal articles.
 *
 * Fetches up to 50 articles and derives each route `slug` by removing the "/news/" prefix from the article path alias.
 *
 * @returns An array of route parameter objects, each with a `slug` property derived from an article's path alias; an empty array is returned if fetching fails.
 */
export async function generateStaticParams() {
  try {
    const { articles } = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles({ limit: 50 })
      })
    )

    return articles.map((article) => ({
      slug: article.attributes.path.alias.replace('/news/', ''),
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

/**
 * Build SEO and Open Graph metadata for the article identified by `params.slug`.
 *
 * Fetches the article by slug and returns a metadata object containing `title`, optional `description`, and an `openGraph` block with `title`, `description`, `type`, `publishedTime`, optional `modifiedTime`, `authors`, and optional `images`.
 *
 * @param params - A promise-resolved object containing the route `slug`
 * @returns A metadata object for the article; if the article cannot be fetched, returns an object with the title "Artikel niet gevonden | KCVV Elewijt"
 */
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params

  try {
    const article = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticleBySlug(slug)
      })
    )

    const imageData = article.relationships.field_media_article_image?.data
    const hasImage = imageData && isDrupalImage(imageData)

    return {
      title: `${article.attributes.title} | KCVV Elewijt`,
      description: article.attributes.body?.summary || undefined,
      openGraph: {
        title: article.attributes.title,
        description: article.attributes.body?.summary || undefined,
        type: 'article',
        publishedTime: article.attributes.created.toISOString(),
        modifiedTime: article.attributes.changed?.toISOString(),
        authors: ['KCVV Elewijt'],
        images: hasImage
          ? [
              {
                url: imageData.uri.url,
                alt: imageData.alt || article.attributes.title,
              },
            ]
          : undefined,
      },
    }
  } catch {
    return {
      title: 'Artikel niet gevonden | KCVV Elewijt',
    }
  }
}

/**
 * Render the article detail page for the given slug.
 *
 * Triggers a 404 route if the article cannot be loaded.
 *
 * @param params - Promise resolving to an object with a `slug` string used to load the article
 * @returns The article detail page element
 */
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  // Fetch article from Drupal
  const article = await runPromise(
    Effect.gen(function* () {
      const drupal = yield* DrupalService
      return yield* drupal.getArticleBySlug(slug)
    })
  ).catch(() => {
    notFound()
  })

  // Fetch related articles based on first tag
  // Fetch related articles based on first tag
  const firstTag = article.relationships.field_tags?.data
    ?.find((tag): tag is TaxonomyTerm =>
      'attributes' in tag &&
      !!tag.attributes?.drupal_internal__tid
    )

  const relatedArticles = firstTag?.attributes.drupal_internal__tid
    ? await runPromise(
        Effect.gen(function* () {
          const drupal = yield* DrupalService
          const { articles } = yield* drupal.getArticles({
            categoryId: firstTag.attributes.drupal_internal__tid!,
            limit: 4, // Fetch 4 to ensure we have 3 after excluding current
          })
          // Exclude current article and limit to 3
          return articles.filter((a) => a.id !== article.id).slice(0, 3)
        })
      )
    : []

  // Build image URL
  const imageData = article.relationships.field_media_article_image?.data
  const hasValidImage = imageData && isDrupalImage(imageData)
  const imageUrl = hasValidImage ? imageData.uri.url : undefined
  const imageAlt = hasValidImage ? imageData.alt || article.attributes.title : article.attributes.title

  // Build tags from resolved taxonomy terms
  const tags =
    article.relationships.field_tags?.data
      ?.map((tag) => {
        // Check if this is a resolved TaxonomyTerm (has attributes)
        if ('attributes' in tag && tag.attributes?.name) {
          return {
            name: tag.attributes.name,
            href: `/news?category=${encodeURIComponent(tag.attributes.name)}`,
          }
        }
        // Fallback for unresolved references (shouldn't happen after mapIncluded)
        return null
      })
      .filter((tag): tag is { name: string; href: string } => tag !== null) || []

  // Build share configuration
  const shareConfig = {
    url: `https://kcvvelewijt.be${article.attributes.path.alias}`,
    title: article.attributes.title,
    hashtags: tags.map((tag) => tag.name),
  }

  // Build related content from related articles
  const relatedContent: RelatedContent[] = relatedArticles.map((relatedArticle) => ({
    title: relatedArticle.attributes.title,
    href: relatedArticle.attributes.path.alias,
    type: 'article' as const,
  }))

  return (
    <>
      {/* Article Header */}
      {imageUrl && <ArticleHeader title={article.attributes.title} imageUrl={imageUrl} imageAlt={imageAlt} />}
      {!imageUrl && (
        <header className="bg-kcvv-green-bright px-3 pt-4 pb-4 xl:px-0">
          <div className="w-full max-w-inner-lg mx-auto">
            <h1 className="text-white text-[2.5rem] leading-[0.92] font-bold">
              {article.attributes.title}
            </h1>
          </div>
        </header>
      )}

      {/* Article Wrapper - matches Gatsby margin-bottom values */}
      <div className="mb-6 lg:mb-10">
        <main className="w-full max-w-inner-lg mx-auto px-0 lg:flex lg:flex-row-reverse">
          {/* Metadata - First in HTML, displays RIGHT on desktop */}
          <aside className="lg:flex lg:flex-col lg:max-w-[20rem] lg:self-start">
            <ArticleMetadata
              author="KCVV Elewijt"
              date={formatArticleDate(article.attributes.created)}
              tags={tags}
              shareConfig={shareConfig}
            />
          </aside>

          {/* Body - Second in HTML, displays LEFT on desktop */}
          <div className="flex-1">
            {article.attributes.body && (
              <ArticleBody content={article.attributes.body.processed} />
            )}
          </div>
        </main>

        {/* Article Footer */}
        {relatedContent.length > 0 && <ArticleFooter relatedContent={relatedContent} />}
      </div>
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600