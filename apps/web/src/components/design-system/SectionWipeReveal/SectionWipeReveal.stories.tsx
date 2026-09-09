import { useEffect, useRef, type ReactNode } from "react";
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

/**
 * A dense, gap-free 2x2 grid — the same "edge-to-edge, no padding between
 * tiles" shape as `<SponsorTiers>`'s wall. Every tile carries `shadow="sm"`
 * (`shadow-paper-sm`, a 4px offset ink shadow) and no rotation, so the
 * right-column and bottom-row tiles' shadows sit flush against
 * `<SectionWipeReveal>`'s own box edges — exactly where a persistent
 * `clip-path: inset(0 0 0 0)` would slice them off (#2888 review round 1,
 * findings 1 + 5).
 */
const edgeGridContent = (
  <div className="grid grid-cols-2 gap-0">
    <TapedCard shadow="sm" rotation="none" padding="sm">
      <p className="text-body-sm">Linksboven</p>
    </TapedCard>
    <TapedCard shadow="sm" rotation="none" padding="sm">
      <p className="text-body-sm">Rechtsboven — right edge</p>
    </TapedCard>
    <TapedCard shadow="sm" rotation="none" padding="sm">
      <p className="text-body-sm">Linksonder</p>
    </TapedCard>
    <TapedCard shadow="sm" rotation="none" padding="sm">
      <p className="text-body-sm">Rechtsonder — right + bottom edge</p>
    </TapedCard>
  </div>
);

type PatchedMatchMedia = typeof window.matchMedia & {
  __kcvvReducedMotionOriginal?: typeof window.matchMedia;
};

/**
 * Synchronously forces `matches: true` for any `prefers-reduced-motion`
 * query, delegating every other `MediaQueryList` member through a `Proxy`
 * rather than spreading one — `addEventListener`/etc. live on the
 * prototype, so a spread copy carries only `matches`, and any subscriber
 * throws `TypeError: …addEventListener is not a function`. Returns the
 * restore function, or `undefined` if `matchMedia` is already one of ours
 * (a second component instance patching on top of an unrestored one).
 *
 * Called from render, not from inside an effect: `<SectionWipeReveal>`'s
 * own mount-time check has to see the patch, and React fully renders a
 * parent — including any global mutation a parent's render body makes —
 * before it renders that parent's children, while a child's *mount effect*
 * fires before its parent's. An effect here would therefore run too late
 * (#2888 review round 1, finding 2).
 */
function forceReducedMotion(): (() => void) | undefined {
  if (typeof window === "undefined") return undefined;
  const current = window.matchMedia as PatchedMatchMedia;
  if (current.__kcvvReducedMotionOriginal) return undefined;

  const original = window.matchMedia.bind(window);
  const patched: PatchedMatchMedia = (query: string) => {
    const mql = original(query);
    if (!query.includes("prefers-reduced-motion")) return mql;
    return new Proxy(mql, {
      get(target, prop) {
        if (prop === "matches") return true;
        const value = Reflect.get(target, prop, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  };
  patched.__kcvvReducedMotionOriginal = original;
  window.matchMedia = patched;
  return () => {
    window.matchMedia = original;
  };
}

/**
 * Forces `prefers-reduced-motion: reduce` for the wrapped story. The patch
 * runs exactly once per instance (guarded by `stateRef`, not `useState` —
 * see `forceReducedMotion`'s own doc for why it can't live in an effect)
 * and is restored on unmount, so no later story in the same Storybook
 * session inherits reduce=true.
 */
function ForceReducedMotion({ children }: { children: ReactNode }) {
  const stateRef = useRef<{ cleanup?: () => void } | null>(null);
  if (stateRef.current === null) {
    stateRef.current = { cleanup: forceReducedMotion() };
  }

  useEffect(() => {
    return () => stateRef.current?.cleanup?.();
  }, []);

  return <>{children}</>;
}

const meta = {
  title: "UI/SectionWipeReveal",
  component: SectionWipeReveal,
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "M4 — the squeegee wipe (#2623, decision-sheet §8 D16). Ink pulled across paper on section entry via a clip-path sweep, timed by the Arrival token (500ms, var(--ease-out)). Storybook renders every story already inside the canvas viewport at mount, so Settled/ReducedMotion below capture the component's settled/no-animation state — the same state a real page reaches once the gesture has played, or never needed to play at all. SettledAfterRun captures the state after the sweep has actually played, which is the one that catches a persistent-clip regression.",
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
    (Story) => (
      <ForceReducedMotion>
        <Story />
      </ForceReducedMotion>
    ),
  ],
};

/**
 * Statically applies `section-wipe-reveal--run` (bypassing the observer
 * entirely) so the test-runner captures the state *after* the 500ms sweep
 * has actually played, not before it starts — the one baseline that would
 * have caught #2888 review round 1's finding 1. The edge-flush shadow grid
 * is the canary: `animation-fill-mode: both`/`forwards` leaves
 * `clip-path: inset(0 0 0 0)` applied forever and slices the right-column
 * and bottom-row tiles' offset shadows clean off; `backwards` (the fix)
 * reverts to no clip once the sweep completes, so every shadow renders
 * whole. Not flaky: capture happens well after the 500ms animation has
 * settled, at a fixed CSS end-state — never mid-animation.
 */
export const SettledAfterRun: Story = {
  args: {
    children: edgeGridContent,
    className: "section-wipe-reveal--run",
  },
};
