import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionWipeReveal } from "./SectionWipeReveal";
import { TapedCard } from "../TapedCard";

const demoContent = (
  <TapedCard padding="lg" shadow="md">
    <h4 className="font-display text-display-sm mb-2 font-bold">
      Negentien ploegen, van U6 tot U21
    </h4>
    <p className="text-body-md">
      Elke zaterdag staan er meer dan tweehonderd kinderen op de Dries.
    </p>
  </TapedCard>
);

const meta = {
  title: "UI/SectionWipeReveal",
  component: SectionWipeReveal,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "M4 — the squeegee wipe (#2623, decision-sheet §8 D16). Ink pulled across paper on section entry via a clip-path sweep, timed by the Arrival token (500ms, var(--ease-out)). Storybook renders every story already inside the canvas viewport at mount, so both stories below capture the component's settled/no-animation state — the same state a real page reaches once the gesture has played, or never needed to play at all.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cream max-w-xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionWipeReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The settled state — the state every capture (and every already-in-view
 * section) lands in: fully visible, unclipped. A section mounted inside the
 * viewport never gets an observer, so it can never animate in after the
 * fact (#2623 AC).
 */
export const Settled: Story = {
  args: { children: demoContent },
};

/**
 * `prefers-reduced-motion: reduce` — the gesture is absent, not shortened.
 * Pixel-identical to `Settled` by design: under reduced motion this
 * component never arms an observer and never adds the class that triggers
 * the wipe, so content renders exactly where it would otherwise be.
 */
export const ReducedMotion: Story = {
  args: { children: demoContent },
  decorators: [
    (Story) => {
      if (typeof window !== "undefined") {
        const original = window.matchMedia.bind(window);
        window.matchMedia = (query: string) => {
          const result = original(query);
          if (query.includes("prefers-reduced-motion")) {
            return { ...result, matches: true };
          }
          return result;
        };
      }
      return <Story />;
    },
  ],
};
