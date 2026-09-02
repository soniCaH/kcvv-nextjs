"use client";

import type { ReactNode } from "react";
import { useScrollHint } from "@/components/design-system/ScrollHint/useScrollHint";
import { ScrollArrowButton } from "@/components/design-system/ScrollHint/ScrollArrowButton";

/** Same cap as `<HtmlTableBlock>` — see its docblock (#2444, as amended by
 *  #2476: "the 24px fade becomes a cap, not a width"). */
const MAX_FADE_PX = 24;

export interface StandingsTableScrollerProps {
  ariaLabel: string;
  children: ReactNode;
}

/**
 * Client-only scroll chrome for `<StandingsTable>`'s numbered variant,
 * split out from the table markup itself (a Server Component) because
 * `RankingEntry` is an Effect `Schema.Class` instance — not a plain object
 * — and Next.js refuses to serialize a class instance across the
 * server→client boundary as a prop ("Only plain objects... can be passed
 * to Client Components from Server Components"). Composing the
 * already-rendered `<table>` as `children` sidesteps that entirely:
 * children cross the boundary as a resolved React element tree, never as
 * the underlying `RankingEntry[]` the table was built from.
 *
 * Control register, overlaid, no reserved rail (#2444, as amended by
 * #2476) — same as `<HtmlTableBlock>`: a table is content scrolled past,
 * not a row of tap targets, so the arrow mounts only on real overflow and
 * never holds a gutter. Right edge only, matching `<HtmlTableBlock>` —
 * `<StandingsTable>` has no sticky first column (that, and the fade's
 * declared anchors, are #2476's own separate ticket), so there is nothing
 * for a left arrow to un-hide yet.
 */
export function StandingsTableScroller({
  ariaLabel,
  children,
}: StandingsTableScrollerProps) {
  const { scrollRef, canScrollRight, remainingRight, scrollRight } =
    useScrollHint<HTMLDivElement>();

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="focus:outline-jersey-deep w-full overflow-x-auto focus:outline-2 focus:outline-offset-2"
      >
        {children}
      </div>
      {canScrollRight && (
        <>
          <div
            aria-hidden="true"
            className="from-cream pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l to-transparent"
            style={{ width: Math.min(MAX_FADE_PX, remainingRight) }}
          />
          <ScrollArrowButton
            direction="right"
            register="control"
            onClick={scrollRight}
          />
        </>
      )}
    </div>
  );
}
