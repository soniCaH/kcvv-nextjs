import { DateTime } from "luxon";
import { EVENT_TIMEZONE } from "./event-datetime";

/**
 * Parse into Belgian wall-clock, so the rendered calendar date does not depend
 * on where the code runs. Vercel is UTC, the browser is the visitor's own zone,
 * and `<MatchStripView>` formats in both — an unpinned late-evening kickoff
 * renders one day on the server and the next in the browser. Offset-less ISO
 * input is read as UTC, the same contract `parseEventDateTime` uses.
 */
function toDisplayZone(date: Date | string): DateTime {
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date, { zone: "utc" })
      : DateTime.fromJSDate(date);
  return dt.setZone(EVENT_TIMEZONE);
}

/**
 * Format date for article display in Belgian Dutch format (e.g., "15 januari 2024")
 * @param date - Date object or ISO string
 */
export const formatArticleDate = (date: Date | string): string => {
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);
  return dt.setLocale("nl").toFormat("d MMMM yyyy");
};

/**
 * Format date in compact widget format (e.g., "Za 22 maart")
 * Uses abbreviated weekday with capitalised first letter, no year.
 */
export const formatWidgetDate = (date: Date | string): string => {
  const dt = toDisplayZone(date);
  if (!dt.isValid) return "";
  const s = dt.setLocale("nl").toFormat("ccc d MMMM");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Compact day + abbreviated month, e.g. `{ day: "3", month: "aug" }`.
 *
 * Locale-pinned through Luxon like every other formatter here — `toLocale*`
 * would resolve the month name from whatever ICU data the runtime happens to
 * ship, which differs between Node, the browser and CI and would surface as
 * visual-regression drift.
 */
export const formatDayMonth = (
  date: Date | string,
): { day: string; month: string } => {
  const dt = toDisplayZone(date).setLocale("nl");
  if (!dt.isValid) return { day: "", month: "" };
  return { day: dt.toFormat("d"), month: dt.toFormat("MMM") };
};
