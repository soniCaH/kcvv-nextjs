"use client";

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useScrollHint } from "./useScrollHint";
import { ScrollArrowButton } from "./ScrollArrowButton";

const MAX_FADE_PX = 24;

export interface ScrollOverlayProps {
  /** Element type for the scrollable track itself. Defaults to `"div"`. */
  as?: ElementType;
  /** The track's content — a plain `ReactNode`, never a render-prop
   *  function. `<ScrollOverlay>` owns the scroll track itself (rather than
   *  handing a ref back to the caller to attach) specifically so a Server
   *  Component can use it: a function prop cannot cross the server→client
   *  boundary any more than a class instance can, but a pre-rendered
   *  element tree can (review finding #2577 part 4). */
  children?: ReactNode;
  /** Alternative to `children`, mirroring the native element API — for
   *  pre-sanitized raw HTML (`HtmlTableBlock`). Passing both is invalid,
   *  same contract as `dangerouslySetInnerHTML` itself. */
  dangerouslySetInnerHTML?: { __html: string };
  /** Classes for the track, in ADDITION to the overflow classes
   *  `<ScrollOverlay>` applies itself (see `overflowClassName`). */
  trackClassName?: string;
  /** Extra track classes applied whenever the track overflows at this
   *  width at all. Unlike a hypothetical `canScrollRight`-gated variant,
   *  this does not flip off near the end of a scroll session
   *  (`canScrollRight` goes false in the track's last few pixels) — the
   *  property under test is "does this track overflow", not "is there
   *  more to scroll right now". For a pinned column group that must hold
   *  for the *whole* scroll, not just while there is still more to reveal
   *  — `<StandingsTable>`'s leading/trailing anchor columns (#2476 rule
   *  3). Reuses `useScrollHint`'s `overflows` (#2489), the same static
   *  "does this track overflow at all" signal a chip row's rail
   *  reservation already keys off.
   *
   *  `<HtmlTableBlock>` used to have a `scrollableRightClassName` sibling
   *  prop here for its sticky-first-column treatment, gated on
   *  `canScrollRight` instead — removed with that treatment (#2582: an
   *  authored table anchors nothing). Add it back only if a future
   *  consumer genuinely needs the "only while there's still more to the
   *  right" gating this prop deliberately does not have. */
  overflowsClassName?: string;
  /** Overrides the default `overflow-x-auto` — e.g. `"overflow-auto"` for
   *  a scroller that also scrolls vertically (the organigram explorer's
   *  stage). */
  overflowClassName?: string;
  ariaLabel?: string;
  role?: string;
  /** `"right"` (default) — the common case: a sticky first column (or
   *  nothing yet) already anchors the left edge, so only the right edge
   *  needs a cue. `"both"` — a diagram with no such anchor, e.g.
   *  `<VolledigOrganigram>`'s chart or the organigram explorer's stage. */
  direction?: "right" | "both";
  /** Extra classes applied to both the arrow buttons AND the fades — e.g.
   *  `"vo-no-print"` so the organigram chart's arrows don't appear in the
   *  exported PDF (review finding #2577 part 7). */
  chromeClassName?: string;
  /** The fade's gradient start colour — must match the track's own
   *  background. Defaults to `"from-cream"`; the organigram explorer's
   *  stage (an ink panel) overrides to `"from-jersey-deep-dark"`. */
  fadeFromClassName?: string;
  /** Extra dependencies that force a re-check beyond the hook's built-in
   *  triggers — see `useScrollHint`'s `remeasureOn`. Needed by the
   *  organigram explorer's stage, whose zoom control is a CSS
   *  `transform: scale()` no `ResizeObserver` entry fires for. */
  remeasureOn?: React.DependencyList;
  /** Classes for the outer `relative` wrapper. */
  className?: string;
}

/**
 * The "overlay" idiom — one of the two `<ScrollArrowButton register="control">`
 * consumption patterns (#2444, as amended by #2476/#2478/#2489; the other is
 * `<ScrollRail>`). Content scrolled *past* rather than a row of tap
 * targets — a table, a diagram — so it never reserves a gutter: the arrow
 * simply overlays the edge, mounted per direction exactly when
 * `useScrollHint`'s `canScrollLeft`/`canScrollRight` is true, with a fade
 * capped at `min(24px, remaining)` (#2476 amendment: a fixed-width fade
 * over a narrow overflow veils more than is actually cut).
 *
 * `register` is not a prop here for the same reason `<ScrollRail>` doesn't
 * expose it — every arrow this component renders is `"control"`.
 *
 * Consumers: `<HtmlTableBlock>`, `<StandingsTable>`'s numbered variant,
 * `<VolledigOrganigram>`'s chart, the organigram explorer's stage.
 */
export function ScrollOverlay({
  as: Tag = "div",
  children,
  dangerouslySetInnerHTML,
  trackClassName,
  overflowsClassName,
  overflowClassName = "overflow-x-auto",
  ariaLabel,
  role,
  direction = "right",
  chromeClassName,
  fadeFromClassName = "from-cream",
  remeasureOn,
  className,
}: ScrollOverlayProps) {
  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    overflows,
    remainingLeft,
    remainingRight,
    scrollLeft,
    scrollRight,
  } = useScrollHint<HTMLElement>({ remeasureOn });

  const showLeft = direction === "both" && canScrollLeft;

  const trackProps = dangerouslySetInnerHTML
    ? { dangerouslySetInnerHTML }
    : { children };

  return (
    <div className={cn("relative", className)}>
      <Tag
        ref={scrollRef}
        role={role}
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          overflowClassName,
          trackClassName,
          overflows && overflowsClassName,
        )}
        {...trackProps}
      />

      {showLeft && (
        <>
          <div
            aria-hidden="true"
            style={{ width: Math.min(MAX_FADE_PX, remainingLeft) }}
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r to-transparent",
              fadeFromClassName,
              chromeClassName,
            )}
          />
          <ScrollArrowButton
            direction="left"
            register="control"
            onClick={scrollLeft}
            className={chromeClassName}
          />
        </>
      )}
      {canScrollRight && (
        <>
          <div
            aria-hidden="true"
            style={{ width: Math.min(MAX_FADE_PX, remainingRight) }}
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-l to-transparent",
              fadeFromClassName,
              chromeClassName,
            )}
          />
          <ScrollArrowButton
            direction="right"
            register="control"
            onClick={scrollRight}
            className={chromeClassName}
          />
        </>
      )}
    </div>
  );
}
