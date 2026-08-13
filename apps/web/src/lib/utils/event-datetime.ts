import type { DateTime } from "luxon";
import { toDisplayZone } from "./dates";

/**
 * Parse a (UTC) ISO event datetime into a Brussels-zoned, nl-locale DateTime.
 *
 * The event domain's name for the site's one date parse — Sanity stores `event`
 * datetimes as real UTC instants, which is exactly `toDisplayZone`'s contract
 * (offset-less input read as UTC, never the runtime zone). It delegates rather
 * than re-deriving, so the zone lives in one place (#2430); the wrapper stays
 * because `parseEventDateTime(event.dateStart)` is what reads right at the
 * event call sites.
 *
 * Do **not** reach for this on a BFF `Match` date — that one is Belgian
 * wall-clock already, see `toMatchDisplayZone` in `./dates`.
 */
export function parseEventDateTime(iso: string): DateTime {
  return toDisplayZone(iso);
}
