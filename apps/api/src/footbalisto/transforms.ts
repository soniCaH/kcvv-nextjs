import type {
  Match,
  MatchDetail,
  MatchLineupPlayer,
  RankingEntry,
  CardType,
} from "@kcvv/api-contract";
import type {
  FootbalistoMatch,
  FootbalistoLineupPlayer,
  FootbalistoMatchEvent,
  FootbalistoMatchDetailResponse,
  FootbalistoRankingEntry,
} from "./schemas";

type MatchStatusType =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

const STATUS_MAP: Record<number, MatchStatusType> = {
  0: "scheduled",
  1: "finished",
  2: "live",
  3: "postponed",
  4: "cancelled",
};

function parseDateString(dateStr: string): { date: Date; time: string } {
  const [datePart, timePart = "00:00"] = dateStr.split(" ");
  const [year, month, day] = datePart!.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return {
    date: new Date(year!, month! - 1, day!, hour, minute),
    time: timePart,
  };
}

function mapNumericStatus(status: number): MatchStatusType {
  return STATUS_MAP[status] ?? "scheduled";
}

export function transformFootbalistoMatch(fbMatch: FootbalistoMatch): Match {
  const { date: matchDate, time: timePart } = parseDateString(fbMatch.date);
  const status = mapNumericStatus(fbMatch.status);

  let roundLabel: string | undefined = fbMatch.age
    ? `${fbMatch.age}`
    : undefined;
  if (fbMatch.teamId === 1) roundLabel = "A-ploeg";
  else if (fbMatch.teamId === 2) roundLabel = "B-ploeg";

  return {
    id: fbMatch.id,
    date: matchDate,
    time: timePart,
    venue: undefined,
    home_team: {
      id: fbMatch.homeTeamId ?? fbMatch.homeClub.id,
      name: fbMatch.homeClub.name,
      logo: fbMatch.homeClub.logo ?? undefined,
      score: fbMatch.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: fbMatch.awayTeamId ?? fbMatch.awayClub.id,
      name: fbMatch.awayClub.name,
      logo: fbMatch.awayClub.logo ?? undefined,
      score: fbMatch.goalsAwayTeam ?? undefined,
    },
    status,
    round: roundLabel,
    competition: fbMatch.competitionType,
  };
}

function transformLineupStatus(
  status?: string,
  changed?: boolean,
): "starter" | "substitute" | "substituted" | "subbed_in" | "unknown" {
  if (status === "basis") return changed ? "substituted" : "starter";
  if (status === "invaller" || status === "bank")
    return changed ? "subbed_in" : "substitute";
  if (status === "wissel") return "substituted";
  return "unknown";
}

function transformLineupPlayer(
  player: FootbalistoLineupPlayer,
): MatchLineupPlayer {
  return {
    id: player.playerId ?? undefined,
    name: player.playerName,
    number: player.number ?? undefined,
    minutesPlayed: player.minutesPlayed ?? undefined,
    isCaptain: player.captain ?? false,
    status: transformLineupStatus(player.status, player.changed),
  };
}

function parseCardType(event: FootbalistoMatchEvent): CardType | undefined {
  const type = event.action.type.toUpperCase();
  const subtype = event.action.subtype?.toLowerCase();
  if (type !== "CARD") return undefined;
  switch (subtype) {
    case "yellow":
    case "geel":
      return "yellow";
    case "red":
    case "rood":
      return "red";
    case "double_yellow":
    case "yellowred":
    case "tweedegeel":
    case "tweede_geel":
      return "double_yellow";
    default:
      return undefined;
  }
}

function buildPlayerCardMap(
  events: readonly FootbalistoMatchEvent[],
): Map<number, CardType> {
  const cardMap = new Map<number, CardType>();
  for (const event of events) {
    const cardType = parseCardType(event);
    const playerId = event.playerId;
    if (cardType && playerId) {
      const existing = cardMap.get(playerId);
      if (existing === "yellow" && cardType === "yellow") {
        cardMap.set(playerId, "double_yellow");
      } else if (cardType === "red" || cardType === "double_yellow") {
        cardMap.set(playerId, cardType);
      } else if (!existing) {
        cardMap.set(playerId, cardType);
      }
    }
  }
  return cardMap;
}

function transformPlayerWithCard(
  player: FootbalistoLineupPlayer,
  cardMap: Map<number, CardType> | null,
): MatchLineupPlayer {
  const base = transformLineupPlayer(player);
  const card = cardMap && base.id ? cardMap.get(base.id) : undefined;
  return card ? { ...base, card } : base;
}

export function transformFootbalistoMatchDetail(
  response: FootbalistoMatchDetailResponse,
): MatchDetail {
  const general = response.general;
  const { date: matchDate, time: timePart } = parseDateString(general.date);
  const status = mapNumericStatus(general.status);
  const cardMap = response.events ? buildPlayerCardMap(response.events) : null;

  let lineup:
    | { home: MatchLineupPlayer[]; away: MatchLineupPlayer[] }
    | undefined;
  if (response.lineup || response.substitutes) {
    lineup = {
      home: [
        ...(response.lineup?.home ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
        ...(response.substitutes?.home ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
      ],
      away: [
        ...(response.lineup?.away ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
        ...(response.substitutes?.away ?? []).map((p) =>
          transformPlayerWithCard(p, cardMap),
        ),
      ],
    };
  }

  return {
    id: general.id,
    date: matchDate,
    time: timePart,
    venue: undefined,
    home_team: {
      id: general.homeClub.id,
      name: general.homeClub.name,
      logo: general.homeClub.logo ?? undefined,
      score: general.goalsHomeTeam ?? undefined,
    },
    away_team: {
      id: general.awayClub.id,
      name: general.awayClub.name,
      logo: general.awayClub.logo ?? undefined,
      score: general.goalsAwayTeam ?? undefined,
    },
    status,
    competition: general.competitionType,
    lineup,
    hasReport: general.viewGameReport,
  };
}

/** Strip lineup from a MatchDetail to produce a basic Match */
export function matchDetailToMatch(detail: MatchDetail): Match {
  return {
    id: detail.id,
    date: detail.date,
    time: detail.time,
    venue: detail.venue,
    home_team: detail.home_team,
    away_team: detail.away_team,
    status: detail.status,
    round: detail.round,
    competition: detail.competition,
  };
}

/** logoCdnUrl: e.g. "https://dfaozfi7c7f3s.cloudfront.net/logos" (no trailing slash) */
export function transformFootbalistoRankingEntry(
  entry: FootbalistoRankingEntry,
  logoCdnUrl: string,
): RankingEntry {
  const teamName =
    entry.team.club.localName || entry.team.club.name || "Unknown Team";
  return {
    position: entry.rank,
    team_id: entry.team.id,
    team_name: teamName,
    team_logo: `${logoCdnUrl}/extra_groot/${entry.team.club.id}.png`,
    played: entry.matchesPlayed,
    won: entry.wins,
    drawn: entry.draws,
    lost: entry.losses,
    goals_for: entry.goalsScored,
    goals_against: entry.goalsConceded,
    goal_difference: entry.goalsScored - entry.goalsConceded,
    points: entry.points,
    form: undefined,
  };
}
