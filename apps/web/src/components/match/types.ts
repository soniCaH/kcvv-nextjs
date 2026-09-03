/**
 * Shared match domain types.
 * Imported by all match-domain components — keep this file free of
 * React / component dependencies so it can be used anywhere in the app.
 */

export type { CompetitionType, MatchStatus } from "@kcvv/api-contract";

import type { CompetitionType, MatchStatus } from "@kcvv/api-contract";

export interface ScheduleTeam {
  /** Team ID */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo?: string;
  /**
   * Team designation within the club (e.g. "A", "B", "U23"), provided by the
   * BFF via `MatchTeam.team_label`. Present mainly for opponents that field a
   * non-first team; absent for the tracked club's own side.
   */
  teamLabel?: string;
}

export interface ScheduleMatch {
  /**
   * Discriminant against `ScheduleReservation`/`ScheduleReducedMatch` below.
   * Required — an optional `isPlaceholder?: false` would let a construction
   * site that simply omits the field type-check as `ScheduleMatch` with no
   * complaint, defeating the entire point of the union. Required and literal
   * `false` means every site that builds this object must say which kind of
   * row it's building.
   *
   * Not the full discriminant on its own once `ScheduleReducedMatch` exists —
   * both it and `ScheduleMatch` carry `isPlaceholder: false` (a tournament
   * fixture with a hidden result is not a reservation), so narrow on `kind`
   * to tell them apart. Kept, rather than dropped in favour of `kind` alone,
   * so every existing `match.isPlaceholder` narrowing site keeps working
   * unchanged for the one distinction it always answered correctly: is this
   * a self-match with no second side at all.
   */
  isPlaceholder: false;
  /** Discriminant against `ScheduleReservation`/`ScheduleReducedMatch`. */
  kind: "match";
  /** Match ID */
  id: number;
  /** Match date */
  date: Date;
  /** Match time (HH:MM) */
  time?: string;
  /** Home team */
  homeTeam: ScheduleTeam;
  /** Away team */
  awayTeam: ScheduleTeam;
  /** Home team score (for finished matches) */
  homeScore?: number;
  /** Away team score (for finished matches) */
  awayScore?: number;
  /** Match status */
  status: MatchStatus;
  /** Competition name */
  competition?: string;
  /**
   * Structured league/cup/friendly/tournament classification (#2692),
   * mirrored from `Match.competitionType`. Absent when the BFF can't resolve
   * it. The lawful tournament detector — `competitionType === "tournament"`
   * — never the Dutch `competition` label, which is a division/competition
   * name, not a type (#2696, mirroring the `competitionType === "league"`
   * gate).
   */
  competitionType?: CompetitionType;
  /** Whether the tracked team is playing at home. Provided by BFF via Match.is_home. */
  isHome?: boolean;
}

/**
 * A pitch-reservation placeholder (#2606) — both sides of the fixture are the
 * same club. The club enters these deliberately ("this team has something
 * that day, the details aren't settled"), for its own tournaments and for
 * external ones alike, so there is no second side to render and nothing to
 * navigate to (`/wedstrijd/{id}` for a placeholder is a reduced page, not a
 * destination worth linking to from an agenda row — #2606 decision 5, #2688).
 *
 * Deliberately a **different shape** from `ScheduleMatch`, not the same shape
 * with a boolean toggled — `awayTeam`/`homeScore`/`awayScore`/`isHome` do not
 * exist here, so a renderer that reaches for an opponent without narrowing
 * `match.isPlaceholder` first (`opponentOf`, a hand-built desktop slide, a
 * two-hop calendar adapter) fails to compile instead of printing "KCVV
 * Elewijt — KCVV Elewijt". See `reservationView()` in
 * `@/lib/utils/match-display` for the shared subject/status derivation every
 * renderer of this shape should use — `<TeamAgendaRow>` (#2606) is the prior
 * art for the reduced treatment itself.
 */
export interface ScheduleReservation {
  isPlaceholder: true;
  /** Discriminant against `ScheduleMatch`/`ScheduleReducedMatch`. */
  kind: "reservation";
  /** Match ID */
  id: number;
  /** Match date */
  date: Date;
  /** Match time (HH:MM) — the real kickoff/meeting time, never "hele dag". */
  time?: string;
  /**
   * The club's own crest/name. A self-match names one side, not two — both
   * `home_team`/`away_team` carry the same club upstream, so there is no
   * "home" or "away" designation to keep.
   */
  team: ScheduleTeam;
  /** Match status — a reservation can be cancelled/postponed like any fixture. */
  status: MatchStatus;
  /** Competition name — the reservation's subject (e.g. "Tornooi"), when PSD sends one. */
  competition?: string;
}

/**
 * A tournament fixture (#2696) with no result yet — `competitionType ===
 * "tournament"` and no scoreline. Unlike `ScheduleReservation` the two sides
 * really are different clubs, but PSD does not say whether the named club
 * hosts the tournament or merely shares its bracket, so the row states only
 * that the club is *where* the tournament is (`team`, resolved via club-id
 * equality — never home/away), the same reduced treatment a reservation
 * gets (#2693 decision: one shared layout, not a second one).
 *
 * `awayTeam`/`homeScore`/`awayScore` do not exist here for the same compile-
 * time reason `ScheduleReservation` drops them — a renderer reaching for the
 * scoreboard fields without narrowing `kind` first fails to compile. This is
 * not data loss: `isReducedMatchRow()` is re-evaluated from the raw `Match`
 * on every transform call, so the moment PSD publishes a scoreline the same
 * fixture id transforms to a `ScheduleMatch` instead — the "reduced → full
 * scoreboard" transition is the adapter picking a different union member on
 * its next call, not a mutation of this one.
 */
export interface ScheduleReducedMatch {
  isPlaceholder: false;
  /** Discriminant against `ScheduleMatch`/`ScheduleReservation`. */
  kind: "reduced";
  /** Match ID */
  id: number;
  /** Match date */
  date: Date;
  /** Match time (HH:MM). */
  time?: string;
  /** The other club's crest/name — see the class doc for why it's never "the opponent". */
  team: ScheduleTeam;
  /** Match status — a reduced fixture can be cancelled/postponed too. */
  status: MatchStatus;
  /** Competition name — composes the row's subject together with `team.name` (#2696). */
  competition?: string;
  /** Structured classification — always `"tournament"` in practice, kept for symmetry with `ScheduleMatch`. */
  competitionType?: CompetitionType;
}

/**
 * A genuine fixture, a pitch-reservation placeholder, or a tournament
 * fixture with a hidden result. The one type every match-row renderer and
 * every `Match` → view-model adapter should accept/return from here on — see
 * `ScheduleReservation`/`ScheduleReducedMatch`'s docs for why the split is a
 * compile-time guardrail, not just documentation.
 */
export type ScheduleRow =
  ScheduleMatch | ScheduleReservation | ScheduleReducedMatch;

export interface UpcomingMatch {
  /**
   * Discriminant against `UpcomingReservation` below — required, mirroring
   * `ScheduleMatch`/`ScheduleReservation` (#2688). The homepage's other-teams
   * agenda (`<UpcomingMatchesClient>`) is the surface most likely to carry a
   * pitch reservation: it renders exactly the non-senior/youth matches, and
   * youth tournaments are where reservations come from.
   */
  isPlaceholder: false;
  /**
   * Discriminant against `UpcomingReservation`/`UpcomingReducedMatch` — see
   * `ScheduleMatch.kind` for why `isPlaceholder` alone can no longer tell
   * `UpcomingMatch` and `UpcomingReducedMatch` apart.
   */
  kind: "match";
  /** Match ID */
  id: number;
  /** Match date */
  date: Date;
  /** Match time (optional) */
  time?: string;
  /** Venue/location (optional) */
  venue?: string;
  /** Home team */
  homeTeam: {
    id: number;
    name: string;
    logo?: string;
    score?: number;
  };
  /** Away team */
  awayTeam: {
    id: number;
    name: string;
    logo?: string;
    score?: number;
  };
  /** Match status */
  status: MatchStatus;
  /**
   * Front-end squad short code (e.g. "A-Ploeg", "U21") used for internal
   * identification of which KCVV squad is playing. Prefer `kcvvTeamLabel`
   * for display when available.
   */
  squadLabel?: string;
  /** Competition name (optional) */
  competition?: string;
  /** PSD team ID identifying which KCVV team plays (A-team, U21, etc.) */
  kcvvTeamId?: number;
  /**
   * Canonical human-readable label for the KCVV team (e.g. "A-Ploeg", "U21")
   * provided by the BFF via `kcvv_team_label`. Preferred for display over
   * `squadLabel`.
   */
  kcvvTeamLabel?: string;
  /**
   * Optional display-time team label set by the calling page. When present,
   * overrides `kcvvTeamLabel` for rendering.
   */
  teamLabel?: string;
}

/**
 * A pitch-reservation placeholder (#2606) on the homepage's other-teams
 * agenda (`<UpcomingMatchesClient>`). `ScheduleReservation` plus the deltas
 * this surface actually needs: `venue` (this route's own field) and the
 * squad-identifying fields (`squadLabel`/`kcvvTeamLabel`/`teamLabel`) —
 * kept because this surface's filter chips bucket every row by squad and a
 * reservation still belongs to exactly one squad, so it must file under the
 * same chip a real fixture for that squad would. No `kcvvTeamId`: nothing
 * reads it (`<UpcomingMatchesClient>`'s own `kcvvTeamId` is always the
 * club-id prop, never a field read off a row).
 */
export interface UpcomingReservation extends Omit<
  ScheduleReservation,
  "team" | "kind"
> {
  /** Discriminant against `UpcomingMatch`/`UpcomingReducedMatch`. */
  kind: "reservation";
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  /** Venue/location (optional) */
  venue?: string;
  /** Front-end squad short code (e.g. "U13") — see `UpcomingMatch.squadLabel`. */
  squadLabel?: string;
  /** Canonical human-readable squad label — see `UpcomingMatch.kcvvTeamLabel`. */
  kcvvTeamLabel?: string;
  /** Optional display-time team label set by the calling page. */
  teamLabel?: string;
}

/**
 * A tournament fixture with a hidden result (#2696) on the homepage's
 * other-teams agenda — `ScheduleReducedMatch`'s deltas for this surface,
 * mirroring `UpcomingReservation`'s relationship to `ScheduleReservation`.
 * `<UpcomingMatchesClient>` had no reduced treatment at all before this
 * ticket (unlike `<TeamAgendaRow>`/`<MatchStripView>`/`/kalender`, which all
 * call `isReducedMatchRow` already) — a not-yet-played tournament fixture
 * for a non-senior team rendered the full linked scoreboard here, the exact
 * gap the shared `kind` discriminant closes by construction.
 */
export interface UpcomingReducedMatch extends Omit<
  ScheduleReducedMatch,
  "team" | "kind"
> {
  /** Discriminant against `UpcomingMatch`/`UpcomingReservation`. */
  kind: "reduced";
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  /** Venue/location (optional) */
  venue?: string;
  /** Front-end squad short code (e.g. "U13") — see `UpcomingMatch.squadLabel`. */
  squadLabel?: string;
  /** Canonical human-readable squad label — see `UpcomingMatch.kcvvTeamLabel`. */
  kcvvTeamLabel?: string;
  /** Optional display-time team label set by the calling page. */
  teamLabel?: string;
}

/**
 * A genuine upcoming fixture, a pitch-reservation placeholder, or a
 * tournament fixture with a hidden result — the shape
 * `<UpcomingMatchesClient>` and `mapMatchToUpcomingMatch` should
 * accept/return from here on.
 */
export type UpcomingRow =
  UpcomingMatch | UpcomingReservation | UpcomingReducedMatch;
