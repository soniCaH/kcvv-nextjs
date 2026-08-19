import ical from "ical-generator";
import { getVtimezoneComponent } from "@touch4it/ical-timezones";
import { DateTime } from "luxon";
import type { Match } from "@kcvv/api-contract";
import type { EventListItemVM } from "@/lib/repositories/event.repository";
import { SITE_CONFIG } from "@/lib/constants";
// Doubles as the calendar's `TZID` — an iCal protocol value, not only a display
// pin — so it is read from the one home rather than restated.
import { CLUB_TIMEZONE as TIMEZONE, toMatchDisplayZone } from "./dates";
import { parseEventDateTime } from "./event-datetime";
import { reservationTitle, reservationView } from "./match-display";

const HOME_VENUE_FALLBACK = "Sportpark Elewijt, Elewijt, België";

export interface IcalOptions {
  side?: "home" | "away" | "all";
  /**
   * Club activities (#2704) — the merged `EventRepository.findUpcomingForList()`
   * feed, already resolved to each item's own detail href. Omitting this key
   * entirely (not passing `events` at all) is what keeps a matches-only request
   * byte-for-byte identical to the pre-#2704 output; an explicit `[]` would work
   * the same for VEVENTs but the caller (the route) only ever passes this key
   * when `events=1` is set, so "key present" doubles as "flag on" here.
   */
  events?: readonly EventListItemVM[];
}

/**
 * A pitch-reservation placeholder (#2606) has `home_team.id === away_team.id`,
 * so both sides carry the literal name "KCVV Elewijt" — `isHomeMatch` returns
 * `true` for it without needing a special case. That is the intended reading:
 * a reservation is the club's own booking with no designated away side, so
 * `side=home` includes it and `side=away` excludes it (#2698). Verified
 * against `ical.test.ts`'s "is treated as a home fixture" case rather than
 * assumed.
 */
function isHomeMatch(match: Match): boolean {
  return match.home_team.name.toLowerCase().includes("elewijt");
}

/**
 * A pitch-reservation placeholder (#2606) gets its own summary rather than
 * "KCVV Elewijt - KCVV Elewijt" — via the shared `reservationTitle()`
 * (`lib/utils/match-display.ts`), the same helper `formatMatchTitle()`
 * (`/wedstrijd/[matchId]/utils.ts`, the match detail page's SEO title) calls,
 * so the wording can't drift between the two surfaces (#2698).
 *
 * Also folds in `statusWording` (e.g. "Afgelast"), the way every other
 * reservation renderer does (`<TeamAgendaRow>`, `<MatchStripView>`,
 * `<MatchHero>`, `<CalendarWeek>`, `<UpcomingMatchesClient>`) — a cancelled
 * reservation carries no opponent or score to otherwise hint that anything
 * changed, and a subscriber's calendar app has no other way to show it.
 * Scoped to the placeholder branch only: an ordinary match has the same gap
 * today, but that is a separate, pre-existing concern (out of scope here).
 */
function buildSummary(match: Match): string {
  if (match.is_placeholder) {
    const { statusWording } = reservationView(match);
    return `${reservationTitle(match)}${
      statusWording ? ` — ${statusWording.longForm}` : ""
    }`;
  }
  if (
    match.status === "finished" &&
    match.home_team.score != null &&
    match.away_team.score != null
  ) {
    return `${match.home_team.name} ${match.home_team.score}-${match.away_team.score} ${match.away_team.name}`;
  }
  return `${match.home_team.name} - ${match.away_team.name}`;
}

/**
 * No `is_placeholder` branch needed here (verified for #2698): this reads
 * only `competition`/`squadLabel`, never `home_team`/`away_team`, so it
 * cannot reproduce the "X - X" bug `buildSummary()` had. For a reservation
 * with a `competition` set, the description is a verbatim repeat of the
 * summary's subject (`DESCRIPTION:Jeugdtornooi`) rather than genuinely new
 * information — acceptable for an ICS `DESCRIPTION` field, which has no
 * neighbouring "subject" line of its own to duplicate the way an on-page
 * slot would (the Writer Rule's metadata/OG carve-out applies the same way
 * here). `squadLabel` never actually appears alongside it: the contract
 * field (`packages/api-contract/src/schemas/match.ts`) has no writer on the
 * `getMatches` path this route reads — worth its own issue, not chased here.
 */
function buildDescription(match: Match): string {
  const parts: string[] = [];
  if (match.competition) parts.push(match.competition);
  if (match.squadLabel) parts.push(match.squadLabel);
  return parts.join(" — ");
}

/**
 * A pitch-reservation placeholder (#2606) is "the club has something that
 * day, the details aren't settled" and — per the contract's own doc comment
 * (`packages/api-contract/src/schemas/match.ts`) — the club uses the same
 * device for external tournaments too. `isHomeMatch()` reading `true` for it
 * is a filtering decision ("this belongs in the club's feed"), not a claim
 * about where it happens — asserting the club's own street address for a
 * reservation with no confirmed venue would tell a subscriber's calendar app
 * to offer directions to a tournament that may be nowhere near it (#2698).
 * So the home-venue fallback is skipped for a placeholder; only a `venue`
 * PSD actually sent produces a `LOCATION` line.
 */
function buildLocation(match: Match): string | undefined {
  if (match.venue) return match.venue;
  if (match.is_placeholder) return undefined;
  if (isHomeMatch(match)) return HOME_VENUE_FALLBACK;
  return undefined;
}

/**
 * The fixture's kickoff as a Brussels wall-clock DateTime, which is what a
 * `DTSTART;TZID=Europe/Brussels` line means.
 *
 * A BFF match date is not an instant — its UTC fields already *are* Belgian
 * wall-clock — so `toMatchDisplayZone` reads it and `match.time`, when the feed
 * carries one, only overrides the hour and minute. Converting instead (the
 * pre-#2601 `time`-less branch) put every such fixture in the subscribed feed
 * one or two hours late, and rolled a 22:00 kickoff onto the next day.
 */
function buildStartDateTime(match: Match): DateTime {
  // Minute precision, as the pre-#2601 `fromObject` call implicitly had: PSD
  // never sends seconds, and a stray one would land in a DTSTART line.
  const start = toMatchDisplayZone(match.date).startOf("minute");
  if (!match.time) return start;
  const [hours, minutes] = match.time.split(":").map(Number);
  return start.set({ hour: hours, minute: minutes });
}

/**
 * `events` is appended rather than folded into `side`/`teamIds`: it is a
 * club-wide opt-in, not scoped to the selected teams (#2704 design note), so
 * it earns its own segment instead of multiplying into the team/side
 * combinations. Defaulting to `false` keeps every pre-#2704 call — and the
 * cache entries it already wrote — on the same key it always had.
 */
export function normalizeCacheKey(
  teamIds: string | null,
  side: string,
  includeEvents = false,
): string {
  const sortedIds = teamIds
    ? teamIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .sort()
        .join(",")
    : "all";
  return `ical:${sortedIds}:${side}${includeEvents ? ":events" : ""}`;
}

/**
 * `kcvv-event-` keeps an event UID's namespace disjoint from a match's
 * `kcvv-match-` one (#2704). A Sanity document id and a PSD match id are drawn
 * from unrelated id spaces and can coincide; a shared prefix would let one
 * silently collide with the other in a subscriber's calendar app instead of
 * each being updated in place on refresh.
 */
function buildEventUid(item: EventListItemVM): string {
  return `kcvv-event-${item.id}@kcvvelewijt.be`;
}

/**
 * Mirrors `buildEventIcs`'s all-day rule (`lib/utils/event-ics.ts`) exactly —
 * the per-event "Zet in agenda" download and this subscribe feed must agree on
 * which activities render as all-day, or the two surfaces would tell a
 * subscriber two different things about the same event. A Brussels-midnight
 * start, with an end that is either absent or also midnight, is all-day.
 */
function resolveEventDates(item: EventListItemVM): {
  isAllDay: boolean;
  start: DateTime;
  end: DateTime | null;
} {
  const start = parseEventDateTime(item.dateStart);
  const end = item.dateEnd ? parseEventDateTime(item.dateEnd) : null;
  const isAllDay =
    start.isValid &&
    start.toFormat("HH:mm") === "00:00" &&
    (!end?.isValid || end.toFormat("HH:mm") === "00:00");
  return { isAllDay, start, end };
}

/**
 * Adds one club-activity VEVENT. `ical-generator`'s all-day `DTEND` is
 * inclusive (it emits whatever `end` it is given verbatim), so the exclusive
 * next-day roll — a single day spans to the next morning, a multi-day span
 * ends the day after its last day — is done here, same as `buildEventIcs`. A
 * timed item with no `dateEnd` omits `end` entirely rather than fabricating a
 * duration the way a match's fixed 2h block does.
 */
function addEventVevent(cal: ReturnType<typeof ical>, item: EventListItemVM) {
  const { isAllDay, start, end } = resolveEventDates(item);

  // An unparseable `dateStart` (only reachable via a malformed event doc —
  // `EVENTS_QUERY` projects `coalesce(dateStart, "")`, so a doc missing the
  // Studio-required field still clears the upcoming filter on a future
  // `dateEnd` and reaches here) is dropped, not fatal — the same handling
  // `mergeEventFeed` gives it (sorts to the end) and `<EventMonthList>` gives
  // it (drops it when grouping). `ical-generator` throws on an invalid Luxon
  // `start`, which would otherwise take the whole feed — matches included —
  // down with it (#2711 review).
  if (!start.isValid) return;

  const location = item.location ?? undefined;
  const url = `${SITE_CONFIG.siteUrl}${item.href}`;
  const id = buildEventUid(item);
  const summary = item.title;

  if (isAllDay) {
    const lastDay = end?.isValid && end > start ? end : start;
    cal.createEvent({
      id,
      summary,
      allDay: true,
      start,
      end: lastDay.plus({ days: 1 }),
      url,
      ...(location ? { location } : {}),
    });
    return;
  }

  cal.createEvent({
    id,
    summary,
    start,
    timezone: TIMEZONE,
    url,
    // An invalid `end` (unparseable `dateEnd`) is dropped the same way a
    // missing one is — never fabricated, never handed to `ical-generator`
    // (which throws on an invalid Luxon value).
    ...(end?.isValid ? { end } : {}),
    ...(location ? { location } : {}),
  });
}

export function generateIcal(
  matches: readonly Match[],
  options: IcalOptions = {},
): string {
  const { side = "all", events } = options;
  // `events` distinguishes "flag on, feed happens to have zero upcoming
  // activities right now" from "flag off" — both would otherwise produce zero
  // VEVENTs, but only the former should describe itself as an activities feed.
  const includeEvents = events !== undefined;

  const cal = ical({
    name: includeEvents
      ? "KCVV Elewijt — Wedstrijden & Activiteiten"
      : "KCVV Elewijt — Wedstrijden",
    prodId: "-//KCVV Elewijt//Wedstrijdkalender//NL",
    timezone: {
      name: TIMEZONE,
      generator: getVtimezoneComponent,
    },
    x: {
      "X-WR-CALDESC": includeEvents
        ? "Wedstrijden en clubactiviteiten van KCVV Elewijt"
        : "Wedstrijdkalender van KCVV Elewijt",
      "X-WR-TIMEZONE": TIMEZONE,
    },
  });

  // Deduplicate by match id
  const seen = new Set<number>();
  const unique = matches.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  // Filter by side
  const filtered =
    side === "home"
      ? unique.filter(isHomeMatch)
      : side === "away"
        ? unique.filter((m) => !isHomeMatch(m))
        : unique;

  // Sort by date
  const sorted = [...filtered].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  for (const match of sorted) {
    const start = buildStartDateTime(match);
    const end = start.plus({ hours: 2 });
    const location = buildLocation(match);

    cal.createEvent({
      id: `kcvv-match-${match.id}@kcvvelewijt.be`,
      summary: buildSummary(match),
      start,
      end,
      timezone: TIMEZONE,
      description: buildDescription(match),
      url: `https://www.kcvvelewijt.be/wedstrijd/${match.id}`,
      ...(location ? { location } : {}),
    });
  }

  // Club activities (#2704) — `EventRepository.findUpcomingForList()` is
  // already upcoming-only and chronologically sorted by construction (its own
  // GROQ filters + `mergeEventFeed`'s sort), so no re-filter/re-sort is done
  // here; this loop only maps each item to a VEVENT.
  for (const item of events ?? []) {
    addEventVevent(cal, item);
  }

  return cal.toString();
}
