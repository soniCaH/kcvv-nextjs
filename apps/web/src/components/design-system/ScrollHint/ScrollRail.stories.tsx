/**
 * ScrollRail Component Stories
 *
 * The "row of discrete things" idiom (#2444, as amended by #2489) — chips,
 * crumbs, nav items. Held space follows real overflow: both control-register
 * arrows mount together and hold a 40px gutter on both sides exactly when
 * the track overflows, and the spent direction disables in place rather
 * than unmounting.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollRail } from "./ScrollRail";

const Chip = ({ label }: { label: string }) => (
  <span className="border-ink bg-cream-soft shadow-paper-sm inline-flex shrink-0 items-center border-2 px-3 py-2 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase">
    {label}
  </span>
);

const fewChips = (
  <>
    <Chip label="Alles" />
    <Chip label="Nieuws" />
    <Chip label="Jeugd" />
  </>
);

const manyChips = (
  <>
    {[
      "Alles",
      "Nieuws",
      "Jeugd",
      "Evenementen",
      "Transfers",
      "Interviews",
      "Bestuur",
      "Sponsors",
      "Kalender",
      "Historiek",
    ].map((label) => (
      <Chip key={label} label={label} />
    ))}
  </>
);

const meta = {
  title: "UI/ScrollRail",
  component: ScrollRail,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shared chrome for a row of discrete, tappable things — FilterTabs, TeamSectionNav, the organigram breadcrumb. Both control-register arrows mount together and hold a 40px gutter exactly when the track overflows; the spent direction disables in place.",
      },
    },
  },
  args: {
    role: "group",
    ariaLabel: "Voorbeeldrij",
  },
  decorators: [
    (Story) => (
      <div className="bg-cream w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fits the row — no arrows, no held rail. */
export const Fits: Story = {
  args: {
    trackClassName: "flex gap-3",
    children: fewChips,
  },
};

/** Overflows — both arrows mount, the left one disabled at rest. */
export const Overflows: Story = {
  args: {
    trackClassName: "flex gap-3",
    children: manyChips,
  },
};
