"use client";

/**
 * CategoryFilters Component (Migrated to FilterTabs)
 *
 * News category filter using the unified FilterTabs component.
 * Renders as Next.js Links for client-side navigation.
 *
 * This is now a thin wrapper around FilterTabs for consistency
 * across all filter components in the application.
 */

import { useMemo } from "react";
import { FilterTabs, type FilterTab } from "@/components/ui/FilterTabs";

interface Category {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

interface CategoryFiltersProps {
  categories: Category[];
  activeCategory?: string;
  size?: "sm" | "md" | "lg";
  showCounts?: boolean;
  renderAsLinks?: boolean;
  onChange?: (category: string) => void;
}

/**
 * Render a horizontally scrollable list of news category filters
 * with left/right scroll controls and active-category highlighting.
 *
 * @param categories - Array of category objects
 * @param activeCategory - Slug of the currently active category
 * @param size - Size variant (sm | md | lg)
 * @param showCounts - Show article counts (future enhancement)
 * @param renderAsLinks - Render as Next.js links (true) or buttons (false)
 * @param onChange - Change handler for button mode
 */
export function CategoryFilters({
  categories,
  activeCategory,
  size = "sm",
  showCounts = false,
  renderAsLinks = true,
  onChange,
}: CategoryFiltersProps) {
  // Convert categories to FilterTab format with hrefs for Next.js routing
  const tabs: FilterTab[] = useMemo(() => {
    const allTab: FilterTab = {
      value: "all",
      label: "Alles",
      href: "/news",
    };

    const categoryTabs: FilterTab[] = categories.map((category) => ({
      value: category.attributes.slug,
      label: category.attributes.name,
      href: `/news?category=${encodeURIComponent(category.attributes.slug)}`,
    }));

    return [allTab, ...categoryTabs];
  }, [categories]);

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeCategory || "all"}
      size={size}
      showCounts={showCounts}
      renderAsLinks={renderAsLinks}
      onChange={onChange}
      ariaLabel="Filter news by category"
    />
  );
}
