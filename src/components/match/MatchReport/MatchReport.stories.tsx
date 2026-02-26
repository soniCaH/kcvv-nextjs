/**
 * MatchReport Storybook Stories
 *
 * Written match report section with text and optional photos.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchReport } from "./MatchReport";

const meta = {
  title: "Features/Matches/MatchReport",
  component: MatchReport,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MatchReport>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullReportContent = `
<p>KCVV Elewijt heeft zaterdag een belangrijke overwinning behaald tegen KFC Turnhout. In een spannende wedstrijd wisten de groen-witten met 3-1 te winnen.</p>

<p>De wedstrijd begon evenwichtig, maar in de 12e minuut opende Jonas Vermeersch de score na een mooie aanval over links. Pieter Janssen leverde de assist met een perfecte voorzet.</p>

<p>Na rust kwamen de bezoekers beter in de wedstrijd en in de 56e minuut maakten ze gelijk via Yannick Hermans. Maar KCVV reageerde sterk en nam in de 67e minuut opnieuw de leiding. Opnieuw was het Jonas Vermeersch die scoorde, ditmaal op aangeven van invaller Kevin Mertens.</p>

<p>In de slotfase kreeg Turnhout nog rood voor Marc Declercq na een stevige overtreding. In de 89e minuut maakte Kevin Mertens het af vanaf de strafschopstip: 3-1.</p>

<p>Met deze overwinning klimt KCVV naar de tweede plaats in het klassement.</p>
`;

const summaryContent = `
<p>KCVV Elewijt won zaterdag met 3-1 van KFC Turnhout. Jonas Vermeersch scoorde tweemaal, Kevin Mertens maakte de derde vanaf de stip.</p>
`;

/**
 * Default - Full match report
 */
export const Default: Story = {
  args: {
    title: "Wedstrijdverslag",
    content: fullReportContent,
    author: "Kevin Van Ransbeeck",
    publishedAt: "2024-02-15T18:30:00",
  },
};

/**
 * Summary - Short version
 */
export const Summary: Story = {
  args: {
    title: "Samenvatting",
    content: summaryContent,
    variant: "summary",
  },
};

/**
 * With photos gallery
 */
export const WithPhotos: Story = {
  args: {
    title: "Wedstrijdverslag",
    content: fullReportContent,
    author: "Kevin Van Ransbeeck",
    publishedAt: "2024-02-15T18:30:00",
    photos: [
      {
        url: "https://picsum.photos/seed/match1/400/400",
        alt: "Doelpunt van Jonas Vermeersch",
      },
      {
        url: "https://picsum.photos/seed/match2/400/400",
        alt: "Vreugde na de winnende goal",
      },
      {
        url: "https://picsum.photos/seed/match3/400/400",
        alt: "Kevin Mertens scoort de penalty",
      },
      {
        url: "https://picsum.photos/seed/match4/400/400",
        alt: "De ploeg viert de overwinning",
      },
    ],
  },
};

/**
 * Without author info
 */
export const WithoutAuthor: Story = {
  args: {
    title: "Wedstrijdverslag",
    content: fullReportContent,
  },
};

/**
 * Empty - No report available
 */
export const Empty: Story = {
  args: {
    title: "Wedstrijdverslag",
    content: "",
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    title: "Wedstrijdverslag",
    content: "",
    isLoading: true,
  },
};

/**
 * Long report with multiple paragraphs
 */
export const LongReport: Story = {
  args: {
    title: "Uitgebreid wedstrijdverslag",
    content: `
      <p>Een volledige analyse van de wedstrijd KCVV Elewijt - KFC Turnhout die zaterdag plaatsvond op Sportpark Elewijt.</p>

      <h3>Eerste helft</h3>
      <p>KCVV begon de wedstrijd sterk en domineerde de eerste twintig minuten. In de 12e minuut opende Jonas Vermeersch de score met een knappe kopbal na een voorzet van Pieter Janssen.</p>
      <p>Turnhout probeerde te reageren maar vond geen antwoord op de sterke verdediging van de thuisploeg.</p>

      <h3>Tweede helft</h3>
      <p>Na de pauze kwamen de bezoekers sterker uit de kleedkamer. In de 56e minuut maakten ze gelijk via Yannick Hermans.</p>
      <p>Maar KCVV toonde veerkracht. In de 67e minuut scoorde Jonas Vermeersch zijn tweede van de avond, op aangeven van invaller Kevin Mertens.</p>

      <h3>Slotfase</h3>
      <p>Turnhout kreeg rood voor Marc Declercq na een harde tackle. Kevin Mertens verzilverde de strafschop in de 89e minuut.</p>

      <h3>Conclusie</h3>
      <p>Een verdiende overwinning voor KCVV die hiermee klimt naar de tweede plaats in het klassement.</p>
    `,
    author: "Kevin Van Ransbeeck",
    publishedAt: "2024-02-15T18:30:00",
  },
};
