import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRouterFilterParam } from "./useRouterFilterParam";

type Facet = "a" | "b" | "c";
const VALUES: readonly Facet[] = ["a", "b", "c"];

const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

describe("useRouterFilterParam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    window.history.replaceState({}, "", "/kalender");
  });

  it("falls back when the param is absent", () => {
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    expect(result.current[0]).toBe("a");
  });

  it("narrows to the param when it's a recognised value", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    expect(result.current[0]).toBe("b");
  });

  it("falls back on an unrecognised param value", () => {
    mockSearchParams = new URLSearchParams("type=nonsense");
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    expect(result.current[0]).toBe("a");
  });

  it("pushes the param with scroll:false on a new selection", () => {
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    act(() => result.current[1]("b"));
    expect(mockPush).toHaveBeenCalledWith("/kalender?type=b", {
      scroll: false,
    });
  });

  it("deletes the param on a write back to the fallback", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    act(() => result.current[1]("a"));
    expect(mockPush).toHaveBeenCalledWith("/kalender", { scroll: false });
  });

  it("does not push when the selection matches the current value (dedup guard)", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    act(() => result.current[1]("b"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("preserves an unrelated param already in useSearchParams() on write", () => {
    mockSearchParams = new URLSearchParams("view=week");
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/kalender",
      }),
    );
    act(() => result.current[1]("b"));
    const pushedUrl = mockPush.mock.calls[0]![0] as string;
    const params = new URLSearchParams(pushedUrl.split("?")[1]);
    expect(params.get("view")).toBe("week");
    expect(params.get("type")).toBe("b");
  });

  it("appends the default hash on write", () => {
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/hulp",
        hash: "hulp",
      }),
    );
    act(() => result.current[1]("b"));
    expect(mockPush).toHaveBeenCalledWith("/hulp?type=b#hulp", {
      scroll: false,
    });
  });

  it("lets a call override the hash and use replace instead of push", () => {
    const { result } = renderHook(() =>
      useRouterFilterParam("type", VALUES, {
        fallback: "a",
        route: "/hulp",
        hash: "hulp",
      }),
    );
    act(() =>
      result.current[1]("b", { hash: "some-question-id", replace: true }),
    );
    expect(mockReplace).toHaveBeenCalledWith("/hulp?type=b#some-question-id", {
      scroll: false,
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
