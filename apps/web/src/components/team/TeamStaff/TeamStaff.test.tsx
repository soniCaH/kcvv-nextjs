/**
 * TeamStaff unit tests.
 *
 * Covers:
 *  - resolveFunctionLabel: code map / passthrough / role-bucket fallback / "Staf"
 *  - Auto-hides (null) when staff empty
 *  - `heading` drives the run's heading text + accessible name — no baked
 *    default (#2575 review)
 *  - One shared <PlayerCard> per member, garment="coat", blendPhoto={false},
 *    linkAffordance (#2477 rule 1, #2485, #2575 review)
 *  - Whitespace-only imageUrl/href normalise to absent
 *  - Resolved function label reaches the card
 *
 * Card-level rendering (photo/illustration state, name rhythm, link-vs-div,
 * the shared grid track) is `<PlayerCard>`'s and `<PersonCardRun>`'s own
 * test responsibility — not restated here.
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
    const { container } = render(<TeamStaff staff={[]} heading="Staf" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders `heading` as both the run's heading text and its accessible name — no baked default (#2575 review)", () => {
    render(<TeamStaff staff={STAFF} heading="De leden" />);
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(
      "De leden",
    );
    expect(
      screen.getByRole("region", { name: "De leden" }),
    ).toBeInTheDocument();
  });

  it("renders one shared <PlayerCard> per staff member", () => {
    render(<TeamStaff staff={STAFF} heading="Staf" />);
    expect(screen.getAllByTestId("player-card")).toHaveLength(2);
  });

  it("renders the coat-garment illustration, unblended photo, and the link affordance (#2485 / #2575 review)", () => {
    render(
      <TeamStaff
        staff={[{ ...STAFF[0]!, href: "/staf/12345" }, STAFF[1]!]}
        heading="Staf"
      />,
    );
    const illustrations = screen.getAllByTestId("player-card-illustration");
    expect(illustrations[0]?.getAttribute("data-garment")).toBe("coat");

    const photoImg = screen
      .getAllByTestId("player-card-figure")[0]
      ?.querySelector("img");
    expect(photoImg?.className.split(/\s+/)).not.toContain(
      "mix-blend-multiply",
    );

    expect(
      screen.getByTestId("player-card-link-affordance"),
    ).toBeInTheDocument();
  });

  it("renders the resolved function label", () => {
    render(<TeamStaff staff={STAFF} heading="Staf" />);
    expect(screen.getByText("Hoofdtrainer")).toBeInTheDocument();
    expect(screen.getByText("Afgevaardigde")).toBeInTheDocument();
  });

  it("normalises a whitespace-only imageUrl/href to absent", () => {
    render(
      <TeamStaff
        staff={[
          {
            id: "3",
            firstName: "Wout",
            lastName: "Wit",
            imageUrl: "   ",
            href: "  ",
          },
        ]}
        heading="Staf"
      />,
    );
    expect(
      screen.getByTestId("player-card-figure").getAttribute("data-state"),
    ).toBe("illustration");
    expect(screen.getByTestId("player-card").tagName).toBe("DIV");
  });
});
