import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("react", () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));

vi.mock("@/lib/effect/runtime", () => ({
  runPromise: vi.fn(),
}));

// Passthrough: this module owns *which* match is picked, not how a Match is
// reshaped into a ScheduleMatch — `transformMatchToSchedule` has its own tests.
vi.mock("@/components/match/transform", () => ({
  transformMatchToSchedule: (m: { id: number; date: Date }) => ({
    id: m.id,
    date: m.date,
  }),
}));

import { runPromise } from "@/lib/effect/runtime";
import {
  getFirstTeamStripData,
  pickFirstTeamPsdId,
  RESULT_RECENCY_MS,
} from "./match-data";

const runPromiseMock = vi.mocked(runPromise);

const NOW = new Date("2026-08-06T12:00:00Z");
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 60 * 60 * 1000);
const hoursAhead = (h: number) => new Date(NOW.getTime() + h * 60 * 60 * 1000);

const TEAMS = [
  { psdId: "222", age: "U15", slug: "u15" },
  { psdId: "111", age: null, slug: "eerste-elftallen-a" },
  { psdId: "112", age: null, slug: "eerste-elftallen-b" },
];

/** First call resolves the team list, second the A side's season feed. */
function mockFetches(teams: unknown, matches: unknown) {
  runPromiseMock.mockResolvedValueOnce(teams).mockResolvedValueOnce(matches);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("pickFirstTeamPsdId", () => {
  it("picks the A side, not the B side or a youth team", () => {
    expect(pickFirstTeamPsdId(TEAMS)).toBe(111);
  });

  it("ignores senior teams without a psdId", () => {
    expect(
      pickFirstTeamPsdId([
        { psdId: null, age: null, slug: "eerste-elftallen-a" },
        { psdId: "112", age: null, slug: "eerste-elftallen-b" },
      ]),
    ).toBe(112);
  });

  it("returns null when only youth teams carry a psdId", () => {
    expect(
      pickFirstTeamPsdId([{ psdId: "999", age: "U21", slug: "u21" }]),
    ).toBe(null);
  });
});

describe("getFirstTeamStripData", () => {
  it("returns the last result and the next fixture", async () => {
    mockFetches(TEAMS, [
      { id: 1, status: "finished", date: hoursAgo(24) },
      { id: 2, status: "scheduled", date: hoursAhead(48) },
    ]);

    const data = await getFirstTeamStripData();

    expect(data?.result?.id).toBe(1);
    expect(data?.fixture?.id).toBe(2);
  });

  it("runs exactly two fetches: the team list, then that team's feed", async () => {
    mockFetches(TEAMS, [{ id: 2, status: "scheduled", date: hoursAhead(48) }]);

    await getFirstTeamStripData();

    // Which psdId is selected is asserted directly against `pickFirstTeamPsdId`
    // above; `runPromise` is mocked here, so the Effect never reaches the BFF.
    expect(runPromiseMock).toHaveBeenCalledTimes(2);
  });

  it("drops a result older than the recency window", async () => {
    const staleHours = RESULT_RECENCY_MS / (60 * 60 * 1000) + 1;
    mockFetches(TEAMS, [
      { id: 1, status: "finished", date: hoursAgo(staleHours) },
      { id: 2, status: "scheduled", date: hoursAhead(48) },
    ]);

    const data = await getFirstTeamStripData();

    expect(data?.result).toBeNull();
    expect(data?.fixture?.id).toBe(2);
  });

  it("keeps a result exactly on the recency boundary", async () => {
    const edgeHours = RESULT_RECENCY_MS / (60 * 60 * 1000);
    mockFetches(TEAMS, [
      { id: 1, status: "finished", date: hoursAgo(edgeHours) },
    ]);

    const data = await getFirstTeamStripData();

    expect(data?.result?.id).toBe(1);
  });

  it("returns the fixture alone when there is no recent result", async () => {
    mockFetches(TEAMS, [{ id: 2, status: "scheduled", date: hoursAhead(6) }]);

    const data = await getFirstTeamStripData();

    expect(data).toEqual({
      result: null,
      fixture: { id: 2, date: expect.any(Date) },
    });
  });

  it("returns the result alone when there is no upcoming fixture", async () => {
    mockFetches(TEAMS, [{ id: 1, status: "finished", date: hoursAgo(2) }]);

    const data = await getFirstTeamStripData();

    expect(data?.result?.id).toBe(1);
    expect(data?.fixture).toBeNull();
  });

  it("returns null when the feed has neither side", async () => {
    mockFetches(TEAMS, []);
    expect(await getFirstTeamStripData()).toBeNull();
  });

  it("returns null when no senior team carries a psdId", async () => {
    mockFetches([{ psdId: null, age: null, slug: "eerste-elftallen-a" }], []);
    expect(await getFirstTeamStripData()).toBeNull();
  });

  it("ignores youth teams when picking the first team", async () => {
    mockFetches([{ psdId: "999", age: "U21", slug: "u21" }], []);
    expect(await getFirstTeamStripData()).toBeNull();
  });

  it("returns null when a fetch fails", async () => {
    runPromiseMock.mockRejectedValue(new Error("BFF down"));
    expect(await getFirstTeamStripData()).toBeNull();
  });
});
