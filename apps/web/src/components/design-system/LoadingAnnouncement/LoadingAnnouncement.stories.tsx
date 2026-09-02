import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingAnnouncement } from "./LoadingAnnouncement";

/**
 * Renders `sr-only` by design — visually empty in every story. Docs-only, no
 * VR baseline: a screen-reader announcement has nothing to capture a pixel
 * diff on.
 */
const meta = {
  title: "UI/LoadingAnnouncement",
  component: LoadingAnnouncement,
  tags: ["autodocs", "vr-skip"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof LoadingAnnouncement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Nieuws laden…" },
};
