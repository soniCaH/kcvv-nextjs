/**
 * TeamCard Component Stories
 *
 * Team teaser card used within TeamOverview component.
 * Individual TeamCard is not used standalone - see TeamOverview for usage.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamCard } from "./TeamCard";

const meta = {
  title: "Components/Team/TeamCard",
  component: TeamCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Team teaser card component. **Used within TeamOverview** - not typically used standalone.

See **TeamOverview** component for actual usage patterns with grids and grouping.

**Features:**
- Team photo with hover zoom effect
- Team name and optional tagline
- Age group badge for youth teams
- Coach info display (optional)
- Win/Draw/Loss record (optional)
- Loading skeleton state
- Compact variant for dense layouts
        `,
      },
    },
    backgrounds: {
      default: "light",
    },
  },
  // Give cards a representative width in Storybook (they fill their container in real usage)
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    href: { control: "text" },
    imageUrl: { control: "text" },
    tagline: { control: "text" },
    ageGroup: { control: "text" },
    teamType: {
      control: "select",
      options: ["senior", "youth", "club"],
    },
    variant: {
      control: "radio",
      options: ["default", "compact"],
    },
    isLoading: { control: "boolean" },
  },
} satisfies Meta<typeof TeamCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default team card
 */
export const Default: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    tagline: "De hoofdploeg",
    teamType: "senior",
  },
};

/**
 * Youth team with age badge
 */
export const Youth: Story = {
  args: {
    name: "U15",
    href: "/jeugd/u15",
    ageGroup: "U15",
    teamType: "youth",
  },
};

/**
 * Club/Organization team
 */
export const Club: Story = {
  args: {
    name: "Jeugdbestuur",
    href: "/club/jeugdbestuur",
    tagline: "De begeleiding van de toekomst",
    teamType: "club",
  },
};

/**
 * Loading skeleton
 */
export const Loading: Story = {
  args: {
    name: "",
    href: "",
    isLoading: true,
  },
};

/**
 * Compact variant (smaller width for dense layouts)
 */
export const Compact: Story = {
  args: {
    name: "U10",
    href: "/jeugd/u10",
    ageGroup: "U10",
    teamType: "youth",
    variant: "compact",
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};
