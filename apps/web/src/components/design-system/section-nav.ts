/**
 * Shared classes for a sticky in-page section nav (#2478 rules 1 and 4) —
 * the light chip, deliberately quieter than `<FilterTabs>`'s: 1px border,
 * 1px shadow at rest, no press-down. Consumed by `<SectionNavChip>` (the
 * real item, both states) and by both route loading skeletons
 * (`hulp/loading.tsx`, `ploegen/[slug]/loading.tsx`), so a skeleton can
 * never drift from the shape it stands in for (#2432's "a skeleton that
 * disagrees with the thing it stands in for is a layout shift by
 * construction" — see `<FilterTabsSkeleton>`'s docblock, the direct
 * precedent for this file).
 *
 * `<HubSearch>`'s `nav` variant also takes `SECTION_NAV_CHIP_SHADOW_CLASS`
 * for its own shadow — the trailing slot in the same bar wears the chip's
 * exact paper weight (rule 5 addendum).
 */

export const SECTION_NAV_BAR_CLASSES =
  "bg-cream-deep border-ink sticky top-[var(--sticky-header-h)] z-30 border-b-2";

/** Border + padding — shared by both chip states and the skeleton. The 1px
 *  shadow is a separate constant: it belongs to the *resting* look only —
 *  the active fill drops it (no press-down, rule 1). */
export const SECTION_NAV_CHIP_BASE_CLASSES =
  "border-ink inline-block border px-3 py-1.5";

export const SECTION_NAV_CHIP_SHADOW_CLASS =
  "shadow-[1px_1px_0_0_var(--color-ink)]";
