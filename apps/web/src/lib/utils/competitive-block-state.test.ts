/**
 * `deriveCompetitiveBlockState` unit tests (#2636).
 *
 * Covers all four reachable states plus the null-fetch-result path, and the
 * gate rule itself: a match's `competitionType`, never `standings.length`.
 */

import { describe, it, expect } from "vitest";
import type { Match, RankingEntry, RankingTable } from "@kcvv/api-contract";
import {
  classifyStandingsTable,
  classifyStandingsTables,
  competitiveBlockHeadingLabel,
  deriveCompetitiveBlockState,
} from "./competitive-block-state";

function match(overrides: Partial<Match> = {}): Match {
  return {
    id: 1,
    date: new Date("2026-09-05T14:00:00.000Z"),
    home_team: { id: 1235, name: "KCVV Elewijt" },
    away_team: { id: 42, name: "FC Perk" },
    status: "scheduled",
    competitionType: "league",
    ...overrides,
  } as Match;
}

function entry(overrides: Partial<RankingEntry> = {}): RankingEntry {
  return {
    position: 1,
    team_id: 1,
    team_name: "FC Test",
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goals_for: 20,
    goals_against: 10,
    goal_difference: 10,
    points: 20,
    ...overrides,
  } as RankingEntry;
}

function table(overrides: Partial<RankingTable> = {}): RankingTable {
  return {
    competition_id: 222464,
    competition_name: "3de Afdeling Voetb Vl A",
    entries: [],
    ...overrides,
  } as RankingTable;
}

describe("deriveCompetitiveBlockState", () => {
  it("returns not-in-competition for the null fetch result (no usable PSD id)", () => {
    expect(deriveCompetitiveBlockState(null)).toEqual({
      kind: "not-in-competition",
    });
  });

  it("returns not-in-competition when no fixture is OFFICIAL/league", () => {
    // A tournament-only feed (the historical U9 case) is not a league — the
    // gate must not read this as being in competition.
    const state = deriveCompetitiveBlockState({
      matches: [match({ competitionType: "tournament" })],
      standings: [],
    });
    expect(state).toEqual({ kind: "not-in-competition" });
  });

  it("returns not-in-competition when there are no fixtures at all", () => {
    const state = deriveCompetitiveBlockState({ matches: [], standings: [] });
    expect(state).toEqual({ kind: "not-in-competition" });
  });

  it("does not gate on standings.length: a live fixture with zero ranking rows is still in competition", () => {
    // The A-team's calendar publishes months before its ranking does — the
    // documented #2540 measurement this ticket's gate is proven against.
    const state = deriveCompetitiveBlockState({
      matches: [match({ competitionType: "league" })],
      standings: [],
    });
    expect(state.kind).toBe("no-table");
  });

  it("returns no-table when in competition but no table has any rows", () => {
    const state = deriveCompetitiveBlockState({
      matches: [match()],
      standings: [table({ entries: [] })],
    });
    expect(state).toEqual({
      kind: "no-table",
      tables: [table({ entries: [] })],
    });
  });

  it("returns numberless when every row reads played 0 and points 0", () => {
    const state = deriveCompetitiveBlockState({
      matches: [match()],
      standings: [
        table({
          entries: [
            entry({ played: 0, points: 0, team_id: 1 }),
            entry({ played: 0, points: 0, team_id: 2 }),
          ],
        }),
      ],
    });
    expect(state.kind).toBe("numberless");
    if (state.kind === "numberless") {
      expect(state.tables).toHaveLength(1);
    }
  });

  it("returns live when at least one row carries real numbers", () => {
    const state = deriveCompetitiveBlockState({
      matches: [match()],
      standings: [table({ entries: [entry({ played: 4, points: 9 })] })],
    });
    expect(state.kind).toBe("live");
  });

  it("returns the block-level live verdict when one of two tables is numberless and the other is live", () => {
    // A youth side crossing the winter break can have a finished autumn
    // poule (live) and a fresh spring one that has not kicked off yet
    // (numberless) at the same time. `deriveCompetitiveBlockState`'s "live"
    // is a BLOCK-level verdict for the nav chip's label (#2605: "Klassement"
    // only when there are points on the page at all) — it does NOT mean
    // every table renders as a full table. `classifyStandingsTable` below
    // is the per-table complement that decides that per table, and this
    // input is exactly the case it exists for (#2636 finding 4).
    const numberless = table({
      competition_id: 1,
      entries: [entry({ played: 0, points: 0 })],
    });
    const live = table({
      competition_id: 2,
      entries: [entry({ played: 4, points: 9 })],
    });
    const state = deriveCompetitiveBlockState({
      matches: [match()],
      standings: [numberless, live],
    });
    expect(state.kind).toBe("live");
    if (state.kind === "live") {
      expect(state.tables).toHaveLength(2);
      expect(classifyStandingsTable(numberless)).toBe("numberless");
      expect(classifyStandingsTable(live)).toBe("live");
    }
  });

  it("filters out rowless tables when returning numberless/live", () => {
    const rowless = table({ competition_id: 1, entries: [] });
    const withRows = table({
      competition_id: 2,
      entries: [entry({ played: 4, points: 9 })],
    });
    const state = deriveCompetitiveBlockState({
      matches: [match()],
      standings: [rowless, withRows],
    });
    expect(state.kind).toBe("live");
    if (state.kind === "live") {
      expect(state.tables).toEqual([withRows]);
    }
  });

  it("returns unavailable for the 'unavailable' sentinel, without reading matches or standings", () => {
    // `fetchBffData` passes this literal when it caught a PERMANENT PSD
    // failure (#2636 finding 3) — a stale/mistyped psdId or an undecodable
    // response. A transient failure never reaches here at all; the render
    // throws instead so ISR can serve the last-good page.
    expect(deriveCompetitiveBlockState("unavailable")).toEqual({
      kind: "unavailable",
    });
  });
});

describe("classifyStandingsTable (per-table, #2636 finding 4)", () => {
  it("reads live for a table with at least one real number", () => {
    expect(
      classifyStandingsTable(
        table({ entries: [entry({ played: 4, points: 9 })] }),
      ),
    ).toBe("live");
  });

  it("reads numberless for a table where every entry is played 0 / points 0", () => {
    expect(
      classifyStandingsTable(
        table({
          entries: [
            entry({ played: 0, points: 0, team_id: 1 }),
            entry({ played: 0, points: 0, team_id: 2 }),
          ],
        }),
      ),
    ).toBe("numberless");
  });
});

describe("classifyStandingsTables", () => {
  it("reads no-table for an empty array", () => {
    expect(classifyStandingsTables([])).toBe("no-table");
  });

  it("reads no-table when every table is published but rowless", () => {
    expect(classifyStandingsTables([table({ entries: [] })])).toBe("no-table");
  });
});

describe("competitiveBlockHeadingLabel", () => {
  it("reads Klassement for a live state", () => {
    expect(competitiveBlockHeadingLabel({ kind: "live", tables: [] })).toBe(
      "Klassement",
    );
  });

  it("reads De reeks for a no-table state", () => {
    expect(competitiveBlockHeadingLabel({ kind: "no-table", tables: [] })).toBe(
      "De reeks",
    );
  });

  it("reads De reeks for a numberless state", () => {
    expect(
      competitiveBlockHeadingLabel({ kind: "numberless", tables: [] }),
    ).toBe("De reeks");
  });
});
