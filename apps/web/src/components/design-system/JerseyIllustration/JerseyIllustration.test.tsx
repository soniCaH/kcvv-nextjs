import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JerseyIllustration } from "./JerseyIllustration";
import { computePlayerFigureVariant } from "./player-figure-variant";

describe("JerseyIllustration", () => {
  it("renders an aria-hidden wrapper with the default test id and cream-soft ground", () => {
    render(<JerseyIllustration variant="hero" seed="Maxim Breugelmans" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(wrapper).toHaveClass("bg-cream-soft");
  });

  it("forwards a custom data-testid (so each consumer keeps its existing id)", () => {
    render(
      <JerseyIllustration
        variant="card"
        seed="Maxim Breugelmans"
        data-testid="player-card-illustration"
      />,
    );
    expect(screen.getByTestId("player-card-illustration")).toBeInTheDocument();
    expect(screen.queryByTestId("jersey-illustration")).toBeNull();
  });

  it("renders the two-pass figure geometry from the shared paths module", () => {
    const { container } = render(
      <JerseyIllustration variant="hero" seed="Maxim Breugelmans" />,
    );
    // Head ellipse drawn once per pass, whatever the seed.
    expect(container.querySelectorAll("ellipse")).toHaveLength(2);
    // Fixed geometry present in every draw: underprint torso + 2 arms (3),
    // overprint torso + 2 arms + collar (4) — the shirt-pattern marks on top
    // of that vary by seed and are covered by `player-figure-variant.test.ts`.
    expect(container.querySelectorAll("path").length).toBeGreaterThanOrEqual(7);
  });

  it("applies the hero variant's relative fill-parent positioning", () => {
    render(<JerseyIllustration variant="hero" seed="Maxim Breugelmans" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveClass("relative", "h-full", "w-full");
  });

  it("applies the card variant's absolute inset-0 positioning", () => {
    render(<JerseyIllustration variant="card" seed="Maxim Breugelmans" />);
    const wrapper = screen.getByTestId("jersey-illustration");
    expect(wrapper).toHaveClass("absolute", "inset-0");
  });

  it("merges a custom className onto the wrapper", () => {
    render(
      <JerseyIllustration
        variant="card"
        seed="Maxim Breugelmans"
        className="opacity-50"
      />,
    );
    expect(screen.getByTestId("jersey-illustration")).toHaveClass("opacity-50");
  });

  describe("per-player variance (#2635)", () => {
    it("draws the same figure for the same seed on every render", () => {
      const first = render(
        <JerseyIllustration variant="card" seed="Maxim Breugelmans" />,
      );
      const firstMarkup = first.container.innerHTML;
      first.unmount();

      const second = render(
        <JerseyIllustration variant="card" seed="Maxim Breugelmans" />,
      );
      expect(second.container.innerHTML).toBe(firstMarkup);
    });

    it("draws a different figure for a different seed", () => {
      const a = render(
        <JerseyIllustration variant="card" seed="Maxim Breugelmans" />,
      );
      const b = render(
        <JerseyIllustration variant="card" seed="Lars De Smet" />,
      );
      expect(b.container.innerHTML).not.toBe(a.container.innerHTML);
    });

    it("applies the seed's computed registration offset as a CSS pixel translate", () => {
      const seed = "Maxim Breugelmans";
      const expected = computePlayerFigureVariant(seed);
      const { container } = render(
        <JerseyIllustration variant="card" seed={seed} />,
      );
      // Second of the two absolute inset-0 layers is the overprint pass —
      // the one registration offset applies to.
      const overprintLayer = container.querySelectorAll(
        '[data-testid="jersey-illustration"] > div',
      )[1] as HTMLElement;
      expect(overprintLayer.style.transform).toBe(
        `translate(${expected.registrationX}px, ${expected.registrationY}px)`,
      );
    });
  });
});
