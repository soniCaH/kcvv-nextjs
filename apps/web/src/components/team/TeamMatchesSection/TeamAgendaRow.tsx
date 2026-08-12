"use client";

/**
 * <TeamAgendaRow> — one match row in the team matches agenda.
 *
 * Responsive (one component, one sm breakpoint ~640px):
 *   A · desktop = symmetric scoreboard: [stub][home crest+name][score/time][away name+crest]
 *   B · mobile  = KCVV-centric column:  [stub][opponent crest+name+comp][home/away icon][score/time]
 *
 * The two names always split the row evenly (`flex-1` a side), so the score sits
 * dead centre whatever the clubs are called. A name too long for its half
 * ellipsises — it never borrows from the other side, because a score that moves
 * between rows reads as a broken table (#2397).
 *
 * Design lock: docs/design/mockups/phase-6-team/detail-ia-locked.md §3
 */
import { Fragment } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { Crest, PRESS_DOWN_CLASSES } from "@/components/design-system";
import { cn } from "@/lib/utils/cn";
import {
  getResultColor,
  HOME_AWAY_A11Y_NAME,
  isExceptionalMatchStatus,
  isPlayedMatch,
  isSettledMatch,
  MATCH_KIND_WORD,
  OUTCOME_UNDERLINE,
  OUTCOME_WORD,
  type MatchOutcome,
  type MatchRowKind,
} from "@/lib/utils/match-display";
import { matchStatusWording } from "@/components/match/MatchStatusBadge";
import { House, Bus } from "@/lib/icons.redesign";
import type { ScheduleMatch } from "@/components/match/types";

export interface TeamAgendaRowProps {
  match: ScheduleMatch;
  /**
   * PSD team ID of the KCVV team being rendered (used to determine home/away
   * when is_home is absent). Passed down from the page.
   */
  kcvvTeamId?: number;
  /** When true, renders as the featured "Eerstvolgende" card (jersey-deep bg). */
  featured?: boolean;
  /**
   * When false, omits the leading date stub. Used where the row is already
   * grouped under a known day (the `/kalender` grid's selected-day detail) so
   * the day/month stub is redundant. Defaults to `true` — the team-detail
   * agenda (6.C) spans many dates and always shows it.
   */
  showDateStub?: boolean;
  /**
   * Fired when the row is clicked through to the match detail. Lets a host
   * surface attach navigation-time side-effects (e.g. `/kalender`'s
   * `kalender_item_click` analytics) without re-implementing the row.
   */
  onNavigate?: () => void;
  /**
   * Optional jersey-deep label prepended to the competition caption (P2), e.g.
   * the KCVV squad that played ("A-Ploeg" · 3e Prov.). Used by the
   * opponent-history (`/tegenstander`) page, where one opponent can mix
   * A-Ploeg / B-Ploeg / youth and the team must be named on the row. Distinct
   * from `team.teamLabel` (the opponent's designation chip beside its name).
   */
  captionLabel?: string;
  /**
   * Label shown in the score slot for not-yet-played matches instead of the
   * kickoff time (e.g. "Gepland" on the opponent-history page, where a precise
   * future kickoff is irrelevant). Rendered in the mono caption register. When
   * omitted, the kickoff time is shown — the team-detail default, where the
   * next fixture's start time matters.
   */
  upcomingLabel?: string;
  /**
   * Which slot this row is filling. Supplying it names the row at the head of
   * the caption — and in the accessible name — instead of leaving that to the
   * card's colour and its position (#2404).
   *
   * Resolution order, most informative first: a settled match uses
   * `OUTCOME_WORD` ("Winst" / "Gelijkspel" / "Verlies"), which also de-colours
   * the win/loss tint the score carries; a status the layout can't speak for
   * (`PP` / `AFG` / `STOP`) is left to `statusWording` below, since "Volgende ·
   * AFG" would contradict itself; otherwise the slot's own word.
   *
   * It is the *caller's* answer, never derived from `match.status` — see
   * `MatchRowKind`. Omitted by default, because most host surfaces already say
   * it in their own chrome and would otherwise say it twice:
   * `<TeamMatchesSection>` heads its featured row "Eerstvolgende", and
   * `/kalender` groups rows under a date where "Volgende" would be a lie for
   * any day but today's. The homepage `<FirstTeamsBlock>` is the surface with
   * two colour-coded columns and no words anywhere.
   */
  kind?: MatchRowKind;
  className?: string;
}

type Outcome = MatchOutcome | null;

function computeOutcome(
  match: ScheduleMatch,
  isHome: boolean | undefined,
): Outcome {
  // Settled, not merely finished: a forfeit is a real win or loss and must be
  // tinted like one. `<MatchStripView>` derives its outcome from the scores
  // alone, so gating on `=== "finished"` here made the two surfaces disagree
  // about the same match (#2423). `stopped` stays out — nothing is settled.
  if (!isSettledMatch(match.status)) return null;
  if (
    typeof match.homeScore !== "number" ||
    typeof match.awayScore !== "number" ||
    isHome === undefined
  ) {
    return null;
  }
  return getResultColor(match.homeScore, match.awayScore, isHome);
}

function formatDay(date: Date): string {
  return DateTime.fromJSDate(date).setLocale("nl").toFormat("d");
}

function formatMonth(date: Date): string {
  return DateTime.fromJSDate(date)
    .setLocale("nl")
    .toFormat("MMM")
    .replace(/\.$/, "")
    .toLowerCase();
}

function formatKickoff(match: ScheduleMatch): string {
  if (match.time) return match.time;
  return DateTime.fromJSDate(match.date).setLocale("nl").toFormat("HH:mm");
}

/**
 * Team name with an optional designation suffix ("A" / "B" / "U23").
 *
 * Name and suffix share ONE truncating box, so the ellipsis eats the suffix
 * before it touches the club name (#2405). The suffix used to be a `shrink-0`
 * sibling pinned outside the truncation, which inverted the priority: "Yellow
 * Red KV Mechelen U23" clipped to "Yellow Red KV Mech… U23", keeping the three
 * characters a reader can infer and dropping the ones they cannot. A reader
 * scanning for the opponent needs the club; the squad is the detail that gives
 * way first.
 *
 * `block` is load-bearing: the mobile layout hands this a plain `<div>` parent,
 * and `overflow: hidden` does nothing on an inline box. In the desktop flex row
 * the flex container blockifies it anyway, so one class serves both.
 */
function TeamName({
  team,
  featured,
  bold = false,
  align = "left",
}: {
  team: ScheduleMatch["homeTeam"];
  featured: boolean;
  bold?: boolean;
  align?: "left" | "right";
}) {
  return (
    <span
      className={cn(
        "block min-w-0 flex-1 truncate text-sm",
        align === "right" && "text-right",
        featured ? "text-white" : "text-ink",
        bold && "font-semibold",
      )}
    >
      {team.name}
      {team.teamLabel ? (
        <>
          {/* A real space, not a margin — the suffix now sits inside the name's
              text run, so the gap has to survive into the text content or the
              row reads as "MechelenU23" to a screen reader. */}{" "}
          <span
            className={cn(
              "font-mono text-[10px] font-semibold tracking-wide",
              // White on jersey-deep / ink-muted on cream — matches the
              // competition caption's contrast-safe tones.
              featured ? "text-white" : "text-ink-muted",
            )}
          >
            {team.teamLabel}
          </span>
        </>
      ) : null}
    </span>
  );
}

export function TeamAgendaRow({
  match,
  kcvvTeamId,
  featured = false,
  showDateStub = true,
  onNavigate,
  captionLabel,
  upcomingLabel,
  kind,
  className,
}: TeamAgendaRowProps) {
  // Prefer match.is_home (provided by BFF); fall back to comparing kcvvTeamId
  // against the home team's id when the BFF field is absent.
  const isHome: boolean | undefined =
    match.isHome ??
    (kcvvTeamId !== undefined ? kcvvTeamId === match.homeTeam.id : undefined);

  const outcome = computeOutcome(match, isHome);
  const isPlayed = isPlayedMatch(match.status);

  // White on jersey-deep, inherited from the pre-#2395 green when cream missed
  // AA there. Both clear it now (white 5.29:1, cream 4.69:1) — see DESIGN.md
  // "Chips / Labels" for the open reconcile-to-cream question.
  const monoClass = featured ? "text-white" : "text-ink-muted";

  const hasScoreline =
    isPlayed &&
    typeof match.homeScore === "number" &&
    typeof match.awayScore === "number";
  // Show the upcoming label ("Gepland") only for not-yet-played matches when one
  // was supplied. Gating on status (not merely the absence of a scoreline) keeps
  // a finished match with missing scores on the kickoff time rather than wrongly
  // reading "Gepland".
  const showUpcomingLabel = !isPlayed && upcomingLabel != null;
  // Once, not twice: the score slot and the accessible name both want it on a
  // scheduled row.
  const kickoff = formatKickoff(match);
  const scoreOrTime = hasScoreline
    ? `${match.homeScore} – ${match.awayScore}`
    : showUpcomingLabel
      ? upcomingLabel
      : kickoff;

  // Scorelines and kickoff times use the big display face; the "Gepland" label
  // drops to the mono caption register (cf. the mockup `.score.sched`).
  const scoreToneClass = showUpcomingLabel
    ? monoClass
    : featured
      ? "text-white"
      : "text-ink";

  const outlineShadow = outcome ? OUTCOME_UNDERLINE[outcome] : undefined;

  const cardBase = cn(
    "flex items-stretch gap-0",
    "border-2",
    PRESS_DOWN_CLASSES,
    featured
      ? // Soft ink-muted offset (the design-system dark-card shadow, cf.
        // `--shadow-paper-sm-soft`) — a cream shadow vanished against the cream
        // page, and a dark-green one would blend into the jersey-deep body.
        "bg-jersey-deep border-jersey-deep text-white shadow-[2px_2px_0_0_var(--color-ink-muted)]"
      : "bg-cream border-ink text-ink shadow-[2px_2px_0_0_var(--color-ink)]",
    className,
  );

  const stubBorder = featured
    ? "border-r-2 border-dashed border-cream/40"
    : "border-r-2 border-dashed border-ink/30";

  const day = formatDay(match.date);
  const month = formatMonth(match.date);

  // A status the layout can't speak for on its own — a forfeit otherwise reads
  // as a bare scoreline, an `afgelast` match as a kickoff to turn up for. The
  // wording comes from `<MatchStatusBadge>`'s table so "Forfait" is spelled the
  // same here as on the match hero; only the chrome differs, because the badge's
  // bordered block would not survive this 9px caption line (#2423).
  const statusWording = isExceptionalMatchStatus(match.status)
    ? matchStatusWording(match.status)
    : null;

  // See `kind` for the resolution order. `statusWording` wins over the slot
  // word — "Volgende · AFG" would argue with itself — but not over an outcome,
  // because a forfeit is settled and still has a winner to name.
  const kindWord =
    kind == null
      ? null
      : outcome
        ? OUTCOME_WORD[outcome]
        : statusWording
          ? null
          : MATCH_KIND_WORD[kind];

  // The `aria-label` replaces the row's contents as its accessible name, so
  // anything not spelled out here is unreachable by a screen reader tabbing the
  // links — and until #2404 that included the scoreline itself. Stated
  // side-by-side with each name, the way `<MatchStripView>`'s ledger rows do it,
  // since "3 – 1" alone does not say whose goals are whose.
  const scoreboardLabel = hasScoreline
    ? `${match.homeTeam.name} ${match.homeScore} – ${match.awayTeam.name} ${match.awayScore}`
    : `${match.homeTeam.name} – ${match.awayTeam.name}`;
  const matchLabel = [
    kindWord ? `${kindWord}: ` : "",
    scoreboardLabel,
    `, ${day} ${month}`,
    // `scheduled`, not merely `!isPlayed`: a postponed or cancelled match is
    // also not played, and announcing its kickoff would tell a screen-reader
    // user to turn up for a match that is off — the same failure the visible
    // `statusWording` marker exists to prevent (#2423). A `upcomingLabel`
    // surface ("Gepland") has deliberately dropped the precise time.
    match.status === "scheduled" && !showUpcomingLabel
      ? ` om ${formatKickoff(match)}`
      : "",
    // And the status itself has to reach the name, not just the caption: the
    // label replaces the row's contents, so a forfeit otherwise announces as a
    // plain win. Long form here — there is no width to save in a string.
    statusWording ? ` — ${statusWording.longForm}` : "",
  ].join("");

  // Caption (P2) shared by both layouts: the optional kind word, an optional
  // status marker, then an optional jersey-deep squad label (e.g. "A-Ploeg"),
  // then the competition. Rendered once, reused below.
  //
  // Built as a list and interleaved once rather than as a ladder of `a && (b ||
  // c || d) ? " · "` separators — each of those has to name every later segment,
  // so a fourth entry (#2404's kind word) meant a third separator and a re-read
  // of the two before it. A missed tail-check shows up as a stray or swallowed
  // separator, which nothing here would fail on.
  //
  // On jersey-deep every emphasised segment collapses to `warm`; only the cream
  // side gives each one its own tone.
  const emphasis = (creamTone: string) =>
    cn("font-semibold", featured ? "text-warm" : creamTone);

  const captionParts = [
    kindWord ? <span className={emphasis("text-ink")}>{kindWord}</span> : null,
    statusWording ? (
      // Abbreviation, not the long form: this caption shares a fixed-width
      // centre column with the scoreline, so every extra character is taken
      // straight off the team names either side — "FORFAIT · BEKER VAN
      // VLAAMS-BRABANT" truncated them to "SK No…" / "KCV…". `FF` / `AFG`
      // are the same short forms `<MatchStatusBadge>` renders, and `<abbr>`
      // carries the long form for hover and assistive tech.
      <abbr
        title={statusWording.longForm}
        className={cn(emphasis("text-alert"), "no-underline")}
      >
        {statusWording.abbreviation}
      </abbr>
    ) : null,
    captionLabel ? (
      <span className={emphasis("text-jersey-deep")}>{captionLabel}</span>
    ) : null,
    // `||` not `??` — an empty-string competition must drop out, not render a
    // trailing separator.
    match.competition || null,
  ].filter(Boolean);

  const captionContent = captionParts.length ? (
    <>
      {captionParts.map((part, i) => (
        // `<Fragment>` adds no DOM node, so the caption's text content and its
        // pixels are unchanged by the interleave.
        <Fragment key={i}>
          {i > 0 ? " · " : null}
          {part}
        </Fragment>
      ))}
    </>
  ) : null;

  return (
    <Link
      href={`/wedstrijd/${match.id}`}
      aria-label={matchLabel}
      onClick={onNavigate}
      className="focus-visible:outline-ink block no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <article
        data-testid="team-agenda-row"
        data-featured={featured}
        className={cardBase}
      >
        {/* Date stub */}
        {showDateStub ? (
          <div
            className={cn(
              "flex shrink-0 flex-col items-center justify-center gap-0 px-3 py-3",
              stubBorder,
              featured ? "bg-jersey-deep" : "bg-cream-soft/30",
            )}
            aria-label={`${day} ${month}`}
          >
            <span
              className={cn(
                "font-display-big text-[18px] leading-none",
                featured ? "text-white" : "text-ink",
              )}
            >
              {day}
            </span>
            <span
              className={cn(
                "font-mono text-[11px] tracking-widest uppercase",
                monoClass,
              )}
            >
              {month}
            </span>
          </div>
        ) : null}

        {/* Desktop layout (sm+): symmetric scoreboard */}
        {/*
          The caption sits on its own full-width line rather than inside the
          centre column. A flex column is as wide as its widest child, and that
          column is `shrink-0` — so a caption wider than the scoreline used to
          set the column's width and never give it back, and the two `flex-1
          min-w-0` sides absorbed the whole cost by truncating the club names
          ("BEKER VAN BRABANT" → "SK Noss…" / "KCVV Ele…"). Being visually below
          the score never mattered; they shared a box.
        */}
        <div className="hidden w-full flex-col justify-center px-3 py-2 sm:flex">
          <div className="flex w-full items-center gap-2">
            {/* Home side */}
            <div
              className="flex min-w-0 flex-1 items-center gap-2"
              title={match.homeTeam.name}
            >
              <Crest name={match.homeTeam.name} logo={match.homeTeam.logo} />
              <TeamName
                team={match.homeTeam}
                featured={featured}
                bold={isHome === true}
              />
            </div>

            {/* Score / time */}
            <span
              className={cn(
                "shrink-0 leading-none",
                showUpcomingLabel
                  ? "font-mono text-[11px] font-semibold tracking-wider uppercase"
                  : "font-display-big text-[18px] tabular-nums",
                scoreToneClass,
              )}
              style={
                outlineShadow
                  ? { boxShadow: outlineShadow, padding: "0 8px" }
                  : { padding: "0 8px" }
              }
            >
              {scoreOrTime}
            </span>

            {/* Away side */}
            <div
              className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2"
              title={match.awayTeam.name}
            >
              <Crest name={match.awayTeam.name} logo={match.awayTeam.logo} />
              <TeamName
                team={match.awayTeam}
                featured={featured}
                bold={isHome === false}
                align="right"
              />
            </div>
          </div>

          {captionContent ? (
            <span
              className={cn(
                "mt-0.5 text-center font-mono text-[9px] tracking-wider uppercase",
                monoClass,
              )}
            >
              {captionContent}
            </span>
          ) : null}
        </div>

        {/* Mobile layout: KCVV-centric column */}
        <div className="flex w-full items-center gap-2 px-3 py-2 sm:hidden">
          {/* Opponent crest + name + competition */}
          {(() => {
            const opponent = isHome ? match.awayTeam : match.homeTeam;
            const VenueIcon = isHome ? House : Bus;
            return (
              <>
                <Crest name={opponent.name} logo={opponent.logo} />
                <div className="min-w-0 flex-1" title={opponent.name}>
                  <TeamName team={opponent} featured={featured} bold />
                  {captionContent ? (
                    <span
                      className={cn(
                        "font-mono text-[9px] tracking-wider uppercase",
                        monoClass,
                      )}
                    >
                      {captionContent}
                    </span>
                  ) : null}
                </div>
                <VenueIcon
                  size={14}
                  aria-label={
                    isHome ? HOME_AWAY_A11Y_NAME.home : HOME_AWAY_A11Y_NAME.away
                  }
                  className={cn(
                    "shrink-0",
                    featured ? "text-white" : "text-ink-muted",
                  )}
                />
                <span
                  className={cn(
                    "shrink-0 leading-none",
                    showUpcomingLabel
                      ? "font-mono text-[11px] font-semibold tracking-wider uppercase"
                      : "font-display-big text-[16px] tabular-nums",
                    scoreToneClass,
                  )}
                  style={
                    outlineShadow
                      ? { boxShadow: outlineShadow, padding: "0 6px" }
                      : { padding: "0 6px" }
                  }
                >
                  {scoreOrTime}
                </span>
              </>
            );
          })()}
        </div>
      </article>
    </Link>
  );
}
