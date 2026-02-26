/**
 * TeamStats Component Stories
 * W/D/L performance widget for a team
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamStats } from "./TeamStats";

const meta = {
  title: "Features/Teams/TeamStats",
  component: TeamStats,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Season performance summary showing wins (W), draws (G), and losses (V) as coloured pills, plus goals scored/conceded and goal difference. The compact variant is suited for tight spaces like team cards.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    played: { control: { type: "number" } },
    won: { control: { type: "number" } },
    drawn: { control: { type: "number" } },
    lost: { control: { type: "number" } },
    goalsFor: { control: { type: "number" } },
    goalsAgainst: { control: { type: "number" } },
    variant: { control: "radio", options: ["full", "compact"] },
  },
} satisfies Meta<typeof TeamStats>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typical mid-season record. */
export const Default: Story = {
  args: {
    played: 18,
    won: 11,
    drawn: 4,
    lost: 3,
    goalsFor: 38,
    goalsAgainst: 19,
    variant: "full",
  },
};

/** Compact variant — numbers only, suits tight spaces. */
export const Compact: Story = {
  args: {
    played: 18,
    won: 11,
    drawn: 4,
    lost: 3,
    goalsFor: 38,
    goalsAgainst: 19,
    variant: "compact",
  },
};

/** Perfect season — all wins. */
export const AllWins: Story = {
  args: {
    played: 10,
    won: 10,
    drawn: 0,
    lost: 0,
    goalsFor: 32,
    goalsAgainst: 4,
    variant: "full",
  },
};

/** Struggling team — all losses. */
export const AllLosses: Story = {
  args: {
    played: 10,
    won: 0,
    drawn: 0,
    lost: 10,
    goalsFor: 3,
    goalsAgainst: 28,
    variant: "full",
  },
};

/** Season has not started. */
export const ZeroPlayed: Story = {
  args: {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    variant: "full",
  },
};

/** Neutral goal difference. */
export const EvenGoals: Story = {
  args: {
    played: 12,
    won: 4,
    drawn: 4,
    lost: 4,
    goalsFor: 16,
    goalsAgainst: 16,
    variant: "full",
  },
};
