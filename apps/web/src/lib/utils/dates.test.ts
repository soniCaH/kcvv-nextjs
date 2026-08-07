import { describe, it, expect } from "vitest";
import { formatWidgetDate, formatDayMonth } from "./dates";

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
});
