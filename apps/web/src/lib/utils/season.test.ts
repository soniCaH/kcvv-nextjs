import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { groupBySeason, type Season } from "./season";

/**
 * The only caller groups BFF matches, whose dates the Workers app builds with
 * `Date.UTC(…)` from PSD's Belgian local kickoff string — so a kickoff is
 * spelled here the way the producer spells it. A locally-constructed
 * `new Date(y, m, d)` is a shape no source emits, and it is what made an
 * unpinned parse look correct: local midnight and its UTC fields agree only in
 * the zone the test happens to run in (#2601).
 */
const kickoff = (
  year: number,
  monthIndex: number,
  day: number,
  hour = 15,
): Date => new Date(Date.UTC(year, monthIndex, day, hour));

// `deriveSeason` is module-private (only `groupBySeason` consumes it), so we
// assert its boundary + label behaviour through the public API: a single-item
// group's `.season` is exactly what `deriveSeason` produced for that date.
const seasonOf = (date: Date): Season =>
  groupBySeason([date], (d) => d)[0]!.season;

describe("season derivation (via groupBySeason)", () => {
  it("places a spring match (Jan–Jun) in the season that started the prior July", () => {
    expect(seasonOf(kickoff(2026, 4, 18))).toEqual({
      key: "2025-2026",
      label: "Seizoen '25–'26",
    });
  });

  it("places an autumn match (Jul–Dec) in the season that starts that July", () => {
    expect(seasonOf(kickoff(2025, 10, 24))).toEqual({
      key: "2025-2026",
      label: "Seizoen '25–'26",
    });
  });

  it("treats July as the start of the new season (boundary)", () => {
    expect(seasonOf(kickoff(2025, 6, 1)).key).toBe("2025-2026");
  });

  it("treats June as still belonging to the prior season (boundary)", () => {
    expect(seasonOf(kickoff(2025, 5, 30)).key).toBe("2024-2025");
  });

  it("lands an August cup match in the upcoming season", () => {
    expect(seasonOf(kickoff(2026, 7, 5))).toEqual({
      key: "2026-2027",
      label: "Seizoen '26–'27",
    });
  });

  it("formats the label with two-digit years and an en-dash", () => {
    expect(seasonOf(kickoff(2024, 8, 1)).label).toBe("Seizoen '24–'25");
  });

  /**
   * The boundary is where an unpinned read costs a whole season: a 30 June
   * evening kickoff read east of UTC crosses into July and moves the match to
   * the season that has not started yet.
   */
  describe("across runtime zones", () => {
    let savedTz: string | undefined;
    beforeEach(() => {
      savedTz = process.env.TZ;
    });
    afterEach(() => {
      if (savedTz !== undefined) process.env.TZ = savedTz;
      else delete process.env.TZ;
    });

    it.each(["UTC", "Europe/Brussels", "America/New_York", "Asia/Tokyo"])(
      "keeps a 30 June evening kickoff in the closing season under TZ=%s",
      (tz) => {
        process.env.TZ = tz;
        expect(seasonOf(kickoff(2025, 5, 30, 22)).key).toBe("2024-2025");
      },
    );

    it.each(["UTC", "Europe/Brussels", "America/New_York", "Asia/Tokyo"])(
      "keeps a 1 July early kickoff in the opening season under TZ=%s",
      (tz) => {
        process.env.TZ = tz;
        expect(seasonOf(kickoff(2025, 6, 1, 0)).key).toBe("2025-2026");
      },
    );
  });
});

describe("groupBySeason", () => {
  const make = (iso: string, id: number) => ({ id, date: new Date(iso) });

  it("groups items by season preserving input order across and within groups", () => {
    const items = [
      make("2026-08-05T12:00:00Z", 1), // '26–'27
      make("2026-05-18T12:00:00Z", 2), // '25–'26
      make("2026-04-12T12:00:00Z", 3), // '25–'26
      make("2024-08-25T12:00:00Z", 4), // '24–'25
    ];
    const groups = groupBySeason(items, (m) => m.date);

    expect(groups.map((g) => g.season.key)).toEqual([
      "2026-2027",
      "2025-2026",
      "2024-2025",
    ]);
    expect(groups[1]?.items.map((m) => m.id)).toEqual([2, 3]);
  });

  it("returns an empty array for no items", () => {
    expect(groupBySeason([], (m: { date: Date }) => m.date)).toEqual([]);
  });
});
