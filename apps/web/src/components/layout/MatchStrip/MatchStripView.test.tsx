import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MatchStripView } from "./MatchStripView";
import { KCVV_CLUB_ID } from "@/lib/constants";
import type { ScheduleMatch } from "@/components/match/types";

const OPPONENT = { id: 9999, name: "RC Mechelen", logo: "https://psd/rc.png" };

const result: ScheduleMatch = {
  id: 42,
  date: new Date("2026-08-03T15:00:00Z"),
  status: "finished",
  competition: "Tweede Provinciale A",
  homeTeam: { id: KCVV_CLUB_ID, name: "KCVV Elewijt" },
  awayTeam: OPPONENT,
  homeScore: 3,
  awayScore: 1,
  isHome: true,
};

const fixture: ScheduleMatch = {
  id: 43,
  date: new Date("2026-08-08T18:00:00Z"),
  time: "18:00",
  status: "scheduled",
  competition: "Beker van Vlaanderen",
  homeTeam: OPPONENT,
  awayTeam: { id: KCVV_CLUB_ID, name: "KCVV Elewijt" },
  isHome: false,
};

describe("MatchStripView", () => {
  it("renders both matches as links to their own match-detail route", () => {
    render(<MatchStripView data={{ result, fixture }} />);
    expect(screen.getByRole("link", { name: /^Uitslag/ })).toHaveAttribute(
      "href",
      "/wedstrijd/42",
    );
    expect(
      screen.getByRole("link", { name: /^Volgende wedstrijd/ }),
    ).toHaveAttribute("href", "/wedstrijd/43");
  });

  it("names the opponent, not KCVV, in each row's accessible name", () => {
    render(<MatchStripView data={{ result, fixture }} />);
    expect(
      screen.getByRole("link", { name: /Uitslag.*RC Mechelen/ }),
    ).toBeInTheDocument();
  });

  it("renders the score in true scoreboard order, home side first", () => {
    render(<MatchStripView data={{ result, fixture }} />);
    // KCVV played at home and won 3-1, so the scoreboard reads 3–1.
    expect(screen.getAllByText("3–1").length).toBeGreaterThan(0);
  });

  it("keeps scoreboard order when KCVV played away", () => {
    const awayLoss: ScheduleMatch = {
      ...result,
      homeTeam: OPPONENT,
      awayTeam: { id: KCVV_CLUB_ID, name: "KCVV Elewijt" },
      homeScore: 2,
      awayScore: 0,
      isHome: false,
    };
    render(<MatchStripView data={{ result: awayLoss, fixture: null }} />);
    expect(screen.getAllByText("2–0").length).toBeGreaterThan(0);
  });

  it("derives the KCVV side from the club id when isHome is absent", () => {
    // Regression: `isHome ?? undefined` used to take the falsy branch and
    // render KCVV as its own opponent.
    const { isHome: _omitted, ...withoutIsHome } = result;
    render(<MatchStripView data={{ result: withoutIsHome, fixture: null }} />);
    const row = screen.getByRole("link", { name: /^Uitslag/ });
    expect(row).toHaveAccessibleName(/RC Mechelen/);
    expect(row).not.toHaveAccessibleName(/KCVV Elewijt tegen KCVV/);
  });

  it("marks a home match with the house glyph and an away match with the bus", () => {
    render(<MatchStripView data={{ result, fixture }} />);
    const resultRow = screen.getByRole("link", { name: /^Uitslag/ });
    const fixtureRow = screen.getByRole("link", { name: /^Volgende/ });
    expect(
      within(resultRow).getByLabelText("Thuiswedstrijd"),
    ).toBeInTheDocument();
    expect(
      within(fixtureRow).getByLabelText("Uitwedstrijd"),
    ).toBeInTheDocument();
  });

  it("gives a draw no outcome sweep", () => {
    const draw: ScheduleMatch = { ...result, homeScore: 2, awayScore: 2 };
    render(<MatchStripView data={{ result: draw, fixture: null }} />);
    const score = screen.getAllByText("2–2")[0];
    expect(score).not.toHaveStyle({
      boxShadow: expect.stringContaining("inset"),
    });
  });

  it("renders the fixture alone when there is no result", () => {
    render(<MatchStripView data={{ result: null, fixture }} />);
    expect(screen.queryByRole("link", { name: /^Uitslag/ })).toBeNull();
    expect(
      screen.getByRole("link", { name: /^Volgende wedstrijd/ }),
    ).toBeInTheDocument();
  });

  it("renders the result alone when there is no fixture", () => {
    render(<MatchStripView data={{ result, fixture: null }} />);
    expect(screen.getByRole("link", { name: /^Uitslag/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^Volgende/ })).toBeNull();
  });

  it("renders real PSD logos when provided", () => {
    const { container } = render(
      <MatchStripView data={{ result, fixture: null }} />,
    );
    const srcs = Array.from(container.querySelectorAll("img")).map((i) =>
      i.getAttribute("src"),
    );
    expect(srcs).toContain("https://psd/rc.png");
  });

  it("falls back to an initial badge when the opponent has no logo", () => {
    const noLogo: ScheduleMatch = {
      ...result,
      awayTeam: { id: 9999, name: "VK De Volharding" },
    };
    render(<MatchStripView data={{ result: noLogo, fixture: null }} />);
    expect(screen.getAllByText("V").length).toBeGreaterThan(0);
  });

  it("exposes the desktop CTA to the match currently on the slide", () => {
    render(<MatchStripView data={{ result, fixture }} />);
    expect(
      screen.getByRole("link", { name: /Wedstrijddetails/i }),
    ).toHaveAttribute("href", "/wedstrijd/42");
  });

  it("offers the desktop switch only when both sides exist", () => {
    const { rerender } = render(<MatchStripView data={{ result, fixture }} />);
    expect(
      screen.getByRole("button", { name: "Toon de volgende wedstrijd" }),
    ).toBeInTheDocument();

    rerender(<MatchStripView data={{ result, fixture: null }} />);
    expect(
      screen.queryByRole("button", { name: "Toon de volgende wedstrijd" }),
    ).toBeNull();
  });
});
