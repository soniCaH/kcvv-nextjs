/**
 * RelatedNews Component Tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ImageProps } from "next/image";
import { RelatedNews } from "./RelatedNews";

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: ImageProps) => {
    const imgProps = { alt, src: typeof src === "string" ? src : "", ...props };
    return <img {...imgProps} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const mockArticles = [
  {
    title: "KCVV wint derby",
    href: "/news/derby",
    imageUrl: "https://picsum.photos/400/300",
    imageAlt: "Derby match",
    date: "15 jan 2025",
  },
  {
    title: "Nieuwe spelers",
    href: "/news/spelers",
    imageUrl: "https://picsum.photos/400/300",
    imageAlt: "Players",
    date: "14 jan 2025",
  },
];

describe("RelatedNews", () => {
  describe("Empty state", () => {
    it("renders nothing when articles array is empty", () => {
      const { container } = render(<RelatedNews articles={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Rendering", () => {
    it("renders the default section heading", () => {
      render(<RelatedNews articles={mockArticles} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Gerelateerd nieuws",
      );
    });

    it("renders a custom title when provided", () => {
      render(<RelatedNews articles={mockArticles} title="Meer nieuws" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Meer nieuws",
      );
    });

    it("renders one ArticleCard per article", () => {
      // ArticleCard renders exactly one <a> per card, so link count === article count
      render(<RelatedNews articles={mockArticles} />);
      expect(screen.getAllByRole("link")).toHaveLength(mockArticles.length);
    });

    it("renders article titles", () => {
      render(<RelatedNews articles={mockArticles} />);
      expect(screen.getByText("KCVV wint derby")).toBeInTheDocument();
      expect(screen.getByText("Nieuwe spelers")).toBeInTheDocument();
    });

    it("applies className to the section element", () => {
      const { container } = render(
        <RelatedNews articles={mockArticles} className="custom-class" />,
      );
      expect(container.querySelector("section")).toHaveClass("custom-class");
    });
  });
});
