/**
 * ResponsibilityFinder Component Tests
 *
 * Comprehensive test suite covering:
 * - Rendering and display
 * - User interactions
 * - Search functionality
 * - Accessibility
 * - Edge cases
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResponsibilityFinder } from "./ResponsibilityFinder";
import { responsibilityPaths } from "@/data/responsibility-paths";

/**
 * Helper function to select a role from the dropdown
 * Opens the dropdown and clicks the specified role option
 */
async function selectRole(
  user: ReturnType<typeof userEvent.setup>,
  roleName: string,
) {
  // Find the dropdown button by its text content
  // It either shows "een..." (initial) or a role name (after selection)
  const dropdownButton = screen.getByRole("button", {
    name: /een\.\.\.|speler|ouder|trainer|supporter|niet-lid/i,
  });

  // Click the dropdown button to open the menu
  await user.click(dropdownButton);

  // Wait for dropdown to be visible and click the role option
  await waitFor(() => {
    const roleOption = screen.getByRole("button", {
      name: new RegExp(roleName, "i"),
    });
    expect(roleOption).toBeInTheDocument();
  });

  const roleOption = screen.getByRole("button", {
    name: new RegExp(roleName, "i"),
  });
  await user.click(roleOption);
}

describe("ResponsibilityFinder", () => {
  describe("Rendering", () => {
    it("renders the component", () => {
      render(<ResponsibilityFinder />);
      expect(screen.getByText(/IK BEN/i)).toBeInTheDocument();
    });

    it("renders dropdown with all role options", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      // Check for dropdown button
      const dropdownButton = screen.getByRole("button", { name: /een\.\.\./i });
      expect(dropdownButton).toBeInTheDocument();

      // Open dropdown
      await user.click(dropdownButton);

      // Check all 5 roles are available (ANDERE was removed)
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /speler/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /ouder/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /trainer/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /supporter/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /niet-lid/i }),
        ).toBeInTheDocument();
      });
    });

    it("does not show question input initially", () => {
      render(<ResponsibilityFinder />);
      expect(
        screen.queryByPlaceholderText(/typ je vraag/i),
      ).not.toBeInTheDocument();
    });

    it("renders in compact mode when prop is true", () => {
      const { container } = render(<ResponsibilityFinder compact />);
      expect(container.querySelector(".compact")).toBeInTheDocument();
    });
  });

  describe("Role Selection", () => {
    it("shows question input after selecting a role", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      expect(screen.getByPlaceholderText(/typ je vraag/i)).toBeInTheDocument();
    });

    it("updates dropdown button text with selected role", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      // Dropdown button should now show selected role
      const dropdownButton = screen.getByRole("button", { name: /speler/i });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("can change selected role", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");
      let dropdownButton = screen.getByRole("button", { name: /speler/i });
      expect(dropdownButton).toBeInTheDocument();

      await selectRole(user, "ouder");
      dropdownButton = screen.getByRole("button", { name: /ouder/i });
      expect(dropdownButton).toBeInTheDocument();
    });

    it("focuses input after role selection", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/typ je vraag/i);
        expect(input).toHaveFocus();
      });
    });
  });

  describe("Search Functionality", () => {
    it("shows suggestions when typing", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "ongeval");

      await waitFor(() => {
        const elements = screen.getAllByText(/ongeval/i);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it("filters suggestions by selected role", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "ouder");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "inschrijven");

      await waitFor(() => {
        // Should show registration question which is available for "ouder"
        const suggestions = screen.queryAllByText(/inschrijven/i);
        expect(suggestions.length).toBeGreaterThan(0);
      });
    });

    it("shows maximum 6 suggestions", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "w"); // Broad search

      await waitFor(() => {
        const allButtons = screen.queryAllByRole("button");

        // Filter to get only suggestion buttons
        // Exclude: dropdown button and clear button
        const suggestionButtons = allButtons.filter((button) => {
          const label = button.getAttribute("aria-label") || "";
          const text = button.textContent || "";

          // Skip clear button (has "clear" in aria-label)
          if (label.toLowerCase().includes("clear")) return false;

          // Skip dropdown button (contains "een..." or a role name)
          if (
            text.includes("een...") ||
            /speler|ouder|trainer|supporter|niet-lid/i.test(text)
          ) {
            return false;
          }

          return true;
        });

        expect(suggestionButtons.length).toBeGreaterThan(0);
        expect(suggestionButtons.length).toBeLessThanOrEqual(6);
      });
    });

    it("clears search when clicking clear button", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "test");

      const clearButton = screen.getByLabelText(/clear search/i);
      await user.click(clearButton);

      expect(input).toHaveValue("");
    });

    it("hides suggestions when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div data-testid="outside-element">Outside</div>
          <ResponsibilityFinder />
        </div>,
      );

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "ongeval");

      // Verify suggestions are visible
      await waitFor(() => {
        const suggestionButtons = screen.queryAllByRole("button", {
          name: /ongeval/i,
        });
        expect(suggestionButtons.length).toBeGreaterThan(0);
      });

      // Click outside - use a real DOM element for reliable clicks in CI
      const outsideElement = screen.getByTestId("outside-element");
      await user.click(outsideElement);

      // Wait for suggestions to disappear
      await waitFor(() => {
        const suggestionButtons = screen.queryAllByRole("button", {
          name: /ongeval/i,
        });
        expect(suggestionButtons.length).toBe(0);
      });
    });
  });

  describe("Result Selection", () => {
    it("shows result card when clicking suggestion", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "ongeval");

      const suggestions = await screen.findAllByRole("button", {
        name: /ongeval/i,
      });
      const suggestion = suggestions[0];
      await user.click(suggestion);

      await waitFor(() => {
        expect(screen.getByText(/Contactpersoon/i)).toBeInTheDocument();
      });
    });

    it("calls onResultSelect callback", async () => {
      const onResultSelect = vi.fn();
      const user = userEvent.setup();
      render(<ResponsibilityFinder onResultSelect={onResultSelect} />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "ongeval");

      const suggestions = await screen.findAllByRole("button", {
        name: /ongeval/i,
      });
      const suggestion = suggestions[0];
      await user.click(suggestion);

      await waitFor(() => {
        expect(onResultSelect).toHaveBeenCalled();
      });
    });

    it("displays all result card sections", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "ongeval");

      const suggestions = await screen.findAllByRole("button", {
        name: /ongeval/i,
      });
      const suggestion = suggestions[0];
      await user.click(suggestion);

      await waitFor(() => {
        expect(screen.getByText(/Contactpersoon/i)).toBeInTheDocument();
        expect(screen.getByText(/Wat moet je doen/i)).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      // Dropdown button should be accessible
      const dropdownButton = screen.getByRole("button", { name: /een\.\.\./i });
      expect(dropdownButton).toBeInTheDocument();

      // Clear button should have aria-label (shown after typing)
      await selectRole(user, "speler");
      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.type(input, "test");

      const clearButton = screen.getByLabelText(/clear search/i);
      expect(clearButton).toBeInTheDocument();
    });

    it("is keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      const dropdownButton = screen.getByRole("button", { name: /een\.\.\./i });

      dropdownButton.focus();
      expect(dropdownButton).toHaveFocus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        // Dropdown should be open
        const roleOption = screen.getByRole("button", { name: /speler/i });
        expect(roleOption).toBeInTheDocument();
      });
    });

    it("input has placeholder text", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      expect(input).toHaveAttribute("placeholder");
    });
  });

  describe("Edge Cases", () => {
    it("handles no search results gracefully", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);

      // Type search that won't match anything
      await user.clear(input);
      await user.type(input, "xyzabc123notfound");

      // Should show empty state message when there are no matches
      await waitFor(() => {
        const emptyState = screen.queryByText(/Geen resultaten gevonden/i);
        expect(emptyState).toBeInTheDocument();
      });

      // Verify no suggestion buttons are shown
      const allButtons = screen.queryAllByRole("button");
      const suggestionButtons = allButtons.filter((button) => {
        const label = button.getAttribute("aria-label") || "";
        const text = button.textContent || "";

        // Skip clear button
        if (label.toLowerCase().includes("clear")) return false;

        // Skip dropdown button
        if (
          text.includes("een...") ||
          /speler|ouder|trainer|supporter|niet-lid/i.test(text)
        ) {
          return false;
        }

        return true;
      });
      expect(suggestionButtons.length).toBe(0);
    });

    it("handles empty search gracefully", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);
      await user.clear(input);

      // Should not show suggestions for empty query
      expect(input).toHaveValue("");
    });

    it("handles rapid role switching", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      const roles = ["speler", "ouder", "trainer", "supporter"];

      for (const role of roles) {
        await selectRole(user, role);
        // Dropdown button should show the selected role
        const dropdownButton = screen.getByRole("button", {
          name: new RegExp(role, "i"),
        });
        expect(dropdownButton).toBeInTheDocument();
      }
    });
  });

  describe("Data Integration", () => {
    it("uses real responsibility paths data", () => {
      render(<ResponsibilityFinder />);

      // Should have access to the imported data
      expect(responsibilityPaths).toBeDefined();
      expect(responsibilityPaths.length).toBeGreaterThan(0);
    });

    it("matches against keywords correctly", async () => {
      const user = userEvent.setup();
      render(<ResponsibilityFinder />);

      await selectRole(user, "speler");

      const input = screen.getByPlaceholderText(/typ je vraag/i);

      // Search by keyword (not exact question text)
      await user.type(input, "blessure");

      await waitFor(() => {
        // Should find questions with "blessure" in keywords
        const results = screen.queryAllByText(/blessure|herstel/i);
        expect(results.length).toBeGreaterThan(0);
      });
    });
  });
});
