import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const trackEvent = vi.fn();

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: (...args: unknown[]) => trackEvent(...args),
}));

import { SiteContentsAnalytics } from "./SiteContentsAnalytics";

describe("SiteContentsAnalytics", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tracks a row click with its group and rank, delegated from a child", () => {
    render(
      <SiteContentsAnalytics>
        <li data-contents-group="ploegen" data-contents-position="3">
          <a href="#">
            <span>U15</span>
          </a>
        </li>
      </SiteContentsAnalytics>,
    );

    fireEvent.click(screen.getByText("U15"));

    expect(trackEvent).toHaveBeenCalledWith("inhoud_entry_click", {
      category: "ploegen",
      position: 3,
    });
  });

  it("omits an unparseable rank rather than sending NaN", () => {
    render(
      <SiteContentsAnalytics>
        <li data-contents-group="nieuws" data-contents-position="">
          <a href="#">Artikel</a>
        </li>
      </SiteContentsAnalytics>,
    );

    fireEvent.click(screen.getByText("Artikel"));

    expect(trackEvent).toHaveBeenCalledWith("inhoud_entry_click", {
      category: "nieuws",
    });
  });

  it("ignores a click that resolves to no contents row", () => {
    render(
      <SiteContentsAnalytics>
        <a href="#">Buiten de lijst</a>
      </SiteContentsAnalytics>,
    );

    fireEvent.click(screen.getByText("Buiten de lijst"));

    expect(trackEvent).not.toHaveBeenCalled();
  });
});
