/**
 * SponsorCard Component Stories
 * Individual sponsor display card
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorCard } from "./SponsorCard";
import { mockSponsors } from "../Sponsors.mocks";

const withUrl = mockSponsors[0] ?? {
  id: "1",
  name: "Sponsor One",
  logo: "https://placehold.co/200x133/4B9B48/FFFFFF?text=Sponsor+1",
  url: "https://example.com",
};

const withoutUrl = mockSponsors[2] ?? {
  id: "3",
  name: "Sponsor Three",
  logo: "https://placehold.co/200x133/4B9B48/FFFFFF?text=Sponsor+3",
};

const meta = {
  title: "Features/Sponsors/SponsorCard",
  component: SponsorCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Individual sponsor card with logo and optional hover overlay. Wraps in a link when a URL is provided. Hover to see the 'Bezoek website' overlay.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SponsorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default medium card with link — hover to reveal overlay. */
export const Default: Story = {
  args: {
    sponsor: withUrl,
    size: "md",
  },
};

/** With name label shown below the logo. */
export const WithName: Story = {
  args: {
    sponsor: withUrl,
    size: "md",
    showName: true,
  },
};

/** No URL — hover overlay not shown, not wrapped in a link. */
export const NoUrl: Story = {
  args: {
    sponsor: withoutUrl,
    size: "md",
    showName: true,
  },
};

/** Small size. */
export const Small: Story = {
  args: {
    sponsor: withUrl,
    size: "sm",
  },
};

/** Large size. */
export const Large: Story = {
  args: {
    sponsor: withUrl,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
