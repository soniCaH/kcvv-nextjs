/**
 * Events List Page — Loading Skeleton.
 *
 * Mirrors `EvenementenPage` (`/evenementen`):
 *   the shared opening's quiet register on the dark field (mono kicker +
 *   display headline), sharing one padded section with
 *     → <EventsBrowserSkeleton>: single-line filter chip row (matching
 *       <FilterTabs>, #2564) above a single-column, month-grouped
 *       `<TicketStub>` list (each month: display heading + ticket rows)
 *
 * Index width (1280) on the dark field. Placeholder bars use translucent cream
 * fills (on-dark equivalent of `paper-edge`); chips/tickets keep square corners
 * and ink/cream borders. The filter-row + ticket-list skeleton is shared with
 * the local `<Suspense>` fallback in `page.tsx` — see `EventsBrowserSkeleton`.
 */

import { PageContainer } from "@/components/design-system";
import { PageHeroSkeleton } from "@/components/layout/PageHero";
import { EventsBrowserSkeleton } from "@/components/event/EventsBrowser";

export default function EvenementenLoading() {
  return (
    <div className="bg-jersey-deep-dark flex min-h-screen flex-col">
      <span
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="sr-only"
      >
        Evenementen laden...
      </span>

      {/* The opening and the listing are one padded section, as on the page. */}
      <PageContainer width="index" className="flex-1 py-12 sm:py-16">
        <PageHeroSkeleton register="minimal" tone="dark" />

        <EventsBrowserSkeleton />
      </PageContainer>
    </div>
  );
}
