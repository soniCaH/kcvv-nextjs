/**
 * SponsorsFilters Component
 * Interactive filter controls for sponsors (tier filter, search, sort)
 */

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { SponsorTier } from './SponsorsTier'

export interface SponsorsFiltersProps {
  /**
   * Callback when filters change
   */
  onFilterChange: (filters: FilterState) => void
  /**
   * Total number of sponsors across all tiers
   */
  totalCount: number
  /**
   * Number of sponsors after filtering
   */
  filteredCount: number
  /**
   * Additional CSS classes
   */
  className?: string
}

export interface FilterState {
  tier: 'all' | SponsorTier
  search: string
  sort: 'name' | 'tier'
}

export const SponsorsFilters = ({
  onFilterChange,
  totalCount,
  filteredCount,
  className,
}: SponsorsFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    tier: 'all',
    search: '',
    sort: 'tier',
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8', className)}>
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div>
          <label htmlFor="sponsor-search" className="block text-sm font-semibold text-gray-700 mb-2">
            Zoeken
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="sponsor-search"
              type="text"
              placeholder="Zoek op naam..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kcvv-green-bright focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Tier Filter */}
          <div>
            <label htmlFor="tier-filter" className="block text-sm font-semibold text-gray-700 mb-2">
              Niveau
            </label>
            <select
              id="tier-filter"
              value={filters.tier}
              onChange={(e) => handleFilterChange({ tier: e.target.value as FilterState['tier'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kcvv-green-bright focus:border-transparent"
            >
              <option value="all">Alle sponsors</option>
              <option value="gold">⭐ Goud</option>
              <option value="silver">🥈 Zilver</option>
              <option value="bronze">🥉 Brons</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-filter" className="block text-sm font-semibold text-gray-700 mb-2">
              Sorteren
            </label>
            <select
              id="sort-filter"
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value as FilterState['sort'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kcvv-green-bright focus:border-transparent"
            >
              <option value="tier">Op niveau</option>
              <option value="name">Op naam (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredCount === totalCount ? (
              <>{totalCount} sponsors</>
            ) : (
              <>
                {filteredCount} van {totalCount} sponsors
              </>
            )}
          </p>
          {(filters.search || filters.tier !== 'all') && (
            <button
              aria-label="Wis alle filters"
              onClick={() =>
                handleFilterChange({
                  tier: 'all',
                  search: '',
                })
              }
              className="text-sm text-kcvv-green-bright hover:text-kcvv-green font-semibold"
            >
              Wis filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
