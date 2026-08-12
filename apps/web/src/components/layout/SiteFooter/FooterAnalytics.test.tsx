import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from "@/lib/analytics/track-event";
import { FooterAnalytics } from "./FooterAnalytics";

const mockTrackEvent = vi.mocked(trackEvent);

describe("FooterAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fires footer_link_click with the destination and column", async () => {
    render(
      <FooterAnalytics>
        <a href="/hulp" data-footer-column="Bij de club">
          Hulp
        </a>
      </FooterAnalytics>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Hulp" }));

    expect(mockTrackEvent).toHaveBeenCalledWith("footer_link_click", {
      destination: "/hulp",
      category: "Bij de club",
    });
  });

  it("resolves a click on a child element up to the marked link", async () => {
    render(
      <FooterAnalytics>
        <a href="/test-route" data-footer-column="Ontdek">
          <span>Nieuws</span>
        </a>
      </FooterAnalytics>,
    );

    await userEvent.click(screen.getByText("Nieuws"));

    expect(mockTrackEvent).toHaveBeenCalledWith("footer_link_click", {
      destination: "/test-route",
      category: "Ontdek",
    });
  });

  it("ignores clicks on unmarked links", async () => {
    render(
      <FooterAnalytics>
        <a href="/privacy">Privacy</a>
      </FooterAnalytics>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Privacy" }));

    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("ignores a marked link whose column is empty", async () => {
    render(
      <FooterAnalytics>
        <a href="/x" data-footer-column="">
          Half-marked
        </a>
      </FooterAnalytics>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Half-marked" }));

    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("applies className to the delegating element so it can be the grid", () => {
    const { container } = render(
      <FooterAnalytics className="grid grid-cols-3">
        <span>child</span>
      </FooterAnalytics>,
    );

    expect(container.firstElementChild).toHaveClass("grid", "grid-cols-3");
  });
});
