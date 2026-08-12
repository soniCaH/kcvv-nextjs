import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/lib/analytics/track-event", () => ({
  trackEvent: vi.fn(),
}));

import { trackEvent } from "@/lib/analytics/track-event";
import { useNavigationAnalytics } from "./useNavigationAnalytics";

const mockTrackEvent = vi.mocked(trackEvent);

describe("useNavigationAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fires nav_link_click with the destination and source", () => {
    const { result } = renderHook(() => useNavigationAnalytics());
    act(() =>
      result.current.trackNavClick({
        destination: "/kalender",
        source: "desktop",
      }),
    );
    expect(mockTrackEvent).toHaveBeenCalledWith("nav_link_click", {
      destination: "/kalender",
      source: "desktop",
    });
  });

  it.each(["desktop", "mobile", "takeover"] as const)(
    "carries source=%s verbatim",
    (source) => {
      const { result } = renderHook(() => useNavigationAnalytics());
      act(() =>
        result.current.trackNavClick({ destination: "/jeugd", source }),
      );
      expect(mockTrackEvent).toHaveBeenCalledWith("nav_link_click", {
        destination: "/jeugd",
        source,
      });
    },
  );

  it("fires footer_link_click with the column under the `category` key", () => {
    const { result } = renderHook(() => useNavigationAnalytics());
    act(() =>
      result.current.trackFooterClick({
        destination: "/club/vrijwilliger",
        column: "Aansluiten",
      }),
    );
    expect(mockTrackEvent).toHaveBeenCalledWith("footer_link_click", {
      destination: "/club/vrijwilliger",
      category: "Aansluiten",
    });
  });

  it("never sends a `column` key — the taxonomy dimension is `category`", () => {
    const { result } = renderHook(() => useNavigationAnalytics());
    act(() =>
      result.current.trackFooterClick({ destination: "/hulp", column: "X" }),
    );
    const params = mockTrackEvent.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(params).not.toHaveProperty("column");
  });

  it("returns stable callbacks across re-renders", () => {
    const { result, rerender } = renderHook(() => useNavigationAnalytics());
    const first = result.current;
    rerender();
    expect(result.current.trackNavClick).toBe(first.trackNavClick);
    expect(result.current.trackFooterClick).toBe(first.trackFooterClick);
  });
});
