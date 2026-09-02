/**
 * Photo Gallery Listing Page — Loading Skeleton.
 *
 * Mirrors `/galerij` (`page.tsx` + `GalleryListingClient`): the shared
 * opening's quiet register, then a `<TapedCardGrid columns={3} gap="md">` of
 * `<GalleryCard>`s — a thin `<NewsCard>` adapter, same shell as `/nieuws`.
 * The opening and the listing are one padded section, not two stacked
 * (#2479 rule 3).
 *
 * The opening's kicker/headline are fixed copy, not data, so per #2432 §2
 * this reuses the real `<PageHero>` unshimmered.
 */

import {
  PageContainer,
  TapedCardGrid,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";
import { PageHero } from "@/components/layout/PageHero";

/** A flush-image card footprint — image atop a border-2 ink body, matching
 *  `<GalleryCard>` (a `<NewsCard>` adapter). */
function GalleryCardSkeleton() {
  return (
    <div className="border-ink bg-cream-soft shadow-paper-sm overflow-hidden border-2">
      <div className="border-ink aspect-[3/2] border-b-2">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function GalerijLoading() {
  return (
    <div className="bg-cream flex min-h-screen flex-col">
      <LoadingAnnouncement label="Fotogalerij laden…" />

      <PageContainer as="main" width="index" className="flex-1 py-12 sm:py-16">
        <PageHero
          register="minimal"
          kicker="KCVV Elewijt · Beelden"
          headline="Fotogalerij"
        />

        <TapedCardGrid columns={3} gap="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <GalleryCardSkeleton key={i} />
          ))}
        </TapedCardGrid>
      </PageContainer>
    </div>
  );
}
