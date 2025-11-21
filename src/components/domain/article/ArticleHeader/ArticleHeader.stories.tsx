/**
 * ArticleHeader Component Stories
 * Shows article title and hero image section
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArticleHeader } from './ArticleHeader'

const meta = {
  title: 'Domain/Article/ArticleHeader',
  component: ArticleHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Article header with green background title and hero image with blur effect on desktop.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Article title displayed in white on green background',
    },
    imageUrl: {
      control: 'text',
      description: 'URL of the hero image',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for the hero image',
    },
  },
} satisfies Meta<typeof ArticleHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default article header
 * Shows title on green background with hero image
 */
export const Default: Story = {
  args: {
    title: 'KCVV Elewijt behaalt belangrijke overwinning',
    imageUrl: 'https://picsum.photos/1120/560?random=1',
    imageAlt: 'Match photo',
  },
}

/**
 * Long title
 * Shows how the header handles longer article titles
 */
export const LongTitle: Story = {
  args: {
    title:
      'KCVV Elewijt behaalt een fantastische overwinning in de belangrijke wedstrijd tegen de rivaal van de regio',
    imageUrl: 'https://picsum.photos/1120/560?random=2',
    imageAlt: 'Team celebration',
  },
}

/**
 * Short title
 */
export const ShortTitle: Story = {
  args: {
    title: 'Overwinning!',
    imageUrl: 'https://picsum.photos/1120/560?random=3',
    imageAlt: 'Victory',
  },
}

/**
 * With page content below
 * Shows the header in context with article content
 */
export const WithContent: Story = {
  args: {
    title: 'Nieuwe transfers aangekondigd',
    imageUrl: 'https://picsum.photos/1120/560?random=4',
    imageAlt: 'New players',
  },
  render: (args) => (
    <div className="min-h-screen bg-white">
      <ArticleHeader {...args} />
      <div className="max-w-inner-lg mx-auto px-6 py-8">
        <p className="text-gray-700 mb-4">
          KCVV Elewijt heeft deze week twee nieuwe spelers aangetrokken voor het komende seizoen.
          De club is verheugd om deze nieuwe talenten te verwelkomen.
        </p>
        <p className="text-gray-700 mb-4">
          De transfers worden gezien als een belangrijke versterking voor het team en zullen
          helpen om de doelstellingen voor dit seizoen te bereiken.
        </p>
        <p className="text-gray-700">
          Meer details over de nieuwe spelers worden binnenkort bekendgemaakt tijdens een
          persconferentie.
        </p>
      </div>
    </div>
  ),
}

/**
 * Mobile view
 */
export const MobileView: Story = {
  args: {
    title: 'Jeugdwerking start nieuwe training',
    imageUrl: 'https://picsum.photos/1120/560?random=5',
    imageAlt: 'Youth training',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
