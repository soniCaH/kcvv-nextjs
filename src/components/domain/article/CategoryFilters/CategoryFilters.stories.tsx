import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CategoryFilters } from './CategoryFilters'

const meta: Meta<typeof CategoryFilters> = {
  title: 'Domain/Article/CategoryFilters',
  component: CategoryFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    activeCategory: {
      control: 'text',
      description: 'Slug of the currently active category',
    },
  },
}

export default meta
type Story = StoryObj<typeof CategoryFilters>

const mockCategories = [
  { id: '1', attributes: { name: 'Wedstrijdverslagen', slug: 'wedstrijdverslagen' } },
  { id: '2', attributes: { name: 'Clubnieuws', slug: 'clubnieuws' } },
  { id: '3', attributes: { name: 'Evenementen', slug: 'evenementen' } },
  { id: '4', attributes: { name: 'Jeugd', slug: 'jeugd' } },
]

const manyCategories = [
  ...mockCategories,
  { id: '5', attributes: { name: 'Senioren', slug: 'senioren' } },
  { id: '6', attributes: { name: 'Dames', slug: 'dames' } },
  { id: '7', attributes: { name: 'G-Voetbal', slug: 'g-voetbal' } },
  { id: '8', attributes: { name: 'Transfers', slug: 'transfers' } },
  { id: '9', attributes: { name: 'Bestuur', slug: 'bestuur' } },
  { id: '10', attributes: { name: 'Sponsors', slug: 'sponsors' } },
  { id: '11', attributes: { name: 'Algemeen', slug: 'algemeen' } },
  { id: '12', attributes: { name: 'Toernooien', slug: 'toernooien' } },
]

export const Default: Story = {
  args: {
    categories: mockCategories,
  },
}

export const ActiveCategory: Story = {
  args: {
    categories: mockCategories,
    activeCategory: 'clubnieuws',
  },
}

export const ManyCategories: Story = {
  args: {
    categories: manyCategories,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Empty: Story = {
  args: {
    categories: [],
  },
}
