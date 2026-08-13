import { DateTime } from "luxon";
import { capitalize } from "./capitalize";

/**
 * KCVV is in Belgium, and every date the site renders is Belgian wall-clock.
 *
 * The constant is **club**-scoped on purpose: it governs articles, galleries,
 * search and match metadata, not only events. Its previous event-scoped name
 * (`EVENT_TIMEZONE`, in `./event-datetime`) is precisely why every non-event
 * formatter kept assuming it did not apply to them and reached for the runtime
 * zone instead (#2430). Storage stays UTC; this is presentation only.
 */
export const CLUB_TIMEZONE = "Europe/Brussels";

/**
 * The site's single date parse: a stored UTC instant → Belgian wall-clock, nl
 * locale. Every formatter goes through it — the shared ones below and the
 * route-local ones that render a shape with only one consumer — so a rendered
 * calendar date never depends on where the code runs. Vercel is UTC, the
 * browser is the visitor's own zone, and `<MatchStripView>` formats in both: an
 * unpinned late-evening kickoff renders one day on the server and the next
 * after hydration. Offset-less ISO input is read as UTC (the stored contract)
 * rather than the runtime zone.
 *
 * **Not for PSD match dates** — see `toMatchDisplayZone`.
 */
export function toDisplayZone(date: Date | string): DateTime {
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date, { zone: "utc" })
      : DateTime.fromJSDate(date);
  return dt.setZone(CLUB_TIMEZONE).setLocale("nl");
}

/**
 * The parse for a PSD match date, which is **not** a true instant. The BFF
 * builds it with `Date.UTC(…)` straight from PSD's Belgian local kickoff
 * string (`apps/api/src/psd/transforms.ts` · `parseDateString`), so the Date's
 * UTC fields already *are* Belgian wall-clock. Reading them off UTC is
 * therefore the pin; putting one through `toDisplayZone` adds a phantom
 * +1/+2h and rolls a ≥22:00 kickoff onto the next day.
 *
 * Two data sources, opposite conventions — check which one you hold before
 * zoning it. Sanity `event` datetimes are real UTC instants (`toDisplayZone`);
 * anything reached through a BFF `Match` is wall-clock (this).
 *
 * `keepLocalTime` carries the wall clock across to the club zone instead of
 * leaving the result sitting in UTC. `toFormat` and `toISODate` read the same
 * either way, but the returned DateTime is now a *correct instant* too — so
 * `toISO()`, `toMillis()` and a comparison against `Date.now()` all mean what
 * they say, which matters the moment one of these feeds an ICS or JSON-LD.
 *
 * Accepts the serialised form as well, because `/kalender` carries its matches
 * as `date.toISOString()` — reading that back through `toDisplayZone` is the
 * same defect one `JSON.stringify` later.
 *
 * **Why this is a docblock and not a branded type.** Weighed and declined in
 * #2601. A brand on `Match.date` in `@kcvv/api-contract` would not by itself
 * make the wrong choice a compile error: a branded `Date` is a *subtype* of
 * `Date`, so `toDisplayZone` keeps accepting it, and turning that into an error
 * means negatively typing every Sanity date to exclude the brand. The brand
 * would also have to be threaded through `ScheduleMatch`, `UpcomingMatch`,
 * `MatchHeroProps` and `CalendarMatch` — where it dies outright, that one
 * carries its date as a `string` — or it is lost at the first mapper
 * (`components/match/transform.ts` assigns `date: match.date` straight across).
 * What holds the invariant instead: two differently-*named* parses, formatters
 * named after the source they read, and rule 3 of
 * `src/app/__tests__/cross-page-consistency.test.ts`, which fails any parse
 * that names no zone at all.
 */
export function toMatchDisplayZone(date: Date | string): DateTime {
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date, { zone: "utc" })
      : DateTime.fromJSDate(date, { zone: "utc" });
  return dt.setZone(CLUB_TIMEZONE, { keepLocalTime: true }).setLocale("nl");
}

/** Today's calendar date in the club's zone — `YYYY-MM-DD`. */
export function clubToday(): string {
  return DateTime.now().setZone(CLUB_TIMEZONE).toISODate()!;
}

/**
 * Format date for article display in Belgian Dutch format (e.g., "15 januari 2024")
 * @param date - Date object or ISO string
 */
export const formatArticleDate = (date: Date | string): string => {
  const dt = toDisplayZone(date);
  if (!dt.isValid) return "";
  return dt.toFormat("d MMMM yyyy");
};

/**
 * The compact shapes below are written once and given one entry point per
 * parse, because both are rendered over a Sanity datetime (an instant) and over
 * a BFF match date (wall-clock). The fork is at the *parse*, never at the
 * format, so a caller picking the wrong one is picking a wrong *name* rather
 * than passing a silently-off-by-two-hours argument.
 *
 * Locale-pinned through Luxon like every other formatter here — `toLocale*`
 * would resolve the month and weekday names from whatever ICU data the runtime
 * happens to ship, which differs between Node, the browser and CI and would
 * surface as visual-regression drift.
 * `src/app/__tests__/cross-page-consistency.test.ts` holds that ban site-wide.
 */
const widgetShape = (dt: DateTime): string =>
  dt.isValid ? capitalize(dt.toFormat("ccc d MMMM")) : "";

const dayMonthShape = (dt: DateTime): { day: string; month: string } =>
  dt.isValid
    ? { day: dt.toFormat("d"), month: dt.toFormat("MMM") }
    : { day: "", month: "" };

/**
 * Format date in compact widget format (e.g., "Za 22 maart")
 * Uses abbreviated weekday with capitalised first letter, no year.
 */
export const formatWidgetDate = (date: Date | string): string =>
  widgetShape(toDisplayZone(date));

/** Same shape for a BFF match date — see `toMatchDisplayZone`. */
export const formatMatchWidgetDate = (date: Date | string): string =>
  widgetShape(toMatchDisplayZone(date));

/**
 * Compact day + abbreviated month, e.g. `{ day: "3", month: "aug" }`.
 *
 * Match-only: `<MatchStrip>`'s date stub is the one surface that renders this
 * shape, and it renders a fixture. The instant-parse twin was deleted with the
 * last caller (#2601) rather than left standing as the easier import to reach
 * for — the whole defect class this file guards against is a caller picking the
 * parse that happens to be in scope.
 */
export const formatMatchDayMonth = (
  date: Date | string,
): { day: string; month: string } => dayMonthShape(toMatchDisplayZone(date));
