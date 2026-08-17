import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./EmptyState";

/**
 * #2427 / #2562 — one primitive, two tiers. State-coverage: tier-1 genuine
 * (the null path — default artefact, no undo), tier-1 filter-empty (with
 * the mandatory undo), and tier-2. `vr`-tagged so both tiers acquire VR
 * baselines per the master-design VR contract.
 *
 * No dedicated "custom artefact" story: every current call site that has
 * its own obvious mark (a crest, a ball) either doesn't exist yet or was
 * migrated without one (`/tegenstander` ships the default jersey) — a
 * story with nothing exercising it would ship three VR baselines nobody
 * reads (#2562 review round 3, D5). Pass `artefact` at the call site that
 * earns one; `EmptyState.test.tsx` covers the slot mechanically.
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
 * yet, no custom artefact, no undo. "Nog geen" because sponsors can still
 * arrive.
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
 * been. `reason: "filtered"` makes `undo` a compile-time requirement, not a
 * convention.
 */
export const SurfaceFilterEmpty: Story = {
  name: "Tier 1 — filter-empty (with undo)",
  args: {
    tier: "surface",
    heading: "Geen artikelen in Jeugd",
    reason: "filtered",
    undo: { label: "Toon alles", onClick: fn() },
    children: "Er zijn geen artikelen in deze categorie.",
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
