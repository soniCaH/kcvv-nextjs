import { PlayerCard } from "@/components/team/SquadGrid/PlayerCard";

export interface TeamStaffMemberData {
  id: string;
  firstName: string;
  lastName: string;
  /** PSD functionTitle code or free-text (e.g. "T1", "Hoofdtrainer"). */
  functionTitle?: string | null;
  /** Editorial role bucket fallback ("trainer" / "afgevaardigde"). */
  role?: string | null;
  /**
   * Photo URL (newsprint-treated). Missing → the coat-garment
   * `<JerseyIllustration>` fallback (#2485), same as `<SquadGrid>`'s
   * `<PlayerCard>` for a photoless player.
   */
  imageUrl?: string | null;
  /**
   * Staff-detail URL (`/staf/{psdId}`). Set only when a detail page exists
   * for this member; present → the card becomes a link to that profile.
   */
  href?: string | null;
}

export interface TeamStaffProps {
  staff: readonly TeamStaffMemberData[];
}

// PSD function codes → readable Dutch labels. Mirrors the organigram role codes.
const FUNCTION_CODE_LABELS: Record<string, string> = {
  T1: "Hoofdtrainer",
  T2: "Assistent-trainer",
  TK: "Keeperstrainer",
  TVJO: "Jeugdcoördinator",
};

// Editorial role bucket → capitalised label (fallback when functionTitle null).
const ROLE_BUCKET_LABELS: Record<string, string> = {
  trainer: "Trainer",
  afgevaardigde: "Afgevaardigde",
};

/**
 * Resolve a staff member's display function:
 *   1. functionTitle is a known code → mapped label
 *   2. functionTitle is already-readable free text → pass through
 *   3. functionTitle null, role is a known bucket → bucket label (Trainer / …)
 *   4. functionTitle null, role is free text → pass the role through verbatim
 *      (board titles "Voorzitter" / "Secretaris" / … live in `role`; their
 *      `functionTitle` is PSD-empty, so without this they'd fall to "Staf")
 *   5. nothing usable → "Staf"
 */
export function resolveFunctionLabel(
  functionTitle: string | null | undefined,
  role: string | null | undefined,
): string {
  const ft = functionTitle?.trim();
  if (ft) {
    return FUNCTION_CODE_LABELS[ft.toUpperCase()] ?? ft;
  }
  const roleText = role?.trim();
  if (roleText) {
    return ROLE_BUCKET_LABELS[roleText.toLowerCase()] ?? roleText;
  }
  return "Staf";
}

/**
 * `<TeamStaff>` — the staff/board run of the shared person-card directory
 * (#2477 / #2575). Renders on `/ploegen/[slug]` (team staff) and, via
 * `<BestuurPage>`, on `/club/bestuur`, `/club/angels` and
 * `/club/jeugdbestuur` (board members) — a `staffMember` document in every
 * case (`docs/ubiquitous-language.md` → Staff Member: "coaches, board,
 * admin"), so the run's own mono-caps heading reads "Staf" everywhere it
 * renders.
 *
 * Before #2575 this owned a bespoke 64px round-photo-or-monogram card on a
 * `minmax(150px)` grid with no run heading — a byte-for-byte near-clone of
 * `<SquadGrid>`'s `<PlayerCard>` on shell, type and role line, opposite on
 * portrait shape and column count (#2477). Both are now deleted in favour
 * of the shared `<PlayerCard>`, `garment="coat"` (#2485) for the imageless
 * fallback, on `<SquadGrid>`'s exact `minmax(140px,1fr)` grid — the two
 * runs on `/ploegen/[slug]` now break columns identically at every
 * viewport, which is the fault #2477 measured, not merely the round card.
 */
export function TeamStaff({ staff }: TeamStaffProps) {
  if (staff.length === 0) return null;

  return (
    <section data-testid="team-staff" aria-label="Staf">
      <h3 className="text-ink-muted border-paper-edge mb-3 border-b pb-1.5 font-mono text-[11px] tracking-[0.1em] uppercase">
        Staf
      </h3>
      <div
        data-testid="team-staff-grid"
        className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4"
      >
        {staff.map((member) => (
          <PlayerCard
            key={member.id}
            id={member.id}
            firstName={member.firstName}
            lastName={member.lastName}
            position={resolveFunctionLabel(member.functionTitle, member.role)}
            photoUrl={member.imageUrl?.trim() || undefined}
            href={member.href?.trim() || undefined}
            garment="coat"
          />
        ))}
      </div>
    </section>
  );
}
