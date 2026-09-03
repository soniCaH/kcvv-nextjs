/**
 * Team Matches Page — Loading Skeleton.
 *
 * Mirrors `WedstrijdenPage` (`/ploegen/[slug]/wedstrijden`):
 *   editorial header (mono team kicker + "Wedstrijden." display heading)
 *     → month-band sections (display-big month heading + `<TeamAgendaRow>`
 *       agenda rows)
 *
 * The kicker names the team — data — even though "Wedstrijden." itself is
 * fixed, so per #2432 §2 this renders no heading text at all rather than
 * mixing a real headline with a data-driven kicker.
 *
 * Default width (1040). Canonical paper-register chrome — `border-2
 * border-ink`, square corners, `cream`/`paper-edge` fills, pulse bars.
 */

import {
  PageContainer,
  Skeleton,
  LoadingAnnouncement,
} from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";

export default function WedstrijdenLoading() {
  return (
    <div className="min-h-screen">
      <LoadingAnnouncement label="Wedstrijden laden…" />

      <PageContainer className="py-12 sm:py-16">
        {/* No kicker (the real hero has none — the up-link carries the team
            name instead, #2442 rule 6) and a shimmer stand-in for the
            up-link itself: unlike every other route's up-link label, this
            one *is* data (the team display name), so it cannot render real
            before the fetch resolves (review round 2, #2570). */}
        <PageHeroSkeleton register="minimal" kicker={false} upLinkShimmer />

        {/* Month bands — display-big heading + agenda rows. */}
        <div className="flex flex-col gap-10">
          {Array.from({ length: 2 }).map((_, m) => (
            <section key={m}>
              <Skeleton className="mb-4 h-12 w-48" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-ink bg-cream shadow-paper-sm flex items-center gap-4 border-2 px-4 py-3"
                  >
                    <Skeleton className="h-4 w-16 shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-10 shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
