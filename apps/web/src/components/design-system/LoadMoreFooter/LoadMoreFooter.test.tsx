/**
 * LoadMoreFooter Component Tests
 *
 * Waiting-Device Rule (#2510, DESIGN.md → Motion): a "load more" tap is a
 * request the visitor made, so its in-flight state waits as the compact dots
 * — never the scarf, which is reserved for search.
 */

import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { LoadMoreFooter } from "./LoadMoreFooter";

describe("LoadMoreFooter", () => {
  describe("Loading state", () => {
    it("should render the compact dots, not the scarf", () => {
      const { container } = render(
        <LoadMoreFooter
          label="Meer nieuws laden"
          hasMore
          isLoading
          onLoadMore={vi.fn()}
        />,
      );

      // The CSS class is the only observable difference between variants —
      // Spinner.test.tsx owns the dots-vs-scarf contract directly.
      expect(
        container.querySelector(".kcvv-spinner-pulse"),
      ).toBeInTheDocument();
    });
  });
});
