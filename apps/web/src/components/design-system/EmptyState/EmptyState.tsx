/**
 * <EmptyState> — shared "nothing to show" primitive, two tiers (#2427 / #2562).
 *
 * A surface with nothing to show says so in exactly two registers, chosen by
 * how much of the page is missing:
 *
 * - **Tier "surface"** — the whole surface is empty (`/sponsors`, `/galerij`,
 *   `/zoeken`, a filtered `/nieuws`). The `SearchNoResultsCard` register: a
 *   cream-soft paper card, a taped artefact (a defaulting slot — pass nothing
 *   and it ships the jersey), a display heading, a body line, and — only when
 *   `reason: "filtered"` — the mandatory undo (#2427 rule 4). That case is
 *   structural, not conventional: `undo` is a required field on that variant,
 *   the same way tier "slot" has no `heading`/`artefact` prop at all rather
 *   than trusting every host to remember one.
 * - **Tier "slot"** — one slot is empty inside an otherwise full page (a
 *   `MatchLineup` team column, a `MatchEvents` team list). A dashed
 *   `ink-muted` box that holds the slot's shape so the absence reads as a
 *   known gap rather than a render failure. No heading, no action, ever —
 *   the type system has no `heading`/`artefact`/`undo` prop on this tier.
 *   `flex-1` by default so it fills a `flex flex-col` host column's
 *   grid-stretched height instead of collapsing to one line — the host still
 *   owns making that column `flex flex-col` in the first place; the
 *   primitive cannot reach outside itself to do that part.
 *
 * **The copy is the tell.** Both tiers share one visual register; only the
 * words distinguish genuine emptiness ("Nog geen …") from a filter that
 * emptied the surface ("Geen … in <facet>.", with the undo) from a fruitless
 * query (naming what was searched for). See the resolution comment on #2427
 * for the five copy rules this primitive exists to carry.
 *
 * The artefact is never `<TapedCard>` — that primitive has no frameless
 * (`shadow: "none"`) or transparent-`bg` option today, and this slot needs
 * both (a bare `<JerseyShirt>` beside a hand-placed `<TapeStrip>`, not a
 * second nested card). Add those options to `<TapedCard>` before reaching
 * for a third way to tape something.
 *
 * Sits beside `<ErrorState>` — same job at a different severity, same
 * folder. `EmptyStateAction` shares its base shape with `ErrorStateAction`
 * via `_internal/stateAction.ts`; see that file for why the two components'
 * action *rows* stay separate rather than one shared render component.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "../Button";
import {
  EditorialHeading,
  type EditorialHeadingLevel,
} from "../EditorialHeading";
import { JerseyShirt } from "../JerseyShirt";
import { MonoLabel } from "../MonoLabel";
import { TapeStrip } from "../TapeStrip";
import type { StateActionBase } from "../_internal/stateAction";

/** An undo action — always a button (a filter reset never navigates). */
export interface EmptyStateAction extends StateActionBase {
  onClick: () => void;
}

/**
 * Chrome the tier-"surface" card draws around itself.
 *
 * - `"paper"` (default) — the full paper frame: border, hard shadow,
 *   cream-soft fill. The standalone register (`/sponsors`, `/galerij`, …).
 * - `"bare"` — no frame at all, for a host that already sits inside another
 *   bordered/shadowed panel (`CalendarWidget`'s own shell, the
 *   `ScheurkalenderPage` poster sheet). Framing twice nests two ink borders
 *   with a shadow between them.
 * - `"inverse"` — the paper frame with the muted-ink "soft" shadow instead
 *   of the hard one, for a host on an ink or dark-green ground (`/evenementen`
 *   on `bg-jersey-deep-dark`). The hard shadow is drawn in solid ink and the
 *   dark field swallows it — DESIGN.md's rule that chrome on a dark ground
 *   takes the soft shadow, not the hard paper one.
 */
export type EmptyStateSurface = "paper" | "bare" | "inverse";

const SURFACE_CLASS: Record<EmptyStateSurface, string> = {
  paper: "border-ink bg-cream-soft shadow-paper-sm border-2 p-7 sm:p-8",
  bare: "py-2",
  inverse: "border-ink bg-cream-soft shadow-paper-sm-soft border-2 p-7 sm:p-8",
};

interface EmptyStateSharedProps {
  /** Renders `role="status"` so assistive tech announces a client-side
   *  change (a filter emptying the surface, or a slot going empty after
   *  load). Omit for an empty state already present on first render. */
  live?: boolean;
  className?: string;
}

interface EmptyStateSurfaceCommonProps extends EmptyStateSharedProps {
  tier: "surface";
  /** Heading. Auto-terminated with a period by `<EditorialHeading>`, and
   *  accented on the trailing period — the `SponsorEmptyState` /
   *  `SearchNoResultsCard` convention. */
  heading: string;
  /** Rendered heading tag, for a page that already has an adjacent `<h2>`
   *  this heading would otherwise collide with. Default `"h2"`, matching
   *  `<SectionHeader>`'s own `as` prop. */
  as?: "h1" | "h2" | "h3";
  /** Body copy. May embed inline `<Link>`s directly (the way-forward idiom
   *  used by `SearchNoResultsCard` and `HulpFinder`). */
  children: ReactNode;
  /**
   * The taped artefact. A **defaulting slot**, not a hardcoded image —
   * omit it and the primitive ships a taped `<JerseyShirt>`. A surface with
   * its own obvious mark (a crest, a ball) can pass one without touching
   * this component.
   */
  artefact?: ReactNode;
  surface?: EmptyStateSurface;
}

/** Genuine emptiness or a fruitless query — nothing to undo. */
export interface EmptyStateSurfacePendingProps extends EmptyStateSurfaceCommonProps {
  reason?: undefined;
}

/** A filter emptied the surface — the undo is mandatory, structurally: this
 *  variant does not compile without one. "Right where the results would
 *  have been" (#2427 rule 4). */
export interface EmptyStateSurfaceFilteredProps extends EmptyStateSurfaceCommonProps {
  reason: "filtered";
  undo: EmptyStateAction;
}

export type EmptyStateSurfaceProps =
  EmptyStateSurfacePendingProps | EmptyStateSurfaceFilteredProps;

export interface EmptyStateSlotProps extends EmptyStateSharedProps {
  tier: "slot";
  /** The held-open label — short, mono, uppercase. No heading, no action. */
  children: ReactNode;
}

export type EmptyStateProps = EmptyStateSurfaceProps | EmptyStateSlotProps;

function headingLevelFor(
  as: EmptyStateSurfaceProps["as"],
): EditorialHeadingLevel {
  switch (as) {
    case "h1":
      return 1;
    case "h3":
      return 3;
    case "h2":
    case undefined:
      return 2;
    default: {
      // Exhaustiveness check, mirroring <SectionHeader>'s headingLevelFor.
      const _exhaustive: never = as;
      throw new Error(`headingLevelFor: unhandled value ${_exhaustive}`);
    }
  }
}

function SlotEmptyState({ children, live, className }: EmptyStateSlotProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className={cn(
        "border-ink-muted flex flex-1 items-center justify-center border-2 border-dashed px-3 py-3 text-center",
        className,
      )}
    >
      <MonoLabel tone="muted">{children}</MonoLabel>
    </div>
  );
}

function SurfaceEmptyState(props: EmptyStateSurfaceProps) {
  const {
    heading,
    as,
    children,
    artefact,
    surface = "paper",
    live,
    className,
  } = props;

  return (
    <section
      role={live ? "status" : undefined}
      className={cn(
        SURFACE_CLASS[surface],
        "text-center sm:text-left",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-7">
        {/* Taped artefact — a defaulting slot, not a hardcoded image. Ordered
            AFTER the text on mobile (rule 4: the undo belongs "right where
            the results would have been" — a decorative artefact pushed below
            the fold costs nothing; the heading/body/action row pushed below
            it does). Row order on `sm+` is unaffected. */}
        <div className="relative order-2 inline-block flex-shrink-0 sm:order-1">
          <TapeStrip color="warm" length="md" />
          {artefact ?? (
            <JerseyShirt className="h-20 w-20 -rotate-3 sm:h-28 sm:w-28" />
          )}
        </div>

        <div className="order-1 sm:order-2">
          <EditorialHeading
            level={headingLevelFor(as)}
            size="display-md"
            emphasis={{ text: "." }}
          >
            {heading}
          </EditorialHeading>

          <div className="text-ink-soft mt-3 max-w-[52ch] text-[14.5px] leading-relaxed">
            {children}
          </div>

          {props.reason === "filtered" && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={props.undo.onClick}
                data-empty-state-undo="undo"
              >
                {props.undo.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function EmptyState(props: EmptyStateProps) {
  if (props.tier === "slot") return <SlotEmptyState {...props} />;
  return <SurfaceEmptyState {...props} />;
}
