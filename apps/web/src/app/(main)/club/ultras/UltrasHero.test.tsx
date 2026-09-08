import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UltrasHero } from "./UltrasHero";

vi.mock("next/navigation", () => ({
  usePathname: () => "/club/ultras",
}));

const FB = "https://www.facebook.com/KCVV.ULTRAS.55/";

describe("UltrasHero", () => {
  it("renders the kicker and the poster headline", () => {
    render(<UltrasHero joinHref={FB} />);
    expect(
      screen.getByText(/Supporters · KCVV Ultra's 55/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /de luidste hoek/i }),
    ).toBeInTheDocument();
  });

  it("renders a hardened external join CTA carrying the analytics marker", () => {
    render(<UltrasHero joinHref={FB} />);
    const cta = screen.getByRole("link", { name: /word lid via facebook/i });
    expect(cta).toHaveAttribute("href", FB);
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
    expect(cta).toHaveAttribute("data-ultras-join");
  });

  // #2547 rule 1 — the label already names the destination ("via Facebook"),
  // so the control earns no external mark at all; the old literal ↗ dies.
  it("carries no literal external-arrow character — the label already names Facebook", () => {
    render(<UltrasHero joinHref={FB} />);
    const cta = screen.getByRole("link", { name: /word lid via facebook/i });
    expect(cta.textContent).not.toContain("↗");
  });

  it("renders no up-link when none is passed", () => {
    render(<UltrasHero joinHref={FB} />);
    expect(screen.queryByTestId("up-link")).not.toBeInTheDocument();
  });

  it("renders the up-link inside the band, tone-swapped to cream, left-aligned", () => {
    // #2428/#2442 — this hero is one of the site's four dark, flush
    // openings; the chip lives inside the band, and always at the
    // container's left edge even though this hero is centred.
    render(
      <UltrasHero joinHref={FB} upLink={{ href: "/club", label: "De club" }} />,
    );
    const upLink = screen.getByTestId("up-link");
    expect(upLink).toHaveAttribute("data-tone", "cream");
    expect(upLink).toHaveAttribute("href", "/club");
    expect(upLink).toHaveTextContent("De club");
    expect(upLink).toHaveClass("self-start");
  });
});
