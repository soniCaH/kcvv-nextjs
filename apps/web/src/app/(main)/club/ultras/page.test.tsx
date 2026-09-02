import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import UltrasPage from "./page";

describe("/club/ultras page", () => {
  it("renders the terrace-poster hero", () => {
    render(<UltrasPage />);

    expect(
      screen.getByText(/Supporters · KCVV Ultra's 55/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /de luidste hoek/i }),
    ).toBeInTheDocument();
  });

  it("renders the up-link to /club inside the band", () => {
    render(<UltrasPage />);

    const upLink = screen.getByTestId("up-link");
    expect(upLink).toHaveAttribute("href", "/club");
    expect(upLink).toHaveTextContent("De club");
  });

  it("renders editorial sections below the hero", () => {
    render(<UltrasPage />);

    expect(screen.getByText("Wie zijn we")).toBeInTheDocument();
    expect(screen.getByText("Wat doen we")).toBeInTheDocument();
    expect(screen.getByText("Lid worden")).toBeInTheDocument();
  });

  it("measures its running text at the prose token, leaving media at container width", () => {
    render(<UltrasPage />);

    // #2436: only direct-child <p> clamp to the prose token. jsdom does not
    // resolve the arbitrary variant, so assert both halves of what makes it
    // apply — the copy is a <p>, and its direct parent carries the clamp.
    const paragraph = screen.getByText(/De naam KCVV Ultras werd/);
    expect(paragraph.tagName).toBe("P");
    expect(paragraph.parentElement?.className).toContain(
      "[&>p]:max-w-[var(--container-prose)]",
    );
  });

  it("renders the raffle callout stats", () => {
    render(<UltrasPage />);

    // Scope to the callout — "500"/"750" also appear in the body prose, so a
    // page-wide text match would be ambiguous.
    const callout = within(screen.getByTestId("raffle-callout"));
    expect(callout.getByText("500")).toBeInTheDocument();
    expect(callout.getByText("750")).toBeInTheDocument();
  });
});
