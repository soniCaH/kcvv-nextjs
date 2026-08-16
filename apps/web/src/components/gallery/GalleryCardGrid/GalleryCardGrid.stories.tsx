import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fixtureImage } from "@test-fixtures/images";
import { GalleryCardGrid, type GalleryCardGridItem } from "./GalleryCardGrid";

// `date` is pre-formatted by the server in production (`toGalleryCardGridItems`),
// so the fixtures carry it the same way.
const GALLERIES: GalleryCardGridItem[] = [
  {
    id: "1",
    title: "3-1 tegen Zemst — de beelden",
    slug: "zemst-derby",
    publishedAt: "2026-01-15T12:00:00Z",
    date: "15 januari 2026",
    imageCount: 24,
    coverUrl: fixtureImage("match-action", 0),
    coverLqip: null,
  },
  {
    id: "2",
    title: "Jeugdtornooi — zondagochtend",
    slug: "jeugdtornooi",
    publishedAt: "2026-03-14T09:00:00Z",
    date: "14 maart 2026",
    imageCount: 42,
    coverUrl: fixtureImage("team-group", 0),
    coverLqip: null,
  },
  {
    id: "3",
    title: "Mosselfeest 2026 in de kantine",
    slug: "mosselfeest-2026",
    publishedAt: "2026-05-05T18:00:00Z",
    date: "5 mei 2026",
    imageCount: 58,
    coverUrl: fixtureImage("event-cover", 1),
    coverLqip: null,
  },
  {
    id: "4",
    title: "Training onder de lichten",
    slug: "training-lichten",
    publishedAt: "2025-01-12T20:00:00Z",
    date: "12 januari 2025",
    imageCount: 9,
    coverUrl: fixtureImage("training", 0),
    coverLqip: null,
  },
  {
    id: "5",
    title: "Supportersbus naar de bekerfinale",
    slug: "supportersbus",
    publishedAt: "2025-04-20T08:00:00Z",
    date: "20 april 2025",
    imageCount: 31,
    coverUrl: fixtureImage("crowd-atmosphere", 0),
    coverLqip: null,
  },
];

const meta = {
  title: "Features/Gallery/GalleryCardGrid",
  component: GalleryCardGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '`<TapedCardGrid columns={3} gap="md">` of `<GalleryCard>` — the grid owns the per-slot rotation. ' +
          "Used by the `/galerij` list and the match/event detail gallery sections.",
      },
    },
  },
} satisfies Meta<typeof GalleryCardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { galleries: GALLERIES },
  tags: ["vr"],
};

export const SingleGallery: Story = {
  args: { galleries: GALLERIES.slice(0, 1) },
};

export const TwoGalleries: Story = {
  args: { galleries: GALLERIES.slice(0, 2) },
  tags: ["vr"],
};
