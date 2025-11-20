/**
 * Card Component Stories
 * Showcases all Card variants and compositions
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardImage,
} from './Card'
import { Button } from '../Button'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'teaser', 'bordered', 'elevated'],
      description: 'Visual variant of the card',
    },
    hoverable: {
      control: 'boolean',
      description: 'Add hover effects',
    },
    padded: {
      control: 'boolean',
      description: 'Add padding to the card',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic card with default styling
 */
export const Default: Story = {
  args: { children: null },
  render: () => (
    <Card padded>
      <h3 className="font-bold text-lg mb-2">Card Title</h3>
      <p className="text-gray-600">This is a basic card with default styling.</p>
    </Card>
  ),
}

/**
 * Card with header, content, and footer
 */
export const WithSections: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-lg">Card Header</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Card content goes here. This section is padded and contains the main information.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

/**
 * Teaser card with image (for news/articles)
 */
export const Teaser: Story = {
  args: { children: null },
  render: () => (
    <div className="max-w-sm">
      <Card variant="teaser" hoverable>
        <CardImage
          src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&h=400&fit=crop"
          alt="Football match"
        />
        <CardContent>
          <h3 className="font-bold text-lg mb-2 text-kcvv-gray-blue">
            KCVV wint thuiswedstrijd
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Een spannende wedstrijd eindigde in een 3-2 overwinning voor KCVV Elewijt.
          </p>
          <div className="flex justify-end border-t border-[#edeff4] pt-3 -mx-4 px-4">
            <Button variant="link" size="sm" withArrow>
              Lees meer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

/**
 * Bordered variant for emphasis
 */
export const Bordered: Story = {
  args: { children: null },
  render: () => (
    <Card variant="bordered" padded>
      <h3 className="font-bold text-lg mb-2">Important Information</h3>
      <p className="text-gray-600">
        This card uses a thicker border to draw attention.
      </p>
    </Card>
  ),
}

/**
 * Elevated variant with shadow
 */
export const Elevated: Story = {
  args: { children: null },
  render: () => (
    <Card variant="elevated" padded>
      <h3 className="font-bold text-lg mb-2">Featured Card</h3>
      <p className="text-gray-600">This card has a subtle shadow for depth.</p>
    </Card>
  ),
}

/**
 * Hoverable card with interaction
 */
export const Hoverable: Story = {
  args: { children: null },
  render: () => (
    <div className="max-w-sm">
      <Card hoverable padded>
        <h3 className="font-bold text-lg mb-2">Click me!</h3>
        <p className="text-gray-600">
          This card scales and shows a shadow on hover.
        </p>
      </Card>
    </div>
  ),
}

/**
 * Different aspect ratios for images
 */
export const AspectRatios: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <div>
        <h4 className="text-sm font-bold mb-2">1:1 (Square)</h4>
        <Card variant="teaser">
          <CardImage
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=400&fit=crop"
            alt="Square"
            aspectRatio="1:1"
          />
        </Card>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-2">3:2 (Default)</h4>
        <Card variant="teaser">
          <CardImage
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop"
            alt="3:2"
            aspectRatio="3:2"
          />
        </Card>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-2">16:9 (Wide)</h4>
        <Card variant="teaser">
          <CardImage
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=450&fit=crop"
            alt="16:9"
            aspectRatio="16:9"
          />
        </Card>
      </div>
      <div>
        <h4 className="text-sm font-bold mb-2">4:3</h4>
        <Card variant="teaser">
          <CardImage
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=450&fit=crop"
            alt="4:3"
            aspectRatio="4:3"
          />
        </Card>
      </div>
    </div>
  ),
}

/**
 * Player card example
 */
export const PlayerCard: Story = {
  args: { children: null },
  render: () => (
    <div className="max-w-xs">
      <Card variant="teaser" hoverable>
        <CardImage
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop"
          alt="Player"
          aspectRatio="1:1"
        />
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-kcvv-green-bright mb-1">10</div>
            <h3 className="font-bold text-lg text-kcvv-gray-blue mb-1">
              John Doe
            </h3>
            <p className="text-sm text-gray-600 mb-3">Midfielder</p>
            <Button size="sm" fullWidth>
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

/**
 * Match card example
 */
export const MatchCard: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardHeader>
        <div className="text-center text-sm text-gray-600">
          Zondag 15 Januari 2025 - 14:00
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <div className="font-bold text-lg">KCVV Elewijt</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-kcvv-green-bright">2</div>
            <div className="text-gray-400">-</div>
            <div className="text-2xl font-bold text-gray-600">1</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-bold text-lg">FC Opponents</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-end">
          <Button variant="link" size="sm" withArrow>
            Match Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

/**
 * News grid example
 */
export const NewsGrid: Story = {
  args: { children: null },
  render: () => {
    // Use reliable, fixed image URLs
    const images = [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop',
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="teaser" hoverable>
            <CardImage
              src={images[i - 1]}
              alt={`News ${i}`}
            />
            <CardContent>
              <div className="text-xs text-gray-500 mb-2">12 Jan 2025</div>
              <h3 className="font-bold text-base mb-2 line-clamp-2">
                Article Title {i}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                A brief description of the article goes here. This gives readers a
                preview of what to expect.
              </p>
              <div className="flex justify-end border-t border-[#edeff4] pt-3 -mx-4 px-4">
                <Button variant="link" size="sm" withArrow>
                  Read Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  },
}

/**
 * Interactive Playground
 *
 * Use the Controls panel on the right (or below) to experiment with different
 * card configurations. Try changing:
 * - variant (default, teaser, bordered, elevated)
 * - hoverable (adds scale + shadow on hover)
 * - padded (adds internal padding)
 */
export const Playground: Story = {
  args: {
    variant: 'default',
    hoverable: false,
    padded: true,
    children: null
  },
  render: (args) => (
    <Card variant={args.variant} hoverable={args.hoverable} padded={args.padded}>
      <h3 className="font-bold text-lg mb-2">Customize Me!</h3>
      <p className="text-gray-600">
        Use the controls panel to change variant, hoverable, and padded properties.
        Watch how the card updates in real-time!
      </p>
    </Card>
  ),
}
