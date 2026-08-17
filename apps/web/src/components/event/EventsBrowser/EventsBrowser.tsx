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

  const isGenuinelyEmpty = events.length === 0;
  const filtered = isGenuinelyEmpty
    ? []
    : selected === "all"
      ? events
      : events.filter(
          (event) => (event.eventType ?? DEFAULT_EVENT_TYPE) === selected,
        );

  return (
    <div className="flex flex-col gap-8">
      <EventFilterBar selected={selected} onSelect={handleSelect} />

      {filtered.length === 0 ? (
        <EmptyState
          tier="surface"
          heading={
            isGenuinelyEmpty
              ? "Nog geen evenementen gepland"
              : `Geen evenementen in de categorie ${selected}`
          }
          live
          actions={
            isGenuinelyEmpty
              ? undefined
              : [
                  {
                    label: "Toon alles",
                    onClick: () => handleSelect("all"),
                    variant: "ghost",
                  },
                ]
          }
        >
          {isGenuinelyEmpty
            ? "Kom snel terug voor het volgende evenement."
            : "Probeer een andere categorie, of bekijk alle evenementen."}
        </EmptyState>
      ) : (
        <EventMonthList events={filtered} />
      )}
    </div>
  );
}
