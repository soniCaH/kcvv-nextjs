/**
 * PageFooter Component Stories
 * Showcases the site footer with black background and wavy SVG top
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { PageFooter } from './PageFooter'

const meta = {
  title: 'Layout/PageFooter',
  component: PageFooter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Site footer with contact info, social links, and sponsors. Black background (#1E2024) with wavy SVG top edge.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageFooter>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer with all sections
 * Shows black background with SVG wavy top, contact table, social links, and sponsors grid
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[400px] flex items-center justify-center bg-white">
        <p className="text-gray-600">Page content above footer</p>
      </div>
      <PageFooter />
    </div>
  ),
}

/**
 * Footer with full page context
 */
export const WithPageContent: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-kcvv-gray-blue mb-4">Page Content</h1>
          <p className="text-gray-600 mb-6">
            This shows how the footer looks at the bottom of a page with the wavy SVG
            transition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded p-6">
                <h3 className="font-bold text-lg mb-2">Content Block {i + 1}</h3>
                <p className="text-gray-600 text-sm">Sample content above the footer.</p>
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
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[300px] flex items-center justify-center bg-white">
        <p className="text-gray-600 text-sm">Page content</p>
      </div>
      <PageFooter />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
