import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompetitiveStatusLine } from "./CompetitiveStatusLine";

describe("CompetitiveStatusLine", () => {
  it("renders the not-in-competition line by default", () => {
    render(<CompetitiveStatusLine />);
    expect(
      screen.getByText(
        "De kalender voor dit seizoen is nog niet bekendgemaakt.",
      ),
    ).toBeInTheDocument();
  });

  it('renders the unavailable line for a permanent PSD failure (#2636 finding 3), on the locked failure string (#2433 rule 9/#2804) — unaccented, since tier="slot" has no emphasis axis', () => {
    render(<CompetitiveStatusLine variant="unavailable" />);
    expect(
      screen.getByText(
        "De wedstrijdgegevens zijn even niet beschikbaar. Probeer het later opnieuw.",
      ),
    ).toBeInTheDocument();
    // Never the pre-season copy — a broken read must not read as silence.
    expect(
      screen.queryByText(
        "De kalender voor dit seizoen is nog niet bekendgemaakt.",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders no heading of any level — it is a status line, not a section", () => {
    render(<CompetitiveStatusLine />);
    expect(screen.queryAllByRole("heading")).toHaveLength(0);
  });
});
