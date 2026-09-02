/**
 * TeamStaff unit tests.
 *
 * Covers:
 *  - resolveFunctionLabel: code map / passthrough / role-bucket fallback / "Staf"
 *  - Auto-hides (null) when staff empty
 *  - One mono-caps "Staf" heading precedes the run (#2477 rule 3)
 *  - One shared <PlayerCard> per member, garment="coat" (#2477 rule 1, #2485)
 *  - The run's grid matches <SquadGrid>'s column arithmetic (#2477 rule 2)
 *  - Name rhythm (first semibold + last italic) + function caption
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamStaff, resolveFunctionLabel } from "./TeamStaff";
import type { TeamStaffMemberData } from "./TeamStaff";

describe("resolveFunctionLabel", () => {
  it("maps known PSD codes to readable labels", () => {
    expect(resolveFunctionLabel("T1", undefined)).toBe("Hoofdtrainer");
    expect(resolveFunctionLabel("T2", undefined)).toBe("Assistent-trainer");
    expect(resolveFunctionLabel("TK", undefined)).toBe("Keeperstrainer");
    expect(resolveFunctionLabel("TVJO", undefined)).toBe("Jeugdcoördinator");
  });

  it("is case-insensitive on the code", () => {
    expect(resolveFunctionLabel("t1", undefined)).toBe("Hoofdtrainer");
  });

  it("passes through already-readable free-text values", () => {
    expect(resolveFunctionLabel("Hoofd Jeugdopleiding", undefined)).toBe(
      "Hoofd Jeugdopleiding",
    );
  });

  it("falls back to the role bucket when functionTitle is null", () => {
    expect(resolveFunctionLabel(undefined, "trainer")).toBe("Trainer");
    expect(resolveFunctionLabel(undefined, "afgevaardigde")).toBe(
      "Afgevaardigde",
    );
  });

  it("passes through a free-text board role instead of falling to 'Staf'", () => {
    // Board titles live in `role` with an empty PSD `functionTitle`.
    expect(resolveFunctionLabel(undefined, "Voorzitter")).toBe("Voorzitter");
    expect(resolveFunctionLabel(null, "Secretaris")).toBe("Secretaris");
    expect(resolveFunctionLabel("", "Penningmeester")).toBe("Penningmeester");
  });

  it("falls back to 'Staf' when nothing usable is present", () => {
    expect(resolveFunctionLabel(undefined, undefined)).toBe("Staf");
    expect(resolveFunctionLabel("", "")).toBe("Staf");
  });

  it("handles null inputs (raw CMS nullable fields)", () => {
    expect(resolveFunctionLabel(null, "trainer")).toBe("Trainer");
    expect(resolveFunctionLabel(null, null)).toBe("Staf");
  });

  it("prefers functionTitle over role bucket", () => {
    expect(resolveFunctionLabel("T1", "afgevaardigde")).toBe("Hoofdtrainer");
  });
});

const STAFF: TeamStaffMemberData[] = [
  {
    id: "1",
    firstName: "Karel",
    lastName: "Coach",
    functionTitle: "T1",
    imageUrl: "/player-fixtures/player-schulz.jpg",
  },
  {
    id: "2",
    firstName: "Bea",
    lastName: "Bijstand",
    role: "afgevaardigde",
  },
];

describe("TeamStaff", () => {
  it("renders null when staff is empty", () => {
    const { container } = render(<TeamStaff staff={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders one mono-caps 'Staf' heading for the run (#2477 rule 3)", () => {
    render(<TeamStaff staff={STAFF} />);
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(["Staf"]);
  });

  it("renders the run inside a landmark named 'Staf'", () => {
    render(<TeamStaff staff={STAFF} />);
    expect(screen.getByRole("region", { name: "Staf" })).toBeInTheDocument();
  });

  it("renders one shared <PlayerCard> per staff member", () => {
    render(<TeamStaff staff={STAFF} />);
    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
  });

  it("matches <SquadGrid>'s auto-fill column arithmetic — minmax(140px,1fr) (#2477 rule 2)", () => {
    render(<TeamStaff staff={STAFF} />);
    expect(
      screen.getByTestId("team-staff-grid").className.replace(/\s+/g, " "),
    ).toContain("grid-cols-[repeat(auto-fill,minmax(140px,1fr))]");
  });

  it("renders the photo state when imageUrl is present", () => {
    render(<TeamStaff staff={STAFF} />);
    const figures = screen.getAllByTestId("player-card-figure");
    expect(figures[0]?.getAttribute("data-state")).toBe("photo");
  });

  it("renders the coat-garment illustration when imageUrl is absent (#2485)", () => {
    render(<TeamStaff staff={STAFF} />);
    const figures = screen.getAllByTestId("player-card-figure");
    expect(figures[1]?.getAttribute("data-state")).toBe("illustration");
    const illustrations = screen.getAllByTestId("player-card-illustration");
    expect(illustrations[0]?.getAttribute("data-garment")).toBe("coat");
  });

  it("renders the resolved function label", () => {
    render(<TeamStaff staff={STAFF} />);
    expect(screen.getByText("Hoofdtrainer")).toBeInTheDocument();
    expect(screen.getByText("Afgevaardigde")).toBeInTheDocument();
  });

  it("renders the name with first semibold + last italic", () => {
    render(<TeamStaff staff={STAFF} />);
    const last = screen.getByText("Coach");
    expect(last.tagName).toBe("EM");
    expect(last.className).toContain("italic");
  });

  it("renders a card as a link to /staf/{psdId} when href is present", () => {
    render(<TeamStaff staff={[{ ...STAFF[0]!, href: "/staf/12345" }]} />);
    const card = screen.getByTestId("player-card");
    expect(card.tagName).toBe("A");
    expect(card).toHaveAttribute("href", "/staf/12345");
  });

  it("renders a card as a plain div when href is absent", () => {
    render(<TeamStaff staff={[STAFF[0]!]} />);
    const card = screen.getByTestId("player-card");
    expect(card.tagName).toBe("DIV");
    expect(card).not.toHaveAttribute("href");
  });

  it("never renders the round photo/monogram idiom TeamStaff used to own (#2477)", () => {
    render(<TeamStaff staff={STAFF} />);
    expect(screen.queryByText("BB")).toBeNull();
  });
});
