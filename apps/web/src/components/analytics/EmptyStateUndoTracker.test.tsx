import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from "@/lib/analytics/track-event";
import { EmptyStateUndoTracker } from "./EmptyStateUndoTracker";

describe("<EmptyStateUndoTracker>", () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it("delegates a click on a marked filtered-EmptyState undo anywhere in the document to empty_state_undo, slugifying the facet", () => {
    render(<EmptyStateUndoTracker />);
    render(
      <button
        type="button"
        data-empty-state-undo="undo"
        data-empty-state-undo-source="evenementen"
        data-empty-state-undo-facet="Jeugdwerking"
      >
        Toon alles
      </button>,
    );

    fireEvent.click(document.querySelector("[data-empty-state-undo]")!);

    expect(trackEvent).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith("empty_state_undo", {
      source: "evenementen",
      filter_type: "jeugdwerking",
    });
  });

  it("does not fire for a click outside any data-empty-state-undo element (a non-filtered EmptyState has no marker at all)", () => {
    render(<EmptyStateUndoTracker />);
    render(<p>Geen knop hier.</p>);

    fireEvent.click(document.querySelector("p")!);

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("does not fire when the marker is missing its source/facet payload (defensive — matches ErrorAnalytics's guard)", () => {
    render(<EmptyStateUndoTracker />);
    render(<button type="button" data-empty-state-undo="undo" />);

    fireEvent.click(document.querySelector("[data-empty-state-undo]")!);

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("renders no visible DOM of its own", () => {
    const { container } = render(<EmptyStateUndoTracker />);
    expect(container).toBeEmptyDOMElement();
  });
});
