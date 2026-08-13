/**
 * YouthDirectory unit tests.
 *
 * Covers:
 *  - Auto-hide (null) when no divisions have teams
 *  - Empty groups omitted; only populated divisions render
 *  - Age-code card per team, linking to its detail
 *  - Rangeless group (Reserven): bare heading, name caption, initialled jersey
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { YouthDivisionGroup } from "@/lib/utils/group-teams";
import { YouthDirectory } from "./YouthDirectory";
import { reservenTeam, youthTeam as team } from "./youth-directory.fixtures";

const divisions: YouthDivisionGroup[] = [
  { label: "Bovenbouw", range: "U17–U21", teams: [team("U17")] },
  { label: "Middenbouw", range: "U12–U16", teams: [] },
  { label: "Onderbouw", range: "U6–U11", teams: [team("U9"), team("U6")] },
];

describe("YouthDirectory", () => {
  it("returns null when no division has teams", () => {
    const { container } = render(
      <YouthDirectory
        divisions={[
          { label: "Bovenbouw", range: "U17–U21", teams: [] },
          { label: "Middenbouw", range: "U12–U16", teams: [] },
        ]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("omits empty divisions and renders only populated ones", () => {
    render(<YouthDirectory divisions={divisions} />);
    const groups = screen.getAllByTestId("youth-division");
    expect(groups).toHaveLength(2); // Bovenbouw + Onderbouw (Middenbouw empty)
  });

  it("renders an age-code card per team linking to its detail", () => {
    render(<YouthDirectory divisions={divisions} />);
    const cards = screen.getAllByTestId("youth-team-card");
    expect(cards).toHaveLength(3);
    const u17 = cards.find((c) => c.textContent?.includes("U17"));
    expect(u17?.getAttribute("href")).toBe("/ploegen/kcvv-elewijt-u17");
  });

  it("renders the squad photo when a team has one", () => {
    render(
      <YouthDirectory
        divisions={[
          {
            label: "Bovenbouw",
            range: "U17–U21",
            teams: [team("U17", "/images/ploeg.jpg")],
          },
        ]}
      />,
    );
    // #2559 rule 1: the card title names the team, so the squad photo is
    // decorative — and "ploegfoto" was one of three nouns for one photograph.
    expect(document.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("falls back to the JerseyShirt illustration when a team has no photo", () => {
    render(
      <YouthDirectory
        divisions={[
          { label: "Bovenbouw", range: "U17–U21", teams: [team("U17")] },
        ]}
      />,
    );
    // No squad <img>; the JerseyShirt fallback renders in its place and is
    // silent (#2559 rule 4) — the artefact answers to the same rule as the
    // photo it stands in for.
    expect(document.querySelector("img")).toBeNull();
    expect(document.querySelector("figure[aria-hidden]")).toBeInTheDocument();
  });

  describe("a group with no range (#2414)", () => {
    const reserven: YouthDivisionGroup[] = [
      { label: "Reserven", teams: [reservenTeam()] },
    ];

    it("renders the heading bare, with no ` · range` separator", () => {
      render(<YouthDirectory divisions={reserven} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Reserven");
      expect(heading.textContent).not.toContain("·");
    });

    it("still renders the group's card, linking to its detail", () => {
      render(<YouthDirectory divisions={reserven} />);
      const cards = screen.getAllByTestId("youth-team-card");
      expect(cards).toHaveLength(1);
      expect(cards[0].getAttribute("href")).toBe("/ploegen/reserven");
    });

    it("captions by name rather than by the senior age code 'A'", () => {
      render(<YouthDirectory divisions={reserven} />);
      const card = screen.getByTestId("youth-team-card");
      // "A" alone would read as the A-ploeg; the name is the honest caption,
      // and it must not also repeat as the division sub-caption.
      expect(card.textContent).toContain("Reserven");
      expect(card.textContent).not.toMatch(/\bA\b/);
      expect(card.textContent?.match(/Reserven/g)).toHaveLength(1);
    });

    it("puts the name's initial on the jersey, not the whole word", () => {
      render(<YouthDirectory divisions={reserven} />);
      const jersey = document.querySelector(
        "figure[aria-hidden]",
      ) as HTMLElement;
      expect(jersey).toHaveTextContent("R");
      expect(jersey.textContent).not.toContain("Reserven");
    });
  });
});
