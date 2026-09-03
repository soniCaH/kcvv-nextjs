import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { OrganigramSectionNav } from "./OrganigramSectionNav";
import {
  HUB_SEARCH_MEMBERS,
  HUB_SEARCH_PATHS,
} from "../HubSearch/hub-search.fixture";

vi.mock("@/lib/analytics/track-event", () => ({ trackEvent: vi.fn() }));

// IntersectionObserver stub that captures the latest callback so tests can drive
// hero-visibility transitions. Only the hero observer is created when a
// `#hub-hero` element is present (the section observer bails with no sections).
let observerCb: IntersectionObserverCallback | null = null;

class FakeIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function emitHeroIntersecting(isIntersecting: boolean) {
  act(() => {
    observerCb?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  observerCb = null;
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.getElementById("hub-hero")?.remove();
  document.getElementById("hulp")?.remove();
  document.getElementById("structuur")?.remove();
  document.documentElement.style.scrollPaddingTop = "";
});

function renderNav() {
  return render(
    <OrganigramSectionNav
      members={HUB_SEARCH_MEMBERS}
      responsibilityPaths={HUB_SEARCH_PATHS}
    />,
  );
}

/** Appends real `#hulp`/`#structuur` targets so the shared `useSectionNav`
 *  hook's scroll-spy observer actually mounts (it bails on zero targets) —
 *  mirroring the two sections the hub always renders. */
function appendSectionTargets() {
  const hulp = document.createElement("div");
  hulp.id = "hulp";
  const structuur = document.createElement("div");
  structuur.id = "structuur";
  document.body.append(hulp, structuur);
  return { hulp, structuur };
}

describe("OrganigramSectionNav", () => {
  it("renders a distinctly-labelled nav landmark", () => {
    renderNav();
    expect(
      screen.getByRole("navigation", { name: "Secties van de hub" }),
    ).toBeInTheDocument();
  });

  it("renders both doors pointing at the section anchors", () => {
    renderNav();
    const hulp = screen.getByRole("link", { name: "Hulp" });
    const structuur = screen.getByRole("link", { name: "Structuur" });
    expect(hulp).toHaveAttribute("href", "#hulp");
    expect(structuur).toHaveAttribute("href", "#structuur");
  });

  describe("scroll-spy — the fill means the section being read, not the one last clicked (#2478 rule 3)", () => {
    it("fills the chip for the topmost intersecting section", () => {
      const { structuur } = appendSectionTargets();
      renderNav();

      act(() => {
        observerCb?.(
          [
            {
              isIntersecting: true,
              target: structuur,
              boundingClientRect: { top: 5 },
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });

      expect(screen.getByRole("link", { name: "Structuur" })).toHaveAttribute(
        "aria-current",
        "location",
      );
      expect(screen.getByRole("link", { name: "Hulp" })).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("does not change the fill on click by itself — only a later intersection does", () => {
      const { structuur } = appendSectionTargets();
      renderNav();

      act(() => {
        observerCb?.(
          [
            {
              isIntersecting: true,
              target: structuur,
              boundingClientRect: { top: 5 },
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });

      // Clicking "Hulp" navigates, but the fill still means "the section
      // being read" — which the observer has not yet reported as Hulp.
      fireEvent.click(screen.getByRole("link", { name: "Hulp" }));

      expect(screen.getByRole("link", { name: "Structuur" })).toHaveAttribute(
        "aria-current",
        "location",
      );
      expect(screen.getByRole("link", { name: "Hulp" })).not.toHaveAttribute(
        "aria-current",
      );
    });

    it("moves focus into the clicked section (#2478 rule 8)", () => {
      const { hulp } = appendSectionTargets();
      const focusSpy = vi.spyOn(hulp, "focus");
      renderNav();

      fireEvent.click(screen.getByRole("link", { name: "Hulp" }));

      expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
    });
  });

  it("keeps the repeated search hidden by default (hero in view)", () => {
    renderNav();
    expect(
      screen.queryByLabelText("Zoek een persoon of hulpvraag"),
    ).not.toBeInTheDocument();
  });

  it("hides the search while the hero is in view, reveals it once scrolled past", () => {
    document.body.insertAdjacentHTML("afterbegin", '<div id="hub-hero"></div>');
    renderNav();

    // Hero in view → no second search field (avoids two searches at once).
    emitHeroIntersecting(true);
    expect(
      screen.queryByLabelText("Zoek een persoon of hulpvraag"),
    ).not.toBeInTheDocument();

    // Scrolled past the hero → the repeated search reveals.
    emitHeroIntersecting(false);
    expect(
      screen.getByLabelText("Zoek een persoon of hulpvraag"),
    ).toBeInTheDocument();
  });
});
