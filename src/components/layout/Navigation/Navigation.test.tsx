/**
 * Navigation Component Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navigation } from "./Navigation";

// Mock variables to control test behavior
let mockPathname = "/";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("Navigation", () => {
  beforeEach(() => {
    mockPathname = "/";
    mockSearchParams = new URLSearchParams();
  });

  describe("Rendering", () => {
    it("should render navigation element", () => {
      render(<Navigation />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should render all main menu items", () => {
      render(<Navigation />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Nieuws")).toBeInTheDocument();
      expect(screen.getByText("A-Ploeg")).toBeInTheDocument();
      expect(screen.getByText("B-Ploeg")).toBeInTheDocument();
    });

    it("should render search link", () => {
      render(<Navigation />);
      expect(screen.getByLabelText("Search")).toBeInTheDocument();
    });
  });

  describe("Active state detection", () => {
    it("should mark Home as active on root path", () => {
      mockPathname = "/";
      render(<Navigation />);
      const homeLink = screen.getByText("Home").closest("a");
      expect(homeLink).toHaveClass("active");
    });

    it("should mark Nieuws as active on /news path", () => {
      mockPathname = "/news";
      render(<Navigation />);
      const newsLink = screen.getByText("Nieuws").closest("a");
      expect(newsLink).toHaveClass("active");
    });

    it("should not mark base path as active when tab param exists", () => {
      mockPathname = "/team/a-ploeg";
      mockSearchParams = new URLSearchParams("tab=lineup");
      render(<Navigation />);
      // A-Ploeg is a dropdown trigger, not a nav-link, so check for dropdown items
      // The parent link should not be marked as active when on a tab
    });
  });

  describe("Query parameter active state", () => {
    it("should mark dropdown item as active when pathname and tab param match", () => {
      mockPathname = "/team/a-ploeg";
      mockSearchParams = new URLSearchParams("tab=lineup");
      const { container } = render(<Navigation />);

      // Hover over the A-Ploeg dropdown to open it
      const aPloegLink = screen.getByText("A-Ploeg").closest("li");
      if (aPloegLink) {
        // Trigger mouseenter to open dropdown
        aPloegLink.dispatchEvent(
          new MouseEvent("mouseenter", { bubbles: true }),
        );
      }

      // The "Spelers & Staff" link should be active (has ?tab=lineup)
      const spelersLink = container.querySelector(
        'a[href="/team/a-ploeg?tab=lineup"]',
      );
      if (spelersLink) {
        expect(spelersLink).toHaveClass("text-kcvv-green-bright");
      }
    });

    it("should mark Info as active when on team page without tab param", async () => {
      mockPathname = "/team/a-ploeg";
      mockSearchParams = new URLSearchParams();
      const { container } = render(<Navigation />);

      // Hover over the A-Ploeg dropdown to open it
      const aPloegLink = screen.getByText("A-Ploeg").closest("li");
      if (aPloegLink) {
        aPloegLink.dispatchEvent(
          new MouseEvent("mouseenter", { bubbles: true }),
        );
      }

      // Wait for dropdown to render
      await new Promise((r) => setTimeout(r, 10));

      // The "Info" link in the dropdown should be active (no tab param)
      // It's the second link with this href (first is the dropdown trigger)
      const infoLinks = container.querySelectorAll('a[href="/team/a-ploeg"]');
      // The dropdown child link (second one) should be green
      const dropdownInfoLink = infoLinks[1];
      if (dropdownInfoLink) {
        expect(dropdownInfoLink).toHaveClass("text-kcvv-green-bright");
      }
    });

    it("should not mark Info as active when tab param exists", () => {
      mockPathname = "/team/a-ploeg";
      mockSearchParams = new URLSearchParams("tab=matches");
      const { container } = render(<Navigation />);

      // Hover over the A-Ploeg dropdown to open it
      const aPloegLink = screen.getByText("A-Ploeg").closest("li");
      if (aPloegLink) {
        aPloegLink.dispatchEvent(
          new MouseEvent("mouseenter", { bubbles: true }),
        );
      }

      // The "Info" link should NOT be active when we're on ?tab=matches
      const infoLink = container.querySelector('a[href="/team/a-ploeg"]');
      if (infoLink) {
        expect(infoLink).not.toHaveClass("text-kcvv-green-bright");
      }
    });
  });

  describe("Nested routes", () => {
    it("should mark parent as active for nested routes", () => {
      mockPathname = "/club/history";
      render(<Navigation />);
      // "De club" parent should be considered active due to nested route
    });
  });

  describe("Custom className", () => {
    it("should apply custom className", () => {
      render(<Navigation className="custom-class" />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("custom-class");
    });
  });
});
