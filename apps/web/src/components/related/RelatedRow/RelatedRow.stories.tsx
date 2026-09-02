import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fixtureImage } from "@test-fixtures/images";
import { RelatedRow } from "./RelatedRow";
import type { RelatedRowItem } from "@/components/related/types";

const meta = {
  title: "Features/Related/RelatedRow",
  component: RelatedRow,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "One slot, last on the page, holding one mixed cross-type list (#2443/#2581). Renamed + moved from `<VerderLezenRow>` — same slider mechanics (horizontal scroller of `<NewsCard>` at `--container-wide` width), new scope: articles, pages, players, teams, staff, events, and galleries all render through the same card, ordered by relevance tier rather than type (`mergeRelatedRow`). 'Blijf nog even hangen.' replaces 'Verder lezen.' as the default heading because 'read on' is false for a photo set, a fixture, or a profile card.",
      },
    },
  },
} satisfies Meta<typeof RelatedRow>;

export default meta;
type Story = StoryObj<typeof meta>;

// Deterministic local fixtures per `feedback_design_data_audit` and the
// fixture pool's own warning ("remote placeholder services produce
// non-deterministic VR baselines"). Pool indices are 0-fixed so VR
// snapshots stay byte-stable across runs.

const INTERVIEW: RelatedRowItem = {
  title: "Wim Govaerts over de wakker-mentaliteit",
  href: "/nieuws/wim-govaerts-interview",
  imageUrl: fixtureImage("article-hero-interview", 0),
  badge: "INTERVIEW",
  date: "23 mei 2026",
  articleType: "interview",
};

const TRANSFER: RelatedRowItem = {
  title: "Maxim Breugelmans versterkt Elewijt",
  href: "/nieuws/maxim-breugelmans-transfer",
  imageUrl: fixtureImage("article-hero-transfer", 0),
  badge: "TRANSFER",
  date: "18 mei 2026",
  articleType: "transfer",
};

const ANNOUNCEMENT: RelatedRowItem = {
  title: "Algemene vergadering op 12 juni",
  href: "/nieuws/algemene-vergadering-juni",
  imageUrl: fixtureImage("article-hero-generic", 0),
  badge: "MEDEDELING",
  date: "15 mei 2026",
  articleType: "announcement",
};

const EVENT: RelatedRowItem = {
  title: "Lentetornooi U13",
  href: "/nieuws/lentetornooi-u13",
  imageUrl: fixtureImage("article-hero-evenement", 0),
  badge: "EVENEMENT",
  date: "10 mei 2026",
  articleType: "event",
};

const PLAYER: RelatedRowItem = {
  title: "Joren De Smet",
  href: "/spelers/1234",
  imageUrl: fixtureImage("player-portrait-square", 0),
  badge: "SPELER",
};

const TEAM: RelatedRowItem = {
  title: "KCVV Elewijt B",
  href: "/ploegen/kcvv-b",
  imageUrl: fixtureImage("team-group", 0),
  badge: "PLOEG",
};

const GALLERY: RelatedRowItem = {
  title: "Beelden van de derby",
  href: "/galerij/derby-beelden",
  imageUrl: fixtureImage("event-cover", 1),
  badge: "BEELDEN",
};

const MATCH_CTA: RelatedRowItem = {
  title: "Bekijk de wedstrijd",
  href: "/wedstrijd/123456",
  badge: "WEDSTRIJD",
};

// Canonical 3-card layout — the first three slots are visible at desktop
// width; no scroll arrows render because there's no overflow. Mixed
// articleTypes confirm the R3 per-card background lookup: transfer card
// renders on jersey-deep, the rest on cream.
export const ThreeCards: Story = {
  args: {
    items: [INTERVIEW, TRANSFER, ANNOUNCEMENT],
  },
};

// The one-destination case (#2443 rule 3, "cardinality is not a treatment")
// — a single related item renders through the exact same slider/card
// primitive as a full row, never a bespoke hero-style or button treatment.
export const OneCard: Story = {
  args: {
    items: [INTERVIEW],
  },
  parameters: {
    docs: {
      description: {
        story:
          "One destination is a one-card row, not a different component (#2443 rule 3). This is the same `<NewsCard>` in the same `<HorizontalSlider>` as every other card count.",
      },
    },
  },
};

// The auto-hide / zero case (#2443 rule 7) — the row returns `null` rather
// than an EmptyState Tier-2 dashed box. See the component docblock for why
// this row is the documented exception.
export const Empty: Story = {
  args: {
    items: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Auto-hides at zero (#2443 rule 7) — an explicit exception to `<EmptyState>` Tier 2. This row promises nothing, so a page with nothing to offer ends after its last real section rather than holding an empty box open. Storybook renders an empty canvas; that is the expected behaviour.",
      },
    },
  },
};

// Every target type in one merged, ordered list — the full 7-member
// RelatedContentItem union (article / page / player / team / staff / event /
// gallery) plus the one page-built synthetic match card, mixed by relevance
// rather than grouped by type.
export const MixedCrossTypeList: Story = {
  args: {
    items: [TEAM, PLAYER, GALLERY, EVENT, MATCH_CTA, TRANSFER, ANNOUNCEMENT],
  },
  parameters: {
    docs: {
      description: {
        story:
          "One mixed, cross-type list (#2443 rule 2) — team, player, gallery, event, match and article cards side by side, ordered by relevance tier (`mergeRelatedRow`) rather than grouped by kind.",
      },
    },
  },
};

// Slider overflow with 7 mixed items — exercises the canonical case where
// the merge's 8-item cap leaves the row still past the 3-visible viewport.
export const SliderOverflow: Story = {
  args: {
    items: [INTERVIEW, TRANSFER, ANNOUNCEMENT, EVENT, PLAYER, TEAM, GALLERY],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Seven mixed items at the merge's 8-item cap ceiling. The slider's right arrow is visible; drag / arrow / scroll reveals the cards past the viewport edge.",
      },
    },
  },
};

// Transfer-only row — confirms the jersey-deep card background renders
// cleanly when every card is the same articleType (no mixed contrast
// against the cream section surface).
export const AllTransfer: Story = {
  args: {
    items: [
      TRANSFER,
      {
        ...TRANSFER,
        title: "Niels verlengt voor twee seizoenen",
        href: "/nieuws/niels-verlenging",
        badge: "VERLENGD",
        imageUrl: fixtureImage("article-hero-transfer", 1),
      },
      {
        ...TRANSFER,
        title: "Joris vertrekt naar Diest",
        href: "/nieuws/joris-uitgaand",
        badge: "UITGAAND",
        imageUrl: fixtureImage("article-hero-transfer", 2),
      },
    ],
  },
};

// The imageless-card artefact path (#2574) — a team card with no photo shows
// its own subject artefact (a jersey shirt) instead of the generic hatch.
export const ImagelessArtefact: Story = {
  args: {
    items: [
      {
        title: "U15",
        href: "/ploegen/u15",
        badge: "PLOEG",
        artefact: { kind: "team", ageLabel: "U15" },
      },
      PLAYER,
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "A card without a photo shows its own subject's artefact (#2574) rather than the generic hatch — here a team card falls back to a `<JerseyShirt>`.",
      },
    },
  },
};
