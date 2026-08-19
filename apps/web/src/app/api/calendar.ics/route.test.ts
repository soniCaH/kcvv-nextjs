/**
 * Calendar ICS API Route Tests (#2704)
 *
 * Mocks at the module boundary: `next/cache`'s `unstable_cache` (pass-through,
 * capturing the key it was given so the cache-key test can inspect it),
 * `BffService` (the PSD match fan-out), and `EventRepository` (the club
 * activities feed). `teamIds` is always passed explicitly in these requests so
 * `fetchMatches` never falls through to `TeamRepository.findAll()` — that
 * repository, and the rest of `AppLayer`'s repositories, stay real but unused.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Effect, Layer } from "effect";
import type { Match } from "@kcvv/api-contract";
import type { EventListItemVM } from "@/lib/repositories/event.repository";

const { mockGetMatches, mockFindUpcomingForList, unstableCacheKeys } =
  vi.hoisted(() => ({
    mockGetMatches: vi.fn(),
    mockFindUpcomingForList: vi.fn(),
    unstableCacheKeys: [] as string[][],
  }));

vi.mock("next/cache", () => ({
  unstable_cache: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (...args: any[]) => any,
    keyParts: string[],
  ) => {
    unstableCacheKeys.push(keyParts);
    return fn;
  },
}));

vi.mock("@/lib/effect/services/BffService", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/effect/services/BffService")>();
  return {
    ...actual,
    BffServiceLive: Layer.succeed(actual.BffService, {
      getMatches: mockGetMatches,
      getNextMatches: () => Effect.succeed([]),
      getMatchesWindow: () => Effect.succeed([]),
      getMatchDetail: () => Effect.die("not used by this route"),
      getRanking: () => Effect.succeed([]),
      getRelated: () => Effect.succeed([]),
      getOpponentHistory: () => Effect.die("not used by this route"),
      getPlayerStats: () => Effect.die("not used by this route"),
    }),
  };
});

vi.mock("@/lib/repositories/event.repository", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/lib/repositories/event.repository")
    >();
  return {
    ...actual,
    EventRepositoryLive: Layer.succeed(actual.EventRepository, {
      findAll: () => Effect.succeed([]),
      findUpcomingForList: mockFindUpcomingForList,
      findNextFeatured: () => Effect.succeed(null),
      findBySlug: () => Effect.succeed(null),
      findAllSlugs: () => Effect.succeed([]),
    }),
  };
});

import { GET } from "./route";

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 12345,
    date: new Date("2026-04-15T14:00:00.000Z"),
    time: "16:00",
    venue: undefined,
    home_team: { id: 1235, name: "KCVV Elewijt", score: undefined },
    away_team: { id: 2, name: "KFC Turnhout", score: undefined },
    status: "scheduled",
    squadLabel: "A-Ploeg",
    competition: "2e Nationale",
    ...overrides,
  } as Match;
}

function makeEventItem(
  overrides: Partial<EventListItemVM> = {},
): EventListItemVM {
  return {
    id: "event-1",
    title: "Mosselfestijn",
    href: "/evenementen/mosselfestijn",
    dateStart: "2026-04-14T22:00:00.000Z",
    dateEnd: null,
    eventType: "Clubevent",
    location: "Sportpark Driesput, Elewijt",
    source: "event",
    ...overrides,
  };
}

function makeRequest(query: string): NextRequest {
  return new NextRequest(
    new URL(`/api/calendar.ics?${query}`, "http://localhost:3000"),
  );
}

describe("GET /api/calendar.ics", () => {
  beforeEach(() => {
    unstableCacheKeys.length = 0;
    mockGetMatches.mockReset().mockReturnValue(Effect.succeed([makeMatch()]));
    mockFindUpcomingForList.mockReset().mockReturnValue(Effect.succeed([]));
  });

  it("without the events flag, returns exactly today's matches-only feed — a pinned test proves an existing subscription is unaffected", async () => {
    const response = await GET(makeRequest("teamIds=1235"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("kcvv-match-12345@kcvvelewijt.be");
    expect(body).not.toContain("kcvv-event-");
    expect(body).toContain("X-WR-CALNAME:KCVV Elewijt");
    expect(body).not.toContain("Activiteiten");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="kcvv-wedstrijden.ics"',
    );
  });

  it("events=0 behaves the same as omitting the flag", async () => {
    const response = await GET(makeRequest("teamIds=1235&events=0"));
    const body = await response.text();

    expect(body).not.toContain("kcvv-event-");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="kcvv-wedstrijden.ics"',
    );
  });

  it("events=1 returns the selected teams' fixtures plus every upcoming club activity", async () => {
    mockFindUpcomingForList.mockReturnValue(Effect.succeed([makeEventItem()]));

    const response = await GET(makeRequest("teamIds=1235&events=1"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("kcvv-match-12345@kcvvelewijt.be");
    expect(body).toContain("kcvv-event-event-1@kcvvelewijt.be");
    expect(body).toContain("SUMMARY:Mosselfestijn");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="kcvv-wedstrijden-en-activiteiten.ics"',
    );
  });

  it("degrades to the matches-only feed, not a 500, when the event read fails", async () => {
    mockFindUpcomingForList.mockReturnValue(Effect.die("Sanity is down"));

    const response = await GET(makeRequest("teamIds=1235&events=1"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain("kcvv-match-12345@kcvvelewijt.be");
    expect(body).not.toContain("kcvv-event-");
  });

  it("gives an events=1 request a different cache key than the matches-only request, so neither can serve the other's cached body", async () => {
    await GET(makeRequest("teamIds=1235"));
    await GET(makeRequest("teamIds=1235&events=1"));

    expect(unstableCacheKeys).toHaveLength(2);
    expect(unstableCacheKeys[0]).not.toEqual(unstableCacheKeys[1]);
  });
});
