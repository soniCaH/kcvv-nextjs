/**
 * BracketAffordance Component Stories
 *
 * Decision D4 (`docs/research/decision-sheet.md` §8, unit 10 of #2608).
 * Source-of-record: `docs/design/mockups/research-d-series/d12-small-delights.html`.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { X } from "@/lib/icons.redesign";
import { BracketAffordance } from "./BracketAffordance";

const meta = {
  title: "UI/BracketAffordance",
  component: BracketAffordance,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A typewriter bracket — `[×]` or `[?]` — set in mono at the 11px label step. Where the surface already has an icon it sits **beside** it, never instead of it; where it has none it opens the line alone rather than a glyph being invented for it. Always `aria-hidden`: the host control keeps its own accessible name, so a screen-reader user hears the action, not punctuation. It sets no colour, so it inherits the ink weight and hover transition of whatever it sits in.",
      },
    },
  },
  tags: ["autodocs", "vr"],
  argTypes: {
    glyph: { control: "inline-radio", options: ["close", "help"] },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft border-paper-edge text-ink inline-block border p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BracketAffordance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { glyph: "close" },
};

export const Close: Story = {
  args: { glyph: "close" },
};

export const Help: Story = {
  args: { glyph: "help" },
};

/**
 * The canonical pairing, as `<Alert dismissible>` mounts it — Phosphor Fill
 * first, bracket beside it, never instead of it.
 */
export const BesideTheIcon: Story = {
  args: { glyph: "close" },
  render: () => (
    <span className="text-ink inline-flex items-center gap-1">
      <X size={14} aria-hidden="true" />
      <BracketAffordance glyph="close" />
    </span>
  ),
};

/**
 * On a surface with no icon — a form hint — the bracket opens the line on
 * its own. No glyph is invented to keep it company.
 */
export const OpeningALine: Story = {
  args: { glyph: "help" },
  render: () => (
    <p className="font-body text-ink/60 max-w-xs text-sm italic">
      <BracketAffordance glyph="help" className="mr-1.5" />
      Zoals het op je lidkaart staat.
    </p>
  ),
};

/**
 * Colour is inherited, not set — the bracket follows the ink weight of the
 * control it sits in, which is what keeps it reading as one glyph pair with
 * the icon rather than as a second icon language.
 */
export const InheritsColour: Story = {
  args: { glyph: "close" },
  render: () => (
    <div className="flex flex-col gap-4">
      <span className="text-ink inline-flex items-center gap-1">
        <X size={14} aria-hidden="true" />
        <BracketAffordance glyph="close" />
      </span>
      <span className="text-ink/60 inline-flex items-center gap-1">
        <X size={14} aria-hidden="true" />
        <BracketAffordance glyph="close" />
      </span>
      <span className="text-alert inline-flex items-center gap-1">
        <X size={14} aria-hidden="true" />
        <BracketAffordance glyph="close" />
      </span>
    </div>
  ),
};

/** On the ink surface — the bracket takes the surrounding cream. */
export const OnInk: Story = {
  args: { glyph: "help" },
  decorators: [
    (Story) => (
      <div className="bg-ink border-paper-edge text-cream inline-block border p-6">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <span className="inline-flex items-center gap-1">
      <X size={14} aria-hidden="true" />
      <BracketAffordance glyph="close" />
    </span>
  ),
};
