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

      // Both Spinner variants render role="status", so the CSS class is the
      // only observable difference between the dots and the scarf — this is
      // not a lazy DOM-shape assertion, it is the only handle available.
      expect(
        container.querySelector(".kcvv-spinner-pulse"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".kcvv-spinner-scarf"),
      ).not.toBeInTheDocument();
    });
  });
});
