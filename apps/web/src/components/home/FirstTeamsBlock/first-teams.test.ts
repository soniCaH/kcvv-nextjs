import { describe, it, expect } from "vitest";
import type { Match } from "@/lib/effect/schemas";
import { deriveFirstTeamVM, firstTeamLabel } from "./first-teams";

describe("firstTeamLabel", () => {
  it("maps trailing-letter first-eleven slugs to X-ploeg", () => {
    expect(firstTeamLabel("eerste-elftallen-a", "Eerste Elftallen A")).toBe(
      "A-ploeg",
    );
    expect(firstTeamLabel("eerste-elftallen-b", "Eerste Elftallen B")).toBe(
      "B-ploeg",
    );
  });

  it("falls back to the CMS name when the slug has no trailing letter", () => {
    expect(firstTeamLabel("fc-weitse-gans", "FC WEITSE GANS")).toBe(
      "FC WEITSE GANS",
    );
  });
});

const NOW = new Date("2026-06-23T12:00:00Z");

/** Minimal structural Match factory — the derive logic only reads these fields. */
function match(p: {
  id: number;
  date: string;
  status: Match["status"];
  isHome?: boolean;
  homeName?: string;
  awayName?: string;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  competition?: string;
}): Match {
  return {
    id: p.id,
    date: new Date(p.date),
    time: p.time,
    home_team: { id: 1, name: p.homeName ?? "Home", score: p.homeScore },
    away_team: { id: 2, name: p.awayName ?? "Away", score: p.awayScore },
    status: p.status,
    competition: p.competition,
    is_home: p.isHome,
  } as unknown as Match;
}

const team = { label: "A-ploeg", slug: "a-ploeg", division: "3de Nationale" };

describe("deriveFirstTeamVM", () => {
  it("picks the most recent played match as the result", () => {
    const vm = deriveFirstTeamVM(
      team,
      [
        match({
          id: 1,
          date: "2026-06-01T15:00:00Z",
          status: "finished",
          isHome: true,
          homeScore: 1,
          awayScore: 0,
        }),
        match({
          id: 2,
          date: "2026-06-15T15:00:00Z",
          status: "finished",
          isHome: true,
          homeScore: 3,
          awayScore: 1,
        }),
        match({
          id: 3,
          date: "2026-06-08T15:00:00Z",
          status: "finished",
          isHome: false,
          homeScore: 2,
          awayScore: 2,
        }),
      ],
      NOW,
    );
    expect(vm.result?.id).toBe(2);
    expect(vm.result?.homeScore).toBe(3);
    expect(vm.result?.awayScore).toBe(1);
    // Emitted as a ScheduleMatch so it can render via the shared <TeamAgendaRow>.
    expect(vm.result?.status).toBe("finished");
  });

  it("picks the earliest upcoming scheduled match as the fixture", () => {
    const vm = deriveFirstTeamVM(
      team,
      [
        match({ id: 10, date: "2026-07-05T15:00:00Z", status: "scheduled" }),
        match({ id: 11, date: "2026-06-29T15:00:00Z", status: "scheduled" }),
      ],
      NOW,
    );
    expect(vm.fixture?.id).toBe(11);
    expect(vm.fixture?.status).toBe("scheduled");
  });

  it("ignores future matches for result and past matches for fixture", () => {
    const vm = deriveFirstTeamVM(
      team,
      [
        match({ id: 20, date: "2026-06-29T15:00:00Z", status: "scheduled" }),
        match({
          id: 21,
          date: "2026-06-10T15:00:00Z",
          status: "finished",
          isHome: true,
          homeScore: 0,
          awayScore: 0,
        }),
        // a past scheduled match (data lag) is neither a result nor a fixture
        match({ id: 22, date: "2026-06-01T15:00:00Z", status: "scheduled" }),
      ],
      NOW,
    );
    expect(vm.result?.id).toBe(21);
    expect(vm.fixture?.id).toBe(20);
  });

  it("carries both sides + isHome onto the result ScheduleMatch", () => {
    // Outcome is no longer derived here — <TeamAgendaRow> recomputes it from
    // scores + isHome + status. The derivation must forward those fields intact.
    const vm = deriveFirstTeamVM(
      team,
      [
        match({
          id: 1,
          date: "2026-06-10T15:00:00Z",
          status: "finished",
          isHome: false,
          homeName: "Overijse",
          awayName: "KCVV",
          homeScore: 2,
          awayScore: 0,
        }),
      ],
      NOW,
    );
    expect(vm.result?.homeTeam.name).toBe("Overijse");
    expect(vm.result?.awayTeam.name).toBe("KCVV");
    expect(vm.result?.isHome).toBe(false);
    expect(vm.result?.homeScore).toBe(2);
    expect(vm.result?.awayScore).toBe(0);
  });

  it("keeps both fixture sides so the row can pick the opponent from isHome", () => {
    const home = deriveFirstTeamVM(
      team,
      [
        match({
          id: 1,
          date: "2026-06-29T15:00:00Z",
          status: "scheduled",
          isHome: true,
          homeName: "KCVV",
          awayName: "Hasselt",
        }),
      ],
      NOW,
    );
    expect(home.fixture?.homeTeam.name).toBe("KCVV");
    expect(home.fixture?.awayTeam.name).toBe("Hasselt");
    expect(home.fixture?.isHome).toBe(true);

    const away = deriveFirstTeamVM(
      team,
      [
        match({
          id: 2,
          date: "2026-06-29T15:00:00Z",
          status: "scheduled",
          isHome: false,
          homeName: "Overijse",
          awayName: "KCVV",
        }),
      ],
      NOW,
    );
    expect(away.fixture?.homeTeam.name).toBe("Overijse");
    expect(away.fixture?.isHome).toBe(false);
  });

  it("omits result/fixture when absent and never drops the team identity", () => {
    const onlyResult = deriveFirstTeamVM(
      team,
      [
        match({
          id: 1,
          date: "2026-06-10T15:00:00Z",
          status: "finished",
          isHome: true,
          homeScore: 1,
          awayScore: 0,
        }),
      ],
      NOW,
    );
    expect(onlyResult.result).toBeDefined();
    expect(onlyResult.fixture).toBeUndefined();

    const empty = deriveFirstTeamVM(team, [], NOW);
    expect(empty.result).toBeUndefined();
    expect(empty.fixture).toBeUndefined();
    expect(empty.label).toBe("A-ploeg");
    expect(empty.division).toBe("3de Nationale");
  });

  it("leaves scores undefined on the ScheduleMatch when the source has none", () => {
    // A finished match without a recorded scoreline stays scoreless — the row
    // then falls back to the kickoff time rather than inventing an outcome.
    const noScore = deriveFirstTeamVM(
      team,
      [
        match({
          id: 1,
          date: "2026-06-10T15:00:00Z",
          status: "finished",
          isHome: true,
        }),
      ],
      NOW,
    );
    expect(noScore.result?.homeScore).toBeUndefined();
    expect(noScore.result?.awayScore).toBeUndefined();
  });
});
