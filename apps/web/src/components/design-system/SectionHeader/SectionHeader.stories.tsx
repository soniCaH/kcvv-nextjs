import type { ComponentType, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { SectionHeaderBase } from "./SectionHeader";
import { SectionHeader } from "./SectionHeader";

// Storybook can't resolve a discriminated-union component type — flatten to
// optional pair for the story args and cast component accordingly.
type StoryArgs = SectionHeaderBase & { linkText?: string; linkHref?: string };

// Shared by DarkVariant and RuledDarkVariant — both stand a light-on-cream
// component up against an ink ground.
const darkGroundDecorator = (Story: () => ReactNode) => (
  <div className="bg-ink p-10">
    <Story />
  </div>
);

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
  decorators: [darkGroundDecorator],
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
 * long index page. The exact evidence heading from
 * docs/design/mockups/research-d-series/d10-section-openers.html — 33
 * characters, inside the `RULED_TITLE_MAX_LENGTH` guard.
 *
 * Captured at all three VR viewports on purpose: below the `lg` breakpoint
 * (this file's `mobile`/`tablet` viewports, 375/768) it proves the
 * responsive fallback — no hairlines, ranged-left, so a title that wraps to
 * two lines on a narrow screen never gets sliced by a rule. Only the
 * `desktop` viewport (1440, above `lg`) shows the ruled treatment. Rules
 * read thin there because this story's fixed 768px demo frame — shared by
 * every story in this file — leaves little slack once a 33-character title
 * fills it at `display-lg`; a real page's wider content column (1040/1280)
 * has considerably more room, per the math on `RULED_TITLE_MAX_LENGTH`.
 */
export const Ruled: Story = {
  args: {
    title: "Negentien ploegen, van U6 tot U21",
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};

export const RuledDarkVariant: Story = {
  decorators: [darkGroundDecorator],
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
 * D10's own evidence heading is itself an emphasis heading
 * (`<h3>Negentien ploegen, van <em>U6 tot U21</em></h3>`) — cover both
 * `emphasis` variants combined with `ruled`, since `emphasis.highlight`
 * routes through `<HighlighterStroke>`, which adds `padding-bottom: 0.1em`
 * to the emphasised span and so grows the heading's own box — exactly the
 * kind of change that could shift where the flanking hairlines land.
 */
export const RuledWithEmphasisAccent: Story = {
  args: {
    title: "Jeugdploegen van U6 tot U21",
    emphasis: { text: "U6 tot U21" },
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};

export const RuledWithEmphasisHighlighted: Story = {
  args: {
    title: "Jeugdploegen van U6 tot U21",
    emphasis: { text: "U6 tot U21", highlight: true },
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};

/**
 * Boundary of the length constraint — see `RULED_TITLE_MAX_LENGTH` in
 * SectionHeader.tsx for the full rule. This title is a genuine 41
 * characters, one past the limit, so `ruled` is silently ignored and the
 * default ranged-left layout renders instead.
 */
export const RuledTitleExceedsLengthLimit: Story = {
  args: {
    title: "Van alle duiveltjes tot en met de A-ploeg",
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};
