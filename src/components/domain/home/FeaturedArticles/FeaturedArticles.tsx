/**
 * FeaturedArticles Component
 * Hero section displaying featured articles in a carousel format
 * Matching Gatsby frontpage__featured_articles section
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export interface FeaturedArticle {
  /**
   * Article slug/path
   */
  href: string
  /**
   * Article title
   */
  title: string
  /**
   * Article excerpt/description
   */
  description?: string
  /**
   * Featured image URL
   */
  imageUrl?: string
  /**
   * Image alt text
   */
  imageAlt: string
  /**
   * Publication date (formatted)
   */
  date: string
  /**
   * Article tags/categories
   */
  tags?: Array<{ name: string }>
}

export interface FeaturedArticlesProps {
  /**
   * Array of featured articles (3-5 recommended)
   */
  articles: FeaturedArticle[]
  /**
   * Auto-rotate interval in milliseconds (default: 5000)
   */
  autoRotateInterval?: number
  /**
   * Enable auto-rotate (default: true)
   */
  autoRotate?: boolean
}

/**
 * Featured articles carousel for homepage hero section
 *
 * Visual specifications (matching Gatsby):
 * - Full-width hero section with overlay text
 * - Active article displayed prominently
 * - Side thumbnails for other articles (desktop)
 * - Auto-rotation with manual controls
 * - Responsive: stacked on mobile, side-by-side on desktop
 *
 * @example
 * ```tsx
 * <FeaturedArticles
 *   articles={articles}
 *   autoRotateInterval={5000}
 * />
 * ```
 */
export const FeaturedArticles = ({
  articles,
  autoRotateInterval = 5000,
  autoRotate = true,
}: FeaturedArticlesProps) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-rotate through articles
  useEffect(() => {
    if (!autoRotate || articles.length <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % articles.length)
    }, autoRotateInterval)

    return () => clearInterval(timer)
  }, [autoRotate, autoRotateInterval, articles.length])

  if (articles.length === 0) {
    return null
  }

  const activeArticle = articles[activeIndex]

  return (
    <section className="frontpage__featured_articles w-full bg-black relative overflow-hidden">
      <div className="relative w-full h-[400px] lg:h-[600px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {activeArticle.imageUrl && (
            <Image
              src={activeArticle.imageUrl}
              alt={activeArticle.imageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full max-w-inner-lg mx-auto px-3 lg:px-0 flex items-center">
          <Link
            href={activeArticle.href}
            className="group flex flex-col justify-center max-w-2xl"
          >
            {/* Title */}
            <h2 className="frontpage__featured_article__title text-white text-4xl lg:text-6xl font-bold leading-tight mb-4 group-hover:text-kcvv-green-bright transition-colors">
              {activeArticle.title}
            </h2>

            {/* Description */}
            {activeArticle.description && (
              <p className="frontpage__featured_article__title__description text-white/90 text-lg lg:text-xl mb-6 line-clamp-3">
                {activeArticle.description}
              </p>
            )}

            {/* Metadata */}
            <div className="frontpage__featured_article__meta__wrapper flex items-center gap-4 text-sm text-white/80">
              <time className="frontpage__featured_article__meta">{activeArticle.date}</time>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="frontpage__featured_article__meta__tags flex gap-2">
                  {activeArticle.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-kcvv-green-bright/20 border border-kcvv-green-bright/40 rounded text-white text-xs uppercase"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation Dots */}
        {articles.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  index === activeIndex
                    ? 'bg-kcvv-green-bright w-8'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Side Thumbnails (Desktop only) */}
        {articles.length > 1 && (
          <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-80 flex-col justify-center gap-4 p-6 bg-gradient-to-l from-black/60">
            {articles.map((article, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'frontpage__featured_article group flex items-center gap-3 p-2 rounded transition-all',
                  index === activeIndex
                    ? 'frontpage__featured_article--active bg-kcvv-green-bright/20 border border-kcvv-green-bright'
                    : 'hover:bg-white/10 border border-transparent'
                )}
              >
                {/* Thumbnail */}
                {article.imageUrl && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-white text-sm font-semibold text-left line-clamp-3 group-hover:text-kcvv-green-bright transition-colors">
                  {article.title}
                </h3>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
