"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { getButtonClasses } from "@/components/design-system/Button";
import { House, Bus } from "@/lib/icons.redesign";
import {
  HOME_AWAY_A11Y_NAME,
  MATCH_KIND_WORD,
  OUTCOME_UNDERLINE,
  type MatchRowKind,
} from "@/lib/utils/match-display";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { formatWidgetDate, formatDayMonth } from "@/lib/utils/dates";
import type { MatchStripData } from "@/lib/server/match-data";
import type { ScheduleMatch, ScheduleTeam } from "@/components/match/types";

const KCVV_LOGO_URL = "/images/logos/kcvv-logo.png";

export interface MatchStripViewProps {
  data: MatchStripData;
}

/**
 * The landing-page strip: the first team's last result and next fixture.
 *
 * Two layouts, one component (#2387):
 *
 * - **Mobile** — both matches as linked ledger rows, visible at once. The row
 *   itself is the `<Link>`, the same contract `<TeamAgendaRow>` uses, so it is
 *   one touch target with no nested interactives and the trailing chevron is a
 *   visible affordance rather than a hover-only reveal.
 * - **Desktop** — one match at a time behind a two-slide switch, defaulting to
 *   the result, with the `Wedstrijddetails` CTA. Deliberately not a carousel:
 *   two slides, no auto-advance, no swipe-only path.
 *
 * Scores render in true scoreboard order (home team first). Home/away is drawn
 * only on mobile, where the row shows the opponent alone — on desktop both
 * teams appear in order, so a venue glyph would restate the layout.
 */
export function MatchStripView({ data }: MatchStripViewProps) {
  const { result, fixture } = data;

  return (
    <aside
      aria-label="Laatste uitslag en volgende wedstrijd"
      className="bg-cream border-t-jersey-deep/35 border-b-ink/15 border-t border-b"
    >
      <div className="lg:hidden">
        {result ? (
          <LedgerLinkRow match={result} kind="result" last={!fixture} />
        ) : null}
        {fixture ? <LedgerLinkRow match={fixture} kind="fixture" last /> : null}
      </div>
      <DesktopSlider result={result} fixture={fixture} />
    </aside>
  );
}

/* ── shared derivations ──────────────────────────────────────────────────── */

/**
 * Whether KCVV played at home. `is_home` is not guaranteed by the upstream, so
 * fall back to the club id rather than letting `undefined` take the falsy
 * branch and render KCVV as its own opponent.
 */
function isKcvvHome(match: ScheduleMatch): boolean {
  return match.isHome ?? match.homeTeam.id === KCVV_CLUB_ID;
}

function opponentOf(match: ScheduleMatch): ScheduleTeam {
  return isKcvvHome(match) ? match.awayTeam : match.homeTeam;
}

function outcomeOf(match: ScheduleMatch): "win" | "draw" | "loss" | null {
  const { homeScore, awayScore } = match;
  if (homeScore === undefined || awayScore === undefined) return null;
  const home = isKcvvHome(match);
  const kcvv = home ? homeScore : awayScore;
  const other = home ? awayScore : homeScore;
  if (kcvv > other) return "win";
  if (kcvv < other) return "loss";
  return "draw";
}

function scoreboardScore(match: ScheduleMatch): string | null {
  const { homeScore, awayScore } = match;
  if (homeScore === undefined || awayScore === undefined) return null;
  return `${homeScore}–${awayScore}`;
}

/* ── atoms ───────────────────────────────────────────────────────────────── */

function Crest({ team, big = false }: { team: ScheduleTeam; big?: boolean }) {
  const size = big ? "h-9 w-9" : "h-7 w-7";
  // The upstream does not always carry a logo for KCVV's own side; fall back to
  // the local asset before the initial badge, so the club crest is never an "E".
  const src =
    team.logo ?? (team.id === KCVV_CLUB_ID ? KCVV_LOGO_URL : undefined);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn(size, "shrink-0 object-contain")}
        loading="lazy"
      />
    );
  }
  const initial =
    team.name.trim().split(/\s+/).at(-1)?.[0]?.toUpperCase() ?? "?";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-ink/40 bg-cream-soft text-ink inline-flex shrink-0 items-center justify-center border",
        "font-display text-mono-sm leading-none font-black italic",
        size,
      )}
    >
      {initial}
    </span>
  );
}

/**
 * Reuses `<TeamAgendaRow>`'s venue glyph — one home/away vocabulary, not two.
 * The wording now comes from `HOME_AWAY_A11Y_NAME` rather than a copy, so that
 * claim is enforced instead of aspirational (#2398).
 */
function VenueGlyph({ home }: { home: boolean }) {
  const Icon = home ? House : Bus;
  return (
    <Icon
      aria-label={home ? HOME_AWAY_A11Y_NAME.home : HOME_AWAY_A11Y_NAME.away}
      className="text-ink-muted h-4 w-4 shrink-0"
    />
  );
}

/**
 * The canonical outcome marker: a highlighter sweep behind the score, and
 * nothing at all on a draw. Never a rule underneath it.
 *
 * Only ever rendered on the result side, which since #2390 also carries a match
 * that has kicked off while PSD still owes the score. So a missing scoreline is
 * a normal state here, not an anomaly, and it falls back to the kickoff time —
 * the same substitution `<TeamAgendaRow>` makes for that match on the homepage.
 * Returning `null` would leave the desktop slide, which defaults to the result,
 * with an empty gap between the two crests for the hours after every kickoff.
 * `vs.` is the last resort for a feed that carries neither score nor time.
 */
function Score({
  match,
  className,
}: {
  match: ScheduleMatch;
  className?: string;
}) {
  const score = scoreboardScore(match);
  if (score === null) {
    return (
      <span className={cn("text-ink font-mono font-bold", className)}>
        {match.time ?? "vs."}
      </span>
    );
  }
  const outcome = outcomeOf(match);
  const shadow = outcome ? OUTCOME_UNDERLINE[outcome] : undefined;
  return (
    <span
      className={cn("text-ink font-mono font-bold", className)}
      style={shadow ? { boxShadow: shadow, padding: "0 8px" } : undefined}
    >
      {score}
    </span>
  );
}

/**
 * Unboxed on purpose: a bordered date stub next to the bordered crest reads as
 * two competing squares. `<TeamAgendaRow>` can afford the box because it sits
 * inside a ticket-stub card; the strip is a flat band.
 *
 * Two lines since #2404: the date, then which kind of row this is. #2388 had
 * dropped those words because inline they cost 72px — most of what squeezed the
 * opponent name — and left the two rows told apart only by their order and by
 * score-versus-time. Stacked under the date they cost 8px of width (`w-12` →
 * `w-14`, the widest word being "Volgende") and one 9px line of height, which
 * is the trade #2388's own note proposed.
 */
function StripDate({ date, kind }: { date: Date; kind: MatchRowKind }) {
  const { day, month } = formatDayMonth(date);
  return (
    <span className="text-ink text-mono-sm w-14 shrink-0 font-mono font-bold whitespace-nowrap tabular-nums">
      {day}{" "}
      <span className="text-ink-muted font-medium uppercase">{month}</span>
      {/* jersey-deep, not the stub's own ink/ink-muted pair: at 9px directly
          under a bold date, an ink word reads as a third line of the date
          rather than as a label. Green is the one accent this cream band
          already carries (its top border), so it separates without adding a
          hue. On `<TeamAgendaRow>` the same word takes ink instead, because
          there it sits inside an ink-muted caption and emphasis runs darker. */}
      <span className="text-jersey-deep block text-[9px] leading-tight tracking-[0.06em] uppercase">
        {MATCH_KIND_WORD[kind]}
      </span>
    </span>
  );
}

/* ── mobile ──────────────────────────────────────────────────────────────── */

function LedgerLinkRow({
  match,
  kind,
  last = false,
}: {
  match: ScheduleMatch;
  kind: MatchRowKind;
  last?: boolean;
}) {
  const home = isKcvvHome(match);
  const opponent = opponentOf(match);
  const dateLabel = formatWidgetDate(match.date);
  // The `aria-label` replaces the row's contents as its accessible name, so the
  // score has to be spelled out here or a screen-reader user never hears it.
  // Stated KCVV-first and side-by-side with each name, since "3-1" alone does
  // not say whose goals are whose when KCVV played away.
  const { homeScore, awayScore } = match;
  const scored =
    homeScore !== undefined && awayScore !== undefined
      ? home
        ? `${homeScore} - ${opponent.name} ${awayScore}`
        : `${awayScore} - ${opponent.name} ${homeScore}`
      : null;
  // The words come from `MATCH_KIND_WORD`, the same source `<StripDate>` renders
  // eight lines below — the visible stub and the accessible name for one row
  // were two independent copies of "Uitslag" / "Volgende" until #2404, which is
  // the drift the constant exists to end.
  const label =
    kind === "result"
      ? scored
        ? `${MATCH_KIND_WORD.result} ${dateLabel}: KCVV Elewijt ${scored}`
        : `${MATCH_KIND_WORD.result} ${dateLabel}: KCVV Elewijt tegen ${opponent.name}`
      : `${MATCH_KIND_WORD.fixture} wedstrijd ${dateLabel}${match.time ? ` om ${match.time}` : ""}: KCVV Elewijt tegen ${opponent.name}`;

  return (
    <Link
      href={`/wedstrijd/${match.id}`}
      aria-label={label}
      className={cn(
        "hover:bg-cream-soft focus-visible:outline-jersey-deep flex min-w-0 items-center gap-2.5 px-4 py-2.5 no-underline",
        "focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        last ? "" : "border-ink/15 border-b",
      )}
    >
      <StripDate date={match.date} kind={kind} />
      <Crest team={opponent} />
      <span className="font-display text-ink min-w-0 flex-1 truncate leading-none font-bold italic">
        {opponent.name}
      </span>
      <VenueGlyph home={home} />
      <span className="shrink-0">
        {kind === "result" ? (
          <Score match={match} className="text-mono-md" />
        ) : match.time ? (
          <span className="text-ink text-mono-sm font-mono font-semibold">
            {match.time}
          </span>
        ) : null}
      </span>
      <span aria-hidden="true" className="text-ink-muted shrink-0 font-mono">
        →
      </span>
    </Link>
  );
}

/* ── desktop ─────────────────────────────────────────────────────────────── */

function DesktopSlider({
  result,
  fixture,
}: {
  result: ScheduleMatch | null;
  fixture: ScheduleMatch | null;
}) {
  // Default to the result when there is one; otherwise the fixture is the only
  // slide there is.
  const [showResult, setShowResult] = useState(result !== null);

  // One source of truth for which slide is showing, so the label, the score and
  // the CTA cannot disagree. Deriving `isResultSlide` from `showResult` alone
  // was wrong when the switch had been moved to the fixture and a later render
  // dropped it: the fallback rendered the result while still labelled
  // "Volgende" and with `vs.` in place of the score.
  const slide =
    showResult && result
      ? { match: result, kind: "result" as const }
      : fixture
        ? { match: fixture, kind: "fixture" as const }
        : result
          ? { match: result, kind: "result" as const }
          : null;
  if (!slide) return null;

  const showing = slide.match;
  const isResultSlide = slide.kind === "result";
  const bothSides = result !== null && fixture !== null;

  return (
    <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto]">
      {bothSides ? (
        <div className="border-ink/15 flex items-center justify-center gap-2 border-r px-5">
          <button
            type="button"
            onClick={() => setShowResult(true)}
            disabled={isResultSlide}
            aria-label="Toon de laatste uitslag"
            className="border-ink text-ink hover:bg-cream-soft flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30"
          >
            ←
          </button>
          <span className="text-ink-muted w-20 text-center">
            <MonoLabel size="sm">{MATCH_KIND_WORD[slide.kind]}</MonoLabel>
          </span>
          <button
            type="button"
            onClick={() => setShowResult(false)}
            disabled={!isResultSlide}
            aria-label="Toon de volgende wedstrijd"
            className="border-ink text-ink hover:bg-cream-soft flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30"
          >
            →
          </button>
        </div>
      ) : (
        <div className="border-ink/15 flex items-center border-r px-5">
          <span className="text-ink-muted">
            <MonoLabel size="sm">{MATCH_KIND_WORD[slide.kind]}</MonoLabel>
          </span>
        </div>
      )}

      <div aria-live="polite" className="min-w-0 py-3">
        <div className="flex min-w-0 items-center justify-center gap-3 px-6">
          <Crest team={showing.homeTeam} big />
          <DesktopTeamName team={showing.homeTeam} />
          {isResultSlide ? (
            <Score match={showing} className="text-mono-md shrink-0" />
          ) : (
            // `ink/50` computes to 3.63:1 on cream — below AA. `ink-muted` is
            // the palette's answer for de-emphasised text and clears at ~4.9:1.
            <span className="font-display text-ink-muted text-mono-md shrink-0 leading-none italic">
              vs.
            </span>
          )}
          <DesktopTeamName team={showing.awayTeam} />
          <Crest team={showing.awayTeam} big />
        </div>
        {/* No venue glyph: both teams render in scoreboard order here, so the
            layout already says who was at home. */}
        <div className="text-ink text-mono-sm mt-1.5 text-center font-mono font-semibold">
          {formatWidgetDate(showing.date)}
          {!isResultSlide && showing.time ? ` · ${showing.time}` : ""}
          {showing.competition ? ` · ${showing.competition}` : ""}
        </div>
      </div>

      <div className="flex items-center justify-end px-6">
        <Link
          href={`/wedstrijd/${showing.id}`}
          className={getButtonClasses({
            variant: "primary",
            size: "sm",
            className: "no-underline",
          })}
        >
          Wedstrijddetails
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function DesktopTeamName({ team }: { team: ScheduleTeam }) {
  return (
    <span className="font-display text-ink text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic">
      {team.id === KCVV_CLUB_ID ? "KCVV" : team.name}
    </span>
  );
}
