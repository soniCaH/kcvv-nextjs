import { describe, it, expect } from "vitest";
import type { ScheduleRow } from "@/components/match/types";
import { hasVisibleMatches } from "./match-visibility";

const NOW = new Date("2026-09-15T12:00:00.000Z");

function row(overrides: Partial<ScheduleRow> = {}): ScheduleRow {
  return {
    id: 1,
    date: new Date("2026-09-20T15:00:00.000Z"),
    status: "scheduled",
    isHome: true,
    homeTeam: { id: 1235, name: "KCVV Elewijt" },
    awayTeam: { id: 42, name: "FC Perk" },
    ...overrides,
  } as ScheduleRow;
}

describe("hasVisibleMatches", () => {
  it("is false for an empty list", () => {
    expect(hasVisibleMatches([], NOW)).toBe(false);
  });

  it("is true when a future scheduled fixture exists", () => {
    expect(hasVisibleMatches([row({ status: "scheduled" })], NOW)).toBe(true);
  });

  it("is true when a past finished result exists", () => {
    const finished = row({
      status: "finished",
      date: new Date("2026-09-10T15:00:00.000Z"),
    });
    expect(hasVisibleMatches([finished], NOW)).toBe(true);
  });

  it("is false when every match is postponed/cancelled/forfeited/stopped, with nothing scheduled or finished", () => {
    // The exact drift #2636 finding 2 flags: the league fixture gate can be
    // satisfied while every individual fixture is in a status the section
    // itself never surfaces.
    const matches = [
      row({ status: "postponed" }),
      row({ id: 2, status: "cancelled" }),
      row({ id: 3, status: "forfeited" }),
      row({ id: 4, status: "stopped" }),
    ];
    expect(hasVisibleMatches(matches, NOW)).toBe(false);
  });

  it("is false when a scheduled fixture is stuck in the past (PSD never flipped it to finished)", () => {
    const stale = row({
      status: "scheduled",
      date: new Date("2026-09-01T15:00:00.000Z"),
    });
    expect(hasVisibleMatches([stale], NOW)).toBe(false);
  });

  it("flips for the same match list as `now` crosses kickoff — the reason the caller must pin one instant (#2636 review round 3)", () => {
    const kickoff = new Date("2026-09-20T15:00:00.000Z");
    const oneScheduledFixture = [row({ status: "scheduled", date: kickoff })];

    const beforeKickoff = new Date(kickoff.getTime() - 1000);
    const afterKickoff = new Date(kickoff.getTime() + 1000);

    expect(hasVisibleMatches(oneScheduledFixture, beforeKickoff)).toBe(true);
    // PSD leaves the status at "scheduled" until it syncs a result — so
    // crossing kickoff alone (no status change) flips this to false. A page
    // rendered against `beforeKickoff` and a component hydrating against
    // `afterKickoff` would disagree if they read two independent clocks.
    expect(hasVisibleMatches(oneScheduledFixture, afterKickoff)).toBe(false);
  });
});
