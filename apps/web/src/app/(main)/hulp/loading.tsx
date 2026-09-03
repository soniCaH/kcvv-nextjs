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

      {/* Sticky two-door nav placeholder — the real bar is `bg-cream-deep`
          at `py-2` (#2478 rule 4), and its two items are the light chip
          (rule 1), not bare bars. */}
      <div className="border-ink bg-cream-deep border-b-2" aria-hidden>
        <div className="mx-auto flex max-w-[var(--container-index)] items-center gap-3 px-4 py-2 md:px-8">
          <div className="border-ink border px-3 py-1.5 shadow-[1px_1px_0_0_var(--color-ink)]">
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="border-ink border px-3 py-1.5 shadow-[1px_1px_0_0_var(--color-ink)]">
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="ml-auto h-9 w-44" />
        </div>
      </div>

      <PageContainer width="index" className="py-10 sm:py-14">
        {/* Hero band — matches OrganigramHero.tsx's 6px offset shadow
            exactly (the `shadow-paper-md` token IS that value). */}
        <div
          aria-hidden
          className="bg-jersey-deep-dark border-ink shadow-paper-md h-56 border-2"
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
          {/* QuestionCard.tsx's own shadow is a raw 3px arbitrary value, not
              one of the shadow-paper-* tokens (its own offset, not ours to
              round to the nearest token) — matched exactly rather than to
              the nearest 4px token. */}
          <div
            aria-hidden
            className="border-ink bg-cream h-14 border-2 shadow-[3px_3px_0_0_var(--color-ink)]"
          />
          <div
            aria-hidden
            className="border-ink bg-cream h-14 border-2 shadow-[3px_3px_0_0_var(--color-ink)]"
          />
          <div
            aria-hidden
            className="border-ink bg-cream h-14 border-2 shadow-[3px_3px_0_0_var(--color-ink)]"
          />
        </div>
      </PageContainer>
    </div>
  );
}
