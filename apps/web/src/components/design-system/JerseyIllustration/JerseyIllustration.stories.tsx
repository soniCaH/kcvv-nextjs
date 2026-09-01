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
 * `garment="coat"` (#2485) — the staff-document figure. Same head, torso
 * and shoulder bumps as `Hero`; only the garment-front lines (lapels,
 * placket, notch ticks) and the two-pass palette (inverted: ink underprint,
 * jersey-deep overprint) change. Hero variant — `/staf/[slug]`'s no-photo
 * fallback.
 */
export const CoatHero: Story = {
  args: { variant: "hero", seed: "a1b2c3d4", garment: "coat" },
};

/**
 * `garment="coat"` at card scale (#2485 / #2574) — the imageless-card
 * artefact a staff-document subject resolves to via
 * `@/lib/utils/card-subject-artefact`.
 */
export const CoatCard: Story = {
  args: { variant: "card", seed: "e5f6a7b8", garment: "coat" },
};
