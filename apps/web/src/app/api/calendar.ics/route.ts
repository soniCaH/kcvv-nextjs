import { NextRequest, NextResponse } from "next/server";
import { Effect } from "effect";
import { unstable_cache } from "next/cache";
import { runPromise } from "@/lib/effect/runtime";
import { degradeSection } from "@/lib/effect/degrade";
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
 * (its GROQ filters, not a re-filter here). Degrades like `/kalender` does: a
 * Sanity failure logs and falls back to an empty list rather than failing the
 * whole subscribed feed — a subscriber keeps their matches even on a bad day
 * for Sanity.
 */
async function fetchEvents(): Promise<EventListItemVM[]> {
  const program = Effect.gen(function* () {
    const eventRepo = yield* EventRepository;
    return yield* degradeSection(
      eventRepo.findUpcomingForList(),
      [] as EventListItemVM[],
      "[Calendar API] event-feed lookup failed; rendering matches only.",
    );
  });

  return runPromise(program);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawTeamIds = searchParams.get("teamIds");
  const side = parseSide(searchParams.get("side"));
  // All-or-nothing club-wide opt-in (#2704 design note) — deliberately not
  // scoped by `teamIds`/`side`, which only ever filter fixtures.
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
          includeEvents ? fetchEvents() : Promise.resolve(undefined),
        ]);
        return generateIcal(matches, {
          side,
          ...(events !== undefined ? { events } : {}),
        });
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
