import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { EditorialHeading } from "@/components/design-system/EditorialHeading";
import { TapedCard } from "@/components/design-system/TapedCard";
import { JerseyShirt } from "@/components/design-system/JerseyShirt";
import { isAgeCode, type YouthDivisionGroup } from "@/lib/utils/group-teams";

export interface YouthDirectoryProps {
  /**
   * The section's own heading, and its landmark name. A prop rather than a
   * constant because two routes render this list over two different sets of
   * teams: on `/jeugd` it is the youth section, on `/ploegen` it is every team
   * the two flagships above it leave out — including Reserven, which is not
   * youth (#2641).
   */
  heading: string;
  divisions: readonly YouthDivisionGroup[];
  className?: string;
}

// Subtle ±1° scrapbook tilt, cycled by index (design lock 7j5). Kept small so a
// full division reads as character, not noise.
const CARD_ROTATIONS = [-1.1, 0.7, -0.5];

/**
 * Team directory (`/jeugd` + `/ploegen`). Grouped Reserven / Bovenbouw /
 * Middenbouw / Onderbouw (per [[project_youth_divisions]]); each team is a taped
 * polaroid of its squad photo (`team.teamImageUrl`, backfilled in #2070)
 * captioned with the team's display name — design locks 7j4 (variant C) + 7j5
 * (age-code-only · subtle rotation · newsprint colour). Teams without a photo
 * fall back to the canonical `<JerseyShirt>` illustration. A group with no
 * `range` renders its heading bare (#2414). Empty groups are omitted; the whole
 * block hides when no group has teams.
 */
export function YouthDirectory({
  heading,
  divisions,
  className,
}: YouthDirectoryProps) {
  const groups = divisions.filter((d) => d.teams.length > 0);
  if (groups.length === 0) return null;

  return (
    <section
      data-testid="youth-directory"
      aria-label={heading}
      className={cn("flex flex-col gap-10", className)}
    >
      <EditorialHeading level={2} size="display-md" emphasis={{ text: "." }}>
        {heading}
      </EditorialHeading>

      {groups.map((group) => (
        <div key={group.label} data-testid="youth-division">
          <h3 className="text-ink-muted border-paper-edge mb-5 border-b pb-1.5 font-mono text-[11px] tracking-[0.1em] uppercase">
            {group.label}
            {group.range ? ` · ${group.range}` : null}
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-x-4 gap-y-7">
            {group.teams.map((team, index) => {
              // The caption is the team's one display name (#2630) — the same
              // string its page heads itself with, so the click confirms
              // itself. The chest keeps reading `age` directly: the 56px
              // overlay fits a letter or an age code, not a word, and an empty
              // chest reads as a broken card. Reserven's age is "A" — a senior
              // code that reads as the A-ploeg in a youth grid — so non-age
              // teams wear the caption's initial instead.
              const ageCode = isAgeCode(team.age) ? team.age : null;
              const caption = team.displayName;
              const chestMark = ageCode ?? caption.charAt(0).toUpperCase();
              return (
                <Link
                  key={team._id}
                  href={`/ploegen/${team.slug}`}
                  data-testid="youth-team-card"
                  aria-label={`${caption} — bekijk ploeg`}
                  className="block"
                >
                  <TapedCard
                    rotation={CARD_ROTATIONS[index % CARD_ROTATIONS.length]}
                    tape={{
                      color: "warm",
                      length: "sm",
                      position: index % 2 === 0 ? "left" : "right",
                      rotation: "a",
                    }}
                    bg="cream"
                    padding="sm"
                    interactive="press"
                  >
                    <div className="border-ink relative aspect-[4/3] w-full overflow-hidden border">
                      {team.teamImageUrl ? (
                        <Image
                          src={team.teamImageUrl}
                          alt=""
                          fill
                          // Sanity CDN URL already carries ?w/q/fm transforms —
                          // skip /_next/image (matches TeamFlagship/PlayerCard/TeamStaff).
                          unoptimized
                          sizes="(min-width: 768px) 200px, 45vw"
                          className="object-cover"
                          style={{ filter: "var(--filter-photo-newsprint)" }}
                        />
                      ) : (
                        <div className="bg-cream-soft flex h-full w-full items-center justify-center">
                          <JerseyShirt
                            letterOverlay={chestMark}
                            className="h-full max-h-24 w-auto py-2"
                          />
                        </div>
                      )}
                    </div>
                    <p className="font-display-big text-jersey-deep mt-2 text-center text-2xl font-black tabular-nums">
                      {caption}
                    </p>
                    {/* The reeks this team plays in, when the club has
                      published one — and nothing at all when it has not
                      (#2641). The slot used to fall back to `team.name`, which
                      made it true on 1 of the directory's 16 cards: measured on
                      production, `divisionFull` is null on all fifteen youth
                      teams and set only on Reserven, so fifteen cards printed
                      their own caption back at themselves, five of them with
                      the double space the federation name carries. No
                      `?? division` either, unlike the surfaces that have room
                      for it — that field is a code (`3NA`), which says nothing
                      at 10px. */}
                    {team.divisionFull ? (
                      <p className="text-ink-soft mt-0.5 text-center font-mono text-[10px] leading-tight tracking-[0.08em] uppercase">
                        {team.divisionFull}
                      </p>
                    ) : null}
                  </TapedCard>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
