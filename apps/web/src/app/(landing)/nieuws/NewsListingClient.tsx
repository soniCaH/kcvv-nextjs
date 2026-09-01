"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ArticleVM } from "@/lib/repositories/article.repository";
import { NewsCard, CategoryFilters } from "@/components/article";
import {
  EmptyState,
  LoadMoreFooter,
  PageContainer,
  TapedCardGrid,
} from "@/components/design-system";
import { formatArticleDate } from "@/lib/utils/dates";
import { articleTypeCardLabel } from "@/lib/utils/article-type-label";
import { LISTING_BATCH_SIZE, LISTING_INITIAL_TOTAL } from "@/lib/constants";
import { deduplicateById, type Paginated } from "@/lib/utils/pagination";
import {
  filteredEmptyBody,
  pendingEmptyBody,
} from "@/lib/utils/empty-state-copy";

interface Category {
  id: string;
  attributes: { name: string; slug: string };
}

interface NewsListingClientProps {
  initialArticles: ArticleVM[];
  categories: Category[];
  hasMore: boolean;
  initialCategory?: string;
  fetchArticles: (params: {
    offset: number;
    limit: number;
    category?: string;
  }) => Promise<Paginated<ArticleVM>>;
}

export function NewsListingClient({
  initialArticles,
  categories,
  hasMore: initialHasMore,
  initialCategory,
  fetchArticles,
}: NewsListingClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(
    initialCategory ?? "all",
  );
  const [gridArticles, setGridArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    retry: () => void;
  } | null>(null);
  const categoryRequestId = useRef(0);
  const isLoadingRef = useRef(false);
  const nextOffsetRef = useRef(initialArticles.length);
  const loadMoreRef = useRef<() => void>(() => {});
  const handleCategoryChangeRef = useRef<(category: string) => void>(() => {});

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingRef.current) return;
    isLoadingRef.current = true;
    const requestId = categoryRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const category = activeCategory === "all" ? undefined : activeCategory;
      const offset = nextOffsetRef.current;

      const result = await fetchArticles({
        offset,
        limit: LISTING_BATCH_SIZE,
        category,
      });

      // Discard if a category switch happened while loading
      if (requestId !== categoryRequestId.current) return;

      setGridArticles((prev) => {
        const existingIds = new Set(prev.map((a) => a.id));
        return [...prev, ...deduplicateById(result.items, existingIds)];
      });
      nextOffsetRef.current += result.items.length;
      setHasMore(result.hasMore);
    } catch (err) {
      if (requestId !== categoryRequestId.current) return;
      console.error("[loadMore] Failed to load articles:", err);
      setError({
        message: "Artikelen laden mislukt.",
        retry: () => {
          setError(null);
          loadMoreRef.current();
        },
      });
    } finally {
      isLoadingRef.current = false;
      if (requestId === categoryRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [hasMore, activeCategory, fetchArticles]);

  // Category change handler
  const handleCategoryChange = useCallback(
    async (category: string) => {
      if (category === activeCategory) return;
      const prevCategory = activeCategory;
      const requestId = ++categoryRequestId.current;
      setActiveCategory(category);
      setIsLoading(true);
      setError(null);

      const categoryFilter = category === "all" ? undefined : category;

      try {
        const result = await fetchArticles({
          offset: 0,
          limit: LISTING_INITIAL_TOTAL,
          category: categoryFilter,
        });

        // Ignore stale responses from superseded category switches
        if (requestId !== categoryRequestId.current) return;

        setGridArticles(deduplicateById(result.items, new Set()));
        nextOffsetRef.current = result.items.length;
        setHasMore(result.hasMore);

        // Update URL and scroll only after successful fetch. `router.push`
        // (not `history.replaceState`) so a filter is a real history entry —
        // browser back undoes it, the same mechanism every filter row on the
        // site now shares (#2429 resolution, rule 5). `scroll: false`: this
        // component already owns the scroll-to-top below.
        const url = categoryFilter
          ? `/nieuws?categorie=${encodeURIComponent(categoryFilter)}`
          : "/nieuws";
        router.push(url, { scroll: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        if (requestId !== categoryRequestId.current) return;
        setActiveCategory(prevCategory);
        console.error("[handleCategoryChange] Failed to load articles:", err);
        setError({
          message: "Artikelen laden mislukt.",
          retry: () => {
            setError(null);
            handleCategoryChangeRef.current(category);
          },
        });
      } finally {
        if (requestId === categoryRequestId.current) {
          setIsLoading(false);
        }
      }
    },
    [activeCategory, fetchArticles, router],
  );

  useEffect(() => {
    loadMoreRef.current = loadMore;
    handleCategoryChangeRef.current = handleCategoryChange;
  }, [loadMore, handleCategoryChange]);

  // The filtered EmptyState's undo action — defined here, not inline in the
  // JSX below, so the callback closes over `handleCategoryChange` at the
  // component's top level rather than inside the render-time IIFE that
  // computes `activeCategoryLabel`.
  const undoAllCategories = useCallback(
    () => handleCategoryChange("all"),
    [handleCategoryChange],
  );
  const undoAction = useMemo(
    () => ({
      label: "Toon alles",
      onClick: undoAllCategories,
      analyticsSource: "nieuws" as const,
      analyticsFacet: activeCategory,
    }),
    [undoAllCategories, activeCategory],
  );

  const isEmpty = gridArticles.length === 0 && !isLoading;

  return (
    <div className="w-full">
      {/* Sticky filter bar */}
      <div className="bg-ink/95 sticky top-0 z-30 border-b border-white/10 py-3 backdrop-blur-sm">
        <PageContainer width="index">
          <CategoryFilters
            categories={categories}
            activeCategory={
              activeCategory === "all" ? undefined : activeCategory
            }
            renderAsLinks={false}
            onChange={handleCategoryChange}
          />
        </PageContainer>
      </div>

      <PageContainer width="index" className="py-6">
        {/* One chronological grid — an archive is chronological. The
            "Uitgelicht." row this page used to open with was
            `articles.slice(0, 3)` relabelled, so nothing curated it and the
            same three headed the grid anyway; `Uitgelicht` survives on the
            homepage, where it is editorially chosen (#2569 / decision #2431). */}
        {/* The grid renders nothing of its own when the list is empty, so the
            empty state below is the only branch this page needs. */}
        <TapedCardGrid columns={3} gap="md" className="mb-6">
          {gridArticles.map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              href={`/nieuws/${article.slug}`}
              imageUrl={article.coverImageUrl ?? undefined}
              badge={article.tags[0] ?? undefined}
              typeLabel={articleTypeCardLabel(article.articleType)}
              date={
                article.publishedAt
                  ? formatArticleDate(new Date(article.publishedAt))
                  : undefined
              }
            />
          ))}
        </TapedCardGrid>

        {/* Empty state. `activeCategoryLabel` is resolved here, not hoisted —
            the `.find()` it runs has no reason to pay for itself on every
            render of an infinite-scroll page when it's read only in this
            branch (#2562 review round 3, D6). */}
        {isEmpty &&
          !error &&
          (() => {
            // Names the active facet by label ("Jeugd"), not a generic
            // "deze categorie" — the copy is the tell (#2427 rule 5). `null`
            // for "all", which is genuine emptiness, not a filter having
            // emptied the surface. `activeCategory` holds a SLUG
            // (`CategoryFilters` builds its tab values from
            // `category.attributes.slug`, and `initialCategory` comes from
            // the `?categorie=` slug) — match on slug, not `id`. The two
            // look interchangeable today only because `nieuws/page.tsx`
            // currently synthesises `{ id: tag, attributes: { name: tag,
            // slug: tag } }` (#2562 review).
            const activeCategoryLabel =
              activeCategory === "all"
                ? null
                : (categories.find((c) => c.attributes.slug === activeCategory)
                    ?.attributes.name ?? activeCategory);

            return activeCategoryLabel ? (
              <EmptyState
                tier="surface"
                heading={`Geen artikelen in ${activeCategoryLabel}`}
                live
                reason="filtered"
                undo={undoAction}
                className="mb-6"
              >
                {filteredEmptyBody("het volledige overzicht")}
              </EmptyState>
            ) : (
              <EmptyState
                tier="surface"
                heading="Nog geen artikelen"
                live
                className="mb-6"
              >
                {pendingEmptyBody("we een artikel publiceren", "het")}
              </EmptyState>
            );
          })()}

        {/* Error retry · in-flight spinner · load-more (NEWS-1, #2237 —
            replaces the old infinite scroll). Appends LISTING_BATCH_SIZE
            more articles per click. */}
        <LoadMoreFooter
          label="Meer nieuws laden"
          hasMore={hasMore}
          isLoading={isLoading}
          error={error?.message}
          onLoadMore={error ? error.retry : loadMore}
        />
      </PageContainer>
    </div>
  );
}
