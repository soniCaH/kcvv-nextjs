/**
 * CoachProfile Component Stories
 *
 * Coach/staff profile card with photo, role, and contact info.
 *
 * Stories created BEFORE implementation (Storybook-first workflow).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CoachProfile } from "./CoachProfile";

const meta = {
  title: "Teams/CoachProfile",
  component: CoachProfile,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Coach/staff profile card component.

**Features:**
- Photo with fallback placeholder
- Name and role display
- Optional contact info (email, phone)
- Optional biography text
- Card and inline variants

**Usage:**
Used in team detail pages to display coaching staff and team officials.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text", description: "Coach name" },
    role: { control: "text", description: "Role/position" },
    imageUrl: { control: "text", description: "Photo URL" },
    email: { control: "text", description: "Contact email" },
    phone: { control: "text", description: "Contact phone" },
    biography: { control: "text", description: "Biography text" },
    variant: {
      control: "select",
      options: ["card", "inline"],
      description: "Display variant",
    },
    className: { control: "text", description: "Additional CSS classes" },
  },
} satisfies Meta<typeof CoachProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face";

/**
 * Default - Coach card with photo
 */
export const Default: Story = {
  args: {
    name: "Jan Peeters",
    role: "Hoofdtrainer",
    imageUrl: SAMPLE_PHOTO,
  },
};

/**
 * Without photo - Shows placeholder
 */
export const WithoutPhoto: Story = {
  args: {
    name: "Marc Janssen",
    role: "Assistent-trainer",
  },
};

/**
 * With contact info
 */
export const WithContact: Story = {
  args: {
    name: "Jan Peeters",
    role: "Hoofdtrainer",
    imageUrl: SAMPLE_PHOTO,
    email: "jan.peeters@kcvvelewijt.be",
    phone: "+32 479 12 34 56",
  },
};

/**
 * With biography
 */
export const WithBiography: Story = {
  args: {
    name: "Jan Peeters",
    role: "Hoofdtrainer",
    imageUrl: SAMPLE_PHOTO,
    biography:
      "Jan heeft meer dan 15 jaar ervaring als trainer bij verschillende clubs in de regio. Hij behaalde zijn UEFA B-diploma in 2018 en is gepassioneerd door jeugdopleiding.",
  },
};

/**
 * Full profile - All info
 */
export const FullProfile: Story = {
  args: {
    name: "Jan Peeters",
    role: "Hoofdtrainer A-ploeg",
    imageUrl: SAMPLE_PHOTO,
    email: "jan.peeters@kcvvelewijt.be",
    phone: "+32 479 12 34 56",
    biography:
      "Jan heeft meer dan 15 jaar ervaring als trainer bij verschillende clubs in de regio. Hij behaalde zijn UEFA B-diploma in 2018 en is gepassioneerd door jeugdopleiding en technische ontwikkeling.",
  },
};

/**
 * Inline variant - Compact display
 */
export const Inline: Story = {
  args: {
    name: "Marc Janssen",
    role: "Assistent-trainer",
    imageUrl: SAMPLE_PHOTO,
    variant: "inline",
  },
};

/**
 * Inline without photo
 */
export const InlineWithoutPhoto: Story = {
  args: {
    name: "Kris De Vos",
    role: "Keepertrainer",
    variant: "inline",
  },
};

/**
 * Staff member (non-coach)
 */
export const StaffMember: Story = {
  args: {
    name: "Peter Willems",
    role: "Materiaalmeester",
    email: "materiaal@kcvvelewijt.be",
  },
};

/**
 * Youth team coach
 */
export const YouthCoach: Story = {
  args: {
    name: "Tom Hermans",
    role: "Trainer U15",
    imageUrl: SAMPLE_PHOTO,
    phone: "+32 476 98 76 54",
  },
};

/**
 * Multiple coaches display (using decorator)
 */
export const MultipleCoaches: Story = {
  args: {
    name: "Jan Peeters",
    role: "Hoofdtrainer",
    imageUrl: SAMPLE_PHOTO,
  },
  decorators: [
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoachProfile
          name="Jan Peeters"
          role="Hoofdtrainer"
          imageUrl={SAMPLE_PHOTO}
        />
        <CoachProfile name="Marc Janssen" role="Assistent-trainer" />
        <CoachProfile name="Kris De Vos" role="Keepertrainer" />
      </div>
    ),
  ],
};
