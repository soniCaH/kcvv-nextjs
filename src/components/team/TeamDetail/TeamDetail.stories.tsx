import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamDetail } from "./TeamDetail";
import type { RosterPlayer, StaffMember } from "../TeamRoster";

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
  title: "Pages/TeamDetail",
  component: TeamDetail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Page-level composite for team detail pages. Combines TeamHeader with tabbed content showing team info and lineup.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TeamDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample staff data
const sampleStaff: StaffMember[] = [
  {
    id: "staff-1",
    firstName: "Marc",
    lastName: "Janssen",
    role: "Hoofdtrainer",
    roleCode: "T1",
    imageUrl: REAL_PLAYER_IMAGES.chiel,
  },
  {
    id: "staff-2",
    firstName: "Koen",
    lastName: "Peeters",
    role: "Assistent-trainer",
    roleCode: "T2",
    imageUrl: REAL_PLAYER_IMAGES.jarne,
  },
  {
    id: "staff-3",
    firstName: "Pieter",
    lastName: "De Smet",
    role: "Keeperstrainer",
    roleCode: "TK",
  },
];

// Sample player data
const samplePlayers: RosterPlayer[] = [
  {
    id: "player-1",
    firstName: "Thomas",
    lastName: "Vermeersch",
    position: "Keeper",
    number: 1,
    href: "/players/thomas-vermeersch",
    imageUrl: REAL_PLAYER_IMAGES.louie,
  },
  {
    id: "player-2",
    firstName: "Jef",
    lastName: "Willems",
    position: "Verdediger",
    number: 4,
    href: "/players/jef-willems",
  },
  {
    id: "player-3",
    firstName: "Arne",
    lastName: "Claes",
    position: "Verdediger",
    number: 5,
    href: "/players/arne-claes",
    imageUrl: REAL_PLAYER_IMAGES.chiel,
  },
  {
    id: "player-4",
    firstName: "Lucas",
    lastName: "Mertens",
    position: "Middenvelder",
    number: 8,
    href: "/players/lucas-mertens",
    imageUrl: REAL_PLAYER_IMAGES.yoran,
  },
  {
    id: "player-5",
    firstName: "Ruben",
    lastName: "Jacobs",
    position: "Middenvelder",
    number: 10,
    href: "/players/ruben-jacobs",
  },
  {
    id: "player-6",
    firstName: "Stef",
    lastName: "Van den Berg",
    position: "Aanvaller",
    number: 9,
    href: "/players/stef-van-den-berg",
    imageUrl: REAL_PLAYER_IMAGES.jarne,
  },
  {
    id: "player-7",
    firstName: "Dries",
    lastName: "Wouters",
    position: "Aanvaller",
    number: 11,
    href: "/players/dries-wouters",
  },
];

const sampleContactInfo = `
<p><strong>Training:</strong> Dinsdag en donderdag van 18u30 tot 20u00</p>
<p><strong>Locatie:</strong> Sportcomplex Elewijt, Tervuursesteenweg 252</p>
<p><strong>Contact:</strong> <a href="mailto:u15@kcvvelewijt.be">u15@kcvvelewijt.be</a></p>
`;

const sampleBodyContent = `
<p>De U15 is een ambitieuze ploeg die zich richt op de verdere ontwikkeling van jonge talenten.
Met een focus op techniek, tactiek en teamspirit bereiden we onze spelers voor op de volgende stap in hun voetbalcarrière.</p>
<p>We trainen twee keer per week en nemen deel aan de gewestelijke competitie.</p>
`;

/**
 * Default youth team with all content
 */
export const Default: Story = {
  args: {
    header: {
      name: "U15A",
      tagline: "GEWESTELIJKE U15 K",
      ageGroup: "U15",
      teamType: "youth",
      imageUrl: "https://picsum.photos/seed/team-u15/1200/400",
    },
    contactInfo: sampleContactInfo,
    bodyContent: sampleBodyContent,
    staff: sampleStaff,
    players: samplePlayers,
  },
};

/**
 * Youth team with team photo
 */
export const WithTeamPhoto: Story = {
  args: {
    header: {
      name: "U17 Scholieren",
      tagline: "PROVINCIALE U17",
      ageGroup: "U17",
      teamType: "youth",
      imageUrl: "https://picsum.photos/seed/team-u17/1200/400",
    },
    contactInfo: sampleContactInfo,
    staff: sampleStaff,
    players: samplePlayers,
  },
};

/**
 * Youth team without team photo
 */
export const WithoutTeamPhoto: Story = {
  args: {
    header: {
      name: "U13B",
      tagline: "GEWESTELIJKE U13",
      ageGroup: "U13",
      teamType: "youth",
    },
    contactInfo: sampleContactInfo,
    staff: sampleStaff.slice(0, 2),
    players: samplePlayers.slice(0, 4),
  },
};

/**
 * Team with only staff (no players) - typical for very young teams
 */
export const StaffOnly: Story = {
  args: {
    header: {
      name: "U6 Kleuters",
      tagline: "Recreatief",
      ageGroup: "U6",
      teamType: "youth",
    },
    contactInfo: sampleContactInfo,
    bodyContent:
      "<p>Bij de U6 staat plezier centraal. We leren de kleintjes de basis van het voetbal in een speelse omgeving.</p>",
    staff: sampleStaff.slice(0, 2),
    players: [],
  },
};

/**
 * Team with minimal content
 */
export const MinimalContent: Story = {
  args: {
    header: {
      name: "U21 Beloften",
      ageGroup: "U21",
      teamType: "youth",
    },
    players: samplePlayers,
  },
};

/**
 * Empty state - no players, no staff, no content
 */
export const EmptyState: Story = {
  args: {
    header: {
      name: "Nieuwe Ploeg",
      tagline: "In opbouw",
      teamType: "youth",
    },
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    header: {
      name: "U15A",
      ageGroup: "U15",
      teamType: "youth",
    },
    isLoading: true,
  },
};

/**
 * Senior team variant
 */
export const SeniorTeam: Story = {
  args: {
    header: {
      name: "Eerste Ploeg",
      tagline: "3de Nationale",
      teamType: "senior",
      imageUrl: "https://picsum.photos/seed/team-senior/1200/400",
      stats: {
        wins: 12,
        draws: 5,
        losses: 3,
        goalsFor: 38,
        goalsAgainst: 18,
        position: 2,
      },
    },
    contactInfo:
      "<p><strong>Contact:</strong> <a href='mailto:info@kcvvelewijt.be'>info@kcvvelewijt.be</a></p>",
    staff: sampleStaff,
    players: samplePlayers,
  },
};

/**
 * Team with coach information in header
 */
export const WithCoachInfo: Story = {
  args: {
    header: {
      name: "U15A",
      tagline: "GEWESTELIJKE U15 K",
      ageGroup: "U15",
      teamType: "youth",
      coach: {
        name: "Marc Janssen",
        role: "Hoofdtrainer",
        imageUrl: REAL_PLAYER_IMAGES.chiel,
      },
    },
    contactInfo: sampleContactInfo,
    staff: sampleStaff,
    players: samplePlayers,
  },
};

/**
 * Mobile viewport — single-column stacked layout
 */
export const MobileViewport: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
