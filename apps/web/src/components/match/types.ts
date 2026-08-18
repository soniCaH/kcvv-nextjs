/**
 * Shared match domain types.
 * Imported by all match-domain components — keep this file free of
 * React / component dependencies so it can be used anywhere in the app.
 */

export type { MatchStatus } from "@kcvv/api-contract";

import type { MatchStatus } from "@kcvv/api-contract";

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
   * Discriminant against `ScheduleReservation` below. Required — an optional
   * `isPlaceholder?: false` would let a construction site that simply omits
   * the field type-check as `ScheduleMatch` with no complaint, defeating the
   * entire point of the union (a code-review finding on #2688's first draft:
   * the doc here claimed a compile error that the optional marker didn't
   * actually produce). Required and literal `false` means every site that
   * builds this object must say which kind of row it's building.
   */
  isPlaceholder: false;
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
 * Either a genuine fixture or a pitch-reservation placeholder. The one type
 * every match-row renderer and every `Match` → view-model adapter should
 * accept/return from here on — see `ScheduleReservation`'s doc for why the
 * split is a compile-time guardrail, not just documentation.
 */
export type ScheduleRow = ScheduleMatch | ScheduleReservation;

export interface UpcomingMatch {
  /**
   * Discriminant against `UpcomingReservation` below — required, mirroring
   * `ScheduleMatch`/`ScheduleReservation` (#2688). The homepage's other-teams
   * agenda (`<UpcomingMatchesClient>`) is the surface most likely to carry a
   * pitch reservation: it renders exactly the non-senior/youth matches, and
   * youth tournaments are where reservations come from.
   */
  isPlaceholder: false;
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
 * agenda (`<UpcomingMatchesClient>`). Mirrors `ScheduleReservation` — one
 * `team`, never `homeTeam`/`awayTeam`/scores — but keeps the squad-
 * identifying fields (`squadLabel`/`kcvvTeamId`/`kcvvTeamLabel`/`teamLabel`)
 * `UpcomingMatch` carries, because this surface's filter chips bucket every
 * row by squad and a reservation still belongs to exactly one squad — it
 * must file under the same chip a real fixture for that squad would
 * (code-review finding on #2688).
 */
export interface UpcomingReservation {
  isPlaceholder: true;
  /** Match ID */
  id: number;
  /** Match date */
  date: Date;
  /** Match time (optional) — the real kickoff/meeting time, never "hele dag". */
  time?: string;
  /** Venue/location (optional) */
  venue?: string;
  /** The club's own crest/name — a self-match names one side, not two. */
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  /** Match status — a reservation can be cancelled/postponed like any fixture. */
  status: MatchStatus;
  /** Competition name — the reservation's subject (e.g. "Tornooi"), when PSD sends one. */
  competition?: string;
  /** Front-end squad short code (e.g. "U13") — see `UpcomingMatch.squadLabel`. */
  squadLabel?: string;
  /** PSD team ID identifying which KCVV team the reservation belongs to. */
  kcvvTeamId?: number;
  /** Canonical human-readable squad label — see `UpcomingMatch.kcvvTeamLabel`. */
  kcvvTeamLabel?: string;
  /** Optional display-time team label set by the calling page. */
  teamLabel?: string;
}

/**
 * Either a genuine upcoming fixture or a pitch-reservation placeholder — the
 * shape `<UpcomingMatchesClient>` and `mapMatchToUpcomingMatch` should
 * accept/return from here on.
 */
export type UpcomingRow = UpcomingMatch | UpcomingReservation;
