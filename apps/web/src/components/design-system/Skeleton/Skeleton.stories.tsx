import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs", "vr"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default tone (`"cream"`), interactive via the controls panel. */
export const Playground: Story = {
  args: { className: "h-4 w-48" },
};

export const Dark: Story = {
  args: { tone: "dark", className: "h-4 w-48" },
  decorators: [
    (Story) => (
      <div className="bg-jersey-deep-dark p-6">
        <Story />
      </div>
    ),
  ],
};

/** The `cream-deep` field (e.g. `/tegenstander/[clubId]`'s root) — `paper-edge`
 *  is invisible here, which is why this tone exists. */
export const Deep: Story = {
  args: { tone: "deep", className: "h-4 w-48" },
  decorators: [
    (Story) => (
      <div className="bg-cream-deep p-6">
        <Story />
      </div>
    ),
  ],
};

/** A composed heading footprint — kicker → headline → lead, at real widths. */
export const BarStack: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-1 h-10 w-64" />
      <Skeleton className="mt-1 h-4 w-40" />
    </div>
  ),
};
