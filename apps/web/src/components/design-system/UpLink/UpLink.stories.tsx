import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UpLink } from "./UpLink";

const meta = {
  title: "UI/UpLink",
  component: UpLink,
  tags: ["autodocs", "vr"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft border-paper-edge inline-block border p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UpLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ink: Story = {
  args: { href: "/nieuws", label: "Nieuws" },
};

export const Cream: Story = {
  args: { href: "/club", label: "De club", tone: "cream" },
  decorators: [
    (Story) => (
      <div className="bg-jersey-deep-dark p-8">
        <Story />
      </div>
    ),
  ],
};

// `/ploegen/[slug]/wedstrijden` carries the one dynamic label (the team
// display name). Post-#2630 display names are 4-8 characters, so this no
// longer wraps at 390px — kept as a regression guard against that.
export const LongLabel: Story = {
  args: { href: "/ploegen/eerste-elftallen-a", label: "Eerste Elftallen A" },
};
