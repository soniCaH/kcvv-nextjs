import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HulpLoading from "./loading";

/**
 * `/hulp`'s skeleton composes a bespoke shell (sticky two-door nav · dark
 * hero band · finder) beyond what `<PageHeroSkeleton>`/`<Skeleton>` alone
 * express, so it earns its own story per #2432 §8 — one of five bespoke
 * skeletons documented this way (`/wedstrijd/[matchId]`,
 * `/tegenstander/[clubId]`, `/kalender`, `/scheurkalender` already had theirs).
 */
const meta = {
  title: "Pages/Hulp/HulpSkeleton",
  component: HulpLoading,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HulpLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
