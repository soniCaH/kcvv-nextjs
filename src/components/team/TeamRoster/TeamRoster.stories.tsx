/**
 * TeamRoster Component Stories
 *
 * Player grid showing full team roster grouped by position.
 * Displays PlayerCard components organized by position (GK, DEF, MID, FWD).
 *
 * Stories created BEFORE implementation (Storybook-first workflow).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamRoster } from "./TeamRoster";

// Mock player data matching Drupal API structure
const MOCK_PLAYERS = {
  goalkeepers: [
    {
      id: "gk-1",
      firstName: "Kevin",
      lastName: "Van Ransbeeck",
      position: "Keeper",
      number: 1,
      href: "/speler/kevin-van-ransbeeck",
      imageUrl: "https://picsum.photos/seed/gk1/300/400",
    },
    {
      id: "gk-2",
      firstName: "Bram",
      lastName: "Willems",
      position: "Keeper",
      number: 16,
      href: "/speler/bram-willems",
    },
  ],
  defenders: [
    {
      id: "def-1",
      firstName: "Jan",
      lastName: "Peeters",
      position: "Verdediger",
      number: 2,
      href: "/speler/jan-peeters",
      imageUrl: "https://picsum.photos/seed/def1/300/400",
    },
    {
      id: "def-2",
      firstName: "Pieter",
      lastName: "Janssens",
      position: "Verdediger",
      number: 3,
      href: "/speler/pieter-janssens",
      imageUrl: "https://picsum.photos/seed/def2/300/400",
    },
    {
      id: "def-3",
      firstName: "Thomas",
      lastName: "Maes",
      position: "Verdediger",
      number: 4,
      href: "/speler/thomas-maes",
      isCaptain: true,
      imageUrl: "https://picsum.photos/seed/def3/300/400",
    },
    {
      id: "def-4",
      firstName: "Jef",
      lastName: "De Smedt",
      position: "Verdediger",
      number: 5,
      href: "/speler/jef-de-smedt",
      imageUrl: "https://picsum.photos/seed/def4/300/400",
    },
  ],
  midfielders: [
    {
      id: "mid-1",
      firstName: "Wouter",
      lastName: "Vermeersch",
      position: "Middenvelder",
      number: 6,
      href: "/speler/wouter-vermeersch",
      imageUrl: "https://picsum.photos/seed/mid1/300/400",
    },
    {
      id: "mid-2",
      firstName: "Stijn",
      lastName: "Claes",
      position: "Middenvelder",
      number: 8,
      href: "/speler/stijn-claes",
      imageUrl: "https://picsum.photos/seed/mid2/300/400",
    },
    {
      id: "mid-3",
      firstName: "Raf",
      lastName: "Wouters",
      position: "Middenvelder",
      number: 10,
      href: "/speler/raf-wouters",
      imageUrl: "https://picsum.photos/seed/mid3/300/400",
    },
    {
      id: "mid-4",
      firstName: "Koen",
      lastName: "Van Damme",
      position: "Middenvelder",
      number: 14,
      href: "/speler/koen-van-damme",
    },
  ],
  forwards: [
    {
      id: "fwd-1",
      firstName: "Michiel",
      lastName: "Hendrickx",
      position: "Aanvaller",
      number: 7,
      href: "/speler/michiel-hendrickx",
      imageUrl: "https://picsum.photos/seed/fwd1/300/400",
    },
    {
      id: "fwd-2",
      firstName: "Bert",
      lastName: "Goossens",
      position: "Aanvaller",
      number: 9,
      href: "/speler/bert-goossens",
      imageUrl: "https://picsum.photos/seed/fwd2/300/400",
    },
    {
      id: "fwd-3",
      firstName: "Lars",
      lastName: "Mertens",
      position: "Aanvaller",
      number: 11,
      href: "/speler/lars-mertens",
      imageUrl: "https://picsum.photos/seed/fwd3/300/400",
    },
  ],
};

const MOCK_STAFF = [
  {
    id: "staff-1",
    firstName: "Marc",
    lastName: "Van den Berg",
    role: "Hoofdtrainer",
    imageUrl: "https://picsum.photos/seed/staff1/300/400",
  },
  {
    id: "staff-2",
    firstName: "Dirk",
    lastName: "Hermans",
    role: "Assistent-trainer",
    imageUrl: "https://picsum.photos/seed/staff2/300/400",
  },
  {
    id: "staff-3",
    firstName: "Peter",
    lastName: "Jacobs",
    role: "Keeperstrainer",
  },
];

const ALL_PLAYERS = [
  ...MOCK_PLAYERS.goalkeepers,
  ...MOCK_PLAYERS.defenders,
  ...MOCK_PLAYERS.midfielders,
  ...MOCK_PLAYERS.forwards,
];

const meta = {
  title: "Components/Team/TeamRoster",
  component: TeamRoster,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Player grid showing full team roster.

**Features:**
- Players grouped by position (GK, DEF, MID, FWD)
- Position section headers with player count
- Optional staff display (coaches, trainers)
- Compact list view variant
- Loading skeleton grid
- Empty state handling

**Position Order:**
1. Keepers (Keeper)
2. Verdedigers (Verdediger)
3. Middenvelders (Middenvelder)
4. Aanvallers (Aanvaller)

**Usage:**
Used on team detail pages to display the full squad.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    players: {
      control: "object",
      description: "Array of player data",
    },
    staff: {
      control: "object",
      description: "Array of staff data (coaches, trainers)",
    },
    teamName: {
      control: "text",
      description: "Team name for accessibility",
    },
    groupByPosition: {
      control: "boolean",
      description: "Group players by position with headers",
    },
    showStaff: {
      control: "boolean",
      description: "Display staff section",
    },
    variant: {
      control: "radio",
      options: ["grid", "compact"],
      description: "Layout variant",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
    emptyMessage: {
      control: "text",
      description: "Message when no players found",
    },
  },
} satisfies Meta<typeof TeamRoster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default - Full roster grouped by position
 */
export const Default: Story = {
  args: {
    players: ALL_PLAYERS,
    teamName: "A-Ploeg",
    groupByPosition: true,
  },
};

/**
 * Players grouped by position with section headers
 */
export const ByPosition: Story = {
  args: {
    players: ALL_PLAYERS,
    teamName: "A-Ploeg",
    groupByPosition: true,
  },
};

/**
 * With staff section (coaches, trainers)
 */
export const WithStaff: Story = {
  args: {
    players: ALL_PLAYERS,
    staff: MOCK_STAFF,
    teamName: "A-Ploeg",
    groupByPosition: true,
    showStaff: true,
  },
};

/**
 * Compact list view - denser layout
 */
export const Compact: Story = {
  args: {
    players: ALL_PLAYERS,
    teamName: "A-Ploeg",
    variant: "compact",
    groupByPosition: true,
  },
};

/**
 * Loading skeleton
 */
export const Loading: Story = {
  args: {
    players: [],
    teamName: "A-Ploeg",
    isLoading: true,
  },
};

/**
 * Empty state - no players
 */
export const Empty: Story = {
  args: {
    players: [],
    teamName: "A-Ploeg",
    emptyMessage: "Geen spelers gevonden voor dit team",
  },
};

/**
 * Without position grouping - flat list
 */
export const FlatList: Story = {
  args: {
    players: ALL_PLAYERS,
    teamName: "A-Ploeg",
    groupByPosition: false,
  },
};

/**
 * Only goalkeepers
 */
export const GoalkeepersOnly: Story = {
  args: {
    players: MOCK_PLAYERS.goalkeepers,
    teamName: "A-Ploeg",
    groupByPosition: true,
  },
};

/**
 * Youth team roster (smaller squad)
 */
export const YouthTeam: Story = {
  args: {
    players: [
      ...MOCK_PLAYERS.goalkeepers.slice(0, 1),
      ...MOCK_PLAYERS.defenders.slice(0, 3),
      ...MOCK_PLAYERS.midfielders.slice(0, 3),
      ...MOCK_PLAYERS.forwards.slice(0, 2),
    ],
    staff: MOCK_STAFF.slice(0, 2),
    teamName: "U17",
    groupByPosition: true,
    showStaff: true,
  },
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    players: ALL_PLAYERS.slice(0, 8),
    teamName: "A-Ploeg",
    groupByPosition: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Staff only (no players)
 */
export const StaffOnly: Story = {
  args: {
    players: [],
    staff: MOCK_STAFF,
    teamName: "Technische Staf",
    showStaff: true,
    emptyMessage: "Geen spelers in deze selectie",
  },
};
