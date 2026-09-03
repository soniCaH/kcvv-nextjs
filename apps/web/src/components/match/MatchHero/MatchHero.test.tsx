import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchHero } from "./MatchHero";

const homeTeam = { id: 1235, name: "KCVV Elewijt", logo: "/logos/kcvv.svg" };
const awayTeam = { id: 9999, name: "RC Mechelen", logo: "/logos/rcm.svg" };

// Saturday 14 June 2025 → Belgian football season ’24/’25 (cutoff: month >= 7)
const scheduledMatchDate = new Date("2025-06-14T13:30:00Z");
// Saturday 13 September 2025 → ’25/’26 season
const finishedMatchDate = new Date("2025-09-13T13:30:00Z");

describe("MatchHero", () => {
  describe("page headline (#2555)", () => {
    it("owns the route's only <h1> — the scoreline itself", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      const headings = screen.getAllByRole("heading", { level: 1 });
      expect(headings).toHaveLength(1);
      // The name is assembled from sibling elements, so the separators between
      // them are layout, not text — match tolerantly rather than asserting a
      // spacing jsdom does not compute.
      expect(headings[0]).toHaveTextContent(/KCVV Elewijt\s*vs\s*RC Mechelen/);
    });

    it("reads the scoreline once the match is played", () => {
      render(
        <MatchHero
          homeTeam={{ ...homeTeam, score: 3 }}
          awayTeam={{ ...awayTeam, score: 1 }}
          date={finishedMatchDate}
          time="14:30"
          status="finished"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        /KCVV Elewijt\s*3\s*—\s*1\s*RC Mechelen/,
      );
    });

    it.each(["postponed", "cancelled", "stopped", "finished"] as const)(
      "falls back to 'vs' in the name when %s carries no score",
      (status) => {
        render(
          <MatchHero
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            date={finishedMatchDate}
            status={status}
            isPlaceholder={false}
          />,
        );
        // The em-dash placeholders still paint — `textContent` keeps them — so
        // this asserts the accessible NAME, which is what `aria-hidden` moves.
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading.textContent).toContain("—");
        expect(heading).toHaveAccessibleName(/KCVV Elewijt\s*vs\s*RC Mechelen/);
      },
    );

    it("keeps the crests out of the name — they are decorative", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      for (const img of heading.querySelectorAll("img")) {
        expect(img).toHaveAttribute("alt", "");
      }
    });
  });

  describe("kicker copy", () => {
    it("renders VOORBESCHOUWING for scheduled matches", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText(/VOORBESCHOUWING/)).toBeInTheDocument();
    });

    it.each([
      "finished",
      "forfeited",
      "postponed",
      "cancelled",
      "stopped",
    ] as const)("renders MATCHVERSLAG for %s", (status) => {
      render(
        <MatchHero
          homeTeam={{ ...homeTeam, score: 3 }}
          awayTeam={{ ...awayTeam, score: 1 }}
          date={finishedMatchDate}
          time="14:30"
          status={status}
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText(/MATCHVERSLAG/)).toBeInTheDocument();
    });
  });

  describe("score region", () => {
    it("renders 'vs' for scheduled matches", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      const scoreEl = screen.getByText("vs");
      expect(scoreEl).toBeInTheDocument();
      expect(scoreEl.closest("[data-score-state]")).toHaveAttribute(
        "data-score-state",
        "vs",
      );
    });

    it("renders numeric score for finished matches", () => {
      render(
        <MatchHero
          homeTeam={{ ...homeTeam, score: 3 }}
          awayTeam={{ ...awayTeam, score: 1 }}
          date={finishedMatchDate}
          status="finished"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      const homeScore = screen.getByText("3");
      expect(homeScore.closest("[data-score-state]")).toHaveAttribute(
        "data-score-state",
        "numeric",
      );
    });

    it("renders em-dash placeholders when score is missing on a finished status", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={finishedMatchDate}
          status="cancelled"
          isPlaceholder={false}
        />,
      );
      // The score region itself + the em-dash separator all use "—".
      // Two missing-score slots + the separator = three em-dashes.
      expect(screen.getAllByText("—")).toHaveLength(3);
    });
  });

  describe("status badge integration", () => {
    it("does not render a badge for scheduled matches", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      expect(screen.queryByText("FT")).not.toBeInTheDocument();
      expect(screen.queryByText("CANC")).not.toBeInTheDocument();
    });

    it("renders the CANC badge for cancelled matches", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={finishedMatchDate}
          status="cancelled"
          isPlaceholder={false}
        />,
      );
      const badge = screen.getByText("CANC");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Geannuleerd");
    });
  });

  describe("team names", () => {
    it("exposes the full team name via title attribute (for truncated hover)", () => {
      const longHome = {
        id: 4242,
        name: "KFC Sint-Stevens-Woluwe-Diegem",
        logo: homeTeam.logo,
      };
      render(
        <MatchHero
          homeTeam={longHome}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      const nameEl = screen.getByText(longHome.name);
      expect(nameEl).toHaveAttribute("title", longHome.name);
    });

    it("renders a typographic shield fallback when no logo is provided", () => {
      render(
        <MatchHero
          homeTeam={{ id: 1235, name: "KCVV Elewijt" }}
          awayTeam={{ id: 9999, name: "RC Mechelen" }}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      // First-letter initials in the shield fallback (aria-hidden span).
      expect(
        screen.getByText("K", { selector: "[aria-hidden='true']" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("R", { selector: "[aria-hidden='true']" }),
      ).toBeInTheDocument();
    });
  });

  describe("stub elements", () => {
    it("renders venue when present", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          venue="Sportpark Elewijt"
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText("Sportpark Elewijt")).toBeInTheDocument();
    });

    it("omits venue when missing", () => {
      const { container } = render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      expect(container.textContent).not.toContain("Sportpark");
    });
  });

  describe("stub date layout (#2300)", () => {
    it("keeps the date wrapper inline on mobile and stacked from md up", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          status="scheduled"
          isPlaceholder={false}
        />,
      );
      // "ZA 14" and "JUN" share a wrapper that is a horizontal baseline-aligned
      // row on mobile and reverts to the two-line stack at the md breakpoint.
      const dayLine = screen.getByText(/^ZA 14$/);
      const wrapper = dayLine.parentElement;
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(
        "flex",
        "flex-row",
        "items-baseline",
        "gap-x-2",
        "md:flex-col",
        "md:items-start",
        "md:gap-x-0",
      );
      // The month line must not carry an unconditional top margin (which would
      // push it below the day on the mobile inline row); the margin is md-only.
      const monthLine = screen.getByText("JUN");
      expect(monthLine).toHaveClass("md:mt-1");
      expect(monthLine).not.toHaveClass("mt-1");
    });
  });

  describe("competition meta line", () => {
    it("composes competition · kcvvTeamLabel · season", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={finishedMatchDate}
          status="finished"
          competition="3e provinciale A"
          kcvvTeamLabel="KCVV-A"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText("3e provinciale A")).toBeInTheDocument();
      expect(screen.getByText("KCVV-A")).toBeInTheDocument();
      // 2025-09 → ’25/’26
      expect(screen.getByText("’25/’26")).toBeInTheDocument();
    });

    it("drops missing parts gracefully", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={finishedMatchDate}
          status="finished"
          isPlaceholder={false}
        />,
      );
      // Season label is always present (derived from date).
      expect(screen.getByText("’25/’26")).toBeInTheDocument();
    });
  });

  describe("pitch-reservation placeholder (#2606, #2688)", () => {
    it("names one club in the <h1>, never 'vs' a second one", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="09:30"
          status="scheduled"
          competition="Tornooi"
          isPlaceholder
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("KCVV Elewijt");
      expect(heading.textContent).not.toMatch(/vs/i);
      expect(screen.queryByText("RC Mechelen")).toBeNull();
    });

    it("carries the one marker every reservation renderer carries (#2688)", () => {
      const { container } = render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          isPlaceholder
        />,
      );
      expect(
        container.querySelector('[data-placeholder="true"]'),
      ).not.toBeNull();
    });

    it("shows the real date/time/venue it has, no score region", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="09:30"
          venue="Sportpark Elewijt"
          status="scheduled"
          competition="Tornooi"
          isPlaceholder
        />,
      );
      expect(screen.getByText("09:30")).toBeInTheDocument();
      expect(screen.getByText("Sportpark Elewijt")).toBeInTheDocument();
      expect(screen.queryByText(/^vs$/)).toBeNull();
      expect(screen.queryByText(/—/)).toBeNull();
    });

    it("renders the competition label as the subject — the same vocabulary <TeamAgendaRow> uses", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          isPlaceholder
        />,
      );
      expect(screen.getByText("Tornooi")).toBeInTheDocument();
    });

    it("names the squad that reserved the slot — the one useful fact this deliberately empty page owes a visitor", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          kcvvTeamLabel="U13"
          isPlaceholder
        />,
      );
      expect(screen.getByText("U13")).toBeInTheDocument();
    });

    it("falls back to the RESERVATION_SUBJECT_FALLBACK wording when no competition label is sent", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
          isPlaceholder
        />,
      );
      expect(screen.getByText("Gereserveerd")).toBeInTheDocument();
    });

    it("names an exceptional status via the same MatchStatusBadge table — a reservation can be called off too", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="cancelled"
          competition="Tornooi"
          isPlaceholder
        />,
      );
      expect(screen.getByText("Geannuleerd")).toBeInTheDocument();
      expect(screen.getAllByText("CANC").length).toBeGreaterThan(0);
    });
  });

  describe("tournament fixture with no result yet (#2696/#2802)", () => {
    const zemst = { id: 77, name: "FC Zemst Sportief", logo: awayTeam.logo };
    const kcvv = { id: 1235, name: "KCVV Elewijt", logo: homeTeam.logo };

    it("names the other club in the <h1>, never 'vs' — never KCVV's own crest", () => {
      render(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("FC Zemst Sportief");
      expect(heading.textContent).not.toMatch(/vs/i);
      expect(screen.queryByText("KCVV Elewijt")).toBeNull();
    });

    it("resolves the other club by id, not by home/away side", () => {
      // KCVV listed as away this time — the same club must still show.
      render(
        <MatchHero
          homeTeam={zemst}
          awayTeam={kcvv}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "FC Zemst Sportief",
      );
    });

    it("names the subject by competition alone — never repeating the club the <h1> already names (#2802 review)", () => {
      // Unlike the caption-only reduced renderers (<TeamAgendaRow>,
      // <CalendarAgenda>), the <h1> here already prints the full club name
      // as its own text node — composing "competition · club" underneath it
      // would print "FC Zemst Sportief" twice.
      render(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText("Tornooi")).toBeInTheDocument();
      expect(screen.queryByText("Tornooi · FC Zemst Sportief")).toBeNull();
      // The club name appears exactly once — the <h1>, not the meta line too.
      expect(screen.getAllByText("FC Zemst Sportief")).toHaveLength(1);
    });

    it("keeps VOORBESCHOUWING/MATCHVERSLAG as the kicker, never 'GERESERVEERD' — a tournament fixture is a real dated match, not a booking (#2802 review)", () => {
      const { rerender } = render(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText(/VOORBESCHOUWING/)).toBeInTheDocument();
      expect(screen.queryByText(/GERESERVEERD/)).toBeNull();

      rerender(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={finishedMatchDate}
          status="finished"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByText(/MATCHVERSLAG/)).toBeInTheDocument();
    });

    it("carries the data-tournament marker, not data-placeholder", () => {
      const { container } = render(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={scheduledMatchDate}
          status="scheduled"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(
        container.querySelector('[data-tournament="true"]'),
      ).not.toBeNull();
      expect(container.querySelector('[data-placeholder="true"]')).toBeNull();
    });

    it("reverts to the full two-crest scoreboard once a result exists", () => {
      render(
        <MatchHero
          homeTeam={{ ...kcvv, score: 3 }}
          awayTeam={{ ...zemst, score: 1 }}
          date={finishedMatchDate}
          status="finished"
          competition="Tornooi"
          competitionType="tournament"
          isPlaceholder={false}
        />,
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        /KCVV Elewijt\s*3\s*—\s*1\s*FC Zemst Sportief/,
      );
    });

    it("never reduces an ordinary league fixture, even before kickoff", () => {
      render(
        <MatchHero
          homeTeam={kcvv}
          awayTeam={zemst}
          date={scheduledMatchDate}
          status="scheduled"
          competition="3e Provinciale"
          competitionType="league"
          isPlaceholder={false}
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(
        /KCVV Elewijt\s*vs\s*FC Zemst Sportief/,
      );
    });
  });
});
