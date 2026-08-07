/**
 * Homepage — Loading Skeleton.
 *
 * Mirrors the spine of `(landing)/page.tsx` (#2387):
 *   <EditorialHero placement="homepage">  ← index (1280) hero band
 *     → <FirstTeamsBlock>                   ← jersey-deep-dark matchday desk
 *     → <FeaturedUitgelichtRow>            ← cream-soft 3-up Uitgelicht row
 *     → <NewsGrid>                          ← 3-up latest-news grid
 *     → <UpcomingMatches>                   ← matches band
 *     → <YouthSection>                      ← jersey-deep youth band
 *     → <SponsorsSection>                   ← sponsor logo grid
 *
 * Keep this in step with the real components: a skeleton whose aspect ratio or
 * column count differs from what replaces it makes the swap visibly reflow.
 *
 * Index width (1280) throughout. Canonical paper-register chrome only —
 * `border-2 border-ink`, square corners, `paper-edge`/`cream-soft` fills,
 * `motion-safe:animate-pulse` bars.
 */

import { PageContainer, StripedSeam } from "@/components/design-system";

/** A flush-image card footprint — image atop a border-2 ink body. */
function CardSkeleton() {
  return (
    <div className="border-ink bg-cream-soft shadow-paper-sm overflow-hidden border-2">
      <div className="bg-paper-edge border-ink aspect-[16/9] border-b-2" />
      <div className="space-y-2 p-4">
        <div className="bg-paper-edge h-3 w-16" />
        <div className="bg-paper-edge h-5 w-full" />
        <div className="bg-paper-edge h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <span
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="sr-only"
      >
        Startpagina laden...
      </span>

      {/* EditorialHero — index (1280): words column beside a framed cover. */}
      <PageContainer
        width="index"
        className="pt-10 pb-4 motion-safe:animate-pulse md:pt-14 md:pb-6"
        aria-hidden="true"
      >
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-8 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <div className="bg-paper-edge h-3 w-28" />
            <div className="bg-paper-edge h-12 w-full" />
            <div className="bg-paper-edge h-12 w-2/3" />
            <div className="bg-paper-edge mt-1 h-4 w-5/6" />
          </div>
          <div className="border-ink bg-cream-soft shadow-paper-md aspect-[16/9] w-full border-2" />
        </div>
      </PageContainer>

      {/* Dit weekend — jersey-deep-dark matchday desk, seam top and bottom. */}
      <StripedSeam colorPair="cream-jersey-deep" height="md" />
      <section
        aria-hidden="true"
        className="bg-jersey-deep-dark motion-safe:animate-pulse"
      >
        <PageContainer width="index" className="py-10 md:py-12">
          <div className="bg-cream/20 mb-4 h-3 w-32" />
          <div className="bg-cream/25 mb-8 h-9 w-64 max-w-full" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="border-cream/20 grid gap-3 border-t py-5 first:border-t-0 md:grid-cols-[0.72fr_1.25fr_1.25fr] md:gap-5"
            >
              <div className="bg-cream/20 h-6 w-32" />
              <div className="bg-cream/10 h-16" />
              <div className="bg-cream/10 h-16" />
            </div>
          ))}
        </PageContainer>
      </section>
      <StripedSeam colorPair="cream-jersey-deep" height="md" flip />

      {/* Uitgelicht — cream-soft 3-up featured row. */}
      <div className="bg-cream-soft py-12 md:py-16">
        <PageContainer width="index" className="motion-safe:animate-pulse">
          <div className="bg-paper-edge mb-6 h-9 w-48" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Latest news — 3×2 grid. */}
      <PageContainer
        width="index"
        className="py-12 motion-safe:animate-pulse md:py-16"
        aria-hidden="true"
      >
        <div className="bg-paper-edge mb-6 h-9 w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </PageContainer>

      {/* Upcoming matches band. */}
      <PageContainer
        width="index"
        className="py-12 motion-safe:animate-pulse md:py-16"
        aria-hidden="true"
      >
        <div className="bg-paper-edge mb-6 h-9 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border-ink bg-cream shadow-paper-sm h-32 border-2"
            />
          ))}
        </div>
      </PageContainer>

      {/* Youth band — jersey-deep field with seam at its top edge. */}
      <StripedSeam colorPair="cream-jersey-deep" height="md" />
      <section
        aria-hidden="true"
        className="bg-jersey-deep py-16 motion-safe:animate-pulse md:py-20"
      >
        <PageContainer width="index">
          <div className="bg-cream/20 mb-4 h-3 w-28" />
          <div className="bg-cream/25 mb-3 h-10 w-72 max-w-full" />
          <div className="bg-cream/15 mb-8 h-4 w-96 max-w-full" />
          <div className="flex gap-3">
            <div className="bg-warm/50 h-11 w-40" />
            <div className="bg-cream/20 h-11 w-40" />
          </div>
        </PageContainer>
      </section>

      {/* Sponsors — logo grid. */}
      <PageContainer
        width="index"
        className="py-12 motion-safe:animate-pulse md:py-16"
        aria-hidden="true"
      >
        <div className="bg-paper-edge mb-6 h-9 w-44" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-ink bg-cream shadow-paper-sm aspect-[3/2] border-2"
            />
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
