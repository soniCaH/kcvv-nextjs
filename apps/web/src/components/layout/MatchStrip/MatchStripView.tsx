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
  OUTCOME_UNDERLINE_DARK,
  reservationRowLabel,
  reservationView,
  type MatchRowKind,
} from "@/lib/utils/match-display";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { formatMatchWidgetDate, formatMatchDayMonth } from "@/lib/utils/dates";
import type { MatchStripData } from "@/lib/server/match-data";
import type {
  ScheduleMatch,
  ScheduleReservation,
  ScheduleRow,
  ScheduleTeam,
} from "@/components/match/types";

const KCVV_LOGO_URL = "/images/logos/kcvv-logo.png";

export interface MatchStripViewProps {
  data: MatchStripData;
  /**
   * Whether the next fixture falls on today's calendar day (#2616) — computed
   * once, server-side, by `<MatchStrip>` and passed down as a plain boolean
   * rather than recomputed here. This is a client component ("use client" at
   * the top), rendered once during SSR and again on hydration in the
   * visitor's own browser; if it called `isMatchDay()`/`clubToday()` itself,
   * those two passes could disagree across a midnight boundary the same way
   * `dates.ts` documents for an unpinned date parse. Baking the boolean into
   * the prop sidesteps that entirely — see `<MatchStrip>`'s own docblock.
   *
   * Only ever `true` for a genuine `ScheduleMatch` fixture, never a
   * pitch-reservation placeholder (#2606) — `<MatchStrip>` enforces that; this
   * component trusts the prop rather than re-deriving it; only the *fixture*
   * row/slide is relabelled "Vandaag" even so, since a reservation row never
   * reaches the "today" branch below regardless (`ReservationLedgerRow` /
   * `ReservationDesktopSlide` have no such branch at all).
   *
   * This is a dark-ground **variant** of both layouts, not a background swap
   * on the `<aside>` alone — every descendant that assumed a cream ground
   * (ink text, ink-muted captions, the `primary` button) gets a paired
   * dark-ground counterpart, threaded down as `dark`/`today` props rather
   * than recomputed per element.
   */
  matchDay?: boolean;
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
 *   the result (or to the fixture on match day, see `<DesktopSlider>`), with
 *   the `Wedstrijddetails` CTA. Deliberately not a carousel: two slides, no
 *   auto-advance, no swipe-only path.
 *
 * Scores render in true scoreboard order (home team first). Home/away is drawn
 * only on mobile, where the row shows the opponent alone — on desktop both
 * teams appear in order, so a venue glyph would restate the layout.
 */
export function MatchStripView({
  data,
  matchDay = false,
}: MatchStripViewProps) {
  const { result, fixture } = data;

  return (
    <aside
      aria-label="Laatste uitslag en volgende wedstrijd"
      className={cn(
        "border-t border-b",
        matchDay
          ? "bg-jersey-deep-dark border-t-cream/25 border-b-cream/10"
          : "bg-cream border-t-jersey-deep/35 border-b-ink/15",
      )}
    >
      <div className="lg:hidden">
        {result ? (
          <LedgerLinkRow
            match={result}
            kind="result"
            last={!fixture}
            matchDay={matchDay}
          />
        ) : null}
        {fixture ? (
          <LedgerLinkRow
            match={fixture}
            kind="fixture"
            last
            matchDay={matchDay}
          />
        ) : null}
      </div>
      <DesktopSlider result={result} fixture={fixture} matchDay={matchDay} />
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

function Crest({
  team,
  big = false,
  dark = false,
}: {
  team: ScheduleTeam;
  big?: boolean;
  /** The match-day ground (#2616) — recolours the initial-fallback badge only; a real logo image needs no change. */
  dark?: boolean;
}) {
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
  // A plain template, not `cn()`: `tailwind-merge` treats the custom
  // `text-mono-sm` **size** token and `text-ink`/`text-cream` **color**
  // utilities as the same conflict group (both match its generic `text-*`
  // pattern) and silently drops whichever comes first — verified with
  // `twMerge("text-ink text-mono-sm")` → `"text-mono-sm"` alone. None of
  // these classes ever need deduplicating against each other, so `cn()`'s
  // merge behaviour has nothing to offer here and everything to lose.
  return (
    <span
      aria-hidden="true"
      className={`font-display text-mono-sm inline-flex shrink-0 items-center justify-center border leading-none font-black italic ${size} ${
        dark
          ? "border-cream/40 bg-cream/10 text-cream"
          : "border-ink/40 bg-cream-soft text-ink"
      }`}
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
function VenueGlyph({ home, dark = false }: { home: boolean; dark?: boolean }) {
  const Icon = home ? House : Bus;
  return (
    <Icon
      aria-label={home ? HOME_AWAY_A11Y_NAME.home : HOME_AWAY_A11Y_NAME.away}
      className={cn(
        "h-4 w-4 shrink-0",
        dark ? "text-cream/70" : "text-ink-muted",
      )}
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
  dark = false,
}: {
  match: ScheduleMatch;
  className?: string;
  /** The match-day ground (#2616) — cream text, and the dark-ground outcome tint (`OUTCOME_UNDERLINE_DARK`). */
  dark?: boolean;
}) {
  // Every caller's `className` carries a `text-mono-*` size token
  // (`text-mono-md`/`text-mono-sm`) — combined through `cn()` that collides
  // with the `text-ink`/`text-cream` color class below (see `<Crest>`'s
  // comment on the conflict-group), silently dropping the color. A plain
  // template sidesteps it.
  const score = scoreboardScore(match);
  const colorClass = dark ? "text-cream" : "text-ink";
  if (score === null) {
    return (
      <span className={`${colorClass} font-mono font-bold ${className ?? ""}`}>
        {match.time ?? "vs."}
      </span>
    );
  }
  const outcome = outcomeOf(match);
  const shadow = outcome
    ? (dark ? OUTCOME_UNDERLINE_DARK : OUTCOME_UNDERLINE)[outcome]
    : undefined;
  return (
    <span
      className={`${colorClass} font-mono font-bold ${className ?? ""}`}
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
function StripDate({
  date,
  kind,
  today = false,
  dark = false,
}: {
  date: Date;
  kind: MatchRowKind;
  /**
   * The match-day relabel (#2616) — replaces the day/month + kind-word stack
   * with "Vandaag" outright rather than recolouring it in place. Restating
   * "Volgende" underneath "Vandaag" would argue with itself: the word already
   * says this is the next match, and the point of the whole feature is that a
   * reader no longer has to compare a date against the calendar in their head.
   * Only ever passed for the fixture row — see `<MatchStripView>`'s `matchDay`
   * docblock for why a reservation row can never reach this branch.
   */
  today?: boolean;
  dark?: boolean;
}) {
  if (today) {
    return (
      <span className="text-cream text-mono-sm shrink-0 font-mono font-bold whitespace-nowrap uppercase">
        Vandaag
      </span>
    );
  }
  const { day, month } = formatMatchDayMonth(date);
  return (
    // Plain template, not `cn()` — see `<Crest>`'s comment on the
    // `text-mono-sm` / `text-{color}` conflict-group collision.
    <span
      className={`text-mono-sm w-14 shrink-0 font-mono font-bold whitespace-nowrap tabular-nums ${dark ? "text-cream" : "text-ink"}`}
    >
      {day}{" "}
      <span
        className={cn(
          "font-medium uppercase",
          dark ? "text-cream/70" : "text-ink-muted",
        )}
      >
        {month}
      </span>
      {/* jersey-deep, not the stub's own ink/ink-muted pair: at 9px directly
          under a bold date, an ink word reads as a third line of the date
          rather than as a label. Green is the one accent this cream band
          already carries (its top border), so it separates without adding a
          hue. On `<TeamAgendaRow>` the same word takes ink instead, because
          there it sits inside an ink-muted caption and emphasis runs darker.
          On the match-day ground (#2616) this becomes a cream alpha instead —
          the same "slide label" treatment the desktop switch's kind word
          gets, since this caption is that same word in the mobile layout. */}
      <span
        className={cn(
          "block text-[9px] leading-tight tracking-[0.06em] uppercase",
          dark ? "text-cream/70" : "text-jersey-deep",
        )}
      >
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
  matchDay = false,
}: {
  match: ScheduleRow;
  kind: MatchRowKind;
  last?: boolean;
  /** The strip's match-day ground (#2616) — see `<MatchStripView>`'s own docblock. */
  matchDay?: boolean;
}) {
  if (match.isPlaceholder) {
    return <ReservationLedgerRow match={match} kind={kind} last={last} />;
  }
  // Only the fixture row is ever "today" — `matchDay` is computed against the
  // fixture's own date (`<MatchStrip>`), so a result row on the same dark
  // ground never qualifies even though the ground swap still reaches it.
  const today = matchDay && kind === "fixture";
  const home = isKcvvHome(match);
  const opponent = opponentOf(match);
  const dateLabel = today ? "vandaag" : formatMatchWidgetDate(match.date);
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
        "flex min-w-0 items-center gap-2.5 px-4 py-2.5 no-underline",
        "focus-visible:outline-jersey-deep focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        matchDay ? "hover:bg-cream/10" : "hover:bg-cream-soft",
        last
          ? ""
          : matchDay
            ? "border-cream/15 border-b"
            : "border-ink/15 border-b",
      )}
    >
      <StripDate date={match.date} kind={kind} today={today} dark={matchDay} />
      <Crest team={opponent} dark={matchDay} />
      <span
        className={cn(
          "font-display min-w-0 flex-1 truncate leading-none font-bold italic",
          matchDay ? "text-cream" : "text-ink",
        )}
      >
        {opponent.name}
      </span>
      <VenueGlyph home={home} dark={matchDay} />
      <span className="shrink-0">
        {kind === "result" ? (
          <Score match={match} className="text-mono-md" dark={matchDay} />
        ) : match.time ? (
          // Plain template, not `cn()` — see `<Crest>`'s comment on the
          // `text-mono-sm` / `text-{color}` conflict-group collision.
          <span
            className={`text-mono-sm font-mono font-semibold whitespace-nowrap ${matchDay ? "text-cream" : "text-ink"}`}
          >
            {match.time}
            {today && match.venue ? ` · ${match.venue}` : ""}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "shrink-0 font-mono",
          matchDay ? "text-cream/60" : "text-ink-muted",
        )}
      >
        →
      </span>
    </Link>
  );
}

/**
 * The mobile ledger's reduced row for a pitch-reservation placeholder
 * (#2606). Mirrors `<TeamAgendaRow>`'s prior-art treatment — one crest (the
 * club's own, never an opponent), the competition subject via
 * `reservationView()`, and the real kickoff time — but no `<Link>`: #2606
 * decision 5 ruled a reservation out as a navigation target, and that holds
 * here even though `/wedstrijd/[matchId]` now renders a reduced page for one
 * (#2688) — there is still nothing worth clicking through to from a widget
 * that has no room to explain what a reservation is.
 */
function ReservationLedgerRow({
  match,
  kind,
  last = false,
}: {
  match: ScheduleReservation;
  kind: MatchRowKind;
  last?: boolean;
}) {
  const { subject, statusWording } = reservationView(match);
  const dateLabel = formatMatchWidgetDate(match.date);
  const label = reservationRowLabel({
    kind,
    subject,
    dateLabel,
    time: match.time,
    status: match.status,
    statusWording,
  });

  return (
    // `<article>`, not a `<div>` — see the markup rule on
    // `reservationRowLabel` in `match-display.ts`.
    <article
      aria-label={label}
      data-placeholder="true"
      className={cn(
        "flex min-w-0 items-center gap-2.5 px-4 py-2.5",
        last ? "" : "border-ink/15 border-b",
      )}
    >
      {/* `aria-hidden`: the wrapper's `aria-label` above is this row's sole
          accessible content — see the same pattern and rationale on
          `<TeamAgendaRow>`'s placeholder branch. */}
      <div aria-hidden="true" className="contents">
        <StripDate date={match.date} kind={kind} />
        <Crest team={match.team} />
        <span className="text-ink-muted min-w-0 flex-1 truncate font-mono text-[11px] font-semibold tracking-wide uppercase">
          {subject}
        </span>
        {match.time ? (
          <span className="text-ink text-mono-sm shrink-0 font-mono font-semibold">
            {match.time}
          </span>
        ) : null}
      </div>
    </article>
  );
}

/* ── desktop ─────────────────────────────────────────────────────────────── */

function DesktopSlider({
  result,
  fixture,
  matchDay = false,
}: {
  result: ScheduleRow | null;
  fixture: ScheduleRow | null;
  /** The strip's match-day ground (#2616) — see `<MatchStripView>`'s own docblock. */
  matchDay?: boolean;
}) {
  // Default to the result when there is one; otherwise the fixture is the
  // only slide there is. On match day, default to the fixture instead — it
  // is the reason the strip is dark in the first place, and a desktop
  // visitor should not have to click through the switch to discover there is
  // a Match today.
  const [showResult, setShowResult] = useState(result !== null && !matchDay);

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
  // Only a genuine fixture slide is ever "today" — mirrors `<LedgerLinkRow>`'s
  // `today`. Unlike the mobile row, a placeholder slide shares this same
  // function rather than branching out before the label is built (see
  // `<ReservationDesktopSlide>` below), so `isPlaceholder` has to be checked
  // here explicitly rather than relied on to short-circuit first.
  const today = matchDay && !isResultSlide && !showing.isPlaceholder;

  const arrowClass = matchDay
    ? "border-cream text-cream hover:bg-cream/10"
    : "border-ink text-ink hover:bg-cream-soft";
  const slideLabelWord = today ? "Vandaag" : MATCH_KIND_WORD[slide.kind];
  const slideLabel = matchDay ? (
    <span className="opacity-70">
      <MonoLabel size="sm" tone="cream">
        {slideLabelWord}
      </MonoLabel>
    </span>
  ) : (
    <MonoLabel size="sm">{slideLabelWord}</MonoLabel>
  );

  return (
    <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto]">
      {bothSides ? (
        <div
          className={cn(
            "flex items-center justify-center gap-2 border-r px-5",
            matchDay ? "border-cream/20" : "border-ink/15",
          )}
        >
          <button
            type="button"
            onClick={() => setShowResult(true)}
            disabled={isResultSlide}
            aria-label="Toon de laatste uitslag"
            className={cn(
              "flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30",
              arrowClass,
            )}
          >
            ←
          </button>
          <span
            className={cn(
              "w-20 text-center",
              matchDay ? "text-cream" : "text-ink-muted",
            )}
          >
            {slideLabel}
          </span>
          <button
            type="button"
            onClick={() => setShowResult(false)}
            disabled={!isResultSlide}
            aria-label="Toon de volgende wedstrijd"
            className={cn(
              "flex h-9 w-9 items-center justify-center border-2 font-mono text-sm disabled:opacity-30",
              arrowClass,
            )}
          >
            →
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center border-r px-5",
            matchDay ? "border-cream/20" : "border-ink/15",
          )}
        >
          <span className={matchDay ? "text-cream" : "text-ink-muted"}>
            {slideLabel}
          </span>
        </div>
      )}

      {/* `aria-live` lives on this always-present cell, not inside either
          branch below — a live region inserted together with its content is
          not announced (WAI-ARIA), so hanging it on only the normal branch's
          own wrapper meant switching TO a reservation slide (or back) via
          the desktop switch was announced in neither direction. */}
      <div
        aria-live="polite"
        data-placeholder={showing.isPlaceholder ? "true" : undefined}
        className="min-w-0 py-3"
      >
        {showing.isPlaceholder ? (
          <ReservationDesktopSlide match={showing} />
        ) : (
          <>
            <div className="flex min-w-0 items-center justify-center gap-3 px-6">
              <Crest team={showing.homeTeam} big dark={matchDay} />
              <DesktopTeamName team={showing.homeTeam} dark={matchDay} />
              {isResultSlide ? (
                <Score
                  match={showing}
                  className="text-mono-md shrink-0"
                  dark={matchDay}
                />
              ) : today && showing.time ? (
                // The kickoff, in the score slot, in place of "vs." — this is
                // the "names … the kickoff" half of #2616's acceptance
                // criteria; a bare "vs." would leave a Match hours away
                // indistinguishable from one on the far side of the season.
                <span className="text-mono-md text-cream shrink-0 font-mono font-bold">
                  {showing.time}
                </span>
              ) : (
                // `ink/50` computes to 3.63:1 on cream — below AA. `ink-muted` is
                // the palette's answer for de-emphasised text and clears at ~4.9:1.
                <span className="font-display text-ink-muted text-mono-md shrink-0 leading-none italic">
                  vs.
                </span>
              )}
              <DesktopTeamName team={showing.awayTeam} dark={matchDay} />
              <Crest team={showing.awayTeam} big dark={matchDay} />
            </div>
            {/* No venue glyph: both teams render in scoreboard order here, so the
                layout already says who was at home. Plain template, not
                `cn()` — see `<Crest>`'s comment on the `text-mono-sm` /
                `text-{color}` conflict-group collision. */}
            <div
              className={`text-mono-sm mt-1.5 text-center font-mono font-semibold ${matchDay ? "text-warm" : "text-ink"}`}
            >
              {today
                ? ["Vandaag", showing.venue].filter(Boolean).join(" · ")
                : `${formatMatchWidgetDate(showing.date)}${
                    !isResultSlide && showing.time ? ` · ${showing.time}` : ""
                  }${showing.competition ? ` · ${showing.competition}` : ""}`}
            </div>
          </>
        )}
      </div>

      {/* No CTA for a reservation — mirrors the mobile ledger row: #2606
          decision 5 ruled it out as a navigation target, and the desktop
          slide follows the same rule rather than inventing a second one.
          An empty cell keeps the three-column grid intact. */}
      <div className="flex items-center justify-end px-6">
        {showing.isPlaceholder ? null : (
          <Link
            href={`/wedstrijd/${showing.id}`}
            className={getButtonClasses({
              // The primary variant's fill is 2.3:1 on the match-day ground
              // and its ink border/shadow 1.6:1 — both effectively invisible
              // (#2616 decision sheet §8, D7c). `inverted` needs no new
              // variant: it is already cream-ground with the soft offset
              // shadow this ground calls for.
              variant: matchDay ? "inverted" : "primary",
              size: "sm",
              className: "no-underline",
            })}
          >
            Wedstrijddetails
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * The desktop slide's reduced content for a pitch-reservation placeholder —
 * one crest, the subject/kickoff, no opponent slot. See `ReservationLedgerRow`
 * for the mobile equivalent and the shared rationale.
 */
function ReservationDesktopSlide({ match }: { match: ScheduleReservation }) {
  const { subject, statusWording } = reservationView(match);
  return (
    <>
      <div className="flex min-w-0 items-center justify-center gap-3 px-6">
        <Crest team={match.team} big />
        <span className="font-display text-ink text-mono-md min-w-0 truncate leading-none font-bold italic">
          {match.team.name}
        </span>
      </div>
      <div className="text-ink text-mono-sm mt-1.5 text-center font-mono font-semibold">
        {subject}
        {" · "}
        {formatMatchWidgetDate(match.date)}
        {match.time ? ` · ${match.time}` : ""}
        {statusWording ? ` · ${statusWording.longForm}` : ""}
      </div>
    </>
  );
}

function DesktopTeamName({
  team,
  dark = false,
}: {
  team: ScheduleTeam;
  /** The match-day ground (#2616). */
  dark?: boolean;
}) {
  // Plain template, not `cn()` — see `<Crest>`'s comment on the
  // `text-mono-md` / `text-{color}` conflict-group collision.
  return (
    <span
      className={`font-display text-mono-md max-w-[40%] min-w-0 truncate leading-none font-bold italic ${dark ? "text-cream" : "text-ink"}`}
    >
      {team.id === KCVV_CLUB_ID ? "KCVV" : team.name}
    </span>
  );
}
