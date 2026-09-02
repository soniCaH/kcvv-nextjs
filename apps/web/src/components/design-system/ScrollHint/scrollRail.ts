/**
 * Reserved gutter for a "row of discrete things" — chips, crumbs. Held on
 * both sides exactly when the track overflows at that width (#2489
 * resolution part 1), never as a permanent breakpoint-gated rail. A table
 * or a diagram never reserves this: the arrow simply overlays content you
 * scroll past instead of covering a tap target (#2489 resolution part 2).
 *
 * Shared by `<FilterTabs>`, `<TeamSectionNav>` and the organigram
 * breadcrumb so the three don't drift on the exact gutter width.
 */
export const SCROLL_RAIL_CLASSES = "pl-10 pr-10";
