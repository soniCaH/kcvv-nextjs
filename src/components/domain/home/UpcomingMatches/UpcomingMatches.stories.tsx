import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UpcomingMatches } from './UpcomingMatches'
import type { UpcomingMatch } from './UpcomingMatches'

const meta: Meta<typeof UpcomingMatches> = {
  title: 'Domain/Home/UpcomingMatches',
  component: UpcomingMatches,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Horizontal slider component for displaying upcoming matches using native CSS scroll-snap. Features touch-friendly scrolling, navigation arrows, and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof UpcomingMatches>

// Mock data
const mockScheduledMatches: UpcomingMatch[] = [
  {
    id: 1,
    date: new Date('2025-01-25T15:00:00'),
    time: '15:00',
    venue: 'Stadion Elewijt',
    homeTeam: {
      id: 1,
      name: 'KCVV Elewijt',
      logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
    },
    awayTeam: {
      id: 2,
      name: 'FC Opponent',
      logo: 'https://via.placeholder.com/50/FF0000/FFFFFF?text=FCO',
    },
    status: 'scheduled',
    round: 'Speeldag 15',
    competition: 'Tweede Provinciale',
  },
  {
    id: 2,
    date: new Date('2025-02-01T14:30:00'),
    time: '14:30',
    venue: 'Stadion Elewijt',
    homeTeam: {
      id: 1,
      name: 'KCVV Elewijt',
      logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
    },
    awayTeam: {
      id: 3,
      name: 'Racing Mechelen',
      logo: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=RM',
    },
    status: 'scheduled',
    round: 'Speeldag 16',
    competition: 'Tweede Provinciale',
  },
  {
    id: 3,
    date: new Date('2025-02-08T16:00:00'),
    time: '16:00',
    homeTeam: {
      id: 4,
      name: 'SC Leuven',
      logo: 'https://via.placeholder.com/50/FFFF00/000000?text=SCL',
    },
    awayTeam: {
      id: 1,
      name: 'KCVV Elewijt',
      logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
    },
    status: 'scheduled',
    round: 'Speeldag 17',
    competition: 'Tweede Provinciale',
  },
]

const mockLiveMatch: UpcomingMatch = {
  id: 10,
  date: new Date(),
  time: '15:30',
  venue: 'Stadion Elewijt',
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
    score: 2,
  },
  awayTeam: {
    id: 5,
    name: 'VK Tienen',
    logo: 'https://via.placeholder.com/50/00FF00/000000?text=VKT',
    score: 1,
  },
  status: 'live',
  round: 'Speeldag 14',
  competition: 'Tweede Provinciale',
}

const mockFinishedMatch: UpcomingMatch = {
  id: 11,
  date: new Date('2025-01-18T14:00:00'),
  time: '14:00',
  venue: 'Stadion Elewijt',
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
    score: 3,
  },
  awayTeam: {
    id: 6,
    name: 'KFC Diest',
    logo: 'https://via.placeholder.com/50/FFA500/FFFFFF?text=KFC',
    score: 2,
  },
  status: 'finished',
  round: 'Speeldag 13',
  competition: 'Tweede Provinciale',
}

const mockPostponedMatch: UpcomingMatch = {
  id: 12,
  date: new Date('2025-02-15T15:00:00'),
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
  },
  awayTeam: {
    id: 7,
    name: 'KV Woluwe',
    logo: 'https://via.placeholder.com/50/800080/FFFFFF?text=KVW',
  },
  status: 'postponed',
  round: 'Speeldag 18',
  competition: 'Tweede Provinciale',
}

const mockCancelledMatch: UpcomingMatch = {
  id: 13,
  date: new Date('2025-02-22T14:30:00'),
  homeTeam: {
    id: 8,
    name: 'FC Kampenhout',
    logo: 'https://via.placeholder.com/50/000000/FFFFFF?text=FCK',
  },
  awayTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://via.placeholder.com/50/006838/FFFFFF?text=KCVV',
  },
  status: 'cancelled',
  round: 'Speeldag 19',
  competition: 'Tweede Provinciale',
}

// Stories
export const Default: Story = {
  args: {
    matches: mockScheduledMatches,
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
}

export const WithLiveMatch: Story = {
  args: {
    matches: [mockLiveMatch, ...mockScheduledMatches],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a live match with pulsing indicator and current scores.',
      },
    },
  },
}

export const WithFinishedMatch: Story = {
  args: {
    matches: [mockFinishedMatch, ...mockScheduledMatches],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a finished match with final scores.',
      },
    },
  },
}

export const WithPostponedMatch: Story = {
  args: {
    matches: [mockPostponedMatch, ...mockScheduledMatches],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a postponed match with "Uitgesteld" status.',
      },
    },
  },
}

export const WithCancelledMatch: Story = {
  args: {
    matches: [mockCancelledMatch, ...mockScheduledMatches],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a cancelled match with "Afgelast" status.',
      },
    },
  },
}

export const ManyMatches: Story = {
  args: {
    matches: [
      mockLiveMatch,
      ...mockScheduledMatches,
      mockFinishedMatch,
      ...mockScheduledMatches.map((m, i) => ({
        ...m,
        id: 20 + i,
        round: `Speeldag ${20 + i}`,
      })),
      mockPostponedMatch,
      mockCancelledMatch,
    ],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Displays many matches to demonstrate horizontal scrolling with navigation arrows.',
      },
    },
  },
}

export const SingleMatch: Story = {
  args: {
    matches: [mockScheduledMatches[0]],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a single match without scrolling.',
      },
    },
  },
}

export const WithoutViewAll: Story = {
  args: {
    matches: mockScheduledMatches,
    title: 'Volgende wedstrijden',
    showViewAll: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays matches without the "View All" link.',
      },
    },
  },
}

export const CustomTitle: Story = {
  args: {
    matches: mockScheduledMatches,
    title: 'Wedstrijdkalender',
    showViewAll: true,
    viewAllHref: '/kalender',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays matches with a custom title and view all link.',
      },
    },
  },
}

export const NoMatches: Story = {
  args: {
    matches: [],
    title: 'Volgende wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'When no matches are provided, the component renders nothing (returns null).',
      },
    },
  },
}

export const MixedStatuses: Story = {
  args: {
    matches: [
      mockLiveMatch,
      mockScheduledMatches[0],
      mockFinishedMatch,
      mockScheduledMatches[1],
      mockPostponedMatch,
      mockScheduledMatches[2],
      mockCancelledMatch,
    ],
    title: 'Alle wedstrijden',
    showViewAll: true,
    viewAllHref: '/matches',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays matches with mixed statuses: live, scheduled, finished, postponed, and cancelled.',
      },
    },
  },
}
