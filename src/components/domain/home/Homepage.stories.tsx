import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedArticles } from "./FeaturedArticles";
import { LatestNews } from "./LatestNews";

const meta: Meta = {
  title: "Pages/Homepage",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

const mockFeaturedArticles = [
  {
    href: "/news/2025-06-20-definitieve-reeksindeling-3e-nationale-bis",
    title: "Definitieve reeksindeling 3e Nationale BIS",
    description:
      "De reeksindeling voor het seizoen 2025-2026 in 3e Nationale BIS is bekend. KCVV Elewijt komt uit in reeks A.",
    imageUrl: "https://placehold.co/800x600/4acf52/fff?text=Stadion",
    imageAlt: "Stadion KCVV Elewijt",
    date: "20 juni 2025",
    tags: [{ name: "Ploeg" }, { name: "Competitie" }],
  },
  {
    href: "/news/2025-03-25-overlijden-jean-lepage",
    title: "Overlijden Jean Lepage",
    description:
      "Met diepe droefheid hebben we vernomen dat Jean Lepage op 82-jarige leeftijd is overleden. Jean was jarenlang een trouwe supporter en vrijwilliger van KCVV Elewijt.",
    imageUrl: "https://placehold.co/800x600/1e2024/fff?text=In+Memoriam",
    imageAlt: "Jean Lepage tribute",
    date: "25 maart 2025",
    tags: [{ name: "In Memoriam" }],
  },
  {
    href: "/news/2025-01-15-winterstage-spanje",
    title: "Winterstage in Spanje: voorbereiding op play-offs",
    description:
      "De A-ploeg vertrekt volgende week naar Spanje voor een intensieve winterstage. Coach Deferm wil zijn spelers optimaal voorbereiden op de cruciale play-off wedstrijden.",
    imageUrl: "https://placehold.co/800x600/4acf52/fff?text=Training",
    imageAlt: "Training KCVV Elewijt",
    date: "15 januari 2025",
    tags: [{ name: "Ploeg" }, { name: "Training" }, { name: "Stage" }],
  },
];

const mockLatestNews = [
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
  {
    href: "/news/2024-12-15-algemene-vergadering",
    title: "Algemene vergadering uitnodiging",
    imageUrl: "https://placehold.co/600x400/4acf52/fff?text=Vergadering",
    imageAlt: "Algemene vergadering",
    date: "15 december 2024",
    tags: [{ name: "Bestuur" }],
  },
  {
    href: "/news/2024-12-10-spelersvoorstelling",
    title: "Spelersvoorstelling seizoen 2024-2025",
    imageUrl: "https://placehold.co/600x400/4acf52/fff?text=Spelers",
    imageAlt: "Spelersvoorstelling",
    date: "10 december 2024",
    tags: [{ name: "Ploeg" }, { name: "Evenement" }],
  },
  {
    href: "/news/2024-12-05-clubkampioenschap",
    title: "Clubkampioenschap jeugd 2024",
    imageUrl: "https://placehold.co/600x400/ffd700/000?text=Kampioen",
    imageAlt: "Clubkampioenschap",
    date: "5 december 2024",
    tags: [{ name: "Jeugd" }, { name: "Kampioenschap" }],
  },
];

/**
 * Complete homepage layout with hero carousel and latest news
 */
export const Default: Story = {
  render: () => (
    <>
      <FeaturedArticles
        articles={mockFeaturedArticles}
        autoRotate={true}
        autoRotateInterval={5000}
      />
      <LatestNews
        articles={mockLatestNews}
        title="Laatste nieuws"
        showViewAll={true}
        viewAllHref="/news"
      />
    </>
  ),
};

/**
 * Homepage with slow carousel rotation
 */
export const SlowRotation: Story = {
  render: () => (
    <>
      <FeaturedArticles
        articles={mockFeaturedArticles}
        autoRotate={true}
        autoRotateInterval={8000}
      />
      <LatestNews
        articles={mockLatestNews}
        title="Laatste nieuws"
        showViewAll={true}
        viewAllHref="/news"
      />
    </>
  ),
};

/**
 * Homepage without auto-rotation
 */
export const NoAutoRotation: Story = {
  render: () => (
    <>
      <FeaturedArticles articles={mockFeaturedArticles} autoRotate={false} />
      <LatestNews
        articles={mockLatestNews}
        title="Laatste nieuws"
        showViewAll={true}
        viewAllHref="/news"
      />
    </>
  ),
};

/**
 * Homepage with custom section title
 */
export const CustomTitle: Story = {
  render: () => (
    <>
      <FeaturedArticles
        articles={mockFeaturedArticles}
        autoRotate={true}
        autoRotateInterval={5000}
      />
      <LatestNews
        articles={mockLatestNews}
        title="Recente berichten"
        showViewAll={true}
        viewAllHref="/news"
      />
    </>
  ),
};

/**
 * Minimal homepage (fewer articles)
 */
export const Minimal: Story = {
  render: () => (
    <>
      <FeaturedArticles
        articles={mockFeaturedArticles.slice(0, 1)}
        autoRotate={false}
      />
      <LatestNews
        articles={mockLatestNews.slice(0, 3)}
        title="Laatste nieuws"
        showViewAll={true}
        viewAllHref="/news"
      />
    </>
  ),
};
