/**
 * TeamOverview Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamOverview, type TeamData } from "./TeamOverview";

const mockYouthTeams: TeamData[] = [
  { name: "U15", href: "/jeugd/u15", ageGroup: "U15", teamType: "youth" },
  { name: "U10", href: "/jeugd/u10", ageGroup: "U10", teamType: "youth" },
  { name: "U17", href: "/jeugd/u17", ageGroup: "U17", teamType: "youth" },
  { name: "U6", href: "/jeugd/u6", ageGroup: "U6", teamType: "youth" },
];

const mockSeniorTeams: TeamData[] = [
  {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
    tagline: "The A-Team",
    teamType: "senior",
  },
  { name: "B-Ploeg", href: "/team/b-ploeg", teamType: "senior" },
];

const _mockClubTeams: TeamData[] = [
  {
    name: "Bestuur",
    href: "/club/bestuur",
    tagline: "Het kloppend hart",
    teamType: "club",
  },
];

describe("TeamOverview", () => {
  describe("Rendering", () => {
    it("should render all teams", () => {
      render(<TeamOverview teams={mockYouthTeams} />);
      // Use getAllByText since team name appears in both badge and heading
      expect(screen.getAllByText("U15").length).toBeGreaterThan(0);
      expect(screen.getAllByText("U10").length).toBeGreaterThan(0);
      expect(screen.getAllByText("U17").length).toBeGreaterThan(0);
      expect(screen.getAllByText("U6").length).toBeGreaterThan(0);
    });

    it("should render team cards as links", () => {
      render(<TeamOverview teams={mockYouthTeams} />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBe(mockYouthTeams.length);
    });

    it("should render correct number of teams", () => {
      render(<TeamOverview teams={mockYouthTeams} />);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBe(mockYouthTeams.length);
    });
  });

  describe("Sorting", () => {
    it("should sort youth teams by age (youngest first)", () => {
      render(<TeamOverview teams={mockYouthTeams} teamType="youth" />);
      const articles = screen.getAllByRole("article");
      const names = articles.map(
        (a) => within(a).getByRole("heading").textContent,
      );
      expect(names).toEqual(["U6", "U10", "U15", "U17"]);
    });

    it("should sort senior teams alphabetically", () => {
      render(<TeamOverview teams={mockSeniorTeams} teamType="senior" />);
      const articles = screen.getAllByRole("article");
      const names = articles.map(
        (a) => within(a).getByRole("heading").textContent,
      );
      expect(names).toEqual(["A-Ploeg", "B-Ploeg"]);
    });
  });

  describe("Filtering", () => {
    it("should filter teams by type", () => {
      const allTeams = [...mockYouthTeams, ...mockSeniorTeams];
      render(<TeamOverview teams={allTeams} teamType="youth" />);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBe(mockYouthTeams.length);
    });

    it("should show all teams when teamType is 'all'", () => {
      const allTeams = [...mockYouthTeams, ...mockSeniorTeams];
      render(<TeamOverview teams={allTeams} teamType="all" />);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBe(allTeams.length);
    });
  });

  describe("Filter Buttons", () => {
    it("should render filter buttons when showFilters is true", () => {
      render(
        <TeamOverview teams={mockYouthTeams} showFilters teamType="all" />,
      );
      expect(screen.getByText("Alle teams")).toBeInTheDocument();
      expect(screen.getByText("Senioren")).toBeInTheDocument();
      expect(screen.getByText("Jeugd")).toBeInTheDocument();
      expect(screen.getByText("Club")).toBeInTheDocument();
    });

    it("should not render filter buttons by default", () => {
      render(<TeamOverview teams={mockYouthTeams} />);
      expect(screen.queryByText("Alle teams")).not.toBeInTheDocument();
    });

    it("should filter teams when filter button is clicked", async () => {
      const user = userEvent.setup();
      const allTeams = [...mockYouthTeams, ...mockSeniorTeams];
      render(<TeamOverview teams={allTeams} showFilters teamType="all" />);

      // Initially all teams
      expect(screen.getAllByRole("article").length).toBe(allTeams.length);

      // Click youth filter
      await user.click(screen.getByText("Jeugd"));
      expect(screen.getAllByRole("article").length).toBe(mockYouthTeams.length);

      // Click senior filter
      await user.click(screen.getByText("Senioren"));
      expect(screen.getAllByRole("article").length).toBe(
        mockSeniorTeams.length,
      );
    });
  });

  describe("Grouping", () => {
    it("should group youth teams by age category when groupByAge is true", () => {
      render(
        <TeamOverview teams={mockYouthTeams} groupByAge teamType="youth" />,
      );
      // Should have section headings
      expect(screen.getByText("Kleuters (U6-U7)")).toBeInTheDocument();
      expect(screen.getByText("Preminiemen (U10-U11)")).toBeInTheDocument();
      expect(screen.getByText("Kadetten (U14-U15)")).toBeInTheDocument();
      expect(screen.getByText("Scholieren (U16-U17)")).toBeInTheDocument();
    });

    it("should not group when groupByAge is false", () => {
      render(<TeamOverview teams={mockYouthTeams} teamType="youth" />);
      expect(screen.queryByText("Kleuters (U6-U7)")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should render loading skeletons when isLoading is true", () => {
      render(<TeamOverview teams={[]} isLoading />);
      expect(screen.getByLabelText("Teams laden...")).toBeInTheDocument();
    });

    it("should not render teams when loading", () => {
      render(<TeamOverview teams={mockYouthTeams} isLoading />);
      expect(screen.queryByText("U15")).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should render empty message when no teams", () => {
      render(<TeamOverview teams={[]} />);
      expect(screen.getByText("Geen teams gevonden")).toBeInTheDocument();
    });

    it("should render custom empty message", () => {
      render(<TeamOverview teams={[]} emptyMessage="No teams available" />);
      expect(screen.getByText("No teams available")).toBeInTheDocument();
    });

    it("should not render empty message when teams exist", () => {
      render(<TeamOverview teams={mockYouthTeams} />);
      expect(screen.queryByText("Geen teams gevonden")).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should use default grid variant by default", () => {
      const { container } = render(<TeamOverview teams={mockYouthTeams} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("should use compact grid when variant is compact", () => {
      const { container } = render(
        <TeamOverview teams={mockYouthTeams} variant="compact" />,
      );
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("lg:grid-cols-4");
    });
  });

  describe("Custom className", () => {
    it("should apply custom className", () => {
      const { container } = render(
        <TeamOverview teams={mockYouthTeams} className="custom-class" />,
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });
  });

  describe("Team Type Styling", () => {
    it("should render senior teams without age badges", () => {
      const { container } = render(
        <TeamOverview teams={mockSeniorTeams} teamType="senior" />,
      );
      // Senior teams shouldn't have the age badge (absolute positioned div)
      const articles = container.querySelectorAll("article");
      articles.forEach((article) => {
        const badge = article.querySelector(".absolute.top-3.left-3");
        expect(badge).toBeNull();
      });
    });

    it("should render youth teams with age badges", () => {
      const { container } = render(
        <TeamOverview teams={mockYouthTeams} teamType="youth" />,
      );
      const articles = container.querySelectorAll("article");
      articles.forEach((article) => {
        const badge = article.querySelector(".absolute.top-3.left-3");
        expect(badge).toBeInTheDocument();
      });
    });
  });
});
