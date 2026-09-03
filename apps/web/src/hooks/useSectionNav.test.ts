/**
 * useSectionNav tests
 *
 * The one shared hook behind every sticky in-page section nav (#2478 rules 3
 * and 7): scroll-spy active state, plus `scroll-padding-top` on `<html>`
 * derived at runtime from the header's height plus the bar's own measured
 * height — never a hand-written `scroll-mt-*` typed per section.
 *
 * Also covers the #2584 review fixes: the bar's own DOM node can change
 * (finding 3), the scroll-spy must rebuild when the bar resizes (finding 5),
 * and a hash navigation gets a corrective re-scroll while "armed" (findings
 * 1 and 4).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { createElement, useEffect, useState } from "react";
import {
  useSectionNav,
  getStickyHeaderHeight,
  type UseSectionNavResult,
} from "./useSectionNav";

// IntersectionObserver stub — happy-dom doesn't implement it. Captures every
// observer instance created (there may be more than one across renders) so
// tests can target entries at whichever section elements they observed, and
// assert on `disconnected` to prove a stale observer was torn down.
let intersectionObservers: {
  cb: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed: Element[];
  disconnected: boolean;
}[] = [];

class FakeIntersectionObserver {
  #entry: (typeof intersectionObservers)[number];
  constructor(
    cb: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.#entry = { cb, options, observed: [], disconnected: false };
    intersectionObservers.push(this.#entry);
  }
  observe(el: Element) {
    this.#entry.observed.push(el);
  }
  unobserve() {}
  disconnect() {
    this.#entry.disconnected = true;
  }
  takeRecords() {
    return [];
  }
}

function emit(
  observerIndex: number,
  entries: Partial<IntersectionObserverEntry>[],
) {
  act(() => {
    intersectionObservers[observerIndex]!.cb(
      entries as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });
}

// ResizeObserver stub — happy-dom's real implementation doesn't fire off a
// monkey-patched `getBoundingClientRect` (it has no layout engine), so a
// test that needs to simulate "the bar resized" drives this fake directly.
let resizeObservers: {
  cb: ResizeObserverCallback;
  observed: Element[];
}[] = [];

class FakeResizeObserver {
  #entry: (typeof resizeObservers)[number];
  constructor(cb: ResizeObserverCallback) {
    this.#entry = { cb, observed: [] };
    resizeObservers.push(this.#entry);
  }
  observe(el: Element) {
    this.#entry.observed.push(el);
  }
  unobserve() {}
  disconnect() {}
}

function fireResize(observerIndex: number) {
  act(() => {
    resizeObservers[observerIndex]!.cb(
      [] as ResizeObserverEntry[],
      {} as ResizeObserver,
    );
  });
}

function mockHeight(el: Element, height: number) {
  Object.defineProperty(el, "getBoundingClientRect", {
    configurable: true,
    value: () => ({ height }) as DOMRect,
  });
}

function TestHost({
  ids,
  showNav,
  onHook,
}: {
  ids: readonly string[];
  showNav: boolean;
  onHook: (h: UseSectionNavResult) => void;
}) {
  const hook = useSectionNav(ids);
  useEffect(() => {
    onHook(hook);
  });
  if (!showNav) return null;
  return createElement("nav", { ref: hook.navRef, "data-testid": "nav" }, null);
}

/** Wraps `TestHost` with its own `showNav` state so a test can toggle the
 *  bar's DOM node off and back on (simulating a client-side team→team
 *  navigation that flips a team between ≤1 section and several) without
 *  unmounting the host — the same shape React's own reconciliation takes
 *  when a component's return value flips between `null` and an element. */
function TestHostToggle({
  ids,
  onHook,
  onToggle,
}: {
  ids: readonly string[];
  onHook: (h: UseSectionNavResult) => void;
  onToggle: (toggle: () => void) => void;
}) {
  const [showNav, setShowNav] = useState(true);
  useEffect(() => {
    onToggle(() => setShowNav((v) => !v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return createElement(TestHost, { ids, showNav, onHook });
}

function renderHook(ids: readonly string[]) {
  let result: UseSectionNavResult | undefined;
  const utils = render(
    createElement(TestHost, {
      ids,
      showNav: true,
      onHook: (h) => {
        result = h;
      },
    }),
  );
  return {
    get result() {
      return result!;
    },
    ...utils,
  };
}

describe("useSectionNav", () => {
  beforeEach(() => {
    intersectionObservers = [];
    resizeObservers = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.documentElement.style.scrollPaddingTop = "";
    window.location.hash = "";
    document
      .querySelectorAll("[data-section-nav-test-target]")
      .forEach((el) => el.remove());
  });

  it("returns null active id and zero barHeight when no section matches", () => {
    const rendered = renderHook([]);
    expect(rendered.result.activeId).toBeNull();
    expect(rendered.result.barHeight).toBe(0);
  });

  it("sets scroll-padding-top on <html> derived from the header token plus the bar's own measured height", () => {
    renderHook(["a"]);

    expect(document.documentElement.style.scrollPaddingTop).toBe(
      "calc(var(--sticky-header-h) + 0px)",
    );
  });

  it("resets scroll-padding-top on unmount so a later route with no nav isn't stuck with a stale offset", () => {
    const { unmount } = renderHook(["a"]);
    expect(document.documentElement.style.scrollPaddingTop).not.toBe("");
    unmount();
    expect(document.documentElement.style.scrollPaddingTop).toBe("");
  });

  it("marks the topmost intersecting section active", () => {
    const target = document.createElement("div");
    target.id = "spelers";
    target.setAttribute("data-section-nav-test-target", "");
    document.body.appendChild(target);

    const rendered = renderHook(["spelers", "staf"]);
    expect(rendered.result.activeId).toBeNull();

    const spyObserverIndex = intersectionObservers.length - 1;
    emit(spyObserverIndex, [
      {
        isIntersecting: true,
        target,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(rendered.result.activeId).toBe("spelers");
  });

  it("picks the entry with the smallest top when multiple sections intersect at once", () => {
    const a = document.createElement("div");
    a.id = "a";
    a.setAttribute("data-section-nav-test-target", "");
    const b = document.createElement("div");
    b.id = "b";
    b.setAttribute("data-section-nav-test-target", "");
    document.body.append(a, b);

    const rendered = renderHook(["a", "b"]);
    const spyObserverIndex = intersectionObservers.length - 1;
    emit(spyObserverIndex, [
      {
        isIntersecting: true,
        target: a,
        boundingClientRect: { top: 50 } as DOMRectReadOnly,
      },
      {
        isIntersecting: true,
        target: b,
        boundingClientRect: { top: 5 } as DOMRectReadOnly,
      },
    ]);

    expect(rendered.result.activeId).toBe("b");
  });

  it("ignores non-intersecting entries", () => {
    const target = document.createElement("div");
    target.id = "spelers";
    target.setAttribute("data-section-nav-test-target", "");
    document.body.appendChild(target);

    const rendered = renderHook(["spelers"]);
    const spyObserverIndex = intersectionObservers.length - 1;
    emit(spyObserverIndex, [
      {
        isIntersecting: false,
        target,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(rendered.result.activeId).toBeNull();
  });

  describe("getStickyHeaderHeight", () => {
    it("falls back to 65 when the CSS custom property can't be read (no stylesheet under vitest)", () => {
      expect(getStickyHeaderHeight()).toBe(65);
    });
  });

  describe("the bar's own DOM node changing (#2584 review finding 3)", () => {
    it("resets the offset when the nav unmounts, and re-attaches a fresh watcher on the new node once it remounts", () => {
      // ids intentionally empty — this test is about the nav's own DOM node
      // (a team's <nav> can unmount at ≤1 section and remount for a
      // different team, all without the *component* itself ever
      // unmounting), not the section-target spy.
      let toggle: (() => void) | undefined;
      render(
        createElement(TestHostToggle, {
          ids: [],
          onHook: () => {},
          onToggle: (fn) => {
            toggle = fn;
          },
        }),
      );

      expect(document.documentElement.style.scrollPaddingTop).toBe(
        "calc(var(--sticky-header-h) + 0px)",
      );
      expect(resizeObservers.length).toBe(1);

      // Team A → a team with ≤1 section: the component keeps its hook state
      // (same fiber) but stops rendering the <nav> entirely. A `[]`-deps
      // effect closing over the first node would never notice this and
      // would leave scroll-padding-top stuck at team A's bar height.
      act(() => toggle!());
      expect(document.documentElement.style.scrollPaddingTop).toBe("");

      // → a further team that has a nav again: a brand-new <nav> DOM node.
      // A fresh watcher must attach to it — not the first, now-detached one.
      act(() => toggle!());
      expect(resizeObservers.length).toBe(2);
      expect(document.documentElement.style.scrollPaddingTop).toBe(
        "calc(var(--sticky-header-h) + 0px)",
      );
    });
  });

  describe("scroll-spy rebuilds when the bar resizes (#2584 review finding 5)", () => {
    it("disconnects the stale observer and builds a new one with the grown offset", () => {
      const target = document.createElement("div");
      target.id = "spelers";
      target.setAttribute("data-section-nav-test-target", "");
      document.body.appendChild(target);

      renderHook(["spelers"]);
      const firstSpy = intersectionObservers.at(-1)!;
      expect(firstSpy.disconnected).toBe(false);
      const firstOptions = firstSpy.options;

      // Simulate the bar growing (e.g. HubSearch mounting and wrapping to
      // its own line) via the resize observer that watches the bar itself.
      const navEl = resizeObservers[0]!.observed[0]!;
      mockHeight(navEl, 60);
      fireResize(0);

      expect(firstSpy.disconnected).toBe(true);
      const secondSpy = intersectionObservers.at(-1)!;
      expect(secondSpy).not.toBe(firstSpy);
      expect(secondSpy.options?.rootMargin).not.toBe(firstOptions?.rootMargin);
    });
  });

  describe("hash-landing correction wiring (#2584 review findings 1 and 4)", () => {
    // The correction logic itself (arming, the armed window, the cold-load
    // and webfont-swap triggers) is `useHashLandingCorrection`'s own
    // responsibility and is tested there — this just proves the composition:
    // a bar resize here actually reaches that hook's `notifyLayoutChange`.
    it("notifies the hash-landing correction on every bar resize while armed", () => {
      vi.useFakeTimers();
      const target = document.createElement("div");
      target.id = "structuur";
      target.setAttribute("data-section-nav-test-target", "");
      document.body.appendChild(target);
      const scrollIntoView = vi
        .spyOn(target, "scrollIntoView")
        .mockImplementation(() => {});

      renderHook(["structuur"]);
      scrollIntoView.mockClear();

      act(() => {
        window.location.hash = "#structuur";
        window.dispatchEvent(new Event("hashchange"));
      });

      // The bar grows shortly after (HubSearch mounting) — still inside the
      // armed window, so the landing gets corrected.
      act(() => vi.advanceTimersByTime(200));
      mockHeight(resizeObservers[0]!.observed[0]!, 60);
      fireResize(0);
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
    });
  });
});
