import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { SectionHeaderBase } from "./SectionHeader";
import { SectionHeader } from "./SectionHeader";

// Storybook can't resolve a discriminated-union component type — flatten to
// optional pair for the story args and cast component accordingly.
type StoryArgs = SectionHeaderBase & { linkText?: string; linkHref?: string };

const meta = {
  title: "UI/SectionHeader",
  component: SectionHeader as ComponentType<StoryArgs>,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Phase 1 rework: composes <EditorialHeading> + <MonoLabelRow> kicker. " +
          "Drops the legacy font-body!/font-black!/mb-0! / green-left-border treatment.",
      },
    },
  },
  argTypes: {
    variant: { control: "radio", options: ["light", "dark"] },
    ruled: { control: "boolean" },
    as: { control: "radio", options: ["h1", "h2", "h3"] },
    size: {
      control: "radio",
      options: [
        "display-2xl",
        "display-xl",
        "display-lg",
        "display-md",
        "display-sm",
      ],
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft border-paper-edge max-w-3xl border p-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Nieuws",
    linkText: "Alle berichten",
    linkHref: "/nieuws",
    variant: "light",
  },
};

export const WithKicker: Story = {
  args: {
    title: "Het rooster",
    kicker: [{ label: "MATCHEN" }, { label: "A-PLOEG" }],
    linkText: "Volledige kalender",
    linkHref: "/kalender",
  },
};

export const WithEmphasisHighlighted: Story = {
  args: {
    title: "Het laatste nieuws",
    emphasis: { text: "nieuws", highlight: true },
    linkText: "Alle artikels",
    linkHref: "/nieuws",
  },
};

export const WithEmphasisAccent: Story = {
  args: {
    title: "Het laatste nieuws",
    emphasis: { text: "nieuws" },
    linkText: "Alle artikels",
    linkHref: "/nieuws",
  },
};

export const WithoutLink: Story = {
  args: { title: "Laatste nieuws" },
};

export const DarkVariant: Story = {
  decorators: [
    (Story) => (
      <div className="bg-ink p-10">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Wedstrijden",
    linkText: "Volledige kalender",
    linkHref: "/kalender",
    variant: "dark",
    kicker: [{ label: "A-PLOEG" }, { label: "MATCH 14" }],
  },
};

export const SizeDisplay2xl: Story = {
  args: { title: "Onze sponsors", size: "display-2xl" },
};

export const SizeDisplaySm: Story = {
  args: { title: "Klein onderdeel", size: "display-sm" },
};

/**
 * D10/S2 — hairlines run out from a centred title, chapter furniture for a
 * long index page. Same kicker/domain as the accepted evidence in
 * docs/design/mockups/research-d-series/d10-section-openers.html
 * ("Negentien ploegen, van U6 tot U21"), shortened here so the rules stay
 * clearly visible inside this story's fixed-width demo frame — the evidence
 * title's full length is exercised instead by
 * `RuledTitleExceedsLengthLimit` below, where it deliberately falls back to
 * the default layout.
 */
export const Ruled: Story = {
  args: {
    title: "Van U6 tot U21",
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};

export const RuledDarkVariant: Story = {
  decorators: [
    (Story) => (
      <div className="bg-ink p-10">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Wedstrijden",
    kicker: [{ label: "A-PLOEG" }],
    ruled: true,
    variant: "dark",
  },
};

export const RuledWithLink: Story = {
  args: {
    title: "Het rooster",
    kicker: [{ label: "MATCHEN" }],
    ruled: true,
    linkText: "Volledige kalender",
    linkHref: "/kalender",
  },
};

/**
 * Boundary of the length constraint (`RULED_TITLE_MAX_LENGTH` = 40
 * characters in SectionHeader.tsx). This title is 41 characters — one past
 * the limit — so `ruled` is silently ignored and the default ranged-left
 * layout renders instead, because centring a heading this long between
 * rules scans worse than not centring it at all.
 */
export const RuledTitleExceedsLengthLimit: Story = {
  args: {
    title: "Van de allerkleinste duiveltjes tot de A-ploeg",
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};
