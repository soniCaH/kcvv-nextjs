import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsEmptyState } from "./SponsorsEmptyState";

const meta = {
  title: "Features/Sponsors/SponsorsEmptyState",
  component: SponsorsEmptyState,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SponsorsEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Displayed when the CMS returns zero sponsors. */
export const Default: Story = {};
