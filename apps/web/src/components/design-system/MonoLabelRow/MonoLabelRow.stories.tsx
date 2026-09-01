import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonoLabelRow } from "./MonoLabelRow";

const meta = {
  title: "UI/MonoLabelRow",
  component: MonoLabelRow,
  tags: ["autodocs", "vr"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft border-paper-edge border p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MonoLabelRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_ITEMS = [
  { label: "MATCHVERSLAG" },
  { label: "A-PLOEG" },
  { label: "8 MIN" },
];

export const Playground: Story = {
  args: { items: SAMPLE_ITEMS },
};

export const Default: Story = {
  args: { items: SAMPLE_ITEMS },
};

export const MixedVariants: Story = {
  args: {
    items: [
      { label: "JEUGD", variant: "pill-jersey" },
      { label: "U15", variant: "pill-ink" },
      { label: "PROVINCIAAL", variant: "plain" },
    ],
  },
};

export const WithStarDivider: Story = {
  args: {
    divider: "★",
    items: [{ label: "VERSLAG" }, { label: "23 APR" }, { label: "EINDSTAND" }],
  },
};

export const WithPipeDivider: Story = {
  args: {
    divider: "|",
    items: [{ label: "INTERVIEW" }, { label: "DUO" }, { label: "12 MIN" }],
  },
};

export const LongRowWraps: Story = {
  args: {
    items: [
      { label: "MATCHVERSLAG" },
      { label: "A-PLOEG" },
      { label: "DERBY" },
      { label: "PROVINCIAAL" },
      { label: "23 APR 26" },
      { label: "EINDSTAND 3-1" },
    ],
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const OrderedList: Story = {
  args: {
    as: "ol",
    items: [
      { label: "STAMNR. 55", variant: "pill-cream" },
      { label: "SEIZOEN 26/27", variant: "pill-cream" },
    ],
  },
};

// tone="cream" on a jersey-deep surface — confirms both the label text and
// the divider dot/glyph stay readable on a dark card (e.g. `<PullQuote>`'s
// context-label slot). Without this, the only pictorial coverage of
// tone="cream" is indirect, via a PullQuote story.
export const ToneCreamOnJerseyDeep: Story = {
  args: {
    tone: "cream",
    items: [
      { label: "DE JEUGDVISIE" },
      { label: "PLEZIER" },
      { label: "TECHNIEK" },
      { label: "TEAMSPIRIT" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-jersey-deep border-jersey-deep-dark border p-6">
        <Story />
      </div>
    ),
  ],
};
