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

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generate static paths for all articles
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
  const imageData = article.relationships.field_media_article_image?.data
  const hasValidImage = imageData && isDrupalImage(imageData)
  const imageUrl = hasValidImage ? imageData.uri.url : undefined
  const imageAlt = hasValidImage ? imageData.alt || article.attributes.title : article.attributes.title

  // Build tags from resolved taxonomy terms
  const tags =
    article.relationships.field_tags?.data
      .map((tag) => {
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

      {/* Article Wrapper - matches Gatsby margin-bottom values */}
      <div className="mb-6 lg:mb-10">
        <main className="w-full max-w-[70rem] mx-auto px-0 lg:flex lg:flex-row-reverse">
          {/* Metadata - First in HTML, displays RIGHT on desktop */}
          <aside className="lg:flex lg:flex-col lg:max-w-[20rem] lg:self-start">
            <ArticleMetadata
              author="KCVV Elewijt" // TODO: Fetch actual author from uid relationship
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
