/**
 * RelatedNews Component Stories
 * Grid of related article cards shown below an article detail page
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RelatedNews } from "./RelatedNews";

const meta = {
  title: "Features/Articles/RelatedNews",
  component: RelatedNews,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Displays a responsive grid of related article cards. Used at the bottom of article detail pages. Renders nothing when the articles array is empty.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RelatedNews>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockArticles = [
  {
    title: "KCVV Elewijt wint derby met 3-1",
    href: "/news/derby-overwinning",
    imageUrl: "https://picsum.photos/400/300?random=20",
    imageAlt: "Derby match",
    date: "15 januari 2025",
    tags: [{ name: "Competitie" }],
  },
  {
    title: "Nieuwe spelers aangetrokken voor komend seizoen",
    href: "/news/nieuwe-spelers",
    imageUrl: "https://picsum.photos/400/300?random=21",
    imageAlt: "New players signing",
    date: "14 januari 2025",
    tags: [{ name: "Transfers" }, { name: "Nieuws" }],
  },
  {
    title: "Jeugdwerking start zomertrainingen",
    href: "/news/zomertrainingen",
    imageUrl: "https://picsum.photos/400/300?random=22",
    imageAlt: "Youth training session",
    date: "13 januari 2025",
    tags: [{ name: "Jeugd" }],
  },
];

const longTitleArticles = [
  {
    title:
      "KCVV Elewijt behaalt een fantastische overwinning in de belangrijke derby en klimt naar de tweede plaats in de rangschikking",
    href: "/news/fantastische-overwinning",
    imageUrl: "https://picsum.photos/400/300?random=30",
    imageAlt: "Team celebration",
    date: "12 januari 2025",
    tags: [{ name: "Competitie" }],
  },
  {
    title:
      "Bestuursvergadering besluit over nieuwe infrastructuurwerken voor het seizoen 2025-2026",
    href: "/news/infrastructuurwerken",
    imageUrl: "https://picsum.photos/400/300?random=31",
    imageAlt: "Infrastructure",
    date: "11 januari 2025",
    tags: [{ name: "Club" }, { name: "Bestuur" }],
  },
  {
    title: "Transferperiode",
    href: "/news/transfers",
    imageUrl: "https://picsum.photos/400/300?random=32",
    imageAlt: "Transfer news",
    date: "10 januari 2025",
    tags: [{ name: "Transfers" }],
  },
];

/** Three related articles — typical usage below an article detail page. */
export const Default: Story = {
  args: {
    articles: mockArticles,
  },
};

/** Single related article. */
export const Single: Story = {
  args: {
    articles: [mockArticles[0] ?? { title: "Artikel", href: "/news/artikel" }],
  },
};

/** Mix of long and short titles to verify line clamping. */
export const LongTitles: Story = {
  args: {
    articles: longTitleArticles,
  },
};

/** Six articles — fills two rows of the three-column grid. */
export const Many: Story = {
  args: {
    articles: [
      ...mockArticles,
      {
        title: "Clubkampioenschap 2025 resultaten",
        href: "/news/clubkampioenschap",
        imageUrl: "https://picsum.photos/400/300?random=23",
        imageAlt: "Championship",
        date: "9 januari 2025",
        tags: [{ name: "Evenement" }],
      },
      {
        title: "Bestuursverkiezingen aangekondigd",
        href: "/news/bestuursverkiezingen",
        imageUrl: "https://picsum.photos/400/300?random=24",
        imageAlt: "Board elections",
        date: "8 januari 2025",
        tags: [{ name: "Club" }],
      },
      {
        title: "Nieuwe sponsor welkom",
        href: "/news/nieuwe-sponsor",
        imageUrl: "https://picsum.photos/400/300?random=25",
        imageAlt: "Sponsor",
        date: "7 januari 2025",
        tags: [{ name: "Nieuws" }],
      },
    ],
  },
};

/** Custom section title. */
export const CustomTitle: Story = {
  args: {
    articles: mockArticles,
    title: "Meer nieuws",
  },
};

/** Empty array — component renders nothing. */
export const Empty: Story = {
  args: {
    articles: [],
  },
};
