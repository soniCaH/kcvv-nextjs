import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UnifiedSearchBar } from "./UnifiedSearchBar";
import { clubStructure } from "@/data/club-structure";
import type { ResponsibilityPath } from "@/types/responsibility";

const mockPaths: ResponsibilityPath[] = [
  {
    id: "rp-1",
    role: ["speler"],
    question: "Wie contacteer ik bij een blessure?",
    keywords: ["blessure", "medisch", "dokter"],
    summary: "Contacteer de medische verantwoordelijke.",
    steps: [
      {
        order: 1,
        description: "Meld de blessure aan je trainer.",
      },
    ],
    primaryContact: {
      role: "Medische verantwoordelijke",
      email: "medisch@kcvvelewijt.be",
      department: "hoofdbestuur",
    },
    category: "medisch",
  },
];

const meta: Meta<typeof UnifiedSearchBar> = {
  title: "Features/Organigram/UnifiedSearchBar",
  component: UnifiedSearchBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    onSelectMember: { action: "member-selected" },
    onSelectResponsibility: { action: "responsibility-selected" },
  },
};

export default meta;
type Story = StoryObj<typeof UnifiedSearchBar>;

/** Empty search bar, autocomplete enabled. */
export const Default: Story = {
  args: {
    value: "",
    members: clubStructure,
    responsibilityPaths: mockPaths,
    showAutocomplete: true,
  },
};

/** With a pre-filled search term. */
export const WithValue: Story = {
  args: {
    value: "voorzitter",
    members: clubStructure,
    responsibilityPaths: mockPaths,
    showAutocomplete: true,
  },
};

/** Custom placeholder. */
export const CustomPlaceholder: Story = {
  args: {
    value: "",
    members: clubStructure,
    responsibilityPaths: mockPaths,
    placeholder: "Zoek een persoon of verantwoordelijkheid...",
    showAutocomplete: true,
  },
};

/** Autocomplete disabled. */
export const NoAutocomplete: Story = {
  args: {
    value: "",
    members: clubStructure,
    responsibilityPaths: [],
    showAutocomplete: false,
  },
};
