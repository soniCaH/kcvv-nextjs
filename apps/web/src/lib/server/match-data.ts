import { cache } from "react";
import { Effect } from "effect";
import { runPromise } from "@/lib/effect/runtime";
import { BffService } from "@/lib/effect/services/BffService";
import { TeamRepository } from "@/lib/repositories/team.repository";
import { transformMatchToSchedule } from "@/components/match/transform";
import {
  pickLastResult,
  pickNextFixture,
} from "@/components/home/FirstTeamsBlock/first-teams";
import type { ScheduleMatch } from "@/components/match/types";

/**
 * How long a finished match stays newsworthy enough to headline the strip.
 * Past this, the strip drops back to fixture-only — a result from a fortnight
 * ago at the top of every landing page reads as stale, not as news.
 */
export const RESULT_RECENCY_MS = 72 * 60 * 60 * 1000;

export interface MatchStripData {
  /** Most recent finished match, only when inside `RESULT_RECENCY_MS`. */
  result: ScheduleMatch | null;
  /** Next scheduled fixture. */
  fixture: ScheduleMatch | null;
}

/**
 * The A side drives the strip: senior (non-youth) teams carrying a `psdId`,
 * sorted by slug so `eerste-elftallen-a` precedes `-b`. Mirrors the filter the
 * homepage uses for `<FirstTeamsBlock>` (#2211) — keep the two in step.
 */
function pickFirstTeamPsdId(
  teams: readonly { psdId: string | null; age: string | null; slug: string }[],
): number | null {
  const senior = teams
    .filter((t) => t.psdId && !(t.age ?? "").toUpperCase().startsWith("U"))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const first = senior[0];
  return first?.psdId ? Number(first.psdId) : null;
}

/**
 * Fetch the first team's last result and next fixture for `<MatchStrip>`.
 *
 * Reads the A side's full season feed rather than the club-wide
 * `getNextMatches()` — that endpoint only ever returns upcoming matches, so
 * the strip was structurally incapable of showing a score (#2387). The
 * result/fixture split reuses `pickLastResult` / `pickNextFixture` from
 * `first-teams.ts`, so the strip and `<FirstTeamsBlock>` cannot disagree about
 * which match is "the last one".
 *
 * Returns `null` when neither side is available or any call fails: the strip
 * is chrome on landing pages, and a dead upstream must not take the page with
 * it. The homepage surfaces the outage separately, in the match sections that
 * own that story.
 *
 * Wrapped in React `cache()` for request-level deduplication — multiple Server
 * Components calling this in the same render share a single fetch.
 */
export const getFirstTeamStripData = cache(
  async function getFirstTeamStripData(): Promise<MatchStripData | null> {
    try {
      const teams = await runPromise(
        Effect.gen(function* () {
          const repo = yield* TeamRepository;
          return yield* repo.findAll();
        }),
      );

      const psdId = pickFirstTeamPsdId(teams);
      if (psdId === null) return null;

      const matches = await runPromise(
        Effect.gen(function* () {
          const bff = yield* BffService;
          return yield* bff.getMatches(psdId);
        }),
      );

      const now = new Date();
      const lastResult = pickLastResult(matches, now);
      const nextFixture = pickNextFixture(matches, now);

      const isRecent =
        lastResult !== undefined &&
        now.getTime() - lastResult.date.getTime() <= RESULT_RECENCY_MS;

      const result = isRecent ? transformMatchToSchedule(lastResult) : null;
      const fixture = nextFixture
        ? transformMatchToSchedule(nextFixture)
        : null;

      if (!result && !fixture) return null;
      return { result, fixture };
    } catch {
      return null;
    }
  },
);
