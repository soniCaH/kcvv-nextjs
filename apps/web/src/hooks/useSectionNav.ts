"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Fallback for the `--sticky-header-h` token (`globals.css`) when it can't be
 * read off the DOM — no stylesheet is loaded under vitest/happy-dom. Exists
 * only so the scroll-spy's `rootMargin` degrades safely outside a real
 * browser; it is not a second source of truth for the header height in
 * production, where `scroll-padding-top` itself is set via the CSS `calc()`
 * expression below and never touches this constant.
 */
const FALLBACK_HEADER_HEIGHT_PX = 65;

function readHeaderHeight(): number {
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
  /** Attach to the sticky bar's own outer element (its `<nav>`) — its
   *  rendered height is what "derived from the bar" (#2478 rule 7) measures,
   *  including a trailing slot (e.g. `<HubSearch>`) wrapping to its own
   *  line at narrow widths. */
  navRef: RefObject<HTMLElement | null>;
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
 * **Scroll-spy.** The topmost intersecting section among `ids` wins.
 *
 * **Derived anchor offset.** Sets `scroll-padding-top` on `<html>` — the
 * single global scroll container every anchor jump honours, whether it's a
 * plain `<a href="#id">`, `Element.scrollIntoView()`, or Next.js's own
 * hash-navigation scroll — to `calc(var(--sticky-header-h) + <bar height>px)`,
 * remeasured via `ResizeObserver` whenever the bar's own box changes (a
 * trailing slot wrapping to its own line, a web-font swap). No
 * `scroll-mt-*` is ever typed per section; the offset instead tracks
 * whichever bar is actually on screen. Reset to `""` on unmount, since
 * `<html>` persists across App Router client-side navigations and a route
 * with no section nav must fall back to `globals.css`'s header-only base
 * rule rather than inherit a stale value from the page navigated away from.
 */
export function useSectionNav(ids: readonly string[]): UseSectionNavResult {
  const navRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join("|");

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const applyOffset = () => {
      const barHeight = el.getBoundingClientRect().height;
      document.documentElement.style.scrollPaddingTop = `calc(var(--sticky-header-h) + ${barHeight}px)`;
    };

    applyOffset();
    const resizeObserver = new ResizeObserver(applyOffset);
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = idsKey
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // Top inset clears the header + this bar; the bottom inset flips
    // "active" near the top third of the viewport, not the very bottom —
    // same shape as the hub's original per-route observer, generalised to
    // any section count.
    const topInset =
      readHeaderHeight() +
      (navRef.current?.getBoundingClientRect().height ?? 0);

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
  }, [idsKey]);

  return { navRef, activeId };
}
