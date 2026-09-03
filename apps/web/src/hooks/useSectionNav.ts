"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useHashLandingCorrection } from "./useHashLandingCorrection";

/** Fallback for `--sticky-header-h` under vitest/happy-dom, where no
 *  stylesheet is loaded. The token itself (`globals.css`) is the real
 *  source of truth — `<SiteHeader>` derives its own height from it. */
const FALLBACK_HEADER_HEIGHT_PX = 65;

/** Reads `--sticky-header-h` off the DOM so a consumer with its own offset
 *  need shares one source instead of hand-copying a number. */
export function getStickyHeaderHeight(): number {
  if (typeof window === "undefined") return FALLBACK_HEADER_HEIGHT_PX;
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--sticky-header-h")
    .trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : FALLBACK_HEADER_HEIGHT_PX;
}

export interface UseSectionNavResult {
  /** Attach to the sticky bar's own outer element (its `<nav>`). Call this
   *  hook only from a component that renders the bar unconditionally
   *  whenever it is mounted at all — a caller that sometimes returns
   *  `null` (e.g. a nav that hides at ≤1 section) should hoist that branch
   *  *above* the hook, not render it after calling the hook, so the hook's
   *  own lifetime always matches the bar's. */
  navRef: RefObject<HTMLElement | null>;
  /** The bar's own current rendered height in px, 0 before first
   *  measurement. */
  barHeight: number;
  /** `getStickyHeaderHeight() + barHeight` — the header-plus-bar offset a
   *  consumer with its own unrelated need (e.g. a hero-reveal observer)
   *  wants too, computed once here instead of independently at each call
   *  site. */
  topInset: number;
  /** The section currently being read, scroll-spy driven — the fill always
   *  means "the section I am reading now", never "the one I last jumped
   *  to" (#2478 rule 3). `null` before the first observer callback fires,
   *  or when `ids` is empty. */
  activeId: string | null;
}

/**
 * The one shared hook behind every sticky in-page section nav (#2478
 * rules 3 and 7): scroll-spy active state, plus `scroll-padding-top`
 * derived from the header token plus the bar's own measured height — never
 * a hand-written `scroll-mt-*` per section.
 *
 * The scroll-spy's `IntersectionObserver` rebuilds whenever the bar
 * resizes (`topInset` in its dependency array), so it never reports a
 * section "active" while its top is still covered by a since-grown bar.
 * `useHashLandingCorrection` is notified of the same resize, in case a
 * hash navigation is still "armed" against the bar's old, shorter height.
 */
export function useSectionNav(ids: readonly string[]): UseSectionNavResult {
  const navRef = useRef<HTMLElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join("|");

  const { notifyLayoutChange } = useHashLandingCorrection(ids);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const measure = () => setBarHeight(el.getBoundingClientRect().height);
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    document.documentElement.style.scrollPaddingTop = `calc(var(--sticky-header-h) + ${barHeight}px)`;
    // Runs after the write above, on purpose: a hash navigation "armed"
    // while the bar was shorter needs the freshly-published offset to
    // correct against.
    notifyLayoutChange();
    return () => {
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, [barHeight, notifyLayoutChange]);

  const topInset = useMemo(
    () => getStickyHeaderHeight() + barHeight,
    [barHeight],
  );

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = idsKey
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Top inset clears the header + this bar; the bottom inset flips
    // "active" near the top third of the viewport, not the very bottom.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActiveId(topmost.target.id);
      },
      { rootMargin: `-${topInset}px 0px -55% 0px`, threshold: [0, 0.25, 0.6] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey, topInset]);

  return { navRef, barHeight, topInset, activeId };
}
