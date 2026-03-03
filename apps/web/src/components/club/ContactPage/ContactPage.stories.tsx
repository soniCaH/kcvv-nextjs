/**
 * ContactPage Stories
 *
 * Club contact information page with address, map embed, and categorized
 * email contacts. The map is consent-gated — click "Laad kaart" to reveal it.
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactPage } from "./ContactPage";

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Pages/ContactPage",
  component: ContactPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full contact page for /club/contact. Shows club address, a consent-gated Google Maps embed, and a grid of categorized email contacts.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContactPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Default full-page view with all sections.
 */
export const Default: Story = {};

/**
 * Mobile viewport.
 */
export const MobileViewport: Story = {
  globals: { viewport: { value: "kcvvMobile" } },
};
