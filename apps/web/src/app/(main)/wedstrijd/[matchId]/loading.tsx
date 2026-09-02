/**
 * Match Detail Page — Loading Skeleton.
 *
 * Mirrors the Phase 6.B composition of `wedstrijd/[matchId]/page.tsx`:
 *   <MatchHero>                 ← single TapedCard (stub + score body)
 *     → <StripedSeam>
 *     → <MatchLineupSection>     ← kicker + heading + 2-col lineup rows
 *     → <StripedSeam>
 *     → <MatchEventsSection>     ← kicker + heading + timeline rows
 *     → <StripedSeam>
 *     → <MatchStandingsSection>  ← kicker + heading + head-to-head table
 *     → <StripedSeam>
 *     → <MatchArticleLinkCard>   ← cover + body link card
 *
 * `<MatchHero>` owns the page's `<h1>` from the two club names — data — so
 * this renders no heading text at all, bars only.
 *
 * All wide (1040), cream-on-paper register. `min-h-screen` root preserved per
 * the envelope-drift guard in
 * `apps/web/src/app/__tests__/loading-envelope.test.tsx` — non-SectionStack
 * routes pin to a contract root className.
 */

import {
  PageContainer,
  StripedSeam,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";

/** Shared kicker + display-heading footprint for the cream body sections. */
function SectionHeadingSkeleton() {
  return (
    <>
      <Skeleton className="mb-3 h-3 w-32" />
      <Skeleton className="mb-8 h-8 w-64 md:mb-10" />
    </>
  );
}

export default function MatchDetailLoading() {
  return (
    <div className="min-h-screen">
      <LoadingAnnouncement label="Wedstrijd laden…" />

      {/* MatchHero — single TapedCard with a dashed stub + score body. */}
      <PageContainer
        as="section"
        className="bg-cream-soft py-8"
        aria-hidden="true"
      >
        <div className="border-ink bg-cream shadow-paper-md grid grid-cols-1 border-2 md:grid-cols-[110px_1fr]">
          <div className="border-ink space-y-2 border-b-2 border-dashed p-5 md:border-r-2 md:border-b-0">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-col gap-6 p-5 md:p-6">
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <Skeleton className="h-5 max-w-32 min-w-0 flex-1" />
              </div>
              <Skeleton className="h-8 w-16" />
              <div className="flex min-w-0 flex-row-reverse items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <Skeleton className="h-5 max-w-32 min-w-0 flex-1" />
              </div>
            </div>
            <div className="border-ink border-t pt-3">
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      </PageContainer>

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* MatchLineupSection — kicker + heading + 2 columns of 11 lineup rows. */}
      <PageContainer
        as="section"
        className="bg-cream py-10 md:py-14"
        aria-hidden="true"
      >
        <SectionHeadingSkeleton />
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col}>
              <div className="border-ink mb-3 border-t pt-2">
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 11 }).map((_, row) => (
                  <div key={row} className="flex items-center gap-3 py-1.5">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* MatchEventsSection — kicker + heading + timeline rows. */}
      <PageContainer
        as="section"
        className="bg-cream py-10 md:py-14"
        aria-hidden="true"
      >
        <SectionHeadingSkeleton />
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1.5">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </PageContainer>

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* MatchStandingsSection — kicker + heading + head-to-head table rows. */}
      <PageContainer
        as="section"
        className="bg-cream py-10 md:py-14"
        aria-hidden="true"
      >
        <SectionHeadingSkeleton />
        <div className="border-ink shadow-paper-sm border-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border-ink flex items-center gap-4 border-b-2 px-4 py-3 last:border-b-0"
            >
              <Skeleton className="h-4 w-5" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      </PageContainer>

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* MatchArticleLinkCard — cover image + body link card. */}
      <PageContainer
        as="section"
        className="bg-cream py-10 md:py-14"
        aria-hidden="true"
      >
        <div className="border-ink bg-cream shadow-paper-md border-2">
          <div className="border-ink aspect-[16/9] w-full border-b-2">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex flex-col gap-3 px-[18px] pt-4 pb-[18px] md:px-8 md:pt-6 md:pb-8">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <div className="border-paper-edge mt-2 border-t-2 pt-3">
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
