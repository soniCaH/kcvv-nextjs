import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileBottomNav } from "./MobileBottomNav";
import { Network, LayoutGrid, Search, Users } from "@/lib/icons";

const tabs = [
  { value: "chart", label: "Organogram", icon: Network },
  { value: "cards", label: "Kaarten", icon: LayoutGrid },
  { value: "search", label: "Zoeken", icon: Search },
  { value: "members", label: "Leden", icon: Users },
];

const meta: Meta<typeof MobileBottomNav> = {
  title: "Features/Organigram/MobileBottomNav",
  component: MobileBottomNav,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "tab-changed" },
  },
};

export default meta;
type Story = StoryObj<typeof MobileBottomNav>;

export const ChartActive: Story = {
  args: { tabs, activeTab: "chart" },
};

export const SearchActive: Story = {
  args: { tabs, activeTab: "search" },
};

/** Tabs without icons — labels only. */
export const WithoutIcons: Story = {
  args: {
    tabs: tabs.map(({ value, label }) => ({ value, label })),
    activeTab: "cards",
  },
};
