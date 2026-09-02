import { PlayerCard, PersonCardRun } from "@/components/team/SquadGrid";

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
   * `<JerseyIllustration>` fallback (#2485).
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
  /** The run's own word — forwarded to `<PersonCardRun>`'s `label` (#2575 review). "Staf" on the team page, "De leden" on a board page. */
  heading: string;
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
 * `<TeamStaff>` — one `<PersonCardRun>` of the shared `<PlayerCard>`
 * (#2477), `garment="coat"` for the imageless fallback (#2485). Renders on
 * `/ploegen/[slug]` and, via `<BestuurPage>`, on the three board routes.
 */
export function TeamStaff({ staff, heading }: TeamStaffProps) {
  if (staff.length === 0) return null;

  return (
    <PersonCardRun label={heading} data-testid="team-staff-grid">
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
          blendPhoto={false}
          linkAffordance
        />
      ))}
    </PersonCardRun>
  );
}
