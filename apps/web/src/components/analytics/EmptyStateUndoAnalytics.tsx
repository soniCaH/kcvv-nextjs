"use client";

import { useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/track-event";
import { useDelegatedClick } from "@/hooks/useDelegatedClick";

export interface EmptyStateUndoAnalyticsProps {
  /**
   * Which surface's `<EmptyState>` this wraps, e.g. `"evenementen"` |
   * `"kalender"` | `"hulp_audience"` | `"hulp_category"` | `"nieuws"`.
   */
  surface: string;
  /**
   * The facet (active filter value) that emptied the surface — the same
   * value the undo clears.
   */
  facet: string;
  children: ReactNode;
}

/**
 * Client analytics shell for `<EmptyState>`'s mandatory `reason="filtered"`
 * undo (#2691). Mirrors `<ErrorAnalytics>`'s shape and mount point: a
 * host-level client wrapper delegates a click on the marker `<EmptyState>`
 * renders (`data-empty-state-undo`, set via `EmptyStateAction.analyticsAction`)
 * into `empty_state_undo` — one native listener per mount, not a `trackEvent`
 * call threaded into the primitive itself, so `<EmptyState>` stays
 * presentational and importable from a Server Component.
 *
 * `empty_state_undo` is deliberately distinct from each surface's ordinary
 * filter-reset event (`event_filter`, `kalender_filter`, …), which
 * `handleSelect` / `setType` keep firing unchanged from their own handlers —
 * this only fires when the visitor rescues an *emptied* surface via the undo
 * affordance, never on an ordinary chip press.
 */
export function EmptyStateUndoAnalytics({
  surface,
  facet,
  children,
}: EmptyStateUndoAnalyticsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useDelegatedClick(ref, {
    selector: "[data-empty-state-undo]",
    onMatch: () => {
      trackEvent("empty_state_undo", { surface, facet });
    },
  });

  return <div ref={ref}>{children}</div>;
}
