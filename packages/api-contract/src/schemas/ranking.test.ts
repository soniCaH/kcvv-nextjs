import { describe, it, expect } from "vitest";
import { Schema as S } from "effect";
import {
  RankingEntry,
  RankingArray,
  RankingTable,
  RankingTableArray,
} from "./ranking";

const validEntry = {
  position: 1,
  team_id: 42,
  team_name: "KCVV Elewijt",
  team_logo: "/logo.png",
  played: 20,
  won: 14,
  drawn: 3,
  lost: 3,
  goals_for: 45,
  goals_against: 18,
  goal_difference: 27,
  points: 45,
  form: "WWDLW",
};

describe("RankingEntry schema", () => {
  it("decodes a valid RankingEntry", () => {
    const result = S.decodeUnknownSync(RankingEntry)(validEntry);
    expect(result.position).toBe(1);
    expect(result.team_name).toBe("KCVV Elewijt");
    expect(result.points).toBe(45);
  });

  it("decodes without optional fields", () => {
    const { team_logo: _, form: __, ...minimal } = validEntry;
    const result = S.decodeUnknownSync(RankingEntry)(minimal);
    expect(result.team_logo).toBeUndefined();
    expect(result.form).toBeUndefined();
  });

  it("throws on missing required field", () => {
    const { points: _, ...noPoints } = validEntry;
    expect(() => S.decodeUnknownSync(RankingEntry)(noPoints)).toThrow();
  });
});

describe("RankingArray schema", () => {
  it("decodes a valid RankingArray", () => {
    const result = S.decodeUnknownSync(RankingArray)([validEntry]);
    expect(result).toHaveLength(1);
    expect(result[0].position).toBe(1);
  });

  it("decodes an empty array", () => {
    const result = S.decodeUnknownSync(RankingArray)([]);
    expect(result).toHaveLength(0);
  });
});

const validTable = {
  competition_id: 222464,
  competition_name: "3de Afdeling Voetb Vl A",
  entries: [validEntry],
};

describe("RankingTable schema", () => {
  it("decodes a valid RankingTable", () => {
    const result = S.decodeUnknownSync(RankingTable)(validTable);
    expect(result.competition_id).toBe(222464);
    expect(result.competition_name).toBe("3de Afdeling Voetb Vl A");
    expect(result.entries).toHaveLength(1);
  });

  it("decodes a table with no rows — an unpublished reeks", () => {
    const result = S.decodeUnknownSync(RankingTable)({
      ...validTable,
      entries: [],
    });
    expect(result.entries).toHaveLength(0);
  });

  it("throws without the competition id — the only stable key for a phase", () => {
    const { competition_id: _, ...noId } = validTable;
    expect(() => S.decodeUnknownSync(RankingTable)(noId)).toThrow();
  });
});

describe("RankingTableArray schema", () => {
  it("decodes the two tables a youth team ends the season with", () => {
    const result = S.decodeUnknownSync(RankingTableArray)([
      validTable,
      { ...validTable, competition_id: 217486, competition_name: "Gewestelijk U13 BJ" },
    ]);
    expect(result).toHaveLength(2);
    expect(result[1].competition_id).toBe(217486);
  });

  it("decodes an empty array", () => {
    expect(S.decodeUnknownSync(RankingTableArray)([])).toHaveLength(0);
  });
});
