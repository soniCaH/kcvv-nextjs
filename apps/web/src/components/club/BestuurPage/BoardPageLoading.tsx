/**
 * BoardPageLoading — shared loading skeleton for the board pages
 * (`/club/bestuur`, `/club/angels`, `/club/jeugdbestuur`).
 *
 * Mirrors `BestuurPage` (the shared shell for all three routes):
 *   <PageHero register="band" tone="dark"> (kicker + headline + group photo)
 *     → <StripedSeam>
 *     → "De leden" — <TeamStaff> grid (auto-fill minmax(150px,1fr), border-2
 *       ink cards)
 *     → <BoardCtaBand> (jersey-deep-dark closing band)
 *
 * Canonical paper-register chrome only — square corners, `paper-edge`/`cream`
 * fills, `motion-safe:animate-pulse` bars. No phantom "staff list" block, no
 * gray/rounded chrome.
 *
 * The `label` prop drives the sr-only `role="status"` text (e.g. "Bestuur
 * laden..."), the only per-route difference between the three skeletons.
 */

import {
  PageContainer,
  StripedSeam,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";

export function BoardPageLoading({ label }: { label: string }) {
  return (
    <div className="min-h-screen space-y-12">
      <LoadingAnnouncement label={label} />

      <PageHeroSkeleton register="band" tone="dark" image lead />

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* "De leden" — staff grid: auto-fill minmax(150px,1fr), border-2 ink cards. */}
      <PageContainer as="section" className="py-12">
        <Skeleton className="mb-6 h-9 w-40" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border-ink bg-cream shadow-paper-sm flex flex-col items-center border-2 p-3 text-center"
            >
              <div className="border-ink bg-cream-soft h-16 w-16 rounded-full border-2" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-2 w-1/2" />
            </div>
          ))}
        </div>
      </PageContainer>

      {/* BoardCtaBand footprint — leading seam + jersey-deep-dark band. */}
      <StripedSeam colorPair="ink-cream" height="md" />
      <section
        aria-hidden="true"
        className="bg-jersey-deep-dark border-ink border-y-2"
      >
        <PageContainer className="py-12 text-center sm:py-16">
          <Skeleton tone="dark" className="mx-auto mb-4 h-9 w-64" />
          <Skeleton tone="dark" className="mx-auto mb-7 h-4 w-80 max-w-full" />
          <div className="bg-warm/60 mx-auto h-11 w-48 motion-safe:animate-pulse" />
        </PageContainer>
      </section>
    </div>
  );
}
