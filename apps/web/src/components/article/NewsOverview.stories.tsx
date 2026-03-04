/**
 * News Overview Layout Story
 * Combines CategoryFilters and ArticleCard grid to show the complete /news page layout
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CategoryFilters } from "./CategoryFilters/CategoryFilters";
import { ArticleCard } from "./ArticleCard/ArticleCard";

const meta = {
  title: "Features/Articles/NewsOverview",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete news overview page layout combining category filters and article grid. Matches the /news page design.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCategories = [
  {
    id: "1",
    attributes: { name: "Wedstrijdverslagen", slug: "wedstrijdverslagen" },
  },
  { id: "2", attributes: { name: "Clubnieuws", slug: "clubnieuws" } },
  { id: "3", attributes: { name: "Evenementen", slug: "evenementen" } },
  { id: "4", attributes: { name: "Jeugd", slug: "jeugd" } },
  { id: "5", attributes: { name: "Senioren", slug: "senioren" } },
  { id: "6", attributes: { name: "Transfers", slug: "transfers" } },
];

const mockArticles = [
  {
    title: "KCVV Elewijt wint belangrijke derby",
    href: "/news/derby-overwinning",
    imageUrl: "https://picsum.photos/400/300?random=1",
    imageAlt: "Derby match action",
    date: "15 januari 2025",
    tags: [{ name: "Wedstrijdverslagen" }, { name: "Senioren" }],
  },
  {
    title: "Nieuwe spelers versterken selectie voor volgend seizoen",
    href: "/news/nieuwe-spelers",
    imageUrl: "https://picsum.photos/400/300?random=2",
    imageAlt: "New player signing",
    date: "14 januari 2025",
    tags: [{ name: "Transfers" }, { name: "Clubnieuws" }],
  },
  {
    title: "Jeugdwerking start zomerkamp",
    href: "/news/zomerkamp",
    imageUrl: "https://picsum.photos/400/300?random=3",
    imageAlt: "Youth camp activities",
    date: "13 januari 2025",
    tags: [{ name: "Jeugd" }],
  },
  {
    title: "Clubkampioenschap 2025: uitslagen en hoogtepunten",
    href: "/news/clubkampioenschap",
    imageUrl: "https://picsum.photos/400/300?random=4",
    imageAlt: "Championship trophy",
    date: "12 januari 2025",
    tags: [{ name: "Evenementen" }],
  },
  {
    title: "Bestuursverkiezingen: kandidaten bekend",
    href: "/news/bestuursverkiezingen",
    imageUrl: "https://picsum.photos/400/300?random=5",
    imageAlt: "Board meeting",
    date: "11 januari 2025",
    tags: [{ name: "Clubnieuws" }],
  },
  {
    title: "Nieuwe hoofdsponsor verwelkomt KCVV Elewijt",
    href: "/news/nieuwe-sponsor",
    imageUrl: "https://picsum.photos/400/300?random=6",
    imageAlt: "Sponsor announcement",
    date: "10 januari 2025",
    tags: [{ name: "Clubnieuws" }],
  },
  {
    title: "Trainingsschema winterperiode aangepast",
    href: "/news/trainingsschema",
    imageUrl: "https://picsum.photos/400/300?random=7",
    imageAlt: "Winter training",
    date: "9 januari 2025",
    tags: [{ name: "Senioren" }],
  },
  {
    title: "Jeugdtoernooi groot succes",
    href: "/news/jeugdtoernooi",
    imageUrl: "https://picsum.photos/400/300?random=8",
    imageAlt: "Youth tournament",
    date: "8 januari 2025",
    tags: [{ name: "Jeugd" }, { name: "Evenementen" }],
  },
  {
    title: "Terugblik op fantastisch seizoen 2024",
    href: "/news/terugblik-2024",
    imageUrl: "https://picsum.photos/400/300?random=9",
    imageAlt: "Season highlights",
    date: "7 januari 2025",
    tags: [{ name: "Clubnieuws" }],
  },
];

/**
 * Complete news overview
 * Shows the full /news page layout with filters and article grid
 */
export const CompleteOverview: Story = {
  render: () => {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        {/* Category filters */}
        <section className="mb-6 uppercase">
          <h5 className="mb-2 text-sm font-semibold">Filter op categorie</h5>
          <CategoryFilters
            categories={mockCategories}
            activeCategory={activeCategory}
            renderAsLinks={false}
            onChange={setActiveCategory}
          />
        </section>

        {/* Articles grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mb-6">
          {mockArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </main>

        {/* Pagination (placeholder) */}
        <footer className="border-t border-kcvv-green-100 pt-6 grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">« Vorige</span>
          </div>
          <div className="text-right">
            <a href="#" className="text-kcvv-green-bright hover:underline">
              Volgende »
            </a>
          </div>
        </footer>
      </div>
    );
  },
};

/**
 * With active category filter
 * Shows filtered view with active category
 */
export const WithActiveFilter: Story = {
  render: () => {
    const [activeCategory, setActiveCategory] = useState("jeugd");

    return (
      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        {/* Category filters */}
        <section className="mb-6 uppercase">
          <h5 className="mb-2 text-sm font-semibold">Filter op categorie</h5>
          <CategoryFilters
            categories={mockCategories}
            activeCategory={activeCategory}
            renderAsLinks={false}
            onChange={setActiveCategory}
          />
        </section>

        {/* Filtered articles (only Jeugd) */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mb-6">
          {mockArticles
            .filter((article) =>
              article.tags.some((tag) => tag.name === "Jeugd"),
            )
            .map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
        </main>
      </div>
    );
  },
};

/**
 * Mobile view
 * Shows responsive layout on mobile
 */
export const MobileOverview: Story = {
  render: () => {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
      <div className="w-full max-w-inner-lg mx-auto px-3 py-6">
        <section className="mb-6 uppercase">
          <h5 className="mb-2 text-sm font-semibold">Filter op categorie</h5>
          <CategoryFilters
            categories={mockCategories}
            activeCategory={activeCategory}
            renderAsLinks={false}
            onChange={setActiveCategory}
          />
        </section>

        <main className="grid grid-cols-1 gap-6 mb-6">
          {mockArticles.slice(0, 3).map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </main>
      </div>
    );
  },
  globals: {
    viewport: { value: "mobile1" },
  },
};

/**
 * Empty state
 * Shows layout when no articles match the filter
 */
export const EmptyState: Story = {
  render: () => {
    const [activeCategory, setActiveCategory] = useState("transfers");

    return (
      <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        <section className="mb-6 uppercase">
          <h5 className="mb-2 text-sm font-semibold">Filter op categorie</h5>
          <CategoryFilters
            categories={mockCategories}
            activeCategory={activeCategory}
            renderAsLinks={false}
            onChange={setActiveCategory}
          />
        </section>

        <main className="mb-6 text-center py-12">
          <p className="text-gray-500 text-lg">
            Geen artikelen gevonden voor deze categorie.
          </p>
        </main>
      </div>
    );
  },
};
