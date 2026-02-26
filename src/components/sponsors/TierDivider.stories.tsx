import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TierDivider } from "./TierDivider";
import { SponsorsTier } from "./SponsorsTier";
import { mockSponsors } from "./Sponsors.mocks";

const meta = {
  title: "Features/Sponsors/TierDivider",
  component: TierDivider,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TierDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Shows how TierDivider sits between two sponsor tiers in context. */
export const BetweenTiers: Story = {
  render: () => (
    <div>
      <SponsorsTier
        tier="gold"
        title="Gouden Sponsors"
        sponsors={mockSponsors.slice(0, 3)}
      />
      <TierDivider />
      <SponsorsTier
        tier="silver"
        title="Zilveren Sponsors"
        sponsors={mockSponsors.slice(3, 6)}
      />
    </div>
  ),
};
