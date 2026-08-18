/**
 * LoadMoreFooter Component Tests
 *
 * Waiting-Device Rule (#2510, DESIGN.md → Motion): a "load more" tap is a
 * request the visitor made, so its in-flight state waits as the compact dots
 * — never the scarf, which is reserved for search.
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { fn } from "storybook/test";
import { LoadMoreFooter } from "./LoadMoreFooter";

describe("LoadMoreFooter", () => {
  describe("Loading state", () => {
    it("should render the compact dots, not the scarf", () => {
      const { container } = render(
        <LoadMoreFooter
          label="Meer nieuws laden"
          hasMore
          isLoading
          onLoadMore={fn()}
        />,
      );

      expect(
        container.querySelector(".kcvv-spinner-pulse"),
      ).toBeInTheDocument();
      expect(
        container.querySelector(".kcvv-spinner-scarf"),
      ).not.toBeInTheDocument();
    });
  });
});
