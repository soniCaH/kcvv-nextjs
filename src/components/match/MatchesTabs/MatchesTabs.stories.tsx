/**
 * MatchesTabs Component Stories
 * Tabbed interface for upcoming matches vs recent results
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchesTabs } from "./MatchesTabs";
import { mockMatches } from "@/components/home/UpcomingMatches/UpcomingMatches.mocks";

const KCVV_ID = 1235;

const meta = {
  title: "Features/Matches/MatchesTabs",
  component: MatchesTabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Splits a mixed array of matches into two tabs: upcoming (scheduled + live) and results (finished + postponed + cancelled). Uses the FilterTabs design-system component for the tab bar.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchesTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default tab — shows upcoming matches first. */
export const Default: Story = {
  args: {
    matches: mockMatches.mixed,
    highlightTeamId: KCVV_ID,
    defaultTab: "upcoming",
  },
};

/** Opens on the results tab. */
export const ResultsTab: Story = {
  args: {
    matches: mockMatches.mixed,
    highlightTeamId: KCVV_ID,
    defaultTab: "results",
  },
};

/** Only scheduled matches — results tab shows empty state. */
export const OnlyUpcoming: Story = {
  args: {
    matches: mockMatches.scheduled,
    highlightTeamId: KCVV_ID,
  },
};

/** No matches at all — both tabs show empty states. */
export const Empty: Story = {
  args: {
    matches: [],
  },
};

/** Mobile viewport — tabs stack and list is single-column. */
export const ResponsiveMobile: Story = {
  args: {
    matches: mockMatches.mixed,
    highlightTeamId: KCVV_ID,
    defaultTab: "upcoming",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
