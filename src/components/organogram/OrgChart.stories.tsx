import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrgChart } from "./OrgChart";
import type { OrgChartNode } from "@/types/organogram";

const meta: Meta<typeof OrgChart> = {
  title: "Organogram/Archive/OrgChart (Legacy)",
  component: OrgChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onNodeClick: { action: "nodeClicked" },
  },
};

export default meta;
type Story = StoryObj<typeof OrgChart>;

// Mock Data Generators
const createNode = (
  id: string,
  parentId: string | null,
  name: string,
  title: string,
  department: "hoofdbestuur" | "jeugdbestuur" | "general" = "general",
): OrgChartNode => ({
  id,
  parentId,
  name,
  title,
  department,
  positionShort: title.substring(0, 3).toUpperCase(),
  imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
  email: `${name.toLowerCase().replace(" ", ".")}@kcvv.be`,
  phone: "+32 470 00 00 00",
});

// Scenario 1: Simple Hierarchy (Root + 2 Children)
const simpleData: OrgChartNode[] = [
  createNode("1", null, "John Doe", "President", "hoofdbestuur"),
  createNode("2", "1", "Jane Smith", "Vice President", "hoofdbestuur"),
  createNode("3", "1", "Bob Johnson", "Secretary", "hoofdbestuur"),
];

// Scenario 2: Deep Hierarchy
const deepData: OrgChartNode[] = [
  createNode("1", null, "CEO", "Chief Executive Officer"),
  createNode("2", "1", "CTO", "Chief Technology Officer"),
  createNode("3", "2", "VP Engineering", "Vice President Engineering"),
  createNode("4", "3", "Director", "Director of Engineering"),
  createNode("5", "4", "Manager", "Engineering Manager"),
  createNode("6", "5", "Lead", "Tech Lead"),
  createNode("7", "6", "Senior", "Senior Developer"),
];

// Scenario 3: Wide Hierarchy
const wideData: OrgChartNode[] = [
  createNode("1", null, "Manager", "Team Manager"),
  ...Array.from({ length: 10 }).map((_, i) =>
    createNode(`2-${i}`, "1", `Employee ${i + 1}`, "Team Member"),
  ),
];

export const Default: Story = {
  args: {
    data: simpleData,
    config: {
      initialZoom: 1,
      expandAll: true,
    },
  },
};

export const DeepHierarchy: Story = {
  args: {
    data: deepData,
    config: {
      initialZoom: 0.8,
      expandAll: true,
    },
  },
};

export const WideHierarchy: Story = {
  args: {
    data: wideData,
    config: {
      initialZoom: 0.6,
      expandAll: true,
    },
  },
};

export const SingleNode: Story = {
  args: {
    data: [createNode("1", null, "Solo", "Lone Wolf")],
    config: {
      initialZoom: 1,
    },
  },
};

export const CollapsedByDefault: Story = {
  args: {
    data: deepData,
    config: {
      initialZoom: 0.8,
      expandToDepth: 2,
    },
  },
};
