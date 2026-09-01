"use client";

import { useEffect, useState } from "react";
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
  EVENT_TYPE_TABS,
  EVENT_TYPE_ORDER,
  type EventType,
} from "../event-type-style";

/** Filter selection: a specific event type, or `"all"` (the default — no
 *  filter). Module-local — nothing outside this file consumes it. */
type EventFilterValue = EventType | "all";

/** Every valid `?type=` value, in render order — the single source of truth
 *  for validating the URL param (an unknown value falls back to "all").
 *  Derived from the shared `EVENT_TYPE_ORDER` (`event-type-style.ts`), so a
 *  new event type can't be added to the row and forgotten here. */
const EVENT_FILTER_VALUES: readonly EventFilterValue[] = [
  "all",
  ...EVENT_TYPE_ORDER,
];

function isEventFilterValue(value: string | null): value is EventFilterValue {
  return (
    value !== null && (EVENT_FILTER_VALUES as readonly string[]).includes(value)
  );
}

/**
 * The `/evenementen` by-type filter row (design lock 6e §2, absorbed into
 * `<FilterTabs>` by #2429/#2564 — replaces the deleted bespoke
 * `EventFilterBar`). `EVENT_TYPE_TABS` + `EVENT_TYPE_ORDER` are the shared
 * source (`event-type-style.ts`, #2564 review item 1) also consumed by
 * `/kalender`'s `CalendarWidget` — one definition of each event type's
 * colour, not two kept in sync by hand. `Alles` carries no colour and
 * renders the neutral Direction D chip. `surface="inverse"` (passed at the
 * call site) is this row's concession to the dark `jersey-deep-dark` field.
 */
const EVENTS_FILTER_TABS: FilterTab[] = [
  { value: "all", label: "Alles" },
  ...EVENT_TYPE_ORDER.map((type) => EVENT_TYPE_TABS[type]),
];

const TYPE_PARAM = "type";

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
 * The active facet is local `useState`, mirrored into `?type=` via
 * `window.history.pushState` — deliberately NOT `useSearchParams` /
 * `router.push` (#2564 review item 2). This component used to read the URL
 * with `useSearchParams`, which on this static/ISR route forced Next to
 * bail the WHOLE subtree to client-side rendering: the server-rendered HTML
 * shipped only a loading skeleton, thrown away at hydration, and every
 * visitor re-rendered the full month-grouped ticket list client-side from
 * data already sitting in the RSC payload. `pushState` (the same pattern
 * `NewsListingClient.tsx` uses) keeps the AC — filter state is in the URL,
 * browser back undoes a filter — while the page stays fully prerendered. A
 * mount effect seeds a deep-linked `?type=`, which costs one extra render
 * only for a visitor who arrives on one, instead of de-prerendering the
 * page for everyone; a `popstate` listener keeps the row in sync with
 * browser back/forward. Passing the current `window.history.state` (not
 * `{}`) to `pushState` keeps Next's internal `__NA` marker so its patched
 * push/replaceState treats this as an internal write, not a fresh
 * navigation to re-process — same precedent as
 * `lib/utils/same-page-anchor.ts`.
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
  const [selected, setSelected] = useState<EventFilterValue>("all");
  const isGenuinelyEmpty = events.length === 0;

  // Deep-link restore on first mount: a one-time read of the URL (an
  // external system) — reads `window.location` directly rather than
  // `useSearchParams` so this component stays server-renderable (see the
  // docblock above). The synchronous seed here mirrors
  // `HubMemberPanel`'s own `?member=` deep-link restore.
  useEffect(() => {
    const urlType = new URLSearchParams(window.location.search).get(TYPE_PARAM);
    if (isEventFilterValue(urlType) && urlType !== "all") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL deep-link seed, not a sync loop
      setSelected(urlType);
    }
    // Run once on mount — the initial URL is the only deep-link source.
  }, []);

  // Browser back/forward — re-reads `?type=` and updates state WITHOUT
  // writing the URL again (the browser already moved it).
  useEffect(() => {
    const onPopState = () => {
      const urlType = new URLSearchParams(window.location.search).get(
        TYPE_PARAM,
      );
      setSelected(isEventFilterValue(urlType) ? urlType : "all");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Dedup guard: re-pressing the active chip is a no-op, so neither the URL
  // push nor analytics fire twice for the same selection (repo analytics
  // policy).
  const handleSelect = (value: EventFilterValue) => {
    if (value === selected) return;
    setSelected(value);
    const params = new URLSearchParams(window.location.search);
    if (value === "all") {
      params.delete(TYPE_PARAM);
    } else {
      params.set(TYPE_PARAM, value);
    }
    const qs = params.toString();
    window.history.pushState(
      window.history.state,
      "",
      `/evenementen${qs ? `?${qs}` : ""}`,
    );
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
          surface="inverse"
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
