/**
 * News Listing Page — Loading Skeleton.
 *
 * Mirrors `NewsListingClient`: a sticky dark category-filter bar over one
 * chronological 1 → 2 → 3 listing grid. Index width (1280). Cards use the
 * canonical paper-register chrome (`border-2 border-ink`, square corners,
 * offset `shadow-paper-sm`, `cream-soft`/`paper-edge` fills).
 *
 * The "Uitgelicht" featured row #2432 wrote this skeleton against is gone —
 * #2569 deleted it from the page, so shimmering it here would announce a shape
 * that never arrives.
 */

import {
  PageContainer,
  TapedCardGrid,
  FilterTabsSkeleton,
} from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";

/** A flush-image card footprint — image atop a border-2 ink body. */
function NewsCardSkeleton() {
  return (
    <div className="border-ink bg-cream-soft shadow-paper-sm overflow-hidden border-2">
      <div className="bg-paper-edge border-ink aspect-[3/2] border-b-2" />
      <div className="space-y-2 p-4">
        <div className="bg-paper-edge h-3 w-16" />
        <div className="bg-paper-edge h-5 w-full" />
        <div className="bg-paper-edge h-5 w-2/3" />
        <div className="bg-paper-edge h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function NewsLoading() {
  return (
    <div className="w-full">
      <span
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="sr-only"
      >
        Nieuws laden...
      </span>

      {/* The opening — kicker + headline, above the sticky bar. */}
      <PageContainer width="index" className="pt-12 sm:pt-16">
        <PageHeroSkeleton register="minimal" />
      </PageContainer>

      {/* Sticky filter bar — mirrors the page's dark category-filter band.
          The shared <FilterTabsSkeleton> (#2564 review items 3 + 4): the
          real row dropped its `size="sm"` (~29px) chip for the one `md`
          (~36px) size on absorption, and this skeleton — still drawing
          `h-8` (32px) — used to reflow on every /nieuws load. */}
      <div className="bg-ink/95 sticky top-0 z-30 border-b border-white/10 py-3 backdrop-blur-sm">
        <PageContainer width="index">
          <FilterTabsSkeleton
            surface="inverse"
            widths={["w-16", "w-20", "w-24", "w-20", "w-16"]}
          />
        </PageContainer>
      </div>

      <PageContainer width="index" className="py-6">
        {/* Chronological listing — the same primitive the page renders, so the
            ladder and gutter cannot drift out of the loading state. */}
        <TapedCardGrid
          columns={3}
          gap="md"
          className="mb-6 motion-safe:animate-pulse"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </TapedCardGrid>
      </PageContainer>
    </div>
  );
}
