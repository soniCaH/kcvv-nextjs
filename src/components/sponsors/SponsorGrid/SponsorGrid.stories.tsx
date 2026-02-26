/**
 * SponsorGrid Component Stories
 * Responsive grid of sponsor cards
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorGrid } from "./SponsorGrid";
import { mockSponsors } from "../Sponsors.mocks";

const meta = {
  title: "Features/Sponsors/SponsorGrid",
  component: SponsorGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Responsive CSS grid of SponsorCard items. Accepts a `columns` prop (2–6) and an optional `showNames` flag.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 2, max: 6 } },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof SponsorGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four-column grid — default configuration. */
export const Default: Story = {
  args: {
    sponsors: mockSponsors,
    columns: 4,
  },
};

/** Two sponsors only. */
export const Few: Story = {
  args: {
    sponsors: mockSponsors.slice(0, 2),
    columns: 2,
  },
};

/** All ten mock sponsors at six columns. */
export const Many: Story = {
  args: {
    sponsors: mockSponsors,
    columns: 6,
  },
};

/** Names shown below each logo. */
export const WithNames: Story = {
  args: {
    sponsors: mockSponsors.slice(0, 4),
    columns: 4,
    showNames: true,
  },
};

/** Dark background context — useful for footer placement. */
export const DarkBackground: Story = {
  args: {
    sponsors: mockSponsors.slice(0, 4),
    columns: 4,
  },
  decorators: [
    (Story) => (
      <div className="bg-[#1E2024] p-6 rounded">
        <Story />
      </div>
    ),
  ],
};

/** Small card size in a three-column layout. */
export const Small: Story = {
  args: {
    sponsors: mockSponsors.slice(0, 6),
    columns: 3,
    size: "sm",
  },
};
