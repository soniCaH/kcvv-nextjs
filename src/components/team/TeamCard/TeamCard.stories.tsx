/**
 * TeamCard Component Stories
 *
 * Team teaser card for team listings and overview pages.
 * Used on /jeugd (youth overview) and team listing pages.
 *
 * Stories created BEFORE implementation (Storybook-first workflow).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamCard } from "./TeamCard";

// Placeholder images for stories (actual team images loaded from Drupal API at runtime)
// Using picsum.photos for reliable placeholder images in Storybook
const TEAM_IMAGES = {
  aTeam: "https://picsum.photos/seed/ateam/400/300",
  youth: "https://picsum.photos/seed/youth/400/300",
  angels: "https://picsum.photos/seed/angels/400/300",
};

const meta = {
  title: "Components/Team/TeamCard",
  component: TeamCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Team teaser card for team listings and overview pages.

**Features:**
- Team photo with hover zoom effect
- Team name and tagline
- Age group badge for youth teams
- Coach info display (optional)
- Win/Draw/Loss record display (optional)
- Loading skeleton state
- Compact variant for dense layouts

**Design Patterns:**
- Follows ArticleCard hover pattern (image zoom, card lift)
- Uses design system colors and typography
- Mobile-first responsive design
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
      description: "Team name",
    },
    href: {
      control: "text",
      description: "Link to team detail page",
    },
    imageUrl: {
      control: "text",
      description: "Team photo URL",
    },
    tagline: {
      control: "text",
      description: "Team tagline or motto",
    },
    ageGroup: {
      control: "text",
      description: "Age group for youth teams (e.g., U15, U21)",
    },
    teamType: {
      control: "select",
      options: ["senior", "youth", "club"],
      description: "Type of team for visual styling",
    },
    coach: {
      control: "object",
      description: "Coach information",
    },
    record: {
      control: "object",
      description: "Win/Draw/Loss record",
    },
    variant: {
      control: "radio",
      options: ["default", "compact"],
      description: "Card size variant",
    },
    isLoading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
  },
} satisfies Meta<typeof TeamCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default team card - Senior team with photo and tagline
 */
export const Default: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    imageUrl: TEAM_IMAGES.aTeam,
    tagline: "The A-Team",
    teamType: "senior",
  },
};

/**
 * Youth team card with age group badge
 */
export const Youth: Story = {
  args: {
    name: "U15",
    href: "/jeugd/u15",
    imageUrl: TEAM_IMAGES.youth,
    ageGroup: "U15",
    teamType: "youth",
  },
};

/**
 * Senior team with full details
 */
export const Senior: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    imageUrl: TEAM_IMAGES.aTeam,
    tagline: "The A-Team",
    teamType: "senior",
    coach: {
      name: "John Doe",
      imageUrl:
        "https://api.kcvvelewijt.be/sites/default/files/player-picture/chiel.png",
    },
  },
};

/**
 * Team card with group photo
 */
export const WithPhoto: Story = {
  args: {
    name: "KCVV Angels",
    href: "/club/angels",
    imageUrl: TEAM_IMAGES.angels,
    tagline: "De feestneuzen",
    teamType: "club",
  },
};

/**
 * Team card showing coach information
 */
export const WithCoach: Story = {
  args: {
    name: "U17",
    href: "/jeugd/u17",
    imageUrl: TEAM_IMAGES.youth,
    ageGroup: "U17",
    teamType: "youth",
    coach: {
      name: "Jan Peeters",
    },
  },
};

/**
 * Team card showing win/draw/loss record
 */
export const WithRecord: Story = {
  args: {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    imageUrl: TEAM_IMAGES.aTeam,
    tagline: "The A-Team",
    teamType: "senior",
    record: {
      wins: 12,
      draws: 5,
      losses: 3,
    },
  },
};

/**
 * Loading skeleton state
 */
export const Loading: Story = {
  args: {
    name: "",
    href: "",
    isLoading: true,
  },
};

/**
 * Compact variant for dense layouts
 */
export const Compact: Story = {
  args: {
    name: "U10",
    href: "/jeugd/u10",
    imageUrl: TEAM_IMAGES.youth,
    ageGroup: "U10",
    teamType: "youth",
    variant: "compact",
  },
};

/**
 * Without photo - shows placeholder
 */
export const WithoutPhoto: Story = {
  args: {
    name: "Veteranen",
    href: "/team/veteranen",
    tagline: "Vets",
    teamType: "senior",
  },
};

/**
 * Club/Organization team type
 */
export const ClubTeam: Story = {
  args: {
    name: "Jeugdbestuur",
    href: "/club/jeugdbestuur",
    tagline: "De begeleiding van de toekomst",
    teamType: "club",
  },
};

/**
 * Grid layout showing multiple team cards
 */
export const GridLayout: Story = {
  args: {
    name: "",
    href: "",
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
      <TeamCard
        name="A-Ploeg"
        href="/team/a-ploeg"
        imageUrl={TEAM_IMAGES.aTeam}
        tagline="The A-Team"
        teamType="senior"
      />
      <TeamCard
        name="U15"
        href="/jeugd/u15"
        imageUrl={TEAM_IMAGES.youth}
        ageGroup="U15"
        teamType="youth"
      />
      <TeamCard
        name="KCVV Angels"
        href="/club/angels"
        imageUrl={TEAM_IMAGES.angels}
        tagline="De feestneuzen"
        teamType="club"
      />
      <TeamCard
        name="U17"
        href="/jeugd/u17"
        ageGroup="U17"
        teamType="youth"
        coach={{ name: "Jan Peeters" }}
      />
      <TeamCard
        name="B-Ploeg"
        href="/team/b-ploeg"
        tagline="The B-Team"
        teamType="senior"
        record={{ wins: 8, draws: 4, losses: 6 }}
      />
      <TeamCard name="" href="" isLoading />
    </div>
  ),
};

/**
 * Youth teams grid - typical /jeugd page layout
 */
export const YouthTeamsGrid: Story = {
  args: {
    name: "",
    href: "",
  },
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl">
      {[
        "U6",
        "U7",
        "U8",
        "U9",
        "U10",
        "U11",
        "U12",
        "U13",
        "U14",
        "U15",
        "U16",
        "U17",
        "U21",
      ].map((age) => (
        <TeamCard
          key={age}
          name={age}
          href={`/jeugd/${age.toLowerCase()}`}
          ageGroup={age}
          teamType="youth"
          variant="compact"
        />
      ))}
    </div>
  ),
};

/**
 * Mobile viewport
 */
export const MobileView: Story = {
  args: {
    name: "U15",
    href: "/jeugd/u15",
    imageUrl: TEAM_IMAGES.youth,
    ageGroup: "U15",
    teamType: "youth",
    coach: { name: "Jan Peeters" },
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
