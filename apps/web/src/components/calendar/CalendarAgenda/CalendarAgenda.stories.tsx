import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within } from "storybook/test";
import { CalendarAgenda } from "./CalendarAgenda";
import type { CalendarMatch, CalendarEvent } from "@/app/(main)/kalender/utils";
import { fixtureImage } from "@test-fixtures/images";
import { tournamentMatch } from "../calendar-mocks";

const meta = {
  title: "Features/Calendar/CalendarAgenda",
  component: CalendarAgenda,
  parameters: { layout: "padded" },
  tags: ["autodocs", "vr"],
  decorators: [
    (Story) => (
      <div className="bg-cream max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarAgenda>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Mock data ──────────────────────────────────────────────────────────────

const kcvv = {
  id: 1,
  name: "KCVV Elewijt",
  logo: fixtureImage("sponsor-logo", 0),
};

function match(
  id: number,
  date: string,
  team: string,
  opponent: string,
  opts: Partial<CalendarMatch> = {},
): CalendarMatch {
  const isHome = opts.isHome ?? true;
  return {
    id,
    date,
    time: date.slice(11, 16),
    homeTeam: isHome ? kcvv : { id: 100 + id, name: opponent },
    awayTeam: isHome ? { id: 100 + id, name: opponent } : kcvv,
    scoreDisplay: { type: "vs" },
    status: "scheduled",
    competition: "Competitie",
    team,
    isHome,
    isPlaceholder: false,
    ...opts,
  };
}

function event(
  id: string,
  dateStart: string,
  title: string,
  eventType: CalendarEvent["eventType"],
): CalendarEvent {
  return {
    id,
    dateStart,
    title,
    href: `/evenementen/${id}`,
    eventType,
    source: "event",
  };
}

const baseProps = { currentMonth: 9, currentYear: 2026 };

// A normal month: a sparse Sunday A-match + an event, where the agenda shines.
const sparseMatches: CalendarMatch[] = [
  match(1, "2026-09-13T15:00:00", "A-ploeg", "Racing Mechelen"),
  match(2, "2026-09-20T15:00:00", "A-ploeg", "Kampenhout", {
    status: "finished",
    homeScore: 1,
    awayScore: 2,
    scoreDisplay: { type: "score", home: 1, away: 2 },
  }),
];
const sparseEvents: CalendarEvent[] = [
  event("alv", "2026-09-09T20:00:00", "Algemene ledenvergadering", "Clubevent"),
];

// The dense-Saturday stress case: 10 youth matches + 1 event on one day.
const denseMatches: CalendarMatch[] = Array.from({ length: 10 }, (_, i) =>
  match(
    100 + i,
    `2026-09-12T${String(9 + i).padStart(2, "0")}:00:00`,
    `U${7 + i}`,
    "Tegenstander",
    { isHome: i % 3 !== 0 },
  ),
);
const denseEvents: CalendarEvent[] = [
  event("spaghetti", "2026-09-12T18:00:00", "Spaghetti-avond", "Clubevent"),
];

// ── Stories ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { ...baseProps, matches: sparseMatches, events: sparseEvents },
};

/**
 * A drawn match (#2512/#2656) — the row now reads the shared, ink-muted
 * `OUTCOME_UNDERLINE.light.draw` band instead of the local copy's
 * `draw: undefined`. No outcome word is added: `<MatchVenueTag>` already
 * assigns the score, the same way it does for the win/loss rows beside it.
 */
export const DrawResult: Story = {
  args: {
    ...baseProps,
    matches: [
      match(3, "2026-09-06T15:00:00", "A-ploeg", "SK Londerzeel", {
        status: "finished",
        homeScore: 1,
        awayScore: 1,
        scoreDisplay: { type: "score", home: 1, away: 1 },
      }),
      ...sparseMatches,
    ],
    events: sparseEvents,
  },
};

export const DenseSaturday: Story = {
  args: { ...baseProps, matches: denseMatches, events: denseEvents },
};

export const SingleEventDay: Story = {
  args: {
    ...baseProps,
    matches: [],
    events: [
      event(
        "tornooi",
        "2026-09-19T10:00:00",
        "Najaarstornooi U13",
        "Jeugdwerking",
      ),
    ],
  },
};

export const EmptyMonth: Story = {
  args: { ...baseProps, matches: [], events: [] },
};

/**
 * A youth tournament placeholder (#2606) beside a normal row — no opponent,
 * no link, the club crest and the competition subject via `reservationView()`
 * instead of "KCVV Elewijt — KCVV Elewijt" (#2688).
 */
export const WithReservation: Story = {
  args: {
    ...baseProps,
    matches: [
      ...sparseMatches,
      match(90, "2026-09-13T09:30:00", "U8", "KCVV Elewijt", {
        homeTeam: kcvv,
        awayTeam: kcvv,
        competition: "Tornooi",
        isPlaceholder: true,
      }),
    ],
    events: sparseEvents,
  },
};

/**
 * A tournament fixture (#2696/#2715) beside a normal row — one crest (the
 * named club's, not KCVV's), no vs-framing, no link. Distinct from
 * `WithReservation` above: the crest and subject name a real opponent
 * (`TORNOOI · FC ZEMST SPORTIEF`), where a placeholder's subject is the
 * competition alone.
 */
export const WithTournament: Story = {
  args: {
    ...baseProps,
    matches: [
      ...sparseMatches,
      tournamentMatch({ date: "2026-09-13T09:30:00" }),
    ],
    events: sparseEvents,
  },
};

/**
 * A tournament fixture whose result is already known (#2696 review) — once a
 * scoreline exists the named club really was the opponent, so the row
 * reverts to the ordinary linked two-crest scoreboard instead of staying
 * reduced.
 */
export const PlayedTournament: Story = {
  args: {
    ...baseProps,
    matches: [
      tournamentMatch({
        date: "2026-09-13T09:30:00",
        status: "finished",
        homeScore: 4,
        awayScore: 1,
        scoreDisplay: { type: "score", home: 4, away: 1 },
      }),
    ],
    events: [],
  },
};

/**
 * The List Row Fill Rule's keyboard-focus half (DESIGN.md § Motion, #2624):
 * a real `element.focus()` — not a synthetic pointer event — so it triggers
 * genuine `:focus-visible` and lands the inset outline the static VR runner
 * *can* capture, unlike a hovered pseudo-class (see `HoveredRow` below).
 */
export const FocusedRow: Story = {
  args: { ...baseProps, matches: sparseMatches, events: sparseEvents },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [firstRow] = canvas.getAllByTestId("agenda-match-row");
    firstRow.focus();
  },
};

/**
 * Documents the hover fill: the row deepens toward `cream-soft` instead of
 * pressing down, so a dense day never reads as coming apart. Mirrors
 * `<TicketStub>`'s `Hover` story — the hovered state can't be triggered by
 * the static VR runner (synthetic events don't trigger CSS `:hover`), and
 * the fill itself is asserted in `CalendarAgenda.test.tsx`.
 */
export const HoveredRow: Story = {
  args: { ...baseProps, matches: sparseMatches, events: sparseEvents },
  parameters: {
    // vr.disable: see the docblock above — no real pointer in a story play().
    vr: { disable: true },
  },
};
