'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Category {
  id: string
  attributes: {
    name: string
    slug: string
  }
}

interface CategoryFiltersProps {
  categories: Category[]
  activeCategory?: string
}

/**
 * Render a horizontally scrollable list of news category filters with left/right scroll controls and active-category highlighting.
 *
 * @param categories - Array of category objects; each item includes `id` and `attributes` with `name` and `slug`.
 * @param activeCategory - Slug of the currently active category, if any.
 * @returns A React element that renders the scrollable category filter bar with optional arrow controls and active styling.
 */
export function CategoryFilters({ categories, activeCategory }: CategoryFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  useEffect(() => {
    checkScrollPosition()
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', checkScrollPosition)

    return () => {
      container.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [checkScrollPosition])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative flex items-center">
      {/* Scroll arrows - visible on all screen sizes */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="flex absolute left-0 z-10 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={12} />
        </button>
      )}

      {showRightArrow && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="flex absolute right-0 z-10 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={12} />
        </button>
      )}

      {/* Scrollable filter container */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-2 lg:gap-3 flex-nowrap overflow-x-auto scroll-smooth transition-all ${
          showLeftArrow ? 'pl-10' : 'pl-0'
        } ${
          showRightArrow ? 'pr-10' : 'pr-0'
        }`}
      >
        <Link
          href="/news"
          className={`shrink-0 text-xs font-medium px-3 py-2 rounded transition-all duration-300 ${
            !activeCategory
              ? 'bg-kcvv-green-bright text-white'
              : 'bg-transparent text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white border border-kcvv-green-bright'
          }`}
        >
          Alles
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/news?category=${encodeURIComponent(category.attributes.slug)}`}
            className={`shrink-0 text-xs font-medium px-3 py-2 rounded transition-all duration-300 whitespace-nowrap ${
              activeCategory === category.attributes.slug
                ? 'bg-kcvv-green-bright text-white'
                : 'bg-transparent text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white border border-kcvv-green-bright'
            }`}
          >
            {category.attributes.name}
          </Link>
        ))}
      </div>
    </div>
  )
}