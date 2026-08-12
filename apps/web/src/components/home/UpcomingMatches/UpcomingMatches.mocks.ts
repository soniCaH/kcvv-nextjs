import type { UpcomingMatch } from "@/components/match/types";

const KCVV_LOGO =
  "https://dfaozfi7c7f3s.cloudfront.net/logos/extra_groot/1235.png?v=1";

const kcvv = (
  overrides: Partial<UpcomingMatch["homeTeam"]> = {},
): UpcomingMatch["homeTeam"] => ({
  id: 1235,
  name: "KCVV Elewijt",
  logo: KCVV_LOGO,
  ...overrides,
});

const opponent = (id: number, name: string): UpcomingMatch["homeTeam"] => ({
  id,
  name,
  logo: `https://dfaozfi7c7f3s.cloudfront.net/logos/extra_groot/${id}.png?v=1`,
});

const makeMatch = (
  id: number,
  date: string,
  time: string,
  home: UpcomingMatch["homeTeam"],
  away: UpcomingMatch["homeTeam"],
  options: Partial<UpcomingMatch> = {},
): UpcomingMatch => ({
  id,
  date: new Date(date),
  time,
  homeTeam: home,
  awayTeam: away,
  status: "scheduled",
  competition: "3e Afdeling VV",
  kcvvTeamLabel: "A-Ploeg",
  ...options,
});

/**
 * The club's own ground. Only home fixtures carry it — and only in fixtures:
 * PSD supplies no venue field and `apps/api/src/psd/transforms.ts` hardcodes
 * `venue: undefined`, so production renders no venue at all today (#2398).
 * Kept here so the caption's populated state stays covered for the day it does.
 */
const HOME_VENUE = "Driesstraat 32, 1982 Elewijt";

export const mockUpcomingFive: UpcomingMatch[] = [
  makeMatch(
    501,
    "2026-05-16T13:00:00Z",
    "15:00",
    kcvv(),
    opponent(59, "KVC Wilrijk"),
    { venue: HOME_VENUE },
  ),
  makeMatch(
    502,
    "2026-05-23T13:00:00Z",
    "15:00",
    opponent(628, "City Pirates"),
    kcvv(),
    { kcvvTeamLabel: "U21", competition: "Provinciaal U21" },
  ),
  makeMatch(
    503,
    "2026-05-30T13:00:00Z",
    "14:30",
    kcvv(),
    opponent(448, "FC Wezel Sport"),
    {
      kcvvTeamLabel: "B-Ploeg",
      competition: "4e Provinciale",
      venue: HOME_VENUE,
    },
  ),
  makeMatch(
    504,
    "2026-06-06T13:00:00Z",
    "15:00",
    opponent(756, "Verbroedering Hofstade-Zemst"),
    kcvv(),
  ),
  makeMatch(
    505,
    "2026-06-13T13:00:00Z",
    "10:30",
    kcvv(),
    opponent(230, "KCS Machelen"),
    { kcvvTeamLabel: "U17", competition: "Gewestelijke U17" },
  ),
];

export const mockUpcomingTwelve: UpcomingMatch[] = [
  ...mockUpcomingFive,
  makeMatch(
    506,
    "2026-06-20T13:00:00Z",
    "15:00",
    opponent(59, "KVC Wilrijk"),
    kcvv(),
  ),
  makeMatch(
    507,
    "2026-06-27T13:00:00Z",
    "14:00",
    kcvv(),
    opponent(628, "City Pirates"),
    { kcvvTeamLabel: "U15", competition: "Gewestelijke U15" },
  ),
  makeMatch(
    508,
    "2026-07-04T13:00:00Z",
    "15:00",
    kcvv(),
    opponent(448, "FC Wezel Sport"),
  ),
  makeMatch(
    509,
    "2026-07-11T13:00:00Z",
    "13:00",
    opponent(756, "Verbroedering Hofstade-Zemst"),
    kcvv(),
    { kcvvTeamLabel: "U13", competition: "Provinciaal U13" },
  ),
  makeMatch(
    510,
    "2026-07-18T13:00:00Z",
    "15:00",
    kcvv(),
    opponent(230, "KCS Machelen"),
  ),
  makeMatch(
    511,
    "2026-07-25T13:00:00Z",
    "15:00",
    opponent(59, "KVC Wilrijk"),
    kcvv(),
    { kcvvTeamLabel: "U21", competition: "Provinciaal U21" },
  ),
  makeMatch(
    512,
    "2026-08-01T13:00:00Z",
    "14:30",
    kcvv(),
    opponent(628, "City Pirates"),
  ),
];

export const mockUpcomingThree: UpcomingMatch[] = mockUpcomingFive.slice(0, 3);

/**
 * Every fixture belongs to one squad — the end-of-season tail, when only the
 * A-team has games left. The team filter has nothing to choose between and
 * drops out entirely rather than rendering a single dead chip beside "Alles".
 */
export const mockUpcomingSingleTeam: UpcomingMatch[] =
  mockUpcomingTwelve.filter((m) => m.kcvvTeamLabel === "A-Ploeg");
