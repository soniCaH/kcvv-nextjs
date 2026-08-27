"use client";

import { useState } from "react";

import { trackEvent } from "@/lib/analytics/track-event";
import { EmptyState } from "@/components/design-system";
import type { EventListItemVM } from "@/lib/repositories/event.repository";
import { filteredEmptyBody } from "@/lib/utils/empty-state-copy";
import { EventMonthList } from "../EventMonthList";
import { EventFilterBar, type EventFilterValue } from "../EventFilterBar";
import { DEFAULT_EVENT_TYPE } from "../event-type-style";

export interface EventsBrowserProps {
  /**
   * Merged upcoming feed — `event` docs + `articleType:event` articles, already
   * filtered upcoming-only + sorted chronologically by the repo.
   */
  events: EventListItemVM[];
  /**
   * Seeds the selected filter — for tests / Storybook state-coverage stories
   * (e.g. the filtered-to-zero state). Production always starts at `"all"`.
   */
  initialSelected?: EventFilterValue;
}

/**
 * Client shell for the `/evenementen` list (design lock 6e §2 + §4): the
 * colour-coded filter chips above the month-grouped `<TicketStub>` list, plus
 * the empty / filtered-to-zero states, both on the shared tier-"surface"
 * `<EmptyState>` (#2427 / #2562). Single-select, "Alles" default, on the
 * dark `jersey-deep-dark` page — `surface="inverse"` so the card's shadow
 * stays visible against the dark field (round 3 review, A1: the default
 * hard ink shadow is invisible on this ground).
 *
 * - No upcoming events at all → "Nog geen evenementen gepland" (events can
 *   still arrive). The filter row hides — nothing to filter, and showing it
 *   invited a dead-end loop: pick a chip against zero events, land on the
 *   filtered-to-zero copy, undo back to the same emptiness (round 3 review,
 *   C5). This restores the pre-round-2 guard; round 2's own fix (below)
 *   stays independently correct for a facet seeded while the feed is empty
 *   (e.g. a deep link), where the row IS visible on mount.
 * - A type with no upcoming events → names the active category, with the
 *   mandatory "Toon alles" undo — `reason: "filtered"` on `<EmptyState>`,
 *   which makes the undo a compile-time requirement, not a convention.
 *
 * Months whose tickets are all filtered out drop their header automatically —
 * `groupEventsByMonth` only buckets the events `<EventMonthList>` receives.
 */
export function EventsBrowser({
  events,
  initialSelected = "all",
}: EventsBrowserProps) {
  const [selected, setSelected] = useState<EventFilterValue>(initialSelected);
  const isGenuinelyEmpty = events.length === 0;

  // Dedup guard: re-pressing the active chip is a no-op, so neither state nor
  // analytics fire twice for the same selection (repo analytics policy).
  const handleSelect = (value: EventFilterValue) => {
    if (value === selected) return;
    setSelected(value);
    trackEvent("event_filter", { event_type: value });
  };

  // Keyed on whether a facet is ACTIVE, not on whether the computed list is
  // empty — round 2's fix, kept: a facet can be active (e.g. seeded via
  // `initialSelected`) while the raw feed is also empty, and the undo must
  // still describe what's active. The filter row being hidden in that
  // combination (above) makes it unreachable by click, but not by deep-link.
  // No separate `isGenuinelyEmpty` branch here: filtering `[]` already
  // yields `[]`, so the two arms below agree on an empty feed without a
  // third case restating that (round 4 review — the dead arm survived the
  // round-3 report that claimed it was already gone).
  const isFilterActive = selected !== "all";
  const filtered = isFilterActive
    ? events.filter(
        (event) => (event.eventType ?? DEFAULT_EVENT_TYPE) === selected,
      )
    : events;

  return (
    <div className="flex flex-col gap-8">
      {!isGenuinelyEmpty && (
        <EventFilterBar selected={selected} onSelect={handleSelect} />
      )}

      {filtered.length === 0 ? (
        isFilterActive ? (
          <EmptyState
            tier="surface"
            surface="inverse"
            heading={`Geen evenementen in de categorie ${selected}`}
            live
            reason="filtered"
            undo={{
              label: "Toon alles",
              onClick: () => handleSelect("all"),
            }}
            analyticsSource="evenementen"
            analyticsFacet={selected}
          >
            {filteredEmptyBody("alle evenementen")}
          </EmptyState>
        ) : (
          <EmptyState
            tier="surface"
            surface="inverse"
            heading="Nog geen evenementen gepland"
            live
          >
            Kom snel terug voor het volgende evenement.
          </EmptyState>
        )
      ) : (
        <EventMonthList events={filtered} />
      )}
    </div>
  );
}
