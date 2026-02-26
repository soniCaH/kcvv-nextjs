/**
 * MatchesOverview Component Stories
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchesOverview } from "./MatchesOverview";
import {
  mockScheduledMatches,
  mockFinishedMatch,
  mockPostponedMatch,
} from "@/components/home/UpcomingMatches/UpcomingMatches.mocks";

const KCVV_ID = 1235;

const meta = {
  title: "Features/Matches/MatchesOverview",
  component: MatchesOverview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two-column overview showing upcoming matches alongside recent results. Collapses to a single column on mobile.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MatchesOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both sections populated with matches. */
export const Default: Story = {
  args: {
    upcomingMatches: mockScheduledMatches,
    recentResults: [mockFinishedMatch, mockFinishedMatch],
    highlightTeamId: KCVV_ID,
  },
};

/** No upcoming matches — upcoming section shows empty state. */
export const EmptyUpcoming: Story = {
  args: {
    upcomingMatches: [],
    recentResults: [mockFinishedMatch, mockFinishedMatch],
    highlightTeamId: KCVV_ID,
  },
};

/** No recent results — results section shows empty state. */
export const EmptyResults: Story = {
  args: {
    upcomingMatches: mockScheduledMatches,
    recentResults: [],
    highlightTeamId: KCVV_ID,
  },
};

/** Both sections empty. */
export const AllEmpty: Story = {
  args: {
    upcomingMatches: [],
    recentResults: [],
  },
};

/** Mobile viewport — single-column layout. */
export const MobileViewport: Story = {
  args: {
    upcomingMatches: mockScheduledMatches,
    recentResults: [mockFinishedMatch],
    highlightTeamId: KCVV_ID,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

/** Disrupted matches in both sections. */
export const WithDisruptions: Story = {
  args: {
    upcomingMatches: [
      mockScheduledMatches[0] ?? mockPostponedMatch,
      mockPostponedMatch,
    ],
    recentResults: [mockFinishedMatch],
    highlightTeamId: KCVV_ID,
  },
};
