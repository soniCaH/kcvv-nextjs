import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from "@/lib/analytics/track-event";
import { EmptyStateUndoAnalytics } from "./EmptyStateUndoAnalytics";

describe("<EmptyStateUndoAnalytics>", () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it("delegates a click on the marked undo element to empty_state_undo", () => {
    render(
      <EmptyStateUndoAnalytics source="evenementen" facet="Jeugdwerking">
        <button type="button" data-empty-state-undo="undo">
          Toon alles
        </button>
      </EmptyStateUndoAnalytics>,
    );

    fireEvent.click(screen.getByText("Toon alles"));

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith("empty_state_undo", {
      source: "evenementen",
      filter_type: "jeugdwerking",
    });
  });

  it("slugifies a facet value that arrives in display casing", () => {
    render(
      <EmptyStateUndoAnalytics source="nieuws" facet="Jeugd">
        <button type="button" data-empty-state-undo="undo">
          Toon alles
        </button>
      </EmptyStateUndoAnalytics>,
    );

    fireEvent.click(screen.getByText("Toon alles"));

    expect(trackEvent).toHaveBeenCalledWith("empty_state_undo", {
      source: "nieuws",
      filter_type: "jeugd",
    });
  });

  it("ignores clicks outside any data-empty-state-undo element", () => {
    render(
      <EmptyStateUndoAnalytics source="evenementen" facet="Jeugdwerking">
        <p>Geen knop hier.</p>
      </EmptyStateUndoAnalytics>,
    );

    fireEvent.click(screen.getByText("Geen knop hier."));

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("renders its children", () => {
    render(
      <EmptyStateUndoAnalytics source="kalender" facet="Wedstrijden">
        <span>wrapped content</span>
      </EmptyStateUndoAnalytics>,
    );
    expect(screen.getByText("wrapped content")).toBeInTheDocument();
  });
});
