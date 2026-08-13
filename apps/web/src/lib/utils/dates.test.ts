import { describe, it, expect } from "vitest";
import {
  formatArticleDate,
  formatWidgetDate,
  formatDayMonth,
  toDisplayZone,
  toMatchDisplayZone,
} from "./dates";

/**
 * These formatters render Belgian wall-clock, not the runtime's zone. Vercel is
 * UTC and the browser is the visitor's own zone, and `<MatchStripView>` is a
 * client component that formats in both — so an unpinned late-evening kickoff
 * would render one calendar date on the server and the next after hydration.
 */
describe("Belgian display zone", () => {
  it("rolls a late CEST kickoff onto the next Belgian day", () => {
    // 22:30 UTC is 00:30 the following day in Brussels (summer, +02:00).
    const late = "2026-08-03T22:30:00Z";
    expect(formatWidgetDate(late)).toBe("Di 4 augustus");
    expect(formatDayMonth(late)).toEqual({ day: "4", month: "aug" });
  });

  it("rolls a late CET kickoff onto the next Belgian day", () => {
    // 23:30 UTC is 00:30 the following day in Brussels (winter, +01:00).
    const late = "2026-01-15T23:30:00Z";
    expect(formatWidgetDate(late)).toBe("Vr 16 januari");
    expect(formatDayMonth(late)).toEqual({ day: "16", month: "jan" });
  });

  it("treats a Date instance the same as the equivalent ISO string", () => {
    const iso = "2026-08-03T22:30:00Z";
    expect(formatDayMonth(new Date(iso))).toEqual(formatDayMonth(iso));
    expect(formatWidgetDate(new Date(iso))).toBe(formatWidgetDate(iso));
  });

  it("leaves an ordinary afternoon kickoff on its own day", () => {
    const kickoff = "2026-08-08T16:00:00Z";
    expect(formatDayMonth(kickoff)).toEqual({ day: "8", month: "aug" });
  });

  it("returns empty output for an invalid date", () => {
    expect(formatWidgetDate("not-a-date")).toBe("");
    expect(formatDayMonth("not-a-date")).toEqual({ day: "", month: "" });
  });

  it("reads offset-less input as UTC, not as the runtime's zone", () => {
    // The stored contract. Read as UTC this is 23:30 → 01:30 Brussels on the
    // 4th; read as runtime-local on a UTC host it would be the same, which is
    // exactly why the bug survived — assert the Brussels day, not the host's.
    expect(formatDayMonth("2026-08-03T23:30:00")).toEqual({
      day: "4",
      month: "aug",
    });
  });
});

/**
 * `formatArticleDate` was the one `dates.ts` export not routed through the
 * shared parse: bare `DateTime.fromISO`, so it took the runtime zone and had no
 * validity guard. #2402 deferred the fix here (#2430 rule 3).
 */
describe("formatArticleDate", () => {
  it("renders the Belgian day for an article published just before UTC midnight", () => {
    // Published 23:30 UTC on the 15th → 01:30 Brussels on the 16th. The site
    // showed the 15th; the 16th is the correction.
    expect(formatArticleDate("2026-01-15T23:30:00Z")).toBe("16 januari 2026");
  });

  it("renders an ordinary daytime publish unchanged", () => {
    expect(formatArticleDate("2024-01-15T10:00:00Z")).toBe("15 januari 2024");
  });

  it("returns empty output for an invalid date", () => {
    expect(formatArticleDate("not-a-date")).toBe("");
  });

  it("agrees between a Date instance and its ISO string", () => {
    const iso = "2026-01-15T23:30:00Z";
    expect(formatArticleDate(new Date(iso))).toBe(formatArticleDate(iso));
  });
});

/**
 * A BFF match date is not an instant: `parseDateString` in the Workers app
 * builds it with `Date.UTC(…)` from PSD's Belgian local kickoff string, so its
 * UTC fields already *are* wall-clock. The two parses must therefore disagree
 * on a late kickoff — that disagreement is the whole point of having both.
 */
describe("toMatchDisplayZone", () => {
  it("keeps a 22:00 kickoff on its own day where toDisplayZone would not", () => {
    // The Date a BFF `Match` carries for a 22:00 Belgian kickoff on 3 August.
    const kickoff = new Date(Date.UTC(2026, 7, 3, 22, 0));
    expect(toMatchDisplayZone(kickoff).toISODate()).toBe("2026-08-03");
    expect(toDisplayZone(kickoff).toISODate()).toBe("2026-08-04");
  });

  it("agrees with toDisplayZone for an ordinary afternoon kickoff", () => {
    const kickoff = new Date(Date.UTC(2026, 7, 8, 15, 0));
    expect(toMatchDisplayZone(kickoff).toISODate()).toBe(
      toDisplayZone(kickoff).toISODate(),
    );
  });

  it("reads the kickoff hour off UTC rather than converting it", () => {
    const kickoff = new Date(Date.UTC(2026, 7, 8, 15, 0));
    expect(toMatchDisplayZone(kickoff).toFormat("HH:mm")).toBe("15:00");
  });

  it("carries the nl locale so callers format without re-stating it", () => {
    const kickoff = new Date(Date.UTC(2026, 8, 12, 15, 0));
    expect(toMatchDisplayZone(kickoff).toFormat("cccc d MMMM yyyy")).toBe(
      "zaterdag 12 september 2026",
    );
  });
});
