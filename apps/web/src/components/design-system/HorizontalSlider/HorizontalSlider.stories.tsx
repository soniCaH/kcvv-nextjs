/**
 * HorizontalSlider Component Stories
 *
 * Direction D ("Paper chrome, ink emphasis") locked at the Phase 2 Track B
 * design checkpoint (2026-04-30). Generic horizontal scroll container with
 * paper-card prev/next arrows (`<ScrollArrowButton register="paper">` —
 * the card slider's sole register, #2444 as amended by #2489). Demonstrated
 * with generic sample cards — no production surface composes matches into a
 * horizontal slider (the homepage and `/kalender` both render vertical
 * match rows), so the former match-card showcase was removed.
 *
 * `title`/`theme` were deleted (#2444 resolution) — neither had a consumer.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HorizontalSlider } from "./HorizontalSlider";

// ---------------------------------------------------------------------------
// Generic sample cards — retro paper-card vocabulary
// ---------------------------------------------------------------------------

const SampleCard = ({ label }: { label: string }) => (
  <div className="border-ink bg-cream font-display text-ink flex h-32 w-64 shrink-0 items-center justify-center border-2 text-2xl italic shadow-[var(--shadow-paper-sm)]">
    {label}
  </div>
);

const fewItems = (
  <>
    <SampleCard label="Card 1" />
    <SampleCard label="Card 2" />
    <SampleCard label="Card 3" />
  </>
);

const manyItems = (
  <>
    <SampleCard label="Card 1" />
    <SampleCard label="Card 2" />
    <SampleCard label="Card 3" />
    <SampleCard label="Card 4" />
    <SampleCard label="Card 5" />
    <SampleCard label="Card 6" />
    <SampleCard label="Card 7" />
    <SampleCard label="Card 8" />
  </>
);

const meta = {
  title: "UI/HorizontalSlider",
  component: HorizontalSlider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Generic horizontal scroll container with smooth scrolling, hidden scrollbar, and the paper-register arrows (48 × 48, cream, `-16px` overhang) from `<ScrollArrowButton>` — the card slider's only register.",
      },
    },
  },
  tags: ["autodocs", "vr"],
} satisfies Meta<typeof HorizontalSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust props in the controls panel. */
export const Playground: Story = {
  args: {
    children: manyItems,
  },
};

/** Few items — arrows may not appear if all items fit the viewport. */
export const FewItems: Story = {
  args: {
    children: fewItems,
  },
};

/** Many items — paper-card sample cards plus the overhung paper arrows. */
export const ManyItems: Story = {
  args: {
    children: manyItems,
  },
};
