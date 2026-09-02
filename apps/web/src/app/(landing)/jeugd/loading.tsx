/**
 * `/jeugd` loading skeleton — mirrors the composition: the shared opening's
 * dark register (group photo beside the words, #2555) → seam → filosofie/visie
 * block → editorial nav grid → youth-directory division grid.
 *
 * The opening's kicker/headline/lead and its image are all fixed —
 * `/images/youth-trainers.jpg`, a bundled asset, not CMS data — so per
 * #2432 §2 this reuses the real `<PageHero>` unshimmered.
 */

import {
  PageContainer,
  StripedSeam,
  Skeleton,
  LoadingAnnouncement,
  TapedCardGrid,
} from "@/components/design-system";
import { PageHero } from "@/components/layout/PageHero";
import { YOUTH_PHOTO, JEUGD_KICKER, JEUGD_HEADLINE, JEUGD_LEAD } from "./page";

export default function JeugdLoading() {
  return (
    <>
      {/* The real dark-band header must stay `firstElementChild` — the
          envelope-drift guard pins the root className, and `<PageHero>`'s
          `bg-jersey-deep-dark` header IS that root here (no wrapping div). */}
      <PageHero
        register="band"
        tone="dark"
        width="index"
        kicker={JEUGD_KICKER}
        headline={JEUGD_HEADLINE}
        lead={JEUGD_LEAD}
        image={YOUTH_PHOTO}
      />

      <LoadingAnnouncement label="Jeugdwerking laden…" />

      <StripedSeam colorPair="ink-cream" height="md" />

      <PageContainer width="index" className="py-12 sm:py-16">
        {/* Filosofie / visie block */}
        <div>
          <Skeleton className="mb-4 h-3 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Editorial nav grid — the real <TapedCardGrid columns={3} gap="sm">
            (JeugdEditorialGrid.tsx), so each slot's --taped-card-rotation
            lands before the swap. Without it the rotation snaps in on
            arrival: 12 skeleton cards sit flat, then EditorialHubCard reads
            the grid's per-slot CSS var and tilts −1°…−6°. */}
        <div className="mt-16">
          <TapedCardGrid columns={3} gap="sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[16/9]" />
            ))}
          </TapedCardGrid>
        </div>

        {/* Youth directory */}
        <div className="mt-16 space-y-8">
          <Skeleton className="h-8 w-44" />
          {Array.from({ length: 3 }).map((_, div) => (
            <div key={div} className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* CTA band (full-bleed) */}
      <div className="bg-jersey-deep-dark border-ink border-y-2">
        <div className="mx-auto flex max-w-[var(--container-index)] flex-col items-center gap-4 px-4 py-12 sm:py-16 md:px-8">
          <Skeleton tone="dark" className="h-8 w-72 max-w-full" />
          <Skeleton tone="dark" className="h-4 w-96 max-w-full" />
          <Skeleton tone="dark" className="h-11 w-40" />
        </div>
      </div>
    </>
  );
}
