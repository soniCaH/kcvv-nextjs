/**
 * <JerseyShirt> — decorative jersey illustration (Tier C primitive).
 *
 * Two-pass print vocabulary identical to `<JerseyIllustration>`'s
 * illustration fallback, palette inverted: ink underprint + jersey-deep
 * overprint (collar, four vertical stripes, body outline). The 2-3px
 * registration offset is achieved by giving the underprint and overprint
 * layers different `inset` values, with the underprint multiplied onto the
 * overprint.
 *
 * **#2635 cohesion-contract decision: pinned to the base variant,
 * deliberately.** `<JerseyIllustration>` now draws a deterministic
 * per-player figure seeded from a stable player id (#2635, see
 * `playerFigureSeed`); `<JerseyShirt>` does not adopt that system and keeps
 * reading `_jersey-paths.ts` directly, unparameterised. Its callers
 * (`ClubshopBanner`, `TeamHero`, `TeamFlagship`, `TeamEnrolmentCta`,
 * `YouthDirectory`, `EmptyState`, `ErrorState`) are team- or club-level
 * chrome, never a single player, so there is no player identity to seed
 * from — pinning is the only deliberate choice available, not a default
 * left unmade.
 *
 * Spec: `docs/design/mockups/phase-3-a-tier-c-figures/jerseyshirt-locked.md`.
 * Path provenance: `_jersey-paths.ts` (shared with `<JerseyIllustration>`).
 */
import {
  JERSEY_OUTLINE_STROKE_WIDTH,
  JERSEY_TORSO_FILL_PATH,
  JERSEY_TORSO_OUTLINE_PATH,
  JERSEY_TORSO_VIEWBOX,
  JERSEY_V_COLLAR_PATH,
  JERSEY_VERTICAL_STRIPE_PATHS,
} from "../_jersey-paths";

export interface JerseyShirtProps {
  /** Optional editor-supplied chest letter overlay (e.g. "U11", "A"). */
  letterOverlay?: string;
  /**
   * Tailwind classes merged into the outer `<figure>` via a plain string
   * concat, NOT `cn()` — so a same-property override against the baked-in
   * `h-60 w-60 mx-auto` (`h-*`, `w-*`, `mx-*`) does **not** reliably win.
   * Same-property Tailwind utilities resolve by the order they're emitted
   * in the generated stylesheet, not by which class comes later in this
   * string, and the default wins regardless. Five call sites relied on
   * this working and silently render at 240px today (`ClubshopBanner`
   * additionally stays centred despite passing `mx-0`) — see #2777.
   *
   * The one override that *does* work: a **different** CSS property, e.g.
   * `max-h-*`/`max-w-*` against the baked-in `h-*`/`w-*`, which composes
   * instead of conflicting (`getCardSubjectArtefact`,
   * `apps/web/src/lib/utils/card-subject-artefact.tsx`, is the one caller
   * doing this correctly). Do not add a new same-property override here;
   * fix #2777 instead.
   */
  className?: string;
}

const STRIPE_STROKE_WIDTH = 2;

// Cream letter on ink stroke shim — replicates the printed-on-felt feel of
// the locked mockup. Tailwind v4 doesn't expose a token for this exact
// shadow stack, so spell it out inline rather than introduce a one-off util.
const LETTER_TEXT_SHADOW =
  "2px 2px 0 var(--color-ink), -1px -1px 0 var(--color-ink), 1px -1px 0 var(--color-ink), -1px 1px 0 var(--color-ink)";

export function JerseyShirt({ letterOverlay, className }: JerseyShirtProps) {
  // The figure's default dimensions live in this base string. A
  // same-property override in `className` (`h-*`, `w-*`, `mx-*`) does NOT
  // reliably win here — see the `className` prop docblock above and #2777.
  // Left as a plain concat rather than fixed to `cn()` in this branch: the
  // fix moves real pixels at five call sites across the site and belongs
  // in its own PR (#2777), not folded into an unrelated feature branch.
  const figureClass = `relative mx-auto my-0 h-60 w-60${className ? ` ${className}` : ""}`;
  return (
    <figure aria-hidden="true" className={figureClass}>
      <div
        aria-hidden="true"
        className="absolute top-3 right-[22px] bottom-1 left-3 opacity-95 mix-blend-multiply"
      >
        <svg
          viewBox={JERSEY_TORSO_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          <path d={JERSEY_TORSO_FILL_PATH} fill="var(--color-ink)" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-[14px] right-[18px] bottom-[6px] left-4"
      >
        <svg
          viewBox={JERSEY_TORSO_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="block h-full w-full"
        >
          <g
            fill="none"
            stroke="var(--color-jersey-deep)"
            strokeWidth={JERSEY_OUTLINE_STROKE_WIDTH}
            strokeLinejoin="miter"
            strokeLinecap="square"
          >
            <path d={JERSEY_TORSO_OUTLINE_PATH} />
            <path d={JERSEY_V_COLLAR_PATH} />
            {JERSEY_VERTICAL_STRIPE_PATHS.map((d) => (
              <path key={d} d={d} strokeWidth={STRIPE_STROKE_WIDTH} />
            ))}
          </g>
        </svg>
      </div>
      {letterOverlay !== undefined && letterOverlay !== "" ? (
        <span
          aria-hidden="true"
          className="text-cream pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[56px] leading-none font-black"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: LETTER_TEXT_SHADOW,
          }}
        >
          {letterOverlay}
        </span>
      ) : null}
    </figure>
  );
}
