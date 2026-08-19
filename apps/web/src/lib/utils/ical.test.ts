import { describe, expect, it } from "vitest";
import type { Match } from "@kcvv/api-contract";
import type { EventListItemVM } from "@/lib/repositories/event.repository";
import { generateIcal, normalizeCacheKey } from "./ical";

function makeMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 12345,
    date: new Date("2025-03-22T14:00:00.000Z"),
    time: "15:00",
    venue: undefined,
    home_team: { id: 1, name: "KCVV Elewijt", score: undefined },
    away_team: { id: 2, name: "KFC Turnhout", score: undefined },
    status: "scheduled",
    squadLabel: "A-Ploeg",
    competition: "2e Nationale",
    ...overrides,
  } as Match;
}

/**
 * A pitch-reservation placeholder (#2606): both sides are the same club, so
 * `home_team`/`away_team` carry identical ids and names.
 */
function makePlaceholderMatch(overrides: Partial<Match> = {}): Match {
  return makeMatch({
    id: 54321,
    home_team: { id: 5, name: "KCVV Elewijt", score: undefined },
    away_team: { id: 5, name: "KCVV Elewijt", score: undefined },
    is_placeholder: true,
    competition: "Jeugdtornooi",
    ...overrides,
  });
}

describe("generateIcal", () => {
  it("generates a valid iCal with a scheduled match", () => {
    const matches = [makeMatch()];
    const output = generateIcal(matches);

    expect(output).toContain("BEGIN:VCALENDAR");
    expect(output).toContain("KCVV Elewijt//Wedstrijdkalender//NL");
    expect(output).toContain("X-WR-CALNAME:KCVV Elewijt");
    expect(output).toContain("BEGIN:VTIMEZONE");
    expect(output).toContain("TZID:Europe/Brussels");
    expect(output).toContain("BEGIN:VEVENT");
    expect(output).toContain("SUMMARY:KCVV Elewijt - KFC Turnhout");
    expect(output).toContain("kcvv-match-12345@kcvvelewijt.be");
    expect(output).toContain("https://www.kcvvelewijt.be/wedstrijd/12345");
    expect(output).toContain("2e Nationale — A-Ploeg");
    expect(output).toContain("END:VCALENDAR");
  });

  it("shows score in SUMMARY for finished matches", () => {
    const match = makeMatch({
      status: "finished",
      home_team: { id: 1, name: "KCVV Elewijt", score: 3 },
      away_team: { id: 2, name: "KFC Turnhout", score: 1 },
    } as Partial<Match>);
    const output = generateIcal([match]);

    expect(output).toContain("SUMMARY:KCVV Elewijt 3-1 KFC Turnhout");
  });

  it("uses home venue as LOCATION when provided", () => {
    const match = makeMatch({ venue: "Stadion De Kuip" });
    const output = generateIcal([match]);

    expect(output).toContain("Stadion De Kuip");
  });

  it("falls back to Sportpark Elewijt for home matches without venue", () => {
    const match = makeMatch({ venue: undefined });
    const output = generateIcal([match]);

    expect(output).toContain("Sportpark Elewijt\\, Elewijt\\, België");
  });

  it("omits LOCATION for away matches without venue", () => {
    const match = makeMatch({
      venue: undefined,
      home_team: { id: 2, name: "KFC Turnhout", score: undefined },
      away_team: { id: 1, name: "KCVV Elewijt", score: undefined },
    } as Partial<Match>);
    const output = generateIcal([match]);

    expect(output).not.toMatch(/^LOCATION:/m);
  });

  it("filters by side=home", () => {
    const home = makeMatch({ id: 1 });
    const away = makeMatch({
      id: 2,
      home_team: { id: 3, name: "FC Away", score: undefined },
      away_team: { id: 1, name: "KCVV Elewijt", score: undefined },
    } as Partial<Match>);
    const output = generateIcal([home, away], { side: "home" });

    expect(output).toContain("kcvv-match-1@kcvvelewijt.be");
    expect(output).not.toContain("kcvv-match-2@kcvvelewijt.be");
  });

  it("filters by side=away", () => {
    const home = makeMatch({ id: 1 });
    const away = makeMatch({
      id: 2,
      home_team: { id: 3, name: "FC Away", score: undefined },
      away_team: { id: 1, name: "KCVV Elewijt", score: undefined },
    } as Partial<Match>);
    const output = generateIcal([home, away], { side: "away" });

    expect(output).not.toContain("kcvv-match-1@kcvvelewijt.be");
    expect(output).toContain("kcvv-match-2@kcvvelewijt.be");
  });

  it("deduplicates matches by id", () => {
    const match1 = makeMatch({ id: 100 });
    const match2 = makeMatch({ id: 100 });
    const output = generateIcal([match1, match2]);

    const eventCount = output.split("BEGIN:VEVENT").length - 1;
    expect(eventCount).toBe(1);
  });

  it("side=all includes all matches", () => {
    const home = makeMatch({ id: 1 });
    const away = makeMatch({
      id: 2,
      home_team: { id: 3, name: "FC Away", score: undefined },
      away_team: { id: 1, name: "KCVV Elewijt", score: undefined },
    } as Partial<Match>);
    const output = generateIcal([home, away], { side: "all" });

    expect(output).toContain("kcvv-match-1@kcvvelewijt.be");
    expect(output).toContain("kcvv-match-2@kcvvelewijt.be");
  });

  it("uses CET offset (UTC+1) for winter dates", () => {
    const match = makeMatch({
      date: new Date("2025-01-15T00:00:00.000Z"),
      time: "15:00",
    });
    const output = generateIcal([match]);
    // 15:00 Brussels local time preserved with TZID
    expect(output).toContain("DTSTART;TZID=Europe/Brussels:20250115T150000");
  });

  it("uses CEST offset (UTC+2) for summer dates", () => {
    const match = makeMatch({
      date: new Date("2025-07-15T00:00:00.000Z"),
      time: "15:00",
    });
    const output = generateIcal([match]);
    // 15:00 Brussels local time preserved with TZID
    expect(output).toContain("DTSTART;TZID=Europe/Brussels:20250715T150000");
  });

  /**
   * The `time`-less branch. A BFF match date carries Belgian wall-clock in its
   * UTC fields, so converting it to Brussels adds a phantom +1/+2h — and this
   * feed is *subscribed*, so a wrong DTSTART follows people into their calendar
   * app until they unsubscribe. The branch shipped untested (#2601).
   */
  describe("a fixture with no kickoff time", () => {
    it("emits the date's own wall clock rather than converting it", () => {
      const match = makeMatch({
        date: new Date(Date.UTC(2025, 2, 22, 15, 0)),
        time: undefined,
      });
      const output = generateIcal([match]);

      expect(output).toContain("DTSTART;TZID=Europe/Brussels:20250322T150000");
    });

    it("keeps a midnight fixture at midnight, in winter too", () => {
      const match = makeMatch({
        date: new Date(Date.UTC(2025, 0, 15, 0, 0)),
        time: undefined,
      });
      const output = generateIcal([match]);

      expect(output).toContain("DTSTART;TZID=Europe/Brussels:20250115T000000");
    });

    it("agrees with the same kickoff spelled out in `time`", () => {
      const date = new Date(Date.UTC(2025, 6, 15, 15, 0));
      const implicit = generateIcal([makeMatch({ date, time: undefined })]);
      const explicit = generateIcal([makeMatch({ date, time: "15:00" })]);

      // The event's own DTSTART, not the VTIMEZONE transition rules above it —
      // those are identical whatever the fixture, so a looser match passes
      // while the two branches disagree by two hours.
      const dtstart = (ics: string) => /^DTSTART;TZID=.*$/m.exec(ics)?.[0];
      expect(dtstart(implicit)).toBe(dtstart(explicit));
      expect(dtstart(implicit)).toBeDefined();
    });

    it("keeps a 22:00 kickoff on its own day", () => {
      const match = makeMatch({
        date: new Date(Date.UTC(2025, 7, 3, 22, 0)),
        time: undefined,
      });
      const output = generateIcal([match]);

      expect(output).toContain("DTSTART;TZID=Europe/Brussels:20250803T220000");
    });
  });

  it("sorts matches by date", () => {
    const earlier = makeMatch({
      id: 1,
      date: new Date("2025-03-01T14:00:00Z"),
    });
    const later = makeMatch({
      id: 2,
      date: new Date("2025-04-01T14:00:00Z"),
    });
    const output = generateIcal([later, earlier]);

    const idx1 = output.indexOf("kcvv-match-1@kcvvelewijt.be");
    const idx2 = output.indexOf("kcvv-match-2@kcvvelewijt.be");
    expect(idx1).toBeLessThan(idx2);
  });
});

describe("a pitch-reservation placeholder", () => {
  it("never renders a home===away SUMMARY", () => {
    const output = generateIcal([makePlaceholderMatch()]);

    expect(output).not.toContain("SUMMARY:KCVV Elewijt - KCVV Elewijt");
  });

  it("uses the reservation subject as the SUMMARY, mirroring formatMatchTitle", () => {
    const output = generateIcal([
      makePlaceholderMatch({ competition: "Jeugdtornooi" }),
    ]);

    expect(output).toContain("SUMMARY:Jeugdtornooi — KCVV Elewijt");
  });

  it("falls back to the reservation word when no competition is set", () => {
    const output = generateIcal([
      makePlaceholderMatch({ competition: undefined }),
    ]);

    expect(output).toContain("SUMMARY:Gereserveerd — KCVV Elewijt");
  });

  it("is treated as a home fixture for side filtering — it is the club's own booking, and both sides are literally the same club name", () => {
    const match = makePlaceholderMatch();

    expect(generateIcal([match], { side: "home" })).toContain("BEGIN:VEVENT");
    expect(generateIcal([match], { side: "away" })).not.toContain(
      "BEGIN:VEVENT",
    );
  });

  it("folds a cancelled status into the SUMMARY, the way every other reservation renderer does", () => {
    const output = generateIcal([
      makePlaceholderMatch({ status: "postponed" }),
    ]);

    expect(output).toContain(
      "SUMMARY:Jeugdtornooi — KCVV Elewijt — Uitgesteld",
    );
  });

  it("omits LOCATION when no venue is set — a reservation can be an external tournament, not necessarily at the home venue", () => {
    const output = generateIcal([makePlaceholderMatch({ venue: undefined })]);

    expect(output).not.toMatch(/^LOCATION:/m);
  });

  it("uses the given venue for LOCATION when one is set", () => {
    const output = generateIcal([
      makePlaceholderMatch({ venue: "Sportcomplex De Nekker" }),
    ]);

    expect(output).toContain("Sportcomplex De Nekker");
  });
});

describe("normalizeCacheKey", () => {
  it("sorts teamIds so order does not matter", () => {
    expect(normalizeCacheKey("2456,1235", "all")).toBe(
      normalizeCacheKey("1235,2456", "all"),
    );
  });

  it("uses 'all' when no teamIds provided", () => {
    expect(normalizeCacheKey(null, "home")).toBe("ical:all:home");
  });

  it("includes side in cache key", () => {
    expect(normalizeCacheKey("1235", "home")).toBe("ical:1235:home");
    expect(normalizeCacheKey("1235", "away")).toBe("ical:1235:away");
  });

  it("defaults to the same key as before events existed — an existing subscription's cache entry is unaffected", () => {
    expect(normalizeCacheKey("1235", "all")).toBe("ical:1235:all");
  });

  it("gives events=1 a different cache key than the matches-only request", () => {
    const withoutEvents = normalizeCacheKey("1235", "all", false);
    const withEvents = normalizeCacheKey("1235", "all", true);

    expect(withEvents).not.toBe(withoutEvents);
  });
});

/**
 * Fixture for the merged `/kalender` event feed (`EventRepository.findUpcomingForList()`).
 * `dateStart`/`dateEnd` are genuine UTC instants (not Belgian wall-clock like a
 * `Match.date`) — see `event-datetime.ts`. `2026-04-14T22:00:00.000Z` is
 * Brussels midnight (2026-04-15, CEST +2).
 */
function makeEventItem(
  overrides: Partial<EventListItemVM> = {},
): EventListItemVM {
  return {
    id: "event-1",
    title: "Mosselfestijn",
    href: "/evenementen/mosselfestijn",
    dateStart: "2026-04-14T22:00:00.000Z",
    dateEnd: null,
    eventType: "Clubevent",
    location: "Sportpark Driesput, Elewijt",
    source: "event",
    ...overrides,
  };
}

describe("generateIcal — club activities (events flag)", () => {
  it("emits no event VEVENT when the events option is omitted (flag off)", () => {
    const output = generateIcal([makeMatch()]);

    expect(output).not.toContain("kcvv-event-");
  });

  it("emits an event VEVENT when events are passed (flag on)", () => {
    const output = generateIcal([makeMatch()], {
      events: [makeEventItem()],
    });

    expect(output).toContain("kcvv-event-event-1@kcvvelewijt.be");
    expect(output).toContain("SUMMARY:Mosselfestijn");
  });

  it("keeps the matches-only output byte-for-byte identical when the events option is omitted", () => {
    const matches = [makeMatch()];
    const withoutOption = generateIcal(matches);
    const withEmptyOptions = generateIcal(matches, { side: "all" });

    expect(withoutOption).toBe(withEmptyOptions);
  });

  it("carries the event's LOCATION when present", () => {
    const output = generateIcal([], {
      events: [makeEventItem({ location: "Sportpark Driesput, Elewijt" })],
    });

    expect(output).toContain("LOCATION:Sportpark Driesput\\, Elewijt");
  });

  it("omits LOCATION when the event has none", () => {
    const output = generateIcal([], {
      events: [makeEventItem({ location: null })],
    });

    expect(output).not.toMatch(/^LOCATION:/m);
  });

  it("points URL at the item's own detail page, using the repository-resolved href", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          href: "/evenementen/mosselfestijn",
          source: "event",
        }),
      ],
    });

    expect(output).toContain(
      "URL;VALUE=URI:https://www.kcvvelewijt.be/evenementen/mosselfestijn",
    );
  });

  it("points URL at /nieuws/[slug] for an event-article-sourced item", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          href: "/nieuws/jeugdtornooi-verslag",
          source: "article",
        }),
      ],
    });

    expect(output).toContain(
      "URL;VALUE=URI:https://www.kcvvelewijt.be/nieuws/jeugdtornooi-verslag",
    );
  });

  it("emits a Brussels-midnight event as all-day, matching buildEventIcs's rule", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          dateStart: "2026-04-14T22:00:00.000Z", // 2026-04-15T00:00 Brussels
          dateEnd: null,
        }),
      ],
    });

    expect(output).toContain("DTSTART;VALUE=DATE:20260415");
    expect(output).toContain("DTEND;VALUE=DATE:20260416");
  });

  it("spans a multi-day all-day event to the day after its last day, matching buildEventIcs's rule", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          dateStart: "2026-09-13T22:00:00.000Z", // 2026-09-14T00:00 Brussels
          dateEnd: "2026-09-15T22:00:00.000Z", // 2026-09-16T00:00 Brussels
        }),
      ],
    });

    expect(output).toContain("DTSTART;VALUE=DATE:20260914");
    expect(output).toContain("DTEND;VALUE=DATE:20260917");
  });

  it("emits a timed event with a real DTSTART and no fabricated DTEND when there is no end", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          dateStart: "2026-04-15T17:00:00.000Z", // 19:00 Brussels (CEST)
          dateEnd: null,
        }),
      ],
    });

    expect(output).toContain("DTSTART;TZID=Europe/Brussels:20260415T190000");
    expect(output).not.toMatch(/^DTEND/m);
  });

  it("keeps a timed event's own DTEND when the item has an end", () => {
    const output = generateIcal([], {
      events: [
        makeEventItem({
          dateStart: "2026-04-15T17:00:00.000Z",
          dateEnd: "2026-04-15T20:00:00.000Z",
        }),
      ],
    });

    expect(output).toContain("DTEND;TZID=Europe/Brussels:20260415T220000");
  });

  it("gives an event UID a distinct prefix from a match UID so the two can never collide", () => {
    const output = generateIcal([makeMatch({ id: 1 })], {
      events: [makeEventItem({ id: "1" })],
    });

    expect(output).toContain("kcvv-match-1@kcvvelewijt.be");
    expect(output).toContain("kcvv-event-1@kcvvelewijt.be");
  });

  it("describes the feed honestly (NAME / X-WR-CALDESC) when activities are included", () => {
    const withoutEvents = generateIcal([makeMatch()]);
    const withEvents = generateIcal([makeMatch()], {
      events: [makeEventItem()],
    });

    expect(withoutEvents).toContain("X-WR-CALNAME:KCVV Elewijt");
    expect(withEvents).toContain(
      "X-WR-CALNAME:KCVV Elewijt — Wedstrijden & Activiteiten",
    );
    expect(withEvents).toContain(
      "X-WR-CALDESC:Wedstrijden en clubactiviteiten van KCVV Elewijt",
    );
    expect(withEvents).not.toBe(withoutEvents);
  });
});
