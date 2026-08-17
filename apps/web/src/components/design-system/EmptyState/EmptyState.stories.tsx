import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { SoccerBall } from "@/lib/icons.redesign";
import { EmptyState } from "./EmptyState";

/**
 * #2427 / #2562 — one primitive, two tiers. State-coverage: tier-1 genuine
 * (the null path — default artefact, no actions), tier-1 filter-empty (with
 * the mandatory undo), tier-1 with a custom artefact, and tier-2. `vr`-tagged
 * so both tiers acquire VR baselines per the master-design VR contract.
 */
const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs", "vr"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Controls baseline, and tier 1's null path in one: nothing has arrived
 * yet, no custom artefact, no action row. "Nog geen" because sponsors can
 * still arrive.
 */
export const Playground: Story = {
  name: "Tier 1 — genuine (null path)",
  args: {
    tier: "surface",
    heading: "Nog geen sponsors",
    children:
      "We zoeken partners die mee de plezantste compagnie willen dragen — jouw zaak kan de eerste langs de lijn zijn.",
  },
};

/**
 * Tier 1, a filter emptied the surface — names the active facet back to the
 * reader and offers the mandatory undo right where the results would have
 * been.
 */
export const SurfaceFilterEmpty: Story = {
  name: "Tier 1 — filter-empty (with undo)",
  args: {
    tier: "surface",
    heading: "Geen artikelen in Jeugd",
    children: "Er zijn geen artikelen in deze categorie.",
    actions: [{ label: "Toon alles", onClick: fn(), variant: "ghost" }],
  },
};

/**
 * Tier 1 with a custom artefact — a surface with its own obvious mark (here,
 * a ball, for a fixtures surface) can pass one without touching the
 * primitive. Sharp corners and a Phosphor Fill icon, matching the rest of
 * the system's artefact vocabulary — never a rounded box, never an emoji.
 */
export const SurfaceCustomArtefact: Story = {
  name: "Tier 1 — custom artefact",
  args: {
    tier: "surface",
    heading: "Nog geen onderlinge duels gespeeld",
    artefact: (
      <div
        aria-hidden="true"
        className="border-ink bg-cream-soft flex h-28 w-28 items-center justify-center border-2"
      >
        <SoccerBall size={48} />
      </div>
    ),
    children: "Er zijn nog geen wedstrijden geregistreerd tegen deze ploeg.",
  },
};

/**
 * Tier 2 — one slot is empty inside an otherwise full page. A dashed box
 * holding the slot's shape; no heading, no action, ever.
 */
export const Slot: Story = {
  name: "Tier 2 — held-open slot",
  args: {
    tier: "slot",
    children: "Geen opstelling beschikbaar",
  },
};
