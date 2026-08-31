/**
 * Canonical SVG path strings for the KCVV jersey/torso silhouette, sourced
 * verbatim from `option-b-stamped-block-print.html` `#player-figure` (lines
 * 720-756).
 *
 * `<JerseyShirt>` and `<JerseyIllustration>` (shipped as `<PlayerFigure>`'s
 * successor under #2118) both consume these constants so the two-pass print
 * vocabulary traces to "one illustrator's hand" cohesion contract per
 * `docs/design/mockups/phase-3-a-tier-c-figures/jerseyshirt-locked.md`.
 *
 * **#2635 cohesion-contract decision.** `<JerseyIllustration>` now draws a
 * deterministic per-player variant (`player-figure-variant.ts`, seeded from
 * the player's name) — it is no longer byte-identical per instance.
 * `<JerseyShirt>` is **explicitly pinned to this file's base geometry**: it
 * has no player identity to seed from (its callers are team- and
 * club-level — `ClubshopBanner`, `TeamHero`, `TeamFlagship`,
 * `YouthDirectory`, `EmptyState`, `ErrorState` — never a single player), so
 * it keeps reading these constants directly and unparameterised. The
 * garment-geometry additions below (sleeve arms, alternate stripe counts)
 * exist only for `<JerseyIllustration>`'s variant system; `<JerseyShirt>`
 * does not import them.
 *
 * Coordinate space is the viewBox `0 0 220 300` (full figure including head).
 * `<JerseyShirt>` crops to the torso via `viewBox="0 120 220 180"`;
 * `<JerseyIllustration>` uses the full viewBox.
 *
 * Do not edit the base geometry below independently of the locked spec —
 * additive exports (new stripe counts, sleeve variants) are fine.
 */

export const JERSEY_TORSO_FILL_PATH =
  "M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300 Z";

export const JERSEY_TORSO_OUTLINE_PATH =
  "M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300";

export const JERSEY_V_COLLAR_PATH = "M 92 132 L 110 156 L 128 132";

export const JERSEY_VERTICAL_STRIPE_PATHS = [
  "M 70 168 L 70 300",
  "M 88 158 L 88 300",
  "M 132 158 L 132 300",
  "M 150 168 L 150 300",
] as const;

export const JERSEY_TORSO_VIEWBOX = "0 120 220 180";

/**
 * Full-figure paths consumed by `<PlayerFigure>` (#1633). Not used by
 * `<JerseyShirt>` (which crops to the torso), but live here so the two
 * primitives share one provenance and stay byte-identical.
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

export const JERSEY_FIGURE_VIEWBOX = "0 0 220 300";

/**
 * Long-sleeve variant of the shoulder bump — the bump extended into an arm
 * down the torso. `<JerseyIllustration>`'s variant system picks these over
 * `JERSEY_SHOULDER_BUMP_*` for the ~45% of players drawn with long sleeves.
 * Source: `docs/design/mockups/2590-non-cutout-photos/2590-1-niet-uitgeknipt.html`.
 */
export const JERSEY_SLEEVE_LEFT_PATH = "M 52 168 L 70 162 L 74 258 L 50 262 Z";

export const JERSEY_SLEEVE_RIGHT_PATH =
  "M 168 168 L 150 162 L 146 258 L 170 262 Z";

/**
 * Alternate vertical-band counts for the "bands" shirt pattern — the club
 * runs 3-, 4- and 5-stripe kits. `JERSEY_VERTICAL_STRIPE_PATHS` above is the
 * canonical 4-band set (index 1); these fill the other two.
 * Source: `docs/design/mockups/2590-non-cutout-photos/2590-1-niet-uitgeknipt.html`.
 */
export const JERSEY_STRIPE_PATHS_3 = [
  "M 79 163 L 79 300",
  "M 110 158 L 110 300",
  "M 141 163 L 141 300",
] as const;

export const JERSEY_STRIPE_PATHS_5 = [
  "M 64 170 L 64 300",
  "M 87 160 L 87 300",
  "M 110 157 L 110 300",
  "M 133 160 L 133 300",
  "M 156 170 L 156 300",
] as const;

/** Stripe-count → band paths, keyed the way the variant's `stripeCount` picks a set. */
export const JERSEY_STRIPE_PATHS_BY_COUNT = {
  3: JERSEY_STRIPE_PATHS_3,
  4: JERSEY_VERTICAL_STRIPE_PATHS,
  5: JERSEY_STRIPE_PATHS_5,
} as const;
