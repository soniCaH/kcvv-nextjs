"use client";

/**
 * SearchInterface Component
 * Main search interface with form, filters, and results
 */

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchForm } from "./SearchForm";
import { SearchFilters } from "./SearchFilters";
import { SearchResults } from "./SearchResults";
import { Spinner } from "@/components/design-system";

export type SearchResultType = "article" | "player" | "team";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
  date?: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: SearchResult[];
}

export interface SearchInterfaceProps {
  /**
   * Initial search query from URL
   */
  initialQuery?: string;
  /**
   * Initial content type filter
   */
  initialType?: SearchResultType;
}

/**
 * Main search interface component
 */
export const SearchInterface = ({
  initialQuery = "",
  initialType,
}: SearchInterfaceProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL
  const urlQuery = searchParams.get("q") || initialQuery;
  const urlType = (searchParams.get("type") as SearchResultType) || initialType;

  // State
  const [query, setQuery] = useState(urlQuery);
  const [activeType, setActiveType] = useState<SearchResultType | "all">(
    urlType || "all",
  );
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Perform search
   */
  const performSearch = useCallback(
    async (searchQuery: string, type: SearchResultType | "all" = "all") => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setResults([]);
        setTotalCount(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Build URL with query params
        const params = new URLSearchParams({ q: searchQuery.trim() });
        if (type && type !== "all") {
          params.append("type", type);
        }

        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data: SearchResponse = await response.json();
        setResults(data.results);
        setTotalCount(data.count);
      } catch {
        setError("Er is een fout opgetreden bij het zoeken. Probeer opnieuw.");
        setResults([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Handle search submit
   */
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      // Update URL
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }
      if (activeType && activeType !== "all") {
        params.set("type", activeType);
      }

      router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);

      // Perform search
      performSearch(searchQuery, activeType);
    },
    [activeType, router, performSearch],
  );

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback(
    (type: SearchResultType | "all") => {
      setActiveType(type);

      // Update URL
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      }
      if (type && type !== "all") {
        params.set("type", type);
      }

      router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);

      // Re-perform search with new filter
      if (query.trim()) {
        performSearch(query, type);
      }
    },
    [query, router, performSearch],
  );

  /**
   * Initial search on mount if URL has query
   */
  useEffect(() => {
    if (urlQuery && urlQuery.trim().length >= 2) {
      performSearch(urlQuery, urlType || "all");
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <SearchForm
        initialValue={query}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Show results only if query exists */}
      {query.trim().length > 0 && (
        <>
          {/* Filters */}
          <SearchFilters
            activeType={activeType}
            onFilterChange={handleFilterChange}
            resultCounts={{
              all: totalCount,
              article: results.filter((r) => r.type === "article").length,
              player: results.filter((r) => r.type === "player").length,
              team: results.filter((r) => r.type === "team").length,
            }}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <SearchResults
              results={results}
              query={query}
              activeType={activeType}
            />
          )}
        </>
      )}

      {/* Help Text - Show when no query */}
      {query.trim().length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-bold text-gray-blue mb-4">
            Wat wil je zoeken?
          </h2>
          <p className="text-gray-dark mb-6">
            Typ minimaal 2 karakters om te zoeken naar nieuws, spelers, teams en
            meer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-blue mb-2">
                📰 Nieuwsartikelen
              </h3>
              <p className="text-sm text-gray-dark">
                Zoek op titel, inhoud of tags
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-blue mb-2">⚽ Spelers</h3>
              <p className="text-sm text-gray-dark">
                Vind spelers op naam of positie
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-blue mb-2">🏆 Teams</h3>
              <p className="text-sm text-gray-dark">
                Zoek teams op naam of leeftijdsgroep
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
