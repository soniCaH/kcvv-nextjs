import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { CardHierarchy } from "../option-a/CardHierarchy";
import { TabbedGrid } from "../option-b/TabbedGrid";
import { EnhancedOrgChart } from "../option-c/EnhancedOrgChart";
import type { OrgChartNode } from "@/types/organogram";
import { clubStructure } from "@/data/club-structure";

const meta: Meta = {
  title: "Organogram/Prototypes/Comparison",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Organogram UX Redesign - Prototype Comparison

Compare all 3 prototype implementations side-by-side to evaluate which best meets user needs.

## The 3 Prototypes

### Option A: Card Hierarchy ⭐⭐⭐⭐ (4.3/5) - BEST BALANCED
**Pattern:** Expandable/collapsible cards with visual hierarchy
- ✅ Best mobile UX
- ✅ Progressive disclosure
- ✅ Fast contact lookup + hierarchy exploration
- ✅ Touch-friendly
- ❌ Harder to see "big picture" at once

### Option B: Tabbed Grid ⭐⭐⭐⭐ (4.0/5) - SIMPLEST
**Pattern:** Department tabs + responsive card grid
- ✅ Clean department separation
- ✅ Scannable grid layout
- ✅ Fastest contact lookup
- ✅ Simplest to understand
- ❌ Loses reporting relationships

### Option C: Enhanced d3 ⭐⭐⭐⭐ (3.8/5) - BEST VISUAL HIERARCHY
**Pattern:** Enhanced d3-org-chart with mobile improvements
- ✅ Best "big picture" view
- ✅ Professional org chart
- ✅ Shows reporting relationships
- ✅ Impressive presentation
- ❌ Complex on mobile
- ❌ Not optimized for quick lookup

## Evaluation Criteria

**Scoring (1-5 scale):**
- Mobile UX (25%)
- Desktop UX (20%)
- Dual Purpose (20%)
- Accessibility (15%)
- Maintainability (10%)
- Performance (10%)

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
    const [selectedMemberB, setSelectedMemberB] = useState<OrgChartNode | null>(
      null,
    );
    const [selectedMemberC, setSelectedMemberC] = useState<OrgChartNode | null>(
      null,
    );

    return (
      <div className="p-6 space-y-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-blue mb-2">
            Organogram Prototype Comparison
          </h1>
          <p className="text-gray-medium mb-6">
            Compare all 3 prototypes with the same dataset. Try the tasks below
            to evaluate which works best.
          </p>

          {/* Task Checklist */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-blue mb-3">
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
              <div className="bg-gradient-to-r from-green-main to-green-hover p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Option A: Card Hierarchy
                    </h2>
                    <p className="text-sm opacity-90">
                      Score: 4.3/5 ⭐⭐⭐⭐ (BEST BALANCED)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Pattern</div>
                    <div className="text-sm font-semibold">
                      Expandable Cards
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
                  <div className="mt-4 p-3 bg-green-main/10 rounded-lg border border-green-main">
                    <p className="text-xs font-semibold text-gray-blue mb-1">
                      Last Selected:
                    </p>
                    <p className="text-sm text-gray-dark">
                      {selectedMemberA.name} - {selectedMemberA.title}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Option B: Tabbed Grid */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Option B: Tabbed Grid</h2>
                    <p className="text-sm opacity-90">
                      Score: 4.0/5 ⭐⭐⭐⭐ (SIMPLEST)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Pattern</div>
                    <div className="text-sm font-semibold">
                      Department Tabs + Grid
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <TabbedGrid
                  members={clubStructure}
                  onMemberClick={setSelectedMemberB}
                />
                {selectedMemberB && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-500">
                    <p className="text-xs font-semibold text-gray-blue mb-1">
                      Last Selected:
                    </p>
                    <p className="text-sm text-gray-dark">
                      {selectedMemberB.name} - {selectedMemberB.title}
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
                      Score: 3.8/5 ⭐⭐⭐⭐ (BEST VISUAL HIERARCHY)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Pattern</div>
                    <div className="text-sm font-semibold">
                      Enhanced Org Chart
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
                    <p className="text-xs font-semibold text-gray-blue mb-1">
                      Last Selected:
                    </p>
                    <p className="text-sm text-gray-dark">
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
          "Side-by-side comparison of all 3 prototypes. Try completing the user testing tasks with each prototype.",
      },
    },
  },
};

// ==================== MOBILE COMPARISON ====================

export const MobileComparison: Story = {
  render: () => {
    return (
      <div className="p-4 space-y-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-blue">Mobile Comparison</h1>
        <p className="text-sm text-gray-medium">
          All 3 prototypes in mobile viewport (375px). Evaluate mobile UX for
          each.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-green-main mb-3">
              Option A: Card Hierarchy
            </h2>
            <CardHierarchy members={clubStructure} initialExpandedDepth={1} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-blue-500 mb-3">
              Option B: Tabbed Grid
            </h2>
            <TabbedGrid members={clubStructure} />
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
        story:
          "Mobile viewport comparison. Option A scores highest for mobile UX.",
      },
    },
  },
};

// ==================== FEATURE COMPARISON TABLE ====================

export const FeatureComparison: Story = {
  render: () => {
    const features = [
      {
        feature: "Mobile UX",
        optionA: "⭐⭐⭐⭐⭐ (5/5)",
        optionB: "⭐⭐⭐⭐ (4/5)",
        optionC: "⭐⭐⭐½ (3.5/5)",
        winner: "A",
      },
      {
        feature: "Desktop UX",
        optionA: "⭐⭐⭐⭐ (4/5)",
        optionB: "⭐⭐⭐⭐½ (4.5/5)",
        optionC: "⭐⭐⭐⭐⭐ (5/5)",
        winner: "C",
      },
      {
        feature: "Dual Purpose",
        optionA: "⭐⭐⭐⭐⭐ (5/5)",
        optionB: "⭐⭐⭐⭐ (4/5)",
        optionC: "⭐⭐⭐½ (3.5/5)",
        winner: "A",
      },
      {
        feature: "Accessibility",
        optionA: "⭐⭐⭐⭐½ (4.5/5)",
        optionB: "⭐⭐⭐⭐⭐ (5/5)",
        optionC: "⭐⭐⭐½ (3.5/5)",
        winner: "B",
      },
      {
        feature: "Maintainability",
        optionA: "⭐⭐⭐⭐ (4/5)",
        optionB: "⭐⭐⭐⭐⭐ (5/5)",
        optionC: "⭐⭐⭐ (3/5)",
        winner: "B",
      },
      {
        feature: "Performance",
        optionA: "⭐⭐⭐⭐⭐ (5/5)",
        optionB: "⭐⭐⭐⭐⭐ (5/5)",
        optionC: "⭐⭐⭐⭐ (4/5)",
        winner: "A+B",
      },
    ];

    return (
      <div className="p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-blue mb-6">
            Feature Comparison Matrix
          </h1>

          {/* Summary Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-main to-green-hover text-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-1">Option A</h2>
              <p className="text-3xl font-bold">4.3/5</p>
              <p className="text-sm opacity-90 mt-2">Card Hierarchy</p>
              <p className="text-xs opacity-75 mt-1">✅ BEST BALANCED OPTION</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-1">Option B</h2>
              <p className="text-3xl font-bold">4.0/5</p>
              <p className="text-sm opacity-90 mt-2">Tabbed Grid</p>
              <p className="text-xs opacity-75 mt-1">✅ SIMPLEST & FASTEST</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-1">Option C</h2>
              <p className="text-3xl font-bold">3.8/5</p>
              <p className="text-sm opacity-90 mt-2">Enhanced d3</p>
              <p className="text-xs opacity-75 mt-1">✅ BEST HIERARCHY</p>
            </div>
          </div>

          {/* Feature Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-blue uppercase tracking-wider">
                    Feature (Weight)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-main uppercase tracking-wider">
                    Option A
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-500 uppercase tracking-wider">
                    Option B
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-purple-500 uppercase tracking-wider">
                    Option C
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-blue uppercase tracking-wider">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-blue">
                      {row.feature}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${row.winner === "A" ? "font-bold text-green-main" : "text-gray-dark"}`}
                    >
                      {row.optionA}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${row.winner === "B" ? "font-bold text-blue-500" : "text-gray-dark"}`}
                    >
                      {row.optionB}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${row.winner === "C" ? "font-bold text-purple-500" : "text-gray-dark"}`}
                    >
                      {row.optionC}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {row.winner === "A" && (
                        <span className="px-2 py-1 bg-green-main/20 text-green-main rounded font-semibold">
                          A
                        </span>
                      )}
                      {row.winner === "B" && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded font-semibold">
                          B
                        </span>
                      )}
                      {row.winner === "C" && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded font-semibold">
                          C
                        </span>
                      )}
                      {row.winner === "A+B" && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-dark rounded font-semibold text-xs">
                          A+B
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-4 text-sm text-gray-blue">
                    TOTAL WEIGHTED
                  </td>
                  <td className="px-6 py-4 text-lg text-green-main">4.3/5</td>
                  <td className="px-6 py-4 text-lg text-blue-500">4.0/5</td>
                  <td className="px-6 py-4 text-lg text-purple-500">3.8/5</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-main text-white rounded-lg font-bold">
                      A WINS
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Recommendation */}
          <div className="mt-8 bg-green-main/10 border-2 border-green-main rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-main mb-3">
              🏆 Recommendation: Option A - Card Hierarchy
            </h2>
            <div className="space-y-2 text-sm text-gray-dark">
              <p>
                <strong>Why Option A wins:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Best mobile UX (critical for 60%+ mobile traffic)</li>
                <li>Dual purpose: Fast lookup AND hierarchy exploration</li>
                <li>Progressive disclosure reduces overwhelm</li>
                <li>Excellent accessibility and performance</li>
                <li>Good maintainability</li>
              </ul>
              <p className="mt-4">
                <strong>When to consider alternatives:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Option B:</strong> If contact lookup speed is #1
                  priority and hierarchy isn&apos;t important
                </li>
                <li>
                  <strong>Option C:</strong> If desktop presentations and visual
                  hierarchy matter more than mobile UX
                </li>
              </ul>
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
          "Detailed feature comparison with scoring matrix and recommendation.",
      },
    },
  },
};

// ==================== TASK-BASED TESTING ====================

export const TaskBasedTesting: Story = {
  render: () => {
    const [currentTask, setCurrentTask] = useState(0);
    const [currentPrototype, setCurrentPrototype] = useState<"A" | "B" | "C">(
      "A",
    );

    const tasks = [
      {
        id: 1,
        title: "Find Email",
        description: "Find the Youth Coordinator's email address",
        target: "Youth Coordinator",
        metric: "Number of clicks",
      },
      {
        id: 2,
        title: "Reporting",
        description: "See who the U10 Trainer reports to",
        target: "U10 Trainer",
        metric: "Clarity of hierarchy",
      },
      {
        id: 3,
        title: "Browse Department",
        description: "Browse the Jeugdbestuur structure",
        target: "Jeugdbestuur",
        metric: "Ease of navigation",
      },
      {
        id: 4,
        title: "Quick Contact",
        description: "Call the Treasurer",
        target: "Treasurer",
        metric: "Number of steps",
      },
      {
        id: 5,
        title: "Overview",
        description: "Understand overall club structure",
        target: "All members",
        metric: "Comprehension",
      },
    ];

    const task = tasks[currentTask];

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-blue mb-6">
            Task-Based User Testing
          </h1>

          {/* Task Selector */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-blue">
                Task {task.id}: {task.title}
              </h2>
              <div className="flex gap-2">
                {tasks.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTask(i)}
                    className={`w-10 h-10 rounded-full font-semibold ${
                      i === currentTask
                        ? "bg-green-main text-white"
                        : "bg-gray-200 text-gray-dark hover:bg-gray-300"
                    }`}
                  >
                    {t.id}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-dark mb-2">{task.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-medium">
              <span>
                <strong>Target:</strong> {task.target}
              </span>
              <span>
                <strong>Metric:</strong> {task.metric}
              </span>
            </div>
          </div>

          {/* Prototype Selector */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPrototype("A")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  currentPrototype === "A"
                    ? "bg-green-main text-white"
                    : "bg-gray-100 text-gray-dark hover:bg-gray-200"
                }`}
              >
                Option A: Card Hierarchy
              </button>
              <button
                onClick={() => setCurrentPrototype("B")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  currentPrototype === "B"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-dark hover:bg-gray-200"
                }`}
              >
                Option B: Tabbed Grid
              </button>
              <button
                onClick={() => setCurrentPrototype("C")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  currentPrototype === "C"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-dark hover:bg-gray-200"
                }`}
              >
                Option C: Enhanced d3
              </button>
            </div>
          </div>

          {/* Prototype Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {currentPrototype === "A" && (
              <CardHierarchy members={clubStructure} />
            )}
            {currentPrototype === "B" && <TabbedGrid members={clubStructure} />}
            {currentPrototype === "C" && (
              <EnhancedOrgChart members={clubStructure} />
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Task-based testing interface. Complete each task with all 3 prototypes and compare results.",
      },
    },
  },
};
