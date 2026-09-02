/**
 * StaffHero unit tests.
 *
 * Covers the locked person-profile hero (10f2 hero B):
 *  - Two-line name rhythm (first upright black / last italic + warm period)
 *  - Role pills (first jersey-deep, rest cream); auto-hide when none
 *  - Contact row (mailto / tel) with plain Phosphor icons; auto-hide when none
 *  - Photo state vs coat-figure fallback (data-state) (#2789)
 *  - Cross-component agreement with `<PlayerCard garment="coat">` for the
 *    same id (#2485 rule 5 / #2789)
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StaffHero } from "./StaffHero";
import { PlayerCard } from "@/components/team/SquadGrid/PlayerCard";

describe("StaffHero", () => {
  it("renders the kicker and the two-line name", () => {
    render(
      <StaffHero id="staff-test" firstName="Marc" lastName="De Coninck" />,
    );
    expect(screen.getByText("Staf")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Marc");
    expect(heading).toHaveTextContent("De Coninck");
  });

  it("renders the photo state when imageUrl is present", () => {
    render(
      <StaffHero
        id="staff-test"
        firstName="Marc"
        lastName="De Coninck"
        imageUrl="/player-fixtures/player-schulz.jpg"
      />,
    );
    expect(screen.getByTestId("staff-hero").getAttribute("data-state")).toBe(
      "photo",
    );
  });

  it("renders the coat-garment illustration fallback when imageUrl is absent", () => {
    render(
      <StaffHero id="staff-test" firstName="Marc" lastName="De Coninck" />,
    );
    const hero = screen.getByTestId("staff-hero");
    expect(hero.getAttribute("data-state")).toBe("illustration");
    const illustration = screen.getByTestId("staff-hero-illustration");
    expect(illustration).toBeInTheDocument();
    expect(illustration.getAttribute("data-garment")).toBe("coat");
  });

  it("never renders a staff-hero-monogram testid — the initials plate is gone", () => {
    render(
      <StaffHero id="staff-test" firstName="Marc" lastName="De Coninck" />,
    );
    expect(screen.queryByTestId("staff-hero-monogram")).not.toBeInTheDocument();
  });

  it('draws the identical figure to <PlayerCard garment="coat"> for the same id', () => {
    const hero = render(
      <StaffHero id="staff-42" firstName="Karel" lastName="Coach" />,
    );
    const heroMarkup = hero.getByTestId("staff-hero-illustration").innerHTML;
    hero.unmount();

    const card = render(
      <PlayerCard
        id="staff-42"
        firstName="Karel"
        lastName="Coach"
        garment="coat"
      />,
    );
    const cardMarkup = card.getByTestId("player-card-illustration").innerHTML;

    // Both wrap the same <JerseyIllustration>; only the outer positioning
    // differs by variant, never the drawn geometry for one person's id.
    expect(heroMarkup).toBe(cardMarkup);
  });

  it("renders role pills (first jersey-deep, rest cream)", () => {
    render(
      <StaffHero
        id="staff-test"
        firstName="Marc"
        lastName="De Coninck"
        roles={["Hoofdtrainer", "Jeugdtrainer"]}
      />,
    );
    const pills = screen.getAllByTestId("staff-hero-role");
    expect(pills).toHaveLength(2);
    expect(pills[0]).toHaveTextContent("Hoofdtrainer");
    expect(
      pills[0]?.querySelector("[data-variant]")?.getAttribute("data-variant"),
    ).toBe("pill-jersey-deep");
    expect(
      pills[1]?.querySelector("[data-variant]")?.getAttribute("data-variant"),
    ).toBe("pill-cream");
  });

  it("auto-hides the role pills when none are supplied", () => {
    render(
      <StaffHero
        id="staff-test"
        firstName="Marc"
        lastName="De Coninck"
        roles={[]}
      />,
    );
    expect(screen.queryByTestId("staff-hero-role")).not.toBeInTheDocument();
  });

  it("renders a mailto link for the email", () => {
    render(
      <StaffHero
        id="staff-test"
        firstName="Marc"
        lastName="De Coninck"
        email="marc@kcvvelewijt.be"
      />,
    );
    const link = screen.getByRole("link", { name: /marc@kcvvelewijt\.be/i });
    expect(link).toHaveAttribute("href", "mailto:marc@kcvvelewijt.be");
  });

  it("renders a tel link for the phone", () => {
    render(
      <StaffHero
        id="staff-test"
        firstName="Marc"
        lastName="De Coninck"
        phone="+32 478 12 34 56"
      />,
    );
    const link = screen.getByRole("link", { name: /\+32 478 12 34 56/ });
    expect(link).toHaveAttribute("href", "tel:+32 478 12 34 56");
  });

  it("auto-hides the contact row when neither email nor phone is present", () => {
    const { container } = render(
      <StaffHero id="staff-test" firstName="Marc" lastName="De Coninck" />,
    );
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
