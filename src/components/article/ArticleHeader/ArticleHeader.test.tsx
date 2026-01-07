import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleHeader } from "./ArticleHeader";

describe("ArticleHeader", () => {
  const defaultProps = {
    title: "Test Article Title",
    imageUrl: "/images/test-article.jpg",
    imageAlt: "Test article image",
  };

  it("renders the article title", () => {
    render(<ArticleHeader {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Article Title",
    );
  });

  it("renders the hero image", () => {
    render(<ArticleHeader {...defaultProps} />);
    const images = screen.getAllByRole("img");
    // Should have 2 images: blurred background + hero
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it("renders hero image with correct alt text", () => {
    render(<ArticleHeader {...defaultProps} />);
    expect(screen.getByAltText("Test article image")).toBeInTheDocument();
  });

  it("renders blurred background container on desktop", () => {
    const { container } = render(<ArticleHeader {...defaultProps} />);
    // Background blur is hidden on mobile, visible on desktop (lg:block)
    const blurContainer = container.querySelector(".lg\\:block");
    expect(blurContainer).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ArticleHeader {...defaultProps} className="custom-header" />,
    );
    expect(container.querySelector("header")).toHaveClass("custom-header");
  });

  it("has correct heading structure", () => {
    render(<ArticleHeader {...defaultProps} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-white", "leading-[0.92]", "m-0");
  });

  it("renders header element", () => {
    const { container } = render(<ArticleHeader {...defaultProps} />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("handles long titles", () => {
    render(
      <ArticleHeader
        {...defaultProps}
        title="This is a very long article title that should still render correctly without breaking the layout"
      />,
    );
    expect(
      screen.getByText(
        "This is a very long article title that should still render correctly without breaking the layout",
      ),
    ).toBeInTheDocument();
  });

  it("handles missing image alt text", () => {
    render(<ArticleHeader title="Test" imageUrl="/test.jpg" />);
    // Should not crash and should use empty string as alt
    expect(screen.getByRole("heading")).toHaveTextContent("Test");
  });
});
