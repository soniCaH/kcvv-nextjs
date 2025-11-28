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
   * ISO 8601 date for machine-readable semantic HTML
   */
  dateIso?: string
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
  const [isPaused, setIsPaused] = useState(false)

  // Clamp autoRotateInterval to minimum 1000ms to prevent runaway intervals
  const safeInterval = Math.max(autoRotateInterval, 1000)

  // Clamp activeIndex if articles array shrinks - use derived state instead of effect
  const clampedIndex = activeIndex >= articles.length && articles.length > 0 ? 0 : activeIndex

  // Auto-rotate through articles (pause when user interacts)
  useEffect(() => {
    if (!autoRotate || articles.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        // Ensure index is always within bounds
        const nextIndex = (current + 1) % articles.length
        return nextIndex
      })
    }, safeInterval)

    return () => clearInterval(timer)
  }, [autoRotate, safeInterval, articles.length, isPaused])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setActiveIndex((current) => (current - 1 + articles.length) % articles.length)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setActiveIndex((current) => (current + 1) % articles.length)
    }
  }

  // Handle focus events with relatedTarget checks to prevent brief unpausing during keyboard navigation
  const handleFocus = (e: React.FocusEvent) => {
    // Only pause if focus is coming from outside the carousel
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsPaused(true)
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Only unpause if focus is moving completely outside the carousel
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsPaused(false)
    }
  }

  if (articles.length === 0) {
    return null
  }

  const activeArticle = articles[clampedIndex]

  return (
    <section
      className="frontpage__featured_articles w-full bg-black relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Featured articles carousel"
    >
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
          {/* Dark overlay for text readability - stronger gradient on the left where text is */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full max-w-inner-lg mx-auto px-3 lg:px-0 flex items-center">
          <Link
            href={activeArticle.href}
            className="group flex flex-col justify-center max-w-2xl"
          >
            {/* Title - Force pure white with !important */}
            <h2 className="frontpage__featured_article__title !text-white text-4xl lg:text-6xl font-bold leading-tight mb-4 group-hover:!text-kcvv-green-bright transition-colors">
              {activeArticle.title}
            </h2>

            {/* Description - Pure white */}
            {activeArticle.description && (
              <p className="frontpage__featured_article__title__description !text-white text-lg lg:text-xl mb-6 line-clamp-3">
                {activeArticle.description}
              </p>
            )}

            {/* Metadata - Pure white */}
            <div className="frontpage__featured_article__meta__wrapper flex items-center gap-4 text-sm !text-white">
              <time className="frontpage__featured_article__meta" dateTime={activeArticle.dateIso}>
                {activeArticle.date}
              </time>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="frontpage__featured_article__meta__tags flex gap-2">
                  {activeArticle.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-kcvv-green-bright border border-kcvv-green-bright !text-white text-xs uppercase font-semibold"
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
                  index === clampedIndex
                    ? 'bg-kcvv-green-bright w-8'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to article ${index + 1}`}
                aria-current={index === clampedIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}

        {/* Side Thumbnails (Desktop only) */}
        {articles.length > 1 && (
          <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-80 flex-col justify-center gap-4 p-6 bg-gradient-to-l from-black/60 z-20">
            {articles.map((article, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'frontpage__featured_article group flex items-center gap-3 p-2 rounded transition-all cursor-pointer',
                  index === clampedIndex
                    ? 'frontpage__featured_article--active bg-kcvv-green-bright/20 border border-kcvv-green-bright'
                    : 'hover:bg-white/10 border border-transparent hover:border-white/30'
                )}
                aria-label={`Go to article: ${article.title}`}
                aria-pressed={index === clampedIndex}
              >
                {/* Thumbnail */}
                {article.imageUrl && (
                  <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
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
