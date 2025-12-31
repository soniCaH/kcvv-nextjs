import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { TabbedGrid } from "./TabbedGrid";
import type { TabbedGridProps } from "./TabbedGrid";
import type { OrgChartNode } from "@/types/organogram";
import { clubStructure } from "@/data/club-structure";

const meta: Meta<typeof TabbedGrid> = {
  title: "Organogram/Prototypes/Option B - Tabbed Grid",
  component: TabbedGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**Option B: Tabbed Grid** - Department tabs with responsive grid layout

**Pattern:** Department filtering + Responsive card grid

**Strengths:**
- ✅ Clean department separation
- ✅ Scannable grid layout
- ✅ Quick filtering and search
- ✅ Mobile-friendly responsive design
- ✅ Easy to browse by department

**Weaknesses:**
- ❌ Flatter hierarchy (2 levels max)
- ❌ Loses reporting relationships
- ❌ No visual connection between roles

**Best for:** Users browsing by department or role type

**Responsive Grid:**
- Mobile (< 640px): 1 column
- Tablet (640-1024px): 2 columns
- Desktop (1024px+): 3-4 columns

**Features:**
- 🔍 Fuzzy search across all fields
- 📊 Department filtering with counts
- 🎯 Autocomplete suggestions
- ⌨️ Keyboard navigation
- 📱 Touch-friendly grid
- 🔗 Click to open details
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    initialDepartment: {
      control: "select",
      options: ["all", "hoofdbestuur", "jeugdbestuur"],
      description: "Initial active department",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabbedGrid>;

// ==================== CONTROLLED COMPONENT WRAPPER ====================

const TabbedGridWithState = (args: Partial<TabbedGridProps>) => {
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    null,
  );

  return (
    <div>
      <TabbedGrid
        members={args.members || []}
        isLoading={args.isLoading ?? false}
        initialDepartment={args.initialDepartment || "all"}
        className={args.className}
        onMemberClick={(member) => {
          setSelectedMember(member);
          args.onMemberClick?.(member);
          alert(`Clicked: ${member.name} - ${member.title}`);
        }}
      />

      {/* Selected Member Info (for demo) */}
      {selectedMember && (
        <div className="mt-6 p-4 bg-green-main/10 rounded-lg border-2 border-green-main">
          <p className="text-sm font-semibold text-gray-blue mb-1">
            Last Selected:
          </p>
          <p className="text-sm text-gray-dark">
            {selectedMember.name} - {selectedMember.title}
          </p>
        </div>
      )}
    </div>
  );
};

// ==================== DEFAULT STORIES ====================

export const Default: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default view showing all 45 members with department filtering and search",
      },
    },
  },
};

export const AllDepartments: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
    initialDepartment: "all",
  },
  parameters: {
    docs: {
      description: {
        story: "All departments view (default)",
      },
    },
  },
};

// ==================== DEPARTMENT FILTERING ====================

export const HoofdbestuurOnly: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
    initialDepartment: "hoofdbestuur",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Filtered to show only Hoofdbestuur members (includes general department)",
      },
    },
  },
};

export const JeugdbestuurOnly: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
    initialDepartment: "jeugdbestuur",
  },
  parameters: {
    docs: {
      description: {
        story: "Filtered to show only Jeugdbestuur members",
      },
    },
  },
};

// ==================== RESPONSIVE VIEWPORTS ====================

export const Mobile: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile view (< 640px): Single column grid",
      },
    },
  },
};

export const Tablet: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Tablet view (640-1024px): 2 column grid",
      },
    },
  },
};

export const Desktop: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story: "Desktop view (1024px+): 3-4 column grid",
      },
    },
  },
};

// ==================== LOADING & EMPTY STATES ====================

export const Loading: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Loading state with skeleton cards",
      },
    },
  },
};

export const EmptyState: Story = {
  render: TabbedGridWithState,
  args: {
    members: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no members exist",
      },
    },
  },
};

export const EmptyDepartment: Story = {
  render: () => {
    // Create a dataset with only hoofdbestuur members
    const hoofdbestuurOnly = clubStructure.filter(
      (m) => m.department === "hoofdbestuur" || m.department === "general",
    );

    return (
      <TabbedGrid
        members={hoofdbestuurOnly}
        initialDepartment="jeugdbestuur"
        onMemberClick={(member) =>
          alert(`Clicked: ${member.name} - ${member.title}`)
        }
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Empty state when filtering to a department with no members (Jeugdbestuur tab with only Hoofdbestuur data)",
      },
    },
  },
};

// ==================== SEARCH SCENARIOS ====================

export const WithSearchQuery: Story = {
  render: () => {
    return (
      <div>
        <p className="text-sm text-gray-medium mb-4">
          Try searching for &quot;trainer&quot;, &quot;jeugd&quot;, or a
          specific name to see search results
        </p>
        <TabbedGrid
          members={clubStructure}
          onMemberClick={(member) =>
            alert(`Clicked: ${member.name} - ${member.title}`)
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example showing search functionality (try typing "trainer", "jeugd", or a name)',
      },
    },
  },
};

// ==================== LARGE DATASET ====================

export const LargeDataset: Story = {
  render: () => {
    // Generate a large dataset (100 members)
    const largeDataset: OrgChartNode[] = [
      ...clubStructure,
      ...Array.from({ length: 55 }, (_, i) => ({
        id: `extra-member-${i}`,
        name: `Extra Member ${i + 1}`,
        title: `Position ${i + 1}`,
        positionShort: `POS${i}`,
        email: `member${i}@kcvvelewijt.be`,
        department:
          i % 2 === 0 ? ("hoofdbestuur" as const) : ("jeugdbestuur" as const),
        parentId: null,
      })),
    ];

    return (
      <div>
        <p className="text-sm text-gray-medium mb-4">
          Dataset expanded to 100 members to test performance and scrolling
        </p>
        <TabbedGrid
          members={largeDataset}
          onMemberClick={(member) =>
            alert(`Clicked: ${member.name} - ${member.title}`)
          }
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large dataset (100 members) to test grid performance and scrolling behavior",
      },
    },
  },
};

// ==================== INTERACTION EXAMPLES ====================

export const InteractionExample: Story = {
  render: () => {
    const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
      null,
    );
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    return (
      <div className="space-y-6">
        <TabbedGrid
          members={clubStructure}
          onMemberClick={(member) => {
            setSelectedMember(member);
            setSearchHistory((prev) => [
              ...prev,
              `${member.name} - ${member.title}`,
            ]);
          }}
        />

        {/* Interaction History */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-blue mb-2">
            Interaction History
          </h3>

          {selectedMember ? (
            <div className="space-y-2">
              <div className="p-3 bg-white rounded border-2 border-green-main">
                <p className="text-sm font-semibold text-gray-blue">
                  Currently Selected:
                </p>
                <p className="text-sm text-gray-dark">
                  {selectedMember.name} - {selectedMember.title}
                </p>
                {selectedMember.email && (
                  <p className="text-xs text-gray-medium mt-1">
                    {selectedMember.email}
                  </p>
                )}
              </div>

              {searchHistory.length > 1 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-gray-medium mb-1">
                    Previous selections:
                  </p>
                  <ul className="text-xs text-gray-dark space-y-0.5">
                    {searchHistory.slice(0, -1).map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-medium">
              Click on a member card to see details
            </p>
          )}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive example showing click handling and selection history",
      },
    },
  },
};

// ==================== ACCESSIBILITY ====================

export const AccessibilityTest: Story = {
  render: TabbedGridWithState,
  args: {
    members: clubStructure,
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
          { id: "aria-valid-attr-value", enabled: true },
          { id: "list", enabled: true },
        ],
      },
    },
    docs: {
      description: {
        story:
          "Accessibility testing story with keyboard navigation and screen reader support",
      },
    },
  },
};

// ==================== COMPARISON VIEWS ====================

export const CompareAllDepartments: Story = {
  render: () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-blue mb-4">
            Alle Leden
          </h3>
          <TabbedGrid
            members={clubStructure}
            initialDepartment="all"
            onMemberClick={(member) =>
              alert(`Clicked: ${member.name} - ${member.title}`)
            }
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-blue mb-4">
            Hoofdbestuur
          </h3>
          <TabbedGrid
            members={clubStructure}
            initialDepartment="hoofdbestuur"
            onMemberClick={(member) =>
              alert(`Clicked: ${member.name} - ${member.title}`)
            }
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-blue mb-4">
            Jeugdbestuur
          </h3>
          <TabbedGrid
            members={clubStructure}
            initialDepartment="jeugdbestuur"
            onMemberClick={(member) =>
              alert(`Clicked: ${member.name} - ${member.title}`)
            }
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Side-by-side comparison of all three department views",
      },
    },
  },
};

// ==================== EDGE CASES ====================

export const SingleMember: Story = {
  render: TabbedGridWithState,
  args: {
    members: [clubStructure[0]],
  },
  parameters: {
    docs: {
      description: {
        story: "Edge case: Only one member in the dataset",
      },
    },
  },
};

export const ManyDepartments: Story = {
  render: () => {
    // Add extra department variety
    const extendedData: OrgChartNode[] = clubStructure.map((member) => ({
      ...member,
      department:
        Math.random() > 0.5 ? member.department : ("general" as const),
    }));

    return (
      <TabbedGrid
        members={extendedData}
        onMemberClick={(member) =>
          alert(`Clicked: ${member.name} - ${member.title}`)
        }
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Edge case: Mixed departments with more general members",
      },
    },
  },
};
