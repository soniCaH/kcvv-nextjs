/**
 * MobileMenu Component Stories
 * Off-canvas mobile navigation with submenu expansion and active states
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";
import { MobileMenu } from "./MobileMenu";

const meta = {
  title: "Layout/MobileMenu",
  component: MobileMenu,
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        component:
          "Off-canvas mobile navigation panel (280px wide, dark background). Slides in from the left when open. Supports nested submenus and active state highlighting via pathname/search params.",
      },
    },
  },
  args: {
    isOpen: true,
    onClose: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Menu hidden — panel translated off-screen, no backdrop visible
 */
export const Closed: Story = {
  args: {
    isOpen: false,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/**
 * Menu fully open — panel visible, no item active
 */
export const Open: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/**
 * A-Ploeg submenu expanded — play clicks the A-Ploeg toggle button
 */
export const OpenWithAPloegsSubmenu: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /A-Ploeg/i });
    await userEvent.click(toggle);
  },
};

/**
 * Jeugd submenu expanded — play clicks the Jeugd toggle button (13 children)
 */
export const OpenWithJeugdSubmenu: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /Jeugd/i });
    await userEvent.click(toggle);
  },
};

/**
 * Active top-level link — Nieuws item has green left border
 */
export const OpenWithActiveLink: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/news",
      },
    },
  },
};

/**
 * Active child link — A-Ploeg submenu expanded, "Spelers & Staff" highlighted
 */
export const OpenWithActiveChildLink: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/team/a-ploeg",
        query: { tab: "lineup" },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /A-Ploeg/i });
    await userEvent.click(toggle);
  },
};
