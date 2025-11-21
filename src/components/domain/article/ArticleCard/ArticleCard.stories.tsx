/**
 * ArticleCard Component Stories
 * Article teaser card for news listing pages
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArticleCard } from './ArticleCard'

const meta = {
  title: 'Domain/Article/ArticleCard',
  component: ArticleCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Article teaser card matching Gatsby CardTeaser design. Features responsive layout (horizontal on mobile, vertical on desktop), image zoom on hover, and lifted shadow effect.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Article title',
    },
    href: {
      control: 'text',
      description: 'Link URL to article detail page',
    },
    imageUrl: {
      control: 'text',
      description: 'Featured image URL',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for the featured image',
    },
    date: {
      control: 'text',
      description: 'Formatted publication date',
    },
    tags: {
      control: 'object',
      description: 'Array of tag objects with name property',
    },
  },
} satisfies Meta<typeof ArticleCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default article card
 * Complete card with image, title, date, and tags
 */
export const Default: Story = {
  args: {
    title: 'KCVV Elewijt behaalt belangrijke overwinning',
    href: '/news/belangrijke-overwinning',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    imageAlt: 'Match photo',
    date: '15 januari 2025',
    tags: [{ name: 'Nieuws' }, { name: 'Competitie' }],
  },
}

/**
 * Long title
 * Shows how the card handles longer titles with line clamping
 */
export const LongTitle: Story = {
  args: {
    title:
      'KCVV Elewijt behaalt een fantastische overwinning in de belangrijke wedstrijd tegen de rivaal van de regio en klimt naar de tweede plaats',
    href: '/news/fantastische-overwinning',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    imageAlt: 'Team celebration',
    date: '14 januari 2025',
    tags: [{ name: 'Competitie' }],
  },
}

/**
 * Short title
 */
export const ShortTitle: Story = {
  args: {
    title: 'Overwinning!',
    href: '/news/overwinning',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    imageAlt: 'Victory',
    date: '13 januari 2025',
    tags: [{ name: 'Nieuws' }],
  },
}

/**
 * Without image
 * Card without featured image
 */
export const WithoutImage: Story = {
  args: {
    title: 'Nieuwe trainingsschema bekendgemaakt',
    href: '/news/trainingsschema',
    date: '12 januari 2025',
    tags: [{ name: 'Jeugd' }, { name: 'Training' }],
  },
}

/**
 * Without date
 * Card without publication date
 */
export const WithoutDate: Story = {
  args: {
    title: 'Vrijwilligers gezocht voor clubactiviteiten',
    href: '/news/vrijwilligers',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    imageAlt: 'Volunteers',
    tags: [{ name: 'Club' }],
  },
}

/**
 * Without tags
 * Card without category tags
 */
export const WithoutTags: Story = {
  args: {
    title: 'Update van het bestuur',
    href: '/news/bestuur-update',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    imageAlt: 'Board meeting',
    date: '11 januari 2025',
    tags: [],
  },
}

/**
 * Multiple tags
 * Card with many category tags
 */
export const MultipleTags: Story = {
  args: {
    title: 'Groot evenement met activiteiten voor alle leeftijden',
    href: '/news/groot-evenement',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    imageAlt: 'Event',
    date: '10 januari 2025',
    tags: [
      { name: 'Evenement' },
      { name: 'Jeugd' },
      { name: 'Seniors' },
      { name: 'Vrouwen' },
    ],
  },
}

/**
 * Minimal card
 * Card with only required props (title and href)
 */
export const Minimal: Story = {
  args: {
    title: 'Minimaal artikel',
    href: '/news/minimaal',
  },
}

/**
 * In grid layout
 * Shows multiple cards in a 3-column grid like the news listing page
 */
export const InGridLayout: Story = {
  render: () => (
    <div className="w-full max-w-inner-lg mx-auto px-3 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
        <ArticleCard
          title="KCVV Elewijt wint derby"
          href="/news/derby-overwinning"
          imageUrl="https://picsum.photos/400/300?random=10"
          imageAlt="Derby match"
          date="15 januari 2025"
          tags={[{ name: 'Competitie' }]}
        />
        <ArticleCard
          title="Nieuwe spelers aangetrokken voor komend seizoen"
          href="/news/nieuwe-spelers"
          imageUrl="https://picsum.photos/400/300?random=11"
          imageAlt="New players"
          date="14 januari 2025"
          tags={[{ name: 'Transfers' }, { name: 'Nieuws' }]}
        />
        <ArticleCard
          title="Jeugdwerking start zomertrainingen"
          href="/news/zomertrainingen"
          imageUrl="https://picsum.photos/400/300?random=12"
          imageAlt="Youth training"
          date="13 januari 2025"
          tags={[{ name: 'Jeugd' }]}
        />
        <ArticleCard
          title="Clubkampioenschap resultaten"
          href="/news/clubkampioenschap"
          imageUrl="https://picsum.photos/400/300?random=13"
          imageAlt="Championship"
          date="12 januari 2025"
          tags={[{ name: 'Evenement' }]}
        />
        <ArticleCard
          title="Bestuursverkiezingen aangekondigd"
          href="/news/bestuursverkiezingen"
          imageUrl="https://picsum.photos/400/300?random=14"
          imageAlt="Board elections"
          date="11 januari 2025"
          tags={[{ name: 'Club' }, { name: 'Bestuur' }]}
        />
        <ArticleCard
          title="Nieuwe sponsor welkom"
          href="/news/nieuwe-sponsor"
          imageUrl="https://picsum.photos/400/300?random=15"
          imageAlt="Sponsor announcement"
          date="10 januari 2025"
          tags={[{ name: 'Nieuws' }]}
        />
      </div>
    </div>
  ),
}

/**
 * Mobile view
 * Shows horizontal layout on mobile viewport
 */
export const MobileView: Story = {
  args: {
    title: 'Training hervat na winterpauze',
    href: '/news/training-hervat',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    imageAlt: 'Winter training',
    date: '9 januari 2025',
    tags: [{ name: 'Training' }],
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
    title: 'Nieuwe materialen aangekocht',
    href: '/news/nieuwe-materialen',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    imageAlt: 'New equipment',
    date: '8 januari 2025',
    tags: [{ name: 'Club' }],
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
