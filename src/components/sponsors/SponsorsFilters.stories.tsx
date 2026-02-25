import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SponsorsFilters } from "./SponsorsFilters";

const meta = {
  title: "Features/Sponsors/SponsorsFilters",
  component: SponsorsFilters,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onFilterChange: () => {},
    totalCount: 24,
    filteredCount: 24,
  },
} satisfies Meta<typeof SponsorsFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All sponsors visible — no active filters. */
export const Default: Story = {};

/** Filtered results — count differs from total. */
export const WithActiveFilter: Story = {
  args: {
    filteredCount: 8,
  },
};

/** Single result remaining. */
export const SingleResult: Story = {
  args: {
    totalCount: 24,
    filteredCount: 1,
  },
};
