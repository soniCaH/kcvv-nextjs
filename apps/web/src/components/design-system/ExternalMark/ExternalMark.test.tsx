import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalMark } from "./ExternalMark";

describe("<ExternalMark>", () => {
  it("renders the aria-hidden glyph and the Dutch sr-only announcement together", () => {
    const { container } = render(<ExternalMark />);
    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeTruthy();
    expect(
      screen.getByText("(opent in een nieuw tabblad)", { exact: false }),
    ).toHaveClass("sr-only");
  });

  it("renders nothing else — no visible text of its own", () => {
    render(<ExternalMark />);
    // The sr-only span is present in the DOM (for assistive tech) but the
    // glyph itself carries no accessible name — the mark rides the link's
    // own text, it never introduces its own.
    expect(screen.queryByRole("img", { name: /./ })).not.toBeInTheDocument();
  });
});
