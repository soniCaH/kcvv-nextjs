import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchHero } from "./MatchHero";
import { fixtureImage } from "@test-fixtures/images";

const meta = {
  title: "Features/Matches/MatchHero",
  component: MatchHero,
  tags: ["autodocs", "vr"],
  parameters: { layout: "padded" },
  // Every story is a normal match unless it opts into the reservation state
  // below — `isPlaceholder` is a required prop (#2688), so this is the one
  // place the default lives rather than every story repeating it.
  args: { isPlaceholder: false },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft min-h-[400px] p-10">
        <div className="mx-auto max-w-[760px]">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof MatchHero>;

export default meta;
type Story = StoryObj<typeof meta>;

const KCVV_LOGO = fixtureImage("sponsor-logo", 0);
const OPPONENT_LOGO = fixtureImage("sponsor-logo", 1);

const defaultHomeTeam = {
  name: "KCVV Elewijt",
  logo: KCVV_LOGO,
};
const defaultAwayTeam = {
  name: "RC Mechelen",
  logo: OPPONENT_LOGO,
};

const upcomingDate = new Date("2025-09-13T13:30:00Z");
const finishedDate = new Date("2025-09-06T13:30:00Z");

const baseArgs = {
  homeTeam: defaultHomeTeam,
  awayTeam: defaultAwayTeam,
  date: upcomingDate,
  time: "14:30",
  venue: "Sportpark Elewijt",
  competition: "3e provinciale A",
  kcvvTeamLabel: "KCVV-A",
} as const;

export const Upcoming: Story = {
  args: {
    ...baseArgs,
    status: "scheduled",
  },
};

export const Finished: Story = {
  args: {
    ...baseArgs,
    date: finishedDate,
    homeTeam: { ...defaultHomeTeam, score: 3 },
    awayTeam: { ...defaultAwayTeam, score: 1 },
    status: "finished",
  },
};

export const Forfeited: Story = {
  args: {
    ...baseArgs,
    date: finishedDate,
    homeTeam: { ...defaultHomeTeam, score: 5 },
    awayTeam: { ...defaultAwayTeam, score: 0 },
    status: "forfeited",
  },
};

export const Postponed: Story = {
  args: {
    ...baseArgs,
    status: "postponed",
  },
};

export const Cancelled: Story = {
  args: {
    ...baseArgs,
    status: "cancelled",
  },
};

export const Stopped: Story = {
  args: {
    ...baseArgs,
    date: finishedDate,
    homeTeam: { ...defaultHomeTeam, score: 1 },
    awayTeam: { ...defaultAwayTeam, score: 1 },
    status: "stopped",
  },
};

export const LongTeamNames: Story = {
  args: {
    ...baseArgs,
    date: finishedDate,
    homeTeam: {
      name: "KFC Sint-Stevens-Woluwe-Diegem",
      logo: defaultHomeTeam.logo,
      score: 2,
    },
    awayTeam: {
      name: "Royal Antwerpen-Borgerhout SK",
      logo: defaultAwayTeam.logo,
      score: 2,
    },
    status: "finished",
  },
};

export const NoLogos: Story = {
  args: {
    ...baseArgs,
    homeTeam: { name: "KCVV Elewijt" },
    awayTeam: { name: "RC Mechelen" },
    status: "scheduled",
  },
};

export const MinimalData: Story = {
  args: {
    homeTeam: defaultHomeTeam,
    awayTeam: defaultAwayTeam,
    date: upcomingDate,
    status: "scheduled",
  },
};

/**
 * A pitch-reservation placeholder (#2606) — both sides upstream are the same
 * club. One crest, no "vs" a second one, no score region: the subject
 * ("Tornooi") and real kickoff replace the competition/score vocabulary,
 * and the meta line names the squad that reserved the slot (#2688).
 *
 * The fullest layout is the only one kept: the defensive no-competition
 * fallback and the no-squad-label variant differ from this one only in the
 * meta line's text, which `MatchHero.test.tsx` already pins at the unit
 * level — a pixel diff cannot uniquely surface a string variant, so a
 * separate baseline for each was three VR captures for one component.
 */
export const Reservation: Story = {
  args: {
    homeTeam: defaultHomeTeam,
    awayTeam: defaultHomeTeam,
    date: upcomingDate,
    time: "09:30",
    venue: "Sportpark Elewijt",
    competition: "Tornooi",
    kcvvTeamLabel: "U13",
    status: "scheduled",
    isPlaceholder: true,
  },
};

/**
 * A tournament fixture with no result yet (#2696/#2802) — a real named
 * opponent, not a self-match. Same one-crest reduced register as
 * `Reservation` above, but the subject names the other club ("TORNOOI · FC
 * ZEMST SPORTIEF") and the crest is the opponent's, resolved by club id
 * (`homeTeam.id`/`awayTeam.id`), never home/away — the gap this ticket
 * closes: before it, `/wedstrijd/[matchId]` rendered an ordinary two-crest
 * "vs" scoreboard against a club PSD hasn't confirmed as a genuine
 * opponent.
 */
export const TournamentPending: Story = {
  args: {
    homeTeam: { ...defaultHomeTeam, id: 1235 },
    awayTeam: { name: "FC Zemst Sportief", id: 1391 },
    date: upcomingDate,
    time: "09:30",
    venue: "Sportpark Elewijt",
    competition: "Tornooi",
    competitionType: "tournament",
    kcvvTeamLabel: "U9",
    status: "scheduled",
    isPlaceholder: false,
  },
};

/**
 * The same tournament fixture once a result exists (#2696 review) — the
 * named club really was the opponent, so the hero reverts to the ordinary
 * two-crest scoreboard instead of staying reduced.
 */
export const TournamentPlayed: Story = {
  args: {
    homeTeam: { ...defaultHomeTeam, id: 1235, score: 4 },
    awayTeam: { name: "FC Zemst Sportief", id: 1391, score: 1 },
    date: finishedDate,
    venue: "Sportpark Elewijt",
    competition: "Tornooi",
    competitionType: "tournament",
    kcvvTeamLabel: "U9",
    status: "finished",
    isPlaceholder: false,
  },
};

/**
 * Mobile collapse — at narrow widths the two-zone grid stacks vertically,
 * the divider rotates from vertical-right to horizontal-bottom, and the
 * status badge stays anchored to the card's top-right.
 */
export const MobileCollapse: Story = {
  args: {
    ...baseArgs,
    date: finishedDate,
    homeTeam: { ...defaultHomeTeam, score: 3 },
    awayTeam: { ...defaultAwayTeam, score: 1 },
    status: "finished",
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div className="bg-cream-soft min-h-[600px] p-4">
        <div className="mx-auto max-w-[360px]">
          <Story />
        </div>
      </div>
    ),
  ],
};
