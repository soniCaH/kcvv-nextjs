'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Category {
  id: string
  attributes: {
    name: string
  }
}

interface CategoryFiltersProps {
  categories: Category[]
  activeCategory?: string
}

export function CategoryFilters({ categories, activeCategory }: CategoryFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

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
  }, [categories])

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
    <div className="relative">
      {/* Scroll arrows - visible on all screen sizes */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white transition-colors"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-kcvv-green-bright hover:bg-kcvv-green-bright hover:text-white transition-colors"
          aria-label="Scroll right"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      )}

      {/* Scrollable filter container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 lg:gap-3 flex-nowrap overflow-x-auto pb-2 scroll-smooth px-10 lg:px-8"
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
            href={`/news?category=${encodeURIComponent(category.attributes.name)}`}
            className={`shrink-0 text-xs font-medium px-3 py-2 rounded transition-all duration-300 whitespace-nowrap ${
              activeCategory === category.attributes.name
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
