/**
 * Icon Component Stories
 * Showcases Icon wrapper with react-icons
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon } from './Icon'
import {
  FaFutbol,
  FaTrophy,
  FaUsers,
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaArrowRight,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa'

const meta = {
  title: 'UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the icon',
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'success', 'warning', 'error', 'muted'],
      description: 'Color of the icon',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default icon (Football)
 */
export const Default: Story = {
  args: {
    icon: <FaFutbol />,
  },
}

/**
 * Primary color (KCVV Green)
 */
export const Primary: Story = {
  args: {
    icon: <FaTrophy />,
    color: 'primary',
    size: 'lg',
  },
}

/**
 * All available sizes
 */
export const AllSizes: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="xs" />
        <div className="text-xs mt-2 text-gray-600">xs</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="sm" />
        <div className="text-xs mt-2 text-gray-600">sm</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="md" />
        <div className="text-xs mt-2 text-gray-600">md</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="lg" />
        <div className="text-xs mt-2 text-gray-600">lg</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="xl" />
        <div className="text-xs mt-2 text-gray-600">xl</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="2xl" />
        <div className="text-xs mt-2 text-gray-600">2xl</div>
      </div>
    </div>
  ),
}

/**
 * All available colors
 */
export const AllColors: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="current" size="xl" />
        <div className="text-xs mt-2 text-gray-600">current</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="primary" size="xl" />
        <div className="text-xs mt-2 text-gray-600">primary</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="secondary" size="xl" />
        <div className="text-xs mt-2 text-gray-600">secondary</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="success" size="xl" />
        <div className="text-xs mt-2 text-gray-600">success</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="warning" size="xl" />
        <div className="text-xs mt-2 text-gray-600">warning</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="error" size="xl" />
        <div className="text-xs mt-2 text-gray-600">error</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaFutbol />} color="muted" size="xl" />
        <div className="text-xs mt-2 text-gray-600">muted</div>
      </div>
    </div>
  ),
}

/**
 * Common KCVV icons
 */
export const CommonIcons: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      <div className="text-center">
        <Icon icon={<FaFutbol />} size="lg" color="primary" />
        <div className="text-xs mt-2 text-gray-600">Football</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaTrophy />} size="lg" color="primary" />
        <div className="text-xs mt-2 text-gray-600">Trophy</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaUsers />} size="lg" color="primary" />
        <div className="text-xs mt-2 text-gray-600">Team</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaCalendar />} size="lg" color="primary" />
        <div className="text-xs mt-2 text-gray-600">Calendar</div>
      </div>
      <div className="text-center">
        <Icon icon={<FaMapMarkerAlt />} size="lg" color="primary" />
        <div className="text-xs mt-2 text-gray-600">Location</div>
      </div>
    </div>
  ),
}

/**
 * Contact icons
 */
export const ContactIcons: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex gap-4">
      <Icon icon={<FaPhone />} size="md" color="secondary" />
      <Icon icon={<FaEnvelope />} size="md" color="secondary" />
    </div>
  ),
}

/**
 * Social media icons
 */
export const SocialIcons: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex gap-4">
      <Icon icon={<FaFacebookF />} size="lg" color="muted" />
      <Icon icon={<FaTwitter />} size="lg" color="muted" />
      <Icon icon={<FaInstagram />} size="lg" color="muted" />
    </div>
  ),
}

/**
 * Navigation icons
 */
export const NavigationIcons: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex gap-4 items-center">
      <Icon icon={<FaSearch />} size="md" />
      <Icon icon={<FaBars />} size="md" />
      <Icon icon={<FaTimes />} size="md" />
      <Icon icon={<FaArrowRight />} size="md" />
      <Icon icon={<FaChevronDown />} size="md" />
    </div>
  ),
}

/**
 * Icons with text
 */
export const WithText: Story = {
  args: { icon: <FaFutbol /> },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon icon={<FaCalendar />} size="sm" color="primary" />
        <span>15 Januari 2025</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={<FaMapMarkerAlt />} size="sm" color="primary" />
        <span>Sportcomplex Elewijt</span>
      </div>
      <div className="flex items-center gap-2">
        <Icon icon={<FaUsers />} size="sm" color="primary" />
        <span>23 Spelers</span>
      </div>
    </div>
  ),
}

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    icon: <FaFutbol />,
    size: 'md',
    color: 'primary',
  },
}
