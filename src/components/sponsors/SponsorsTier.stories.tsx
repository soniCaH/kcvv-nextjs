/**
 * SponsorsTier Component Stories
 * Showcases different sponsor tiers with varying grid layouts
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsTier } from "./SponsorsTier";
import { mockSponsors } from "./Sponsors.mocks";

const meta = {
  title: "Sponsors/SponsorsTier",
  component: SponsorsTier,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays a single tier of sponsors (gold/silver/bronze) with appropriate grid layout and image sizing for each tier level.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SponsorsTier>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Gold tier sponsors with larger logos and fewer columns
 * Typically used for premium/crossing sponsors
 */
export const GoldTier: Story = {
  args: {
    tier: "gold",
    title: "Gouden Sponsors",
    sponsors: mockSponsors.slice(0, 6),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Gold tier with 4-column layout (responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop)",
      },
    },
  },
};

/**
 * Silver tier sponsors with medium-sized logos
 * Typically used for green/white tier sponsors
 */
export const SilverTier: Story = {
  args: {
    tier: "silver",
    title: "Zilveren Sponsors",
    sponsors: mockSponsors.slice(0, 8),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Silver tier with 5-column layout (responsive: 2 cols mobile, 4 cols tablet, 5 cols desktop)",
      },
    },
  },
};

/**
 * Bronze tier sponsors with smaller logos and more columns
 * Typically used for training/panel/other sponsors
 */
export const BronzeTier: Story = {
  args: {
    tier: "bronze",
    title: "Bronzen Sponsors",
    sponsors: mockSponsors,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Bronze tier with 6-column layout (responsive: 2 cols mobile, 4 cols tablet, 6 cols desktop)",
      },
    },
  },
};

/**
 * Empty tier - returns null
 */
export const EmptyTier: Story = {
  args: {
    tier: "gold",
    title: "Empty Tier",
    sponsors: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no sponsors are provided, the component returns null and renders nothing",
      },
    },
  },
};

/**
 * Single sponsor in each tier to show size differences
 */
export const SingleSponsorComparison: Story = {
  args: {
    tier: "gold",
    title: "Comparison",
    sponsors: [],
  },
  render: () => (
    <div className="space-y-8">
      <SponsorsTier
        tier="gold"
        title="Gold (280px)"
        sponsors={[mockSponsors[0]]}
      />
      <SponsorsTier
        tier="silver"
        title="Silver (200px)"
        sponsors={[mockSponsors[1]]}
      />
      <SponsorsTier
        tier="bronze"
        title="Bronze (160px)"
        sponsors={[mockSponsors[2]]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of image sizes across different tiers: Gold (280px), Silver (200px), Bronze (160px)",
      },
    },
  },
};

/**
 * Mix of sponsors with and without URLs
 */
export const MixedLinks: Story = {
  args: {
    tier: "silver",
    title: "Mixed Clickable and Non-Clickable",
    sponsors: [
      { ...mockSponsors[0], url: "https://example.com" },
      { ...mockSponsors[1], url: undefined },
      { ...mockSponsors[2], url: "https://example.com" },
      { ...mockSponsors[3], url: undefined },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Some sponsors have URLs (clickable) while others do not (non-clickable)",
      },
    },
  },
};

/**
 * Full page layout with all three tiers
 */
export const FullSponsorsPage: Story = {
  args: {
    tier: "gold",
    title: "Full Page",
    sponsors: [],
  },
  render: () => (
    <div className="max-w-inner-lg mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-8">
        Sponsors KCVV Elewijt
      </h1>
      <SponsorsTier
        tier="gold"
        title="Gouden Sponsors"
        sponsors={mockSponsors.slice(0, 4)}
      />
      <SponsorsTier
        tier="silver"
        title="Zilveren Sponsors"
        sponsors={mockSponsors.slice(4, 8)}
      />
      <SponsorsTier
        tier="bronze"
        title="Bronzen Sponsors"
        sponsors={mockSponsors.slice(0, 10)}
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Complete sponsors page layout showing all three tiers together",
      },
    },
  },
};
