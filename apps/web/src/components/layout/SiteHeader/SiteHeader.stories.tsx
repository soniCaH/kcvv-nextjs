import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { within, userEvent } from "storybook/test";
import { SiteHeader } from "./SiteHeader";
import type { TeamNavVM } from "@/lib/repositories/team.repository";

const makeTeam = (over: Partial<TeamNavVM>): TeamNavVM => ({
  id: over.slug ?? "team",
  name: over.name ?? "Team",
  slug: over.slug ?? "team",
  age: over.age ?? null,
  psdId: null,
  division: null,
  divisionFull: null,
  tagline: null,
  teamImageUrl: null,
});

const meta = {
  title: "Layout/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs", "vr"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const seniorTeams: TeamNavVM[] = [
  makeTeam({ slug: "kcvv-elewijt-a", name: "KCVV Elewijt A" }),
  makeTeam({ slug: "kcvv-elewijt-b", name: "KCVV Elewijt B" }),
];

export const Default: Story = {
  args: { seniorTeams },
};

export const NoDynamicTeams: Story = {
  args: {},
};

/**
 * The width case the one-line-fit constraint is about (#2409): team names that
 * carry no "… A" suffix get no short form, so `seniorNavLabel` returns them
 * whole. The label string is *not* capped — the desktop row bounds each entry
 * in CSS (`max-w-[14ch] truncate`), so this is the widest the row can get
 * while the full name stays in the DOM for the link's accessible name.
 */
export const LongTeamNames: Story = {
  args: {
    seniorTeams: [
      makeTeam({ slug: "eerste-elftallen", name: "Eerste Elftallen" }),
      makeTeam({ slug: "tweede-elftallen", name: "Tweede Elftallen" }),
    ],
  },
};

/**
 * Renders the actual `<SiteHeader>` with its drawer opened via the hamburger
 * trigger. Locks down the real composition (drawer hero CTA, drawer nav,
 * close button) so divergence between the deployed site and the design system
 * fails the VR diff. Hamburger is only visible <1024px, so this story should
 * only be evaluated at the mobile/tablet VR viewports.
 */
export const DrawerOpen: Story = {
  args: { seniorTeams },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hamburger = canvas.queryByRole("button", { name: /open menu/i });
    if (hamburger) {
      await userEvent.click(hamburger);
    }
  },
};
