/**
 * SponsorsPage Stories
 *
 * Full sponsors page composition: stats header, spotlight carousel for gold
 * sponsors, and three tiered sponsor grids (gold / silver / bronze).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsPage } from "./SponsorsPage";
import { mockSponsors } from "../Sponsors.mocks";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Pages/SponsorsPage",
  component: SponsorsPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full sponsors page for /sponsors. Shows a total-count stats bar, a spotlight carousel of up to 3 gold sponsors, and tiered grids (gold / silver / bronze).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SponsorsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * All three tiers populated with sponsors.
 */
export const Default: Story = {
  args: {
    goldSponsors: mockSponsors.slice(0, 3),
    silverSponsors: mockSponsors.slice(3, 7),
    bronzeSponsors: mockSponsors.slice(7, 10),
  },
};

/**
 * Only gold sponsors — silver and bronze sections are hidden.
 */
export const GoldOnly: Story = {
  args: {
    goldSponsors: mockSponsors.slice(0, 4),
    silverSponsors: [],
    bronzeSponsors: [],
  },
};

/**
 * No sponsors at all — empty state is shown.
 */
export const NoSponsors: Story = {
  args: {
    goldSponsors: [],
    silverSponsors: [],
    bronzeSponsors: [],
  },
};

/**
 * Mobile viewport.
 */
export const MobileViewport: Story = {
  args: {
    goldSponsors: mockSponsors.slice(0, 3),
    silverSponsors: mockSponsors.slice(3, 6),
    bronzeSponsors: mockSponsors.slice(6, 10),
  },
  globals: { viewport: { value: "kcvvMobile" } },
};
