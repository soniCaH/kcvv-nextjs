/**
 * Team listing — loading skeleton. Mirrors the Phase 6.C composition:
 * editorial header → two flagship blocks → youth grid.
 *
 * The opening's kicker/headline/lead are fixed copy, not data, so per
 * #2432 §2 this reuses the real `<PageHero>` unshimmered.
 */

import {
  PageContainer,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";
import { PageHero } from "@/components/layout/PageHero";
import { PLOEGEN_KICKER, PLOEGEN_TITLE, PLOEGEN_LEAD } from "./page";

function FlagshipSkeleton() {
  return (
    <div className="border-ink grid grid-cols-1 border-2 sm:grid-cols-[1.25fr_1fr]">
      <div className="flex flex-col gap-4 p-6 sm:p-10">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-9 w-36" />
      </div>
      <div className="bg-cream-soft min-h-[220px] sm:min-h-[300px]" />
    </div>
  );
}

export default function TeamsLoading() {
  return (
    <PageContainer width="index" className="py-12 sm:py-16">
      <LoadingAnnouncement label="Ploegen laden…" />

      <PageHero
        register="minimal"
        kicker={PLOEGEN_KICKER}
        headline={PLOEGEN_TITLE}
        lead={PLOEGEN_LEAD}
      />

      <div className="flex flex-col gap-10 sm:gap-16">
        <FlagshipSkeleton />
        <FlagshipSkeleton />
      </div>

      <div className="mt-16 space-y-8">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, div) => (
          <div key={div} className="space-y-4">
            <Skeleton className="h-3 w-40" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
