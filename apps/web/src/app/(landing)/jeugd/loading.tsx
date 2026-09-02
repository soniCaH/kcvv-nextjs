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
} from "@/components/design-system";
import { PageHero } from "@/components/layout/PageHero";

const YOUTH_PHOTO = "/images/youth-trainers.jpg";

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
        kicker="De jeugdopleiding · U6 tot U21"
        headline="Beter worden begint met plezier"
        lead="Een doordachte opleiding van Onderbouw tot Bovenbouw, met gediplomeerde trainers en plezier als motor. Want wie graag speelt, groeit vanzelf — op en naast het veld."
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

        {/* Editorial nav grid */}
        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/9]" />
          ))}
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
