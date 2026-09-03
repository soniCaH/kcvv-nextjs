/**
 * A pitch-reservation placeholder is never a link — on every renderer (#2801)
 *
 * A fixture where both sides are the same club (`homeClubId === awayClubId`,
 * docs/ubiquitous-language.md § "Pitch-Reservation Placeholder") resolves to
 * `/wedstrijd/{id}`, a page that renders nothing worth clicking through to —
 * #2606 decision 5 dropped the `<Link>` for this reason. That rule is not
 * held by anything shared (#2688's `/simplify` round declined the extraction
 * into a wrapper component, #2699 decision 3), so it is held by six
 * independent implementations plus this file.
 *
 * **This is the growth guard, not a pin.** `failed-read-boundaries.test.ts`
 * names the split its own docblock draws: a file that *"pins the routes
 * #2563 touched; it is not the growth guard … the rule that scales is rule 5
 * in `cross-page-consistency.test.ts`"*. This file is that rule's sibling for
 * a different concept — table-driven, one row per renderer, so a rule that
 * must hold across every renderer *and any renderer added later* has exactly
 * one place to grow. **A new reservation renderer adds one line to
 * `RESERVATION_RENDERERS` below — nothing else.**
 *
 * It matters because reservations are not rare-and-forgettable: #2606's
 * census records seasonal batches (next May's eight rows across four
 * tournaments, the A-team's August friendly), while the renderers themselves
 * get edited in the ten months when none is on screen — exactly when a
 * regression is invisible to whoever is looking at the page.
 *
 * **Coverage.** #2801 names eight renderers: `TeamAgendaRow` and
 * `MatchStripView` already asserted this locally
 * (`TeamAgendaRow.test.tsx:796`/`:1022`, `MatchStripView.test.tsx:259`) and
 * are still listed here — a renderer having its own local test does not
 * exempt it from the shared rule, and the two entries prove this table
 * matches what those tests already established. The other six —
 * `CalendarWeek`, `CalendarAgenda`, `CalendarMonth`, `UpcomingMatchesClient`,
 * `FirstTeamAgendaRow`, and `MatchHero`'s reservation branch — had no
 * assertion anywhere before this file. `FirstTeamAgendaRow` and
 * `CalendarMonth`'s selected-day panel both delegate to `<TeamAgendaRow>`
 * rather than rendering their own reservation markup, so their rows below
 * are regression cover against a future host that stops delegating, not
 * proof of a second implementation.
 *
 * **What this file found, not just what it guards.** Every one of the eight
 * was already correct when this file was written — #2606/#2688 built the
 * reduced (`isPlaceholder` / `isReducedMatchRow`) branch into all of them
 * before this ticket existed. Confirmed red first by hand: temporarily
 * forcing `CalendarWeek`'s `WeekMatchCard` to skip its `isReducedMatchRow`
 * branch (so a reservation fell through to the normal `<Link>` row) turned
 * this file's `CalendarWeek` case red, for exactly the reason expected — see
 * the PR body for the exact diff and the restored/green rerun. Every case
 * here was green on its first real run against production code, which on
 * its own proves nothing about the six that were previously untested; the
 * hand mutation above is what stands in for a real red run.
 *
 * **Not in scope** (#2801): the view-model union (#2699 decisions 1-2 /
 * #2802) — a `<Link>` is a render choice no data shape can forbid, so this
 * guard is independent of it.
 *
 * @see https://github.com/soniCaH/www.kcvvelewijt.be/issues/2801
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamAgendaRow } from "@/components/team/TeamMatchesSection/TeamAgendaRow";
import { MatchStripView } from "@/components/layout/MatchStrip/MatchStripView";
import { CalendarWeek } from "@/components/calendar/CalendarWeek/CalendarWeek";
import { CalendarAgenda } from "@/components/calendar/CalendarAgenda/CalendarAgenda";
import { CalendarMonth } from "@/components/calendar/CalendarMonth/CalendarMonth";
import { UpcomingMatchesClient } from "@/components/home/UpcomingMatches/UpcomingMatchesClient";
import { FirstTeamAgendaRow } from "@/components/home/FirstTeamsBlock/FirstTeamAgendaRow";
import { MatchHero } from "@/components/match/MatchHero";
import { reservationMatch } from "@/components/calendar/calendar-mocks";
import { KCVV_CLUB_ID } from "@/lib/constants";
import type {
  ScheduleReservation,
  UpcomingReservation,
} from "@/components/match/types";

// Every renderer below either mounts no <Link> for a reservation row at all
// (the assertion this file exists to make) or, for the day-panel/homepage
// wrapper rows, delegates to one that doesn't — so the real `next/link` is
// never actually rendered by any case here. Mocked anyway, matching
// `TeamAgendaRow.test.tsx` / `MatchStripView.test.tsx` / the three
// `Calendar*.test.tsx` files this table draws its fixtures and components
// from: a real `<Link>` needs the app-router context none of these render
// trees provide, and the mock is what those peer files reach for instead.
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    className,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

// `CalendarAgenda`'s reservation row renders a `<Crest>`, which reaches for
// `next/image` whenever a fixture carries a `logo`. None of the fixtures
// below do, so no case here actually needs this — mocked regardless to match
// `CalendarWeek.test.tsx` / `CalendarAgenda.test.tsx` / `CalendarMonth.test.tsx`,
// the three files this table's `reservationMatch()` fixture and its
// `Calendar*` props convention come from.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

/** The `ScheduleReservation` shape `<TeamAgendaRow>`/`<MatchStripView>`/
 *  `<FirstTeamAgendaRow>`/`<MatchHero>` consume — the same literal
 *  `TeamAgendaRow.test.tsx`'s `PLACEHOLDER` and `MatchStripView.test.tsx`'s
 *  `reservation` already use, so this table asserts the same fixture those
 *  two files' own local tests do. */
const scheduleReservation: ScheduleReservation = {
  isPlaceholder: true,
  id: 90,
  date: new Date("2026-05-09T09:30:00.000Z"),
  time: "09:30",
  team: { id: KCVV_CLUB_ID, name: "KCVV Elewijt" },
  status: "scheduled",
  competition: "Tornooi",
};

/** The `UpcomingReservation` shape `<UpcomingMatchesClient>` consumes —
 *  mirrors `UpcomingMatches.mocks.ts`'s (unexported) `mockUpcomingReservation`. */
const upcomingReservation: UpcomingReservation = {
  isPlaceholder: true,
  id: 90,
  date: new Date("2026-05-09T09:30:00.000Z"),
  time: "09:30",
  team: { id: KCVV_CLUB_ID, name: "KCVV Elewijt" },
  status: "scheduled",
  competition: "Tornooi",
  kcvvTeamLabel: "U13",
};

/** One table row: a name for the `it.each` title, and a closure that mounts
 *  the renderer with a reservation fixture. `render()` itself is the
 *  assertion target's *cause*; the shared `it.each` body below asserts the
 *  *effect* (no link role) so every row states only what differs. */
interface ReservationRenderer {
  name: string;
  render: () => void;
}

const RESERVATION_RENDERERS: ReservationRenderer[] = [
  {
    name: "TeamAgendaRow",
    render: () => render(<TeamAgendaRow match={scheduleReservation} />),
  },
  {
    name: "MatchStripView",
    render: () =>
      render(
        <MatchStripView
          data={{ result: null, fixture: scheduleReservation }}
        />,
      ),
  },
  {
    name: "CalendarWeek",
    render: () =>
      render(
        <CalendarWeek
          matches={[reservationMatch()]}
          events={[]}
          weekStart="2026-03-15"
        />,
      ),
  },
  {
    name: "CalendarAgenda",
    render: () =>
      render(
        <CalendarAgenda
          matches={[reservationMatch()]}
          events={[]}
          currentMonth={3}
          currentYear={2026}
        />,
      ),
  },
  {
    name: "CalendarMonth",
    render: () =>
      render(
        <CalendarMonth
          matches={[reservationMatch()]}
          events={[]}
          selectedDate="2026-03-15"
          onSelectDate={() => {}}
          currentMonth={3}
          currentYear={2026}
        />,
      ),
  },
  {
    name: "UpcomingMatchesClient",
    render: () =>
      render(
        <UpcomingMatchesClient
          matches={[upcomingReservation]}
          initialVisible={5}
          kcvvTeamId={KCVV_CLUB_ID}
        />,
      ),
  },
  {
    name: "FirstTeamAgendaRow",
    render: () =>
      render(
        <FirstTeamAgendaRow
          match={scheduleReservation}
          teamSlug="eerste-ploeg"
          kind="fixture"
        />,
      ),
  },
  {
    name: "MatchHero (reservation branch)",
    render: () =>
      render(
        <MatchHero
          homeTeam={{ name: "KCVV Elewijt" }}
          awayTeam={{ name: "KCVV Elewijt" }}
          date={scheduleReservation.date}
          time={scheduleReservation.time}
          status={scheduleReservation.status}
          competition={scheduleReservation.competition}
          isPlaceholder
        />,
      ),
  },
];

describe("a pitch-reservation placeholder is never a link (#2801)", () => {
  it.each(RESERVATION_RENDERERS)(
    "$name — the reservation renders with no <Link>",
    ({ render: renderRow }) => {
      renderRow();
      expect(screen.queryByRole("link")).toBeNull();
    },
  );
});
