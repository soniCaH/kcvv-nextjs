/**
 * TeamCard Component Stories
 *
 * Team teaser card used within TeamOverview component.
 * Unified card design matching PlayerCard styling.
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

**Features:**
- Team photo with hover zoom effect
- Team name and optional tagline
- Age group badge (flat or 3D style)
- Coach info display (optional)
- Win/Draw/Loss record (optional)
- Loading skeleton state
- Compact variant for dense layouts

**Unified with PlayerCard styling:**
- Same white card container with border and shadow
- Same hover shadow behavior
- Consistent content section layout
        `,
      },
    },
    backgrounds: {
      default: "light",
    },
  },
  // Give cards a representative width in Storybook
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
    use3DBadge: {
      control: "boolean",
      description: "Use 3D NumberBadge instead of flat badge",
    },
    variant: {
      control: "radio",
      options: ["default", "compact"],
    },
    isLoading: { control: "boolean" },
    coach: { control: "object" },
    record: { control: "object" },
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
 * Youth team with flat badge
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
 * Youth team with 3D badge
 */
export const YouthWith3DBadge: Story = {
  args: {
    name: "U21",
    href: "/jeugd/u21",
    ageGroup: "U21",
    teamType: "youth",
    use3DBadge: true,
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
 * Team card with coach info
 */
export const WithCoach: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    tagline: "De hoofdploeg",
    teamType: "senior",
    coach: {
      name: "Jan Peeters",
      imageUrl: "https://picsum.photos/seed/coach/100/100",
    },
  },
};

/**
 * Team card with W/D/L record
 */
export const WithRecord: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    teamType: "senior",
    record: { wins: 12, draws: 5, losses: 3 },
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
 * Compact variant
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

/**
 * Badge comparison (flat vs 3D)
 */
export const BadgeComparison: Story = {
  args: {
    name: "",
    href: "",
  },
  decorators: [], // Remove default decorator
  render: () => (
    <div className="flex gap-8">
      <div className="w-[280px]">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Flat Badge</h4>
        <TeamCard
          name="U15"
          href="/jeugd/u15"
          ageGroup="U15"
          teamType="youth"
        />
      </div>
      <div className="w-[280px]">
        <h4 className="text-sm font-medium text-gray-600 mb-2">3D Badge</h4>
        <TeamCard
          name="U15"
          href="/jeugd/u15"
          ageGroup="U15"
          teamType="youth"
          use3DBadge
        />
      </div>
    </div>
  ),
};
