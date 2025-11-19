/**
 * PageFooter Component Stories
 * Showcases the site footer
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { PageFooter } from './PageFooter'

const meta = {
  title: 'Layout/PageFooter',
  component: PageFooter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageFooter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer with contact info and sponsors
 */
export const Default: Story = {}

/**
 * Footer in context with page content
 */
export const WithPageContent: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-4">
            Page Content
          </h1>
          <p className="text-gray-600 mb-6">
            This shows how the footer looks at the bottom of a page.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded p-6"
              >
                <h3 className="font-bold text-lg mb-2">Content Block {i + 1}</h3>
                <p className="text-gray-600 text-sm">
                  Sample content above the footer.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  ),
}

/**
 * Mobile view
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
