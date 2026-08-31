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
 * **#2635 — per-player variance.** `seed` (a stable per-player identity —
 * see `playerFigureSeed`, never a display name) is hashed (djb2) into a
 * deterministic `PlayerFigureVariant` (`player-figure-variant.ts`) —
 * registration offset, underprint/overprint opacity, scale, crop, paper
 * rotation, mirror, head tilt/height, shoulder width, torso build, posture
 * lean, sleeve length, shirt pattern. The same seed always draws the same
 * figure (server and client agree; no `Math.random`). A containment guard +
 * bottom clamp run before the SVG transforms are built, bounding the union
 * of both print passes (registration included), so the figure never clips
 * at the top and never stops short at the bottom, whatever the draw. `seed`
 * is required — a personalised figure needs an identity to seed from; a
 * caller with none (there are none left in production — see
 * `<JerseyShirt>`, pinned to the base geometry instead) should reach for a
 * different primitive rather than pass a constant string.
 *
 * The base transform (translate/rotate/skewX/scale) is rendered as the
 * literal matrix `buildBaseTransformMatrix` computes — not re-encoded as a
 * template string — so the geometry the guard bounds and the geometry that
 * ships can never drift apart. The registration offset is a second,
 * separate `<g transform="translate(…)">` in the SAME viewBox units as
 * everything else (not a CSS pixel offset): it needs to scale with the
 * figure exactly like every other lever, and the guard's bounding box
 * needs to see it to bound what actually ships.
 *
 * Not to be confused with `<JerseyShirt>`: that is a torso-only crop with the
 * inverted palette (ink fill / jersey-deep outline), explicitly pinned to
 * `_jersey-paths.ts`'s base geometry — left untouched by this variant system.
 *
 * Path provenance: `_jersey-paths.ts` (shared with `<JerseyShirt>`);
 * `jersey-illustration-geometry.ts` (this component's variant-only additions).
 */
import { cn } from "@/lib/utils/cn";
import {
  JERSEY_FIGURE_VIEWBOX,
  JERSEY_HEAD_ELLIPSE,
  JERSEY_OUTLINE_STROKE_WIDTH,
  JERSEY_SHOULDER_BUMP_LEFT_PATH,
  JERSEY_SHOULDER_BUMP_RIGHT_PATH,
  JERSEY_TORSO_FILL_PATH,
  JERSEY_TORSO_OUTLINE_PATH,
  JERSEY_V_COLLAR_PATH,
} from "../_jersey-paths";
import {
  JERSEY_SLEEVE_LEFT_PATH,
  JERSEY_SLEEVE_RIGHT_PATH,
} from "./jersey-illustration-geometry";
import { ShirtPatternMarks } from "./jersey-shirt-pattern";
import {
  buildBaseTransformMatrix,
  computePlayerFigureVariant,
} from "./player-figure-variant";

const STRIPE_STROKE_WIDTH = 2;

// The viewBox is 220×300 units rendered into a 140–390px card/hero — 2dp on
// a geometry value is ~0.006px of movement, and coarser than that is real
// compression savings (raw floats are incompressible entropy; brotli takes
// a real squad's markup down ~51% at 2dp). Opacity stays at 3dp: 2dp would
// be coarser than the 1/255 alpha step a browser can even show.
const fx = (n: number) => n.toFixed(2);
const fo = (n: number) => n.toFixed(3);

export interface JerseyIllustrationProps {
  /**
   * Consumer context — selects the outer positioning only (the registration
   * offset is now per-player, via `seed`). `"hero"` for the `<PlayerHero>`
   * figure (relative, fills its parent); `"card"` for the squad-grid
   * `<PlayerCard>` figure (absolute inset-0).
   */
  variant: "hero" | "card";
  /**
   * Deterministic seed input — a stable per-player identity (build one via
   * `playerFigureSeed`; never a display name). Hashed (djb2) into the
   * figure's variant, so the same player draws the same figure on every
   * render, every season, and server and client agree.
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

  // A Server Component (no "use client" in this file or either consumer) —
  // React's Flight dispatcher runs `useMemo` as `(create) => create()`, no
  // cache, so memoising here bought nothing but a hook dependency on an
  // otherwise hook-free primitive. Plain computation instead.
  const figure = computePlayerFigureVariant(seed);
  const baseTransformMatrix = buildBaseTransformMatrix(figure);
  const baseTransform = `matrix(${fx(baseTransformMatrix.a)} ${fx(baseTransformMatrix.b)} ${fx(baseTransformMatrix.c)} ${fx(baseTransformMatrix.d)} ${fx(baseTransformMatrix.e)} ${fx(baseTransformMatrix.f)})`;
  const registrationTransform = `translate(${fx(figure.registrationX)} ${fx(figure.registrationY)})`;
  const headTransform = `translate(${fx(JERSEY_HEAD_ELLIPSE.cx)} ${fx(JERSEY_HEAD_ELLIPSE.cy + figure.headDy)}) rotate(${fx(figure.headTilt)}) translate(${fx(-JERSEY_HEAD_ELLIPSE.cx)} ${fx(-JERSEY_HEAD_ELLIPSE.cy)})`;
  const shoulderTransform = `translate(110 182) scale(${fx(figure.shoulderWidth)} 1) translate(-110 -182)`;
  const bodyTransform = `translate(110 220) scale(${fx(figure.build)} 1) translate(-110 -220)`;

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
        style={{ opacity: fo(figure.underprintOpacity) }}
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
        style={{ opacity: fo(figure.overprintOpacity) }}
      >
        <svg
          viewBox={JERSEY_FIGURE_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          {/* Registration offset: a second transform in the SAME viewBox
              units as `baseTransform`, applied after it — the two-pass
              print's intentional misalignment, not a CSS pixel nudge. */}
          <g transform={registrationTransform}>
            <g
              transform={baseTransform}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={JERSEY_OUTLINE_STROKE_WIDTH}
              strokeLinejoin="miter"
              strokeLinecap="square"
            >
              <g transform={headTransform}>
                <ellipse
                  cx={JERSEY_HEAD_ELLIPSE.cx}
                  cy={JERSEY_HEAD_ELLIPSE.cy}
                  rx={JERSEY_HEAD_ELLIPSE.rx}
                  ry={JERSEY_HEAD_ELLIPSE.ry}
                />
              </g>
              <g transform={bodyTransform}>
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
          </g>
        </svg>
      </div>
    </div>
  );
}
