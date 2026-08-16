/**
 * StandingsSection unit tests.
 *
 * Covers:
 *  - Renders one table per official competition, in feed order
 *  - Caption prefers Sanity's `divisionFull` over the provider's name
 *  - Caption falls through to the provider's name when Sanity carries none
 *  - Auto-hides (renders null) when the team publishes no table
 *  - Every table gets the KCVV highlight, not just the first
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { RankingEntry, RankingTable } from "@kcvv/api-contract";
import { StandingsSection } from "./StandingsSection";

function entry(overrides: Partial<RankingEntry> = {}): RankingEntry {
  return {
    position: 1,
    team_id: 1,
    team_name: "FC Test",
    played: 10,
    won: 6,
    drawn: 2,
    lost: 2,
    goals_for: 20,
    goals_against: 10,
    goal_difference: 10,
    points: 20,
    ...overrides,
  } as RankingEntry;
}

function table(overrides: Partial<RankingTable> = {}): RankingTable {
  return {
    competition_id: 222464,
    competition_name: "3de Afdeling Voetb Vl A",
    entries: [
      entry({ position: 1, team_id: 1, team_name: "Leader FC", points: 30 }),
      entry({ position: 2, team_id: 1235, team_name: "KCVV Elewijt" }),
    ],
    ...overrides,
  } as RankingTable;
}

const AUTUMN = table();
const SPRING = table({
  competition_id: 217486,
  competition_name: "Gewestelijk U13 BJ",
});

describe("StandingsSection", () => {
  it("renders one table per competition, in feed order", () => {
    render(<StandingsSection tables={[AUTUMN, SPRING]} />);

    const tables = screen.getAllByTestId("standings-table");
    expect(tables).toHaveLength(2);
    expect(screen.getByText("3de Afdeling Voetb Vl A")).toBeInTheDocument();
    expect(screen.getByText("Gewestelijk U13 BJ")).toBeInTheDocument();
  });

  it("prefers the editorial division name over the provider's", () => {
    render(
      <StandingsSection tables={[AUTUMN]} divisionFull="3e Nationale VV A" />,
    );

    expect(screen.getByText("3e Nationale VV A")).toBeInTheDocument();
    expect(
      screen.queryByText("3de Afdeling Voetb Vl A"),
    ).not.toBeInTheDocument();
  });

  it("falls through to the provider's name when Sanity carries none", () => {
    render(<StandingsSection tables={[AUTUMN]} divisionFull={null} />);

    expect(screen.getByText("3de Afdeling Voetb Vl A")).toBeInTheDocument();
  });

  it("renders nothing when the team publishes no table", () => {
    const { container } = render(<StandingsSection tables={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when every published table is still rowless", () => {
    // The contract permits a published-but-empty reeks. Counting tables rather
    // than rows would draw a seam and a nav entry around nothing.
    const { container } = render(
      <StandingsSection tables={[table({ entries: [] })]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("highlights the KCVV row in every table, not just the first", () => {
    render(
      <StandingsSection tables={[AUTUMN, SPRING]} highlightTeamId={1235} />,
    );

    expect(screen.getAllByTestId("standings-kcvv-row")).toHaveLength(2);
  });
});
