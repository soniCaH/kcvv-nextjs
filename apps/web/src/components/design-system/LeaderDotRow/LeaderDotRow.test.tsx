import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LeaderDotRow } from "./LeaderDotRow";

describe("LeaderDotRow", () => {
  it("renders the label and the value", () => {
    render(<LeaderDotRow label="Eerste elftal A" value="2e Prov. B" />);
    expect(screen.getByText("Eerste elftal A")).toBeInTheDocument();
    expect(screen.getByText("2e Prov. B")).toBeInTheDocument();
  });

  it("hides the leader-dot filler from assistive tech", () => {
    const { container } = render(
      <LeaderDotRow label="Eerste elftal A" value="2e Prov. B" />,
    );
    const filler = container.querySelector("[data-leader-fill]");
    expect(filler).not.toBeNull();
    expect(filler).toHaveAttribute("aria-hidden", "true");
  });

  it("gives a linked row an accessible name of label + value, with no dots", () => {
    render(
      <LeaderDotRow
        href="/ploegen/eerste-elftallen-a"
        label="Eerste elftal A"
        value="2e Prov. B"
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("Eerste elftal A 2e Prov. B");
    expect(link).toHaveAttribute("href", "/ploegen/eerste-elftallen-a");
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["an empty string", ""],
  ])("marks a value that is %s as visibly absent", (_label, value) => {
    const { container } = render(<LeaderDotRow label="U15" value={value} />);
    const absent = container.querySelector("[data-value-absent]");
    expect(absent).not.toBeNull();
    expect(absent).toHaveTextContent("—");
    // The row still renders a value slot rather than dropping the pair.
    expect(container.querySelector("[data-leader-fill]")).not.toBeNull();
  });

  it("keeps the absent marker out of a linked row's accessible name", () => {
    render(<LeaderDotRow href="/ploegen/kcvve-u15" label="U15" />);
    expect(screen.getByRole("link")).toHaveAccessibleName("U15");
  });

  it("renders no link when no href is given", () => {
    render(<LeaderDotRow label="Quiznight" value="18·04·26" />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders one root element, so a list consumer owns its own <li>", () => {
    const { container } = render(
      <LeaderDotRow href="/evenementen/quiznight" label="Quiznight" />,
    );
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.tagName).toBe("A");
  });
});
