/**
 * PlayerTeamHistory Component Stories
 *
 * Timeline display of a player's team affiliations throughout their career.
 * Shows progression from youth teams to senior squads.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerTeamHistory } from "./PlayerTeamHistory";

const meta = {
  title: "Players/PlayerTeamHistory",
  component: PlayerTeamHistory,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Timeline component displaying a player's team history at the club.
Shows chronological progression through different teams (youth to senior).

Features:
- Vertical timeline with team entries
- Current team highlighted
- Date ranges for each team
- Responsive design
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    entries: {
      description: "Array of team history entries",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlayerTeamHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default timeline with multiple team entries
 */
export const Default: Story = {
  args: {
    entries: [
      {
        teamName: "Eerste Ploeg",
        teamSlug: "eerste-ploeg",
        startDate: "2022-07-01",
        isCurrent: true,
      },
      {
        teamName: "Beloften",
        teamSlug: "beloften",
        startDate: "2020-07-01",
        endDate: "2022-06-30",
        isCurrent: false,
      },
      {
        teamName: "U21",
        teamSlug: "u21",
        startDate: "2018-07-01",
        endDate: "2020-06-30",
        isCurrent: false,
      },
    ],
  },
};

/**
 * Player who has only played for one team
 */
export const SingleTeam: Story = {
  args: {
    entries: [
      {
        teamName: "Eerste Ploeg",
        teamSlug: "eerste-ploeg",
        startDate: "2020-07-01",
        isCurrent: true,
      },
    ],
  },
};

/**
 * Full youth to senior progression timeline
 */
export const WithYouth: Story = {
  args: {
    entries: [
      {
        teamName: "Eerste Ploeg",
        teamSlug: "eerste-ploeg",
        startDate: "2023-07-01",
        isCurrent: true,
      },
      {
        teamName: "Beloften",
        teamSlug: "beloften",
        startDate: "2021-07-01",
        endDate: "2023-06-30",
        isCurrent: false,
      },
      {
        teamName: "U21",
        teamSlug: "u21",
        startDate: "2019-07-01",
        endDate: "2021-06-30",
        isCurrent: false,
      },
      {
        teamName: "U17",
        teamSlug: "u17",
        startDate: "2017-07-01",
        endDate: "2019-06-30",
        isCurrent: false,
      },
      {
        teamName: "U15",
        teamSlug: "u15",
        startDate: "2015-07-01",
        endDate: "2017-06-30",
        isCurrent: false,
      },
      {
        teamName: "U13",
        teamSlug: "u13",
        startDate: "2013-07-01",
        endDate: "2015-06-30",
        isCurrent: false,
      },
    ],
  },
};

/**
 * Former player who has left the club
 */
export const FormerPlayer: Story = {
  args: {
    entries: [
      {
        teamName: "Eerste Ploeg",
        teamSlug: "eerste-ploeg",
        startDate: "2018-07-01",
        endDate: "2023-06-30",
        isCurrent: false,
      },
      {
        teamName: "Beloften",
        teamSlug: "beloften",
        startDate: "2016-07-01",
        endDate: "2018-06-30",
        isCurrent: false,
      },
    ],
  },
};

/**
 * Empty state when no team history is available
 */
export const Empty: Story = {
  args: {
    entries: [],
  },
};

/**
 * Loading state with skeleton placeholders
 */
export const Loading: Story = {
  args: {
    entries: [],
    isLoading: true,
  },
};
