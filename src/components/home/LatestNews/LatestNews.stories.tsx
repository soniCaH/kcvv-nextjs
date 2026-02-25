import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LatestNews } from "./LatestNews";

const meta: Meta<typeof LatestNews> = {
  title: "Features/Home/LatestNews",
  component: LatestNews,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
    showViewAll: {
      control: "boolean",
      description: 'Show "View All" link',
    },
    viewAllHref: {
      control: "text",
      description: 'URL for "View All" link',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LatestNews>;

const mockArticles = [
  {
    href: "/news/2025-06-20-definitieve-reeksindeling-3e-nationale-bis",
    title: "Definitieve reeksindeling 3e Nationale BIS",
    imageUrl: "https://placehold.co/600x400/4acf52/fff?text=Stadion",
    imageAlt: "Stadion KCVV Elewijt",
    date: "20 juni 2025",
    tags: [{ name: "Ploeg" }, { name: "Competitie" }],
  },
  {
    href: "/news/2025-03-25-overlijden-jean-lepage",
    title: "Overlijden Jean Lepage",
    imageUrl: "https://placehold.co/600x400/1e2024/fff?text=In+Memoriam",
    imageAlt: "Jean Lepage tribute",
    date: "25 maart 2025",
    tags: [{ name: "In Memoriam" }],
  },
  {
    href: "/news/2025-01-15-winterstage-spanje",
    title: "Winterstage in Spanje",
    imageUrl: "https://placehold.co/600x400/4acf52/fff?text=Training",
    imageAlt: "Training KCVV Elewijt",
    date: "15 januari 2025",
    tags: [{ name: "Ploeg" }, { name: "Training" }],
  },
  {
    href: "/news/2025-01-10-jeugdwerking-uitbreiding",
    title: "Jeugdwerking breidt uit met nieuwe trainers",
    imageUrl: "https://placehold.co/600x400/ffd700/000?text=Jeugd",
    imageAlt: "Jeugdtraining",
    date: "10 januari 2025",
    tags: [{ name: "Jeugd" }],
  },
  {
    href: "/news/2025-01-05-nieuwe-sponsor",
    title: "Nieuwe hoofdsponsor voor seizoen 2025-2026",
    imageUrl: "https://placehold.co/600x400/4acf52/fff?text=Sponsor",
    imageAlt: "Sponsorcontract ondertekening",
    date: "5 januari 2025",
    tags: [{ name: "Sponsoring" }],
  },
  {
    href: "/news/2024-12-20-kersttoernooi",
    title: "Kersttoernooi groot succes",
    imageUrl: "https://placehold.co/600x400/ff0000/fff?text=Kerst",
    imageAlt: "Kersttoernooi",
    date: "20 december 2024",
    tags: [{ name: "Evenement" }, { name: "Jeugd" }],
  },
];

/**
 * Default latest news section with 6 articles
 */
export const Default: Story = {
  args: {
    articles: mockArticles,
    title: "Laatste nieuws",
    showViewAll: true,
    viewAllHref: "/news",
  },
};

/**
 * Three articles only (single row on desktop)
 */
export const ThreeArticles: Story = {
  args: {
    articles: mockArticles.slice(0, 3),
    title: "Laatste nieuws",
    showViewAll: true,
  },
};

/**
 * Nine articles (three rows on desktop)
 */
export const NineArticles: Story = {
  args: {
    articles: [...mockArticles, ...mockArticles.slice(0, 3)],
    title: "Nieuwsarchief",
    showViewAll: true,
  },
};

/**
 * Custom section title
 */
export const CustomTitle: Story = {
  args: {
    articles: mockArticles,
    title: "Recente berichten",
    showViewAll: true,
  },
};

/**
 * Without "View All" link
 */
export const WithoutViewAll: Story = {
  args: {
    articles: mockArticles,
    title: "Laatste nieuws",
    showViewAll: false,
  },
};

/**
 * Custom "View All" link
 */
export const CustomViewAllLink: Story = {
  args: {
    articles: mockArticles,
    title: "Laatste nieuws",
    showViewAll: true,
    viewAllHref: "/news?category=ploeg",
  },
};

/**
 * Articles without images
 */
export const WithoutImages: Story = {
  args: {
    articles: mockArticles.map((article) => ({
      ...article,
      imageUrl: undefined,
    })),
    title: "Laatste nieuws",
    showViewAll: true,
  },
};

/**
 * Articles without tags
 */
export const WithoutTags: Story = {
  args: {
    articles: mockArticles.map((article) => ({
      ...article,
      tags: undefined,
    })),
    title: "Laatste nieuws",
    showViewAll: true,
  },
};

/**
 * Single article
 */
export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
    title: "Laatste nieuws",
    showViewAll: true,
  },
};

/**
 * Empty state (hidden)
 */
export const Empty: Story = {
  args: {
    articles: [],
    title: "Laatste nieuws",
    showViewAll: true,
  },
};
