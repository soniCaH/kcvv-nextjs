import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { LoadMoreFooter } from "./LoadMoreFooter";

const meta = {
  title: "UI/LoadMoreFooter",
  component: LoadMoreFooter,
  // Phase 2 of the VR rollout covers every UI/* story file (testing-ops.md
  // → "Opt-in via the vr tag"); this one was missing the tag, which is why
  // it has never been captured. Adding it here so #2650's scarf → dots
  // change to the Loading story gets a real baseline instead of shipping
  // uncompared.
  tags: ["autodocs", "vr"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The tail of a paginated listing — exactly one of three things shows at a time: a failed-batch message with a retry, the in-flight spinner, or the load-more button. `/nieuws` and `/galerij` are the two listings on the shared 24 + 12 contract (#2569), and they render this rather than each keeping a hand-copied footer.",
      },
    },
  },
  args: {
    label: "Meer nieuws laden",
    hasMore: true,
    isLoading: false,
    onLoadMore: fn().mockName("onLoadMore"),
  },
} satisfies Meta<typeof LoadMoreFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** More to fetch, nothing in flight — the button is the whole footer. */
export const Actionable: Story = {};

/** A batch is in flight; the button is replaced, not disabled. */
export const Loading: Story = {
  args: { isLoading: true },
};

/**
 * The batch failed. The message and its retry take over — the button does not
 * also show, so there is only ever one thing to click.
 */
export const Error: Story = {
  args: { error: "Artikelen laden mislukt." },
};

/** An error outranks an in-flight state, so a retry is always reachable. */
export const ErrorWhileLoading: Story = {
  args: { error: "Artikelen laden mislukt.", isLoading: true },
};

/** Nothing left to fetch — the footer renders nothing at all. */
export const Exhausted: Story = {
  args: { hasMore: false },
};

/** `/galerij` passes its own label; everything else is shared. */
export const GalleryLabel: Story = {
  args: { label: "Meer foto's laden" },
};
