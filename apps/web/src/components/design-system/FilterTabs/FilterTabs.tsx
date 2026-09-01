"use client";

/**
 * FilterTabs — Pure presentational filter chip row.
 *
 * Direction D ("Paper chrome, ink emphasis") locked at the Phase 2 Track B
 * design checkpoint (2026-04-30). Source-of-record:
 * docs/design/mockups/phase-2-track-b/option-d-paper-chrome-ink-emphasis.html
 * (`.f-chip` rules, ink-invert active variant chosen — see compare.md
 * lines 60–70).
 *
 * Each chip is a paper-chip body: `border-2 ink` + `--shadow-paper-sm` +
 * `bg-cream-soft`, mono caps label, sharp corners. Active inverts to
 * `bg-ink text-cream` with the soft `--shadow-paper-sm-soft`. Hover
 * collapses the shadow fully (`hover:shadow-none`) and translates by 4 px
 * on both axes (`hover:translate-x-1 hover:translate-y-1`) over
 * `transition-all duration-300` — the canonical press-down hover shared
 * with `<Button>`, `<BrandedTabs>`, `<ScrollArrowButton>`, and the slider
 * arrows. Counts render inline after a 1 px hairline pipe — no pill, no
 * badge.
 *
 * **The single filter primitive (#2429 / #2564).** One `<FilterTabs>` now
 * absorbs every filter row on the site — News categories, search result
 * types, `/kalender`'s by-type chips, `/evenementen`'s by-type chips, and
 * both of `/hulp`'s rows (audience + category) — replacing the bespoke
 * `KalenderFilterBar` and `EventFilterBar` (deleted) plus HulpFinder's two
 * hand-rolled chip rows. Per-facet colour identity survives absorption as
 * the optional `FilterTab.color` prop (sourced from each domain's own
 * colour map, e.g. `EVENT_TYPE_FILL` — this component stays colour-agnostic
 * and never hardcodes a facet's fill) rather than being flattened to
 * neutral. `shadow="soft"` opts the whole row into the soft shadow for a
 * host on an ink/dark ground (DESIGN.md: a hard ink shadow is invisible
 * there) — mirrors `<TapedCard shadow="soft">` / `<EmptyState
 * surface="inverse">`.
 *
 * **Overflow is plain scroll, on purpose.** Four alternatives (wrap-capped,
 * sticky "Alles", "Alles" outside the scroller, snap-back-on-empty) were
 * prototyped on the real `/kalender` route and rejected as unintuitive
 * (#2429 resolution, rule 3) — this row never wraps and never traps the
 * reset off-screen behind different chrome. `overflow-x-auto` + the shared
 * absolute-positioned scroll arrows is the only overflow treatment.
 *
 * **`role="group"` + `aria-pressed`, not `role="tablist"`/`"tab"`.** A
 * filter narrows a list in place — a set of toggles, not tabs — and this
 * component renders no `tabpanel` for `role="tab"` to associate with
 * (#2429 resolution, rule 7). `role="tablist"` stays reserved for genuine
 * segmented switchers elsewhere (the Maand·Week·Agenda toggle,
 * `MemberDetailPanel`'s holder switcher), which are a different component.
 *
 * **One chip size.** The `size` prop is deleted (#2429 resolution, rule 6)
 * — every chip renders at the former `md` dimensions, ending the four
 * shipped heights (24/27/31/44px) this primitive's various absorbed rows
 * used to disagree on.
 *
 * **Leading-glyph slot.** `FilterTab.icon` returns as an optional prop
 * (#2429 resolution addendum, "rule 9") — a filter row may carry a
 * Phosphor Fill icon before its label. This deliberately reverses the
 * Direction D checkpoint lock (`docs/design/mockups/phase-2-track-b/compare.md`
 * lines 22 + 70, which is left unedited as the historical record of that
 * checkpoint). The slot is optional: a row with no glyph renders exactly as
 * before.
 *
 * State management is left to the parent (`activeTab` + `onChange?`); when
 * `renderAsLinks` is true, tabs with `href` render as `<a>` instead of
 * `<button>` for full-page Next.js navigation.
 */

import { cn } from "@/lib/utils/cn";
import { useScrollHint } from "@/components/design-system/ScrollHint/useScrollHint";
import { ScrollArrowButton } from "@/components/design-system/ScrollHint/ScrollArrowButton";
import type { RedesignIconProps } from "@/lib/icons.redesign";
import type { ComponentType } from "react";

/** A tab's per-facet colour identity — border always, fill only when
 *  selected. Sourced by the caller from its own domain colour map (e.g.
 *  `EVENT_TYPE_FILL`); omit for the neutral ink/cream Direction D chip. */
export interface FilterTabColor {
  /** Border colour class, e.g. `"border-jersey-deep"`. Applied at rest and selected. */
  border: string;
  /** Background + text classes applied only when this tab is selected, e.g. `"bg-jersey-deep text-white"`. */
  fill: string;
}

export interface FilterTab {
  /** Unique identifier */
  value: string;
  /** Display label */
  label: string;
  /** Optional count rendered inline after a 1 px hairline pipe divider */
  count?: number;
  /** Optional href — only consumed when `renderAsLinks` is true */
  href?: string;
  /** Optional leading glyph — a Phosphor Fill icon component (`@/lib/icons.redesign`). */
  icon?: ComponentType<RedesignIconProps>;
  /** Optional per-facet colour identity. Omit for the neutral chip. */
  color?: FilterTabColor;
}

/** Shadow register for the row — `"sm"` (default) is the hard ink shadow
 *  for a cream/paper field; `"soft"` is for a chip row hosted on an ink or
 *  dark-green ground, where DESIGN.md's rule is that a hard shadow is
 *  invisible. Mirrors `<TapedCard shadow>` / `<EmptyState surface>`. */
export type FilterTabsShadow = "sm" | "soft";

export interface FilterTabsProps {
  /** Array of filter options */
  tabs: FilterTab[];
  /** Currently active tab value */
  activeTab: string;
  /** Change handler (for controlled tabs) */
  onChange?: (value: string) => void;
  /** Show count after a hairline pipe divider when present */
  showCounts?: boolean;
  /** Additional CSS classes applied to the outer container */
  className?: string;
  /** Optional aria-label for the filter group */
  ariaLabel?: string;
  /** Render as links instead of buttons (for Next.js Link / SSR routing) */
  renderAsLinks?: boolean;
  /** Inactive-chip shadow register — `"soft"` for a row hosted on an ink/dark ground. */
  shadow?: FilterTabsShadow;
}

const CHIP_BASE_CLASSES = [
  // gap-2 (8 px) is the *internal* gap between the chip label and the
  // count `<span>` — matches the mockup's `.f-chip { gap: 8px }`. Don't
  // confuse with the row-level `gap-3` (12 px) below, which is the
  // BrandedTabs-aligned breathing space *between* chips.
  "inline-flex flex-shrink-0 items-center gap-2",
  "rounded-none border-2 border-ink",
  "font-mono font-semibold uppercase tracking-[0.08em]",
  "px-3 py-2 text-[11px]",
  "transition-all duration-300",
  "hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jersey-deep focus-visible:ring-offset-2",
] as const;

const CHIP_ACTIVE_CLASSES = [
  "bg-ink text-cream",
  "shadow-paper-sm-soft",
] as const;

const INACTIVE_SHADOW_CLASS: Record<FilterTabsShadow, string> = {
  sm: "shadow-paper-sm",
  soft: "shadow-paper-sm-soft",
};

const ARROW_SIZE_CLASSES = "w-10 h-10";
const SCROLL_PADDING_LEFT = "pl-12";
const SCROLL_PADDING_RIGHT = "pr-12";

export function FilterTabs({
  tabs,
  activeTab,
  onChange,
  showCounts = true,
  className = "",
  ariaLabel = "Filter tabs",
  renderAsLinks = false,
  shadow = "sm",
}: FilterTabsProps) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useScrollHint<HTMLDivElement>();

  const renderTab = (tab: FilterTab) => {
    const isActive = activeTab === tab.value;
    const Icon = tab.icon;
    const chipClasses = cn(
      ...CHIP_BASE_CLASSES,
      isActive
        ? tab.color
          ? cn(tab.color.fill, tab.color.border, "shadow-paper-sm-soft")
          : CHIP_ACTIVE_CLASSES
        : tab.color
          ? cn(
              "bg-cream-soft text-ink",
              tab.color.border,
              INACTIVE_SHADOW_CLASS[shadow],
            )
          : cn("bg-cream-soft text-ink", INACTIVE_SHADOW_CLASS[shadow]),
    );

    const content = (
      <>
        {Icon && <Icon size={14} aria-hidden />}
        <span>{tab.label}</span>
        {showCounts && typeof tab.count !== "undefined" && (
          <span
            className={cn(
              "border-l pl-2 text-[10px] font-semibold",
              isActive
                ? "border-cream text-cream"
                : "border-ink-muted text-ink-muted",
            )}
          >
            {tab.count}
          </span>
        )}
      </>
    );

    if (renderAsLinks && tab.href) {
      return (
        <a
          key={tab.value}
          href={tab.href}
          className={chipClasses}
          aria-current={isActive ? "page" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={tab.value}
        onClick={() => onChange?.(tab.value)}
        className={chipClasses}
        aria-pressed={isActive}
        type="button"
      >
        {content}
      </button>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {canScrollLeft && (
        <ScrollArrowButton
          direction="left"
          onClick={scrollLeft}
          className={ARROW_SIZE_CLASSES}
        />
      )}

      <div
        ref={scrollRef}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          // scrollbar-hide @utility lives in globals.css. pb-1.5 (6 px)
          // gives the 4 × 4 paper shadow room to render — `overflow-x: auto`
          // is silently normalised by browsers to clip on both axes when
          // the other axis would be `visible`, otherwise cropping the
          // shadow's bottom edge (same fix as BrandedTabs #1576). Tab gap
          // matches BrandedTabs (`gap-3` = 12 px) — overrides the mockup's
          // 8 px to keep the two atoms visually consistent at the row level.
          "scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth pb-1.5",
          canScrollLeft ? SCROLL_PADDING_LEFT : "pl-0",
          canScrollRight ? SCROLL_PADDING_RIGHT : "pr-0",
        )}
      >
        {tabs.map(renderTab)}
      </div>

      {canScrollRight && (
        <ScrollArrowButton
          direction="right"
          onClick={scrollRight}
          className={ARROW_SIZE_CLASSES}
        />
      )}
    </div>
  );
}
