import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsStats } from "./SponsorsStats";

const meta = {
  title: "Features/Sponsors/SponsorsStats",
  component: SponsorsStats,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    totalSponsors: 24,
  },
} satisfies Meta<typeof SponsorsStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSponsor: Story = {
  args: { totalSponsors: 1 },
};

export const NoSponsors: Story = {
  args: { totalSponsors: 0 },
};

export const LargeCount: Story = {
  args: { totalSponsors: 100 },
};
