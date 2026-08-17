import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  BracketAffordance,
  BRACKET_GLYPH,
  bracketAffordanceHtml,
} from "./BracketAffordance";

describe("BracketAffordance", () => {
  it("renders [×] for the close affordance", () => {
    const { container } = render(<BracketAffordance glyph="close" />);
    expect(container.firstChild).toHaveTextContent("[×]");
  });

  it("renders [?] for the help affordance", () => {
    const { container } = render(<BracketAffordance glyph="help" />);
    expect(container.firstChild).toHaveTextContent("[?]");
  });

  it("marks the glyph in a data attribute", () => {
    const { container } = render(<BracketAffordance glyph="close" />);
    expect(container.firstChild).toHaveAttribute("data-glyph", "close");
  });

  // The whole point of D4: the bracket is punctuation, so a screen reader
  // must never announce it — the host control's own name carries the action.
  it("is always hidden from the accessibility tree", () => {
    const { container } = render(<BracketAffordance glyph="help" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("never contributes to a control's accessible name", () => {
    render(
      <button type="button" aria-label="Sluit melding">
        <BracketAffordance glyph="close" />
      </button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Sluit melding");
  });

  it("sets mono at the 11px label step, never a smaller size", () => {
    const { container } = render(<BracketAffordance glyph="close" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("font-mono");
    expect(el.className).toMatch(/(?:^|\s)text-label(?:\s|$)/);
    expect(el.className).not.toContain("text-label-sm");
  });

  it("sets no colour of its own — it inherits the icon it rides beside", () => {
    const { container } = render(<BracketAffordance glyph="close" />);
    expect((container.firstChild as HTMLElement).className).not.toMatch(
      /text-(ink|cream|alert|warning|jersey)/,
    );
  });

  it("merges a caller className", () => {
    const { container } = render(
      <BracketAffordance glyph="close" className="ml-2" />,
    );
    expect((container.firstChild as HTMLElement).className).toContain("ml-2");
  });
});

describe("bracketAffordanceHtml", () => {
  it("emits the same glyphs as the component", () => {
    expect(bracketAffordanceHtml("close")).toContain(BRACKET_GLYPH.close);
    expect(bracketAffordanceHtml("help")).toContain(BRACKET_GLYPH.help);
  });

  it("emits aria-hidden markup so the injected label keeps its name", () => {
    expect(bracketAffordanceHtml("close")).toContain('aria-hidden="true"');
  });

  // No classes: inside `#cc-main` the library's unlayered `all: unset` beats
  // any layered utility, so the register and the size come from the host
  // control by inheritance.
  it("carries no classes, so it inherits the host control's register", () => {
    expect(bracketAffordanceHtml("help")).not.toContain("class=");
  });
});
