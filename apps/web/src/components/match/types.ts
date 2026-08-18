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
   * Discriminant against `ScheduleReservation` below. Absent/`false` only —
   * never `true` here, so a construction site that forgets to branch on
   * `Match.is_placeholder` gets a compile error at the point it builds this
   * object (a missing/mistyped literal), rather than a `ScheduleMatch` that
   * silently renders a self-match as an ordinary two-crest fixture (#2688).
   */
  isPlaceholder?: false;
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
