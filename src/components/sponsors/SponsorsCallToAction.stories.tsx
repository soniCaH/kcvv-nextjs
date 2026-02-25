import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsCallToAction } from "./SponsorsCallToAction";

const meta = {
  title: "Features/Sponsors/SponsorsCallToAction",
  component: SponsorsCallToAction,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SponsorsCallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Green gradient CTA block encouraging new sponsors to make contact. */
export const Default: Story = {};
