"use client";

import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/design-system";
import { useScrollHint } from "@/components/design-system/ScrollHint/useScrollHint";
import { ScrollArrowButton } from "@/components/design-system/ScrollHint/ScrollArrowButton";
import { SCROLL_RAIL_CLASSES } from "@/components/design-system/ScrollHint/scrollRail";

export interface TeamSectionNavItem {
  /** Anchor target id (matches the section's `id`). */
  id: string;
  /** Display label. */
  label: string;
}

export interface TeamSectionNavProps {
  /** Only the sections that actually render — auto-hide aware. */
  items: readonly TeamSectionNavItem[];
}

/**
 * Sticky in-page section navigation for the team detail page. Native anchor
 * links (no JS) — `scroll-margin-top` on the section targets keeps headings
 * clear of the sticky bar. Renders nothing when one or fewer sections exist.
 *
 * **Not permanently inert (#2444, corrected by #2478 and #2489).** #2444
 * originally reasoned this row "ships three items forever" and gave it a
 * control arrow in a rail reserved at every width ≥768px. Measured at full
 * section count (`Klassement · Wedstrijden · Spelers · Staf · Info`, #2478),
 * it overflows only below 430px — never at a width the old rail reserved —
 * and today's three-item row is **pre-season**, not permanent: two of the
 * five auto-hiding sections (`Klassement`, `Info`) are currently absent
 * because no team has published klassement or editorial data yet, not
 * because they don't exist. #2489's final rule replaces the fixed rail with
 * one that follows real overflow at every width: like `<FilterTabs>`, this
 * is a "row of discrete things" (nav items a visitor taps), so it holds a
 * 40px gutter on both sides exactly when `useScrollHint`'s `overflows` is
 * true, and the spent direction disables in place rather than unmounting.
 * On today's three-item data the arrow essentially never mounts; it is
 * ready the moment a fourth or fifth section makes the row overflow.
 *
 * Only the scroll-arrow behaviour is this ticket's (#2577) — the light chip
 * item register, scroll-spy active state and derived anchor offset that
 * #2478's full resolution also describes belong to whichever ticket
 * implements the rest of that decision; this component's link markup is
 * unchanged.
 */
export function TeamSectionNav({ items }: TeamSectionNavProps) {
  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    overflows,
    scrollLeft,
    scrollRight,
  } = useScrollHint<HTMLUListElement>();

  if (items.length <= 1) return null;

  return (
    <nav
      data-testid="team-section-nav"
      aria-label="Sectienavigatie"
      className={cn(
        // TEAM-1: bottom border only — the StripedSeam above already divides
        // the nav from the hero, so a top border doubled the line.
        "border-ink bg-cream sticky top-16 z-20 border-b-2",
      )}
    >
      <PageContainer className="relative">
        {overflows && (
          <ScrollArrowButton
            direction="left"
            register="control"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        )}

        <ul
          ref={scrollRef}
          tabIndex={0}
          className={cn(
            "flex items-center gap-1 overflow-x-auto py-2",
            overflows && SCROLL_RAIL_CLASSES,
          )}
        >
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-ink hover:bg-jersey-deep hover:text-cream inline-block px-3 py-1 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {overflows && (
          <ScrollArrowButton
            direction="right"
            register="control"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        )}
      </PageContainer>
    </nav>
  );
}
