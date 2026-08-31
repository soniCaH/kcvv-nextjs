/**
 * Garment geometry that exists only for `<JerseyIllustration>`'s per-player
 * variant system (#2635) — long-sleeve arm paths and the alternate stripe
 * (band) counts. `_jersey-paths.ts` holds the base silhouette both
 * `<JerseyShirt>` and `<JerseyIllustration>` share; this file holds the
 * additive geometry with exactly one consumer, so it lives beside that
 * consumer instead of in the shared module — `<JerseyShirt>` never imports
 * from here.
 *
 * Source: `docs/design/mockups/2590-non-cutout-photos/2590-1-niet-uitgeknipt.html`.
 */
import { JERSEY_VERTICAL_STRIPE_PATHS } from "../_jersey-paths";
import type { StripeCount } from "./player-figure-variant";

/**
 * Long-sleeve variant of the shoulder bump — the bump extended into an arm
 * down the torso. Picked over `JERSEY_SHOULDER_BUMP_*` (`_jersey-paths.ts`)
 * for the ~45% of players drawn with long sleeves.
 */
export const JERSEY_SLEEVE_LEFT_PATH = "M 52 168 L 70 162 L 74 258 L 50 262 Z";

export const JERSEY_SLEEVE_RIGHT_PATH =
  "M 168 168 L 150 162 L 146 258 L 170 262 Z";

/**
 * Alternate vertical-band counts for the "bands" shirt pattern — the club
 * runs 3-, 4- and 5-stripe kits. `JERSEY_VERTICAL_STRIPE_PATHS`
 * (`_jersey-paths.ts`) is the canonical 4-band set; these fill the other two.
 */
const JERSEY_STRIPE_PATHS_3 = [
  "M 79 163 L 79 300",
  "M 110 158 L 110 300",
  "M 141 163 L 141 300",
] as const;

const JERSEY_STRIPE_PATHS_5 = [
  "M 64 170 L 64 300",
  "M 87 160 L 87 300",
  "M 110 157 L 110 300",
  "M 133 160 L 133 300",
  "M 156 170 L 156 300",
] as const;

/** Stripe-count → band paths, keyed the way the variant's `stripeCount` picks a set. */
export const JERSEY_STRIPE_PATHS_BY_COUNT: Record<
  StripeCount,
  readonly string[]
> = {
  3: JERSEY_STRIPE_PATHS_3,
  4: JERSEY_VERTICAL_STRIPE_PATHS,
  5: JERSEY_STRIPE_PATHS_5,
};
