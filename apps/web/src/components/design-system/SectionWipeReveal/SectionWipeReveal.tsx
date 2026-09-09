"use client";

import { useEffect, useRef, type ReactNode } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const RUN_CLASS = "section-wipe-reveal--run";

export interface SectionWipeRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * M4 — the squeegee wipe (#2623, decision-sheet §8 D16). Ink pulled across
 * paper on section entry: a `clip-path: inset()` sweep, driven by
 * `IntersectionObserver`, timed by the Arrival token (`500ms`,
 * `var(--ease-out)` — DESIGN.md → Motion).
 *
 * **Deliberately inverted from `<ArticleBodyMotion>`/`TimelineReveal`.**
 * Those two hide their content with a class applied on mount and reveal it
 * once the observer fires. #2623's acceptance is stricter: "a section that
 * never animates must never stay hidden — the resting state is visible and
 * the animation removes the clip, not the other way round." So this
 * component never applies a hiding class at all — the unclassed DOM (no JS,
 * IntersectionObserver unsupported, `prefers-reduced-motion: reduce`, or an
 * observer that is created but never calls back) is the plain, unclipped
 * children. The only class this component ever adds is `--run`, which
 * *triggers* the entrance animation (`clip-path` keyframe, `animation-fill-
 * mode: backwards` — NOT `both`/`forwards`, which would keep the final
 * `inset(0 0 0 0)` clip applied forever after the sweep and silently slice
 * every offset shadow, rotated corner and focus ring on an edge tile;
 * `backwards` only affects the zero-length delay before the animation
 * starts, so the "no unclipped flash" property holds and the element still
 * reverts to a genuinely unclipped resting state once the sweep finishes —
 * see `globals.css`, #2888 review round 1). Skipping any class addition is
 * therefore always safe: it just means the section renders in its final,
 * fully-visible state, which is the correct degrade.
 *
 * A section already inside the viewport at mount — including one scrolled
 * *past* (bottom above the viewport, e.g. a back-navigation that restores
 * scroll to the foot of the page) — is measured with
 * `getBoundingClientRect()` before the observer is ever created — if it is
 * already visible (or already been scrolled past), no observer is attached
 * and `--run` can never be added, so it never animates in on content the
 * visitor already read.
 */
export function SectionWipeReveal({
  children,
  className,
}: SectionWipeRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia(MOTION_QUERY).matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    // Only a section entirely BELOW the viewport at mount still needs the
    // observer. Already visible and already scrolled past (bottom at or
    // above the viewport top — e.g. a back-navigation that restores scroll
    // to the foot of the page) are treated the same: never arm the
    // observer, so the section can never receive --run and can never
    // animate in on content the visitor already read.
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const rect = node.getBoundingClientRect();
    const notYetInView = rect.top >= viewportHeight;
    if (!notYetInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          node.classList.add(RUN_CLASS);
          observer.unobserve(node);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
