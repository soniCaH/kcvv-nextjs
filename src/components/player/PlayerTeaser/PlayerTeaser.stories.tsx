/**
 * PlayerTeaser Component Stories
 *
 * Compact player preview for lists and roster grids.
 * Simpler design than PlayerCard, optimized for dense layouts.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerTeaser } from "./PlayerTeaser";

const meta = {
  title: "Components/Player/PlayerTeaser",
  component: PlayerTeaser,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Compact player preview component for lists and roster grids.

Simpler than PlayerCard, designed for:
- Dense team roster displays
- Search results
- Related players lists
- Mobile-optimized layouts
        `,
      },
    },
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Full player name",
    },
    position: {
      control: "select",
      options: ["Keeper", "Verdediger", "Middenvelder", "Aanvaller"],
      description: "Player position",
    },
    number: {
      control: "number",
      description: "Jersey number",
    },
    imageUrl: {
      control: "text",
      description: "Player photo URL",
    },
    href: {
      control: "text",
      description: "Link to player profile",
    },
    showStats: {
      control: "boolean",
      description: "Show basic stats (games, goals)",
    },
  },
} satisfies Meta<typeof PlayerTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default teaser
 * Standard compact player preview
 */
export const Default: Story = {
  args: {
    name: "Kevin De Bruyne",
    position: "Middenvelder",
    number: 7,
    imageUrl: "https://picsum.photos/80/80?random=1",
    href: "/player/kevin-de-bruyne",
  },
};

/**
 * With stats display
 * Shows games played and goals
 */
export const WithStats: Story = {
  args: {
    name: "Romelu Lukaku",
    position: "Aanvaller",
    number: 9,
    imageUrl: "https://picsum.photos/80/80?random=2",
    href: "/player/romelu-lukaku",
    showStats: true,
    stats: {
      games: 24,
      goals: 15,
    },
  },
};

/**
 * Without photo
 * Shows placeholder avatar
 */
export const WithoutPhoto: Story = {
  args: {
    name: "Nieuwe Speler",
    position: "Verdediger",
    number: 99,
    href: "/player/nieuwe-speler",
  },
};

/**
 * Clickable link
 * Interactive teaser that links to profile
 */
export const Clickable: Story = {
  args: {
    name: "Jan Vertonghen",
    position: "Verdediger",
    number: 5,
    imageUrl: "https://picsum.photos/80/80?random=3",
    href: "/player/jan-vertonghen",
  },
};

/**
 * Selected state
 * Highlighted appearance for selected player
 */
export const Selected: Story = {
  args: {
    name: "Thibaut Courtois",
    position: "Keeper",
    number: 1,
    imageUrl: "https://picsum.photos/80/80?random=4",
    href: "/player/thibaut-courtois",
    isSelected: true,
  },
};

/**
 * Loading skeleton
 * Placeholder while data loads
 */
export const Loading: Story = {
  args: {
    name: "",
    position: "",
    href: "",
    isLoading: true,
  },
};

/**
 * In list layout
 * Multiple teasers in a vertical list
 */
export const ListLayout: Story = {
  args: {
    name: "",
    position: "",
    href: "",
  },
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <PlayerTeaser
        name="Thibaut Courtois"
        position="Keeper"
        number={1}
        imageUrl="https://picsum.photos/80/80?random=10"
        href="/player/thibaut-courtois"
      />
      <PlayerTeaser
        name="Jan Vertonghen"
        position="Verdediger"
        number={5}
        imageUrl="https://picsum.photos/80/80?random=11"
        href="/player/jan-vertonghen"
        isSelected
      />
      <PlayerTeaser
        name="Kevin De Bruyne"
        position="Middenvelder"
        number={7}
        imageUrl="https://picsum.photos/80/80?random=12"
        href="/player/kevin-de-bruyne"
      />
      <PlayerTeaser
        name="Romelu Lukaku"
        position="Aanvaller"
        number={9}
        imageUrl="https://picsum.photos/80/80?random=13"
        href="/player/romelu-lukaku"
        showStats
        stats={{ games: 24, goals: 15 }}
      />
      <PlayerTeaser name="" position="" href="" isLoading />
    </div>
  ),
};

/**
 * Grid layout
 * Multiple teasers in a responsive grid
 */
export const GridLayout: Story = {
  args: {
    name: "",
    position: "",
    href: "",
  },
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
      <PlayerTeaser
        name="Keeper 1"
        position="Keeper"
        number={1}
        imageUrl="https://picsum.photos/80/80?random=20"
        href="/player/keeper-1"
      />
      <PlayerTeaser
        name="Verdediger 2"
        position="Verdediger"
        number={2}
        imageUrl="https://picsum.photos/80/80?random=21"
        href="/player/verdediger-2"
      />
      <PlayerTeaser
        name="Verdediger 3"
        position="Verdediger"
        number={3}
        imageUrl="https://picsum.photos/80/80?random=22"
        href="/player/verdediger-3"
      />
      <PlayerTeaser
        name="Middenvelder 6"
        position="Middenvelder"
        number={6}
        imageUrl="https://picsum.photos/80/80?random=23"
        href="/player/middenvelder-6"
      />
      <PlayerTeaser
        name="Aanvaller 9"
        position="Aanvaller"
        number={9}
        imageUrl="https://picsum.photos/80/80?random=24"
        href="/player/aanvaller-9"
      />
      <PlayerTeaser
        name="Aanvaller 11"
        position="Aanvaller"
        number={11}
        imageUrl="https://picsum.photos/80/80?random=25"
        href="/player/aanvaller-11"
      />
    </div>
  ),
};

/**
 * Mobile view
 * Optimized for small screens
 */
export const MobileView: Story = {
  args: {
    name: "Yannick Carrasco",
    position: "Aanvaller",
    number: 11,
    imageUrl: "https://picsum.photos/80/80?random=5",
    href: "/player/yannick-carrasco",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
