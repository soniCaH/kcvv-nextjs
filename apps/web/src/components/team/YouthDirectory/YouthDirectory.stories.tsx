import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { YouthDivisionGroup } from "@/lib/utils/group-teams";
import { YouthDirectory } from "./YouthDirectory";
import { reservenTeam, youthTeam as team } from "./youth-directory.fixtures";

// Local committed asset (Storybook `staticDirs`) so the squad-photo polaroid is
// deterministic in VR. Teams without it render the <JerseyShirt> fallback.
const PHOTO = "/images/ultras.jpg";

/**
 * The reserves — no age range, so the heading renders bare, and no age code, so
 * the card captions by name over an initialled jersey (#2414).
 */
const reserven: YouthDivisionGroup = {
  label: "Reserven",
  teams: [reservenTeam()],
};

const divisions: YouthDivisionGroup[] = [
  reserven,
  {
    label: "Bovenbouw",
    range: "U17–U21",
    teams: [team("U21", PHOTO), team("U19"), team("U17", PHOTO)],
  },
  {
    label: "Middenbouw",
    range: "U12–U16",
    teams: [team("U15", PHOTO), team("U13", PHOTO)],
  },
  {
    label: "Onderbouw",
    range: "U6–U11",
    teams: [
      team("U11", PHOTO),
      team("U9"),
      team("U8"),
      team("U7"),
      team("U6", PHOTO),
    ],
  },
];

const meta = {
  title: "Features/Teams/YouthDirectory",
  component: YouthDirectory,
  parameters: { layout: "padded" },
  tags: ["autodocs", "vr"],
} satisfies Meta<typeof YouthDirectory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full working — the reserves lead, then the three age divisions. */
export const FullDirectory: Story = {
  args: { divisions },
};

/** Sparse — one division with members, empty groups omitted. */
export const SparseDirectory: Story = {
  args: {
    divisions: [
      { label: "Reserven", teams: [] },
      { label: "Bovenbouw", range: "U17–U21", teams: [] },
      { label: "Middenbouw", range: "U12–U16", teams: [team("U13")] },
      { label: "Onderbouw", range: "U6–U11", teams: [] },
    ],
  },
};
