/**
 * Search Page — Loading Skeleton
 *
 * Mirrors the 8s1 shell: the real `<SearchMasthead>` band (heading + inert
 * field) over a cream results-area skeleton. No legacy gray/green tokens.
 */

import { SearchMastheadSkeleton } from "@/components/search/SearchMastheadSkeleton";
import { PageContainer, FilterTabsSkeleton } from "@/components/design-system";

export default function SearchLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <span role="status" aria-live="polite" className="sr-only">
        Zoekpagina laden...
      </span>

      <SearchMastheadSkeleton />

      <PageContainer width="index" className="py-12">
        {/* Filter chips — the shared <FilterTabsSkeleton> (#2564 review
            items 3 + 4); this used to draw 4 uniform `gap-2` placeholders
            with no `pb-1.5`, for the real 5-tab (Alles · Nieuws · Spelers ·
            Staf · Ploegen) `gap-3` row. */}
        <FilterTabsSkeleton widths={["w-14", "w-16", "w-16", "w-12", "w-16"]} />

        {/* Result rows */}
        <div className="mt-8 space-y-4 motion-safe:animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-ink/15 flex gap-4 rounded-none border-2 bg-white p-4 shadow-[2px_2px_0_0_var(--color-ink)]"
            >
              <div className="bg-ink/10 h-16 w-16 flex-none" />
              <div className="flex-1 space-y-2">
                <div className="bg-ink/10 h-3 w-24" />
                <div className="bg-ink/10 h-4 w-3/4" />
                <div className="bg-ink/10 h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
