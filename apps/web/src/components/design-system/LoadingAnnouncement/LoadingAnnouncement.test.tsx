import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingAnnouncement } from "./LoadingAnnouncement";

describe("LoadingAnnouncement", () => {
  it("renders the canonical status shape — role, aria-busy, aria-live, sr-only", () => {
    render(<LoadingAnnouncement label="Nieuws laden…" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveClass("sr-only");
  });

  it("renders the given label verbatim", () => {
    render(<LoadingAnnouncement label="Wedstrijd laden…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Wedstrijd laden…");
  });

  it("is a <span>, not a landmark element", () => {
    render(<LoadingAnnouncement label="Club laden…" />);
    expect(screen.getByRole("status").tagName).toBe("SPAN");
  });
});
