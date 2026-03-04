/**
 * MatchStats Storybook Stories
 *
 * Match statistics comparison between two teams.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchStats } from "./MatchStats";

const meta = {
  title: "Features/Matches/MatchStats",
  component: MatchStats,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchStats>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullStats = {
  possession: { home: 58, away: 42 },
  shots: { home: 15, away: 8 },
  shotsOnTarget: { home: 7, away: 3 },
  corners: { home: 6, away: 4 },
  fouls: { home: 12, away: 15 },
  yellowCards: { home: 2, away: 3 },
  redCards: { home: 0, away: 1 },
  offsides: { home: 3, away: 2 },
  passes: { home: 456, away: 312 },
  passAccuracy: { home: 85, away: 72 },
};

/**
 * Default - All statistics displayed
 */
export const Default: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: fullStats,
  },
};

/**
 * Possession dominated match
 */
export const PossessionDominated: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      ...fullStats,
      possession: { home: 72, away: 28 },
      passes: { home: 612, away: 234 },
      passAccuracy: { home: 91, away: 68 },
    },
  },
};

/**
 * High shots count
 */
export const Shots: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      ...fullStats,
      shots: { home: 24, away: 6 },
      shotsOnTarget: { home: 12, away: 2 },
    },
  },
};

/**
 * Physical match with many fouls and cards
 */
export const PhysicalMatch: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      ...fullStats,
      fouls: { home: 22, away: 19 },
      yellowCards: { home: 4, away: 5 },
      redCards: { home: 1, away: 1 },
    },
  },
};

/**
 * Minimal stats - only key stats
 */
export const Minimal: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      possession: { home: 55, away: 45 },
      shots: { home: 12, away: 10 },
      shotsOnTarget: { home: 5, away: 4 },
    },
    variant: "minimal",
  },
};

/**
 * Even match - similar stats
 */
export const EvenMatch: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      possession: { home: 50, away: 50 },
      shots: { home: 10, away: 10 },
      shotsOnTarget: { home: 4, away: 4 },
      corners: { home: 5, away: 5 },
      fouls: { home: 12, away: 12 },
      yellowCards: { home: 2, away: 2 },
      redCards: { home: 0, away: 0 },
    },
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {},
    isLoading: true,
  },
};

/**
 * No stats available
 */
export const Unavailable: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {},
  },
};

/**
 * Partial stats - some values missing
 */
export const PartialStats: Story = {
  args: {
    homeTeamName: "KCVV Elewijt",
    awayTeamName: "KFC Turnhout",
    stats: {
      possession: { home: 55, away: 45 },
      shots: { home: 14, away: 9 },
      corners: { home: 7, away: 3 },
    },
  },
};
