/**
 * PlayerCard Component Stories
 *
 * Visual player card for team rosters and player listings.
 * Exact match of the Gatsby PlayerTeaser design.
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
  title: "Components/Player/PlayerCard",
  component: PlayerCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Visual player card matching the Gatsby PlayerTeaser design exactly:
- Large jersey number with stenciletta font and 3D shadow effect
- Green gradient overlay at bottom (30% height)
- Player photo with hover shift effect (-50px X, -10px Y on desktop)
- First name (semibold) / Last name (thin) typography using quasimoda font
- Captain badge support
- Card dimensions: 285px mobile, 446px desktop

Used in team rosters and player listings.
        `,
      },
    },
    backgrounds: {
      default: "light",
    },
  },
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
 * Uses transparent background image from the live site
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
 * Shows armband icon next to name
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
 * Without photo
 * Shows placeholder silhouette
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
 * Large decorative number is hidden
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
 * Shows how text handles very long names
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
 * Compact variant
 * Smaller card for dense layouts and mobile
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
};

/**
 * Loading state
 * Skeleton placeholder while data loads
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
 * Grid layout
 * Multiple cards in a responsive grid with real player images
 */
export const GridLayout: Story = {
  args: {
    firstName: "",
    lastName: "",
    position: "",
    href: "",
  },
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
 * Shows card at mobile viewport width
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
 * Hover interaction
 * Demonstrates the hover state with image shift
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
          "Hover over the card to see the image shift effect (desktop only). The large jersey number grows and creates a striking visual anchor.",
      },
    },
  },
};
