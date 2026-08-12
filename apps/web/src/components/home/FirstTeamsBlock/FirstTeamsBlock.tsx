/**
 * <FirstTeamsBlock> — homepage "Eerste ploegen" eyecatcher (#2211).
 *
 * Full-bleed jersey-deep-dark matchday-desk band (StripedSeam top + bottom),
 * one full-width row per senior team: [team label] · [last result] ·
 * [next fixture]. Both the result and the next fixture render as the shared
 * unified <TeamAgendaRow> — the same match row used on team pages + /kalender
 * (#2301, Direction A): the result as a cream row, the next fixture as the
 * featured jersey-deep card. Each row owns its own press-down <Link> deep to
 * its match detail (`/wedstrijd/{id}`), so there is no bespoke card style left
 * to clash and no nested-interactive wrapper on touch.
 *
 * Design lock: docs/design/mockups/eerste-ploegen/eerste-ploegen-locked.md
 * (visual record: docs/design/mockups/eerste-ploegen/04-b3-ia.html).
 */
import Link from "next/link";
import { EditorialHeading, StripedSeam } from "@/components/design-system";
import { FirstTeamAgendaRow } from "./FirstTeamAgendaRow";
import type { FirstTeamVM } from "./first-teams";

export interface FirstTeamsBlockProps {
  teams: FirstTeamVM[];
  /**
   * Section heading. The homepage passes a fixture-aware label (HP-4) derived
   * by `firstTeamsHeading`, which owns the rule — see its docblock in
   * `first-teams.ts`. Defaults to "Dit weekend." so stories/tests stay stable;
   * that default is an unconditional claim, so real callers must pass one.
   */
  heading?: string;
  /**
   * A match read failed (BFF/PSD down or quota-exhausted), as opposed to the
   * feed genuinely holding no matches. Only picks which copy the held-open
   * notice carries; it is read solely on the no-rows path.
   */
  unavailable?: boolean;
}

/**
 * The held-open dashed frame — #2427's tier-2 register: an empty slot inside a
 * populated page keeps its shape so the absence reads as a known gap rather
 * than a render failure. Shared by the per-slot `<SkipCard>` and the whole-band
 * notice so the two can't drift, the way `FIRST_TEAMS_ROW_GRID` is below.
 */
const HELD_OPEN_FRAME = "border-cream/40 border-2 border-dashed text-center";

function SkipCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${HELD_OPEN_FRAME} text-cream/65 flex items-center justify-center px-4 py-3 font-mono text-xs tracking-wide uppercase`}
    >
      {children}
    </div>
  );
}

/**
 * Row grid, shared with the homepage route skeleton so the two can't drift.
 *
 * Three columns only from `xl`: at `md` each scoreboard fell below its own
 * min-content and the row overflowed the page (#2397). The label column is a
 * bounded 11rem rather than the old `0.72fr` (~263px) — "A-ploeg" plus a
 * division needs about 110px, and the ~90px that frees is what lets a 30-char
 * club name sit unclipped. Bounded, not content-sized, because `divisionFull`
 * is PSD-authored and would otherwise spend that width straight back.
 *
 * Coupled to `<TeamAgendaRow>`'s `fluidNames` threshold: three-up lands each
 * card near 520px, deliberately under that 560px mark, because the fluid split
 * is what seats a long opponent name in a card that narrow.
 */
export const FIRST_TEAMS_ROW_GRID =
  "border-cream/20 grid gap-3 border-t py-5 first:border-t-0 xl:grid-cols-[minmax(0,11rem)_1fr_1fr] xl:gap-5";

function FirstTeamRow({ team }: { team: FirstTeamVM }) {
  return (
    <div className={`${FIRST_TEAMS_ROW_GRID} xl:items-stretch`}>
      <div className="flex flex-col justify-center">
        <span className="font-display text-cream text-2xl leading-tight font-bold">
          {team.label}
        </span>
        {team.division ? (
          <span className="text-cream/70 text-label mt-1 font-mono uppercase">
            {team.division}
          </span>
        ) : null}
      </div>
      {team.result ? (
        <FirstTeamAgendaRow
          match={team.result}
          teamSlug={team.slug}
          kind="result"
        />
      ) : (
        <SkipCard>Nog geen uitslag</SkipCard>
      )}
      {team.fixture ? (
        <FirstTeamAgendaRow
          match={team.fixture}
          teamSlug={team.slug}
          kind="fixture"
          featured
        />
      ) : (
        <SkipCard>Geen geplande wedstrijd</SkipCard>
      )}
    </div>
  );
}

/**
 * Render the "Eerste ploegen" band. Teams with neither a result nor a fixture
 * are dropped; when that leaves no rows at all the band still renders — chrome
 * plus a held-open notice — instead of vanishing (#2399). A silently absent
 * band left the homepage looking finished during a BFF outage, so a supporter
 * concluded the club had never posted the result.
 */
export function FirstTeamsBlock({
  teams,
  heading = "Dit weekend.",
  unavailable = false,
}: FirstTeamsBlockProps) {
  const rows = teams.filter((t) => t.result || t.fixture);

  return (
    <section aria-label="Eerste ploegen" className="bg-jersey-deep-dark">
      <StripedSeam colorPair="cream-jersey-deep" height="md" />
      <div className="mx-auto max-w-[var(--container-index)] px-4 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <span className="text-warm text-label font-mono font-semibold uppercase">
              Eerste ploegen
            </span>
            <EditorialHeading
              level={2}
              size="display-md"
              tone="cream"
              className="mt-2"
            >
              {heading}
            </EditorialHeading>
          </div>
          <Link
            href="/kalender"
            // `py-2 -my-2` — hit area only, no layout shift (#2394).
            className="text-warm hover:text-cream -my-2 shrink-0 py-2 font-mono text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            Volledige kalender <span aria-hidden="true">→</span>
          </Link>
        </div>
        {rows.length > 0 ? (
          <div className="flex flex-col">
            {rows.map((team) => (
              <FirstTeamRow key={team.slug} team={team} />
            ))}
          </div>
        ) : (
          // Body type rather than `<SkipCard>`'s mono uppercase — this is a
          // sentence, not a two-word label. No action of its own: the band's
          // "Volledige kalender →" above is already the way out.
          <p className={`${HELD_OPEN_FRAME} text-cream/80 px-4 py-8`}>
            {unavailable
              ? "Uitslagen en wedstrijden zijn even niet beschikbaar. Probeer het later opnieuw."
              : "Nog geen wedstrijden ingepland."}
          </p>
        )}
      </div>
      <StripedSeam colorPair="cream-jersey-deep" height="md" flip />
    </section>
  );
}
