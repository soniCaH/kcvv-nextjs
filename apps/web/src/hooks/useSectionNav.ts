"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHashLandingCorrection } from "./useHashLandingCorrection";

/**
 * Fallback for the `--sticky-header-h` token (`globals.css`) when it can't be
 * read off the DOM — no stylesheet is loaded under vitest/happy-dom. Exists
 * only so a caller degrades safely outside a real browser; it is not a
 * second source of truth for the header height in production, where
 * `scroll-padding-top` itself is set via the CSS `calc()` expression below
 * and never touches this constant.
 */
const FALLBACK_HEADER_HEIGHT_PX = 65;

/**
 * Reads the header's sticky height off the single CSS token
 * (`--sticky-header-h`) rather than a hand-copied number — exported so a
 * consumer with its own, unrelated offset need (e.g.
 * `<OrganigramSectionNav>`'s hero-reveal observer, #2584 review finding 7)
 * reads the same source instead of hand-copying "65".
 */
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
  /** Ref-callback for the sticky bar's own outer element (its `<nav>`).
   *  A callback rather than a plain `useRef` object so the hook's effects
   *  re-run whenever the underlying DOM node itself changes — including
   *  from one element to another, which a `RefObject` read once inside a
   *  `[]`-effect would miss (#2584 review finding 3: a team page's nav can
   *  unmount entirely at ≤1 section and remount for a different team via
   *  client-side nav, without the *component* itself ever unmounting). */
  navRef: (node: HTMLElement | null) => void;
  /** The bar's own current rendered height in px, 0 before first measurement
   *  or while unmounted. Exposed so a consumer with its own offset need
   *  derived from the same bar (rule 7) never hand-copies a second number
   *  (#2584 review finding 7). */
  barHeight: number;
  /** The section currently being read, scroll-spy driven — the fill always
   *  means "the section I am reading now", never "the one I last jumped
   *  to" (#2478 rule 3). `null` before the first observer callback fires,
   *  or when `ids` is empty. */
  activeId: string | null;
}

/**
 * The one shared hook behind every sticky in-page section nav (#2478
 * resolution rules 3 and 7). `<TeamSectionNav>` and `<OrganigramSectionNav>`
 * both consume this instead of rolling their own `IntersectionObserver`, so
 * a chip's fill means the same thing — and lands at the same offset — on
 * every route.
 *
 * **Derived anchor offset.** Sets `scroll-padding-top` on `<html>` to
 * `calc(var(--sticky-header-h) + <bar height>px)`, `barHeight` tracked as
 * proper React state (not a one-off measurement) so every effect that
 * depends on it — the offset itself, the scroll-spy observer, the
 * hash-landing correction (composed from `useHashLandingCorrection`) —
 * re-runs whenever it changes, however that change happens: a resize, a
 * wrap, or the bar's own DOM node being replaced entirely. No `scroll-mt-*`
 * is ever typed per section.
 *
 * **Scroll-spy**, rebuilt whenever `barHeight` changes (#2584 review finding
 * 5) — a stale, too-small `rootMargin` baked in at construction time would
 * report a section "active" while its top is still genuinely covered by a
 * since-grown bar. The topmost intersecting section among `ids` wins.
 */
export function useSectionNav(ids: readonly string[]): UseSectionNavResult {
  const [navEl, setNavEl] = useState<HTMLElement | null>(null);
  const [barHeight, setBarHeight] = useState(0);
  // A ref callback (not a plain `useRef`) so this can reset `barHeight`
  // itself the moment the bar's DOM node detaches — a `setState` call here
  // runs during commit (the same timing a ref attach/detach always has),
  // never during render.
  const navRef = useCallback((node: HTMLElement | null) => {
    setNavEl(node);
    if (!node) setBarHeight(0);
  }, []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join("|");

  // "Latest ref" pattern: read inside the scroll-spy effect below, which
  // must not itself depend on `idsKey` recreating anything else. Synced in
  // its own effect, never mutated during render.
  const idListRef = useRef<string[]>([]);
  useEffect(() => {
    idListRef.current = idsKey.split("|").filter(Boolean);
  }, [idsKey]);

  // Tracks the bar's own rendered height as state — re-attaches whenever
  // `navEl` itself changes (mount, or a swap to a different node), not just
  // once for the hook's entire lifetime.
  useEffect(() => {
    if (!navEl) return;
    const measure = () => setBarHeight(navEl.getBoundingClientRect().height);
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(navEl);
    return () => resizeObserver.disconnect();
  }, [navEl]);

  useEffect(() => {
    if (!navEl) return;
    document.documentElement.style.scrollPaddingTop = `calc(var(--sticky-header-h) + ${barHeight}px)`;
    return () => {
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, [navEl, barHeight]);

  // #2584 review findings 1 and 4: a bar that resizes after the browser
  // already computed a hash navigation's scroll target (e.g. `<HubSearch>`
  // mounting once the hero leaves view) lands the target behind the
  // since-grown bar. `notifyLayoutChange` re-verifies the landing while a
  // hash navigation is still "armed" — see `useHashLandingCorrection` for
  // why a resize is a separate trigger from the hashchange itself.
  const { notifyLayoutChange } = useHashLandingCorrection(ids);
  useEffect(() => {
    notifyLayoutChange();
  }, [barHeight, notifyLayoutChange]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = idListRef.current
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Top inset clears the header + this bar; the bottom inset flips
    // "active" near the top third of the viewport, not the very bottom.
    const topInset = getStickyHeaderHeight() + barHeight;

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
  }, [idsKey, barHeight]);

  return { navRef, barHeight, activeId };
}
