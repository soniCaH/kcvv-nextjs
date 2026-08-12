import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonoStar } from "./MonoStar";

const meta = {
  title: "UI/MonoStar",
  component: MonoStar,
  tags: ["autodocs", "vr"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft border-paper-edge inline-block border p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MonoStar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The canonical use: the ★ glyph inline with mono caps text, optically
 * centred against the cap-midline via the component's `translateY` shift.
 */
export const InlineWithCaps: Story = {
  render: () => (
    <span className="text-label font-mono uppercase">
      KCVV ELEWIJT <MonoStar /> SEIZOEN 2025
    </span>
  ),
};

/**
 * Against a bullet-dot divider — the alignment scenario the `translateY`
 * shift exists for (matching `<MonoLabelRow>`'s geometric centring).
 */
export const AgainstBulletDivider: Story = {
  render: () => (
    <span className="text-label font-mono uppercase">
      INTERVIEW <span aria-hidden="true">·</span> <MonoStar />{" "}
      <span aria-hidden="true">·</span> MATCHVERSLAG
    </span>
  ),
};

/**
 * Inherits font-size from the parent — the same component reads correctly at
 * both label steps: `label` (11px, standing alone) and `label-sm` (10px, for a
 * label attached above body text that has to recede).
 */
export const SizeInheritance: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3 font-mono uppercase">
      <span className="text-label">
        LABEL SIZE <MonoStar /> 11PX
      </span>
      <span className="text-label-sm">
        SMALLER <MonoStar /> 10PX
      </span>
    </div>
  ),
};
