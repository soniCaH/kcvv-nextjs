"use client";

import { useState } from "react";

import { trackEvent } from "@/lib/analytics/track-event";
import { EmptyState } from "@/components/design-system";
import type { EventListItemVM } from "@/lib/repositories/event.repository";
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
 * dark `jersey-deep-dark` page.
 *
 * - No upcoming events at all → "Nog geen evenementen gepland" (events can
 *   still arrive). The filter row stays visible — a structural special-case
 *   that hid it here was considered and rejected (#2427 rule 5): the filter
 *   chips are the same fixed five regardless of data, so hiding them bought
 *   nothing.
 * - A type with no upcoming events → names the active category, with the
 *   mandatory "Toon alles" undo.
 *
 * Months whose tickets are all filtered out drop their header automatically —
 * `groupEventsByMonth` only buckets the events `<EventMonthList>` receives.
 */
export function EventsBrowser({
  events,
  initialSelected = "all",
}: EventsBrowserProps) {
  const [selected, setSelected] = useState<EventFilterValue>(initialSelected);

  // Dedup guard: re-pressing the active chip is a no-op, so neither state nor
  // analytics fire twice for the same selection (repo analytics policy).
  const handleSelect = (value: EventFilterValue) => {
    if (value === selected) return;
    setSelected(value);
    trackEvent("event_filter", { event_type: value });
  };

  // Keyed on whether a facet is ACTIVE, not on whether the feed is empty —
  // a visitor can select a chip against a genuinely empty feed (an off-season
  // /evenementen with zero events), and the undo must still appear: the
  // selection is theirs to reverse regardless of what "all" would also show
  // (#2562 review).
  const isFilterActive = selected !== "all";
  const filtered =
    events.length === 0
      ? []
      : isFilterActive
        ? events.filter(
            (event) => (event.eventType ?? DEFAULT_EVENT_TYPE) === selected,
          )
        : events;

  return (
    <div className="flex flex-col gap-8">
      <EventFilterBar selected={selected} onSelect={handleSelect} />

      {filtered.length === 0 ? (
        <EmptyState
          tier="surface"
          heading={
            isFilterActive
              ? `Geen evenementen in de categorie ${selected}`
              : "Nog geen evenementen gepland"
          }
          live
          actions={
            isFilterActive
              ? [
                  {
                    label: "Toon alles",
                    onClick: () => handleSelect("all"),
                    variant: "ghost",
                  },
                ]
              : undefined
          }
        >
          {isFilterActive
            ? "Probeer een andere categorie, of bekijk alle evenementen."
            : "Kom snel terug voor het volgende evenement."}
        </EmptyState>
      ) : (
        <EventMonthList events={filtered} />
      )}
    </div>
  );
}
