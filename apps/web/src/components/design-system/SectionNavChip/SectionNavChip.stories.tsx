import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionNavChip } from "./SectionNavChip";

const meta = {
  title: "UI/SectionNavChip",
  component: SectionNavChip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ul className="bg-cream-deep border-ink flex items-center gap-2 border-b-2 p-3">
        <Story />
      </ul>
    ),
  ],
  args: { id: "spelers", label: "Spelers", isActive: false },
} satisfies Meta<typeof SectionNavChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Resting: Story = {};

export const Active: Story = {
  args: { isActive: true },
};

export const Row: Story = {
  render: () => (
    <>
      <SectionNavChip id="wedstrijden" label="Wedstrijden" isActive={false} />
      <SectionNavChip id="spelers" label="Spelers" isActive={true} />
      <SectionNavChip id="staf" label="Staf" isActive={false} />
    </>
  ),
};
