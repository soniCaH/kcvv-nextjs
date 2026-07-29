import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MouseEvent } from "react";
import { handleSamePageAnchorClick } from "./same-page-anchor";

/** Minimal stand-in for the fields the handler reads off the click event. */
function clickEvent(
  overrides: Partial<MouseEvent<HTMLAnchorElement>> = {},
): MouseEvent<HTMLAnchorElement> & {
  preventDefault: ReturnType<typeof vi.fn>;
} {
  const preventDefault = vi.fn();
  return {
    defaultPrevented: false,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    preventDefault,
    ...overrides,
  } as unknown as MouseEvent<HTMLAnchorElement> & {
    preventDefault: ReturnType<typeof vi.fn>;
  };
}

function setUrl(url: string) {
  window.history.replaceState(null, "", url);
}

function addSection(id: string): HTMLElement {
  const el = document.createElement("section");
  el.id = id;
  el.scrollIntoView = vi.fn();
  el.focus = vi.fn();
  document.body.appendChild(el);
  return el;
}

beforeEach(() => {
  document.body.innerHTML = "";
  setUrl("/hulp");
});

describe("handleSamePageAnchorClick", () => {
  it("intercepts a same-page anchor: scrolls, focuses, keeps a single fragment", () => {
    const el = addSection("structuur");
    setUrl("/hulp#structuur");
    const event = clickEvent();

    handleSamePageAnchorClick(event, "/hulp#structuur");

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(el.scrollIntoView).toHaveBeenCalledOnce();
    expect(el.focus).toHaveBeenCalledWith({ preventScroll: true });
    // The bug produced `#structuur#structuur…`; the fragment stays single.
    expect(window.location.hash).toBe("#structuur");
  });

  it("self-heals an already-duplicated fragment", () => {
    addSection("structuur");
    setUrl("/hulp#structuur#structuur");
    const event = clickEvent();

    handleSamePageAnchorClick(event, "/hulp#structuur");

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe("#structuur");
  });

  it("ignores a cross-page anchor (keeps SPA navigation)", () => {
    addSection("spelers");
    setUrl("/hulp");
    const event = clickEvent();

    handleSamePageAnchorClick(event, "/ploegen/a-ploeg#spelers");

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("ignores modifier clicks (new tab, etc.)", () => {
    addSection("structuur");
    setUrl("/hulp#structuur");
    const event = clickEvent({ metaKey: true });

    handleSamePageAnchorClick(event, "/hulp#structuur");

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("ignores links without a hash", () => {
    const event = clickEvent();
    handleSamePageAnchorClick(event, "/hulp");
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("does nothing when the target element is absent", () => {
    setUrl("/hulp#structuur");
    const event = clickEvent();
    handleSamePageAnchorClick(event, "/hulp#structuur");
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
