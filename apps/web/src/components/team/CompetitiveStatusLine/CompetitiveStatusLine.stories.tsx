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
