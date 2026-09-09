/**
 * SquadGrid unit tests.
 *
 * Covers:
 *  - Auto-hides (null) when no players
 *  - Position grouping order: Doelmannen → Verdedigers → Middenvelders → Aanvallers
 *  - Trailing "Spelers" catch-all for unmapped positions (no player dropped)
 *  - Groups with no members are omitted
 *  - Every player renders a card
 *  - Single-group gate (#2638): a lone catch-all renders no heading; a lone
 *    REAL position bucket keeps its heading; two or more groups always do
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { PlayerVM } from "@/lib/repositories/player.repository";
import { SquadGrid } from "./SquadGrid";

function player(
  id: string,
  firstName: string,
  position: string | undefined,
  number?: number,
): PlayerVM {
  return {
    id,
    firstName,
    lastName: "Test",
    position,
    number,
    href: `/spelers/${id}`,
  };
}

const SQUAD: PlayerVM[] = [
  player("1", "Jonas", "Keeper", 1),
  player("2", "Bram", "Verdediger", 2),
  player("3", "Senne", "Verdediger", 3),
  player("4", "Yanni", "Middenvelder", 6),
  player("5", "Maxim", "Aanvaller", 9),
  player("6", "Jeugd", "Speler", 14),
];

describe("SquadGrid", () => {
  it("renders null when there are no players", () => {
    const { container } = render(<SquadGrid players={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders position groups in canonical order", () => {
    render(<SquadGrid players={SQUAD} />);
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual([
      "Doelmannen",
      "Verdedigers",
      "Middenvelders",
      "Aanvallers",
      "Spelers",
    ]);
  });

  it("places unmapped positions in the trailing Spelers group", () => {
    render(<SquadGrid players={SQUAD} />);
    const spelersSection = screen.getByRole("region", { name: "Spelers" });
    expect(spelersSection.textContent).toContain("Jeugd");
  });

  it("omits groups that have no members", () => {
    render(<SquadGrid players={[player("1", "Jonas", "Keeper", 1)]} />);
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(["Doelmannen"]);
  });

  it("renders a card for every player", () => {
    render(<SquadGrid players={SQUAD} />);
    expect(screen.getAllByTestId("player-card")).toHaveLength(SQUAD.length);
  });

  it("places an unauthored (undefined) position in the trailing Spelers group too (#2567)", () => {
    render(
      <SquadGrid
        players={[
          player("1", "Jonas", "Keeper", 1),
          player("7", "Onbekend", undefined, 21),
        ]}
      />,
    );
    const spelersSection = screen.getByRole("region", { name: "Spelers" });
    expect(spelersSection.textContent).toContain("Onbekend");
  });

  it("renders no heading when the single group is the catch-all (#2638)", () => {
    // No player's position is known — every player lands in the one
    // trailing "Spelers" catch-all, exactly the U9 shape the gate exists
    // for. The region itself still carries the label as its accessible
    // name; only the visible <h3> heading disappears.
    render(
      <SquadGrid
        players={[
          player("1", "Onbekend Een", undefined, 1),
          player("2", "Onbekend Twee", undefined, 2),
        ]}
      />,
    );
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.getByRole("region", { name: "Spelers" })).toBeInTheDocument();
  });

  it("keeps the heading when the single group is a real position bucket, not the catch-all (#2638)", () => {
    // A squad that is, today, entirely keepers is still a true
    // classification — "Doelmannen" separates this group from nothing only
    // by accident of today's data, not because the label is meaningless
    // the way an all-unknown "Spelers" run is. The gate must not hide this
    // just because it happens to be the only group.
    render(
      <SquadGrid
        players={[
          player("1", "Jonas", "Keeper", 1),
          player("2", "Lars", "Keeper", 16),
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Doelmannen" }),
    ).toBeInTheDocument();
  });

  it("still renders headings when the partition yields two or more groups (#2638)", () => {
    render(
      <SquadGrid
        players={[
          player("1", "Jonas", "Keeper", 1),
          player("7", "Onbekend", undefined, 21),
        ]}
      />,
    );
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(["Doelmannen", "Spelers"]);
  });
});
