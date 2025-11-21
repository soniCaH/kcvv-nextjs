/**
 * PageTitle Component Stories
 * Page heading with green background and texture pattern
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { PageTitle } from './PageTitle'

const meta = {
  title: 'Layout/PageTitle',
  component: PageTitle,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page title section with green background and texture pattern. Used for page headings across the site (news archive, team pages, etc.). Features fixed background attachment for parallax effect.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title text',
    },
    padding: {
      control: 'text',
      description: 'Custom padding classes (default: px-3 pt-4 pb-4 xl:px-0)',
    },
    containerWidth: {
      control: 'text',
      description: 'Container max width class (default: max-w-inner-lg)',
    },
  },
} satisfies Meta<typeof PageTitle>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default page title
 * Standard styling for most pages
 */
export const Default: Story = {
  args: {
    title: 'Nieuwsarchief KCVV Elewijt',
  },
}

/**
 * Short title
 * Shows how the component handles shorter text
 */
export const ShortTitle: Story = {
  args: {
    title: 'Nieuws',
  },
}

/**
 * Long title
 * Shows how the component handles longer text with wrapping
 */
export const LongTitle: Story = {
  args: {
    title: 'Kalender van alle wedstrijden en evenementen van KCVV Elewijt',
  },
}

/**
 * With page content below
 * Shows the title in context with content below
 */
export const WithContent: Story = {
  args: {
    title: 'Ons Team',
  },
  render: (args) => (
    <div className="min-h-screen bg-white">
      <PageTitle {...args} />
      <div className="max-w-inner-lg mx-auto px-3 lg:px-0 py-6">
        <p className="text-gray-700 mb-4">
          KCVV Elewijt is een voetbalclub met een rijke geschiedenis en een sterke verbondenheid
          met de lokale gemeenschap.
        </p>
        <p className="text-gray-700 mb-4">
          Onze club biedt mogelijkheden voor spelers van alle leeftijden en niveaus, van de
          jongste junioren tot de meest ervaren senioren.
        </p>
        <p className="text-gray-700">
          We streven naar sportiviteit, plezier en ontwikkeling, zowel op als naast het veld.
        </p>
      </div>
    </div>
  ),
}

/**
 * Custom padding
 * Example with larger padding
 */
export const CustomPadding: Story = {
  args: {
    title: 'Contact',
    padding: 'px-6 pt-8 pb-8',
  },
}

/**
 * Custom container width
 * Example with narrower container
 */
export const CustomWidth: Story = {
  args: {
    title: 'Privacy Policy',
    containerWidth: 'max-w-4xl',
  },
}

/**
 * Team page example
 */
export const TeamPage: Story = {
  args: {
    title: 'A-Kern',
  },
}

/**
 * Calendar page example
 */
export const CalendarPage: Story = {
  args: {
    title: 'Kalender',
  },
}

/**
 * Contact page example
 */
export const ContactPage: Story = {
  args: {
    title: 'Contact',
  },
}

/**
 * Mobile view
 * Shows how the title appears on mobile devices
 */
export const MobileView: Story = {
  args: {
    title: 'Jeugdwerking',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet view
 */
export const TabletView: Story = {
  args: {
    title: 'Clubgeschiedenis',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
