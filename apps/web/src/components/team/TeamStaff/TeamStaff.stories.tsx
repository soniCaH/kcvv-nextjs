import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamStaff } from "./TeamStaff";
import type { TeamStaffMemberData } from "./TeamStaff";

const PHOTOS = {
  a: "/player-fixtures/player-schulz.jpg",
  b: "/player-fixtures/player-vartolomaios.jpg",
};

const withPhotos: TeamStaffMemberData[] = [
  {
    id: "1",
    firstName: "Karel",
    lastName: "Vermeulen",
    functionTitle: "T1",
    imageUrl: PHOTOS.a,
  },
  {
    id: "2",
    firstName: "Dirk",
    lastName: "Janssens",
    functionTitle: "T2",
    imageUrl: PHOTOS.b,
  },
  {
    id: "3",
    firstName: "Peter",
    lastName: "Keepers",
    functionTitle: "TK",
  },
  {
    id: "4",
    firstName: "Annick",
    lastName: "De Ploeg",
    role: "afgevaardigde",
  },
];

const illustrationsOnly: TeamStaffMemberData[] = [
  { id: "10", firstName: "Tom", lastName: "Mertens", functionTitle: "T1" },
  { id: "11", firstName: "Greet", lastName: "Wouters", role: "afgevaardigde" },
  {
    id: "12",
    firstName: "Sven",
    lastName: "Coördinator",
    functionTitle: "TVJO",
  },
];

const meta = {
  title: "Features/Teams/TeamStaff",
  component: TeamStaff,
  parameters: { layout: "padded" },
  tags: ["autodocs", "vr"],
  args: { heading: "Staf" },
} satisfies Meta<typeof TeamStaff>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mixed staff — photos + the coat-garment illustration fallback (#2485). */
export const WithPhotos: Story = {
  args: { staff: withPhotos },
};

/** No photos — every card falls back to the coat-garment illustration (#2485). */
export const IllustrationsOnly: Story = {
  args: { staff: illustrationsOnly },
};

/**
 * Reachable members link to their `/staf/{psdId}` profile and carry the
 * "Bekijk →" resting affordance; members without a detail page stay plain.
 */
export const WithDetailLinks: Story = {
  args: {
    // First two members link to their detail page; the rest stay plain. Derived
    // via map so the story never depends on hard-coded fixture indices.
    staff: withPhotos.map((member, i) =>
      i < 2 ? { ...member, href: `/staf/1111${i}` } : member,
    ),
  },
};

/** A board page's word for the run — same heading `<BestuurPage>` passes (#2575 review). */
export const BoardHeading: Story = {
  args: { staff: withPhotos, heading: "De leden" },
};
