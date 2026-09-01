/**
 * A failed read may never be cached as a successful render (#2563)
 *
 * #2433 rule 2: under ISR a throw and a catch have *opposite* persistence. A
 * regeneration that throws leaves the last good page in place; a regeneration
 * that catches to `[]` *succeeds*, so the empty render is written into the
 * cache and the last good one is destroyed. Rule 3 splits which is right by
 * what failed: the page's **subject** takes the page down, a **section** keeps
 * it.
 *
 * Both halves are asserted here against the real Effect pipelines — Sanity is
 * mocked at its client, one level below every repository, so each page's own
 * `catch`/no-catch decision is what the assertion actually reads.
 *
 * **Sanity reads fail as defects, not as typed errors.** `fetchGroq` ends in
 * `Effect.orDie`, so every repository method is typed `Effect<A>` with `E =
 * never` and a `catchAll` on one is inert — which is why the two subject
 * catches this ticket removes were already unreachable, and why every section
 * degrade goes through `degradeSection` (`lib/effect/degrade.ts`). The subject
 * cases below are therefore regression cover rather than a behaviour change:
 * they fail the day someone reaches for `catchAllCause` on a subject read.
 *
 * **This file pins the routes #2563 touched; it is not the growth guard.** A
 * route added later is not covered here — the rule that scales is rule 5 in
 * `cross-page-consistency.test.ts`. `/ploegen/[slug]` gets the same degrade as
 * the two profiles below and is left to that guard plus its own page tests,
 * because standing its subject up needs a full team + BFF fixture to assert
 * what these two already assert.
 *
 * `/kalender` is `force-dynamic` and caches nothing, so its case rests on
 * #2399's honesty argument alone rather than on ISR persistence.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2563
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Effect, Layer } from "effect";
import { HttpNotFound, HttpBadGateway } from "@kcvv/api-contract";
import type { MatchDetail } from "@/lib/effect/schemas/match.schema";

// Sanity is unreachable for every read in this file. Repositories left
// unmocked below therefore die; the two mocked below are the page subjects
// that must survive so their sections can be the thing that fails.
vi.mock("@/lib/sanity/client", () => ({
  sanityClient: {
    fetch: vi.fn(() => Promise.reject(new Error("Sanity is unreachable"))),
  },
}));

// `/wedstrijd/[matchId]` reads `BffService` directly in its own page body
// (not through a child component, unlike the `<MatchStripSlot>` the other
// pages below mount), so its match-detail and ranking reads must be mocked
// here rather than left to die against the real BFF. `getMatchDetail` always
// succeeds — the standings read is this suite's actual subject — and every
// other method is a safe empty default, mirroring the other pages in this
// file that never touch the BFF from their own awaited body.
const { mockGetMatchDetail, mockGetRanking } = vi.hoisted(() => ({
  mockGetMatchDetail: vi.fn(),
  mockGetRanking: vi.fn(),
}));

vi.mock("@/lib/effect/services/BffService", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/effect/services/BffService")>();
  return {
    ...actual,
    BffServiceLive: Layer.succeed(actual.BffService, {
      getMatches: () => Effect.succeed([]),
      getNextMatches: () => Effect.succeed([]),
      getMatchesWindow: () => Effect.succeed([]),
      getMatchDetail: mockGetMatchDetail,
      getRanking: mockGetRanking,
      getRelated: () => Effect.succeed([]),
      getOpponentHistory: () => Effect.die("not used by this suite"),
      getPlayerStats: () => Effect.die("not used by this suite"),
    }),
  };
});

vi.mock("@/lib/repositories/player.repository", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("@/lib/repositories/player.repository")
    >();
  const { Effect, Layer } = await import("effect");
  const player = {
    id: "player-1",
    firstName: "Jan",
    lastName: "Peeters",
    position: "Middenvelder",
  };
  return {
    ...mod,
    PlayerRepositoryLive: Layer.succeed(mod.PlayerRepository, {
      findAll: () => Effect.succeed([player]),
      findByPsdId: () => Effect.succeed(player),
      findKeeperPsdIds: () => Effect.succeed(new Set<string>()),
    }),
  };
});

vi.mock("@/lib/repositories/staff.repository", async (importOriginal) => {
  const mod =
    await importOriginal<
      typeof import("@/lib/repositories/staff.repository")
    >();
  const { Effect, Layer } = await import("effect");
  const member = {
    id: "staff-1",
    psdId: "42",
    firstName: "An",
    lastName: "Willems",
    href: "/staf/42",
    organigramPositions: [],
    responsibilityPaths: [],
  };
  return {
    ...mod,
    StaffRepositoryLive: Layer.succeed(mod.StaffRepository, {
      findAll: () => Effect.succeed([]),
      findByPsdId: () => Effect.succeed(member),
      findKeyContacts: () => Effect.succeed([]),
      findAllForStaticParams: () => Effect.succeed([]),
    }),
  };
});

import SponsorsPage from "@/app/(landing)/sponsors/page";
import CalendarPage from "@/app/(main)/kalender/page";
import JeugdPage from "@/app/(landing)/jeugd/page";
import PlayerPage from "@/app/(main)/spelers/[slug]/page";
import StaffPage from "@/app/(main)/staf/[slug]/page";
import MatchPage from "@/app/(main)/wedstrijd/[matchId]/page";

/** A league match with a resolvable KCVV side — the only shape that reaches
 * the `getRanking` call in `fetchStandings` at all. */
function leagueMatchFixture(id: number): MatchDetail {
  return {
    id,
    date: new Date("2025-12-07T15:00:00"),
    home_team: { id: 1, name: "KCVV Elewijt" },
    away_team: { id: 2, name: "KFC Turnhout" },
    status: "scheduled",
    hasReport: false,
    competitionType: "league",
    kcvv_team_id: 1,
    is_placeholder: false,
  } as MatchDetail;
}

describe("a failed subject takes the page down (#2563)", () => {
  it("/sponsors — the sponsor wall is the subject, so the page throws", async () => {
    await expect(SponsorsPage()).rejects.toThrow();
  });

  it("/kalender — the team list is the subject, so the page throws", async () => {
    await expect(CalendarPage()).rejects.toThrow();
  });
});

describe("a failed section keeps the page (#2563)", () => {
  // Every degrade here logs — `degradeSection` warns with the cause, `/jeugd`'s
  // two `try/catch` fetchers use `console.error`. The assertion is that the page
  // survives, not that it stays quiet, so both channels are silenced.
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("/spelers/[slug] — a failed related-articles read leaves the profile", async () => {
    await expect(
      PlayerPage({ params: Promise.resolve({ slug: "42" }) }),
    ).resolves.toBeTruthy();
  });

  it("/staf/[slug] — a failed related-articles read leaves the profile", async () => {
    await expect(
      StaffPage({ params: Promise.resolve({ slug: "42" }) }),
    ).resolves.toBeTruthy();
  });

  it("/jeugd — a failed editorial-cards read leaves the page", async () => {
    await expect(JeugdPage()).resolves.toBeTruthy();
  });
});

describe("/wedstrijd/[matchId] classifies a failed ranking read (#2778)", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockGetMatchDetail.mockReset();
    mockGetRanking.mockReset();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("a transient ranking failure (502) takes the page down, so ISR serves the last-good page", async () => {
    mockGetMatchDetail.mockReturnValue(
      Effect.succeed(leagueMatchFixture(9001)),
    );
    mockGetRanking.mockReturnValue(
      Effect.fail(new HttpBadGateway({ error: "upstream is down" })),
    );

    await expect(
      MatchPage({ params: Promise.resolve({ matchId: "9001" }) }),
    ).rejects.toThrow();
  });

  it("a permanent ranking failure (404) degrades to no standings instead of taking the page down", async () => {
    mockGetMatchDetail.mockReturnValue(
      Effect.succeed(leagueMatchFixture(9002)),
    );
    mockGetRanking.mockReturnValue(
      Effect.fail(new HttpNotFound({ error: "unknown psd team id" })),
    );

    await expect(
      MatchPage({ params: Promise.resolve({ matchId: "9002" }) }),
    ).resolves.toBeTruthy();
  });
});
