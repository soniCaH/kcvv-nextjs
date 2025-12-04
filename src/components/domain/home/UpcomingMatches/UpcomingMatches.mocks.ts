/**
 * Mock data for UpcomingMatches component
 * Used in Storybook and as fallback data during development
 */
import type { UpcomingMatch } from './UpcomingMatches'

export const mockScheduledMatches: UpcomingMatch[] = [
  {
    id: 1,
    date: new Date('2025-01-25T15:00:00'),
    time: '15:00',
    venue: 'Stadion Elewijt',
    homeTeam: {
      id: 1,
      name: 'KCVV Elewijt',
      logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
    },
    awayTeam: {
      id: 2,
      name: 'FC Opponent',
      logo: 'https://placehold.co/50x50/FF0000/FFF?text=FCO',
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
      logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
    },
    awayTeam: {
      id: 3,
      name: 'Racing Mechelen',
      logo: 'https://placehold.co/50x50/0000FF/FFF?text=RM',
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
      logo: 'https://placehold.co/50x50/FFFF00/000?text=SCL',
    },
    awayTeam: {
      id: 1,
      name: 'KCVV Elewijt',
      logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
    },
    status: 'scheduled',
    round: 'Speeldag 17',
    competition: 'Tweede Provinciale',
  },
]

export const mockLiveMatch: UpcomingMatch = {
  id: 10,
  date: new Date(),
  time: '15:30',
  venue: 'Stadion Elewijt',
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
    score: 2,
  },
  awayTeam: {
    id: 5,
    name: 'VK Tienen',
    logo: 'https://placehold.co/50x50/00FF00/000?text=VKT',
    score: 1,
  },
  status: 'live',
  round: 'Speeldag 14',
  competition: 'Tweede Provinciale',
}

export const mockFinishedMatch: UpcomingMatch = {
  id: 11,
  date: new Date('2025-01-18T14:00:00'),
  time: '14:00',
  venue: 'Stadion Elewijt',
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
    score: 3,
  },
  awayTeam: {
    id: 6,
    name: 'KFC Diest',
    logo: 'https://placehold.co/50x50/FFA500/FFF?text=KFC',
    score: 2,
  },
  status: 'finished',
  round: 'Speeldag 13',
  competition: 'Tweede Provinciale',
}

export const mockPostponedMatch: UpcomingMatch = {
  id: 12,
  date: new Date('2025-02-15T15:00:00'),
  homeTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
  },
  awayTeam: {
    id: 7,
    name: 'KV Woluwe',
    logo: 'https://placehold.co/50x50/800080/FFF?text=KVW',
  },
  status: 'postponed',
  round: 'Speeldag 18',
  competition: 'Tweede Provinciale',
}

export const mockCancelledMatch: UpcomingMatch = {
  id: 13,
  date: new Date('2025-02-22T14:30:00'),
  homeTeam: {
    id: 8,
    name: 'FC Kampenhout',
    logo: 'https://placehold.co/50x50/000000/FFF?text=FCK',
  },
  awayTeam: {
    id: 1,
    name: 'KCVV Elewijt',
    logo: 'https://placehold.co/50x50/006838/FFF?text=KCVV',
  },
  status: 'cancelled',
  round: 'Speeldag 19',
  competition: 'Tweede Provinciale',
}

/**
 * Combined mock data for various scenarios
 */
export const mockMatches = {
  scheduled: mockScheduledMatches,
  live: mockLiveMatch,
  finished: mockFinishedMatch,
  postponed: mockPostponedMatch,
  cancelled: mockCancelledMatch,
  all: [mockLiveMatch, ...mockScheduledMatches, mockFinishedMatch],
  mixed: [
    mockLiveMatch,
    mockScheduledMatches[0],
    mockFinishedMatch,
    mockScheduledMatches[1],
    mockPostponedMatch,
    mockScheduledMatches[2],
    mockCancelledMatch,
  ],
}
