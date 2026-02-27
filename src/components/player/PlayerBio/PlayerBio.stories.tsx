/**
 * PlayerBio Component Stories
 *
 * Player biography and personal information section.
 * Used on player profile pages to display key facts.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerBio } from "./PlayerBio";

const meta = {
  title: "Features/Players/PlayerBio",
  component: PlayerBio,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Player biography section displaying personal information.

Features:
- Birth date and age calculation
- Club membership period (join/leave dates)
- Biography text
        `,
      },
    },
    backgrounds: {
      default: "light",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    birthDate: {
      control: "text",
      description: "Birth date (YYYY-MM-DD or display format)",
    },
    joinDate: {
      control: "text",
      description: "Date joined the club",
    },
    leaveDate: {
      control: "text",
      description: "Date left the club (if applicable)",
    },
    biography: {
      control: "text",
      description: "Player biography text",
    },
  },
} satisfies Meta<typeof PlayerBio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default with all information
 * Complete biography section for current player
 */
export const Default: Story = {
  args: {
    birthDate: "1991-06-28",
    joinDate: "2020-07-01",
    biography:
      "Een ervaren middenvelder met uitstekende passing en visie. Na succesvolle periodes bij andere clubs kwam hij in 2020 naar KCVV Elewijt waar hij al snel een vaste waarde werd in het team.",
  },
};

/**
 * Minimal information
 * Only birth date filled
 */
export const Minimal: Story = {
  args: {
    birthDate: "2005-03-15",
  },
};

/**
 * Former player
 * Player who has left the club
 */
export const FormerPlayer: Story = {
  args: {
    birthDate: "1988-04-12",
    joinDate: "2015-07-01",
    leaveDate: "2022-06-30",
    biography:
      "Speelde zeven seizoenen bij KCVV en was jarenlang aanvoerder. Vertrok in 2022 naar een andere club.",
  },
};

/**
 * Long biography
 * Tests text overflow and readability
 */
export const LongBiography: Story = {
  args: {
    birthDate: "1995-08-20",
    joinDate: "2018-07-01",
    biography: `
Een technisch begaafde speler die opvalt door zijn uitstekende balbehandeling en spelinzicht. Hij begon zijn carrière in de jeugdopleiding van een grote club voordat hij de overstap maakte naar KCVV Elewijt.

Sinds zijn komst heeft hij zich ontwikkeld tot een van de sleutelspelers in het team. Zijn vermogen om het spel te lezen en beslissende passes te geven maakt hem onmisbaar op het middenveld.

Naast zijn technische kwaliteiten staat hij ook bekend om zijn leiderschap en werklust. Hij is altijd de eerste op training en de laatste om te vertrekken.
    `.trim(),
  },
};

/**
 * Empty state
 * No biography information available
 */
export const Empty: Story = {
  args: {},
};

/**
 * Youth player
 * Young player recently joined
 */
export const YouthPlayer: Story = {
  args: {
    birthDate: "2010-08-20",
    joinDate: "2022-09-01",
    biography: "Een veelbelovend talent uit de jeugdopleiding.",
  },
};

/**
 * Only biography
 * No dates, just text
 */
export const OnlyBiography: Story = {
  args: {
    biography:
      "Een clubicoon die al jaren deel uitmaakt van KCVV Elewijt. Bekend om zijn inzet en liefde voor de club.",
  },
};

/**
 * Mobile view
 */
export const MobileView: Story = {
  args: {
    birthDate: "1995-04-12",
    joinDate: "2019-07-01",
    biography: "Een dynamische middenvelder met goede technische vaardigheden.",
  },
  globals: {
    viewport: { value: "mobile1" },
  },
};
