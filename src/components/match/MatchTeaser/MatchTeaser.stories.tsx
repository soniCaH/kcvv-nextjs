/**
 * MatchTeaser Storybook Stories
 *
 * Compact match preview for lists and schedules.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchTeaser } from "./MatchTeaser";

const meta = {
  title: "Match/MatchTeaser",
  component: MatchTeaser,
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
} satisfies Meta<typeof MatchTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

// KCVV team data
const kcvv = {
  name: "KCVV Elewijt",
  logo: "/images/logo.png",
};

const opponent = {
  name: "KFC Turnhout",
  logo: "/images/placeholder-team.png",
};

/**
 * Default upcoming match
 */
export const Upcoming: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    venue: "Sportpark Elewijt",
    status: "upcoming",
    href: "/game/123",
  },
};

/**
 * Live match with current score
 */
export const Live: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    score: { home: 2, away: 1 },
    status: "live",
    href: "/game/123",
  },
};

/**
 * Finished match with final result
 */
export const Finished: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-08",
    time: "15:00",
    score: { home: 3, away: 1 },
    status: "finished",
    href: "/game/123",
  },
};

/**
 * Postponed match
 */
export const Postponed: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    status: "postponed",
    href: "/game/123",
  },
};

/**
 * Cancelled match
 */
export const Cancelled: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    status: "cancelled",
    href: "/game/123",
  },
};

/**
 * KCVV playing at home (highlighted)
 */
export const Home: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    venue: "Sportpark Elewijt",
    status: "upcoming",
    href: "/game/123",
    highlightTeamId: "kcvv",
  },
};

/**
 * KCVV playing away
 */
export const Away: Story = {
  args: {
    homeTeam: opponent,
    awayTeam: kcvv,
    date: "2024-02-15",
    time: "15:00",
    venue: "De Stadsblokken",
    status: "upcoming",
    href: "/game/123",
    highlightTeamId: "kcvv",
  },
};

/**
 * Match with team logos
 */
export const WithLogos: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    status: "upcoming",
    href: "/game/123",
  },
};

/**
 * Match without logos
 */
export const WithoutLogos: Story = {
  args: {
    homeTeam: { name: "KCVV Elewijt" },
    awayTeam: { name: "KFC Turnhout" },
    date: "2024-02-15",
    time: "15:00",
    status: "upcoming",
    href: "/game/123",
  },
};

/**
 * Compact variant for tight spaces
 */
export const Compact: Story = {
  args: {
    homeTeam: kcvv,
    awayTeam: opponent,
    date: "2024-02-15",
    time: "15:00",
    status: "upcoming",
    variant: "compact",
  },
};

/**
 * Loading state with skeleton
 */
export const Loading: Story = {
  args: {
    homeTeam: { name: "" },
    awayTeam: { name: "" },
    date: "",
    status: "upcoming",
    isLoading: true,
  },
};

/**
 * Multiple match teasers in a list
 */
export const List: StoryObj<typeof MatchTeaser> = {
  render: () => (
    <div className="space-y-3 w-full max-w-md">
      <MatchTeaser
        homeTeam={kcvv}
        awayTeam={{
          name: "KFC Turnhout",
          logo: "/images/placeholder-team.png",
        }}
        date="2024-02-15"
        time="15:00"
        score={{ home: 3, away: 1 }}
        status="finished"
        href="/game/121"
      />
      <MatchTeaser
        homeTeam={{ name: "SK Londerzeel" }}
        awayTeam={kcvv}
        date="2024-02-22"
        time="15:00"
        status="upcoming"
        href="/game/122"
      />
      <MatchTeaser
        homeTeam={kcvv}
        awayTeam={{ name: "FC Diest" }}
        date="2024-02-29"
        time="14:30"
        status="postponed"
        href="/game/123"
      />
    </div>
  ),
};
