import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompetitiveStatusLine } from "./CompetitiveStatusLine";

const meta = {
  title: "Features/Teams/CompetitiveStatusLine",
  component: CompetitiveStatusLine,
  parameters: { layout: "padded" },
  tags: ["autodocs", "vr"],
} satisfies Meta<typeof CompetitiveStatusLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * State 1 — not in competition. Replaces empty `#klassement` +
 * `#wedstrijden` sections with one dashed paper slip on soft cream.
 */
export const NotInCompetition: Story = {};

/**
 * A permanent PSD read failure (#2636 finding 3) — a stale/mistyped `psdId`
 * or an undecodable response, caught so the rest of the page (hero, squad,
 * staff) still renders instead of the route serving `error.tsx` forever.
 * Distinct copy from the not-in-competition line on purpose.
 */
export const Unavailable: Story = {
  args: { variant: "unavailable" },
};
