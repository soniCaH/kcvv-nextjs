import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";
import { clubStructure } from "@/data/club-structure";

const members = clubStructure.filter((n) => n.parentId !== null).slice(0, 12);

const meta: Meta<typeof MobileNavigationDrawer> = {
  title: "Features/Organigram/MobileNavigationDrawer",
  component: MobileNavigationDrawer,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
    onMemberSelect: { action: "member-selected" },
  },
};

export default meta;
type Story = StoryObj<typeof MobileNavigationDrawer>;

/** Drawer open — full member list for mobile navigation. */
export const Open: Story = {
  args: {
    members,
    isOpen: true,
  },
};

/** Drawer closed — renders nothing. */
export const Closed: Story = {
  args: {
    members,
    isOpen: false,
  },
};

/** Empty member list. */
export const Empty: Story = {
  args: {
    members: [],
    isOpen: true,
  },
};
