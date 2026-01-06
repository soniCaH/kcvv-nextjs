import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CardHierarchy } from "../card-hierarchy/CardHierarchy";
import { EnhancedOrgChart } from "../chart/EnhancedOrgChart";
import type { OrgChartNode } from "@/types/organogram";
import { clubStructure } from "@/data/club-structure";

const meta: Meta = {
  title: "Organogram/Prototypes/Comparison",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Organogram UX Redesign - Final Prototypes Comparison

Compare the 2 final prototype implementations side-by-side.

**Note:** Option B (Tabbed Grid) has been eliminated from consideration.

## The 2 Finalists

### Option A: Card Hierarchy
**Pattern:** Expandable/collapsible cards with visual hierarchy
- ✅ Best mobile UX
- ✅ Progressive disclosure
- ✅ Fast contact lookup + hierarchy exploration
- ✅ Touch-friendly
- ✅ Shows reporting relationships
- ⚠️ Harder to see "big picture" at once

### Option C: Enhanced d3
**Pattern:** Enhanced d3-org-chart with mobile improvements
- ✅ Best "big picture" view
- ✅ Professional org chart
- ✅ Shows reporting relationships
- ✅ Impressive presentation
- ⚠️ More complex on mobile
- ⚠️ Not optimized for quick lookup

## User Testing Tasks

1. **Find Email:** Find Youth Coordinator's email address
2. **Reporting:** See who U10 Trainer reports to
3. **Browse:** Browse Jeugdbestuur structure
4. **Quick Contact:** Call the Treasurer
5. **Overview:** Understand overall club structure
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// ==================== SIDE-BY-SIDE COMPARISON ====================

export const SideBySide: Story = {
  render: () => {
    const [selectedMemberA, setSelectedMemberA] = useState<OrgChartNode | null>(
      null,
    );
    const [selectedMemberC, setSelectedMemberC] = useState<OrgChartNode | null>(
      null,
    );

    return (
      <div className="p-6 space-y-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-2">
            Final Prototypes Comparison
          </h1>
          <p className="text-kcvv-gray mb-6">
            Compare Option A and Option C with the same dataset. Try the tasks
            below to evaluate which works best.
          </p>

          {/* Task Checklist */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-kcvv-gray-blue mb-3">
              User Testing Tasks
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">📧</span>
                <span>
                  <strong>Find Email:</strong> Find the Youth Coordinator&apos;s
                  email address (how many clicks?)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">👥</span>
                <span>
                  <strong>Reporting:</strong> See who the U10 Trainer reports to
                  (is it clear?)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">🔍</span>
                <span>
                  <strong>Browse:</strong> Browse the Jeugdbestuur structure
                  (how easy to navigate?)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">📞</span>
                <span>
                  <strong>Quick Contact:</strong> Call the Treasurer (how many
                  steps?)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">📊</span>
                <span>
                  <strong>Overview:</strong> Understand overall club structure
                  (can you see the big picture?)
                </span>
              </li>
            </ul>
          </div>

          {/* Prototypes Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Option A: Card Hierarchy */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-kcvv-green to-kcvv-green-hover p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Option A: Card Hierarchy
                    </h2>
                    <p className="text-sm opacity-90">
                      Expandable/Collapsible Cards
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Pattern</div>
                    <div className="text-sm font-semibold">
                      Progressive Disclosure
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CardHierarchy
                  members={clubStructure}
                  onMemberClick={setSelectedMemberA}
                  initialExpandedDepth={2}
                />
                {selectedMemberA && (
                  <div className="mt-4 p-3 bg-kcvv-green/10 rounded-lg border border-kcvv-green">
                    <p className="text-xs font-semibold text-kcvv-gray-blue mb-1">
                      Last Selected:
                    </p>
                    <p className="text-sm text-kcvv-gray-dark">
                      {selectedMemberA.name} - {selectedMemberA.title}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Option C: Enhanced d3 */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Option C: Enhanced d3</h2>
                    <p className="text-sm opacity-90">
                      d3-org-chart with Mobile Improvements
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Pattern</div>
                    <div className="text-sm font-semibold">
                      Visual Hierarchy
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <EnhancedOrgChart
                  members={clubStructure}
                  onMemberClick={setSelectedMemberC}
                />
                {selectedMemberC && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-500">
                    <p className="text-xs font-semibold text-kcvv-gray-blue mb-1">
                      Last Selected:
                    </p>
                    <p className="text-sm text-kcvv-gray-dark">
                      {selectedMemberC.name} - {selectedMemberC.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of Option A and Option C. Try completing the user testing tasks with each prototype.",
      },
    },
  },
};

// ==================== MOBILE COMPARISON ====================

export const MobileComparison: Story = {
  render: () => {
    return (
      <div className="p-4 space-y-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-kcvv-gray-blue">
          Mobile Comparison
        </h1>
        <p className="text-sm text-kcvv-gray">
          Option A and Option C in mobile viewport (375px). Evaluate mobile UX
          for each.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-kcvv-green mb-3">
              Option A: Card Hierarchy
            </h2>
            <CardHierarchy members={clubStructure} initialExpandedDepth={1} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-purple-500 mb-3">
              Option C: Enhanced d3
            </h2>
            <EnhancedOrgChart members={clubStructure} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Mobile viewport comparison between the two finalists.",
      },
    },
  },
};
