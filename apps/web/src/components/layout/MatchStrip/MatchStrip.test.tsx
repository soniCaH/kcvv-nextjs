import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/server/match-data", () => ({
  getFirstTeamStripData: vi.fn(),
}));

import { getFirstTeamStripData } from "@/lib/server/match-data";
import { MatchStrip } from "./MatchStrip";
import type { ScheduleMatch } from "@/components/match/types";

const mocked = vi.mocked(getFirstTeamStripData);

const fixture: ScheduleMatch = {
  id: 1,
  date: new Date("2026-05-10T19:30:00Z"),
  time: "19:30",
  status: "scheduled",
  homeTeam: { id: 1235, name: "KCVV" },
  awayTeam: { id: 9999, name: "RC Mechelen" },
};

describe("MatchStrip (server component)", () => {
  it("returns null when neither a result nor a fixture is available", async () => {
    mocked.mockResolvedValueOnce(null);
    expect(await MatchStrip()).toBeNull();
  });

  it("renders MatchStripView when the helper returns data", async () => {
    mocked.mockResolvedValueOnce({ result: null, fixture });
    expect(await MatchStrip()).not.toBeNull();
  });
});
