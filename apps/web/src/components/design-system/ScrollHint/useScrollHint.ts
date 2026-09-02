"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const SCROLL_AMOUNT = 200;
const DEAD_ZONE = 10;

export interface UseScrollHintOptions<T extends HTMLElement = HTMLElement> {
  /**
   * How far a single arrow click scrolls. A fixed pixel amount (default
   * 200, matching the chip/table/nav rows) or a function of the track
   * element for a proportional step — `HorizontalSlider` absorbs this hook
   * with `(el) => el.clientWidth * 0.8`, the step its own former
   * `checkScroll` used (#2444 resolution: "HorizontalSlider stops rolling
   * its own checkScroll and consumes useScrollHint").
   */
  scrollAmount?: number | ((el: T) => number);
}

export interface UseScrollHintReturn<T extends HTMLElement = HTMLElement> {
  scrollRef: React.RefObject<T | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  /**
   * Whether the track overflows at all at the current width — the signal a
   * row of discrete things (chips, crumbs) uses to decide whether to hold
   * its arrow rail open, independent of which direction is currently spent
   * (#2489 resolution part 1: "a scroller holds 40px on both sides exactly
   * when its track overflows at that width, and nothing when it does not").
   */
  overflows: boolean;
  /** Pixels still scrollable to the left — 0 at the start of the track. */
  remainingLeft: number;
  /** Pixels still scrollable to the right — 0 at the end of the track. */
  remainingRight: number;
  scrollLeft: () => void;
  scrollRight: () => void;
}

export function useScrollHint<T extends HTMLElement = HTMLElement>(
  options: UseScrollHintOptions<T> = {},
): UseScrollHintReturn<T> {
  const { scrollAmount = SCROLL_AMOUNT } = options;
  const scrollRef = useRef<T | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [remainingLeft, setRemainingLeft] = useState(0);
  const [remainingRight, setRemainingRight] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const rRight = Math.max(0, scrollWidth - clientWidth - scrollLeft);
    const rLeft = Math.max(0, scrollLeft);

    setCanScrollLeft(rLeft > DEAD_ZONE);
    setCanScrollRight(rRight > DEAD_ZONE);
    setOverflows(scrollWidth - clientWidth > DEAD_ZONE);
    setRemainingLeft(rLeft);
    setRemainingRight(rRight);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    // #2448: the track's own border box never changes when its CONTENT gets
    // wider — a horizontally-constrained row's width is set by its parent,
    // so the track's own ResizeObserver entry stays silent for the two
    // things that actually change overflow: a web-font swap (first paint
    // measures with fallback metrics) and a change in item count (e.g. a
    // Sanity-driven chip row). Observe every child's box too, and re-check
    // once the real fonts are in.
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    for (const child of Array.from(el.children)) {
      observer.observe(child);
    }
    document.fonts?.ready.then(checkScroll).catch(() => {});

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const resolveAmount = useCallback(
    (el: T) =>
      typeof scrollAmount === "function" ? scrollAmount(el) : scrollAmount,
    [scrollAmount],
  );

  const scrollLeftFn = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: el.scrollLeft - resolveAmount(el),
      behavior: "smooth",
    });
  }, [resolveAmount]);

  const scrollRightFn = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      left: el.scrollLeft + resolveAmount(el),
      behavior: "smooth",
    });
  }, [resolveAmount]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    overflows,
    remainingLeft,
    remainingRight,
    scrollLeft: scrollLeftFn,
    scrollRight: scrollRightFn,
  };
}
