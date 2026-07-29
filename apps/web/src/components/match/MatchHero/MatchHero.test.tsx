import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchHero } from "./MatchHero";

const homeTeam = { name: "KCVV Elewijt", logo: "/logos/kcvv.svg" };
const awayTeam = { name: "RC Mechelen", logo: "/logos/rcm.svg" };

// Saturday 14 June 2025 → Belgian football season ’24/’25 (cutoff: month >= 7)
const scheduledMatchDate = new Date("2025-06-14T13:30:00Z");
// Saturday 13 September 2025 → ’25/’26 season
const finishedMatchDate = new Date("2025-09-13T13:30:00Z");

describe("MatchHero", () => {
  describe("kicker copy", () => {
    it("renders VOORBESCHOUWING for scheduled matches", () => {
      render(
        <MatchHero
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          time="14:30"
          status="scheduled"
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
        name: "KFC Sint-Stevens-Woluwe-Diegem",
        logo: homeTeam.logo,
      };
      render(
        <MatchHero
          homeTeam={longHome}
          awayTeam={awayTeam}
          date={scheduledMatchDate}
          status="scheduled"
        />,
      );
      const nameEl = screen.getByText(longHome.name);
      expect(nameEl).toHaveAttribute("title", longHome.name);
    });

    it("renders a typographic shield fallback when no logo is provided", () => {
      render(
        <MatchHero
          homeTeam={{ name: "KCVV Elewijt" }}
          awayTeam={{ name: "RC Mechelen" }}
          date={scheduledMatchDate}
          status="scheduled"
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
        />,
      );
      // Season label is always present (derived from date).
      expect(screen.getByText("’25/’26")).toBeInTheDocument();
    });
  });
});
