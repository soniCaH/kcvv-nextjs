/**
 * Shirt-pattern ink marks for `<JerseyIllustration>`'s overprint pass —
 * vertical bands (the club's striped senior kit), hoops, dots (the club's
 * dotted youth kit), or plain (no marks). Not invented garments: the club
 * really does run both kits (#2635).
 *
 * Geometry ported from the design drill that decided the vocabulary:
 * `docs/design/mockups/2590-non-cutout-photos/2590-1-niet-uitgeknipt.html`.
 * Bands reuse the shared `_jersey-paths.ts` stripe sets; hoops and dots are
 * generated from fixed grid constants (deterministic, no per-instance
 * randomness lives here — the variant module already resolved which
 * pattern and stripe count to draw).
 */
import { JERSEY_STRIPE_PATHS_BY_COUNT } from "../_jersey-paths";
import type { ShirtPattern, StripeCount } from "./player-figure-variant";

const HOOP_ROW_Y_POSITIONS = [186, 212, 238, 264, 290] as const;
const HOOP_TAPER_PER_ROW = 0.14;
const HOOP_LEFT_X = 44;
const HOOP_RIGHT_X = 176;

const DOT_GRID = {
  startY: 180,
  endY: 300,
  stepY: 22,
  startX: 56,
  endX: 186,
  stepX: 22,
  radius: 2.4,
} as const;

function buildDotPositions(): { cx: number; cy: number }[] {
  const dots: { cx: number; cy: number }[] = [];
  for (let y = DOT_GRID.startY; y < DOT_GRID.endY; y += DOT_GRID.stepY) {
    const rowOffset = ((y / DOT_GRID.stepY) % 2) * (DOT_GRID.stepX / 2);
    for (let x = DOT_GRID.startX; x < DOT_GRID.endX; x += DOT_GRID.stepX) {
      dots.push({ cx: x + rowOffset, cy: y });
    }
  }
  return dots;
}

export interface ShirtPatternMarksProps {
  pattern: ShirtPattern;
  stripeCount: StripeCount;
  strokeWidth: number;
}

export function ShirtPatternMarks({
  pattern,
  stripeCount,
  strokeWidth,
}: ShirtPatternMarksProps) {
  if (pattern === "plain") return null;

  if (pattern === "bands") {
    return (
      <>
        {JERSEY_STRIPE_PATHS_BY_COUNT[stripeCount].map((d) => (
          <path key={d} d={d} strokeWidth={strokeWidth} />
        ))}
      </>
    );
  }

  if (pattern === "hoops") {
    return (
      <>
        {HOOP_ROW_Y_POSITIONS.map((y) => {
          const taper = (y - HOOP_ROW_Y_POSITIONS[0]) * HOOP_TAPER_PER_ROW;
          return (
            <path
              key={y}
              d={`M ${HOOP_LEFT_X + taper} ${y} L ${HOOP_RIGHT_X - taper} ${y}`}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </>
    );
  }

  // dots
  return (
    <>
      {buildDotPositions().map(({ cx, cy }) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={DOT_GRID.radius}
          fill="var(--color-ink)"
          stroke="none"
        />
      ))}
    </>
  );
}
