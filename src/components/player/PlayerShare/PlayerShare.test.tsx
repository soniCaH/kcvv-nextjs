/**
 * PlayerShare Component Tests
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PlayerShare } from "./PlayerShare";

// Mock clipboard API using Object.defineProperty
const mockWriteText = vi.fn().mockResolvedValue(undefined);

// Mock window.open
const mockWindowOpen = vi.fn();

describe("PlayerShare", () => {
  const defaultProps = {
    playerName: "Chiel Bertens",
    playerSlug: "chiel-bertens",
    teamName: "Eerste Ploeg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
    // Mock window.open
    window.open = mockWindowOpen;
  });

  describe("default variant", () => {
    it("renders share heading", () => {
      render(<PlayerShare {...defaultProps} />);

      expect(screen.getByText("Deel dit profiel")).toBeInTheDocument();
    });

    it("renders player name and team", () => {
      render(<PlayerShare {...defaultProps} />);

      expect(
        screen.getByText("Chiel Bertens • Eerste Ploeg"),
      ).toBeInTheDocument();
    });

    it("renders QR code when showQR is true", () => {
      render(<PlayerShare {...defaultProps} showQR />);

      // QR code renders, so download button should be present
      expect(
        screen.getByRole("button", { name: /download qr/i }),
      ).toBeInTheDocument();
    });

    it("does not render QR code when showQR is false", () => {
      render(<PlayerShare {...defaultProps} showQR={false} />);

      expect(
        screen.queryByRole("button", { name: "Download QR code" }),
      ).not.toBeInTheDocument();
    });

    it("renders copy link button", () => {
      render(<PlayerShare {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /kopieer/i }),
      ).toBeInTheDocument();
    });

    it("renders social share buttons", () => {
      render(<PlayerShare {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /facebook/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument();
    });

    it("renders download QR button when QR is shown", () => {
      render(<PlayerShare {...defaultProps} showQR />);

      expect(
        screen.getByRole("button", { name: /download qr/i }),
      ).toBeInTheDocument();
    });
  });

  describe("copy link functionality", () => {
    it("copies link to clipboard when clicked", async () => {
      render(<PlayerShare {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /kopieer/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          "https://www.kcvvelewijt.be/player/chiel-bertens",
        );
      });
    });

    it("shows copied confirmation after clicking", async () => {
      render(<PlayerShare {...defaultProps} />);

      const copyButton = screen.getByRole("button", { name: /kopieer/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/gekopieerd/i)).toBeInTheDocument();
      });
    });

    it("uses custom baseUrl when provided", async () => {
      render(
        <PlayerShare {...defaultProps} baseUrl="https://custom.example.com" />,
      );

      const copyButton = screen.getByRole("button", { name: /kopieer/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          "https://custom.example.com/player/chiel-bertens",
        );
      });
    });
  });

  describe("social sharing", () => {
    it("opens Facebook share dialog when clicked", () => {
      render(<PlayerShare {...defaultProps} />);

      const facebookButton = screen.getByRole("button", {
        name: /facebook/i,
      });
      fireEvent.click(facebookButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("facebook.com/sharer"),
        "_blank",
        "width=600,height=400",
      );
    });

    it("opens Twitter share dialog when clicked", () => {
      render(<PlayerShare {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /x/i });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("twitter.com/intent/tweet"),
        "_blank",
        "width=600,height=400",
      );
    });

    it("includes player name in Twitter share text", () => {
      render(<PlayerShare {...defaultProps} />);

      const twitterButton = screen.getByRole("button", { name: /x/i });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining("Chiel%20Bertens"),
        "_blank",
        "width=600,height=400",
      );
    });
  });

  describe("compact variant", () => {
    it("renders compact layout", () => {
      render(<PlayerShare {...defaultProps} variant="compact" />);

      // Compact variant doesn't have the "Deel dit profiel" heading
      expect(screen.queryByText("Deel dit profiel")).not.toBeInTheDocument();
    });

    it("still has copy and share functionality", () => {
      render(<PlayerShare {...defaultProps} variant="compact" />);

      expect(
        screen.getByRole("button", { name: /kopieer/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /facebook/i }),
      ).toBeInTheDocument();
    });
  });

  describe("printable variant", () => {
    it("renders printable layout with player name", () => {
      render(<PlayerShare {...defaultProps} variant="printable" />);

      expect(screen.getByText("Chiel Bertens")).toBeInTheDocument();
    });

    it("shows profile URL in printable variant", () => {
      render(<PlayerShare {...defaultProps} variant="printable" />);

      expect(
        screen.getByText("https://www.kcvvelewijt.be/player/chiel-bertens"),
      ).toBeInTheDocument();
    });

    it("renders QR code in printable variant", () => {
      render(<PlayerShare {...defaultProps} variant="printable" showQR />);

      // Printable variant with QR should show the profile URL
      expect(
        screen.getByText("https://www.kcvvelewijt.be/player/chiel-bertens"),
      ).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("renders loading skeleton when isLoading is true", () => {
      render(<PlayerShare {...defaultProps} isLoading />);

      expect(screen.getByLabelText("Delen laden...")).toBeInTheDocument();
    });

    it("does not render buttons in loading state", () => {
      render(<PlayerShare {...defaultProps} isLoading />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has accessible labels on all buttons", () => {
      render(<PlayerShare {...defaultProps} showQR />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it("has aria-hidden on decorative SVG icons", () => {
      const { container } = render(<PlayerShare {...defaultProps} />);

      const decorativeIcons = container.querySelectorAll(
        'svg[aria-hidden="true"]',
      );
      expect(decorativeIcons.length).toBeGreaterThan(0);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = { current: null };
      render(<PlayerShare {...defaultProps} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref in loading state", () => {
      const ref = { current: null };
      render(<PlayerShare {...defaultProps} isLoading ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref in printable variant", () => {
      const ref = { current: null };
      render(<PlayerShare {...defaultProps} variant="printable" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("className merging", () => {
    it("applies custom className to root element", () => {
      const { container } = render(
        <PlayerShare {...defaultProps} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies custom className in compact variant", () => {
      const { container } = render(
        <PlayerShare
          {...defaultProps}
          variant="compact"
          className="custom-class"
        />,
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});
