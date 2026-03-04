import { describe, it, expect } from "vitest";
import { Schema as S } from "effect";
import {
  FootbalistoMatchesArray,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingArray,
} from "./schemas";

const rawMatch = {
  id: 1,
  teamId: 1,
  teamName: "KCVV Elewijt A",
  timestamp: 1737388800,
  age: "Seniors",
  date: "2025-01-15 15:00",
  time: "1970-01-01 15:00",
  homeClub: { id: 123, name: "KCVV Elewijt" },
  awayClub: { id: 456, name: "Opponent FC" },
  goalsHomeTeam: 3,
  goalsAwayTeam: 1,
  homeTeamId: 1,
  awayTeamId: 2,
  status: 1,
  competitionType: "3de Nationale",
  viewGameReport: true,
};

describe("FootbalistoMatchesArray", () => {
  it("decodes a valid match array", () => {
    const result = S.decodeUnknownSync(FootbalistoMatchesArray)([rawMatch]);
    expect(result[0]?.id).toBe(1);
    expect(result[0]?.status).toBe(1);
  });

  it("decodes a match without optional fields (teamId, age)", () => {
    const { teamId: _, age: __, ...minimalMatch } = rawMatch;
    const result = S.decodeUnknownSync(FootbalistoMatchesArray)([minimalMatch]);
    expect(result[0]?.teamId).toBeUndefined();
  });
});

describe("FootbalistoMatchDetailResponse", () => {
  it("decodes a response without lineup", () => {
    const raw = {
      general: {
        id: 1,
        date: "2025-01-15 15:00",
        homeClub: { id: 123, name: "KCVV Elewijt" },
        awayClub: { id: 456, name: "Opponent FC" },
        goalsHomeTeam: 3,
        goalsAwayTeam: 1,
        competitionType: "3de Nationale",
        viewGameReport: true,
        status: 1,
      },
    };
    const result = S.decodeUnknownSync(FootbalistoMatchDetailResponse)(raw);
    expect(result.general.id).toBe(1);
    expect(result.lineup).toBeUndefined();
  });
});

describe("FootbalistoRankingArray", () => {
  it("decodes a ranking response", () => {
    const raw = [
      {
        name: "3de Nationale A",
        type: "LEAGUE",
        teams: [
          {
            id: 1,
            rank: 1,
            matchesPlayed: 20,
            wins: 15,
            draws: 3,
            losses: 2,
            goalsScored: 45,
            goalsConceded: 20,
            points: 48,
            team: {
              id: 101,
              club: {
                id: 123,
                localName: "KCVV Elewijt",
                name: "KCVV Elewijt",
              },
            },
          },
        ],
      },
    ];
    const result = S.decodeUnknownSync(FootbalistoRankingArray)(raw);
    expect(result[0]?.teams[0]?.rank).toBe(1);
  });
});
