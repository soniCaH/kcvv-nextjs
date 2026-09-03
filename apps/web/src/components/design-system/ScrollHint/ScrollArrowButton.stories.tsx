/**
 * ScrollArrowButton Component Stories
 *
 * One arrow object in two registers (#2444, as amended by #2489):
 * `"paper"` (48 × 48, cream, ink border, `--shadow-paper-sm`, italic
 * Freight glyph — the card slider only) and `"control"` (32 × 32, filled
 * `jersey-deep` with a cream glyph — every other scroller). `disabled`
 * renders the arrow inert in place rather than unmounting it, for a row
 * that holds space regardless of which direction is currently spent.
 *
 * Source-of-record for the paper register:
 * docs/design/mockups/phase-2-track-b/option-d-paper-chrome-ink-emphasis.html
 * (`.arrow-btn` rules).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ScrollArrowButton } from "./ScrollArrowButton";

const meta = {
  title: "UI/ScrollArrowButton",
  component: ScrollArrowButton,
  tags: ["autodocs", "vr"],
  args: {
    direction: "right",
    register: "paper",
    onClick: fn(),
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-cream relative h-20 w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollArrowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground — adjust direction, register and className via
 * controls.
 */
export const Playground: Story = {};

/**
 * Right arrow — paper register, cream on cream, the card slider's only
 * consumer.
 */
export const RightOnCream: Story = {};

/**
 * Left arrow — same paper button, mirrored glyph.
 */
export const LeftOnCream: Story = {
  args: {
    direction: "left",
  },
};

/**
 * Control register — 32 × 32, jersey-deep fill, cream glyph. Every scroller
 * that is not the card slider: a chip row, a table, a nav strip, a
 * breadcrumb, a diagram.
 */
export const Control: Story = {
  args: {
    register: "control",
  },
};

/**
 * Control register, disabled in place — the spent direction on a row that
 * holds space regardless (#2489 resolution part 3). Stays mounted and dim
 * rather than unmounting, so the row never jolts.
 */
export const ControlDisabled: Story = {
  args: {
    register: "control",
    disabled: true,
  },
};

/**
 * Paper register on a dark/ink panel — caller passes a soft-shadow
 * override so the offset depth stays visible. Same button surface,
 * different shadow palette.
 */
export const RightOnInk: Story = {
  args: {
    direction: "right",
    className:
      "shadow-[var(--shadow-paper-sm-soft)] hover:shadow-[3px_3px_0_0_var(--color-ink-muted)]",
  },
  decorators: [
    (Story) => (
      <div className="bg-ink-soft relative h-20 w-48">
        <Story />
      </div>
    ),
  ],
};

/**
 * Left arrow on dark panel.
 */
export const LeftOnInk: Story = {
  args: {
    direction: "left",
    className:
      "shadow-[var(--shadow-paper-sm-soft)] hover:shadow-[3px_3px_0_0_var(--color-ink-muted)]",
  },
  decorators: [
    (Story) => (
      <div className="bg-ink-soft relative h-20 w-48">
        <Story />
      </div>
    ),
  ],
};

/**
 * Control register on a dark/ink panel — the organigram breadcrumb's
 * exact context. Same soft-shadow override the paper register uses.
 */
export const ControlOnInk: Story = {
  args: {
    register: "control",
    direction: "right",
    className:
      "shadow-[var(--shadow-paper-sm-soft)] hover:shadow-[3px_3px_0_0_var(--color-ink-muted)]",
  },
  decorators: [
    (Story) => (
      <div className="bg-ink-soft relative h-20 w-48">
        <Story />
      </div>
    ),
  ],
};

/**
 * Both directions side-by-side on a cream surface — visual reference for
 * the paper button's symmetry.
 */
export const BothDirections: Story = {
  decorators: [
    () => (
      <div className="bg-cream relative h-20 w-72">
        <ScrollArrowButton
          direction="left"
          onClick={() => {}}
          register="paper"
        />
        <ScrollArrowButton
          direction="right"
          onClick={() => {}}
          register="paper"
        />
      </div>
    ),
  ],
};

/**
 * Both directions side-by-side, control register — visual reference for
 * the reserved-rail idiom (a chip row, a nav strip, a breadcrumb).
 */
export const BothDirectionsControl: Story = {
  decorators: [
    () => (
      <div className="bg-cream relative h-20 w-72">
        <ScrollArrowButton
          direction="left"
          onClick={() => {}}
          register="control"
        />
        <ScrollArrowButton
          direction="right"
          onClick={() => {}}
          register="control"
        />
      </div>
    ),
  ],
};
