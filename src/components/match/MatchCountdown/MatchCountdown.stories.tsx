/**
 * MatchCountdown Storybook Stories
 *
 * Countdown timer to the next match.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchCountdown } from "./MatchCountdown";

const meta = {
  title: "Features/Matches/MatchCountdown",
  component: MatchCountdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchCountdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Create dates relative to now for stories
const now = new Date();
const inDays = (days: number) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const inHours = (hours: number) =>
  new Date(now.getTime() + hours * 60 * 60 * 1000);
const inMinutes = (minutes: number) =>
  new Date(now.getTime() + minutes * 60 * 1000);

/**
 * Default countdown showing days, hours, minutes
 */
export const Default: Story = {
  args: {
    matchDate: inDays(5),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
  },
};

/**
 * Match on the same day - shows hours and minutes only
 */
export const SameDay: Story = {
  args: {
    matchDate: inHours(6),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
  },
};

/**
 * Match starting soon (within 1 hour)
 */
export const Starting: Story = {
  args: {
    matchDate: inMinutes(30),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
  },
};

/**
 * Match in progress (past start time but within 2 hours)
 */
export const Live: Story = {
  args: {
    matchDate: inMinutes(-45),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
    isLive: true,
  },
};

/**
 * Match finished (past)
 */
export const Finished: Story = {
  args: {
    matchDate: inDays(-1),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
  },
};

/**
 * Compact variant for sidebars
 */
export const Compact: Story = {
  args: {
    matchDate: inDays(3),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    variant: "compact",
  },
};

/**
 * With link to match detail
 */
export const WithLink: Story = {
  args: {
    matchDate: inDays(5),
    homeTeam: "KCVV Elewijt",
    awayTeam: "KFC Turnhout",
    competition: "3de Nationale",
    href: "/game/123",
  },
};

/**
 * Long team names
 */
export const LongTeamNames: Story = {
  args: {
    matchDate: inDays(5),
    homeTeam: "KCVV Elewijt A",
    awayTeam: "Eendracht Aalst Belgische Voetbalclub",
    competition: "3de Nationale Afdeling A",
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    matchDate: new Date(),
    homeTeam: "",
    awayTeam: "",
    isLoading: true,
  },
};
