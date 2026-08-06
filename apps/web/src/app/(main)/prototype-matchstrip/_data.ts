/**
 * PROTOTYPE — throwaway, issue #2387. Delete before the PR.
 *
 * Fixed cases instead of the BFF: the question is "which layout survives a
 * long opponent name", so the hard cases must be deterministic and offline.
 */

export interface ProtoTeam {
  name: string;
  short: string;
  logo?: string;
}

export interface ProtoResult {
  id: number;
  opponent: ProtoTeam;
  kcvvHome: boolean;
  kcvvGoals: number;
  oppGoals: number;
  date: string;
  competition: string;
}

export interface ProtoFixture {
  id: number;
  opponent: ProtoTeam;
  kcvvHome: boolean;
  date: string;
  time: string;
  competition: string;
  venue?: string;
}

export interface ProtoCase {
  key: string;
  label: string;
  result: ProtoResult;
  fixture: ProtoFixture;
}

const KCVV_LOGO = "/images/logos/kcvv-logo.png";

export const KCVV: ProtoTeam = {
  name: "KCVV Elewijt",
  short: "KCVV",
  logo: KCVV_LOGO,
};

export const CASES: ProtoCase[] = [
  {
    key: "kort",
    label: "Korte naam · winst",
    result: {
      id: 1001,
      opponent: { name: "VK Linden", short: "LIN" },
      kcvvHome: true,
      kcvvGoals: 3,
      oppGoals: 1,
      date: "zo 3 aug",
      competition: "Competitie",
    },
    fixture: {
      id: 2001,
      opponent: { name: "VK Tildonk", short: "TIL" },
      kcvvHome: false,
      date: "za 8 aug",
      time: "18:00",
      competition: "Competitie",
      venue: "Sportveld Tildonk",
    },
  },
  {
    key: "lang",
    label: "Lange naam · winst (de echte casus)",
    result: {
      id: 1001,
      opponent: { name: "Ohr Huldenberg", short: "OHR" },
      kcvvHome: true,
      kcvvGoals: 3,
      oppGoals: 1,
      date: "zo 3 aug",
      competition: "Competitie",
    },
    fixture: {
      id: 2001,
      opponent: { name: "Boutersem United", short: "BOU" },
      kcvvHome: false,
      date: "za 8 aug",
      time: "18:00",
      competition: "Beker van Vlaanderen",
    },
  },
  {
    key: "extreem",
    label: "Extreem lange naam · verlies",
    result: {
      id: 1001,
      opponent: { name: "KVC Sint-Pieters-Leeuw United", short: "SPL" },
      kcvvHome: false,
      kcvvGoals: 0,
      oppGoals: 2,
      date: "zo 3 aug",
      competition: "Beker van Brabant",
    },
    fixture: {
      id: 2001,
      opponent: { name: "Racing Club Wolvertem Merchtem", short: "RCW" },
      kcvvHome: true,
      date: "za 8 aug",
      time: "19:30",
      competition: "Competitie",
    },
  },
  {
    key: "gelijk",
    label: "Gelijkspel · geen logo · geen terrein",
    result: {
      id: 1001,
      opponent: { name: "FC Zemst Sportief", short: "ZEM" },
      kcvvHome: true,
      kcvvGoals: 2,
      oppGoals: 2,
      date: "zo 3 aug",
      competition: "Vriendschappelijk",
    },
    fixture: {
      id: 2001,
      opponent: { name: "Sporting Elewijt", short: "SPE" },
      kcvvHome: false,
      date: "wo 12 aug",
      time: "20:00",
      competition: "Beker van Zemst",
    },
  },
];

export type Outcome = "win" | "draw" | "loss";

export function outcomeOf(r: ProtoResult): Outcome {
  if (r.kcvvGoals > r.oppGoals) return "win";
  if (r.kcvvGoals < r.oppGoals) return "loss";
  return "draw";
}

export const OUTCOME_WORD: Record<Outcome, string> = {
  win: "Winst",
  draw: "Gelijk",
  loss: "Verlies",
};

/**
 * The canonical outcome marker is `OUTCOME_UNDERLINE` from
 * `@/lib/utils/match-display` — a highlighter sweep BEHIND the score
 * (`inset 0 -9px 0 color-mix(...)`), not a rule under it, and a draw gets
 * nothing at all. Applied with the same 0/8px padding `TeamAgendaRow` uses.
 */
export function outcomeStyle(o: Outcome, shadow: string | undefined) {
  return shadow ? { boxShadow: shadow, padding: "0 8px" } : undefined;
}

/**
 * True scoreboard order — home team's goals first, as on a real scoreboard.
 * (Owner's call, 2026-08-06: not KCVV-first.)
 */
export function scoreboardScore(r: ProtoResult): string {
  return r.kcvvHome
    ? `${r.kcvvGoals}–${r.oppGoals}`
    : `${r.oppGoals}–${r.kcvvGoals}`;
}
