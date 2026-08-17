import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { TapedFigure } from "@/components/design-system/TapedFigure";
import { MonoLabel } from "@/components/design-system/MonoLabel";
import { EditorialHeading } from "@/components/design-system/EditorialHeading";
import { JerseyShirt } from "@/components/design-system/JerseyShirt";
import { getYouthDivision } from "@/lib/utils/group-teams";

export interface TeamHeroProps {
  /**
   * What this team is called — the `<h1>`. Resolved by `teamDisplayName()`, the
   * single helper every surface reads, so the heading, the tab and the share
   * card cannot name the team three different ways. Never derived here: the
   * heading used to come off `age`, a shared competition band, which is how
   * `/ploegen/reserven` came to be headed `A-ploeg.` (#2630).
   */
  displayName: string;
  /** "senior" or "youth" — drives kicker + meta pill logic. */
  teamType: "youth" | "senior";
  /** Age group extracted from `age` (e.g. "U13"). Computed by the repository. */
  ageGroup?: string;
  /** Division label, short (e.g. "3NA") or full (preferred). */
  division?: string | null;
  /** Full division label (e.g. "Eerste Elftal A – 3e Nat. A"). */
  divisionFull?: string | null;
  /** Season label (e.g. "25/26"). */
  season?: string | null;
  /** Editorial tagline — renders as italic display lead. Auto-hides when absent. */
  tagline?: string | null;
  /** Squad photo URL (landscape newsprint photo). No photo → JerseyShirt fallback. */
  teamImageUrl?: string | null;
  className?: string;
}

export function TeamHero({
  displayName,
  teamType,
  ageGroup,
  division,
  divisionFull,
  season,
  tagline,
  teamImageUrl,
  className,
}: TeamHeroProps) {
  const hasPhoto =
    teamImageUrl !== undefined && teamImageUrl !== null && teamImageUrl !== "";

  const kicker = teamType === "youth" ? "KCVV Elewijt · Jeugd" : "KCVV Elewijt";

  // Meta pills: senior = division + season; youth = youth band + season.
  const divisionLabel = divisionFull ?? division ?? null;
  const bandLabel =
    teamType === "youth" ? getYouthDivision(ageGroup) : divisionLabel;

  const showBandPill = bandLabel !== null && bandLabel !== "";
  const showSeasonPill =
    season !== null && season !== undefined && season !== "";
  const showMeta = showBandPill || showSeasonPill;

  const showTagline =
    tagline !== null && tagline !== undefined && tagline !== "";

  // Chest mark on the JerseyShirt fallback. A shirt carries the team's own
  // name, so it reads the display name — not `age`, which is the shared
  // competition band and would print `U17` on a page headed `U16.` and `A` on
  // one headed `Reserven.` (#2630). The 56px overlay fits an age code or a
  // letter, not a word, so anything longer wears its initial.
  const jerseyLetter =
    displayName.length <= 4
      ? displayName.toUpperCase()
      : displayName.charAt(0).toUpperCase();

  return (
    <section
      data-testid="team-hero"
      aria-label={`${displayName} · ploegpagina`}
      className={cn(
        "grid grid-cols-1 items-start gap-x-10 gap-y-8 overflow-x-clip sm:grid-cols-[1fr_minmax(300px,420px)]",
        className,
      )}
    >
      {/* Words column — order-last on mobile so artefact appears above */}
      <div className="order-last flex flex-col gap-4 sm:order-first">
        <span data-testid="team-hero-kicker">
          <MonoLabel variant="plain">{kicker}</MonoLabel>
        </span>

        <EditorialHeading level={1} size="display-xl" emphasis={{ text: "." }}>
          {displayName}
        </EditorialHeading>

        {showMeta ? (
          <div
            data-testid="team-hero-meta"
            className="flex flex-wrap items-center gap-2"
          >
            {showBandPill ? (
              <MonoLabel variant="pill-ink" size="sm">
                {bandLabel}
              </MonoLabel>
            ) : null}
            {showSeasonPill ? (
              <MonoLabel variant="pill-cream" size="sm">
                {season}
              </MonoLabel>
            ) : null}
          </div>
        ) : null}

        {showTagline ? (
          <p
            data-testid="team-hero-tagline"
            className="font-display text-ink-muted text-display-sm italic"
          >
            {tagline}
          </p>
        ) : null}
      </div>

      {/* Artefact column — order-first on mobile so it appears above the words */}
      <div
        data-testid="team-hero-artefact"
        data-state={hasPhoto ? "photo" : "jersey"}
        className="order-first flex w-full flex-col gap-3 justify-self-start sm:order-last sm:justify-self-end"
      >
        <TapedFigure
          aspect="landscape-3-2"
          rotation="b"
          tape={{ color: "warm", length: "md" }}
          bg="cream-soft"
          tint={hasPhoto ? "newsprint" : "none"}
          padding="none"
        >
          {hasPhoto ? (
            <Image
              src={teamImageUrl!}
              alt=""
              width={420}
              height={280}
              unoptimized
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <JerseyShirt
                letterOverlay={jerseyLetter}
                className="h-full max-h-[160px] w-full max-w-[160px]"
              />
            </div>
          )}
        </TapedFigure>

        {/* Season stub — decorative; season content is accessible via the meta pill above. */}
        {showSeasonPill ? (
          <div
            data-testid="team-hero-season-stub"
            aria-hidden="true"
            className="border-ink bg-cream inline-flex w-fit translate-x-2 rotate-[0.5deg] items-center gap-2 border-2 border-dashed px-3 py-2 shadow-[2px_2px_0_0_var(--color-ink)]"
          >
            <MonoLabel variant="plain" size="sm">
              Seizoen
            </MonoLabel>
            <span className="font-display-big text-ink text-display-sm leading-none">
              {season}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
