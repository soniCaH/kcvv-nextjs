import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleBody } from "./ArticleBody";

describe("ArticleBody", () => {
  it("renders HTML content", () => {
    const html = "<p>This is test content</p>";
    render(<ArticleBody content={html} />);
    expect(screen.getByText("This is test content")).toBeInTheDocument();
  });

  it("renders multiple paragraphs", () => {
    const html = "<p>First paragraph</p><p>Second paragraph</p>";
    render(<ArticleBody content={html} />);
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph")).toBeInTheDocument();
  });

  it("renders headings", () => {
    const html = "<h2>Main Heading</h2><h3>Sub Heading</h3>";
    render(<ArticleBody content={html} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Main Heading" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Sub Heading" }),
    ).toBeInTheDocument();
  });

  it("renders links", () => {
    const html = '<p>Check out <a href="/test">this link</a></p>';
    render(<ArticleBody content={html} />);
    const link = screen.getByRole("link", { name: "this link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("renders lists", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    render(<ArticleBody content={html} />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders blockquotes", () => {
    const html = "<blockquote>This is a quote</blockquote>";
    render(<ArticleBody content={html} />);
    expect(screen.getByText("This is a quote")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ArticleBody content="<p>Test</p>" className="custom-body" />,
    );
    expect(container.querySelector(".article-body")).toHaveClass("custom-body");
  });

  it("has correct base styling classes", () => {
    const { container } = render(<ArticleBody content="<p>Test</p>" />);
    const body = container.querySelector(".article-body");
    expect(body).toHaveClass("p-3", "text-sm", "mt-4");
  });

  it("renders empty content without crashing", () => {
    const { container } = render(<ArticleBody content="" />);
    expect(container.querySelector(".article-body")).toBeInTheDocument();
  });

  it("renders complex HTML structure", () => {
    const html = `
      <h2>Section Title</h2>
      <p>Introduction paragraph with <a href="/test">a link</a>.</p>
      <ul>
        <li>Point one</li>
        <li>Point two</li>
      </ul>
      <blockquote>Important quote</blockquote>
    `;
    render(<ArticleBody content={html} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "a link" })).toBeInTheDocument();
    expect(screen.getByText("Point one")).toBeInTheDocument();
    expect(screen.getByText("Important quote")).toBeInTheDocument();
  });

  it("renders raw HTML and trusts upstream sanitization", () => {
    // Component uses dangerouslySetInnerHTML and trusts Drupal to sanitize
    // This test verifies that HTML is rendered as-is without client-side sanitization
    const html = '<p>Safe content</p><script>alert("XSS")</script>';
    const { container } = render(<ArticleBody content={html} />);

    // Verify content is rendered
    expect(container.textContent).toContain("Safe content");

    // Script tag is preserved in HTML (browser security prevents execution in test environment)
    expect(container.innerHTML).toContain("<script>");
  });

  it("renders images", () => {
    const html = '<img src="/test.jpg" alt="Test image" />';
    render(<ArticleBody content={html} />);
    expect(screen.getByAltText("Test image")).toBeInTheDocument();
  });

  it("renders content with inline styles", () => {
    const html = '<p style="color: red;">Styled paragraph</p>';
    render(<ArticleBody content={html} />);
    expect(screen.getByText("Styled paragraph")).toBeInTheDocument();
  });
});
