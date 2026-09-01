import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompetitiveStatusLine } from "./CompetitiveStatusLine";

describe("CompetitiveStatusLine", () => {
  it("renders the fixed status line", () => {
    render(<CompetitiveStatusLine />);
    expect(
      screen.getByText(
        "De kalender voor dit seizoen is nog niet bekendgemaakt.",
      ),
    ).toBeInTheDocument();
  });

  it("renders no heading of any level — it is a status line, not a section", () => {
    render(<CompetitiveStatusLine />);
    expect(screen.queryAllByRole("heading")).toHaveLength(0);
  });
});
