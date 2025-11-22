/**
 * ResponsibilityFinder Component Stories
 * Interactive "Ik ben ... en ik ..." question builder with smart autocomplete
 *
 * Features:
 * - Smart autocomplete with fuzzy matching
 * - Large typography for accessibility
 * - Role-based filtering
 * - Complete answer cards
 * - Mobile responsive
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { ResponsibilityFinder } from './ResponsibilityFinder'
import type { ResponsibilityPath } from '@/types/responsibility'

const meta = {
  title: 'Features/ResponsibilityFinder',
  component: ResponsibilityFinder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The **ResponsibilityFinder** helps users quickly find the right contact person by building a question:

**"IK BEN [ROLE] EN IK [QUESTION]"**

### Features
- 🎯 Smart autocomplete with keyword matching
- 📱 Mobile-optimized with large typography
- 🔍 Fuzzy search algorithm
- 👤 Role-based filtering
- ✅ Complete solution paths with steps
- 📧 Contact information integration
- 🔗 Links to org chart and relevant pages

### Use Cases
- Finding who to contact for injuries
- Registration questions
- Match schedules
- Reporting issues
- General help
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    compact: {
      control: 'boolean',
      description: 'Compact mode for homepage integration',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onResultSelect: {
      action: 'result-selected',
      description: 'Callback when user selects a result',
    },
  },
} satisfies Meta<typeof ResponsibilityFinder>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default full-size variant for the dedicated /hulp page
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Full-size version with large typography (4xl-6xl) for maximum readability.',
      },
    },
  },
}

/**
 * Compact variant for homepage integration
 */
export const Compact: Story = {
  args: {
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version (2xl-4xl) perfect for homepage blocks or smaller sections.',
      },
    },
  },
}

/**
 * With mobile viewport to test responsiveness
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view showing touch-friendly buttons and stacked layout.',
      },
    },
  },
}

/**
 * Tablet viewport
 */
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view showing responsive layout adaptation.',
      },
    },
  },
}

/**
 * Interactive test: User selects role and searches
 * (Manual interaction - click "Speler" to see the question input)
 */
export const WithRoleSelected: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the interaction flow: selecting a role reveals the question input. Click any role button to test!',
      },
    },
  },
}

/**
 * Interactive test: Full search flow
 * Manual interaction - select a role and type to see autocomplete
 */
export const WithSearchResults: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Full interaction: select a role (e.g., "Ouder") and type a query (e.g., "inschrijv") to see autocomplete suggestions appear. Try it yourself!',
      },
    },
  },
}

/**
 * Interactive test: Selecting a suggestion
 * Manual interaction - complete the full flow to see result card
 */
export const WithResultSelected: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Complete flow: select a role (e.g., "Speler") → type query (e.g., "ongeval") → click suggestion → view result card with contact info and steps. Try it yourself!',
      },
    },
  },
}

/**
 * All user roles showcased
 */
export const AllRoles: Story = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Available Roles</h3>
      <p className="text-gray-dark">Users can select from these roles to filter relevant questions:</p>
      <ResponsibilityFinder />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold mb-2">Role Types:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Speler</strong> - Active players</li>
          <li><strong>Ouder</strong> - Parents of players</li>
          <li><strong>Trainer</strong> - Coaches and trainers</li>
          <li><strong>Supporter</strong> - Fans and supporters</li>
          <li><strong>Niet-lid</strong> - Non-members (sponsors, volunteers)</li>
          <li><strong>Andere</strong> - Other categories</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Overview of all available user roles with descriptions.',
      },
    },
  },
}

/**
 * Keyboard navigation test
 * Manual interaction - test keyboard accessibility
 */
export const KeyboardNavigation: Story = {
  args: {},
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Tests keyboard navigation and accessibility compliance. Use Tab to navigate, Enter/Space to select roles, and type to search. All interactive elements are keyboard accessible.',
      },
    },
  },
}

/**
 * Compact vs Full size comparison
 */
export const SizeComparison: Story = {
  args: {},
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-4">Full Size (Default)</h3>
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
          <ResponsibilityFinder />
        </div>
        <p className="mt-2 text-sm text-gray-medium">
          Large typography (4xl-6xl) for dedicated /hulp page
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Compact Size</h3>
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-green-main/5">
          <ResponsibilityFinder compact />
        </div>
        <p className="mt-2 text-sm text-gray-medium">
          Smaller typography (2xl-4xl) for homepage integration
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Side-by-side comparison of full and compact variants.',
      },
    },
  },
}

/**
 * Real-world integration example
 */
export const HomepageIntegration: Story = {
  args: {
    compact: true,
  },
  render: (args) => (
    <section className="bg-gradient-to-br from-green-main/5 to-green-hover/5 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-blue mb-4">
            Hoe kunnen we je helpen?
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-2xl mx-auto">
            Vind snel de juiste contactpersoon voor jouw vraag
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <ResponsibilityFinder {...args} />
        </div>

        <div className="mt-8 text-center">
          <a href="/hulp" className="text-green-main hover:text-green-hover font-semibold">
            Bekijk alle veelgestelde vragen →
          </a>
        </div>
      </div>
    </section>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Real-world example showing how the component integrates into a homepage section.',
      },
    },
  },
}

/**
 * Dark mode variant (if supported)
 */
export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Testing component appearance on dark backgrounds.',
      },
    },
  },
}

/**
 * Accessibility test story
 */
export const AccessibilityTest: Story = {
  args: {},
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'input-image-alt',
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
    docs: {
      description: {
        story: 'Comprehensive accessibility testing with axe-core.',
      },
    },
  },
}

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    compact: false,
    onResultSelect: (path: ResponsibilityPath) => {
      console.log('Selected:', path)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different configurations. Use the controls panel to customize!',
      },
    },
  },
}

/**
 * Performance test with many interactions
 * Manual interaction - test performance with rapid role switching and typing
 */
export const PerformanceTest: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Performance test: rapidly switch between roles (Speler → Ouder → Trainer) and type/delete text to test smooth UX and responsiveness. Component should remain smooth during heavy interaction.',
      },
    },
  },
}
