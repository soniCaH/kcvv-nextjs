import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HierarchyLevel } from "./HierarchyLevel";
import { clubStructure } from "@/data/club-structure";

// Root + first level nodes
const topLevel = clubStructure.filter(
  (n) => n.parentId === null || n.parentId === "club",
);

const meta: Meta<typeof HierarchyLevel> = {
  title: "Features/Organigram/HierarchyLevel",
  component: HierarchyLevel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    onToggle: { action: "toggled" },
    onMemberClick: { action: "member-clicked" },
  },
};

export default meta;
// expandedIds is Set<string> at runtime but Sets aren't JSON-serialisable.
// Stories pass arrays in args; each render wrapper converts them to Set.
type Story = StoryObj<typeof HierarchyLevel>;

/** Top-level nodes at depth 0, all collapsed. */
export const Default: Story = {
  args: {
    members: topLevel,
    allMembers: clubStructure,
    depth: 0,
    expandedIds: [] as unknown as Set<string>,
  },
  render: (args) => (
    <HierarchyLevel
      {...args}
      expandedIds={new Set((args.expandedIds as unknown as string[]) ?? [])}
    />
  ),
};

/** All nodes expanded (uses full clubStructure). */
export const AllExpanded: Story = {
  args: {
    members: topLevel,
    allMembers: clubStructure,
    depth: 0,
    expandedIds: clubStructure.map((n) => n.id) as unknown as Set<string>,
  },
  render: (args) => (
    <HierarchyLevel
      {...args}
      expandedIds={new Set((args.expandedIds as unknown as string[]) ?? [])}
    />
  ),
};

/** Single node at depth 2. */
export const SingleNode: Story = {
  args: {
    members: clubStructure.filter((n) => n.id === "president"),
    allMembers: clubStructure,
    depth: 2,
    expandedIds: [] as unknown as Set<string>,
  },
  render: (args) => (
    <HierarchyLevel
      {...args}
      expandedIds={new Set((args.expandedIds as unknown as string[]) ?? [])}
    />
  ),
};
