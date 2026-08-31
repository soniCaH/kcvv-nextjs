/**
 * <JerseyIllustration> — the no-photo player illustration fallback (UI primitive).
 *
 * Two-pass print figure (jersey-deep underprint + ink overprint outline) drawn
 * from the canonical `_jersey-paths` geometry — head ellipse + torso
 * fill/outline + both shoulder bumps + V-collar + 4 vertical stripes, in the
 * viewBox `0 0 220 300`. Extracted (#2118) from the byte-identical inline
 * renderers that lived in `<PlayerHero>` (`HeroIllustration`) and
 * `team/SquadGrid/<PlayerCard>` (`CardIllustration`); zero domain knowledge, so
 * it lives in the neutral design-system rather than under either domain.
 *
 * **#2635 — per-player variance.** `seed` (the player's full name) is hashed
 * (djb2) into a deterministic `PlayerFigureVariant`
 * (`player-figure-variant.ts`) — registration offset, underprint/overprint
 * opacity, scale, crop, paper rotation, mirror, head tilt/height, shoulder
 * width, torso build, posture lean, sleeve length, shirt pattern. The same
 * name always draws the same figure (server and client agree; no
 * `Math.random`). A containment guard + bottom clamp run before the SVG
 * transforms are built, so the figure never clips at the top and never stops
 * short at the bottom, whatever the draw. `seed` is required — a
 * personalised figure needs an identity to seed from; a caller with none
 * (there are none left in production — see `<JerseyShirt>`, pinned to the
 * base geometry instead) should reach for a different primitive rather than
 * pass a constant string.
 *
 * Not to be confused with `<JerseyShirt>`: that is a torso-only crop with the
 * inverted palette (ink fill / jersey-deep outline), explicitly pinned to
 * `_jersey-paths.ts`'s base geometry — left untouched by this variant system.
 *
 * Path provenance: `_jersey-paths.ts` (shared with `<JerseyShirt>`).
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import {
  JERSEY_FIGURE_VIEWBOX,
  JERSEY_HEAD_ELLIPSE,
  JERSEY_SHOULDER_BUMP_LEFT_PATH,
  JERSEY_SHOULDER_BUMP_RIGHT_PATH,
  JERSEY_SLEEVE_LEFT_PATH,
  JERSEY_SLEEVE_RIGHT_PATH,
  JERSEY_TORSO_FILL_PATH,
  JERSEY_TORSO_OUTLINE_PATH,
  JERSEY_V_COLLAR_PATH,
} from "../_jersey-paths";
import { ShirtPatternMarks } from "./jersey-shirt-pattern";
import { computePlayerFigureVariant } from "./player-figure-variant";

const STRIPE_STROKE_WIDTH = 2;
const OUTLINE_STROKE_WIDTH = 3;

export interface JerseyIllustrationProps {
  /**
   * Consumer context — selects the outer positioning only (the registration
   * offset is now per-player, via `seed`). `"hero"` for the `<PlayerHero>`
   * figure (relative, fills its parent); `"card"` for the squad-grid
   * `<PlayerCard>` figure (absolute inset-0).
   */
  variant: "hero" | "card";
  /**
   * Deterministic seed input — the player's full name (e.g.
   * `${firstName} ${lastName}`). Hashed (djb2) into the figure's variant, so
   * the same player draws the same figure on every render, every season,
   * and server and client agree.
   */
  seed: string;
  /** Extra classes merged onto the outer wrapper, after the variant classes. */
  className?: string;
  /** Forwarded test id. Defaults to `"jersey-illustration"`. */
  "data-testid"?: string;
}

export function JerseyIllustration({
  variant,
  seed,
  className,
  "data-testid": dataTestId = "jersey-illustration",
}: JerseyIllustrationProps) {
  const positioning =
    variant === "hero" ? "relative h-full w-full" : "absolute inset-0";

  const figure = useMemo(() => computePlayerFigureVariant(seed), [seed]);

  const baseTransform = `translate(${110 + figure.offsetX} ${150 + figure.offsetY + figure.drop}) rotate(${figure.rotation}) skewX(${figure.lean}) scale(${figure.flip * figure.scale} ${figure.scale}) translate(-110 -150)`;
  const headTransform = `translate(${JERSEY_HEAD_ELLIPSE.cx} ${JERSEY_HEAD_ELLIPSE.cy + figure.headDy}) rotate(${figure.headTilt}) translate(${-JERSEY_HEAD_ELLIPSE.cx} ${-JERSEY_HEAD_ELLIPSE.cy})`;
  const shoulderTransform = `translate(110 182) scale(${figure.shoulderWidth} 1) translate(-110 -182)`;
  const bodyTransform = `translate(110 220) scale(${figure.build} 1) translate(-110 -220)`;

  const armLeftPath =
    figure.sleeve === "long"
      ? JERSEY_SLEEVE_LEFT_PATH
      : JERSEY_SHOULDER_BUMP_LEFT_PATH;
  const armRightPath =
    figure.sleeve === "long"
      ? JERSEY_SLEEVE_RIGHT_PATH
      : JERSEY_SHOULDER_BUMP_RIGHT_PATH;

  return (
    <div
      data-testid={dataTestId}
      aria-hidden="true"
      className={cn("bg-cream-soft", positioning, className)}
    >
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ opacity: figure.underprintOpacity }}
      >
        <svg
          viewBox={JERSEY_FIGURE_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          <g transform={baseTransform} fill="var(--color-jersey-deep)">
            <g transform={headTransform}>
              <ellipse
                cx={JERSEY_HEAD_ELLIPSE.cx}
                cy={JERSEY_HEAD_ELLIPSE.cy}
                rx={JERSEY_HEAD_ELLIPSE.rx}
                ry={JERSEY_HEAD_ELLIPSE.ry}
              />
            </g>
            <g transform={bodyTransform}>
              <path d={JERSEY_TORSO_FILL_PATH} />
              <g transform={shoulderTransform}>
                <path d={armLeftPath} />
                <path d={armRightPath} />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${figure.registrationX}px, ${figure.registrationY}px)`,
          opacity: figure.overprintOpacity,
        }}
      >
        <svg
          viewBox={JERSEY_FIGURE_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          <g transform={baseTransform}>
            <g
              transform={headTransform}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={OUTLINE_STROKE_WIDTH}
              strokeLinejoin="miter"
              strokeLinecap="square"
            >
              <ellipse
                cx={JERSEY_HEAD_ELLIPSE.cx}
                cy={JERSEY_HEAD_ELLIPSE.cy}
                rx={JERSEY_HEAD_ELLIPSE.rx}
                ry={JERSEY_HEAD_ELLIPSE.ry}
              />
            </g>
            <g
              transform={bodyTransform}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={OUTLINE_STROKE_WIDTH}
              strokeLinejoin="miter"
              strokeLinecap="square"
            >
              <path d={JERSEY_TORSO_OUTLINE_PATH} />
              <g transform={shoulderTransform}>
                <path d={armLeftPath} />
                <path d={armRightPath} />
              </g>
              <path
                d={JERSEY_V_COLLAR_PATH}
                strokeWidth={STRIPE_STROKE_WIDTH}
              />
              <ShirtPatternMarks
                pattern={figure.pattern}
                stripeCount={figure.stripeCount}
                strokeWidth={STRIPE_STROKE_WIDTH}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
