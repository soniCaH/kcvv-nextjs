"use client";

/**
 * SearchResults Component
 * Display list of search results
 */

import {
  SearchResult as SearchResultType,
  SearchResultType as ContentType,
} from "./SearchInterface";
import { SearchResult } from "./SearchResult";

export interface SearchResultsProps {
  /**
   * Search results to display
   */
  results: SearchResultType[];
  /**
   * Search query for highlighting
   */
  query: string;
  /**
   * Active content type filter
   */
  activeType: ContentType | "all";
}

/**
 * Search results list
 * Note: Results are always unfiltered from API.
 * Client-side filtering is applied here based on activeType.
 */
export const SearchResults = ({
  results,
  query,
  activeType,
}: SearchResultsProps) => {
  // Filter results by active type (client-side)
  const filteredResults =
    activeType === "all"
      ? results
      : results.filter((result) => result.type === activeType);

  if (filteredResults.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-blue mb-2">
          Geen resultaten gevonden
        </h3>
        <p className="text-gray-dark">
          Probeer een andere zoekopdracht of pas de filters aan
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="text-gray-dark">
        <span className="font-semibold text-gray-blue">
          {filteredResults.length}
        </span>{" "}
        {filteredResults.length === 1 ? "resultaat" : "resultaten"} voor &quot;
        <span className="font-semibold text-gray-blue">{query}</span>&quot;
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <SearchResult
            key={`${result.type}:${result.id}`}
            result={result}
            query={query}
          />
        ))}
      </div>
    </div>
  );
};
