"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import { slugify } from "@/lib/utils/slugify";
import { useDelegatedClick } from "@/hooks/useDelegatedClick";

/**
 * Single, always-mounted click listener for every filtered `<EmptyState>`'s
 * undo, site-wide (#2719). Mounted once near the root layout (`app/layout.tsx`,
 * alongside `<ScrollToTop>` / `<GoogleTagManagerLoader>`) rather than per
 * page — `apps/web/src/app/layout.tsx` wraps every route in this app (both
 * the `(main)` and `(landing)` route groups share it), so one mount here
 * already covers all five current filtered surfaces, and any future sixth
 * one for free.
 *
 * Before #2719, each of the five hosts mounted its own
 * `<EmptyStateUndoAnalytics source={…} facet={…}>` wrapper around its
 * `<EmptyState reason="filtered">` — a convention a regex-on-source test
 * (`cross-page-consistency.test.ts` rule 6) had to police, because nothing
 * stopped a sixth host from skipping the wrapper. Now `analyticsSource` /
 * `analyticsFacet` are *required* props on `EmptyStateSurfaceFilteredProps`
 * (`EmptyState.tsx`), rendered as inert `data-empty-state-undo-source` /
 * `data-empty-state-undo-facet` attributes alongside the pre-existing
 * `data-empty-state-undo="undo"` marker — so this one listener, reading
 * those attributes off whatever marked element was clicked, replaces all
 * five mount points. A missing wire-up is now a type error at the call
 * site, not a runtime gap only a test catches.
 *
 * Delegates off `document.body` — the delegation convention this repo
 * already uses everywhere else (`useDelegatedClick` + a ref to a container)
 * needs no *new* wrapper `<div>` here, because `document.body` (rendered by
 * the root layout's own `<body>`) already is one. `document` only exists on
 * the client, so the ref starts `null` and is set in its own effect, which
 * — by React's per-component effect ordering — always commits before
 * `useDelegatedClick`'s subscribing effect below it reads `ref.current`.
 *
 * `filter_type`'s slugify behaviour is unchanged from #2691's
 * `EmptyStateUndoAnalytics`: the facet arrives in the host's own display
 * casing (a `data-*` attribute is just a string) and is slugified here,
 * at push time — not part of this issue's scope (see #2719 part (a) for the
 * still-open question of a *shared* normalizer across all `filter_type`
 * emitters).
 */
export function EmptyStateUndoTracker() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ref.current = document.body;
  }, []);

  useDelegatedClick(ref, {
    selector: "[data-empty-state-undo]",
    onMatch: (el) => {
      const source = el.dataset.emptyStateUndoSource;
      const facet = el.dataset.emptyStateUndoFacet;
      if (!source || !facet) return;

      trackEvent("empty_state_undo", {
        source,
        filter_type: slugify(facet),
      });
    },
  });

  return null;
}
