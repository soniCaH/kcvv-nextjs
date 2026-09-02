import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { JerseyIllustration } from "./JerseyIllustration";

const meta = {
  title: "UI/JerseyIllustration",
  component: JerseyIllustration,
  tags: ["autodocs", "vr"],
  parameters: { layout: "padded" },
  decorators: [
    // The illustration fills its parent (hero: h-full/w-full, card: inset-0),
    // so frame it in a sized, relative 3:4 box mirroring both consumers.
    (Story) => (
      <div className="border-paper-edge relative aspect-[3/4] w-[260px] overflow-hidden border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JerseyIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Hero variant — the `/spelers/[slug]` no-photo fallback. `relative h-full
 * w-full` inside the polaroid frame. `seed` (a stable per-player identity —
 * see `playerFigureSeed`, never a display name) draws this figure's
 * per-player variant (#2635).
 */
export const Hero: Story = {
  args: { variant: "hero", seed: "a1b2c3d4" },
};

/**
 * Card variant — the squad-grid `<PlayerCard>` no-photo fallback. `absolute
 * inset-0` inside the bordered 3:4 figure.
 */
export const Card: Story = {
  args: { variant: "card", seed: "e5f6a7b8" },
};

/**
 * `garment="coat"` at hero scale (#2485) — the staff-document figure. Same
 * head, torso and shoulder bumps as `Hero`; only the garment-front lines
 * (lapels, placket, notch ticks) and the two-pass palette (inverted: ink
 * underprint, jersey-deep overprint) change.
 *
 * Wired to production since #2789 — `<StaffHero>` (`/staf/[slug]`) renders
 * exactly this shape: `<JerseyIllustration variant="hero" garment="coat">`.
 * This story is a different render, not a duplicate of that one: it fixes
 * seed `"a1b2c3d4"` in the isolated hero frame, while `<StaffHero>` seeds
 * from the real staff member's id inside its own 320px `<TapedFigure>` —
 * different seed means a different pattern/sleeve/flip/scale, and a
 * different surrounding box. See `tags` below for why this story still
 * doesn't carry its own VR baseline.
 */
export const CoatHero: Story = {
  args: { variant: "hero", seed: "a1b2c3d4", garment: "coat" },
  // `!vr` negates the meta-level "vr" tag — this isolated design-system
  // exploration isn't the render #2789's AC asks to baseline; the
  // production instance is covered by `Features/Staff/StaffHero`'s own
  // `IllustrationFallback` story, which seeds from that page's real data
  // and renders in its real context. `CoatCard` below is the one
  // `getCardSubjectArtefact` actually draws from and keeps its own
  // baseline.
  tags: ["!vr"],
};

/**
 * `garment="coat"` at card scale (#2485 / #2574) — the imageless-card
 * artefact a staff-document subject resolves to via
 * `@/lib/utils/card-subject-artefact`.
 */
export const CoatCard: Story = {
  args: { variant: "card", seed: "e5f6a7b8", garment: "coat" },
};
