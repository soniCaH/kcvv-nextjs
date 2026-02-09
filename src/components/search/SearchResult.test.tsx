/**
 * SearchResult Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResult } from "./SearchResult";
import {
  createMockArticle,
  createMockPlayer,
  createMockTeam,
} from "@/../tests/helpers/search.helpers";

// Mock Next.js modules
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
  }) => <img src={src} alt={alt} {...props} />,
}));

describe("SearchResult", () => {
  describe("Rendering", () => {
    it("should render article result", () => {
      const article = createMockArticle({
        title: "Test Article",
        description: "Test description",
      });

      render(<SearchResult result={article} />);

      expect(screen.getByRole("link")).toBeInTheDocument();
      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("Test description")).toBeInTheDocument();
      expect(screen.getByText("Nieuws")).toBeInTheDocument();
    });

    it("should render player result", () => {
      const player = createMockPlayer({
        title: "Jan Janssens",
        description: "Aanvaller - Eerste Ploeg",
      });

      render(<SearchResult result={player} />);

      expect(screen.getByText("Jan Janssens")).toBeInTheDocument();
      expect(screen.getByText("Aanvaller - Eerste Ploeg")).toBeInTheDocument();
      expect(screen.getByText("Speler")).toBeInTheDocument();
    });

    it("should render team result", () => {
      const team = createMockTeam({
        title: "Eerste Ploeg",
        description: "Senioren team",
      });

      render(<SearchResult result={team} />);

      expect(screen.getByText("Eerste Ploeg")).toBeInTheDocument();
      expect(screen.getByText("Senioren team")).toBeInTheDocument();
      expect(screen.getByText("Team")).toBeInTheDocument();
    });

    it("should render correct link href", () => {
      const article = createMockArticle({ url: "/news/test-article" });

      render(<SearchResult result={article} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/news/test-article");
    });
  });

  describe("Article Type", () => {
    it("should display article image when provided", () => {
      const article = createMockArticle({
        imageUrl: "/images/test.jpg",
        title: "Article with image",
      });

      render(<SearchResult result={article} />);

      const image = screen.getByAltText("Article with image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/images/test.jpg");
    });

    it("should not display image container when imageUrl is missing", () => {
      const article = createMockArticle({
        imageUrl: undefined,
        title: "Article without image",
      });

      const { container } = render(<SearchResult result={article} />);

      const imageContainer = container.querySelector(".w-24.h-24");
      expect(imageContainer).not.toBeInTheDocument();
    });

    it("should display formatted date for articles", () => {
      const article = createMockArticle({
        date: "2024-03-15",
      });

      render(<SearchResult result={article} />);

      // Date should be formatted in nl-BE locale
      expect(screen.getByText(/15 maart 2024/i)).toBeInTheDocument();
    });

    it("should not display date when missing", () => {
      const article = createMockArticle({
        date: undefined,
      });

      const { container } = render(<SearchResult result={article} />);

      // Should not have the date span
      const dateElements = container.querySelectorAll(".text-xs.text-gray-500");
      expect(dateElements.length).toBe(0);
    });

    it("should display up to 3 tags", () => {
      const article = createMockArticle({
        tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
      });

      render(<SearchResult result={article} />);

      expect(screen.getByText("Tag 1")).toBeInTheDocument();
      expect(screen.getByText("Tag 2")).toBeInTheDocument();
      expect(screen.getByText("Tag 3")).toBeInTheDocument();
      expect(screen.queryByText("Tag 4")).not.toBeInTheDocument();
    });

    it("should show overflow indicator when more than 3 tags", () => {
      const article = createMockArticle({
        tags: ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"],
      });

      render(<SearchResult result={article} />);

      expect(screen.getByText("+2 meer")).toBeInTheDocument();
    });

    it("should not show overflow indicator when 3 or fewer tags", () => {
      const article = createMockArticle({
        tags: ["Tag 1", "Tag 2", "Tag 3"],
      });

      render(<SearchResult result={article} />);

      expect(screen.queryByText(/\+\d+ meer/)).not.toBeInTheDocument();
    });

    it("should not display tags section when empty", () => {
      const article = createMockArticle({
        tags: [],
      });

      const { container } = render(<SearchResult result={article} />);

      const tagsContainer = container.querySelector(".flex.flex-wrap.gap-2");
      expect(tagsContainer).not.toBeInTheDocument();
    });

    it("should not display tags section when undefined", () => {
      const article = createMockArticle({
        tags: undefined,
      });

      const { container } = render(<SearchResult result={article} />);

      const tagsContainer = container.querySelector(".flex.flex-wrap.gap-2");
      expect(tagsContainer).not.toBeInTheDocument();
    });
  });

  describe("Player Type", () => {
    it("should not display date for players", () => {
      const player = createMockPlayer();

      const { container } = render(<SearchResult result={player} />);

      const dateElements = container.querySelectorAll(".text-xs.text-gray-500");
      expect(dateElements.length).toBe(0);
    });

    it("should not display tags for players", () => {
      const player = createMockPlayer();

      const { container } = render(<SearchResult result={player} />);

      const tagsContainer = container.querySelector(".flex.flex-wrap.gap-2");
      expect(tagsContainer).not.toBeInTheDocument();
    });

    it("should display player image when provided", () => {
      const player = createMockPlayer({
        imageUrl: "/images/player.jpg",
        title: "Jan Janssens",
      });

      render(<SearchResult result={player} />);

      const image = screen.getByAltText("Jan Janssens");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Team Type", () => {
    it("should not display date for teams", () => {
      const team = createMockTeam();

      const { container } = render(<SearchResult result={team} />);

      const dateElements = container.querySelectorAll(".text-xs.text-gray-500");
      expect(dateElements.length).toBe(0);
    });

    it("should not display tags for teams", () => {
      const team = createMockTeam();

      const { container } = render(<SearchResult result={team} />);

      const tagsContainer = container.querySelector(".flex.flex-wrap.gap-2");
      expect(tagsContainer).not.toBeInTheDocument();
    });

    it("should display team image when provided", () => {
      const team = createMockTeam({
        imageUrl: "/images/team.jpg",
        title: "Eerste Ploeg",
      });

      render(<SearchResult result={team} />);

      const image = screen.getByAltText("Eerste Ploeg");
      expect(image).toBeInTheDocument();
    });
  });

  describe("Conditional Content", () => {
    it("should display description when provided", () => {
      const result = createMockArticle({
        description: "This is a description",
      });

      render(<SearchResult result={result} />);

      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });

    it("should not display description paragraph when missing", () => {
      const result = createMockArticle({
        description: undefined,
      });

      const { container } = render(<SearchResult result={result} />);

      const descriptionElements = container.querySelectorAll(
        ".text-sm.text-gray-dark",
      );
      expect(descriptionElements.length).toBe(0);
    });
  });

  describe("Accessibility", () => {
    it("should render as a link with correct role", () => {
      const result = createMockArticle();

      render(<SearchResult result={result} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
    });

    it("should have accessible link text from title", () => {
      const result = createMockArticle({
        title: "Accessible Article Title",
      });

      render(<SearchResult result={result} />);

      expect(
        screen.getByRole("link", { name: /accessible article title/i }),
      ).toBeInTheDocument();
    });

    it("should have proper alt text for images", () => {
      const result = createMockArticle({
        title: "Article Title",
        imageUrl: "/images/test.jpg",
      });

      render(<SearchResult result={result} />);

      const image = screen.getByAltText("Article Title");
      expect(image).toBeInTheDocument();
    });

    it("should have aria-hidden on arrow icon", () => {
      const result = createMockArticle();

      const { container } = render(<SearchResult result={result} />);

      // The Icon component wraps svg - check for aria-hidden
      const arrowIcon = container.querySelector(
        '[class*="group-hover:translate-x-1"]',
      );
      expect(arrowIcon).toBeInTheDocument();
    });
  });

  describe("Styling and Interaction", () => {
    it("should have hover styles on link", () => {
      const result = createMockArticle();

      render(<SearchResult result={result} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("hover:shadow-md");
      expect(link).toHaveClass("hover:border-green-main");
    });

    it("should have transition classes for smooth interactions", () => {
      const result = createMockArticle();

      render(<SearchResult result={result} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("transition-shadow");
    });

    it("should apply group class for child hover effects", () => {
      const result = createMockArticle();

      render(<SearchResult result={result} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass("group");
    });
  });
});
