import { describe, it, expect } from "vitest";
import {
  clubCalendarDaysBetween,
  formatDaysUntil,
  resolvePlaceholderState,
} from "./placeholder-rule";
import type { MatchesSliderPlaceholderVM } from "@/lib/repositories/homepage.repository";

describe("clubCalendarDaysBetween", () => {
  // #2505 — a Sanity date has no time component, so the diff must anchor to
  // the club's own zone rather than UTC: 23:30 UTC on day N is already
  // 00:30 Brussels on day N+1, and 01:30 UTC the next day is the same
  // Brussels calendar date. Both must read as "the same day away".
  it("treats a 23:30Z now and a 01:30Z-next-day now as the same calendar date", () => {
    const kickoff = new Date("2026-08-01T00:00:00Z");
    const lateEvening = new Date("2026-07-31T23:30:00Z"); // 01:30 Brussels (CEST, UTC+2)
    const earlyMorning = new Date("2026-08-01T01:30:00Z"); // 03:30 Brussels

    expect(clubCalendarDaysBetween(lateEvening, kickoff)).toBe(
      clubCalendarDaysBetween(earlyMorning, kickoff),
    );
  });
});

describe("resolvePlaceholderState", () => {
  const now = new Date("2026-07-10T12:00:00Z");
  const image = {
    alt: "Ploegfoto zomerstage",
    url: "https://cdn.example.com/zomer.jpg",
  };

  // #2505/#2844, round-3 review finding M4 — `unavailable` is checked first
  // and unconditionally short-circuits every other authored field: the
  // returned state carries neither a mededeling nor an image, so nothing
  // downstream can render either by forgetting to check `kind` first.
  describe("unavailable", () => {
    it("wins over an authored countdown", () => {
      const placeholder: MatchesSliderPlaceholderVM = {
        nextSeasonKickoff: new Date("2026-08-02T00:00:00Z"),
        highlightImage: image,
      };
      expect(resolvePlaceholderState(placeholder, now, true)).toEqual({
        kind: "unavailable",
      });
    });

    it("wins over an authored mededeling and image", () => {
      const placeholder: MatchesSliderPlaceholderVM = {
        announcementText: "Groenwit maakt zich klaar.",
        highlightImage: image,
      };
      expect(resolvePlaceholderState(placeholder, now, true)).toEqual({
        kind: "unavailable",
      });
    });

    it("wins even when nothing is authored at all", () => {
      expect(resolvePlaceholderState(null, now, true)).toEqual({
        kind: "unavailable",
      });
    });
  });

  it("resolves a future kickoff to the countdown state", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-08-02T00:00:00Z"),
    };
    const state = resolvePlaceholderState(placeholder, now, false);
    expect(state).toEqual({ kind: "countdown", daysUntil: 23 });
  });

  it("carries the mededeling as one object alongside the countdown when authored", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-08-02T00:00:00Z"),
      announcementText: "Kalender 25-26 volgende week online.",
      announcementHref: "/kalender",
    };
    const state = resolvePlaceholderState(placeholder, now, false);
    expect(state).toEqual({
      kind: "countdown",
      daysUntil: 23,
      mededeling: {
        text: "Kalender 25-26 volgende week online.",
        href: "/kalender",
      },
    });
  });

  it("carries the authored image alongside the countdown", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-08-02T00:00:00Z"),
      highlightImage: image,
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "countdown",
      daysUntil: 23,
      image,
    });
  });

  it("resolves a same-calendar-day kickoff to the today state", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-07-10T18:00:00Z"),
      announcementText: "Nog steeds gezet als mededeling.",
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "today",
    });
  });

  it("carries the authored image alongside the today state", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-07-10T18:00:00Z"),
      highlightImage: image,
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "today",
      image,
    });
  });

  it("falls through a past kickoff to the mededeling state", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-07-01T00:00:00Z"),
      announcementText:
        "Groenwit maakt zich klaar voor seizoen 2026-2027 in 3e Nationale.",
      announcementHref: "/kalender",
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "mededeling",
      mededeling: {
        text: "Groenwit maakt zich klaar voor seizoen 2026-2027 in 3e Nationale.",
        href: "/kalender",
      },
    });
  });

  it("falls through a past kickoff with no mededeling to the empty state", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      nextSeasonKickoff: new Date("2026-07-01T00:00:00Z"),
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "empty",
    });
  });

  it("carries the authored image alongside the empty state", () => {
    // Deliberate (#2505 round-3 review finding M4): the image renders
    // "above the sentence", not "above the mededeling" specifically — an
    // editor can author only a photo, and it still shows above whichever
    // of the six sentences ends up rendering, the empty fallback included.
    const placeholder: MatchesSliderPlaceholderVM = { highlightImage: image };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "empty",
      image,
    });
  });

  it("resolves a mededeling with no kickoff at all", () => {
    const placeholder: MatchesSliderPlaceholderVM = {
      announcementText:
        "Groenwit maakt zich klaar voor seizoen 2026-2027 in 3e Nationale.",
    };
    expect(resolvePlaceholderState(placeholder, now, false)).toEqual({
      kind: "mededeling",
      mededeling: {
        text: "Groenwit maakt zich klaar voor seizoen 2026-2027 in 3e Nationale.",
      },
    });
  });

  it("resolves nothing authored to the empty state", () => {
    expect(resolvePlaceholderState(null, now, false)).toEqual({
      kind: "empty",
    });
    expect(resolvePlaceholderState(undefined, now, false)).toEqual({
      kind: "empty",
    });
    expect(resolvePlaceholderState({}, now, false)).toEqual({
      kind: "empty",
    });
  });
});

describe("formatDaysUntil", () => {
  it("reads singular for exactly one day", () => {
    expect(formatDaysUntil(1)).toBe("1 dag");
  });

  it("reads plural for every other count", () => {
    expect(formatDaysUntil(23)).toBe("23 dagen");
    expect(formatDaysUntil(2)).toBe("2 dagen");
  });
});
