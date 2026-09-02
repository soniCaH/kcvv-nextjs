/**
 * <EmptyState> — shared "nothing to show" primitive, two tiers (#2427 / #2562).
 *
 * A surface with nothing to show says so in exactly two registers, chosen by
 * how much of the page is missing:
 *
 * - **Tier "surface"** — the whole surface is empty (`/sponsors`, `/galerij`,
 *   `/zoeken`, a filtered `/nieuws`). The `SearchNoResultsCard` register: a
 *   cream-soft paper card taped at its top border, an artefact (a defaulting
 *   slot — pass nothing and it ships the jersey), a display heading, a body line, and — only when
 *   `reason: "filtered"` — the mandatory undo (#2427 rule 4). That case is
 *   structural, not conventional: `undo` is a required field on that variant,
 *   the same way tier "slot" has no `heading`/`artefact` prop at all rather
 *   than trusting every host to remember one. `undo.analyticsSource`/
 *   `analyticsFacet` are required alongside `label`/`onClick`, rendered as
 *   inert `data-*` attributes a single global click listener reads — see
 *   `EmptyStateAction` below for why the analytics fields live there.
 * - **Tier "slot"** — one slot is empty inside an otherwise full page (a
 *   `MatchLineup` team column, a `MatchEvents` team list). A dashed box that
 *   holds the slot's shape so the absence reads as a known gap rather than a
 *   render failure — `border-ink-muted` by default (`background:
 *   "transparent"`), or `border-ink` on a `cream-soft` fill
 *   (`background: "cream-soft"`) for a slot standing alone on the page
 *   rather than inside an already-framed surface (`<CompetitiveStatusLine>`,
 *   #2636). No heading, no action, ever — the type system has no
 *   `heading`/`artefact`/`undo` prop on this tier. `flex-1` by default so it
 *   fills a `flex flex-col` host column's grid-stretched height instead of
 *   collapsing to one line — the host still owns making that column `flex
 *   flex-col` in the first place; the primitive cannot reach outside itself
 *   to do that part.
 *
 *   `variant: "notice"` (#2469/#2576) swaps that held-open register for a
 *   **failure notice**: a sentence in the section's own body copy instead of
 *   a short mono label, still tier "slot" — "not a new primitive… it is
 *   #2427's Tier 2 carrying different copy" (#2469 resolution rule 5). Frame
 *   is fixed at `border-2 border-dashed border-ink/30` (rule 6 — the
 *   already-precedented dashed value on cream, `tegenstander/[clubId]/
 *   loading.tsx:65`), text `text-ink-soft text-body-md` matching
 *   `<ErrorState>`'s own body line. The `background` prop only applies to
 *   the held-open register — a notice's frame is not configurable, since
 *   only the cream case is in scope here; a dark-ground register is #2690's
 *   job. `emphasis` accents the failure itself, not the subject (rule 3) —
 *   see below.
 *
 * **The copy is the tell.** Both tiers share one visual register; only the
 * words distinguish genuine emptiness ("Nog geen …") from a filter that
 * emptied the surface ("Geen … in <facet>.", with the undo) from a fruitless
 * query (naming what was searched for) from a failure notice (tier "slot",
 * `variant: "notice"`). See the resolution comment on #2427 for the five
 * copy rules this primitive exists to carry, and #2469's resolution for the
 * failure-notice rules specifically.
 *
 * The artefact is never `<TapedCard>` — that primitive has no frameless
 * (`shadow: "none"`) or transparent-`bg` option today, and this slot needs
 * both (a bare `<JerseyShirt>`, not a second nested card). Add those options
 * to `<TapedCard>` before reaching for a third way to frame an artefact.
 *
 * The tier-"surface" frame itself is `<TapedCard>` open-coded, for one
 * reason: `<TapedCard>` forwards `data-*` but not `role`, and `live` here
 * needs `role="status"`. It still anchors its tape the way `<TapedCard>`
 * does — one strip, direct child of the frame, on the frame's own border.
 *
 * Sits beside `<ErrorState>` — same job at a different severity, same
 * folder. `EmptyStateAction` shares its base shape with `ErrorStateAction`
 * via `_internal/stateAction.ts`; see that file for why the two components'
 * action *rows* stay separate rather than one shared render component.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type { EmptyStateUndoSource } from "@/lib/analytics/empty-state-undo-attrs";
import { Button } from "../Button";
import {
  EditorialHeading,
  type EditorialHeadingLevel,
} from "../EditorialHeading";
import { JerseyShirt } from "../JerseyShirt";
import { MonoLabel } from "../MonoLabel";
import { TapeStrip } from "../TapeStrip";
import type { StateActionBase } from "../_internal/stateAction";

/**
 * An undo action — always a button (a filter reset never navigates).
 *
 * `analyticsSource`/`analyticsFacet` are mandatory alongside `label`/
 * `onClick`: rendered as inert `data-empty-state-undo-source`/`-facet`
 * attributes (mirroring `<ErrorState>`'s `data-error-action`,
 * `ErrorState.tsx:92` — though there `analyticsAction` stays optional and a
 * plain `string`, since `<ErrorState>`'s action row isn't undo-only and its
 * wrapper is page-scoped, not a single global listener) for one global click
 * listener to read — never imported into or consumed by this component.
 * They live on the action, not as flat sibling props on `<EmptyState>`,
 * because `EmptyStateAction` is only ever reached via `undo` — a variant
 * with no `undo` has nothing to forbid.
 *
 * `EmptyStateUndoSource`'s own type — the closed set of hosts — lives in
 * `@/lib/analytics/empty-state-undo-attrs` (a GA4 vocabulary, not a
 * design-system shape), imported here as a type only so this file still
 * imports nothing from `@/components/analytics` at runtime.
 */
export interface EmptyStateAction extends StateActionBase {
  onClick: () => void;
  analyticsSource: EmptyStateUndoSource;
  analyticsFacet: string;
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
   * The artefact beside the copy. A **defaulting slot**, not a hardcoded
   * image — omit it and the primitive ships a `<JerseyShirt>`. A surface with
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
 *  variant does not compile without one, including its analytics payload
 *  (see `EmptyStateAction` above). "Right where the results would have
 *  been" (#2427 rule 4). */
export interface EmptyStateSurfaceFilteredProps extends EmptyStateSurfaceCommonProps {
  reason: "filtered";
  undo: EmptyStateAction;
}

export type EmptyStateSurfaceProps =
  EmptyStateSurfacePendingProps | EmptyStateSurfaceFilteredProps;

/**
 * Tier-"slot" background, the same idea as tier-"surface"'s `surface` prop:
 * - `"transparent"` (default) — the original held-open gap: `ink-muted`
 *   border, no fill. Every existing consumer (`MatchLineup`, `MatchEvents`,
 *   `CalendarMonth`) gets this without asking for it, so none of their
 *   baselines move.
 * - `"cream-soft"` — a solid-ink border on a `cream-soft` fill, for a slot
 *   that stands alone on the page rather than sitting inside an
 *   already-framed surface (`<CompetitiveStatusLine>`, #2636). Recolours the
 *   same primitive instead of a host overriding its border/fill classes from
 *   outside.
 */
export type EmptyStateSlotBackground = "transparent" | "cream-soft";

const SLOT_BACKGROUND_CLASS: Record<EmptyStateSlotBackground, string> = {
  transparent: "border-ink-muted",
  "cream-soft": "border-ink bg-cream-soft",
};

/** Held-open register — the original tier "slot" (#2427/#2562). */
export interface EmptyStateSlotHeldOpenProps extends EmptyStateSharedProps {
  tier: "slot";
  variant?: undefined;
  /** The held-open label — short, mono, uppercase. No heading, no action. */
  children: ReactNode;
  /** @default "transparent" */
  background?: EmptyStateSlotBackground;
}

/**
 * Accented substring within an `EmptyStateSlotNoticeProps.children` sentence
 * — mirrors `<EditorialHeading>`'s `emphasis={{ text }}` (#2469 resolution
 * rule 5) rather than inventing a second shape. No `tone`/`highlight`: the
 * highlighter sweep is this site's *celebratory* register, wrong on an
 * outage (rule 2), and a dark-ground tone is #2690's job, not wired here.
 */
export interface EmptyStateSlotEmphasis {
  text: string;
}

/**
 * A failure notice (#2469/#2576) — a sentence in the section's own body
 * copy, with an accented substring on the words that failed, not the
 * subject (#2469 resolution rule 3, e.g. *"Het klassement is `even niet
 * beschikbaar`."*). Still tier "slot": no heading, no action, ever.
 */
export interface EmptyStateSlotNoticeProps extends EmptyStateSharedProps {
  tier: "slot";
  variant: "notice";
  /** The full sentence. Must contain `emphasis.text` verbatim once — a
   *  dev-only console warning fires otherwise, mirroring
   *  `<EditorialHeading>`'s own `emphasis.text`-not-found warning. */
  children: string;
  emphasis: EmptyStateSlotEmphasis;
}

export type EmptyStateSlotProps =
  EmptyStateSlotHeldOpenProps | EmptyStateSlotNoticeProps;

export type EmptyStateProps = EmptyStateSurfaceProps | EmptyStateSlotProps;

/** Mirrors `<EditorialHeading>`'s own (unexported) `splitOnEmphasis` — same
 *  small pure function, kept local rather than sharing a util module across
 *  two design-system components for one four-line helper. */
function splitOnAccent(
  text: string,
  accentText: string,
): { before: string; match: string; after: string } | null {
  if (!accentText) return null;
  const idx = text.indexOf(accentText);
  if (idx < 0) return null;
  return {
    before: text.slice(0, idx),
    match: text.slice(idx, idx + accentText.length),
    after: text.slice(idx + accentText.length),
  };
}

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

function SlotNoticeEmptyState({
  children,
  emphasis,
  live,
  className,
}: EmptyStateSlotNoticeProps) {
  const split = splitOnAccent(children, emphasis.text);
  if (!split && process.env.NODE_ENV === "development") {
    console.warn(
      `[EmptyState] emphasis.text "${emphasis.text}" not found in notice children "${children}"`,
    );
  }
  return (
    <p
      role={live ? "status" : undefined}
      className={cn(
        "border-ink/30 text-ink-soft text-body-md border-2 border-dashed px-6 py-8 text-center",
        className,
      )}
    >
      {split ? (
        <>
          {split.before}
          <em className="font-display text-jersey-deep text-[1.09em] italic">
            {split.match}
          </em>
          {split.after}
        </>
      ) : (
        children
      )}
    </p>
  );
}

function SlotHeldOpenEmptyState({
  children,
  live,
  className,
  background = "transparent",
}: EmptyStateSlotHeldOpenProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className={cn(
        "flex flex-1 items-center justify-center border-2 border-dashed px-3 py-3 text-center",
        SLOT_BACKGROUND_CLASS[background],
        className,
      )}
    >
      <MonoLabel tone="muted">{children}</MonoLabel>
    </div>
  );
}

function SlotEmptyState(props: EmptyStateSlotProps) {
  if (props.variant === "notice") return <SlotNoticeEmptyState {...props} />;
  return <SlotHeldOpenEmptyState {...props} />;
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
        "relative text-center sm:text-left",
        className,
      )}
    >
      {/* Tape straddles the card's own top border, so it must be a direct
          child of the framed `<section>` — the same anchoring `<TapedCard>`
          uses. Parented to the artefact wrapper it anchored to an invisible
          inner box and floated in open cream (#2677). `surface="bare"` draws
          no border, so there is no edge to straddle and no tape. */}
      {surface !== "bare" && <TapeStrip color="warm" length="md" />}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-7">
        {/* Artefact — a defaulting slot, not a hardcoded image. Ordered
            AFTER the text on mobile (rule 4: the undo belongs "right where
            the results would have been" — a decorative artefact pushed below
            the fold costs nothing; the heading/body/action row pushed below
            it does). Row order on `sm+` is unaffected. */}
        <div className="order-2 inline-block flex-shrink-0 sm:order-1">
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

          <div className="text-ink-soft mt-3 max-w-[var(--container-prose)] text-[14.5px] leading-relaxed">
            {children}
          </div>

          {props.reason === "filtered" && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={props.undo.onClick}
                data-empty-state-undo-source={props.undo.analyticsSource}
                data-empty-state-undo-facet={props.undo.analyticsFacet}
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
