/**
 * useSectionNav tests
 *
 * The one shared hook behind every sticky in-page section nav (#2478 rules 3
 * and 7): scroll-spy active state, plus `scroll-padding-top` on `<html>`
 * derived at runtime from the header's height plus the bar's own measured
 * height — never a hand-written `scroll-mt-*` typed per section. Also
 * covers the scroll-spy rebuilding when the bar resizes, and the
 * composition with `useHashLandingCorrection` (its own logic is tested in
 * `useHashLandingCorrection.test.ts`; this file only proves the wiring).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { createElement, useEffect } from "react";
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

// `useSectionNav` is contracted to be mounted only from a component that
// renders its `<nav>` unconditionally whenever mounted at all (the ≤1
// section check lives one level up, in `<TeamSectionNav>` — see its own
// docblock) — so this host always renders the bar, matching every real
// caller.
function TestHost({
  ids,
  onHook,
}: {
  ids: readonly string[];
  onHook: (h: UseSectionNavResult) => void;
}) {
  const hook = useSectionNav(ids);
  useEffect(() => {
    onHook(hook);
  });
  return createElement("nav", { ref: hook.navRef, "data-testid": "nav" }, null);
}

function renderHook(ids: readonly string[]) {
  let result: UseSectionNavResult | undefined;
  const utils = render(
    createElement(TestHost, {
      ids,
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
    afterEach(() => {
      document.documentElement.style.removeProperty("--sticky-header-h");
    });

    it("reads the --sticky-header-h custom property when one is set", () => {
      document.documentElement.style.setProperty("--sticky-header-h", "80px");
      expect(getStickyHeaderHeight()).toBe(80);
    });

    it("falls back to 65 when the custom property can't be read (no stylesheet under vitest)", () => {
      expect(getStickyHeaderHeight()).toBe(65);
    });
  });

  describe("scroll-spy rebuilds when the bar resizes", () => {
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

  describe("hash-landing correction wiring", () => {
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
