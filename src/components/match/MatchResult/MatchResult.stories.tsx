/**
 * MatchResult Storybook Stories
 *
 * Result card for recent results lists with win/draw/loss styling.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchResult } from "./MatchResult";

const meta = {
  title: "Matches/MatchResult",
  component: MatchResult,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchResult>;

export default meta;
type Story = StoryObj<typeof meta>;

// KCVV team data
const kcvv = {
  id: 1235,
  name: "KCVV Elewijt",
  logo: "/images/logo.png",
};

const opponent = {
  id: 59,
  name: "KFC Turnhout",
  logo: "/images/placeholder-team.png",
};

/**
 * Victory - KCVV won the match (green accent)
 */
export const Win: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 3,
    awayScore: 1,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Draw result (yellow/neutral accent)
 */
export const Draw: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 2,
    awayScore: 2,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Loss - KCVV lost the match (red accent)
 */
export const Loss: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 0,
    awayScore: 2,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Away win - KCVV won as away team
 */
export const AwayWin: Story = {
  args: {
    homeTeam: opponent,
    awayTeam: kcvv,
    homeScore: 1,
    awayScore: 4,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * High scoring match (5+ goals)
 */
export const HighScore: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 5,
    awayScore: 3,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Clean sheet - no goals conceded
 */
export const CleanSheet: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 2,
    awayScore: 0,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Heavy defeat
 */
export const HeavyDefeat: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 0,
    awayScore: 5,
    date: "2024-02-15",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * With competition name
 */
export const WithCompetition: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 3,
    awayScore: 1,
    date: "2024-02-15",
    competition: "3de Nationale",
    kcvvTeamId: 1235,
    href: "/game/123",
  },
};

/**
 * Without team logos
 */
export const WithoutLogos: Story = {
  args: {
    homeTeam: { id: 1, name: "KCVV Elewijt" },
    awayTeam: { id: 2, name: "KFC Turnhout" },
    homeScore: 2,
    awayScore: 1,
    date: "2024-02-15",
    kcvvTeamId: 1,
    href: "/game/123",
  },
};

/**
 * Loading state with skeleton
 */
export const Loading: Story = {
  args: {
    homeTeam: { id: 0, name: "" },
    awayTeam: { id: 0, name: "" },
    homeScore: 0,
    awayScore: 0,
    date: "",
    isLoading: true,
  },
};

/**
 * Multiple results in a list — illustrative story with three hardcoded instances.
 * Controls don't affect this story; use Default to interact with individual props.
 */
export const List: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    homeScore: 3,
    awayScore: 1,
    date: "2024-02-15",
    kcvvTeamId: 1235,
  },
  decorators: [
    () => (
      <div className="space-y-2 w-full max-w-sm">
        <MatchResult
          homeTeam={kcvv}
          awayTeam={opponent}
          homeScore={3}
          awayScore={1}
          date="2024-02-15"
          kcvvTeamId={1235}
          href="/game/121"
        />
        <MatchResult
          homeTeam={{ id: 2, name: "SK Londerzeel" }}
          awayTeam={kcvv}
          homeScore={2}
          awayScore={2}
          date="2024-02-08"
          kcvvTeamId={1235}
          href="/game/120"
        />
        <MatchResult
          homeTeam={kcvv}
          awayTeam={{ id: 3, name: "FC Diest" }}
          homeScore={0}
          awayScore={1}
          date="2024-02-01"
          kcvvTeamId={1235}
          href="/game/119"
        />
      </div>
    ),
  ],
};
