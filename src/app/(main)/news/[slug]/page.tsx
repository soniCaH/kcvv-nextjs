/**
 * Article Detail Page
 * Displays individual news articles from Drupal
 */

import { Effect } from 'effect'
import { notFound } from 'next/navigation'
import { DrupalService, runPromise } from '@/lib/effect/runtime'
import {
  ArticleHeader,
  ArticleMetadata,
  ArticleBody,
  ArticleFooter,
} from '@/components/domain/article'
import type { RelatedContent } from '@/components/domain/article'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate static paths for all articles
 */
export async function generateStaticParams() {
  try {
    const articles = await runPromise(
      Effect.gen(function* () {
        const drupal = yield* DrupalService
        return yield* drupal.getArticles({ limit: 100 })
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
 * Article page metadata
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
        images: article.relationships.field_image?.data?.uri.url
          ? [
              {
                url: article.relationships.field_image.data.uri.url,
                alt:
                  article.relationships.field_image.data.alt ||
                  article.attributes.title,
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
 * Article detail page
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

  // Build image URL
  const imageUrl = article.relationships.field_image?.data?.uri.url
  const imageAlt =
    article.relationships.field_image?.data?.alt || article.attributes.title

  // Build share configuration
  const shareConfig = {
    url: `https://kcvvelewijt.be${article.attributes.path.alias}`,
    title: article.attributes.title,
    hashtags: article.relationships.field_category?.data.map((cat) => cat.id) || [],
  }

  // Build tags from categories
  const tags =
    article.relationships.field_category?.data.map((cat) => ({
      name: cat.id, // TODO: Fetch actual category names
      href: `/news?category=${cat.id}`,
    })) || []

  // TODO: Fetch related content based on categories
  // For now, use empty array
  const relatedContent: RelatedContent[] = []

  return (
    <>
      {/* Article Header */}
      {imageUrl && <ArticleHeader title={article.attributes.title} imageUrl={imageUrl} imageAlt={imageAlt} />}
      {!imageUrl && (
        <header className="bg-kcvv-green-bright px-3 pt-4 pb-4 xl:px-0">
          <div className="w-full max-w-[70rem] mx-auto">
            <h1 className="text-white text-[2.5rem] leading-[0.92] font-bold">
              {article.attributes.title}
            </h1>
          </div>
        </header>
      )}

      <div className="w-full max-w-[70rem] mx-auto px-0">
        <div className="flex flex-col xl:flex-row">
          {/* Main Content */}
          <div className="flex-1 xl:order-2">
            {/* Article Body */}
            {article.attributes.body && (
              <ArticleBody content={article.attributes.body.processed} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="xl:w-64 xl:order-1 flex-shrink-0">
            <ArticleMetadata
              author="KCVV Elewijt" // TODO: Fetch actual author from uid relationship
              date={article.attributes.created.toLocaleDateString('nl-BE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              tags={tags}
              shareConfig={shareConfig}
            />
          </aside>
        </div>
      </div>

      {/* Article Footer */}
      {relatedContent.length > 0 && <ArticleFooter relatedContent={relatedContent} />}
    </>
  )
}

/**
 * Enable ISR with 1 hour revalidation
 */
export const revalidate = 3600
