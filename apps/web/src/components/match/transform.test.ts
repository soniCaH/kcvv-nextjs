/**
 * Tests for the shared Match → ScheduleMatch adapter.
 */

import { describe, it, expect } from "vitest";
import { transformMatchToSchedule } from "./transform";
import type { Match } from "@/lib/effect/schemas";
import type { ScheduleMatch, ScheduleRow } from "./types";

/** Narrows a `ScheduleRow` to the `ScheduleMatch` member for tests that assert
 * on `homeTeam`/`awayTeam`/scores — every fixture in this file that reaches
 * for it is deliberately a non-placeholder match. */
function expectFixture(row: ScheduleRow): ScheduleMatch {
  if (row.isPlaceholder)
    throw new Error("expected a ScheduleMatch, got a ScheduleReservation");
  return row;
}

// Mock Match factory
function createMockMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 123,
    date: new Date("2025-02-15T15:00:00"),
    time: "15:00",
    home_team: {
      id: 1,
      name: "KCVV Elewijt",
      logo: "https://example.com/kcvv.png",
      score: 2,
    },
    away_team: {
      id: 2,
      name: "FC Opponent",
      logo: "https://example.com/opponent.png",
      score: 1,
    },
    status: "finished",
    competition: "3e Nationale",
    ...overrides,
  } as Match;
}

describe("transformMatchToSchedule", () => {
  it("transforms a match to schedule format", () => {
    const match = createMockMatch();
    const result = expectFixture(transformMatchToSchedule(match));

    expect(result.id).toBe(123);
    expect(result.date).toEqual(new Date("2025-02-15T15:00:00"));
    expect(result.time).toBe("15:00");
    expect(result.homeTeam.id).toBe(1);
    expect(result.homeTeam.name).toBe("KCVV Elewijt");
    expect(result.homeTeam.logo).toBe("https://example.com/kcvv.png");
    expect(result.awayTeam.id).toBe(2);
    expect(result.awayTeam.name).toBe("FC Opponent");
    expect(result.homeScore).toBe(2);
    expect(result.awayScore).toBe(1);
    expect(result.status).toBe("finished");
    expect(result.competition).toBe("3e Nationale");
  });

  it("carries the opponent team designation through as teamLabel", () => {
    const match = createMockMatch({
      away_team: { id: 2, name: "Opponent", team_label: "U23" },
    });
    expect(
      expectFixture(transformMatchToSchedule(match)).awayTeam.teamLabel,
    ).toBe("U23");
  });

  it("handles scheduled match without scores", () => {
    const match = createMockMatch({
      status: "scheduled",
      home_team: { id: 1, name: "KCVV", score: undefined },
      away_team: { id: 2, name: "Opponent", score: undefined },
    });
    const result = expectFixture(transformMatchToSchedule(match));

    expect(result.status).toBe("scheduled");
    expect(result.homeScore).toBeUndefined();
    expect(result.awayScore).toBeUndefined();
  });

  it("handles match without logos", () => {
    const match = createMockMatch({
      home_team: { id: 1, name: "KCVV", logo: undefined },
      away_team: { id: 2, name: "Opponent", logo: undefined },
    });
    const result = expectFixture(transformMatchToSchedule(match));

    expect(result.homeTeam.logo).toBeUndefined();
    expect(result.awayTeam.logo).toBeUndefined();
  });

  it("passes is_home through as isHome when present", () => {
    const homeMatch = createMockMatch({ is_home: true });
    expect(expectFixture(transformMatchToSchedule(homeMatch)).isHome).toBe(
      true,
    );

    const awayMatch = createMockMatch({ is_home: false });
    expect(expectFixture(transformMatchToSchedule(awayMatch)).isHome).toBe(
      false,
    );
  });

  it("leaves isHome undefined when is_home is absent", () => {
    const match = createMockMatch();
    expect(
      expectFixture(transformMatchToSchedule(match)).isHome,
    ).toBeUndefined();
  });

  it("passes is_placeholder through as isPlaceholder when present (#2606)", () => {
    const placeholder = createMockMatch({ is_placeholder: true });
    expect(transformMatchToSchedule(placeholder).isPlaceholder).toBe(true);

    const normal = createMockMatch({ is_placeholder: false });
    expect(transformMatchToSchedule(normal).isPlaceholder).toBe(false);
  });

  it("normalizes isPlaceholder to false when is_placeholder is absent (#2688 — a definite discriminant, not a tri-state)", () => {
    const match = createMockMatch();
    expect(transformMatchToSchedule(match).isPlaceholder).toBe(false);
  });

  it("returns the ScheduleReservation shape for a placeholder — no awayTeam/scores, one `team` (#2688)", () => {
    const placeholder = createMockMatch({
      is_placeholder: true,
      home_team: {
        id: 1235,
        name: "KCVV Elewijt",
        logo: "https://example.com/kcvv.png",
      },
      away_team: { id: 1235, name: "KCVV Elewijt" },
      status: "scheduled",
      competition: "Tornooi",
    });
    const result = transformMatchToSchedule(placeholder);

    expect(result.isPlaceholder).toBe(true);
    if (!result.isPlaceholder) throw new Error("expected a reservation");
    expect(result.team).toEqual({
      id: 1235,
      name: "KCVV Elewijt",
      logo: "https://example.com/kcvv.png",
      teamLabel: undefined,
    });
    expect(result.competition).toBe("Tornooi");
    expect("awayTeam" in result).toBe(false);
    expect("homeScore" in result).toBe(false);
  });
});
