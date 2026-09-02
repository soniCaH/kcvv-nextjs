import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a single element carrying aria-hidden", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild;
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("gates the pulse on prefers-reduced-motion (motion-safe:)", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.className).toContain(
      "motion-safe:animate-pulse",
    );
  });

  it("defaults to the cream tone's paper-edge fill — the only fill far enough from cream to register", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.className).toContain("bg-paper-edge");
  });

  it("dark tone renders the translucent-cream fill, never paper-edge", () => {
    const { container } = render(<Skeleton tone="dark" />);
    const className = container.firstElementChild?.className ?? "";
    expect(className).toContain("bg-cream/20");
    expect(className).not.toContain("bg-paper-edge");
  });

  it("deep tone renders the ink/15 fill calibrated against cream-deep, never paper-edge", () => {
    const { container } = render(<Skeleton tone="deep" />);
    const className = container.firstElementChild?.className ?? "";
    expect(className).toContain("bg-ink/15");
    expect(className).not.toContain("bg-paper-edge");
  });

  it("merges caller className (sizing/position) alongside the owned classes", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const className = container.firstElementChild?.className ?? "";
    expect(className).toContain("h-4");
    expect(className).toContain("w-32");
    expect(className).toContain("bg-paper-edge");
  });
});
