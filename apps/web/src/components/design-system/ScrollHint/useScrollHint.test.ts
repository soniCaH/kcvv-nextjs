import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { createElement, useEffect } from "react";
import { useScrollHint, type UseScrollHintReturn } from "./useScrollHint";

/**
 * Test helper: renders a div with the hook's scrollRef attached,
 * and captures the hook return value via a callback.
 */
function TestHost({ onHook }: { onHook: (h: UseScrollHintReturn) => void }) {
  const hook = useScrollHint();
  useEffect(() => {
    onHook(hook);
  });
  return createElement("div", {
    ref: hook.scrollRef,
    "data-testid": "scroll-container",
    style: { overflow: "auto" },
  });
}

describe("useScrollHint", () => {
  let savedScrollTo: PropertyDescriptor | undefined;
  let savedScrollWidth: PropertyDescriptor | undefined;
  let savedClientWidth: PropertyDescriptor | undefined;
  let savedScrollLeft: PropertyDescriptor | undefined;

  beforeEach(() => {
    savedScrollTo = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollTo",
    );
    savedScrollWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollWidth",
    );
    savedClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "clientWidth",
    );
    savedScrollLeft = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollLeft",
    );
  });

  afterEach(() => {
    const restore = (prop: string, desc: PropertyDescriptor | undefined) => {
      if (desc) {
        Object.defineProperty(HTMLElement.prototype, prop, desc);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (HTMLElement.prototype as any)[prop];
      }
    };
    restore("scrollTo", savedScrollTo);
    restore("scrollWidth", savedScrollWidth);
    restore("clientWidth", savedClientWidth);
    restore("scrollLeft", savedScrollLeft);
    vi.restoreAllMocks();
  });

  function renderScrollHint(scrollProps: {
    scrollWidth: number;
    clientWidth: number;
    scrollLeft: number;
  }) {
    let hookResult: UseScrollHintReturn | undefined;

    // Mock scrollWidth/clientWidth/scrollLeft on HTMLElement.prototype
    // so the element gets these values once the hook reads them
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        return scrollProps.scrollWidth;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        return scrollProps.clientWidth;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      get() {
        return scrollProps.scrollLeft;
      },
    });

    const utils = render(
      createElement(TestHost, {
        onHook: (h: UseScrollHintReturn) => {
          hookResult = h;
        },
      }),
    );

    return { hookResult: hookResult!, ...utils };
  }

  it("returns canScrollLeft=false and canScrollRight=false when no overflow", () => {
    const { hookResult } = renderScrollHint({
      scrollWidth: 500,
      clientWidth: 500,
      scrollLeft: 0,
    });

    expect(hookResult.canScrollLeft).toBe(false);
    expect(hookResult.canScrollRight).toBe(false);
  });

  it("returns canScrollRight=true when content overflows to the right", () => {
    const { hookResult } = renderScrollHint({
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 0,
    });

    expect(hookResult.canScrollRight).toBe(true);
    expect(hookResult.canScrollLeft).toBe(false);
  });

  it("returns canScrollLeft=true when scrolled past dead-zone", () => {
    const { hookResult } = renderScrollHint({
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 100,
    });

    expect(hookResult.canScrollLeft).toBe(true);
    expect(hookResult.canScrollRight).toBe(true);
  });

  it("uses 10px dead-zone — scrollLeft=5 means canScrollLeft=false", () => {
    const { hookResult } = renderScrollHint({
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 5,
    });

    expect(hookResult.canScrollLeft).toBe(false);
  });

  it("uses 10px dead-zone — 10px overflow means canScrollRight=false", () => {
    const { hookResult } = renderScrollHint({
      scrollWidth: 510,
      clientWidth: 500,
      scrollLeft: 0,
    });

    expect(hookResult.canScrollRight).toBe(false);
  });

  it("scrollLeft() calls scrollTo with decreased offset", () => {
    const scrollToMock = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollToMock,
    });

    const { hookResult } = renderScrollHint({
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 300,
    });

    act(() => {
      hookResult.scrollLeft();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: 100,
      behavior: "smooth",
    });
  });

  it("scrollLeft() honours a custom fixed scrollAmount", () => {
    const scrollToMock = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollToMock,
    });

    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      value: 300,
    });

    // TestHost doesn't accept options — exercised via a dedicated host.
    function CustomAmountHost({
      onHook,
    }: {
      onHook: (h: UseScrollHintReturn) => void;
    }) {
      const hook = useScrollHint({ scrollAmount: 999 });
      useEffect(() => {
        onHook(hook);
      });
      return createElement("div", { ref: hook.scrollRef });
    }

    let customResult: UseScrollHintReturn | undefined;
    render(
      createElement(CustomAmountHost, {
        onHook: (h: UseScrollHintReturn) => {
          customResult = h;
        },
      }),
    );

    act(() => {
      customResult!.scrollLeft();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: 300 - 999,
      behavior: "smooth",
    });
  });

  it("scrollAmount accepts a function of the track element (proportional step)", () => {
    const scrollToMock = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollToMock,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      value: 0,
    });

    function ProportionalHost({
      onHook,
    }: {
      onHook: (h: UseScrollHintReturn) => void;
    }) {
      const hook = useScrollHint<HTMLDivElement>({
        scrollAmount: (el) => el.clientWidth * 0.8,
      });
      useEffect(() => {
        onHook(hook);
      });
      return createElement("div", { ref: hook.scrollRef });
    }

    let result: UseScrollHintReturn | undefined;
    render(
      createElement(ProportionalHost, {
        onHook: (h: UseScrollHintReturn) => {
          result = h;
        },
      }),
    );

    act(() => {
      result!.scrollRight();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: 0 + 400 * 0.8,
      behavior: "smooth",
    });
  });

  it("scrollRight() calls scrollTo with increased offset", () => {
    const scrollToMock = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollToMock,
    });

    const { hookResult } = renderScrollHint({
      scrollWidth: 1000,
      clientWidth: 500,
      scrollLeft: 0,
    });

    act(() => {
      hookResult.scrollRight();
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      left: 200,
      behavior: "smooth",
    });
  });

  describe("overflows", () => {
    it("is false when the track fits exactly", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 500,
        clientWidth: 500,
        scrollLeft: 0,
      });

      expect(hookResult.overflows).toBe(false);
    });

    it("is true when the track overflows, regardless of scroll position", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 1000,
        clientWidth: 500,
        scrollLeft: 0,
      });

      expect(hookResult.overflows).toBe(true);
    });

    it("stays true once scrolled all the way to the end — unlike canScrollRight", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 1000,
        clientWidth: 500,
        scrollLeft: 500,
      });

      expect(hookResult.canScrollRight).toBe(false);
      expect(hookResult.overflows).toBe(true);
    });

    it("uses the 10px dead-zone — 8px overflow means overflows=false", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 508,
        clientWidth: 500,
        scrollLeft: 0,
      });

      expect(hookResult.overflows).toBe(false);
    });
  });

  describe("remainingLeft / remainingRight", () => {
    it("reports the exact pixels left to scroll in each direction", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 1000,
        clientWidth: 500,
        scrollLeft: 300,
      });

      expect(hookResult.remainingLeft).toBe(300);
      expect(hookResult.remainingRight).toBe(200);
    });

    it("is 0 on both sides when there is no overflow", () => {
      const { hookResult } = renderScrollHint({
        scrollWidth: 500,
        clientWidth: 500,
        scrollLeft: 0,
      });

      expect(hookResult.remainingLeft).toBe(0);
      expect(hookResult.remainingRight).toBe(0);
    });
  });

  describe("#2448 — re-measures when content changes without a container resize", () => {
    it("re-checks overflow when a child element's own box resizes", () => {
      // The track's own clientWidth/scrollWidth are read live off the
      // element by the getters below, so triggering the child's observed
      // ResizeObserver callback re-runs checkScroll and picks up the new
      // scrollWidth — exactly the scenario a web-font swap or a
      // Sanity-driven chip count produces without the track's own box
      // changing size.
      let currentScrollWidth = 500;
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        get: () => currentScrollWidth,
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        value: 500,
      });
      Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
        configurable: true,
        value: 0,
      });

      const observedTargets: Element[] = [];
      let triggerResize: (() => void) | undefined;
      const OriginalRO = globalThis.ResizeObserver;
      class SpyResizeObserver {
        #cb: ResizeObserverCallback;
        constructor(cb: ResizeObserverCallback) {
          this.#cb = cb;
          triggerResize = () => this.#cb([], this as unknown as ResizeObserver);
        }
        observe(target: Element) {
          observedTargets.push(target);
        }
        unobserve() {}
        disconnect() {}
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globalThis.ResizeObserver = SpyResizeObserver as any;

      let hookResult: UseScrollHintReturn | undefined;
      function HostWithChild({
        onHook,
      }: {
        onHook: (h: UseScrollHintReturn) => void;
      }) {
        const hook = useScrollHint();
        useEffect(() => {
          onHook(hook);
        });
        return createElement(
          "div",
          { ref: hook.scrollRef, "data-testid": "scroll-container" },
          createElement("div", { "data-testid": "child" }),
        );
      }

      render(
        createElement(HostWithChild, {
          onHook: (h: UseScrollHintReturn) => {
            hookResult = h;
          },
        }),
      );

      expect(hookResult!.overflows).toBe(false);
      expect(observedTargets.length).toBeGreaterThanOrEqual(2); // track + child

      // Content grows (e.g. the web font swaps in) without the track's own
      // box changing — a child ResizeObserver entry fires instead.
      currentScrollWidth = 900;
      act(() => {
        triggerResize?.();
      });

      expect(hookResult!.overflows).toBe(true);

      globalThis.ResizeObserver = OriginalRO;
    });
  });

  it("updates when scroll event fires on the container", () => {
    let scrollLeftValue = 0;

    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get() {
        return 1000;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        return 500;
      },
    });
    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      get() {
        return scrollLeftValue;
      },
    });

    let hookResult: UseScrollHintReturn | undefined;
    render(
      createElement(TestHost, {
        onHook: (h: UseScrollHintReturn) => {
          hookResult = h;
        },
      }),
    );

    expect(hookResult!.canScrollLeft).toBe(false);

    // Change the scrollLeft value and fire scroll event
    scrollLeftValue = 200;
    const container = screen.getByTestId("scroll-container");
    act(() => {
      container.dispatchEvent(new Event("scroll"));
    });

    expect(hookResult!.canScrollLeft).toBe(true);
    expect(hookResult!.canScrollRight).toBe(true);
  });
});
