/**
 * `/hulp` hub — route-level loading skeleton.
 *
 * Cream-paper placeholder shaped like the hub (sticky two-door nav · dark hero
 * band · finder), shown for cold navigations before the RSC payload arrives.
 * Mirrors the hub shell (page.tsx) rather than the retired section-stack layout.
 */
import {
  PageContainer,
  FilterTabsSkeleton,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";

export default function HulpLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <LoadingAnnouncement label="Hulppagina laden…" />

      {/* Sticky two-door nav placeholder. */}
      <div className="border-ink bg-cream border-b-2" aria-hidden>
        <div className="mx-auto flex max-w-[var(--container-index)] items-center gap-3 px-4 py-3 md:px-8">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="ml-auto h-9 w-44" />
        </div>
      </div>

      <PageContainer width="index" className="py-10 sm:py-14">
        {/* Hero band. */}
        <div
          aria-hidden
          className="bg-jersey-deep-dark border-ink shadow-paper-lift h-56 border-2"
        />

        {/* Finder placeholder — heading · both <FilterTabs> rows (#2429/
            #2564 — audience, then category; the shared <FilterTabsSkeleton>,
            review item 4) · accordion rows. */}
        <div className="mt-12 space-y-3">
          <Skeleton className="h-7 w-56" />
          <FilterTabsSkeleton
            count={5}
            widths={["w-14", "w-16", "w-16", "w-20", "w-20"]}
          />
          <FilterTabsSkeleton
            count={7}
            widths={["w-14", "w-20", "w-24", "w-20", "w-16", "w-20", "w-20"]}
          />
          <div
            aria-hidden
            className="border-ink bg-cream shadow-paper-sm h-14 border-2"
          />
          <div
            aria-hidden
            className="border-ink bg-cream shadow-paper-sm h-14 border-2"
          />
          <div
            aria-hidden
            className="border-ink bg-cream shadow-paper-sm h-14 border-2"
          />
        </div>
      </PageContainer>
    </div>
  );
}
