import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ContactOverlay } from "./ContactOverlay";
import { clubStructure } from "@/data/club-structure";

const president = clubStructure.find((n) => n.id === "president") ?? {
  id: "president",
  name: "Voorzitter",
  title: "Voorzitter",
};
const minimal = { id: "x", name: "Jan Janssen", title: "Vrijwilliger" };

const meta: Meta<typeof ContactOverlay> = {
  title: "Features/Organigram/ContactOverlay",
  component: ContactOverlay,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Floating overlay shown when a node is hovered/clicked in the org chart. Positioned relative to the node.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
    onViewDetails: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ContactOverlay>;

/** Full member data with email, phone, and "View details" link. */
export const Visible: Story = {
  args: {
    member: president,
    isVisible: true,
    position: { x: 100, y: 100 },
  },
};

/** Minimal member — name and title only, no contact fields. */
export const MinimalMember: Story = {
  args: {
    member: minimal,
    isVisible: true,
    position: { x: 100, y: 100 },
  },
};

/** Overlay hidden (isVisible=false) — renders nothing. */
export const Hidden: Story = {
  args: {
    member: president,
    isVisible: false,
    position: { x: 100, y: 100 },
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `isVisible` is false the component returns null — the canvas is intentionally blank.",
      },
    },
  },
};
