import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SubjectAvatarCluster } from "./SubjectAvatarCluster";

const meta = {
  title: "UI/SubjectAvatarCluster",
  component: SubjectAvatarCluster,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Overlapping monogram discs for a `unaniem` (all-subjects) Q&A answer (#2276). Always monogram — even at `attribution` scale — because it marks a shared answer rather than a single portrait. Duo/trio are the real cases; 4+ subjects collapse the tail into a `+N` counter disc.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubjectAvatarCluster>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default editable story — tweak members / scale / max in the Controls panel.
export const Playground: Story = {
  args: {
    scale: "row",
    max: 3,
    members: [{ firstName: "Julien" }, { firstName: "Niels" }],
  },
};

// Duo — the canonical "beide spelers, één antwoord" case.
export const Duo: Story = {
  args: {
    members: [{ firstName: "Julien" }, { firstName: "Niels" }],
  },
};

// Trio panel — three overlapping discs, no counter yet.
export const Trio: Story = {
  args: {
    members: [
      { firstName: "Julien" },
      { firstName: "Niels" },
      { firstName: "Lars" },
    ],
  },
};

// Overflow — 5 subjects collapse to 3 discs + "+2".
export const Overflow: Story = {
  args: {
    members: [
      { firstName: "Julien" },
      { firstName: "Niels" },
      { firstName: "Lars" },
      { firstName: "Tom" },
      { firstName: "Wim" },
    ],
  },
};

// Attribution scale (64px) — used in the PullQuote avatar slot for a
// unanimous key/quote breakout.
export const AttributionScale: Story = {
  args: {
    scale: "attribution",
    members: [{ firstName: "Julien" }, { firstName: "Niels" }],
  },
};
