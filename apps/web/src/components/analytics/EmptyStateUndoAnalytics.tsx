"use client";

import { useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import { slugify } from "@/lib/seo/legacy-redirect";
import { useDelegatedClick } from "@/hooks/useDelegatedClick";

/**
 * Which host's `<EmptyState>` this wraps. A closed union (not `string`) so a
 * typo or a copy-paste from `<EmptyState surface>` (a *different* prop on
 * the wrapped primitive — a visual ground: `"paper" | "bare" | "inverse"`)
 * fails to compile instead of shipping a garbage dimension value. The two
 * props sit adjacent at several call sites (e.g. `CalendarWidget`'s
 * `source="kalender"` wrapping the primitive's own `surface="bare"`).
 */
export type EmptyStateUndoSource =
  "evenementen" | "kalender" | "hulp_audience" | "hulp_category" | "nieuws";

export interface EmptyStateUndoAnalyticsProps {
  /**
   * Which of the five hosts rendered the undo. Pushed to GA4 as `source`,
   * reusing the already-registered "Interaction source" dimension rather
   * than minting a new one — the taxonomy is already near GA4's 50
   * event-scoped custom-dimension cap.
   */
  source: EmptyStateUndoSource;
  /**
   * The facet (active filter value) that emptied the surface — slugified
   * before the push (`slugify`, `lib/seo/legacy-redirect.ts`) so the five
   * hosts' mixed casing lands on one value among *themselves*.
   */
  facet: string;
  children: ReactNode;
}

/**
 * Client analytics shell for `<EmptyState>`'s mandatory `reason="filtered"`
 * undo (#2691). Mirrors `<ErrorAnalytics>`'s shape and mount point: a
 * host-level client wrapper delegates a click on the marker `<EmptyState>`
 * renders (`data-empty-state-undo`, emitted unconditionally whenever
 * `reason === "filtered"`) into `empty_state_undo` — one native listener per
 * mount, not a `trackEvent` call threaded into the primitive itself, so
 * `<EmptyState>` stays presentational and importable from a Server
 * Component.
 *
 * `empty_state_undo` is deliberately distinct from each surface's ordinary
 * filter-reset event (`event_filter`, `kalender_filter`, …), which
 * `handleSelect` / `setType` keep firing unchanged from their own handlers —
 * this only fires when the visitor rescues an *emptied* surface via the undo
 * affordance, never on an ordinary chip press.
 */
export function EmptyStateUndoAnalytics({
  source,
  facet,
  children,
}: EmptyStateUndoAnalyticsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useDelegatedClick(ref, {
    selector: "[data-empty-state-undo]",
    onMatch: () => {
      trackEvent("empty_state_undo", {
        source,
        filter_type: slugify(facet),
      });
    },
  });

  return <div ref={ref}>{children}</div>;
}
