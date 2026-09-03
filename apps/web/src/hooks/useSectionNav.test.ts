/**
 * useSectionNav tests
 *
 * The one shared hook behind every sticky in-page section nav (#2478 rules 3
 * and 7): scroll-spy active state, plus `scroll-padding-top` on `<html>`
 * derived at runtime from the header's height plus the bar's own measured
 * height — never a hand-written `scroll-mt-*` typed per section.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import { createElement, useEffect } from "react";
import { useSectionNav, type UseSectionNavResult } from "./useSectionNav";

// IntersectionObserver stub — happy-dom doesn't implement it. Captures every
// observer instance created (there may be more than one across renders) so
// tests can target entries at whichever section elements they observed.
let observers: {
  cb: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed: Element[];
}[] = [];

class FakeIntersectionObserver {
  #entry: (typeof observers)[number];
  constructor(
    cb: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.#entry = { cb, options, observed: [] };
    observers.push(this.#entry);
  }
  observe(el: Element) {
    this.#entry.observed.push(el);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function emit(
  observerIndex: number,
  entries: Partial<IntersectionObserverEntry>[],
) {
  act(() => {
    observers[observerIndex]!.cb(
      entries as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
  });
}

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
    observers = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.style.scrollPaddingTop = "";
    document
      .querySelectorAll("[data-section-nav-test-target]")
      .forEach((el) => el.remove());
  });

  it("returns null active id when no section matches", () => {
    const { result } = renderHook([]);
    expect(result.activeId).toBeNull();
  });

  it("sets scroll-padding-top on <html> derived from the header token plus the bar's own measured height", () => {
    renderHook(["a"]);

    // happy-dom has no layout engine (getBoundingClientRect reads 0), so the
    // value under test is the *formula*, not a real pixel number — the real
    // number is exercised by Playwright against a rendered browser.
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

    const spyObserverIndex = observers.length - 1;
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
    const spyObserverIndex = observers.length - 1;
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
    const spyObserverIndex = observers.length - 1;
    emit(spyObserverIndex, [
      {
        isIntersecting: false,
        target,
        boundingClientRect: { top: 10 } as DOMRectReadOnly,
      },
    ]);

    expect(rendered.result.activeId).toBeNull();
  });
});
