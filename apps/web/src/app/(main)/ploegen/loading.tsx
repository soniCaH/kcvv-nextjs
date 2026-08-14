/**
 * Team listing — loading skeleton. Mirrors the Phase 6.C composition:
 * editorial header → two flagship blocks → youth grid.
 */

import { PageContainer } from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";

function FlagshipSkeleton() {
  return (
    <div className="border-ink grid animate-pulse grid-cols-1 border-2 sm:grid-cols-[1.25fr_1fr]">
      <div className="flex flex-col gap-4 p-6 sm:p-10">
        <div className="bg-paper-edge h-3 w-24" />
        <div className="bg-paper-edge h-10 w-48" />
        <div className="bg-paper-edge h-3 w-32" />
        <div className="bg-paper-edge mt-2 h-9 w-36" />
      </div>
      <div className="bg-cream-soft min-h-[220px] sm:min-h-[300px]" />
    </div>
  );
}

export default function TeamsLoading() {
  return (
    <PageContainer width="index" className="py-12 sm:py-16">
      <PageHeroSkeleton register="minimal" lead />

      <div className="flex flex-col gap-10 sm:gap-16">
        <FlagshipSkeleton />
        <FlagshipSkeleton />
      </div>

      <div className="mt-16 animate-pulse space-y-8">
        <div className="bg-paper-edge h-8 w-48" />
        {Array.from({ length: 3 }).map((_, div) => (
          <div key={div} className="space-y-4">
            <div className="bg-paper-edge h-3 w-40" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-paper-edge h-20 border-2" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
