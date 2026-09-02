/**
 * PersonCardRun unit tests.
 *
 * Covers:
 *  - `label` drives both the section's accessible name and the visible
 *    mono-caps heading text
 *  - Children render inside the grid
 *  - The grid track is the single, canonical `minmax(140px,1fr)` string
 *    (#2477 "One grid" — this is now the one place it lives)
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PersonCardRun } from "./PersonCardRun";

describe("PersonCardRun", () => {
  it("renders the label as a level-3 heading", () => {
    render(
      <PersonCardRun label="Doelmannen">
        <div>card</div>
      </PersonCardRun>,
    );
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(
      "Doelmannen",
    );
  });

  it("names the region after the label", () => {
    render(
      <PersonCardRun label="Doelmannen">
        <div>card</div>
      </PersonCardRun>,
    );
    expect(
      screen.getByRole("region", { name: "Doelmannen" }),
    ).toBeInTheDocument();
  });

  it("renders its children inside the grid", () => {
    render(
      <PersonCardRun label="Staf">
        <div data-testid="child">card</div>
      </PersonCardRun>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("forwards data-testid to the grid element", () => {
    render(
      <PersonCardRun label="Staf" data-testid="my-grid">
        <div>card</div>
      </PersonCardRun>,
    );
    expect(screen.getByTestId("my-grid")).toBeInTheDocument();
  });

  it("uses the canonical auto-fill minmax(140px,1fr) grid track — the single source of truth (#2477)", () => {
    render(
      <PersonCardRun label="Staf" data-testid="my-grid">
        <div>card</div>
      </PersonCardRun>,
    );
    expect(
      screen.getByTestId("my-grid").className.replace(/\s+/g, " "),
    ).toContain("grid-cols-[repeat(auto-fill,minmax(140px,1fr))]");
  });
});
