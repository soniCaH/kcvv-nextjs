import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilterParam } from "./useFilterParam";

type Facet = "a" | "b" | "c";
const VALUES: readonly Facet[] = ["a", "b", "c"];

// ── "router" mode mocks ──────────────────────────────────────────────────

const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => mockSearchParams,
}));

describe("useFilterParam — router mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams();
    window.history.replaceState({}, "", "/kalender");
  });

  it("falls back when the param is absent", () => {
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    expect(result.current[0]).toBe("a");
  });

  it("narrows to the param when it's a recognised value", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    expect(result.current[0]).toBe("b");
  });

  it("falls back on an unrecognised param value", () => {
    mockSearchParams = new URLSearchParams("type=nonsense");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    expect(result.current[0]).toBe("a");
  });

  it("pushes the param with scroll:false on a new selection", () => {
    window.history.replaceState({}, "", "/kalender");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    act(() => result.current[1]("b"));
    expect(mockPush).toHaveBeenCalledWith("/kalender?type=b", {
      scroll: false,
    });
  });

  it("deletes the param on a write back to the fallback", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    act(() => result.current[1]("a"));
    expect(mockPush).toHaveBeenCalledWith("/kalender", { scroll: false });
  });

  it("does not push when the selection matches the current value (dedup guard)", () => {
    mockSearchParams = new URLSearchParams("type=b");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    act(() => result.current[1]("b"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("preserves an unrelated live URL param on write (live window.location.search read)", () => {
    window.history.replaceState({}, "", "/kalender?view=week");
    mockSearchParams = new URLSearchParams("view=week");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, { fallback: "a", route: "/kalender" }),
    );
    act(() => result.current[1]("b"));
    const pushedUrl = mockPush.mock.calls[0]![0] as string;
    const params = new URLSearchParams(pushedUrl.split("?")[1]);
    expect(params.get("view")).toBe("week");
    expect(params.get("type")).toBe("b");
  });

  it("appends the default hash on write", () => {
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
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
      useFilterParam("type", VALUES, {
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

// ── "history" mode ───────────────────────────────────────────────────────

describe("useFilterParam — history mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    window.history.replaceState({}, "", "/evenementen");
  });

  it("falls back to the default before the mount effect resolves anything meaningful, and reads a deep link after mount", () => {
    window.history.replaceState({}, "", "/evenementen?type=b");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    // React Testing Library flushes the mount effect synchronously, so the
    // deep-linked value is already visible by the time `render`/`renderHook`
    // returns.
    expect(result.current[0]).toBe("b");
  });

  it("seeds synchronously from initialValue without touching window.location", () => {
    window.history.replaceState({}, "", "/nieuws?categorie=jeugd");
    const { result } = renderHook(() =>
      useFilterParam("categorie", ["jeugd", "bestuur"] as const, {
        fallback: "all" as const,
        route: "/nieuws",
        writeVia: "history",
        initialValue: "all" as const,
      }),
    );
    // `initialValue` wins even though the live URL disagrees — the caller
    // already resolved the real value server-side.
    expect(result.current[0]).toBe("all");
  });

  it("writes via history.pushState, not the router", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("b"));
    expect(pushStateSpy).toHaveBeenCalledWith(
      window.history.state,
      "",
      "/evenementen?type=b",
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("updates its own value immediately on write (pushState doesn't trigger a re-render on its own)", () => {
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("c"));
    expect(result.current[0]).toBe("c");
  });

  it("deletes the param on a write back to the fallback", () => {
    window.history.replaceState({}, "", "/evenementen?type=b");
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("a"));
    expect(pushStateSpy).toHaveBeenCalledWith(
      window.history.state,
      "",
      "/evenementen",
    );
  });

  it("does not write when the selection matches the current value (dedup guard)", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("a")); // already the fallback/current value
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it("re-syncs on popstate without writing the URL again", () => {
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("b");

    // Simulate what the browser itself does on a back press.
    window.history.replaceState({}, "", "/evenementen");
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    pushStateSpy.mockClear();
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current[0]).toBe("a");
    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it("preserves an unrelated live URL param on write", () => {
    window.history.replaceState({}, "", "/evenementen?foo=bar");
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const { result } = renderHook(() =>
      useFilterParam("type", VALUES, {
        fallback: "a",
        route: "/evenementen",
        writeVia: "history",
      }),
    );
    act(() => result.current[1]("b"));
    const [, , pushedUrl] = pushStateSpy.mock.calls[0]! as [
      unknown,
      string,
      string,
    ];
    const params = new URLSearchParams(pushedUrl.split("?")[1]);
    expect(params.get("foo")).toBe("bar");
    expect(params.get("type")).toBe("b");
  });
});
