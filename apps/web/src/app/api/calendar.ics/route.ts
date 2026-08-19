import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { unstable_cache } from "next/cache";
import { runPromise } from "@/lib/effect/runtime";
import {
  BffService,
  BFF_FAN_OUT_CONCURRENCY,
} from "@/lib/effect/services/BffService";
import { TeamRepository } from "@/lib/repositories/team.repository";
import {
  EventRepository,
  type EventListItemVM,
} from "@/lib/repositories/event.repository";
import type { Match } from "@kcvv/api-contract";
import { generateIcal, normalizeCacheKey } from "@/lib/utils/ical";

export const runtime = "nodejs";

// 15 min — this feed is built from live PSD match data (bff.getMatches), so its
// cache (unstable_cache revalidate + Cache-Control) is aligned to the BFF
// freshness window rather than holding fixtures for 12h.
const CACHE_MAX_AGE = 900;
const MAX_TEAM_IDS = 20;

type Side = "home" | "away" | "all";

function parseSide(raw: string | null): Side {
  if (raw === "home" || raw === "away") return raw;
  return "all";
}

async function fetchMatches(
  teamIdParams: number[] | null,
): Promise<readonly Match[]> {
  const program = Effect.gen(function* () {
    let teamIds: number[];

    if (teamIdParams && teamIdParams.length > 0) {
      teamIds = teamIdParams;
    } else {
      const repo = yield* TeamRepository;
      const teams = yield* repo.findAll();
      teamIds = teams
        .filter((t) => t.psdId != null)
        .map((t) => Number(t.psdId))
        .filter((id) => !isNaN(id) && id > 0);
    }

    const bff = yield* BffService;
    const results = yield* Effect.all(
      teamIds.map((id) => bff.getMatches(id)),
      { concurrency: BFF_FAN_OUT_CONCURRENCY },
    );

    return results.flat();
  });

  return runPromise(program);
}

/**
 * Club activities (#2704) — the same merged feed `/kalender` renders
 * (`EventRepository.findUpcomingForList()`), upcoming-only by construction
 * (its GROQ filters, not a re-filter here).
 *
 * Cached under its own key, decoupled from `teamIds`/`side` (#2711 review) —
 * the flag is club-wide, so every distinct team selection a subscriber can
 * make would otherwise re-run this same two-query Sanity read on its own
 * 15-minute cycle; an unbounded number of team combinations meant an
 * effectively unbounded number of redundant reads for identical data.
 *
 * Deliberately *not* degraded inside this cached callback: `unstable_cache`
 * only overwrites its entry when the wrapped function resolves, so letting a
 * Sanity failure throw here means Next never caches it — the existing
 * last-good value (or nothing, if there isn't one yet) survives, matching
 * this repo's ISR rule ("caught ⇒ CACHED, throw ⇒ last-good", see root
 * CLAUDE.md's Effect & Server Component Patterns). `fetchEvents` below is
 * where the degrade to `[]` actually happens, one layer above this boundary,
 * so a failure here never gets written into the cache.
 */
const fetchUpcomingEventsCached = unstable_cache(
  (): Promise<EventListItemVM[]> =>
    runPromise(
      Effect.gen(function* () {
        const eventRepo = yield* EventRepository;
        return yield* eventRepo.findUpcomingForList();
      }),
    ),
  ["ical:events"],
  { revalidate: CACHE_MAX_AGE },
);

/** Degrades the read above to `[]` on failure — see its doc for why the catch lives here, outside the cache boundary. */
async function fetchEvents(): Promise<EventListItemVM[]> {
  try {
    return await fetchUpcomingEventsCached();
  } catch (error) {
    console.warn(
      "[Calendar API] event-feed lookup failed; rendering matches only.",
      error,
    );
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawTeamIds = searchParams.get("teamIds");
  const side = parseSide(searchParams.get("side"));
  const includeEvents = searchParams.get("events") === "1";
  const cacheKey = normalizeCacheKey(rawTeamIds, side, includeEvents);

  const teamIdNums = rawTeamIds
    ? rawTeamIds
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0)
        .slice(0, MAX_TEAM_IDS)
    : null;

  try {
    const generateCached = unstable_cache(
      async () => {
        const [matches, events] = await Promise.all([
          fetchMatches(teamIdNums),
          includeEvents
            ? fetchEvents()
            : Promise.resolve<EventListItemVM[]>([]),
        ]);
        return generateIcal(matches, { side, includeEvents, events });
      },
      [cacheKey],
      { revalidate: CACHE_MAX_AGE },
    );

    const icalOutput = await generateCached();
    const filename = includeEvents
      ? "kcvv-wedstrijden-en-activiteiten.ics"
      : "kcvv-wedstrijden.ics";

    return new NextResponse(icalOutput, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": `max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error("[Calendar API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
