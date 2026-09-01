/**
 * Canonical SVG path strings for the KCVV jersey/torso silhouette, sourced
 * verbatim from `option-b-stamped-block-print.html` `#player-figure` (lines
 * 720-756).
 *
 * `<JerseyShirt>` and `<JerseyIllustration>` (shipped as this file's
 * successor primitive under #2118) both consume these constants so the
 * two-pass print vocabulary traces to "one illustrator's hand" cohesion
 * contract per `docs/design/mockups/phase-3-a-tier-c-figures/jerseyshirt-locked.md`.
 *
 * **#2635 cohesion-contract decision.** `<JerseyIllustration>` now draws a
 * deterministic per-player variant (`player-figure-variant.ts`, seeded from
 * a stable per-player id) — it is no longer byte-identical per instance.
 * `<JerseyShirt>` is **explicitly pinned to this file's base geometry**: it
 * has no player identity to seed from (its callers are team- and
 * club-level — `ClubshopBanner`, `TeamHero`, `TeamFlagship`,
 * `YouthDirectory`, `EmptyState`, `ErrorState` — never a single player), so
 * it keeps reading these constants directly and unparameterised.
 *
 * This file holds only geometry both primitives can consume identically —
 * the base silhouette plus the shared extents the containment guard bounds
 * against. Geometry that exists solely for `<JerseyIllustration>`'s variant
 * system (long-sleeve arm paths, alternate stripe counts) lives beside that
 * component instead (`JerseyIllustration/jersey-illustration-geometry.ts`),
 * one consumer, one home — `<JerseyShirt>` never imports it.
 *
 * Coordinate space is the viewBox `0 0 220 300` (full figure including head).
 * `<JerseyShirt>` crops to the torso via `viewBox="0 120 220 180"`;
 * `<JerseyIllustration>` uses the full viewBox.
 *
 * Do not edit the base geometry below independently of the locked spec.
 */

export const JERSEY_TORSO_FILL_PATH =
  "M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300 Z";

export const JERSEY_TORSO_OUTLINE_PATH =
  "M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300";

export const JERSEY_V_COLLAR_PATH = "M 92 132 L 110 156 L 128 132";

/**
 * Coat garment lines (#2485) — the overprint-only geometry
 * `<JerseyIllustration garment="coat">` draws instead of
 * `JERSEY_V_COLLAR_PATH` + the stripe/pattern marks. A player takes the
 * jersey, a staff member takes a coat: same head, torso and shoulder bumps,
 * differing only in these garment-front lines and in which ink goes down
 * first (the coat inverts the underprint/overprint palette — see
 * `<JerseyIllustration>`). Converging lapels, a placket running to the hem,
 * and two notch ticks where the lapel meets the collar.
 */
export const JERSEY_COAT_LAPEL_PATH = "M 84 137 L 110 198 L 136 137";
export const JERSEY_COAT_PLACKET_PATH = "M 110 198 L 110 300";
export const JERSEY_COAT_NOTCH_LEFT_PATH = "M 96 165 L 78 176";
export const JERSEY_COAT_NOTCH_RIGHT_PATH = "M 124 165 L 142 176";

export const JERSEY_VERTICAL_STRIPE_PATHS = [
  "M 70 168 L 70 300",
  "M 88 158 L 88 300",
  "M 132 158 L 132 300",
  "M 150 168 L 150 300",
] as const;

export const JERSEY_TORSO_VIEWBOX = "0 120 220 180";

/**
 * Full-figure paths consumed by `<JerseyIllustration>`. Not used by
 * `<JerseyShirt>` (which crops to the torso), but live here so the two
 * primitives share one provenance.
 *
 * Head ellipse + shoulder bumps source: `option-b-stamped-block-print.html`
 * `#player-figure` lines 727-731 / 738-742.
 */
export const JERSEY_HEAD_ELLIPSE = {
  cx: 110,
  cy: 78,
  rx: 44,
  ry: 48,
} as const;

export const JERSEY_SHOULDER_BUMP_LEFT_PATH =
  "M 52 168 L 70 162 L 72 196 L 54 200 Z";

export const JERSEY_SHOULDER_BUMP_RIGHT_PATH =
  "M 168 168 L 150 162 L 148 196 L 166 200 Z";

/** The full-figure viewBox, in units — build the `viewBox` string from these, never hand-copy them. */
export const JERSEY_FIGURE_VIEWBOX_WIDTH = 220;
export const JERSEY_FIGURE_VIEWBOX_HEIGHT = 300;

export const JERSEY_FIGURE_VIEWBOX = `0 0 ${JERSEY_FIGURE_VIEWBOX_WIDTH} ${JERSEY_FIGURE_VIEWBOX_HEIGHT}`;

/**
 * The outline (overprint) stroke width shared by every consumer —
 * `<JerseyIllustration>`'s head/torso/collar/pattern strokes and
 * `<JerseyShirt>`'s torso outline both use this, and the containment
 * guard's `STROKE_ALLOWANCE` derives from it. One definition so a future
 * re-weight of the line can't silently drift between them.
 */
export const JERSEY_OUTLINE_STROKE_WIDTH = 3;

/**
 * Half-width, in viewBox units from the x=110 centreline, of the widest
 * point the base torso path (`JERSEY_TORSO_FILL_PATH`/`_OUTLINE_PATH`)
 * reaches — `110 − 30` (and `190 − 110`) from that path's own endpoints.
 * The containment guard's bounding box uses this (scaled by `build`) as one
 * of the two candidates for the figure's widest extent.
 */
export const JERSEY_TORSO_HALF_WIDTH = 80;

/**
 * Half-width, in viewBox units from the x=110 centreline, of the widest
 * point either arm variant reaches — the long-sleeve path's leftmost point
 * is `x=50` (`110 − 50 = 60`, in `jersey-illustration-geometry.ts`); the
 * short shoulder-bump's leftmost point (`x=52`) reaches slightly less. `60`
 * is the safe upper bound the containment guard measures both against, so
 * a future sleeve or bump edit that reaches further MUST update this
 * constant in the same diff — the guard has no other way to know.
 */
export const JERSEY_ARM_REACH_HALF_WIDTH = 60;
