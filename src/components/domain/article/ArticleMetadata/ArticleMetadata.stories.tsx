/**
 * ArticleMetadata Component Stories
 * Shows article sidebar with author, date, tags, and social share
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ArticleMetadata } from './ArticleMetadata'

const meta = {
  title: 'Domain/Article/ArticleMetadata',
  component: ArticleMetadata,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Article metadata sidebar with author, date, tags, and social share buttons. Features gradient border.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    author: {
      control: 'text',
      description: 'Author name',
    },
    date: {
      control: 'text',
      description: 'Publication date (formatted string)',
    },
  },
} satisfies Meta<typeof ArticleMetadata>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default metadata sidebar
 * Shows author, date, tags, and social share
 */
export const Default: Story = {
  args: {
    author: 'Jan Janssens',
    date: '15/01/2025',
    tags: [
      { name: 'voetbal', href: '/tags/voetbal' },
      { name: 'overwinning', href: '/tags/overwinning' },
      { name: 'aploeg', href: '/tags/aploeg' },
    ],
    shareConfig: {
      url: 'https://kcvvelewijt.be/news/belangrijke-overwinning',
      title: 'KCVV Elewijt behaalt belangrijke overwinning',
      twitterHandle: '@kcvve',
    },
  },
}

/**
 * Without tags
 * Shows metadata without tags section
 */
export const WithoutTags: Story = {
  args: {
    author: 'Piet Pieters',
    date: '12/01/2025',
    shareConfig: {
      url: 'https://kcvvelewijt.be/news/test',
      title: 'Test Article',
    },
  },
}

/**
 * Without share buttons
 * Shows metadata without social share
 */
export const WithoutShare: Story = {
  args: {
    author: 'Marie Maes',
    date: '10/01/2025',
    tags: [
      { name: 'jeugd', href: '/tags/jeugd' },
      { name: 'training', href: '/tags/training' },
    ],
  },
}

/**
 * Minimal (author and date only)
 */
export const Minimal: Story = {
  args: {
    author: 'Koen Koens',
    date: '08/01/2025',
  },
}

/**
 * Many tags
 * Shows how the component handles multiple tags
 */
export const ManyTags: Story = {
  args: {
    author: 'Redactie',
    date: '20/01/2025',
    tags: [
      { name: 'voetbal', href: '/tags/voetbal' },
      { name: 'aploeg', href: '/tags/aploeg' },
      { name: 'competitie', href: '/tags/competitie' },
      { name: 'overwinning', href: '/tags/overwinning' },
      { name: 'elewijt', href: '/tags/elewijt' },
      { name: 'thuis', href: '/tags/thuis' },
    ],
    shareConfig: {
      url: 'https://kcvvelewijt.be/news/test',
      title: 'Test Article',
    },
  },
}

/**
 * In article context (desktop sidebar)
 * Shows the metadata as it appears in the article layout
 */
export const InContext: Story = {
  args: {
    author: 'Tom Tomassen',
    date: '18/01/2025',
    tags: [
      { name: 'transfer', href: '/tags/transfer' },
      { name: 'nieuws', href: '/tags/nieuws' },
    ],
    shareConfig: {
      url: 'https://kcvvelewijt.be/news/nieuwe-speler',
      title: 'Nieuwe speler aangekondigd',
      twitterHandle: '@kcvve',
    },
  },
  render: (args) => (
    <div className="max-w-inner-lg mx-auto">
      <div className="flex flex-col lg:flex-row-reverse gap-4">
        {/* Metadata Sidebar */}
        <div className="lg:w-[20rem]">
          <ArticleMetadata {...args} />
        </div>

        {/* Article Body (simulated) */}
        <div className="flex-1 p-3">
          <p className="text-sm mb-4">
            KCVV Elewijt heeft vandaag een nieuwe speler aangekondigd voor het komende seizoen.
            De transfer wordt gezien als een belangrijke versterking voor het team.
          </p>
          <p className="text-sm mb-4">
            De speler komt over van een andere club in de regio en heeft al ervaring in de
            competitie. Meer details worden binnenkort bekendgemaakt.
          </p>
          <p className="text-sm">
            De club is verheugd om deze nieuwe aanwinst te verwelkomen en kijkt uit naar de
            samenwerking.
          </p>
        </div>
      </div>
    </div>
  ),
}
