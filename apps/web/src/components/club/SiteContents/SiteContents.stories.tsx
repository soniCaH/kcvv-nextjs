import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ContentsGroup } from "@/lib/utils/site-contents";

import { SiteContents } from "./SiteContents";

/** Deterministic stand-ins for the four repository reads `/inhoud` runs. */
const GROUPS: ContentsGroup[] = [
  {
    id: "ploegen",
    title: "Ploegen",
    entries: [
      ["A-ploeg", "2e Provinciale B", "eerste-elftallen-a"],
      ["B-ploeg", "4e Provinciale C", "eerste-elftallen-b"],
      ["Reserven", null, "reserven"],
      ["U7", null, "kcvve-u7"],
      ["U9", null, "kcvve-u9"],
      ["U11", null, "kcvve-u11"],
      ["U13", null, "kcvve-u13"],
      ["U15", null, "kcvve-u15"],
      ["U17", null, "kcvve-u17"],
      ["U21", null, "kcvve-u21"],
    ].map(([label, value, slug]) => ({
      id: `team-${slug}`,
      label: label as string,
      value: value as string | null,
      href: `/ploegen/${slug}`,
    })),
  },
  {
    id: "nieuws",
    title: "Nieuws",
    entries: [
      ["KCVV pakt de drie punten op de Dries", "12·04·26"],
      ["Transfernieuws: drie nieuwe namen", "08·04·26"],
      ["Interview met de nieuwe jeugdcoördinator", "02·04·26"],
      ["Mosselfestijn 2026 — schrijf je in", "28·03·26"],
      ["Terreinwerken afgerond", "21·03·26"],
      ["Verslag: een punt tegen Muizen", "15·03·26"],
      ["Nieuwe hoofdsponsor voor 2026", "09·03·26"],
      ["Jeugdtornooi: de kalender", "01·03·26"],
    ].map(([label, value], index) => ({
      id: `article-${index}`,
      label: label as string,
      value: value as string,
      href: `/nieuws/artikel-${index}`,
    })),
  },
  {
    id: "evenementen",
    title: "Evenementen",
    entries: [
      ["Mosselfestijn 2026", "04·09·26"],
      ["Kampioenenviering", "14·06·26"],
      ["Jeugdtornooi", "23·05·26"],
      ["Quiznight", "18·04·26"],
    ].map(([label, value], index) => ({
      id: `event-${index}`,
      label: label as string,
      value: value as string,
      href: `/evenementen/evenement-${index}`,
    })),
  },
  {
    id: "clubpaginas",
    title: "Clubpagina's",
    entries: [
      ["Cashless Clubkaart", "07·02·26", "cashless"],
      ["Digitale documenten - downloads", "19·01·26", "downloads"],
      ["Praktische Informatie", "03·12·25", "praktische-informatie"],
      ["Word vrijwilliger", null, "vrijwilliger"],
    ].map(([label, value, slug]) => ({
      id: `page-${slug}`,
      label: label as string,
      value: value as string | null,
      href: `/club/${slug}`,
    })),
  },
];

const meta = {
  title: "Features/Club/SiteContents",
  component: SiteContents,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The `/inhoud` contents page body (#2622, decision D8 · D11/S5). Four derived groups — ploegen with their reeks, nieuws and evenementen with their dates, the editorial clubpagina's with when they last changed — each a display-serif heading with its count over a 2px rule, entries flowing 1 → 2 → 3 columns as leader-dot rows. A row whose value is absent shows an em dash rather than dropping the pair; the dot filler is `aria-hidden` throughout. No spelers: that index was rejected on privacy grounds and 0 of 294 player documents carry a slug.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { groups: GROUPS },
};

export const Default: Story = {
  args: { groups: GROUPS },
};

/** One group only — the page holds whatever the repositories returned. */
export const SingleGroup: Story = {
  args: { groups: [GROUPS[0]!] },
};

/** Empty repositories, empty page: nothing is authored, so nothing renders. */
export const Empty: Story = {
  args: { groups: [] },
};
