import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStripView } from "./MatchStripView";
import type { ScheduleMatch } from "@/components/match/types";
import { KCVV_CLUB_ID } from "@/lib/constants";

const meta = {
  title: "Features/Matches/MatchStrip",
  component: MatchStripView,
  tags: ["autodocs", "vr"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MatchStripView>;

export default meta;
type Story = StoryObj<typeof meta>;

const KCVV = { id: KCVV_CLUB_ID, name: "KCVV Elewijt" };
const OPPONENT = {
  id: 9999,
  name: "RC Mechelen",
  logo: "/images/logos/kcvv-logo.png",
};

const homeWin: ScheduleMatch = {
  id: 12345,
  date: new Date("2026-08-03T15:00:00Z"),
  status: "finished",
  competition: "Tweede Provinciale A",
  homeTeam: KCVV,
  awayTeam: OPPONENT,
  homeScore: 3,
  awayScore: 1,
  isHome: true,
};

const awayFixture: ScheduleMatch = {
  id: 12346,
  date: new Date("2026-08-08T18:00:00Z"),
  time: "18:00",
  status: "scheduled",
  competition: "Beker van Vlaanderen",
  homeTeam: { id: 8888, name: "Boutersem United" },
  awayTeam: KCVV,
  isHome: false,
};

export const ResultAndFixture: Story = {
  args: { data: { result: homeWin, fixture: awayFixture } },
};

/** Outside the 72h window, or at the start of a season — fixture only. */
export const FixtureOnly: Story = {
  args: { data: { result: null, fixture: awayFixture } },
};

/** End of season, or a mid-week result with nothing scheduled yet. */
export const ResultOnly: Story = {
  args: { data: { result: homeWin, fixture: null } },
};

/** A draw carries no outcome sweep at all — only wins and losses are marked. */
export const Draw: Story = {
  args: {
    data: {
      result: { ...homeWin, homeScore: 2, awayScore: 2 },
      fixture: awayFixture,
    },
  },
};

/** Away loss: scoreboard order puts the opponent's goals first. */
export const AwayLoss: Story = {
  args: {
    data: {
      result: {
        ...homeWin,
        homeTeam: { id: 8888, name: "KVC Sint-Pieters-Leeuw United" },
        awayTeam: KCVV,
        homeScore: 2,
        awayScore: 0,
        isHome: false,
      },
      fixture: awayFixture,
    },
  },
};

/** No opponent logo, no kickoff time, no competition — the fallback path. */
export const WithoutOptionalFields: Story = {
  args: {
    data: {
      result: null,
      fixture: {
        ...awayFixture,
        time: undefined,
        competition: undefined,
        homeTeam: { id: 8888, name: "VK De Volharding" },
      },
    },
  },
};
