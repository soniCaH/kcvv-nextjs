// apps/web/src/components/home/FirstTeamsBlock/FirstTeamsBlock.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FirstTeamsBlock } from "./FirstTeamsBlock";
import type { FirstTeamVM } from "./first-teams";
import type { ScheduleMatch } from "@/components/match/types";

const meta = {
  title: "Features/Home/FirstTeamsBlock",
  component: FirstTeamsBlock,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Homepage 'Eerste ploegen' eyecatcher — a full-bleed jersey-deep-dark " +
          "matchday-desk band (StripedSeam top + bottom) with one full-width row " +
          "per senior team: [team label] · [last result] · [next fixture]. Both " +
          "the result and the next fixture render as the shared unified " +
          "<TeamAgendaRow> (same row as team pages + /kalender, #2301) — the " +
          "result as a cream row, the next fixture as the featured jersey-deep " +
          "card. Each row deep-links to its own match detail. A missing side " +
          "drops to a skip placeholder; a team with neither is omitted. Spec: " +
          "docs/design/mockups/eerste-ploegen/eerste-ploegen-locked.md.",
      },
    },
  },
} satisfies Meta<typeof FirstTeamsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Fixed dates → deterministic VR (the band reads no `now`; it renders the VMs).
// Both result + fixture are `ScheduleMatch`, fed straight into <TeamAgendaRow>.
// Hoisted so the Outcomes story can spread it without a non-null assertion.
const aResult: ScheduleMatch = {
  id: 101,
  date: new Date("2026-06-21T15:00:00Z"),
  homeTeam: { id: 1235, name: "KCVV Elewijt" },
  awayTeam: { id: 42, name: "SK Londerzeel" },
  homeScore: 3,
  awayScore: 1,
  isHome: true,
  status: "finished",
  competition: "3de Nationale",
};

const aFixture: ScheduleMatch = {
  id: 102,
  date: new Date("2026-06-29T13:00:00Z"),
  time: "15:00",
  // KCVV plays away → opponent (Sporting Hasselt) is the home side.
  homeTeam: { id: 77, name: "Sporting Hasselt" },
  awayTeam: { id: 1235, name: "KCVV Elewijt" },
  isHome: false,
  status: "scheduled",
  competition: "3de Nationale",
};

const aTeam: FirstTeamVM = {
  label: "A-ploeg",
  slug: "a-ploeg",
  division: "3de Nationale",
  result: aResult,
  fixture: aFixture,
};

const bResult: ScheduleMatch = {
  id: 201,
  date: new Date("2026-06-22T13:30:00Z"),
  homeTeam: { id: 88, name: "Tempo Overijse" },
  awayTeam: { id: 1236, name: "KCVV Elewijt B" },
  homeScore: 2,
  awayScore: 0,
  isHome: false,
  status: "finished",
  competition: "2de Provinciale",
};

const bFixture: ScheduleMatch = {
  id: 202,
  date: new Date("2026-06-28T17:30:00Z"),
  time: "19:30",
  homeTeam: { id: 1236, name: "KCVV Elewijt B" },
  awayTeam: { id: 99, name: "VK Liedekerke" },
  isHome: true,
  status: "scheduled",
  competition: "2de Provinciale",
};

const bTeam: FirstTeamVM = {
  label: "B-ploeg",
  slug: "b-ploeg",
  division: "2de Provinciale",
  result: bResult,
  fixture: bFixture,
};

export const Default: Story = {
  args: { teams: [aTeam, bTeam] },
};

// A draw + a loss, to exercise the no-underline (draw) vs the loss underline
// alongside Default's win. Outcome is recomputed inside <TeamAgendaRow> from
// scores + isHome + status.
export const Outcomes: Story = {
  args: {
    teams: [
      {
        ...aTeam,
        result: { ...aResult, homeScore: 1, awayScore: 1 },
      },
      bTeam,
    ],
  },
};

/**
 * The #2423 live case: a cup tie awarded 5-0 by forfeit before its kickoff.
 * It used to be invisible — neither `finished` nor `scheduled` — and the block
 * showed the match after it as though this one did not exist. It now takes the
 * result slot, and the caption names it so the score is not left unexplained.
 */
export const ForfeitedResult: Story = {
  args: {
    teams: [
      {
        ...aTeam,
        result: {
          ...aResult,
          id: 103,
          date: new Date("2026-06-28T16:30:00Z"),
          homeTeam: { id: 55, name: "SK Nossegem" },
          awayTeam: { id: 1235, name: "KCVV Elewijt" },
          homeScore: 5,
          awayScore: 0,
          isHome: false,
          status: "forfeited",
          competition: "Beker van Vlaams-Brabant",
        },
      },
      bTeam,
    ],
  },
};

/**
 * The #2390 live case: B-ploeg played FC Zemst Sportief on a Thursday evening,
 * and until PSD published the score the match was `scheduled` with a past
 * kickoff — in neither slot, so the homepage showed the match *before* it as
 * the result. It now headlines the result slot scoreless.
 *
 * This is the only state where the result row shows a kickoff time instead of
 * a scoreline: no score, no outcome underline, and `scheduled` is not an
 * exceptional status so the caption stays on the competition alone. The A-ploeg
 * row above it is the settled counterpart, for contrast in the same band.
 */
export const AwaitingResult: Story = {
  args: {
    teams: [
      aTeam,
      {
        ...bTeam,
        result: {
          id: 203,
          date: new Date("2026-06-25T17:30:00Z"),
          time: "19:30",
          homeTeam: { id: 1236, name: "KCVV Elewijt B" },
          awayTeam: { id: 91, name: "FC Zemst Sportief" },
          isHome: true,
          status: "scheduled",
          competition: "2de Provinciale",
        },
      },
    ],
  },
};

/**
 * The #2397 live case: real opponents, each carrying the `A` designation the
 * BFF sends, which is what pushed these names past their half of the row.
 * "Ritterklub Vsv Jette A" is the longest that occurs in the current fixture
 * list and the widest the row must seat unclipped at 1440px.
 *
 * The score stays dead centre in every one of these rows — a scoreboard whose
 * score wanders with the club names reads as a broken table.
 */
export const LongOpponentNames: Story = {
  args: {
    teams: [
      {
        ...aTeam,
        result: {
          ...aResult,
          homeTeam: { id: 61, name: "Ohr Huldenberg", teamLabel: "A" },
          awayTeam: { id: 1235, name: "KCVV Elewijt" },
          isHome: false,
        },
        fixture: {
          ...aFixture,
          homeTeam: { id: 62, name: "VK Ninove", teamLabel: "A" },
        },
      },
      {
        ...bTeam,
        result: {
          ...bResult,
          homeTeam: { id: 63, name: "SK Nossegem", teamLabel: "A" },
        },
        fixture: {
          ...bFixture,
          awayTeam: {
            id: 64,
            name: "Ritterklub Vsv Jette",
            teamLabel: "A",
          },
        },
      },
    ],
  },
};

// Graceful skip: A has no upcoming fixture (season end), B has no recent result.
export const MissingSides: Story = {
  args: {
    teams: [
      {
        label: aTeam.label,
        slug: aTeam.slug,
        division: aTeam.division,
        result: aTeam.result,
      },
      {
        label: bTeam.label,
        slug: bTeam.slug,
        division: bTeam.division,
        fixture: bTeam.fixture,
      },
    ],
  },
};
