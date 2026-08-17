import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LeaderDotRow } from "./LeaderDotRow";

const meta = {
  title: "UI/LeaderDotRow",
  component: LeaderDotRow,
  tags: ["autodocs", "vr"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="bg-cream border-paper-edge w-[420px] border p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeaderDotRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Eerste elftal A", value: "2e Prov. B" },
};

export const Default: Story = {
  args: { label: "Eerste elftal A", value: "2e Prov. B" },
};

/** The absent-value state — the marker is visible and `aria-hidden`. */
export const AbsentValue: Story = {
  args: { label: "U15", value: null },
};

/** A long label truncates; the leader keeps its 12px minimum. */
export const LongLabelTruncates: Story = {
  args: {
    label: "Interview met de nieuwe jeugdcoördinator over het seizoen",
    value: "02·04·26",
  },
};

export const Linked: Story = {
  args: {
    label: "Mosselfestijn 2026",
    value: "04·09·26",
    href: "/evenementen/mosselfestijn-2026",
  },
};

/**
 * How the rows stack — the device only reads as a contents page in a run. The
 * consumer owns the `<li>`; the row is one element inside it.
 */
export const AsAList: Story = {
  args: { label: "Mosselfestijn 2026", value: "04·09·26" },
  render: () => (
    <ul className="flex flex-col">
      {[
        ["Mosselfestijn 2026", "04·09·26"],
        ["Kampioenenviering", "14·06·26"],
        ["Jeugdtornooi", "23·05·26"],
        ["Quiznight", "18·04·26"],
        ["Eetfestijn", null],
      ].map(([label, value]) => (
        <li key={label}>
          <LeaderDotRow label={label as string} value={value} />
        </li>
      ))}
    </ul>
  ),
};
