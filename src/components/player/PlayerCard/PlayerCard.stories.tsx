/**
 * PlayerCard Component Stories
 *
 * Visual player card for team rosters and player listings.
 * Features the distinctive KCVV green gradient and position indicator.
 *
 * Design based on Gatsby PlayerTeaser with improvements:
 * - Cleaner typography hierarchy
 * - Better mobile responsiveness
 * - Enhanced accessibility
 * - Skeleton loading state
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerCard } from "./PlayerCard";

const meta = {
  title: "Components/Player/PlayerCard",
  component: PlayerCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Visual player card component featuring the distinctive KCVV design with:
- Large, dramatic jersey number with 3D shadow effect (matching live site)
- Green gradient overlay at bottom
- Position badge in top-left corner
- Player photo with hover effect
- First name / Last name typography hierarchy

Used in team rosters, player listings, and search results.
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
 * Default player card with photo
 * Standard size for team roster grids
 */
export const Default: Story = {
  args: {
    firstName: "Kevin",
    lastName: "De Bruyne",
    position: "Middenvelder",
    number: 7,
    imageUrl: "https://picsum.photos/300/400?random=1",
    href: "/player/kevin-de-bruyne",
  },
};

/**
 * Player card with captain badge
 * Shows armband icon next to name
 */
export const Captain: Story = {
  args: {
    firstName: "Jan",
    lastName: "Vertonghen",
    position: "Verdediger",
    number: 5,
    imageUrl: "https://picsum.photos/300/400?random=2",
    href: "/player/jan-vertonghen",
    isCaptain: true,
  },
};

/**
 * Goalkeeper with specific styling
 * Position text shows "K" for Keeper
 */
export const Goalkeeper: Story = {
  args: {
    firstName: "Thibaut",
    lastName: "Courtois",
    position: "Keeper",
    number: 1,
    imageUrl: "https://picsum.photos/300/400?random=3",
    href: "/player/thibaut-courtois",
  },
};

/**
 * Without photo
 * Shows KCVV placeholder silhouette
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
 * Large decorative number and visual effect are hidden
 */
export const WithoutNumber: Story = {
  args: {
    firstName: "Youri",
    lastName: "Tielemans",
    position: "Middenvelder",
    imageUrl: "https://picsum.photos/300/400?random=4",
    href: "/player/youri-tielemans",
  },
};

/**
 * Long name handling
 * Shows how text truncates for very long names
 */
export const LongName: Story = {
  args: {
    firstName: "Jean-Baptiste",
    lastName: "Van Der Meersberghen",
    position: "Verdediger",
    number: 23,
    imageUrl: "https://picsum.photos/300/400?random=5",
    href: "/player/jean-baptiste",
  },
};

/**
 * Compact variant
 * Smaller card for dense layouts and mobile
 */
export const Compact: Story = {
  args: {
    firstName: "Romelu",
    lastName: "Lukaku",
    position: "Aanvaller",
    number: 9,
    imageUrl: "https://picsum.photos/300/400?random=6",
    href: "/player/romelu-lukaku",
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
 * Multiple cards in a responsive grid
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
        firstName="Thibaut"
        lastName="Courtois"
        position="Keeper"
        number={1}
        imageUrl="https://picsum.photos/300/400?random=10"
        href="/player/thibaut-courtois"
      />
      <PlayerCard
        firstName="Jan"
        lastName="Vertonghen"
        position="Verdediger"
        number={5}
        imageUrl="https://picsum.photos/300/400?random=11"
        href="/player/jan-vertonghen"
        isCaptain
      />
      <PlayerCard
        firstName="Kevin"
        lastName="De Bruyne"
        position="Middenvelder"
        number={7}
        imageUrl="https://picsum.photos/300/400?random=12"
        href="/player/kevin-de-bruyne"
      />
      <PlayerCard
        firstName="Romelu"
        lastName="Lukaku"
        position="Aanvaller"
        number={9}
        imageUrl="https://picsum.photos/300/400?random=13"
        href="/player/romelu-lukaku"
      />
      <PlayerCard
        firstName="Axel"
        lastName="Witsel"
        position="Middenvelder"
        number={6}
        imageUrl="https://picsum.photos/300/400?random=14"
        href="/player/axel-witsel"
      />
      <PlayerCard
        firstName="Yannick"
        lastName="Carrasco"
        position="Aanvaller"
        number={11}
        imageUrl="https://picsum.photos/300/400?random=15"
        href="/player/yannick-carrasco"
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
    firstName: "Leandro",
    lastName: "Trossard",
    position: "Aanvaller",
    number: 19,
    imageUrl: "https://picsum.photos/300/400?random=7",
    href: "/player/leandro-trossard",
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
    firstName: "Dries",
    lastName: "Mertens",
    position: "Aanvaller",
    number: 14,
    imageUrl: "https://picsum.photos/300/400?random=8",
    href: "/player/dries-mertens",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Hover over the card to see the image shift effect (desktop only). The large jersey number creates a striking visual anchor.",
      },
    },
  },
};
