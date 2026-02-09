/**
 * SearchForm Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchForm } from "./SearchForm";

const meta = {
  title: "Search/SearchForm",
  component: SearchForm,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSearch: () => {},
  },
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default empty search form
 */
export const Default: Story = {
  args: {
    initialValue: "",
    isLoading: false,
  },
};

/**
 * With initial value
 */
export const WithInitialValue: Story = {
  args: {
    initialValue: "goalkeeper",
    isLoading: false,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    initialValue: "searching...",
    isLoading: true,
  },
};

/**
 * Custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    initialValue: "",
    placeholder: "Zoek naar spelers...",
    isLoading: false,
  },
};
