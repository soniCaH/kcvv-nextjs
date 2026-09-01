"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track-event";
import {
  EmptyState,
  FilterTabs,
  type FilterTab,
} from "@/components/design-system";
import type { EventListItemVM } from "@/lib/repositories/event.repository";
import { filteredEmptyBody } from "@/lib/utils/empty-state-copy";
import { EventMonthList } from "../EventMonthList";
import {
  DEFAULT_EVENT_TYPE,
  EVENT_TYPE_FILL,
  type EventType,
} from "../event-type-style";

/** Filter selection: a specific event type, or `"all"` (the default — no filter). */
export type EventFilterValue = EventType | "all";

/** Every valid filter value — the single source of truth for validating a
 *  `?type=` URL param (an unknown value falls back to `"all"`). */
const EVENT_FILTER_VALUES: readonly EventFilterValue[] = [
  "all",
  "Clubevent",
  "Supportersactiviteit",
  "Jeugdwerking",
  "Andere",
];

/** Type guard: is `value` a renderable filter facet? Narrows a raw URL param. */
function isEventFilterValue(value: string | null): value is EventFilterValue {
  return (
    value !== null && (EVENT_FILTER_VALUES as readonly string[]).includes(value)
  );
}

/**
 * The `/evenementen` by-type filter row (design lock 6e §2, absorbed into
 * `<FilterTabs>` by #2429/#2564 — replaces the deleted bespoke
 * `EventFilterBar`). Colour is a prop (`FilterTab.color`), sourced from the
 * shared `EVENT_TYPE_FILL` map — the same colours `<TicketStub>`'s tear-off
 * date block uses — so the row stays a faithful legend for the tickets it
 * labels. `Alles` and `Andere` carry no colour and render the neutral
 * Direction D chip. `shadow="soft"` (passed at the call site) is this row's
 * concession to the dark `jersey-deep-dark` field.
 */
const EVENTS_FILTER_TABS: FilterTab[] = [
  { value: "all", label: "Alles" },
  {
    value: "Clubevent",
    label: "Clubevent",
    color: { border: "border-jersey-deep", fill: EVENT_TYPE_FILL.Clubevent },
  },
  {
    value: "Supportersactiviteit",
    label: "Supportersactiviteit",
    color: {
      border: "border-warm",
      fill: EVENT_TYPE_FILL.Supportersactiviteit,
    },
  },
  {
    value: "Jeugdwerking",
    label: "Jeugdwerking",
    color: {
      border: "border-jersey-bright",
      fill: EVENT_TYPE_FILL.Jeugdwerking,
    },
  },
  { value: "Andere", label: "Andere" },
];

export interface EventsBrowserProps {
  /**
   * Merged upcoming feed — `event` docs + `articleType:event` articles, already
   * filtered upcoming-only + sorted chronologically by the repo.
   */
  events: EventListItemVM[];
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
 * The active facet is always in `?type=` (#2429 resolution rule 5 / #2564)
 * — `router.push`, so browser back undoes a filter, replacing the local
 * `useState` this component used to carry.
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
export function EventsBrowser({ events }: EventsBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const selected: EventFilterValue = isEventFilterValue(rawType)
    ? rawType
    : "all";
  const isGenuinelyEmpty = events.length === 0;

  // Dedup guard: re-pressing the active chip is a no-op, so neither the URL
  // push nor analytics fire twice for the same selection (repo analytics
  // policy).
  const handleSelect = (value: EventFilterValue) => {
    if (value === selected) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/evenementen${params.size ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
    trackEvent("event_filter", { event_type: value });
  };

  // Keyed on whether a facet is ACTIVE, not on whether the computed list is
  // empty — round 2's fix, kept: a facet can be active (e.g. seeded via a
  // deep-linked `?type=`) while the raw feed is also empty, and the undo must
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
        <FilterTabs
          tabs={EVENTS_FILTER_TABS}
          activeTab={selected}
          onChange={(value) => handleSelect(value as EventFilterValue)}
          showCounts={false}
          shadow="soft"
          ariaLabel="Filter evenementen op type"
        />
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
              analyticsSource: "evenementen",
              analyticsFacet: selected,
            }}
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
