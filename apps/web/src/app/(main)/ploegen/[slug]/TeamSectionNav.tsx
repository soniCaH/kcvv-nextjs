"use client";

import { cn } from "@/lib/utils/cn";
import { PageContainer } from "@/components/design-system";
import { ScrollRail } from "@/components/design-system/ScrollHint/ScrollRail";
import { useSectionNav } from "@/hooks/useSectionNav";

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
 * Sticky in-page section navigation for the team detail page (#2478
 * resolution). Each item is the **light** chip — `border` (1px), `bg-cream`,
 * a 1px shadow, no press-down — deliberately quieter than `<FilterTabs>`
 * (rule 1); today's bare colour-only link is gone. Active is scroll-spy
 * driven via the shared `useSectionNav` hook (rule 3): the fill always means
 * "the section being read", never "the one last clicked". The bar itself
 * pins at `--sticky-header-h` (rule 4) and the same hook derives
 * `scroll-padding-top` from its own measured height (rule 7) — no
 * `scroll-mt-*` on any section target. Renders nothing when one or fewer
 * sections exist.
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
 * one that follows real overflow at every width — the same `<ScrollRail>`
 * "row of discrete things" idiom `<FilterTabs>` uses (nav items a visitor
 * taps): a 40px gutter on both sides exactly when the track overflows, the
 * spent direction disabled in place rather than unmounted. On today's
 * three-item data the arrow essentially never mounts; it is ready the
 * moment a fourth or fifth section makes the row overflow.
 */
export function TeamSectionNav({ items }: TeamSectionNavProps) {
  const ids = items.map((item) => item.id);
  const { navRef, activeId } = useSectionNav(ids);

  if (items.length <= 1) return null;

  return (
    <nav
      ref={navRef}
      data-testid="team-section-nav"
      aria-label="Sectienavigatie"
      className={cn(
        // TEAM-1: bottom border only — the StripedSeam above already divides
        // the nav from the hero, so a top border doubled the line.
        // #2478 rule 4: bg-cream-deep, pinned at the derived header token,
        // not top-16.
        "bg-cream-deep border-ink sticky top-[var(--sticky-header-h)] z-30 border-b-2",
      )}
    >
      <PageContainer>
        <ScrollRail
          as="ul"
          ariaLabel="Sectienavigatie"
          trackClassName="flex items-center gap-2 py-2"
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                {/* The light chip (#2478 rule 1) — a mirror of
                    <OrganigramSectionNav>'s item; a change to this recipe
                    needs the same change there. */}
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => {
                    // Move keyboard focus into the target section — the
                    // hash anchor alone leaves focus on <body> (#2478 rule
                    // 8). Hash navigation handles the scroll itself.
                    document
                      .getElementById(item.id)
                      ?.focus({ preventScroll: true });
                  }}
                  className={cn(
                    "border-ink inline-block border px-3 py-1.5 font-mono text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase transition-all duration-150",
                    isActive
                      ? "bg-jersey-deep text-cream"
                      : "bg-cream text-ink hover:bg-cream-soft shadow-[1px_1px_0_0_var(--color-ink)]",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ScrollRail>
      </PageContainer>
    </nav>
  );
}
