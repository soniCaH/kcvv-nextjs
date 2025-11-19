/**
 * PageHeader Component Stories
 * Showcases the main site header with navigation
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default header with logo and navigation
 */
export const Default: Story = {
  render: () => (
    <div>
      <PageHeader />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Page Content</h1>
        <p className="text-gray-600 mb-4">
          Scroll down to see the sticky header behavior.
        </p>
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i} className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
      </div>
    </div>
  ),
}

/**
 * Mobile view (resize viewport to see)
 */
export const MobileView: Story = {
  render: () => (
    <div>
      <PageHeader />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Mobile Layout</h1>
        <p className="text-sm text-gray-600">
          Click the hamburger icon to open the mobile menu.
        </p>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Full page example with content
 */
export const WithContent: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <PageHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-4">
            Welcome to KCVV Elewijt
          </h1>
          <p className="text-gray-600 mb-6">
            This is an example page showing the header in context with content.
            The header will stick to the top as you scroll.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded p-6"
              >
                <h3 className="font-bold text-lg mb-2">Card {i + 1}</h3>
                <p className="text-gray-600 text-sm">
                  Sample content to demonstrate page layout with the header.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <p key={i} className="text-gray-600">
                More content to demonstrate scrolling behavior. The header
                should remain fixed at the top of the viewport.
              </p>
            ))}
          </div>
        </div>
      </main>
    </div>
  ),
}
