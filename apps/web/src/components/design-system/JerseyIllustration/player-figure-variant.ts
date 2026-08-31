/**
 * Deterministic per-player figure variance for `<JerseyIllustration>` (#2635).
 *
 * A player with no photo used to draw the identical constant figure, so a
 * squad of 26 read as 26 copies. This module derives a per-player variant —
 * registration offset, opacity, scale, crop, mirror, head/shoulder/torso
 * geometry, sleeve length and shirt pattern — from a djb2 hash of the
 * player's full name, so the same player draws the same figure every
 * render, every season, and server and client agree (no `Math.random`,
 * no DOM measurement anywhere in this file).
 *
 * The lever ranges and the two-part containment guard are ported verbatim
 * from the design drill that decided them:
 *  - `docs/design/mockups/2542-squad-photo-coverage/2542-2-variatie-studie.html`
 *    — the seed, the PRNG, the lever ranges, and the top/side guard (#2542's
 *    addendum: shrink-to-fit, then shift so no shoulder or the head crosses
 *    the 4px margin, at most 8 passes).
 *  - `docs/design/mockups/2590-non-cutout-photos/2590-1-niet-uitgeknipt.html`
 *    — the bottom clamp (#2590's correction): after the existing passes, if
 *    the torso stops short of the viewBox bottom, shift down to meet it.
 *    Shifting down can never re-expose the top guard, so it runs once,
 *    un-looped, after the 8-pass loop settles.
 *
 * The PRNG draw order matches the mockups exactly — including a `scale`
 * draw that gets immediately superseded by a wider one later — so a given
 * name maps to the same visual result the drill measured its verified
 * numbers against (0 clipped, 15-of-26-short → 0).
 */

import { JERSEY_HEAD_ELLIPSE } from "../_jersey-paths";

export const SHIRT_PATTERNS = ["bands", "hoops", "dots", "plain"] as const;
export type ShirtPattern = (typeof SHIRT_PATTERNS)[number];

export const SLEEVE_LENGTHS = ["short", "long"] as const;
export type SleeveLength = (typeof SLEEVE_LENGTHS)[number];

export const STRIPE_COUNTS = [3, 4, 5] as const;
export type StripeCount = (typeof STRIPE_COUNTS)[number];

export interface PlayerFigureVariant {
  /** Uniform scale of the whole figure (garment geometry lever: 0.84–1.16, pre-guard). */
  scale: number;
  /** Small positional jitter, x axis — part of the seeded "scale" draw, not the registration offset. */
  offsetX: number;
  /** Small positional jitter, y axis. */
  offsetY: number;
  /** Crop lever — how much of the torso shows. Also carries the containment guard's vertical corrections. */
  drop: number;
  /** Paper rotation, degrees (±0.9°). */
  rotation: number;
  /** Posture lean — a skewX, degrees (±3°). */
  lean: number;
  /** Underprint (fill) layer opacity (0.74–1.0). */
  underprintOpacity: number;
  /** Overprint (outline) layer opacity (0.82–1.0). */
  overprintOpacity: number;
  /** Overprint registration misalignment, x axis, in the two-pass print's own px (−3…+4). */
  registrationX: number;
  /** Overprint registration misalignment, y axis (−3…+4). */
  registrationY: number;
  /** Horizontal mirror: 1 = as-drawn, -1 = flipped. */
  flip: 1 | -1;
  /** Head tilt, degrees (±5°). */
  headTilt: number;
  /** Head vertical offset, px (±6px). */
  headDy: number;
  /** Shoulder-bump width scale (0.88–1.12). */
  shoulderWidth: number;
  /** Torso build — horizontal scale of the torso + shoulders (0.86–1.14). */
  build: number;
  /** Sleeve length — short keeps today's shoulder bump; long extends it into an arm. */
  sleeve: SleeveLength;
  /** Shirt pattern. The club runs both a striped senior kit and a dotted youth kit. */
  pattern: ShirtPattern;
  /** Vertical-band count when `pattern === "bands"` (also selects the stripe set for outline detail). */
  stripeCount: StripeCount;
}

export interface FigureBoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** The full-figure viewBox is `0 0 220 300` — see `_jersey-paths.ts`. */
export const FIGURE_VIEWBOX_WIDTH = 220;
export const FIGURE_VIEWBOX_HEIGHT = 300;

/** Breathing room inside the viewBox the guard keeps clear on every side. */
export const CONTAINMENT_MARGIN = 4;

/** Half the 3px outline stroke, plus a hair of slack — added to every extent. */
const STROKE_ALLOWANCE = 2;

/** The guard's shift-then-shrink loop never needs more than this many passes. */
const MAX_CONTAINMENT_PASSES = 8;

/** Below this, a pass is treated as converged rather than looping again. */
const SNAP_EPSILON = 0.4;

/**
 * djb2 (XOR variant) over the player's full name. Matches the algorithm
 * decided in #2542's addendum — do not switch to the additive djb2 used by
 * `hashMemberId` (a different, unrelated hash with a different purpose:
 * masking ids before they reach analytics, not seeding a PRNG).
 */
export function djb2Seed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

/** A stable xorshift32 stream — the same seed always yields the same draws in the same order. */
function createPrngStream(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4_294_967_296;
  };
}

function span(random: () => number, lo: number, hi: number): number {
  return lo + random() * (hi - lo);
}

/**
 * The seeded levers, before the containment guard runs. Draw order matches
 * the design drill exactly, including the discarded first `scale` draw —
 * changing the order changes which name maps to which look.
 */
export function generateRawPlayerFigureVariant(
  seed: number,
): PlayerFigureVariant {
  const random = createPrngStream(seed);

  // Superseded by the wider `scale` draw at the end of this function — the
  // draw still has to happen so every later lever lands on the same PRNG
  // position the drill measured its verified numbers against.
  void span(random, 0.9, 1.1);
  const offsetX = span(random, -9, 9);
  const offsetY = span(random, -7, 7);
  const rotation = span(random, -0.9, 0.9);
  const underprintOpacity = span(random, 0.74, 1);
  const overprintOpacity = span(random, 0.82, 1);
  const registrationX = span(random, -3, 4);
  const registrationY = span(random, -3, 4);

  const flip: 1 | -1 = random() < 0.5 ? -1 : 1;
  const headTilt = span(random, -5, 5);
  const headDy = span(random, -6, 6);
  const shoulderWidth = span(random, 0.88, 1.12);
  const stripeCount =
    STRIPE_COUNTS[Math.floor(random() * STRIPE_COUNTS.length)]!;

  const sleeve: SleeveLength = random() < 0.45 ? "long" : "short";
  const build = span(random, 0.86, 1.14);
  const lean = span(random, -3, 3);
  const pattern = SHIRT_PATTERNS[Math.floor(random() * SHIRT_PATTERNS.length)]!;
  const drop = span(random, -14, 16);
  const scale = span(random, 0.84, 1.16);

  return {
    scale,
    offsetX,
    offsetY,
    drop,
    rotation,
    lean,
    underprintOpacity,
    overprintOpacity,
    registrationX,
    registrationY,
    flip,
    headTilt,
    headDy,
    shoulderWidth,
    build,
    sleeve,
    pattern,
    stripeCount,
  };
}

interface Matrix2D {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

const multiplyMatrix = (m: Matrix2D, n: Matrix2D): Matrix2D => ({
  a: m.a * n.a + m.c * n.b,
  b: m.b * n.a + m.d * n.b,
  c: m.a * n.c + m.c * n.d,
  d: m.b * n.c + m.d * n.d,
  e: m.a * n.e + m.c * n.f + m.e,
  f: m.b * n.e + m.d * n.f + m.f,
});

const translateMatrix = (x: number, y: number): Matrix2D => ({
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: x,
  f: y,
});

const scaleMatrix = (x: number, y: number): Matrix2D => ({
  a: x,
  b: 0,
  c: 0,
  d: y,
  e: 0,
  f: 0,
});

const rotateMatrix = (deg: number): Matrix2D => {
  const rad = (deg * Math.PI) / 180;
  return {
    a: Math.cos(rad),
    b: Math.sin(rad),
    c: -Math.sin(rad),
    d: Math.cos(rad),
    e: 0,
    f: 0,
  };
};

const skewXMatrix = (deg: number): Matrix2D => ({
  a: 1,
  b: 0,
  c: Math.tan((deg * Math.PI) / 180),
  d: 1,
  e: 0,
  f: 0,
});

const applyMatrix = (m: Matrix2D, x: number, y: number): [number, number] => [
  m.a * x + m.c * y + m.e,
  m.b * x + m.d * y + m.f,
];

/** The base `<g>` transform shared by both print passes — see `JerseyIllustration.tsx`. */
export function buildBaseTransformMatrix(
  variant: PlayerFigureVariant,
): Matrix2D {
  return [
    translateMatrix(
      110 + variant.offsetX,
      150 + variant.offsetY + variant.drop,
    ),
    rotateMatrix(variant.rotation),
    skewXMatrix(variant.lean),
    scaleMatrix(variant.flip * variant.scale, variant.scale),
    translateMatrix(-110, -150),
  ].reduce(multiplyMatrix);
}

/**
 * The figure's axis-aligned bounding box, computed analytically from the
 * composed matrix — no DOM measurement. The widest drawn element is the
 * torso (half-width 80) or the shoulder bumps (half-width 60), each carried
 * through `build` and `shoulderWidth`; the head (half-width 44, `rx`) is
 * never the widest. The head top is `cy + headDy - ry`.
 */
export function computeFigureBoundingBox(
  variant: PlayerFigureVariant,
): FigureBoundingBox {
  const base = buildBaseTransformMatrix(variant);
  const halfWidth =
    Math.max(
      80 * variant.build,
      60 * variant.build * variant.shoulderWidth,
      JERSEY_HEAD_ELLIPSE.rx,
    ) + STROKE_ALLOWANCE;
  const top =
    JERSEY_HEAD_ELLIPSE.cy +
    variant.headDy -
    JERSEY_HEAD_ELLIPSE.ry -
    STROKE_ALLOWANCE;
  const bottom = FIGURE_VIEWBOX_HEIGHT + STROKE_ALLOWANCE;

  const corners: [number, number][] = [
    [110 - halfWidth, top],
    [110 + halfWidth, top],
    [110 - halfWidth, bottom],
    [110 + halfWidth, bottom],
  ].map(([x, y]) => applyMatrix(base, x, y));

  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/**
 * The top/side guard (#2542's addendum): shift before shrinking, at most 8
 * passes. Shrinks to fit only when the box is wider than the viewBox less
 * the margin; otherwise shifts horizontally so no shoulder crosses the
 * margin, and shifts down so the head top clears it. The bottom is
 * deliberately left free — a torso running past it is the crop lever
 * working, not a fault.
 */
export function applyContainmentGuard(
  variant: PlayerFigureVariant,
): PlayerFigureVariant {
  let working = variant;
  const maxWidth = FIGURE_VIEWBOX_WIDTH - 2 * CONTAINMENT_MARGIN;

  for (let pass = 0; pass < MAX_CONTAINMENT_PASSES; pass++) {
    const box = computeFigureBoundingBox(working);
    const width = box.maxX - box.minX;

    if (width > maxWidth + 0.5) {
      working = { ...working, scale: working.scale * (maxWidth / width) };
      continue;
    }

    let dx = 0;
    if (box.minX < CONTAINMENT_MARGIN) {
      dx = CONTAINMENT_MARGIN - box.minX;
    } else if (box.maxX > FIGURE_VIEWBOX_WIDTH - CONTAINMENT_MARGIN) {
      dx = FIGURE_VIEWBOX_WIDTH - CONTAINMENT_MARGIN - box.maxX;
    }
    const dy =
      box.minY < CONTAINMENT_MARGIN ? CONTAINMENT_MARGIN - box.minY : 0;

    if (Math.abs(dx) < SNAP_EPSILON && dy < SNAP_EPSILON) break;

    working = {
      ...working,
      offsetX: working.offsetX + dx,
      drop: working.drop + dy,
    };
  }

  return working;
}

/**
 * The bottom clamp (#2590's correction): after the guard above settles, if
 * the torso stops short of the viewBox bottom, shift down to meet it.
 * Shifting down can never push the head back out of frame, so this never
 * re-triggers the top guard — it runs once, un-looped. A torso already
 * bleeding past the bottom is left untouched.
 */
export function applyBottomClamp(
  variant: PlayerFigureVariant,
): PlayerFigureVariant {
  const box = computeFigureBoundingBox(variant);
  if (box.maxY < FIGURE_VIEWBOX_HEIGHT) {
    return {
      ...variant,
      drop: variant.drop + (FIGURE_VIEWBOX_HEIGHT - box.maxY),
    };
  }
  return variant;
}

/**
 * The full pipeline: seed the player's full name, draw the levers, then
 * guard and clamp. This is what `<JerseyIllustration>` calls — it never
 * needs the intermediate steps.
 */
export function computePlayerFigureVariant(
  fullName: string,
): PlayerFigureVariant {
  const raw = generateRawPlayerFigureVariant(djb2Seed(fullName));
  return applyBottomClamp(applyContainmentGuard(raw));
}
