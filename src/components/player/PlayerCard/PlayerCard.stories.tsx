/**
 * PlayerCard Component Stories
 *
 * Visual player card for team rosters and player listings.
 * Unified card design matching TeamCard styling.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerCard } from "./PlayerCard";

// Real player images from KCVV API (with transparent backgrounds)
const REAL_PLAYER_IMAGES = {
  chiel:
    "https://api.kcvvelewijt.be/sites/default/files/player-picture/chiel.png",
  jarne:
    "https://api.kcvvelewijt.be/sites/default/files/player-picture/jarne-front.png",
  louie:
    "https://api.kcvvelewijt.be/sites/default/files/player-picture/louie-front.png",
  yoran:
    "https://api.kcvvelewijt.be/sites/default/files/player-picture/yoran-front.png",
};

const meta = {
  title: "Players/PlayerCard",
  component: PlayerCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Visual player card with unified card design:
- White card container with border and shadow
- 3D jersey number badge with stenciletta font
- Player photo with hover shift effect (contained within card)
- Separate content section for names and position
- Captain badge support

**Unified with TeamCard styling:**
- Same border and shadow treatment
- Same content section layout
- Consistent hover behavior
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
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    firstName: {
      control: "text",
      description: "Player first name",
    },
    lastName: {
      control: "text",
      description: "Player last name",
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
    isCaptain: {
      control: "boolean",
      description: "Show captain badge",
    },
    variant: {
      control: "radio",
      options: ["default", "compact"],
      description: "Card size variant",
    },
  },
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default player card with real KCVV player photo
 */
export const Default: Story = {
  args: {
    firstName: "Jarne",
    lastName: "Feron",
    position: "Middenvelder",
    number: 7,
    imageUrl: REAL_PLAYER_IMAGES.jarne,
    href: "/player/jarne-feron",
  },
};

/**
 * Player card with captain badge
 */
export const Captain: Story = {
  args: {
    firstName: "Chiel",
    lastName: "Bertens",
    position: "Verdediger",
    number: 5,
    imageUrl: REAL_PLAYER_IMAGES.chiel,
    href: "/player/chiel-bertens",
    isCaptain: true,
  },
};

/**
 * Goalkeeper with specific styling
 */
export const Goalkeeper: Story = {
  args: {
    firstName: "Louie",
    lastName: "Speler",
    position: "Keeper",
    number: 1,
    imageUrl: REAL_PLAYER_IMAGES.louie,
    href: "/player/louie-speler",
  },
};

/**
 * Without photo - shows placeholder silhouette
 */
export const WithoutPhoto: Story = {
  args: {
    firstName: "Nieuwe",
    lastName: "Speler",
    position: "Aanvaller",
    number: 99,
    href: "/player/nieuwe-speler",
  },
};

/**
 * Without jersey number
 */
export const WithoutNumber: Story = {
  args: {
    firstName: "Yoran",
    lastName: "Speler",
    position: "Middenvelder",
    imageUrl: REAL_PLAYER_IMAGES.yoran,
    href: "/player/yoran-speler",
  },
};

/**
 * Long name handling
 */
export const LongName: Story = {
  args: {
    firstName: "Jean-Baptiste",
    lastName: "Van Der Meersberghen",
    position: "Verdediger",
    number: 23,
    imageUrl: REAL_PLAYER_IMAGES.chiel,
    href: "/player/jean-baptiste",
  },
};

/**
 * Compact variant for dense layouts
 */
export const Compact: Story = {
  args: {
    firstName: "Jarne",
    lastName: "Feron",
    position: "Aanvaller",
    number: 9,
    imageUrl: REAL_PLAYER_IMAGES.jarne,
    href: "/player/jarne-feron",
    variant: "compact",
  },
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Loading skeleton state
 */
export const Loading: Story = {
  args: {
    firstName: "",
    lastName: "",
    position: "",
    href: "",
    isLoading: true,
  },
};

/**
 * Grid layout with multiple cards
 */
export const GridLayout: Story = {
  args: {
    firstName: "",
    lastName: "",
    position: "",
    href: "",
  },
  decorators: [], // Remove default decorator
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl">
      <PlayerCard
        firstName="Louie"
        lastName="Keeper"
        position="Keeper"
        number={1}
        imageUrl={REAL_PLAYER_IMAGES.louie}
        href="/player/louie"
      />
      <PlayerCard
        firstName="Chiel"
        lastName="Bertens"
        position="Verdediger"
        number={5}
        imageUrl={REAL_PLAYER_IMAGES.chiel}
        href="/player/chiel-bertens"
        isCaptain
      />
      <PlayerCard
        firstName="Jarne"
        lastName="Feron"
        position="Middenvelder"
        number={7}
        imageUrl={REAL_PLAYER_IMAGES.jarne}
        href="/player/jarne-feron"
      />
      <PlayerCard
        firstName="Yoran"
        lastName="Aanvaller"
        position="Aanvaller"
        number={9}
        imageUrl={REAL_PLAYER_IMAGES.yoran}
        href="/player/yoran"
      />
      <PlayerCard
        firstName="Nieuwe"
        lastName="Speler"
        position="Verdediger"
        number={99}
        href="/player/nieuwe-speler"
      />
      <PlayerCard firstName="" lastName="" position="" href="" isLoading />
    </div>
  ),
};

/**
 * Mobile view
 */
export const MobileView: Story = {
  args: {
    firstName: "Jarne",
    lastName: "Feron",
    position: "Aanvaller",
    number: 19,
    imageUrl: REAL_PLAYER_IMAGES.jarne,
    href: "/player/jarne-feron",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Hover interaction demo
 */
export const HoverDemo: Story = {
  args: {
    firstName: "Chiel",
    lastName: "Bertens",
    position: "Aanvaller",
    number: 14,
    imageUrl: REAL_PLAYER_IMAGES.chiel,
    href: "/player/chiel-bertens",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the card to see the contained image shift effect and shadow change. The jersey number badge also scales up.",
      },
    },
  },
};
