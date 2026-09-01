/**
 * SearchFilters Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchFilters } from "./SearchFilters";

describe("SearchFilters", () => {
  const mockResultCounts = {
    all: 10,
    article: 5,
    player: 3,
    staff: 0,
    team: 2,
  };

  describe("Rendering", () => {
    it("should render all filter tabs", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      expect(
        screen.getByRole("button", { name: /alles/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /nieuws/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /spelers/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /staf/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /ploegen/i }),
      ).toBeInTheDocument();
    });

    it("should render with correct ARIA label", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const group = screen.getByRole("group", {
        name: /filter zoekresultaten op type/i,
      });
      expect(group).toBeInTheDocument();
    });
  });

  describe("Tab Configuration", () => {
    it("should configure all five tabs with correct values", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      // Verify tab structure and ordering
      const tabs = screen.getAllByRole("button");
      expect(tabs).toHaveLength(5);
      expect(tabs[3]).toHaveTextContent("Staf");
      expect(within(tabs[3]).getByText("0")).toBeInTheDocument();
    });

    it("should display correct labels for each tab", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      expect(screen.getByText("Alles")).toBeInTheDocument();
      expect(screen.getByText("Nieuws")).toBeInTheDocument();
      expect(screen.getByText("Spelers")).toBeInTheDocument();
      expect(screen.getByText("Staf")).toBeInTheDocument();
      expect(screen.getByText("Ploegen")).toBeInTheDocument();
    });

    it("should display count badges for each tab", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      // Scope count lookups to each tab to avoid false positives
      const allTab = screen.getByRole("button", { name: /alles/i });
      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      const playerTab = screen.getByRole("button", { name: /spelers/i });
      const staffTab = screen.getByRole("button", { name: /staf/i });
      const teamTab = screen.getByRole("button", { name: /ploegen/i });

      expect(within(allTab).getByText("10")).toBeInTheDocument();
      expect(within(articleTab).getByText("5")).toBeInTheDocument();
      expect(within(playerTab).getByText("3")).toBeInTheDocument();
      expect(within(staffTab).getByText("0")).toBeInTheDocument();
      expect(within(teamTab).getByText("2")).toBeInTheDocument();
    });

    it("should handle zero counts", () => {
      const zeroCounts = {
        all: 0,
        article: 0,
        player: 0,
        staff: 0,
        team: 0,
      };

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={zeroCounts}
        />,
      );

      // All tabs should still render
      const tabs = screen.getAllByRole("button");
      expect(tabs).toHaveLength(5);
    });
  });

  describe("Active State", () => {
    it("should mark 'all' tab as active when activeType is 'all'", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const allTab = screen.getByRole("button", { name: /alles/i });
      expect(allTab).toHaveAttribute("aria-pressed", "true");
    });

    it("should mark 'article' tab as active when activeType is 'article'", () => {
      render(
        <SearchFilters
          activeType="article"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      expect(articleTab).toHaveAttribute("aria-pressed", "true");
    });

    it("should mark 'player' tab as active when activeType is 'player'", () => {
      render(
        <SearchFilters
          activeType="player"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const playerTab = screen.getByRole("button", { name: /spelers/i });
      expect(playerTab).toHaveAttribute("aria-pressed", "true");
    });

    it("should mark 'team' tab as active when activeType is 'team'", () => {
      render(
        <SearchFilters
          activeType="team"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const teamTab = screen.getByRole("button", { name: /ploegen/i });
      expect(teamTab).toHaveAttribute("aria-pressed", "true");
    });

    it("should have only one active tab at a time", () => {
      render(
        <SearchFilters
          activeType="article"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      const selectedTabs = screen.getAllByRole("button", { pressed: true });
      expect(selectedTabs).toHaveLength(1);
      expect(selectedTabs[0]).toHaveTextContent("Nieuws");
    });
  });

  describe("Filter Change", () => {
    it("should call onFilterChange with 'all' when all tab is clicked", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="article"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const allTab = screen.getByRole("button", { name: /alles/i });
      await user.click(allTab);

      expect(handleFilterChange).toHaveBeenCalledWith("all");
    });

    it("should call onFilterChange with 'article' when article tab is clicked", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      await user.click(articleTab);

      expect(handleFilterChange).toHaveBeenCalledWith("article");
    });

    it("should call onFilterChange with 'player' when player tab is clicked", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const playerTab = screen.getByRole("button", { name: /spelers/i });
      await user.click(playerTab);

      expect(handleFilterChange).toHaveBeenCalledWith("player");
    });

    it("should call onFilterChange with 'team' when team tab is clicked", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const teamTab = screen.getByRole("button", { name: /ploegen/i });
      await user.click(teamTab);

      expect(handleFilterChange).toHaveBeenCalledWith("team");
    });

    it("should call onFilterChange when clicking active tab", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="article"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      await user.click(articleTab);

      // FilterTabs allows clicking active tab
      expect(handleFilterChange).toHaveBeenCalledWith("article");
    });
  });

  describe("Result Counts", () => {
    it("should update counts when resultCounts prop changes", () => {
      const { rerender } = render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();

      const newCounts = {
        all: 20,
        article: 10,
        player: 7,
        staff: 0,
        team: 3,
      };

      rerender(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={newCounts}
        />,
      );

      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  describe("FilterTabs Integration", () => {
    it("should pass correct props to FilterTabs", () => {
      render(
        <SearchFilters
          activeType="article"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      // Verify prop-driven behavior: activeType determines which tab is selected
      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      expect(articleTab).toHaveAttribute("aria-pressed", "true");

      // Verify resultCounts are rendered in the tabs
      expect(screen.getByText("5")).toBeInTheDocument(); // article count
    });

    it("should configure FilterTabs to show counts", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      // Counts should be visible
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should configure FilterTabs as buttons (not links)", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      // All tabs should be buttons
      const tabs = screen.getAllByRole("button");
      tabs.forEach((tab) => {
        expect(tab.tagName).toBe("BUTTON");
      });
    });
  });

  describe("Accessibility", () => {
    it("should use group role for semantic structure", () => {
      render(
        <SearchFilters
          activeType="all"
          onFilterChange={vi.fn()}
          resultCounts={mockResultCounts}
        />,
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("should support Enter key activation", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const articleTab = screen.getByRole("button", { name: /nieuws/i });
      articleTab.focus();
      await user.keyboard("{Enter}");

      expect(handleFilterChange).toHaveBeenCalledWith("article");
    });

    it("should support Space key activation", async () => {
      const user = userEvent.setup();
      const handleFilterChange = vi.fn();

      render(
        <SearchFilters
          activeType="all"
          onFilterChange={handleFilterChange}
          resultCounts={mockResultCounts}
        />,
      );

      const playerTab = screen.getByRole("button", { name: /spelers/i });
      playerTab.focus();
      await user.keyboard(" ");

      expect(handleFilterChange).toHaveBeenCalledWith("player");
    });
  });
});
