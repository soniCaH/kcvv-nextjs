/**
 * Helpers for the article detail page (`/nieuws/[slug]`). Kept out of
 * `page.tsx` so the pure mappers are unit-testable without pulling in the
 * server-only Effect runtime / repositories.
 */
import type { MatchDetail } from "@kcvv/api-contract";
import type { HeroMatchData } from "@/components/article/EditorialHero";
import { KCVV_CLUB_ID } from "@/lib/constants";
import { formatMatchWidgetDate } from "@/lib/utils/dates";
import { isReducedMatchRow } from "@/lib/utils/match-display";
import { extractMatchTime } from "@/lib/utils/match-time";

/**
 * Parse the PSD match id off an article's `linkedMatch`. The field is a plain
 * string an editor copies out of `/wedstrijd/[matchId]`, so it can hold
 * anything. Only a positive safe integer addresses a real match — `"0"`, a
 * negative, a fraction or a value past `Number.MAX_SAFE_INTEGER` would reach
 * the BFF as a guaranteed-miss round-trip. Returns `null` when there is
 * nothing worth fetching.
 */
export function parsePsdMatchId(
  linkedMatch: string | null | undefined,
): number | null {
  if (!linkedMatch) return null;
  const matchId = Number(linkedMatch);
  return Number.isSafeInteger(matchId) && matchId > 0 ? matchId : null;
}

/**
 * Map the BFF `MatchDetail` onto the score-forward hero's `HeroMatchData`
 * (5.d-mat). KCVV side is id-driven, never name-based (see
 * `feedback_psd_match_identification`):
 *   1. prefer the team-scoped `is_home` flag when present, but
 *   2. `getMatchDetail` has no teamId context and leaves `is_home` null, so
 *      fall back to matching the KCVV club id against the two sides' ids.
 * Without (2) the KCVV crest ring + Doelpunten highlight would never render
 * on the real article page (the flag is only ever set by `/matches/*`).
 *
 * `null` for a pitch-reservation placeholder or a tournament fixture with no
 * result yet (#2606/#2696/#2802 review) — a self-match has no opponent to
 * put on either side of the score bar, and an unconfirmed tournament
 * opponent is the same unconfirmed claim, so building either anyway
 * rendered a two-crest bar naming a club as a settled opponent it isn't
 * (AC 3). `HeroMatchData` itself stays a plain (non-union) shape rather than
 * growing a third member for this one caller: `EditorialHero` already
 * degrades gracefully to the kicker-only shell for `match: null` (a 404'd
 * match reaches the same path), so both reduced states reuse that existing,
 * correct fallback instead of a bespoke reduced hero.
 */
export function toHeroMatchData(match: MatchDetail): HeroMatchData | null {
  if (
    match.is_placeholder ||
    isReducedMatchRow({
      isPlaceholder: false,
      competitionType: match.competitionType,
      status: match.status,
      homeScore: match.home_team.score,
      awayScore: match.away_team.score,
    })
  ) {
    return null;
  }
  const kcvvSide =
    match.is_home === true
      ? "home"
      : match.is_home === false
        ? "away"
        : match.home_team.id === KCVV_CLUB_ID
          ? "home"
          : match.away_team.id === KCVV_CLUB_ID
            ? "away"
            : undefined;
  return {
    homeTeam: { name: match.home_team.name, logo: match.home_team.logo },
    awayTeam: { name: match.away_team.name, logo: match.away_team.logo },
    kcvvSide,
    homeScore: match.home_team.score,
    awayScore: match.away_team.score,
    kickoffTime: extractMatchTime(match),
    status: match.status,
    competition: match.competition,
    matchDate: formatMatchWidgetDate(match.date),
  };
}
