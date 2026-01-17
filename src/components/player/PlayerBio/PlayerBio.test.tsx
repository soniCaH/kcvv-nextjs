/**
 * PlayerBio Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerBio } from "./PlayerBio";

describe("PlayerBio", () => {
  // Mock current date for consistent age calculations
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-17"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Empty State", () => {
    it("should show empty state when no props provided", () => {
      render(<PlayerBio />);
      expect(
        screen.getByText("Geen biografie beschikbaar."),
      ).toBeInTheDocument();
    });

    it("should not show empty state when birthDate is provided", () => {
      render(<PlayerBio birthDate="1991-06-28" />);
      expect(
        screen.queryByText("Geen biografie beschikbaar."),
      ).not.toBeInTheDocument();
    });

    it("should not show empty state when biography is provided", () => {
      render(<PlayerBio biography="Een geweldige speler." />);
      expect(
        screen.queryByText("Geen biografie beschikbaar."),
      ).not.toBeInTheDocument();
    });
  });

  describe("Birth Date", () => {
    it("should display formatted birth date", () => {
      render(<PlayerBio birthDate="1991-06-28" />);
      expect(screen.getByText("28 juni 1991")).toBeInTheDocument();
    });

    it("should calculate and display age", () => {
      render(<PlayerBio birthDate="1991-06-28" />);
      expect(screen.getByText("33 jaar")).toBeInTheDocument();
    });

    it("should display Geboortedatum label", () => {
      render(<PlayerBio birthDate="1991-06-28" />);
      expect(screen.getByText("Geboortedatum")).toBeInTheDocument();
    });

    it("should handle invalid date gracefully", () => {
      render(<PlayerBio birthDate="invalid-date" />);
      // Should show the raw string when date is invalid
      expect(screen.getByText("invalid-date")).toBeInTheDocument();
    });
  });

  describe("Membership Period", () => {
    it("should display join date for current player", () => {
      render(<PlayerBio joinDate="2020-07-01" />);
      expect(screen.getByText("1 juli 2020")).toBeInTheDocument();
    });

    it("should show 'Bij KCVV sinds' label for current player", () => {
      render(<PlayerBio joinDate="2020-07-01" />);
      expect(screen.getByText("Bij KCVV sinds")).toBeInTheDocument();
    });

    it("should show 'Periode bij KCVV' label for former player", () => {
      render(<PlayerBio joinDate="2020-07-01" leaveDate="2022-06-30" />);
      expect(screen.getByText("Periode bij KCVV")).toBeInTheDocument();
    });

    it("should display date range for former player", () => {
      render(<PlayerBio joinDate="2020-07-01" leaveDate="2022-06-30" />);
      expect(screen.getByText("1 juli 2020")).toBeInTheDocument();
      expect(screen.getByText(/30 juni 2022/)).toBeInTheDocument();
    });
  });

  describe("Biography Text", () => {
    it("should display biography text", () => {
      render(<PlayerBio biography="Een geweldige speler met veel talent." />);
      expect(
        screen.getByText("Een geweldige speler met veel talent."),
      ).toBeInTheDocument();
    });

    it("should display 'Over de speler' heading", () => {
      render(<PlayerBio biography="Test biography" />);
      expect(screen.getByText("Over de speler")).toBeInTheDocument();
    });

    it("should handle multiple paragraphs", () => {
      const bio = `Eerste paragraaf.

Tweede paragraaf.`;
      render(<PlayerBio biography={bio} />);
      expect(screen.getByText("Eerste paragraaf.")).toBeInTheDocument();
      expect(screen.getByText("Tweede paragraaf.")).toBeInTheDocument();
    });
  });

  describe("Complete Profile", () => {
    it("should render all sections together", () => {
      render(
        <PlayerBio
          birthDate="1991-06-28"
          joinDate="2020-07-01"
          biography="Een ervaren speler."
        />,
      );

      expect(screen.getByText("Geboortedatum")).toBeInTheDocument();
      expect(screen.getByText("Bij KCVV sinds")).toBeInTheDocument();
      expect(screen.getByText("Over de speler")).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <PlayerBio birthDate="1991-06-28" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should forward ref", () => {
      const ref = { current: null };
      render(<PlayerBio birthDate="1991-06-28" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
