import type { Meta, StoryObj } from '@storybook/react'
import { FeaturedArticles } from './FeaturedArticles'

const meta: Meta<typeof FeaturedArticles> = {
  title: 'Domain/Home/FeaturedArticles',
  component: FeaturedArticles,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    autoRotate: {
      control: 'boolean',
      description: 'Enable automatic rotation through articles',
    },
    autoRotateInterval: {
      control: { type: 'number', min: 1000, max: 10000, step: 1000 },
      description: 'Interval between rotations in milliseconds',
    },
  },
}

export default meta
type Story = StoryObj<typeof FeaturedArticles>

const mockArticles = [
  {
    href: '/news/2025-06-20-definitieve-reeksindeling-3e-nationale-bis',
    title: 'Definitieve reeksindeling 3e Nationale BIS',
    description:
      'De reeksindeling voor het seizoen 2025-2026 in 3e Nationale BIS is bekend. KCVV Elewijt komt uit in reeks A.',
    imageUrl: 'https://api.kcvvelewijt.be/sites/default/files/2025-01/stadium.jpg',
    imageAlt: 'Stadion KCVV Elewijt',
    date: '20 juni 2025',
    tags: [{ name: 'Ploeg' }, { name: 'Competitie' }],
  },
  {
    href: '/news/2025-03-25-overlijden-jean-lepage',
    title: 'Overlijden Jean Lepage',
    description:
      'Met diepe droefheid hebben we vernomen dat Jean Lepage op 82-jarige leeftijd is overleden. Jean was jarenlang een trouwe supporter en vrijwilliger van KCVV Elewijt.',
    imageUrl: 'https://api.kcvvelewijt.be/sites/default/files/2025-01/tribute.jpg',
    imageAlt: 'Jean Lepage tribute',
    date: '25 maart 2025',
    tags: [{ name: 'In Memoriam' }],
  },
  {
    href: '/news/2025-01-15-winterstage-spanje',
    title: 'Winterstage in Spanje: voorbereiding op play-offs',
    description:
      'De A-ploeg vertrekt volgende week naar Spanje voor een intensieve winterstage. Coach Deferm wil zijn spelers optimaal voorbereiden op de cruciale play-off wedstrijden.',
    imageUrl: 'https://api.kcvvelewijt.be/sites/default/files/2025-01/training.jpg',
    imageAlt: 'Training KCVV Elewijt',
    date: '15 januari 2025',
    tags: [{ name: 'Ploeg' }, { name: 'Training' }, { name: 'Stage' }],
  },
]

/**
 * Default hero carousel with multiple featured articles
 */
export const Default: Story = {
  args: {
    articles: mockArticles,
    autoRotate: true,
    autoRotateInterval: 5000,
  },
}

/**
 * Single featured article (no carousel)
 */
export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
    autoRotate: true,
    autoRotateInterval: 5000,
  },
}

/**
 * Two articles only
 */
export const TwoArticles: Story = {
  args: {
    articles: mockArticles.slice(0, 2),
    autoRotate: true,
    autoRotateInterval: 5000,
  },
}

/**
 * No auto-rotation (manual control only)
 */
export const ManualRotation: Story = {
  args: {
    articles: mockArticles,
    autoRotate: false,
  },
}

/**
 * Fast rotation for testing
 */
export const FastRotation: Story = {
  args: {
    articles: mockArticles,
    autoRotate: true,
    autoRotateInterval: 2000,
  },
}

/**
 * Article without image
 */
export const WithoutImage: Story = {
  args: {
    articles: [
      {
        ...mockArticles[0],
        imageUrl: undefined,
      },
    ],
    autoRotate: false,
  },
}

/**
 * Article without description
 */
export const WithoutDescription: Story = {
  args: {
    articles: [
      {
        ...mockArticles[0],
        description: undefined,
      },
    ],
    autoRotate: false,
  },
}

/**
 * Article without tags
 */
export const WithoutTags: Story = {
  args: {
    articles: [
      {
        ...mockArticles[0],
        tags: undefined,
      },
    ],
    autoRotate: false,
  },
}

/**
 * Article with many tags (only shows first 3)
 */
export const ManyTags: Story = {
  args: {
    articles: [
      {
        ...mockArticles[0],
        tags: [
          { name: 'Ploeg' },
          { name: 'Competitie' },
          { name: 'Play-offs' },
          { name: 'Nieuws' },
          { name: 'Belangrijk' },
        ],
      },
    ],
    autoRotate: false,
  },
}

/**
 * Empty state (no articles)
 */
export const Empty: Story = {
  args: {
    articles: [],
  },
}
