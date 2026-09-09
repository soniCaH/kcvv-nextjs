import type { PlayerVM } from "@/lib/repositories/player.repository";
import { PlayerCard } from "./PlayerCard";
import { PersonCardRun } from "./PersonCardRun";

export interface SquadGridProps {
  players: readonly PlayerVM[];
}

interface PositionGroup {
  /** Plural Dutch group heading. */
  label: string;
  /** Singular position value(s) that fall into this group. */
  match: (position: string | undefined) => boolean;
}

// Ordered front-to-back: keepers → defenders → midfielders → attackers, with
// a trailing catch-all so no player is dropped — unmapped and unauthored
// (#2567) positions both land there.
const GROUPS: PositionGroup[] = [
  { label: "Doelmannen", match: (p) => p === "Keeper" },
  { label: "Verdedigers", match: (p) => p === "Verdediger" },
  { label: "Middenvelders", match: (p) => p === "Middenvelder" },
  { label: "Aanvallers", match: (p) => p === "Aanvaller" },
];

function partition(players: readonly PlayerVM[]): {
  label: string;
  players: PlayerVM[];
}[] {
  const assigned = new Set<string>();
  const result: { label: string; players: PlayerVM[] }[] = [];

  for (const group of GROUPS) {
    const members = players.filter((p) => group.match(p.position));
    if (members.length > 0) {
      members.forEach((m) => assigned.add(m.id));
      result.push({ label: group.label, players: members });
    }
  }

  // Trailing catch-all for any position not in the four canonical groups.
  const rest = players.filter((p) => !assigned.has(p.id));
  if (rest.length > 0) {
    result.push({ label: "Spelers", players: rest });
  }

  return result;
}

export function SquadGrid({ players }: SquadGridProps) {
  if (players.length === 0) return null;

  const groups = partition(players);
  // A single group separates nobody from a neighbour — the position
  // headings gain a gate for exactly the same reason the position label
  // itself did (#2638): rendering "Spelers" over the only group on a U9
  // page (nobody's position is known) claims a distinction the data
  // doesn't support. Two-plus groups keep their headings — that's the
  // actual argument for the four buckets (U17, U19, the first team).
  const hideHeading = groups.length === 1;

  return (
    <div data-testid="squad-grid" className="flex flex-col gap-8">
      {groups.map((group) => (
        <PersonCardRun
          key={group.label}
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
