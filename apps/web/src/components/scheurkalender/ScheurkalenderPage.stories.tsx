/**
 * ScheurkalenderPage Stories
 *
 * Private (noindex, unlinked) full-season A + B league fixture list — the data
 * source the club screenshots into the InDesign season poster. Poster layout:
 * two columns split on the calendar year, Freight Big month headings with an
 * italic jersey-deep year, and a fixed weekday · day · kickoff date tab.
 *
 * The poster block is 340 × 567 mm; screenshot at roughly 860 px browser width,
 * which prints the club names at ~5.5 mm.
 *
 * Pages/* stories are design references and are not VR-tested (page composition
 * is the e2e suite's concern).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ScheurkalenderPage,
  type ScheurkalenderMatch,
} from "./ScheurkalenderPage";
import ScheurkalenderLoading from "@/app/(main)/scheurkalender/loading";

// ---------------------------------------------------------------------------
// Mock data — real 26/27 fixtures spanning both calendar years, so the column
// split, the month headings and the weekend seams are all exercised. Opponent
// names are left in raw PSD casing ("Ksc Blankenberge") to show the re-casing.
// ---------------------------------------------------------------------------

const seasonFixtures: ScheurkalenderMatch[] = [
  {
    id: 1,
    date: "2026-08-29",
    time: "20:00",
    opponent: "Fenixx Beigem Humbeek",
    kcvvLabel: "B",
    kcvvIsHome: true,
  },
  {
    id: 2,
    date: "2026-08-30",
    time: "15:00",
    opponent: "Ksc Blankenberge",
    kcvvLabel: "A",
    kcvvIsHome: true,
  },
  {
    id: 3,
    date: "2026-09-05",
    time: "19:30",
    opponent: "Ksv Rumbeke",
    kcvvLabel: "A",
    kcvvIsHome: false,
  },
  {
    id: 4,
    date: "2026-09-06",
    time: "17:00",
    opponent: "Kcs Machelen",
    kcvvLabel: "B",
    kcvvIsHome: false,
  },
  {
    id: 5,
    date: "2026-09-12",
    time: "20:00",
    opponent: "Perk Steenokkerzeel Verenigd 1820",
    kcvvLabel: "B",
    kcvvIsHome: true,
  },
  {
    id: 6,
    date: "2026-09-13",
    time: "15:00",
    opponent: "Kvv St-denijs Sport",
    kcvvLabel: "A",
    kcvvIsHome: true,
  },
  {
    id: 7,
    date: "2026-10-04",
    time: "15:00",
    opponent: "Kvk Ieper",
    kcvvLabel: "A",
    kcvvIsHome: false,
  },
  {
    id: 8,
    date: "2026-10-10",
    time: "20:00",
    opponent: "Fc Inkad Diegem",
    kcvvLabel: "B",
    kcvvIsHome: true,
  },
  {
    id: 9,
    date: "2026-11-01",
    time: "14:30",
    opponent: "Eendr Elene-grotenberge",
    kcvvLabel: "A",
    kcvvIsHome: false,
  },
  {
    id: 10,
    date: "2026-12-13",
    time: "17:00",
    opponent: "Fenixx Beigem Humbeek",
    kcvvLabel: "B",
    kcvvIsHome: false,
  },
  {
    id: 11,
    date: "2027-01-09",
    time: "20:00",
    opponent: "Kcs Machelen",
    kcvvLabel: "B",
    kcvvIsHome: true,
  },
  {
    id: 12,
    date: "2027-01-10",
    time: "14:30",
    opponent: "Ksv Rumbeke",
    kcvvLabel: "A",
    kcvvIsHome: true,
  },
  {
    id: 13,
    date: "2027-01-16",
    time: "19:30",
    opponent: "K Sp Amicii Tange",
    kcvvLabel: "B",
    kcvvIsHome: false,
  },
  {
    id: 14,
    date: "2027-02-14",
    time: "15:00",
    opponent: "Erpe-mere United",
    kcvvLabel: "A",
    kcvvIsHome: true,
  },
  {
    id: 15,
    date: "2027-03-06",
    time: "18:00",
    opponent: "Fc Inkad Diegem",
    kcvvLabel: "B",
    kcvvIsHome: false,
  },
  {
    id: 16,
    date: "2027-03-14",
    time: "15:00",
    opponent: "Zwevegem Sport",
    kcvvLabel: "A",
    kcvvIsHome: true,
  },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Pages/ScheurkalenderPage",
  component: ScheurkalenderPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Private InDesign-poster data source for /scheurkalender. Full-season A + B league fixtures split across two columns on the calendar year, with Freight Big month headings and a fixed weekday · day · kickoff date tab. The screen toolbar (print button) is hidden on print; the white sheet composites cleanly into the poster screenshot.",
      },
    },
  },
  args: { season: "26/27" },
  tags: ["autodocs"],
} satisfies Meta<typeof ScheurkalenderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Full season — both calendar years, so the two-column split is visible. */
export const Default: Story = {
  args: { matches: seasonFixtures },
};

/**
 * Poster width — the ~860 px render the owner screenshots at, which prints the
 * club names at roughly 5.5 mm inside the 340 × 567 mm block.
 */
export const PosterWidth: Story = {
  args: { matches: seasonFixtures },
  parameters: { viewport: { defaultViewport: "kcvvTablet" } },
};

/** First half of the season only — falls back to a single full-width column. */
export const SingleYear: Story = {
  args: { matches: seasonFixtures.filter((m) => m.date.startsWith("2026")) },
};

/** One weekend, both squads. */
export const SingleWeekend: Story = {
  args: { matches: seasonFixtures.slice(0, 2) },
};

/** No published league fixtures — empty state. */
export const NoMatches: Story = {
  args: { matches: [] },
};

/** Mobile viewport. The sheet keeps its two columns — it is a poster source, not a responsive page. */
export const MobileViewport: Story = {
  args: { matches: seasonFixtures },
  globals: { viewport: { value: "kcvvMobile" } },
};

export const RouteSkeleton: StoryObj = {
  render: () => <ScheurkalenderLoading />,
  parameters: { layout: "fullscreen" },
};
