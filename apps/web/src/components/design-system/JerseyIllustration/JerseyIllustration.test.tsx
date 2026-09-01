import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JerseyIllustration } from "./JerseyIllustration";
import { computePlayerFigureVariant } from "./player-figure-variant";

describe("JerseyIllustration", () => {
  it("renders an aria-hidden wrapper with the default test id and cream-soft ground", () => {
    render(<JerseyIllustration variant="hero" seed="9f1a2b3c" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(wrapper).toHaveClass("bg-cream-soft");
  });

  it("forwards a custom data-testid (so each consumer keeps its existing id)", () => {
    render(
      <JerseyIllustration
        variant="card"
        seed="9f1a2b3c"
        data-testid="player-card-illustration"
      />,
    );
    expect(screen.getByTestId("player-card-illustration")).toBeInTheDocument();
    expect(screen.queryByTestId("jersey-illustration")).toBeNull();
  });

  it("renders the two-pass figure geometry from the shared paths module", () => {
    const { container } = render(
      <JerseyIllustration variant="hero" seed="9f1a2b3c" />,
    );
    // Head ellipse drawn once per pass, whatever the seed.
    expect(container.querySelectorAll("ellipse")).toHaveLength(2);
    // Fixed geometry present in every draw: underprint torso + 2 arms (3),
    // overprint torso + 2 arms + collar (4) — the shirt-pattern marks on top
    // of that vary by seed and are covered by `player-figure-variant.test.ts`.
    expect(container.querySelectorAll("path").length).toBeGreaterThanOrEqual(7);
  });

  it("applies the hero variant's relative fill-parent positioning", () => {
    render(<JerseyIllustration variant="hero" seed="9f1a2b3c" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveClass("relative", "h-full", "w-full");
  });

  it("applies the card variant's absolute inset-0 positioning", () => {
    render(<JerseyIllustration variant="card" seed="9f1a2b3c" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveClass("absolute", "inset-0");
  });

  it("merges a custom className onto the wrapper", () => {
    render(
      <JerseyIllustration
        variant="card"
        seed="9f1a2b3c"
        className="opacity-50"
      />,
    );
    expect(screen.getByTestId("jersey-illustration")).toHaveClass("opacity-50");
  });

  describe("per-player variance (#2635)", () => {
    // The seed → lever equality/inequality itself is covered exhaustively
    // in `player-figure-variant.test.ts`. This one test is component-level:
    // it exercises the actual render path (does the `seed` prop reach the
    // DOM output byte-for-byte the same way twice), which a pure-function
    // test of the variant module alone can't.
    it("renders identically for a repeated seed and differently for a new one", () => {
      const first = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" />,
      );
      const firstMarkup = first.container.innerHTML;
      first.unmount();

      const second = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" />,
      );
      expect(second.container.innerHTML).toBe(firstMarkup);
      second.unmount();

      const third = render(
        <JerseyIllustration variant="card" seed="4d5e6f70" />,
      );
      expect(third.container.innerHTML).not.toBe(firstMarkup);
    });

    it("applies the seed's computed registration offset as an SVG-space translate on the overprint pass, not a CSS pixel offset", () => {
      const seed = "9f1a2b3c";
      const expected = computePlayerFigureVariant(seed);
      const { container } = render(
        <JerseyIllustration variant="card" seed={seed} />,
      );
      // Second <svg> is the overprint pass; its outermost <g> is the
      // registration wrapper, in the SAME viewBox units as every other
      // lever — a CSS-pixel offset on the wrapping <div> would put the
      // registration draw outside the geometry the containment guard
      // bounds (code review finding #1).
      const overprintSvg = container.querySelectorAll("svg")[1];
      const registrationGroup = overprintSvg?.querySelector("g");
      expect(registrationGroup?.getAttribute("transform")).toBe(
        `translate(${expected.registrationX.toFixed(2)} ${expected.registrationY.toFixed(2)})`,
      );
    });
  });

  describe("garment (#2485 / #2574)", () => {
    it("defaults to the jersey garment — jersey-deep underprint, ink overprint, V-collar drawn", () => {
      const { container } = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" />,
      );
      expect(screen.getByTestId("jersey-illustration")).toHaveAttribute(
        "data-garment",
        "jersey",
      );
      const underprintGroup = container.querySelector("svg > g");
      expect(underprintGroup).toHaveAttribute(
        "fill",
        "var(--color-jersey-deep)",
      );
      const overprintSvg = container.querySelectorAll("svg")[1];
      const overprintGroup = overprintSvg?.querySelector("g > g");
      expect(overprintGroup).toHaveAttribute("stroke", "var(--color-ink)");
      expect(
        container.querySelector(`path[d="M 92 132 L 110 156 L 128 132"]`),
      ).toBeInTheDocument();
    });

    it('garment="coat" inverts the two-pass palette and swaps the collar for lapels, placket and notch ticks', () => {
      const { container } = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" garment="coat" />,
      );
      expect(screen.getByTestId("jersey-illustration")).toHaveAttribute(
        "data-garment",
        "coat",
      );
      const underprintGroup = container.querySelector("svg > g");
      expect(underprintGroup).toHaveAttribute("fill", "var(--color-ink)");
      const overprintSvg = container.querySelectorAll("svg")[1];
      const overprintGroup = overprintSvg?.querySelector("g > g");
      expect(overprintGroup).toHaveAttribute(
        "stroke",
        "var(--color-jersey-deep)",
      );
      // The V-collar is gone; the lapel path stands in for it.
      expect(
        container.querySelector(`path[d="M 92 132 L 110 156 L 128 132"]`),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector(`path[d="M 84 137 L 110 198 L 136 137"]`),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`path[d="M 110 198 L 110 300"]`),
      ).toBeInTheDocument();
    });

    it("keeps the head, torso and shoulder-bump geometry byte-identical between garments — only the garment-front lines and palette differ", () => {
      const jersey = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" />,
      );
      const jerseyEllipses = jersey.container.querySelectorAll("ellipse");
      const jerseyTorsoFill = jersey.container.querySelector(
        `path[d="${"M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300 Z"}"]`,
      );
      expect(jerseyTorsoFill).toBeInTheDocument();
      jersey.unmount();

      const coat = render(
        <JerseyIllustration variant="card" seed="9f1a2b3c" garment="coat" />,
      );
      const coatEllipses = coat.container.querySelectorAll("ellipse");
      expect(coatEllipses).toHaveLength(jerseyEllipses.length);
      expect(
        coat.container.querySelector(
          `path[d="${"M 30 300 L 40 168 Q 60 138 110 130 Q 160 138 180 168 L 190 300 Z"}"]`,
        ),
      ).toBeInTheDocument();
      coat.unmount();
    });
  });
});
