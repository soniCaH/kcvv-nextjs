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
 *  - Cross-component agreement with <PlayerHero> for the same player id (#2635)
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayerHero } from "@/components/player/PlayerHero";
import { PlayerCard } from "./PlayerCard";

describe("PlayerCard", () => {
  describe("Photo / illustration state", () => {
    it("renders the photo state when photoUrl is present", () => {
      render(
        <PlayerCard
          id="player-test"
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
        <PlayerCard
          id="player-test"
          firstName="Lars"
          lastName="De Smet"
          position="Keeper"
        />,
      );
      expect(
        screen.getByTestId("player-card-figure").getAttribute("data-state"),
      ).toBe("illustration");
      expect(
        screen.getByTestId("player-card-illustration"),
      ).toBeInTheDocument();
    });
  });

  describe("Illustration wiring (#2635)", () => {
    // The seed/guard determinism pair lives once, at the source
    // (`player-figure-variant.test.ts`). This only proves the wiring: the
    // illustration is seeded from `id`, never from the display name.
    it("seeds the illustration from the player's id, not the display name", () => {
      const first = render(
        <PlayerCard
          id="player-1"
          firstName="Lars"
          lastName="De Smet"
          position="Keeper"
        />,
      );
      const firstMarkup = first.getByTestId(
        "player-card-illustration",
      ).innerHTML;
      first.unmount();

      // Same id, corrected name (a typo fix / married name) → identical figure.
      const renamed = render(
        <PlayerCard
          id="player-1"
          firstName="Lars"
          lastName="De Smedt"
          position="Keeper"
        />,
      );
      expect(renamed.getByTestId("player-card-illustration").innerHTML).toBe(
        firstMarkup,
      );
      renamed.unmount();

      // Same display name, different id → two same-named players must not
      // draw the identical figure side by side in one grid.
      const namesake = render(
        <PlayerCard
          id="player-2"
          firstName="Lars"
          lastName="De Smet"
          position="Keeper"
        />,
      );
      expect(
        namesake.getByTestId("player-card-illustration").innerHTML,
      ).not.toBe(firstMarkup);
    });
  });

  describe("Photo treatment (#2633)", () => {
    it("fills the window and multiplies onto the card's cream", () => {
      const { container } = render(
        <PlayerCard
          id="player-test"
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
          photoUrl="/player-fixtures/player-mendes-mouro.jpg"
          // <SquadGrid> always passes href, and that shape moves the
          // "player-card" testid onto the <Link>. Render it so the assertions
          // below hold for what the site ships.
          href="/spelers/123"
        />,
      );
      // Split rather than substring-match: `md:mix-blend-multiply` contains
      // the token but would not blend at rest.
      const classes = container.querySelector("img")?.className.split(/\s+/);
      expect(classes).toContain("object-cover");
      expect(classes).toContain("mix-blend-multiply");
      // The blend has cream to land on only while the window it sits in is
      // cream — and `bg-cream-soft` would not do.
      expect(
        screen.getByTestId("player-card-figure").className.split(/\s+/),
      ).toContain("bg-cream");
    });
  });

  describe("Number disc", () => {
    it("renders the disc with the jersey number", () => {
      render(
        <PlayerCard
          id="player-test"
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
        <PlayerCard
          id="player-test"
          firstName="Jonas"
          lastName="Vermeer"
          position="Keeper"
        />,
      );
      expect(screen.queryByTestId("player-card-number")).toBeNull();
    });
  });

  describe("Name + position", () => {
    it("renders first name semibold and last name italic", () => {
      render(
        <PlayerCard
          id="player-test"
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
          id="player-test"
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
        />,
      );
      expect(screen.getByText("Aanvaller")).toBeInTheDocument();
    });

    it("omits the position label — not a placeholder — when position is absent (#2567)", () => {
      render(
        <PlayerCard
          id="player-test"
          firstName="Maxim"
          lastName="Breugelmans"
        />,
      );
      expect(screen.queryByText("Speler")).toBeNull();
    });
  });

  describe("Linking", () => {
    it("wraps the card in a link to href when present", () => {
      render(
        <PlayerCard
          id="player-test"
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
          id="player-test"
          firstName="Maxim"
          lastName="Breugelmans"
          position="Aanvaller"
        />,
      );
      const card = screen.getByTestId("player-card");
      expect(card.tagName).toBe("DIV");
    });

    it("drops the position suffix from aria-label when position is absent", () => {
      render(
        <PlayerCard
          id="player-test"
          firstName="Maxim"
          lastName="Breugelmans"
          href="/x"
        />,
      );
      expect(screen.getByTestId("player-card").getAttribute("aria-label")).toBe(
        "Maxim Breugelmans",
      );
    });
  });

  describe("Cross-component agreement (#2635)", () => {
    it("draws the identical figure to <PlayerHero> for the same player id", () => {
      const card = render(
        <PlayerCard id="player-42" firstName="Lars" lastName="De Smet" />,
      );
      const cardMarkup = card.getByTestId("player-card-illustration").innerHTML;
      card.unmount();

      const hero = render(
        <PlayerHero id="player-42" firstName="Lars" lastName="De Smet" />,
      );
      const heroMarkup = hero.getByTestId("player-hero-illustration").innerHTML;

      // Both wrap the same <JerseyIllustration>; only the outer positioning
      // differs by variant, never the drawn geometry for one player's id.
      expect(heroMarkup).toBe(cardMarkup);
    });
  });
});
