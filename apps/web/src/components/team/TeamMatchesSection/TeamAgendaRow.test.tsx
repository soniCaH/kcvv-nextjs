/**
 * TeamAgendaRow unit tests.
 *
 * Covers:
 *  - Date stub day/month render
 *  - Score rendered for finished matches (desktop score slot)
 *  - Kickoff time rendered for upcoming matches
 *  - Outcome underline: win / draw (none) / loss box-shadow on the score
 *  - Featured (jersey-deep) vs normal card data-attribute
 *  - Mobile: home/away icon (House/Bus) visible
 *  - Long name truncation (title attribute)
 *  - Symmetric scoreboard: both sides keep an even split (score stays centred)
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamAgendaRow } from "./TeamAgendaRow";
import type { ScheduleMatch } from "@/components/match/types";

// Render Link as a plain anchor that forwards onClick (no router in tests).
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    onClick,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));

const BASE: ScheduleMatch = {
  id: 1,
  date: new Date("2026-08-15T15:00:00.000Z"),
  time: "15:00",
  homeTeam: { id: 10, name: "KCVV Elewijt" },
  awayTeam: { id: 20, name: "FC Opponent" },
  status: "scheduled",
  competition: "3e Provinciale A",
  isHome: true,
};

const FINISHED_WIN: ScheduleMatch = {
  ...BASE,
  status: "finished",
  homeScore: 3,
  awayScore: 1,
  isHome: true,
};

const FINISHED_DRAW: ScheduleMatch = {
  ...BASE,
  status: "finished",
  homeScore: 1,
  awayScore: 1,
  isHome: true,
};

const FINISHED_LOSS: ScheduleMatch = {
  ...BASE,
  status: "finished",
  homeScore: 0,
  awayScore: 2,
  isHome: true,
};

/** An opponent whose name outruns the row, carrying a squad suffix (#2405). */
const LONG_AWAY: ScheduleMatch = {
  ...BASE,
  awayTeam: {
    id: 20,
    name: "Yellow Red Koninklijke Voetbalclub Mechelen",
    teamLabel: "U23",
  },
};

describe("TeamAgendaRow", () => {
  describe("Date stub", () => {
    it("renders the day number", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByTestId("team-agenda-row").textContent).toContain("15");
    });

    it("renders the abbreviated Dutch month", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByTestId("team-agenda-row").textContent).toMatch(/aug/i);
    });

    it("renders the date stub by default", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByLabelText("15 aug")).toBeInTheDocument();
    });

    it("omits the date stub when showDateStub is false", () => {
      render(<TeamAgendaRow match={BASE} showDateStub={false} />);
      expect(screen.queryByLabelText("15 aug")).not.toBeInTheDocument();
      // the row itself still renders.
      expect(screen.getByTestId("team-agenda-row")).toBeInTheDocument();
    });
  });

  describe("Score / time", () => {
    it("shows the score for a finished match", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} />);
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("3");
      expect(row.textContent).toContain("1");
    });

    it("shows the kickoff time for an upcoming match", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByTestId("team-agenda-row").textContent).toContain(
        "15:00",
      );
    });
  });

  describe("upcomingLabel", () => {
    it("shows the upcoming label instead of the kickoff time for a scheduled match", () => {
      render(<TeamAgendaRow match={BASE} upcomingLabel="Gepland" />);
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("Gepland");
      expect(row.textContent).not.toContain("15:00");
    });

    it("still shows the scoreline for a finished match even when set", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} upcomingLabel="Gepland" />);
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("3");
      expect(row.textContent).not.toContain("Gepland");
    });

    it("falls back to the kickoff time when no upcoming label is given", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByTestId("team-agenda-row").textContent).toContain(
        "15:00",
      );
    });

    it("never shows the upcoming label for a finished match with missing scores", () => {
      render(
        <TeamAgendaRow
          match={{
            ...BASE,
            status: "finished",
            homeScore: undefined,
            awayScore: undefined,
          }}
          upcomingLabel="Gepland"
        />,
      );
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("15:00");
      expect(row.textContent).not.toContain("Gepland");
    });
  });

  describe("Outcome underline (box-shadow)", () => {
    it("applies win shadow on the score span", () => {
      const { container } = render(<TeamAgendaRow match={FINISHED_WIN} />);
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBeGreaterThan(0);
      expect(spans[0]?.getAttribute("style")).toContain("jersey-deep");
    });

    it("applies loss shadow on the score span", () => {
      const { container } = render(<TeamAgendaRow match={FINISHED_LOSS} />);
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBeGreaterThan(0);
      expect(spans[0]?.getAttribute("style")).toContain("color-alert");
    });

    it("applies no box-shadow for a draw", () => {
      const { container } = render(<TeamAgendaRow match={FINISHED_DRAW} />);
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBe(0);
    });

    it("tints a forfeit like any other win (#2423)", () => {
      // <MatchStripView> derives its outcome from the scores alone, so gating
      // this on `status === "finished"` made the two surfaces disagree about
      // the same match.
      const { container } = render(
        <TeamAgendaRow match={{ ...FINISHED_WIN, status: "forfeited" }} />,
      );
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBeGreaterThan(0);
      expect(spans[0]?.getAttribute("style")).toContain("jersey-deep");
    });

    it("leaves an abandoned match untinted — nothing is settled", () => {
      const { container } = render(
        <TeamAgendaRow match={{ ...FINISHED_WIN, status: "stopped" }} />,
      );
      expect(container.querySelectorAll("[style*='box-shadow']").length).toBe(
        0,
      );
    });
  });

  describe("Status marker in the caption (#2423)", () => {
    it.each([
      ["forfeited", "FF", "Forfait"],
      ["postponed", "PP", "Uitgesteld"],
      ["cancelled", "CANC", "Geannuleerd"],
      ["stopped", "STOP", "Gestopt"],
    ] as const)(
      "marks a %s match with the <MatchStatusBadge> short form",
      (status, abbreviation, longForm) => {
        render(<TeamAgendaRow match={{ ...FINISHED_WIN, status }} />);
        // Both layouts render the caption, so the marker appears more than once.
        const markers = screen.getAllByText(abbreviation);
        expect(markers.length).toBeGreaterThan(0);
        // The long form still reaches hover + assistive tech via <abbr title>.
        expect(markers[0]?.tagName).toBe("ABBR");
        expect(markers[0]?.getAttribute("title")).toBe(longForm);
      },
    );

    it("leaves a finished match unmarked — the scoreline already says it", () => {
      const { container } = render(<TeamAgendaRow match={FINISHED_WIN} />);
      expect(container.querySelector("abbr")).toBeNull();
    });

    it("leaves a scheduled match unmarked — the kickoff time already says it", () => {
      const { container } = render(<TeamAgendaRow match={BASE} />);
      expect(container.querySelector("abbr")).toBeNull();
    });

    it("keeps the competition alongside the marker", () => {
      render(
        <TeamAgendaRow match={{ ...FINISHED_WIN, status: "forfeited" }} />,
      );
      expect(screen.getAllByText("FF").length).toBeGreaterThan(0);
      expect(screen.getAllByText(/3e Provinciale A/).length).toBeGreaterThan(0);
    });
  });

  describe("Featured card", () => {
    it("sets data-featured=true when featured prop is true", () => {
      render(<TeamAgendaRow match={BASE} featured />);
      expect(
        screen.getByTestId("team-agenda-row").getAttribute("data-featured"),
      ).toBe("true");
    });

    it("sets data-featured=false by default", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(
        screen.getByTestId("team-agenda-row").getAttribute("data-featured"),
      ).toBe("false");
    });
  });

  describe("kcvvTeamId fallback for home/away resolution", () => {
    it("uses kcvvTeamId to resolve home when match.isHome is undefined", () => {
      const match: ScheduleMatch = {
        ...FINISHED_WIN,
        isHome: undefined,
        homeTeam: { id: 1235, name: "KCVV Elewijt" },
        awayTeam: { id: 99, name: "FC Opponent" },
        homeScore: 3,
        awayScore: 1,
      };
      const { container } = render(
        <TeamAgendaRow match={match} kcvvTeamId={1235} />,
      );
      // KCVV is home (id 1235 matches homeTeam.id 1235), home wins 3-1 → win shadow
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBeGreaterThan(0);
      expect(spans[0]?.getAttribute("style")).toContain("jersey-deep");
    });

    it("uses kcvvTeamId to resolve away when match.isHome is undefined", () => {
      const match: ScheduleMatch = {
        ...FINISHED_LOSS,
        isHome: undefined,
        homeTeam: { id: 99, name: "FC Opponent" },
        awayTeam: { id: 1235, name: "KCVV Elewijt" },
        homeScore: 2,
        awayScore: 0,
      };
      const { container } = render(
        <TeamAgendaRow match={match} kcvvTeamId={1235} />,
      );
      // KCVV is away (id 1235 matches awayTeam.id? No, kcvvTeamId=1235 ≠ homeTeam.id=99 → isHome=false)
      // isHome=false + homeScore(2) > awayScore(0) → loss shadow
      const spans = container.querySelectorAll("[style*='box-shadow']");
      expect(spans.length).toBeGreaterThan(0);
      expect(spans[0]?.getAttribute("style")).toContain("color-alert");
    });
  });

  describe("Competition caption", () => {
    it("renders the competition name", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.getByTestId("team-agenda-row").textContent).toContain(
        "3e Provinciale A",
      );
    });

    it("omits the competition slot when absent", () => {
      render(<TeamAgendaRow match={{ ...BASE, competition: undefined }} />);
      expect(screen.getByTestId("team-agenda-row").textContent).not.toContain(
        "Provinciale",
      );
    });
  });

  describe("captionLabel (KCVV squad in the caption, P2)", () => {
    it("renders the caption label joined to the competition", () => {
      render(<TeamAgendaRow match={BASE} captionLabel="A-Ploeg" />);
      // Appears once per layout (desktop + mobile).
      expect(screen.getAllByText("A-Ploeg").length).toBeGreaterThan(0);
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("A-Ploeg");
      expect(row.textContent).toContain("·");
      expect(row.textContent).toContain("3e Provinciale A");
    });

    it("renders the caption label in jersey-deep on a normal row", () => {
      const { container } = render(
        <TeamAgendaRow match={BASE} captionLabel="A-Ploeg" />,
      );
      const label = container.querySelector("span.text-jersey-deep");
      expect(label).not.toBeNull();
      expect(label).toHaveTextContent("A-Ploeg");
    });

    it("renders the caption label alone when there is no competition", () => {
      render(
        <TeamAgendaRow
          match={{ ...BASE, competition: undefined }}
          captionLabel="U21"
        />,
      );
      const row = screen.getByTestId("team-agenda-row");
      expect(row.textContent).toContain("U21");
      expect(row.textContent).not.toContain("·");
    });

    it("renders only the competition when no caption label is given", () => {
      const { container } = render(<TeamAgendaRow match={BASE} />);
      expect(
        container.querySelector("span.text-jersey-deep"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("team-agenda-row").textContent).toContain(
        "3e Provinciale A",
      );
    });
  });

  describe("Long team name", () => {
    it("sets title attribute on home team in desktop layout", () => {
      const { container } = render(
        <TeamAgendaRow
          match={{
            ...BASE,
            homeTeam: { id: 10, name: "KSV Schoonbeek-Beverst A" },
          }}
        />,
      );
      const el = container.querySelector('[title="KSV Schoonbeek-Beverst A"]');
      expect(el).not.toBeNull();
    });
  });

  describe("Symmetric scoreboard (#2397)", () => {
    // jsdom has no layout, so symmetry is asserted through the flex classes that
    // produce it; the VR stories carry the real pixel coverage. Both sides stay
    // `flex-1` (an even split) whoever is playing, so the score sits dead centre
    // and never drifts from one row to the next.
    const side = (container: HTMLElement, teamName: string) =>
      container.querySelector(`[title="${teamName}"]`)?.className;

    it.each([true, false, undefined])(
      "splits the row evenly with isHome=%s",
      (isHome) => {
        const { container } = render(
          <TeamAgendaRow match={{ ...BASE, isHome }} />,
        );
        expect(side(container, BASE.homeTeam.name)).toContain("flex-1");
        expect(side(container, BASE.awayTeam.name)).toContain("flex-1");
      },
    );
  });

  describe("Link to match detail", () => {
    it("wraps the row in a link to /wedstrijd/{id}", () => {
      render(<TeamAgendaRow match={{ ...BASE, id: 4242 }} />);
      expect(screen.getByRole("link").getAttribute("href")).toBe(
        "/wedstrijd/4242",
      );
    });

    it("uses the full home–away label as the link's accessible name", () => {
      render(<TeamAgendaRow match={BASE} />);
      const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
      // Lock the full accessible-name contract — both teams in home→away order,
      // a space-padded dash separator, plus the date suffix (see `matchLabel`
      // in TeamAgendaRow). The `[–—-]` class tolerates en-/em-dash or hyphen
      // without locking the exact glyph, but still fails on a format change.
      expect(label).toMatch(
        /^KCVV Elewijt [–—-] FC Opponent, 15 aug om 15:00$/,
      );
    });

    // #2404 — the label REPLACES the row's contents as its accessible name, so
    // a score missing from it is a score no screen-reader user ever hears.
    it("spells the scoreline out beside each name", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} />);
      const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
      expect(label).toMatch(/^KCVV Elewijt 3 [–—-] FC Opponent 1, 15 aug$/);
    });

    it("omits the kickoff from the name when the row shows an upcoming label", () => {
      render(<TeamAgendaRow match={BASE} upcomingLabel="Gepland" />);
      const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
      expect(label).not.toContain("om 15:00");
    });

    it("prefixes the kind word when a slot is given", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} kind="result" />);
      const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
      expect(label).toMatch(/^Winst: KCVV Elewijt 3 /);
    });

    /**
     * The label REPLACES the row's contents, so the status marker rendered in
     * the visible caption never reaches a screen reader on its own. Announcing
     * a kickoff for a match that is off is the #2423 failure in audio.
     */
    it.each([
      ["postponed", "Uitgesteld"],
      ["cancelled", "Geannuleerd"],
    ] as const)(
      "names a %s match and asserts no kickoff",
      (status, longForm) => {
        render(<TeamAgendaRow match={{ ...BASE, status }} />);
        const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
        expect(label).toContain(longForm);
        expect(label).not.toContain("om 15:00");
      },
    );

    it("names a forfeit rather than announcing it as a plain win", () => {
      render(
        <TeamAgendaRow
          match={{ ...FINISHED_WIN, status: "forfeited" }}
          kind="result"
        />,
      );
      const label = screen.getByRole("link").getAttribute("aria-label") ?? "";
      expect(label).toContain("Forfait");
    });
  });

  // #2404 — cream-vs-green and left-vs-right were the only carriers of
  // "this is a result" / "this is the next fixture".
  describe("Kind word", () => {
    const captionOf = () => screen.getByTestId("team-agenda-row").textContent;

    it("names the outcome on a settled win", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} kind="result" />);
      expect(captionOf()).toContain("Winst");
    });

    it("names the outcome on a draw, which the underline cannot", () => {
      render(<TeamAgendaRow match={FINISHED_DRAW} kind="result" />);
      expect(captionOf()).toContain("Gelijkspel");
    });

    it("names the outcome on a loss", () => {
      render(<TeamAgendaRow match={FINISHED_LOSS} kind="result" />);
      expect(captionOf()).toContain("Verlies");
    });

    it("reads 'Volgende' in the fixture slot", () => {
      render(<TeamAgendaRow match={BASE} kind="fixture" />);
      expect(captionOf()).toContain("Volgende");
    });

    /**
     * The regression this prop exists for. `pickLastResult` hands the result
     * column a match whose kickoff has passed while PSD still says
     * `scheduled` — deriving the word from status labelled it "Volgende", the
     * same word as the fixture card beside it.
     */
    it("says 'Uitslag', not 'Volgende', for a scheduled match in the result slot", () => {
      render(<TeamAgendaRow match={BASE} kind="result" />);
      const text = captionOf();
      expect(text).toContain("Uitslag");
      expect(text).not.toContain("Volgende");
    });

    it("still names the winner of a forfeit, alongside the FF marker", () => {
      render(
        <TeamAgendaRow
          match={{ ...FINISHED_WIN, status: "forfeited" }}
          kind="result"
        />,
      );
      const text = captionOf();
      expect(text).toContain("Winst");
      expect(text).toContain("FF");
    });

    it.each(["postponed", "cancelled", "stopped"] as const)(
      "defers to the %s status marker rather than adding a slot word",
      (status) => {
        render(<TeamAgendaRow match={{ ...BASE, status }} kind="fixture" />);
        const text = captionOf();
        expect(text).not.toContain("Volgende");
        expect(text).not.toContain("Uitslag");
      },
    );

    it("says nothing extra when no slot is given", () => {
      render(<TeamAgendaRow match={FINISHED_WIN} />);
      const text = captionOf();
      expect(text).not.toContain("Winst");
      expect(text).not.toContain("Uitslag");
    });
  });

  describe("Team designation (team_label)", () => {
    it("renders the opponent's team designation suffix", () => {
      render(<TeamAgendaRow match={LONG_AWAY} />);
      // Appears once per layout (desktop away + mobile opponent column).
      const labels = screen.getAllByText("U23");
      expect(labels.length).toBeGreaterThan(0);
    });

    it("does not render a suffix when teamLabel is absent", () => {
      render(<TeamAgendaRow match={BASE} />);
      expect(screen.queryByText("U23")).toBeNull();
    });

    // #2405 — truncation priority. jsdom has no layout, so it is asserted
    // structurally: the suffix lives INSIDE the truncating box, which is what
    // makes the ellipsis reach it before the club name. The old markup pinned
    // it outside as a `shrink-0` sibling, so the club name absorbed the whole
    // cost ("Yellow Red KV Mech… U23"). VR carries the pixel coverage.
    it("nests the suffix inside the truncating box, with a space before it", () => {
      render(<TeamAgendaRow match={LONG_AWAY} />);
      for (const suffix of screen.getAllByText("U23")) {
        expect(suffix.parentElement?.className).toContain("truncate");
        // The space has to survive into textContent, not just be a margin, or
        // the row reads as "MechelenU23".
        expect(suffix.parentElement?.textContent).toContain(
          `${LONG_AWAY.awayTeam.name} U23`,
        );
      }
    });
  });

  describe("onNavigate", () => {
    it("fires onNavigate when the row is clicked through", async () => {
      const user = userEvent.setup();
      const onNavigate = vi.fn();
      render(<TeamAgendaRow match={BASE} onNavigate={onNavigate} />);
      await user.click(screen.getByTestId("team-agenda-row"));
      expect(onNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
