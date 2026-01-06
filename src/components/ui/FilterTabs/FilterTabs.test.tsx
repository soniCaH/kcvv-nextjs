/**
 * FilterTabs Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterTabs, type FilterTab } from "./FilterTabs";

const mockTabs: FilterTab[] = [
  { value: "all", label: "All", count: 10 },
  { value: "active", label: "Active", count: 5 },
  { value: "inactive", label: "Inactive", count: 3 },
  { value: "archived", label: "Archived", count: 2 },
];

describe("FilterTabs", () => {
  describe("Rendering", () => {
    it("should render all tabs", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      expect(screen.getByRole("tab", { name: "All 10" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Active 5" })).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Inactive 3" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Archived 2" }),
      ).toBeInTheDocument();
    });

    it("should render with custom aria-label", () => {
      render(
        <FilterTabs
          tabs={mockTabs}
          activeTab="all"
          ariaLabel="Category filters"
        />,
      );

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("aria-label", "Category filters");
    });

    it("should render with default aria-label", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("aria-label", "Filter tabs");
    });
  });

  describe("Active Tab", () => {
    it("should highlight the active tab", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="active" />);

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      expect(activeTab).toHaveAttribute("aria-selected", "true");
      expect(activeTab).toHaveClass("bg-kcvv-green-bright", "text-white");
    });

    it("should not highlight inactive tabs", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="active" />);

      const inactiveTab = screen.getByRole("tab", { name: "All 10" });
      expect(inactiveTab).toHaveAttribute("aria-selected", "false");
      expect(inactiveTab).toHaveClass("text-kcvv-green-bright");
    });

    it("should set correct tabIndex for active and inactive tabs", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="active" />);

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      const inactiveTab = screen.getByRole("tab", { name: "All 10" });

      expect(activeTab).toHaveAttribute("tabIndex", "0");
      expect(inactiveTab).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("Count Badges", () => {
    it("should show count badges by default", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should hide count badges when showCounts is false", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" showCounts={false} />);

      expect(screen.queryByText("10")).not.toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("should not render count badge when count is undefined", () => {
      const tabsWithoutCounts: FilterTab[] = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
      ];

      render(<FilterTabs tabs={tabsWithoutCounts} activeTab="all" />);

      // Should render tabs but no count badges
      expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Active" })).toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("should render small size", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" size="sm" />);

      const tab = screen.getByRole("tab", { name: /all/i });
      expect(tab).toHaveClass("px-4", "py-2", "text-xs");
    });

    it("should render medium size by default", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      const tab = screen.getByRole("tab", { name: /all/i });
      expect(tab).toHaveClass("px-6", "py-3", "text-sm");
    });

    it("should render large size", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" size="lg" />);

      const tab = screen.getByRole("tab", { name: /all/i });
      expect(tab).toHaveClass("px-8", "py-4", "text-base");
    });
  });

  describe("Interactions", () => {
    it("should call onChange when tab is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <FilterTabs tabs={mockTabs} activeTab="all" onChange={handleChange} />,
      );

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      await user.click(activeTab);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("active");
    });

    it("should not call onChange when renderAsLinks is true", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      const tabsWithHrefs = mockTabs.map((tab) => ({
        ...tab,
        href: `/${tab.value}`,
      }));

      render(
        <FilterTabs
          tabs={tabsWithHrefs}
          activeTab="all"
          onChange={handleChange}
          renderAsLinks
        />,
      );

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      await user.click(activeTab);

      // onChange should not be called for links
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Render as Links", () => {
    it("should render as buttons by default", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab.tagName).toBe("BUTTON");
      });
    });

    it("should render as links when renderAsLinks is true", () => {
      const tabsWithHrefs = mockTabs.map((tab) => ({
        ...tab,
        href: `/${tab.value}`,
      }));

      render(
        <FilterTabs
          tabs={tabsWithHrefs}
          activeTab="all"
          renderAsLinks={true}
        />,
      );

      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab.tagName).toBe("A");
      });
    });

    it("should set aria-current on active link", () => {
      const tabsWithHrefs = mockTabs.map((tab) => ({
        ...tab,
        href: `/${tab.value}`,
      }));

      render(
        <FilterTabs
          tabs={tabsWithHrefs}
          activeTab="active"
          renderAsLinks={true}
        />,
      );

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      expect(activeTab).toHaveAttribute("aria-current", "page");
    });

    it("should set correct href on links", () => {
      const tabsWithHrefs = mockTabs.map((tab) => ({
        ...tab,
        href: `/${tab.value}`,
      }));

      render(
        <FilterTabs
          tabs={tabsWithHrefs}
          activeTab="all"
          renderAsLinks={true}
        />,
      );

      const allTab = screen.getByRole("tab", { name: /all/i });
      expect(allTab).toHaveAttribute("href", "/all");
    });
  });

  describe("Scroll Arrows", () => {
    beforeEach(() => {
      // Mock scrollWidth to trigger arrow visibility
      Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        value: 500,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should show right arrow when content overflows", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      // Right arrow should be visible when there's overflow
      const rightArrow = screen.getByLabelText("Scroll right");
      expect(rightArrow).toBeInTheDocument();
    });

    it("should call scroll when arrow is clicked", async () => {
      const user = userEvent.setup();
      const scrollToMock = vi.fn();

      Object.defineProperty(HTMLElement.prototype, "scrollTo", {
        configurable: true,
        value: scrollToMock,
      });

      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      const rightArrow = screen.getByLabelText("Scroll right");
      await user.click(rightArrow);

      expect(scrollToMock).toHaveBeenCalled();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <FilterTabs tabs={mockTabs} activeTab="all" className="custom-class" />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA roles", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      expect(screen.getByRole("tablist")).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(4);
    });

    it("should have proper aria-selected attributes", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="active" />);

      const activeTab = screen.getByRole("tab", { name: "Active 5" });
      const inactiveTab = screen.getByRole("tab", { name: "All 10" });

      expect(activeTab).toHaveAttribute("aria-selected", "true");
      expect(inactiveTab).toHaveAttribute("aria-selected", "false");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      // Tab to first button (active one should have tabIndex 0)
      await user.tab();
      const activeTab = screen.getByRole("tab", { name: /all/i });
      expect(activeTab).toHaveFocus();
    });

    it("should have focus styles", () => {
      render(<FilterTabs tabs={mockTabs} activeTab="all" />);

      const tab = screen.getByRole("tab", { name: /all/i });
      expect(tab).toHaveClass("focus:outline-none");
    });
  });
});
