"use client";

import {
  PageContainer,
  SectionNavChip,
  SECTION_NAV_BAR_CLASSES,
} from "@/components/design-system";
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
 * resolution). Each item is `<SectionNavChip>` — the light chip, the same
 * one `<OrganigramSectionNav>` uses, so the recipe is typed once rather
 * than hand-copied per route. Active is scroll-spy driven via the shared
 * `useSectionNav` hook (rule 3): the fill always means "the section being
 * read", never "the one last clicked". The bar pins at `--sticky-header-h`
 * and the same hook derives `scroll-padding-top` from its own measured
 * height — no `scroll-mt-*` on any section target. Renders nothing when one
 * or fewer sections exist.
 *
 * The `≤1 section` check lives in this outer component, one level above
 * `useSectionNav` — `<TeamSectionNavBar>` only ever mounts when the bar
 * itself does, so the hook's own mount/unmount tracks the bar's exactly
 * (a team with a nav today can navigate, client-side, to one with ≤1
 * section and back; hoisting the check here means that is an ordinary
 * unmount + remount, not a live component whose bar quietly disappears out
 * from under it).
 *
 * **Not permanently inert (#2444, corrected by #2478 and #2489).** #2444
 * originally reasoned this row "ships three items forever" and gave it a
 * control arrow in a rail reserved at every width ≥768px. #2478 measured the
 * five-item row (`Klassement · Wedstrijden · Spelers · Staf · Info`) and
 * found it overflowed only below ~430px viewport width — never at a width
 * the old rail reserved — with the three-item row (`Wedstrijden · Spelers ·
 * Staf`) the far more common case: two of the five auto-hiding sections
 * (`Klassement`, `Info`) were absent on every team page at the time, because
 * no team had published klassement or editorial data yet, not because they
 * don't exist. #2489's final rule replaces the fixed rail with one that
 * follows real overflow at every width — the same `<ScrollRail>` "row of
 * discrete things" idiom `<FilterTabs>` uses (nav items a visitor taps): a
 * 40px gutter on both sides exactly when the track overflows, the spent
 * direction disabled in place rather than unmounted.
 *
 * **Re-measured (#2637).** `Info` is renamed `Trainingen & contact` and, per
 * that ticket, no longer auto-hides — every team page now carries the full
 * five-item row (`Klassement`'s own presence still varies with the
 * competitive-block state). At the exact chip markup/classes this component
 * renders, the five-item row now overflows below **~570px** viewport width
 * (up from ~430px measured for the shorter `Info` label) — an ordinary
 * phone in portrait, not an edge case. The arrow mounts routinely now,
 * rather than "essentially never" as this docblock previously (and, as of
 * #2637, incorrectly) claimed.
 */
export function TeamSectionNav({ items }: TeamSectionNavProps) {
  if (items.length <= 1) return null;
  return <TeamSectionNavBar items={items} />;
}

function TeamSectionNavBar({
  items,
}: {
  items: readonly TeamSectionNavItem[];
}) {
  const ids = items.map((item) => item.id);
  const { navRef, activeId } = useSectionNav(ids);

  return (
    <nav
      ref={navRef}
      data-testid="team-section-nav"
      aria-label="Sectienavigatie"
      // TEAM-1: bottom border only — the StripedSeam above already divides
      // the nav from the hero, so a top border doubled the line.
      className={SECTION_NAV_BAR_CLASSES}
    >
      <PageContainer>
        <ScrollRail
          as="ul"
          ariaLabel="Sectienavigatie"
          trackClassName="flex items-center gap-2 py-2"
          // The bar is bg-cream-deep — the fade must match that ground, not
          // <ScrollRail>'s cream default, or the overflow fade reads as a
          // mismatched patch.
          fadeFromClassName="from-cream-deep"
        >
          {items.map((item) => (
            <SectionNavChip
              key={item.id}
              id={item.id}
              label={item.label}
              isActive={item.id === activeId}
            />
          ))}
        </ScrollRail>
      </PageContainer>
    </nav>
  );
}
