/**
 * MatchReport Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MatchReport } from "./MatchReport";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
  }) => <img src={src} alt={alt} {...props} />,
}));

describe("MatchReport", () => {
  const defaultProps = {
    title: "Wedstrijdverslag",
    content: "<p>KCVV won met 3-1 van KFC Turnhout.</p>",
  };

  describe("rendering", () => {
    it("renders title", () => {
      render(<MatchReport {...defaultProps} />);
      expect(screen.getByText("Wedstrijdverslag")).toBeInTheDocument();
    });

    it("renders content as HTML", () => {
      render(<MatchReport {...defaultProps} />);
      expect(
        screen.getByText("KCVV won met 3-1 van KFC Turnhout."),
      ).toBeInTheDocument();
    });

    it("renders author when provided", () => {
      render(<MatchReport {...defaultProps} author="Kevin Van Ransbeeck" />);
      expect(screen.getByText("Kevin Van Ransbeeck")).toBeInTheDocument();
    });

    it("renders date when provided", () => {
      render(
        <MatchReport {...defaultProps} publishedAt="2024-02-15T18:30:00" />,
      );
      // Date should be formatted in Dutch
      expect(screen.getByText(/15 februari 2024/)).toBeInTheDocument();
    });

    it("renders author and date together", () => {
      render(
        <MatchReport
          {...defaultProps}
          author="Kevin Van Ransbeeck"
          publishedAt="2024-02-15T18:30:00"
        />,
      );
      expect(screen.getByText("Kevin Van Ransbeeck")).toBeInTheDocument();
      expect(screen.getByText(/februari/)).toBeInTheDocument();
    });
  });

  describe("photo gallery", () => {
    it("renders photos when provided", () => {
      const photos = [
        { url: "/photo1.jpg", alt: "Goal celebration" },
        { url: "/photo2.jpg", alt: "Team photo" },
      ];
      render(<MatchReport {...defaultProps} photos={photos} />);
      expect(screen.getByText("Foto's")).toBeInTheDocument();
      expect(screen.getByAltText("Goal celebration")).toBeInTheDocument();
      expect(screen.getByAltText("Team photo")).toBeInTheDocument();
    });

    it("does not render photo section when no photos", () => {
      render(<MatchReport {...defaultProps} />);
      expect(screen.queryByText("Foto's")).not.toBeInTheDocument();
    });

    it("does not render photos in summary variant", () => {
      const photos = [{ url: "/photo1.jpg", alt: "Goal celebration" }];
      render(
        <MatchReport {...defaultProps} photos={photos} variant="summary" />,
      );
      expect(screen.queryByText("Foto's")).not.toBeInTheDocument();
    });
  });

  describe("summary variant", () => {
    it("renders summary variant with smaller text", () => {
      const { container } = render(
        <MatchReport {...defaultProps} variant="summary" />,
      );
      expect(container.querySelector(".prose-sm")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows message when no content", () => {
      render(<MatchReport title="Wedstrijdverslag" content="" />);
      expect(
        screen.getByText(
          "Nog geen wedstrijdverslag beschikbaar voor deze wedstrijd.",
        ),
      ).toBeInTheDocument();
    });

    it("shows message when content is only whitespace", () => {
      render(<MatchReport title="Wedstrijdverslag" content="   " />);
      expect(
        screen.getByText(
          "Nog geen wedstrijdverslag beschikbaar voor deze wedstrijd.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders skeleton when loading", () => {
      const { container } = render(<MatchReport {...defaultProps} isLoading />);
      expect(
        container.querySelectorAll(".animate-pulse").length,
      ).toBeGreaterThan(0);
    });

    it("does not render content when loading", () => {
      render(<MatchReport {...defaultProps} isLoading />);
      expect(
        screen.queryByText("KCVV won met 3-1 van KFC Turnhout."),
      ).not.toBeInTheDocument();
    });
  });

  describe("className prop", () => {
    it("applies custom className", () => {
      const { container } = render(
        <MatchReport {...defaultProps} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("HTML content", () => {
    it("renders complex HTML content", () => {
      const htmlContent = `
        <p>First paragraph.</p>
        <h3>Section heading</h3>
        <p>Second paragraph with <strong>bold</strong> text.</p>
      `;
      render(<MatchReport title="Report" content={htmlContent} />);
      expect(screen.getByText("First paragraph.")).toBeInTheDocument();
      expect(screen.getByText("Section heading")).toBeInTheDocument();
      expect(screen.getByText("bold")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("uses proper heading hierarchy", () => {
      render(<MatchReport {...defaultProps} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Wedstrijdverslag");
    });

    it("includes time element with datetime attribute", () => {
      render(
        <MatchReport {...defaultProps} publishedAt="2024-02-15T18:30:00" />,
      );
      const timeElement = document.querySelector("time");
      expect(timeElement).toHaveAttribute("datetime", "2024-02-15T18:30:00");
    });

    it("icons are hidden from screen readers", () => {
      const { container } = render(
        <MatchReport {...defaultProps} author="Test Author" />,
      );
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });
});
