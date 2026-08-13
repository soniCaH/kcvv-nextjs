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
 */
export function toMatchDisplayZone(date: Date): DateTime {
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone(CLUB_TIMEZONE, { keepLocalTime: true })
    .setLocale("nl");
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
 * Format date in compact widget format (e.g., "Za 22 maart")
 * Uses abbreviated weekday with capitalised first letter, no year.
 */
export const formatWidgetDate = (date: Date | string): string => {
  const dt = toDisplayZone(date);
  if (!dt.isValid) return "";
  return capitalize(dt.toFormat("ccc d MMMM"));
};

/**
 * Compact day + abbreviated month, e.g. `{ day: "3", month: "aug" }`.
 *
 * Locale-pinned through Luxon like every other formatter here — `toLocale*`
 * would resolve the month name from whatever ICU data the runtime happens to
 * ship, which differs between Node, the browser and CI and would surface as
 * visual-regression drift. `src/app/__tests__/cross-page-consistency.test.ts`
 * holds that ban site-wide.
 */
export const formatDayMonth = (
  date: Date | string,
): { day: string; month: string } => {
  const dt = toDisplayZone(date);
  if (!dt.isValid) return { day: "", month: "" };
  return { day: dt.toFormat("d"), month: dt.toFormat("MMM") };
};
