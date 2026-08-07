import { DateTime } from "luxon";

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
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);
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
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);
  if (!dt.isValid) return { day: "", month: "" };
  return {
    day: dt.setLocale("nl").toFormat("d"),
    month: dt.setLocale("nl").toFormat("MMM"),
  };
};
