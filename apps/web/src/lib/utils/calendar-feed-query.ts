/**
 * The `/api/calendar.ics` club-activities flag: one query-parameter name and
 * accepted value, shared by the emit side
 * (`CalendarSubscribePanel.buildWebcalUrl`) and the read side
 * (`calendar.ics/route.ts`). A leaf module rather than living in `ical.ts`
 * because `CalendarSubscribePanel` is a `"use client"` component and
 * `ical.ts` pulls in `ical-generator`, luxon, and server-only repositories.
 * `ical.ts` re-exports these two constants for its own (server-side)
 * consumers — see `resolveFeedVariant`.
 */
export const CALENDAR_EVENTS_PARAM = "events";
export const CALENDAR_EVENTS_PARAM_VALUE = "1";
