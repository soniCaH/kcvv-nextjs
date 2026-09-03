/**
 * ScrollOverlay Component Stories
 *
 * The "content scrolled past" idiom (#2444, as amended by #2476) — a table,
 * a diagram. No reserved rail: the control-register arrow overlays the edge
 * and mounts only on real overflow, with a fade capped at
 * `min(24px, remaining)`.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollOverlay } from "./ScrollOverlay";

const WideContent = () => (
  <div className="flex w-[900px] gap-4 font-mono text-xs">
    {Array.from({ length: 8 }, (_, i) => (
      <div key={i} className="border-ink-muted flex-1 border p-3">
        Kolom {i + 1}
      </div>
    ))}
  </div>
);

const meta = {
  title: "UI/ScrollOverlay",
  component: ScrollOverlay,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shared chrome for content scrolled past rather than a row of tap targets — HtmlTableBlock, StandingsTable, VolledigOrganigram's chart. No reserved rail; the arrow overlays the edge and mounts per direction on real overflow, with a capped fade.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** direction="right" (the default) — a table with a sticky first column
 *  already anchors the left edge, so only the right edge needs a cue. */
export const RightOnly: Story = {
  args: {
    role: "region",
    ariaLabel: "Voorbeeldtabel",
    children: <WideContent />,
  },
};

/** direction="both" — a diagram with no anchored edge, e.g. the organigram
 *  chart. Scroll right to see the left arrow mount too. */
export const BothDirections: Story = {
  args: {
    direction: "both",
    role: "region",
    ariaLabel: "Voorbeelddiagram",
    children: <WideContent />,
  },
};
