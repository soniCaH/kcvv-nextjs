/**
 * UpcomingMatches Component
 * Displays upcoming matches in a horizontal scroll slider
 * Uses native CSS scroll-snap for smooth, touch-friendly scrolling
 * Matching Gatsby frontpage__matches_slider section
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatMatchDate, formatMatchTime } from '@/lib/utils/dates'

export interface UpcomingMatch {
  /**
   * Match ID
   */
  id: number
  /**
   * Match date
   */
  date: Date
  /**
   * Match time (optional)
   */
  time?: string
  /**
   * Venue/location (optional)
   */
  venue?: string
  /**
   * Home team
   */
  homeTeam: {
    id: number
    name: string
    logo?: string
    score?: number
  }
  /**
   * Away team
   */
  awayTeam: {
    id: number
    name: string
    logo?: string
    score?: number
  }
  /**
   * Match status
   */
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled'
  /**
   * Round/matchday (optional)
   */
  round?: string
  /**
   * Competition name (optional)
   */
  competition?: string
}

export interface UpcomingMatchesProps {
  /**
   * Array of upcoming matches
   */
  matches: UpcomingMatch[]
  /**
   * Section title (default: "Volgende wedstrijden")
   */
  title?: string
  /**
   * Show "View All" link (default: true)
   */
  showViewAll?: boolean
  /**
   * View all link href (default: "/matches")
   */
  viewAllHref?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Upcoming matches horizontal slider for homepage
 *
 * Visual specifications (matching Gatsby):
 * - Horizontal scrollable container with CSS scroll-snap
 * - Match cards displayed side-by-side
 * - Navigation arrows for desktop
 * - Touch-friendly swipe on mobile
 * - Responsive: single card on mobile, multiple on desktop
 *
 * @example
 * ```tsx
 * <UpcomingMatches
 *   matches={matches}
 *   title="Volgende wedstrijden"
 *   showViewAll={true}
 * />
 * ```
 */
export const UpcomingMatches = ({
  matches,
  title = 'Volgende wedstrijden',
  showViewAll = true,
  viewAllHref = '/matches',
  className,
}: UpcomingMatchesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    )
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    return () => window.removeEventListener('resize', checkScrollPosition)
  }, [matches])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })
  }

  if (matches.length === 0) {
    return null
  }

  return (
    <section
      className={cn(
        'frontpage__matches_slider w-full py-12 lg:py-16 bg-gray-50',
        className
      )}
    >
      <div className="max-w-inner-lg mx-auto px-3 lg:px-0">
        {/* Section Header */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-kcvv-green-dark uppercase">
            {title}
          </h2>

          {showViewAll && (
            <Link
              href={viewAllHref}
              className="text-kcvv-green-bright hover:text-kcvv-green-dark font-semibold uppercase text-sm transition-colors flex items-center gap-2"
            >
              Bekijk alles
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </header>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-kcvv-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Scrollable Matches */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-kcvv-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Add CSS for hiding scrollbar in webkit browsers */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

/**
 * Individual Match Card Component
 */
const MatchCard = ({ match }: { match: UpcomingMatch }) => {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'
  const isPostponed = match.status === 'postponed'
  const isCancelled = match.status === 'cancelled'

  return (
    <div className="snap-start shrink-0 w-[280px] lg:w-[320px]">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full">
        {/* Match Status Badge */}
        {isLive && (
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-600 font-bold uppercase text-xs">Live</span>
          </div>
        )}

        {/* Competition & Round */}
        {match.competition && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-semibold">{match.competition}</span>
            {match.round && <span className="ml-2">• {match.round}</span>}
          </div>
        )}

        {/* Teams */}
        <div className="space-y-3 mb-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {match.homeTeam.logo && (
                <img
                  src={match.homeTeam.logo}
                  alt={`${match.homeTeam.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              )}
              <span className="font-semibold text-gray-900">{match.homeTeam.name}</span>
            </div>
            {(isLive || isFinished) && match.homeTeam.score !== undefined && (
              <span className="text-2xl font-bold text-kcvv-green-dark">{match.homeTeam.score}</span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {match.awayTeam.logo && (
                <img
                  src={match.awayTeam.logo}
                  alt={`${match.awayTeam.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              )}
              <span className="font-semibold text-gray-900">{match.awayTeam.name}</span>
            </div>
            {(isLive || isFinished) && match.awayTeam.score !== undefined && (
              <span className="text-2xl font-bold text-kcvv-green-dark">{match.awayTeam.score}</span>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="pt-4 border-t border-gray-200">
          {isPostponed && (
            <span className="text-orange-600 font-semibold text-sm uppercase">Uitgesteld</span>
          )}
          {isCancelled && (
            <span className="text-red-600 font-semibold text-sm uppercase">Afgelast</span>
          )}
          {!isPostponed && !isCancelled && (
            <div className="text-sm text-gray-600">
              <div className="font-semibold">{formatMatchDate(match.date)}</div>
              {match.time && <div>{match.time}</div>}
              {match.venue && <div>{match.venue}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
