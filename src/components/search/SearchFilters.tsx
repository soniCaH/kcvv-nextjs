"use client";

/**
 * SearchFilters Component
 * Content type filters for search results
 */

import { SearchResultType } from "./SearchInterface";
import { cn } from "@/lib/utils/cn";

export interface SearchFiltersProps {
  /**
   * Active filter type
   */
  activeType: SearchResultType | "all";
  /**
   * Callback when filter changes
   */
  onFilterChange: (type: SearchResultType | "all") => void;
  /**
   * Result counts per type
   */
  resultCounts: {
    all: number;
    article: number;
    player: number;
    team: number;
  };
}

const filters: Array<{
  type: SearchResultType | "all";
  label: string;
  icon: string;
}> = [
  { type: "all", label: "Alles", icon: "🔍" },
  { type: "article", label: "Nieuws", icon: "📰" },
  { type: "player", label: "Spelers", icon: "⚽" },
  { type: "team", label: "Teams", icon: "🏆" },
];

/**
 * Search type filters
 */
export const SearchFilters = ({
  activeType,
  onFilterChange,
  resultCounts,
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const count = resultCounts[filter.type];
        const isActive = activeType === filter.type;

        return (
          <button
            key={filter.type}
            onClick={() => onFilterChange(filter.type)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all",
              "flex items-center gap-2",
              isActive
                ? "bg-green-main text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-main hover:bg-green-50",
            )}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                isActive
                  ? "bg-white/30 text-white"
                  : "bg-gray-100 text-gray-600",
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
