import { describe, it, expect } from "vitest";
import {
  hasScore,
  getScoreDisplay,
  getResultColor,
  isExceptionalMatchStatus,
  isPlayedMatch,
  isSettledMatch,
  reservationView,
  reservationRowLabel,
} from "./match-display";
import type { MatchStatus } from "@/lib/effect/schemas/match.schema";

interface MinimalMatch {
  home_team: { score?: number };
  away_team: { score?: number };
  status: MatchStatus;
}

function createMatch(overrides: Partial<MinimalMatch> = {}): MinimalMatch {
  return {
    home_team: { score: 2 },
    away_team: { score: 1 },
    status: "finished",
    ...overrides,
  };
}

describe("hasScore", () => {
  it("returns true for finished match with both scores", () => {
    expect(hasScore(createMatch())).toBe(true);
  });

  it("returns true for forfeited match with both scores", () => {
    expect(hasScore(createMatch({ status: "forfeited" }))).toBe(true);
  });

  it("returns false when home score is undefined", () => {
    expect(hasScore(createMatch({ home_team: { score: undefined } }))).toBe(
      false,
    );
  });

  it("returns false when away score is undefined", () => {
    expect(hasScore(createMatch({ away_team: { score: undefined } }))).toBe(
      false,
    );
  });

  it("returns false for scheduled match even with scores", () => {
    expect(hasScore(createMatch({ status: "scheduled" }))).toBe(false);
  });

  it("returns false for postponed match", () => {
    expect(hasScore(createMatch({ status: "postponed" }))).toBe(false);
  });

  it("returns false for stopped match", () => {
    expect(hasScore(createMatch({ status: "stopped" }))).toBe(false);
  });

  it("returns true when scores are zero", () => {
    expect(
      hasScore(
        createMatch({
          home_team: { score: 0 },
          away_team: { score: 0 },
        }),
      ),
    ).toBe(true);
  });
});

describe("getScoreDisplay", () => {
  it("returns score type with values for finished match", () => {
    expect(getScoreDisplay(createMatch())).toEqual({
      type: "score",
      home: 2,
      away: 1,
    });
  });

  it("returns vs type for scheduled match", () => {
    expect(getScoreDisplay(createMatch({ status: "scheduled" }))).toEqual({
      type: "vs",
    });
  });

  it("returns vs type when scores are missing", () => {
    expect(
      getScoreDisplay(
        createMatch({
          home_team: { score: undefined },
          away_team: { score: undefined },
        }),
      ),
    ).toEqual({ type: "vs" });
  });

  it("returns score for forfeited match with scores", () => {
    expect(getScoreDisplay(createMatch({ status: "forfeited" }))).toEqual({
      type: "score",
      home: 2,
      away: 1,
    });
  });

  it("returns vs for postponed match", () => {
    expect(getScoreDisplay(createMatch({ status: "postponed" }))).toEqual({
      type: "vs",
    });
  });
});

describe("getResultColor", () => {
  it("returns 'win' when home team wins and isHome", () => {
    expect(getResultColor(3, 1, true)).toBe("win");
  });

  it("returns 'loss' when home team wins but isHome is false", () => {
    expect(getResultColor(3, 1, false)).toBe("loss");
  });

  it("returns 'draw' when scores are equal", () => {
    expect(getResultColor(2, 2, true)).toBe("draw");
  });

  it("returns 'draw' regardless of isHome when scores equal", () => {
    expect(getResultColor(2, 2, false)).toBe("draw");
  });

  it("returns 'loss' when away team wins and isHome", () => {
    expect(getResultColor(0, 3, true)).toBe("loss");
  });

  it("returns 'win' when away team wins and not isHome", () => {
    expect(getResultColor(0, 3, false)).toBe("win");
  });

  it("handles 0-0 draw", () => {
    expect(getResultColor(0, 0, true)).toBe("draw");
  });
});

describe("isPlayedMatch", () => {
  it("is true for played statuses", () => {
    for (const status of [
      "finished",
      "forfeited",
      "stopped",
    ] as MatchStatus[]) {
      expect(isPlayedMatch(status)).toBe(true);
    }
  });

  it("is false for unplayed statuses", () => {
    for (const status of [
      "scheduled",
      "postponed",
      "cancelled",
    ] as MatchStatus[]) {
      expect(isPlayedMatch(status)).toBe(false);
    }
  });
});

describe("isSettledMatch", () => {
  it("is true only for statuses whose outcome is final", () => {
    for (const status of ["finished", "forfeited"] as MatchStatus[]) {
      expect(isSettledMatch(status)).toBe(true);
    }
  });

  it("excludes stopped — an abandoned match may be replayed", () => {
    // Narrower than `isPlayedMatch` on purpose: the row still shows an
    // abandoned scoreline, but nothing may headline on it (#2423).
    expect(isPlayedMatch("stopped")).toBe(true);
    expect(isSettledMatch("stopped")).toBe(false);
  });

  it("is false for the remaining statuses", () => {
    for (const status of [
      "scheduled",
      "postponed",
      "cancelled",
    ] as MatchStatus[]) {
      expect(isSettledMatch(status)).toBe(false);
    }
  });
});

describe("isExceptionalMatchStatus", () => {
  it("is false for the two statuses the layout speaks for itself", () => {
    for (const status of ["scheduled", "finished"] as MatchStatus[]) {
      expect(isExceptionalMatchStatus(status)).toBe(false);
    }
  });

  it("is true for every status that needs naming on the row", () => {
    for (const status of [
      "forfeited",
      "postponed",
      "cancelled",
      "stopped",
    ] as MatchStatus[]) {
      expect(isExceptionalMatchStatus(status)).toBe(true);
    }
  });
});

describe("reservationView", () => {
  it("uses the competition label as the subject when present", () => {
    const view = reservationView({
      status: "scheduled",
      competition: "Tornooi",
    });
    expect(view.subject).toBe("Tornooi");
  });

  it("falls back to 'Gereserveerd' when no competition label is sent", () => {
    const view = reservationView({
      status: "scheduled",
      competition: undefined,
    });
    expect(view.subject).toBe("Gereserveerd");
  });

  it("renders the competition label verbatim — no re-casing (PSD's lowercase gotcha, #2606)", () => {
    const view = reservationView({
      status: "scheduled",
      competition: "vriendschappelijk",
    });
    expect(view.subject).toBe("vriendschappelijk");
  });

  it("carries no status marker for scheduled/finished — the layout already speaks for those", () => {
    expect(
      reservationView({ status: "scheduled", competition: "Tornooi" })
        .statusWording,
    ).toBeNull();
    expect(
      reservationView({ status: "finished", competition: "Tornooi" })
        .statusWording,
    ).toBeNull();
  });

  it("names an exceptional status — a reservation can be called off too (#2606)", () => {
    const view = reservationView({
      status: "cancelled",
      competition: "Tornooi",
    });
    expect(view.statusWording).toEqual({
      abbreviation: "CANC",
      longForm: "Geannuleerd",
    });
  });
});

describe("reservationRowLabel", () => {
  it("composes subject, date and kickoff for a scheduled row", () => {
    const label = reservationRowLabel({
      subject: "Tornooi",
      dateLabel: "9 mei",
      time: "09:30",
      status: "scheduled",
      statusWording: null,
    });
    expect(label).toBe("Tornooi, 9 mei om 09:30");
  });

  it("prefixes the kind word when given and no status marker applies", () => {
    const label = reservationRowLabel({
      kind: "fixture",
      subject: "Tornooi",
      dateLabel: "9 mei",
      time: "09:30",
      status: "scheduled",
      statusWording: null,
    });
    expect(label).toBe("Volgende: Tornooi, 9 mei om 09:30");
  });

  it("drops the kind word when a status marker applies — the sentence must not argue with itself", () => {
    const label = reservationRowLabel({
      kind: "fixture",
      subject: "Tornooi",
      dateLabel: "9 mei",
      time: "09:30",
      status: "cancelled",
      statusWording: { abbreviation: "CANC", longForm: "Geannuleerd" },
    });
    expect(label).not.toContain("Volgende");
    expect(label).toContain("Geannuleerd");
  });

  it("never announces a time for a non-scheduled status", () => {
    const label = reservationRowLabel({
      subject: "Tornooi",
      dateLabel: "9 mei",
      time: "09:30",
      status: "cancelled",
      statusWording: { abbreviation: "CANC", longForm: "Geannuleerd" },
    });
    expect(label).not.toContain("om 09:30");
  });

  it("omits the time segment entirely when none is given", () => {
    const label = reservationRowLabel({
      subject: "Tornooi",
      dateLabel: "9 mei",
      status: "scheduled",
      statusWording: null,
    });
    expect(label).toBe("Tornooi, 9 mei");
  });
});
