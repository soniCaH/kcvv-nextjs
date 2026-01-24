/**
 * TeamCard Component Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamCard } from "./TeamCard";

describe("TeamCard", () => {
  const defaultProps = {
    name: "A-Ploeg",
    href: "/team/a-ploeg",
  };

  describe("Rendering", () => {
    it("should render team name", () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.getByText("A-Ploeg")).toBeInTheDocument();
    });

    it("should render as article element", () => {
      const { container } = render(<TeamCard {...defaultProps} />);
      expect(container.querySelector("article")).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      render(<TeamCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/team/a-ploeg");
    });

    it("should have accessible label with team name", () => {
      render(<TeamCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-label", "Bekijk team A-Ploeg");
    });

    it("should include tagline in accessible label when provided", () => {
      render(<TeamCard {...defaultProps} tagline="The A-Team" />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Bekijk team A-Ploeg, The A-Team",
      );
    });

    it("should include age group in accessible label when provided", () => {
      render(
        <TeamCard
          name="U15"
          href="/jeugd/u15"
          ageGroup="U15"
          teamType="youth"
        />,
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Bekijk team U15, leeftijdsgroep U15",
      );
    });
  });

  describe("Tagline", () => {
    it("should display tagline when provided", () => {
      render(<TeamCard {...defaultProps} tagline="The A-Team" />);
      expect(screen.getByText("The A-Team")).toBeInTheDocument();
    });

    it("should not display tagline when not provided", () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.queryByText("The A-Team")).not.toBeInTheDocument();
    });
  });

  describe("Age Group Badge", () => {
    it("should display age group badge for youth teams", () => {
      const { container } = render(
        <TeamCard
          name="U15"
          href="/jeugd/u15"
          ageGroup="U15"
          teamType="youth"
        />,
      );
      // Badge has specific positioning classes
      const badge = container.querySelector(".absolute.top-3.left-3");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("U15");
    });

    it("should not display age group badge when not provided", () => {
      const { container } = render(
        <TeamCard {...defaultProps} teamType="senior" />,
      );
      // Should not have the badge element
      const badge = container.querySelector(".absolute.top-3.left-3");
      expect(badge).toBeNull();
    });
  });

  describe("Team Image", () => {
    it("should render image when imageUrl is provided", () => {
      render(
        <TeamCard {...defaultProps} imageUrl="https://example.com/team.jpg" />,
      );
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Team foto A-Ploeg");
    });

    it("should render placeholder icon when no image provided", () => {
      const { container } = render(<TeamCard {...defaultProps} />);
      // Should have the Users icon as placeholder
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("Coach Info", () => {
    it("should display coach name when provided", () => {
      render(<TeamCard {...defaultProps} coach={{ name: "Jan Peeters" }} />);
      expect(screen.getByText("Jan Peeters")).toBeInTheDocument();
    });

    it("should display coach image when provided", () => {
      render(
        <TeamCard
          {...defaultProps}
          coach={{
            name: "Jan Peeters",
            imageUrl: "https://example.com/coach.jpg",
          }}
        />,
      );
      const images = screen.getAllByRole("img");
      expect(
        images.some((img) => img.getAttribute("alt") === "Jan Peeters"),
      ).toBe(true);
    });

    it("should not display coach section when not provided", () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.queryByText("Jan Peeters")).not.toBeInTheDocument();
    });
  });

  describe("Win/Draw/Loss Record", () => {
    it("should display record when provided", () => {
      render(
        <TeamCard
          {...defaultProps}
          record={{ wins: 12, draws: 5, losses: 3 }}
        />,
      );
      expect(screen.getByText("12W")).toBeInTheDocument();
      expect(screen.getByText("5D")).toBeInTheDocument();
      expect(screen.getByText("3L")).toBeInTheDocument();
    });

    it("should not display record when not provided", () => {
      render(<TeamCard {...defaultProps} />);
      expect(screen.queryByText(/\d+W/)).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should render loading skeleton when isLoading is true", () => {
      render(<TeamCard name="" href="" isLoading />);
      expect(screen.getByLabelText("Laden...")).toBeInTheDocument();
    });

    it("should not render content when loading", () => {
      render(<TeamCard {...defaultProps} isLoading />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render default variant by default", () => {
      const { container } = render(<TeamCard {...defaultProps} />);
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should render compact variant when specified", () => {
      const { container } = render(
        <TeamCard {...defaultProps} variant="compact" />,
      );
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });
  });

  describe("Team Types", () => {
    it("should apply correct styling for senior teams", () => {
      render(<TeamCard {...defaultProps} teamType="senior" />);
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("should apply correct styling for youth teams", () => {
      const { container } = render(
        <TeamCard
          name="U15"
          href="/jeugd/u15"
          teamType="youth"
          ageGroup="U15"
        />,
      );
      // Badge has blue-500 background for youth teams
      const badge = container.querySelector(".absolute.top-3.left-3");
      expect(badge).toHaveClass("bg-blue-500");
    });

    it("should apply correct styling for club teams", () => {
      render(<TeamCard name="Angels" href="/club/angels" teamType="club" />);
      const badge = screen.getByText("Club");
      expect(badge).toHaveClass("bg-amber-500");
    });
  });

  describe("Accessibility", () => {
    it("should have title attribute on link", () => {
      render(<TeamCard {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("title", "Bekijk A-Ploeg");
    });

    it("should have aria-hidden on decorative elements", () => {
      const { container } = render(<TeamCard {...defaultProps} />);
      const decorativeSvgs = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeSvgs.length).toBeGreaterThan(0);
    });
  });

  describe("Custom className", () => {
    it("should apply custom className to article", () => {
      const { container } = render(
        <TeamCard {...defaultProps} className="custom-class" />,
      );
      const article = container.querySelector("article");
      expect(article).toHaveClass("custom-class");
    });
  });
});
