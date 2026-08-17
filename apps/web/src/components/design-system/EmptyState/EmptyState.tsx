/**
 * <EmptyState> — shared "nothing to show" primitive, two tiers (#2427 / #2562).
 *
 * A surface with nothing to show says so in exactly two registers, chosen by
 * how much of the page is missing:
 *
 * - **Tier "surface"** — the whole surface is empty (`/sponsors`, `/galerij`,
 *   `/zoeken`, a filtered `/nieuws`). The `SearchNoResultsCard` register: a
 *   cream-soft paper card, a taped artefact (a defaulting slot — pass nothing
 *   and it ships the jersey), a display heading, a body line, and an optional
 *   action row for the mandatory filter undo.
 * - **Tier "slot"** — one slot is empty inside an otherwise full page (a
 *   `MatchLineup` team column, a `MatchEvents` team list). A dashed
 *   `ink-muted` box that holds the slot's shape so the absence reads as a
 *   known gap rather than a render failure. No heading, no action, ever —
 *   the type system has no `heading`/`artefact`/`actions` prop on this tier.
 *
 * **The copy is the tell.** Both tiers share one visual register; only the
 * words distinguish genuine emptiness ("Nog geen …") from a filter that
 * emptied the surface ("Geen … in <facet>.", with the undo action) from a
 * fruitless query (naming what was searched for). See the resolution comment
 * on #2427 for the five copy rules this primitive exists to carry.
 *
 * Sits beside `<ErrorState>` — same job at a different severity, same folder.
 * `EmptyStateAction`'s mutually-exclusive `href`/`onClick` shape mirrors
 * `ErrorStateAction` on purpose (peer-drift avoidance).
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "../Button";
import {
  EditorialHeading,
  type EditorialHeadingEmphasis,
} from "../EditorialHeading";
import { JerseyShirt } from "../JerseyShirt";
import { LinkButton } from "../LinkButton";
import { TapeStrip } from "../TapeStrip";

export type EmptyStateActionVariant = "primary" | "ghost";

interface EmptyStateActionBase {
  label: string;
  variant?: EmptyStateActionVariant;
  /**
   * Stable analytics slug rendered as `data-empty-state-action` (e.g.
   * `"reset-filter"`). Omit it to render no marker.
   */
  analyticsAction?: string;
}

/** A navigation action — renders a `<LinkButton>` to `href`. */
export interface EmptyStateLinkAction extends EmptyStateActionBase {
  href: string;
  onClick?: never;
}

/** A button action — renders a `<Button>` (e.g. a filter-reset "Toon alles"). */
export interface EmptyStateButtonAction extends EmptyStateActionBase {
  onClick: () => void;
  href?: never;
}

/**
 * A single call-to-action in the surface tier's action row. Exactly one of a
 * `href` (link) or an `onClick` (button) — mirrors `ErrorStateAction`.
 */
export type EmptyStateAction = EmptyStateLinkAction | EmptyStateButtonAction;

interface EmptyStateSharedProps {
  /** Renders `role="status"` so assistive tech announces a client-side
   *  change (a filter emptying the surface, or a slot going empty after
   *  load). Omit for an empty state already present on first render. */
  live?: boolean;
  className?: string;
}

export interface EmptyStateSurfaceProps extends EmptyStateSharedProps {
  tier: "surface";
  /** Display-md heading. Auto-terminated with a period by `<EditorialHeading>`. */
  heading: string;
  /**
   * Accent emphasis on the heading. Defaults to accenting the trailing
   * period (the `SponsorEmptyState` / `SearchNoResultsCard` convention).
   * Pass `false` to render no emphasis at all.
   */
  headingEmphasis?: EditorialHeadingEmphasis | false;
  /** Body copy. May embed inline `<Link>`s directly (the way-forward idiom
   *  used by `SearchNoResultsCard` and `HulpFinder`) — the `actions` row
   *  below is for a discrete button, chiefly the mandatory filter undo. */
  children: ReactNode;
  /**
   * The taped artefact. A **defaulting slot**, not a hardcoded image —
   * omit it and the primitive ships a taped `<JerseyShirt>`. A surface with
   * its own obvious mark (a crest, a ball) can pass one without touching
   * this component.
   */
  artefact?: ReactNode;
  /**
   * Optional action row below the body. This is where the mandatory undo
   * lives for a filter that emptied the surface — "right where the results
   * would have been" (#2562).
   */
  actions?: readonly EmptyStateAction[];
}

export interface EmptyStateSlotProps extends EmptyStateSharedProps {
  tier: "slot";
  /** The held-open label — short, mono, uppercase. No heading, no action. */
  children: ReactNode;
}

export type EmptyStateProps = EmptyStateSurfaceProps | EmptyStateSlotProps;

function ActionRow({ actions }: { actions: readonly EmptyStateAction[] }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
      {actions.map((action) => {
        const variant = action.variant ?? "ghost";
        return action.href !== undefined ? (
          <LinkButton
            key={action.label}
            href={action.href}
            variant={variant}
            size="sm"
            data-empty-state-action={action.analyticsAction}
          >
            {action.label}
          </LinkButton>
        ) : (
          <Button
            key={action.label}
            type="button"
            variant={variant}
            size="sm"
            onClick={action.onClick}
            data-empty-state-action={action.analyticsAction}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

function SlotEmptyState({ children, live, className }: EmptyStateSlotProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className={cn(
        "border-ink-muted flex items-center justify-center border-2 border-dashed px-3 py-3 text-center",
        className,
      )}
    >
      <span className="text-ink-muted font-mono text-xs tracking-[0.14em] uppercase">
        {children}
      </span>
    </div>
  );
}

function SurfaceEmptyState({
  heading,
  headingEmphasis,
  children,
  artefact,
  actions,
  live,
  className,
}: EmptyStateSurfaceProps) {
  const emphasis =
    headingEmphasis === false ? undefined : (headingEmphasis ?? { text: "." });

  return (
    <section
      role={live ? "status" : undefined}
      className={cn(
        "border-ink bg-cream-soft shadow-paper-sm border-2 p-7 text-center sm:p-8 sm:text-left",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-7">
        {/* Taped artefact — a defaulting slot, not a hardcoded image. */}
        <div className="relative inline-block flex-shrink-0">
          <TapeStrip color="warm" length="md" />
          {artefact ?? <JerseyShirt className="h-28 w-28 -rotate-3" />}
        </div>

        <div>
          <EditorialHeading level={2} size="display-md" emphasis={emphasis}>
            {heading}
          </EditorialHeading>

          <div className="text-ink-soft mt-3 max-w-[52ch] text-[14.5px] leading-relaxed">
            {children}
          </div>

          {actions && actions.length > 0 && <ActionRow actions={actions} />}
        </div>
      </div>
    </section>
  );
}

export function EmptyState(props: EmptyStateProps) {
  if (props.tier === "slot") return <SlotEmptyState {...props} />;
  return <SurfaceEmptyState {...props} />;
}
