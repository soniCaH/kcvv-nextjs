/**
 * PlayerCard unit tests.
 *
 * Covers:
 *  - Photo state vs illustration fallback (data-state)
 *  - Photo treatment: cover + multiply, unconditionally (#2633)
 *  - Number disc renders when jerseyNumber present, hidden when absent
 *  - Name rhythm: first semibold + last italic
 *  - Position label rendered
 *  - Whole card links to href when present; renders as non-link div otherwise
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  describe("Photo / illustration state", () => {
    it("renders the photo state when photoUrl is present", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
          photoUrl="/player-fixtures/player-mendes-mouro.jpg"
        />,
      );
      expect(
        screen.getByTestId("player-card-figure").getAttribute("data-state"),
      ).toBe("photo");
      expect(screen.queryByTestId("player-card-illustration")).toBeNull();
    });

    it("renders the illustration fallback when photoUrl is absent", () => {
      render(
        <PlayerCard firstName="Lars" lastName="De Smet" position="Keeper" />,
      );
      expect(
        screen.getByTestId("player-card-figure").getAttribute("data-state"),
      ).toBe("illustration");
      expect(
        screen.getByTestId("player-card-illustration"),
      ).toBeInTheDocument();
    });
  });

  describe("Photo treatment (#2633)", () => {
    // One treatment for every photo the club has: the source fills the 3:4
    // window (`cover`) and multiplies onto the card so a studio cutout's white
    // matte drops out to the same cream as the drawing beside it. No cutout
    // branch and no coverage threshold — see #2590.
    it("fills the window and multiplies onto the card", () => {
      const { container } = render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
          photoUrl="/player-fixtures/player-mendes-mouro.jpg"
        />,
      );
      const photo = container.querySelector("img");
      expect(photo?.className).toContain("object-cover");
      expect(photo?.className).toContain("mix-blend-multiply");
    });

    it("keeps the 3:4 window, its paper edge and the taped card unchanged", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
          photoUrl="/player-fixtures/player-mendes-mouro.jpg"
        />,
      );
      const figure = screen.getByTestId("player-card-figure");
      expect(figure.className).toContain("aspect-[3/4]");
      expect(figure.className).toContain("border-paper-edge");
    });
  });

  describe("Number disc", () => {
    it("renders the disc with the jersey number", () => {
      render(
        <PlayerCard
          firstName="Jonas"
          lastName="Vermeer"
          position="Keeper"
          jerseyNumber={1}
        />,
      );
      expect(screen.getByTestId("player-card-number").textContent).toBe("1");
    });

    it("omits the disc when jerseyNumber is absent", () => {
      render(
        <PlayerCard firstName="Jonas" lastName="Vermeer" position="Keeper" />,
      );
      expect(screen.queryByTestId("player-card-number")).toBeNull();
    });
  });

  describe("Name + position", () => {
    it("renders first name semibold and last name italic", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
        />,
      );
      const first = screen.getByText("Maxim");
      const last = screen.getByText("Breugelmans");
      expect(first.className).toContain("font-semibold");
      expect(last.tagName).toBe("EM");
      expect(last.className).toContain("italic");
    });

    it("renders the position label", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
        />,
      );
      expect(screen.getByText("Aanvaller")).toBeInTheDocument();
    });
  });

  describe("Linking", () => {
    it("wraps the card in a link to href when present", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
          href="/spelers/123"
        />,
      );
      const card = screen.getByTestId("player-card");
      expect(card.tagName).toBe("A");
      expect(card.getAttribute("href")).toBe("/spelers/123");
    });

    it("renders a non-link div when href is absent", () => {
      render(
        <PlayerCard
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
        />,
      );
      const card = screen.getByTestId("player-card");
      expect(card.tagName).toBe("DIV");
    });
  });
});
