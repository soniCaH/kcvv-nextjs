/**
 * TeamSectionNav tests
 *
 * Renders nothing at ≤1 section. The scroll arrow follows real overflow at
 * the current width (#2444, as corrected by #2478 and #2489) — it is not
 * permanently inert: today's three-item row is pre-season, not a fixed
 * ceiling, and the arrow's reserved 40px rail on both sides tracks
 * `useScrollHint`'s `overflows`, the same "row of discrete things" rule
 * `<FilterTabs>` uses, rather than a breakpoint-gated rail.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamSectionNav, type TeamSectionNavItem } from "./TeamSectionNav";

const THREE_ITEMS: TeamSectionNavItem[] = [
  { id: "wedstrijden", label: "Wedstrijden" },
  { id: "spelers", label: "Spelers" },
  { id: "staf", label: "Staf" },
];

const FIVE_ITEMS: TeamSectionNavItem[] = [
  { id: "klassement", label: "Klassement" },
  { id: "wedstrijden", label: "Wedstrijden" },
  { id: "spelers", label: "Spelers" },
  { id: "staf", label: "Staf" },
  { id: "info", label: "Info" },
];

function mockScrollDimensions(scrollWidth: number, clientWidth: number) {
  const originalScrollWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "scrollWidth",
  );
  const originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth",
  );

  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });

  return () => {
    if (originalScrollWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "scrollWidth",
        originalScrollWidth,
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).scrollWidth;
    }
    if (originalClientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "clientWidth",
        originalClientWidth,
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (HTMLElement.prototype as any).clientWidth;
    }
  };
}

describe("TeamSectionNav", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing with zero sections", () => {
    const { container } = render(<TeamSectionNav items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing with exactly one section", () => {
    const { container } = render(
      <TeamSectionNav items={[{ id: "spelers", label: "Spelers" }]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders every item as an anchor link", () => {
    render(<TeamSectionNav items={THREE_ITEMS} />);
    expect(screen.getByRole("link", { name: "Wedstrijden" })).toHaveAttribute(
      "href",
      "#wedstrijden",
    );
    expect(screen.getByRole("link", { name: "Spelers" })).toHaveAttribute(
      "href",
      "#spelers",
    );
    expect(screen.getByRole("link", { name: "Staf" })).toHaveAttribute(
      "href",
      "#staf",
    );
  });

  describe("scroll arrow — real overflow, not a permanent ceiling", () => {
    it("mounts no arrow when the row fits (today's pre-season three-item case)", () => {
      const restore = mockScrollDimensions(300, 300);
      render(<TeamSectionNav items={THREE_ITEMS} />);

      expect(screen.queryByLabelText("Scroll left")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Scroll right")).not.toBeInTheDocument();
      restore();
    });

    it("mounts the control arrow with a reserved rail once the row overflows (e.g. full five-section count on a narrow width)", () => {
      const restore = mockScrollDimensions(700, 343);
      render(<TeamSectionNav items={FIVE_ITEMS} />);

      const rightArrow = screen.getByLabelText("Scroll right");
      expect(rightArrow).toBeInTheDocument();
      expect(rightArrow).toHaveClass("bg-jersey-deep");
      expect(rightArrow).toHaveClass("h-8");

      const list = screen.getByRole("list");
      expect(list).toHaveClass("pl-10");
      expect(list).toHaveClass("pr-10");
      restore();
    });

    it("disables the spent direction in place instead of unmounting it", () => {
      const restore = mockScrollDimensions(700, 343);
      render(<TeamSectionNav items={FIVE_ITEMS} />);

      const list = screen.getByRole("list");
      Object.defineProperty(list, "scrollLeft", { value: 357 });
      act(() => {
        list.dispatchEvent(new Event("scroll"));
      });

      const rightArrow = screen.getByLabelText("Scroll right");
      expect(rightArrow).toBeInTheDocument();
      expect(rightArrow).toBeDisabled();
      expect(screen.getByLabelText("Scroll left")).toBeEnabled();
      restore();
    });

    it("scrolls the list when the arrow is clicked", async () => {
      const user = userEvent.setup();
      const restore = mockScrollDimensions(700, 343);
      Object.defineProperty(HTMLElement.prototype, "scrollTo", {
        configurable: true,
        value: vi.fn(),
      });
      render(<TeamSectionNav items={FIVE_ITEMS} />);

      await user.click(screen.getByLabelText("Scroll right"));
      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalled();
      restore();
    });
  });
});
