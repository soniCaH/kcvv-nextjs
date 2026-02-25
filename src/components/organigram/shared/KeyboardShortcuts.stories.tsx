import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

const meta = {
  title: "Features/Organigram/KeyboardShortcuts",
  component: KeyboardShortcuts,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Keyboard shortcut legend for the organigram. Shown in a modal or sidebar to help power users navigate without a mouse.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KeyboardShortcuts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
