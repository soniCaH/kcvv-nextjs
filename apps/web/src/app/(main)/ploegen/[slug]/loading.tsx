/**
 * Team Detail Page — Loading Skeleton.
 *
 * Mirrors the Phase 6.C single-scroll composition of `ploegen/[slug]/page.tsx`:
 *   <TeamHero>               ← wide (1040) hero: words + taped team figure
 *     → <TeamSectionNav>      ← sticky border-b-2 ink chip bar (#2478 TEAM-1)
 *     → <StripedSeam>
 *     → <SquadGrid>           ← position-grouped squad (auto-fill minmax(140px,
 *       1fr), border-2 ink cards)
 *
 * `<TeamHero>`'s headline is the team's own name — data, not fixed copy — so
 * per #2432 §2 this renders no heading text at all, bars only.
 *
 * Conservative: most non-hero sections (standings, matches, staff, editorial)
 * auto-hide on empty data, so the skeleton only previews the always-present
 * hero + nav + a representative squad block. `min-h-screen` root preserved per
 * the envelope-drift guard.
 *
 * **Squad heading mirrored (#2637 review round 1).** The real `#spelers`
 * section now renders a `<SectionHeader size="display-md">` (`mb-10`) above
 * `<SquadGrid>` — this skeleton's squad preview mirrors that exact box
 * (height + margin) so the grid doesn't jump down when the skeleton is
 * replaced. The other four new `<h2>`s this ticket added (`#klassement`,
 * `#wedstrijden`, `#staf`, `#info`) are deliberately NOT previewed here —
 * unchanged from before #2637, this skeleton was already conservative about
 * every section but squad, and giving those four sections their own
 * skeleton rows (not just a heading placeholder, the whole section) is the
 * loading-skeleton ticket's job, sequenced after this one per #2637's own
 * "Not in scope" list.
 */

import { cn } from "@/lib/utils/cn";
import {
  PageContainer,
  StripedSeam,
  Skeleton,
  LoadingAnnouncement,
  UpLink,
  SECTION_NAV_CHIP_BASE_CLASSES,
  SECTION_NAV_CHIP_SHADOW_CLASS,
} from "@/components/design-system";

export default function TeamDetailLoading() {
  return (
    <div className="min-h-screen">
      <LoadingAnnouncement label="Ploeg laden…" />

      {/* Real, unshimmered — its label is fixed copy, not data (review
          round 2, #2570). Same container width as the section below
          (default = container-wide), no invented padding of its own. */}
      <PageContainer>
        <UpLink href="/ploegen" label="Ploegen" className="mb-6" />
      </PageContainer>

      {/* TeamHero — wide (1040): words column + taped team figure. */}
      <section
        aria-hidden="true"
        className="mx-auto grid w-full max-w-[var(--container-wide)] grid-cols-1 items-start gap-x-10 gap-y-8 px-4 py-8 sm:grid-cols-[1fr_minmax(300px,420px)] sm:py-12 md:px-8"
      >
        <div className="order-last flex flex-col gap-4 sm:order-first">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <div className="border-ink bg-cream-soft shadow-paper-md order-first aspect-[3/2] w-full border-2 sm:order-last" />
      </section>

      {/* TeamSectionNav — sticky border-b-2 ink chip bar (#2478 TEAM-1: no
          top border, the StripedSeam above already divides it from the
          hero). Chips, not bare bars — the real bar's items are the light
          chip (rule 1). */}
      <div aria-hidden="true" className="border-ink bg-cream-deep border-b-2">
        <PageContainer className="flex items-center gap-2 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                SECTION_NAV_CHIP_BASE_CLASSES,
                SECTION_NAV_CHIP_SHADOW_CLASS,
              )}
            >
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </PageContainer>
      </div>

      <StripedSeam colorPair="ink-cream" height="md" />

      {/* SquadGrid — position-grouped: auto-fill minmax(140px,1fr) ink cards.
          `<SectionHeader size="display-md">`'s own box (display-md line
          height + `mb-10`) mirrored first, so the grid doesn't shift down
          when the real heading replaces this bar (#2637 review round 1). */}
      <PageContainer as="section" className="py-10">
        <Skeleton className="mb-10 h-8 w-32" />
        <div className="flex flex-col gap-8">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group}>
              <div className="border-paper-edge mb-3 border-b pb-1.5">
                <Skeleton className="h-3 w-28" />
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
                {Array.from({ length: group === 0 ? 4 : 6 }).map((_, i) => (
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
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
