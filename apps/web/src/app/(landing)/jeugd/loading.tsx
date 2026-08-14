/**
 * `/jeugd` loading skeleton — mirrors the composition: the shared opening's
 * dark register (group photo beside the words, #2555) → seam → filosofie/visie
 * block → editorial nav grid → youth-directory division grid.
 */

import { PageContainer, StripedSeam } from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";

export default function JeugdLoading() {
  return (
    <>
      <PageHeroSkeleton register="band" tone="dark" width="index" image lead />

      <StripedSeam colorPair="ink-cream" height="md" />

      <PageContainer width="index" className="py-12 sm:py-16">
        {/* Filosofie / visie block */}
        <div className="animate-pulse">
          <div className="bg-paper-edge mb-4 h-3 w-40" />
          <div className="bg-paper-edge h-32 w-full" />
        </div>

        {/* Editorial nav grid */}
        <div className="mt-16 grid animate-pulse grid-cols-1 gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-paper-edge aspect-[16/9]" />
          ))}
        </div>

        {/* Youth directory */}
        <div className="mt-16 animate-pulse space-y-8">
          <div className="bg-paper-edge h-8 w-44" />
          {Array.from({ length: 3 }).map((_, div) => (
            <div key={div} className="space-y-4">
              <div className="bg-paper-edge h-4 w-32" />
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-paper-edge h-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* CTA band (full-bleed) */}
      <div className="bg-jersey-deep-dark border-ink animate-pulse border-y-2">
        <div className="mx-auto flex max-w-[var(--container-index)] flex-col items-center gap-4 px-4 py-12 sm:py-16 md:px-8">
          <div className="bg-cream/15 h-8 w-72 max-w-full" />
          <div className="bg-cream/15 h-4 w-96 max-w-full" />
          <div className="bg-cream/15 h-11 w-40" />
        </div>
      </div>
    </>
  );
}
