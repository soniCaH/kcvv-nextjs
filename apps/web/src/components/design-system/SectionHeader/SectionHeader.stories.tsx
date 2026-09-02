import type { ComponentType, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cn } from "@/lib/utils/cn";
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
    // Demo frame width. Defaults to a compact 768px card — matches every
    // pre-existing story's baseline, so it stays untouched. A ruled story
    // whose title is long enough for the flanking hairlines to matter opts
    // into `parameters.demoWidth: "index"`, the real width `ruled` is
    // built for (#2618 is a chaptering device for long *index* pages) —
    // same `max-w-[var(--container-index)]` spelling <SectionStack>'s
    // stories already use for a full-width component. At the 768px
    // default, a 33-character `display-lg` title leaves the hairlines as
    // unreadable ~10px stubs; at 1280px it leaves a real, legible rule.
    (Story, context) => (
      <div
        className={cn(
          "bg-cream-soft border-paper-edge border p-10",
          context.parameters.demoWidth === "index"
            ? "mx-auto max-w-[var(--container-index)]"
            : "max-w-3xl",
        )}
      >
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
 * `demoWidth: "index"` widens the demo frame to `--container-index`
 * (1280px) — this variant's real home page width (#2618 is a chaptering
 * device for long *index* pages) — rather than the file's default 768px
 * card. At 768px this exact title leaves the flanking hairlines as
 * unreadable ~10px stubs, which understates the treatment; at 1280px they
 * read as real rules, matching production.
 *
 * Captured at all three VR viewports on purpose: below the `lg` breakpoint
 * (this file's `mobile`/`tablet` viewports, 375/768) it proves the
 * responsive fallback — no hairlines, ranged-left, so a title that wraps to
 * two lines on a narrow screen never gets sliced by a rule. Only the
 * `desktop` viewport (1440, above `lg`) shows the ruled treatment.
 */
export const Ruled: Story = {
  parameters: { demoWidth: "index" },
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
 * `demoWidth: "index"` per the same reasoning as the `Ruled` story above —
 * this 27-character title is closer to the boundary than the two short
 * ("Wedstrijden" / "Het rooster") ruled stories, so the wide frame keeps
 * the rules legible here too.
 */
export const RuledWithEmphasisAccent: Story = {
  parameters: { demoWidth: "index" },
  args: {
    title: "Jeugdploegen van U6 tot U21",
    emphasis: { text: "U6 tot U21" },
    kicker: [{ label: "JEUGD" }],
    ruled: true,
  },
};

export const RuledWithEmphasisHighlighted: Story = {
  parameters: { demoWidth: "index" },
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
