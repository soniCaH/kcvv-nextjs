import type { PlayerVM } from "@/lib/repositories/player.repository";
import { PlayerCard } from "./PlayerCard";
import { PersonCardRun } from "./PersonCardRun";

export interface SquadGridProps {
  players: readonly PlayerVM[];
}

/**
 * Stable, non-display identifier for the trailing catch-all bucket — never
 * compared against its Dutch heading text ("Spelers"). The single-group gate
 * below keys off this id, not the display string, for the same reason
 * `player.repository.ts` maps to a display label instead of using one as a
 * control value (#2638 review): the next person to reword "Spelers" would
 * otherwise silently break the gate.
 */
const CATCH_ALL_ID = "catch-all";

interface PositionGroup {
  /** Stable identifier — never rendered, never compared against display text. */
  id: string;
  /** Plural Dutch group heading. */
  label: string;
  /** Singular position value(s) that fall into this group. */
  match: (position: string | undefined) => boolean;
}

// Ordered front-to-back: keepers → defenders → midfielders → attackers, with
// a trailing catch-all so no player is dropped — unmapped and unauthored
// (#2567) positions both land there.
const GROUPS: PositionGroup[] = [
  { id: "keeper", label: "Doelmannen", match: (p) => p === "Keeper" },
  { id: "defender", label: "Verdedigers", match: (p) => p === "Verdediger" },
  {
    id: "midfielder",
    label: "Middenvelders",
    match: (p) => p === "Middenvelder",
  },
  { id: "attacker", label: "Aanvallers", match: (p) => p === "Aanvaller" },
];

function partition(players: readonly PlayerVM[]): {
  id: string;
  label: string;
  players: PlayerVM[];
}[] {
  const assigned = new Set<string>();
  const result: { id: string; label: string; players: PlayerVM[] }[] = [];

  for (const group of GROUPS) {
    const members = players.filter((p) => group.match(p.position));
    if (members.length > 0) {
      members.forEach((m) => assigned.add(m.id));
      result.push({ id: group.id, label: group.label, players: members });
    }
  }

  // Trailing catch-all for any position not in the four canonical groups.
  const rest = players.filter((p) => !assigned.has(p.id));
  if (rest.length > 0) {
    result.push({ id: CATCH_ALL_ID, label: "Spelers", players: rest });
  }

  return result;
}

export function SquadGrid({ players }: SquadGridProps) {
  if (players.length === 0) return null;

  const groups = partition(players);
  // The catch-all separates nobody from a neighbour when it is the ONLY
  // group — the heading gains a gate for exactly the same reason the
  // position label itself did (#2638): rendering "Spelers" over the only
  // group on a U9 page (nobody's position is known) claims a distinction
  // the data doesn't support. This is deliberately narrower than "any
  // single group": a lone REAL position bucket (e.g. a squad that is,
  // today, entirely keepers) is still a true classification and keeps its
  // heading — it only looks unearned by accident of today's data, and
  // hiding it would be latent breakage waiting for a squad shape that
  // exposes it. Keyed off the group's stable `id`, never its display
  // label, so a rewording of "Spelers" can't silently break the gate.
  const hideHeading = groups.length === 1 && groups[0]!.id === CATCH_ALL_ID;

  return (
    <div data-testid="squad-grid" className="flex flex-col gap-8">
      {groups.map((group) => (
        <PersonCardRun
          key={group.id}
          label={group.label}
          hideHeading={hideHeading}
        >
          {group.players.map((p) => (
            <PlayerCard
              key={p.id}
              id={p.id}
              firstName={p.firstName}
              lastName={p.lastName}
              position={p.position}
              jerseyNumber={p.number}
              photoUrl={p.imageUrl}
              href={p.href}
            />
          ))}
        </PersonCardRun>
      ))}
    </div>
  );
}
