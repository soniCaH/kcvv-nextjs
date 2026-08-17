import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { TapedCard } from "@/components/design-system/TapedCard";
import { JerseyIllustration } from "@/components/design-system/JerseyIllustration";

export interface PlayerCardProps {
  firstName: string;
  lastName: string;
  /** Resolved, sentence-case position label (e.g. "Middenvelder"). */
  position: string;
  jerseyNumber?: number;
  /** Resolved photo URL (transparentImageUrl ?? psdImageUrl). Missing → illustration. */
  photoUrl?: string;
  /** Detail-page href. When absent the card is not a link. */
  href?: string;
  className?: string;
}

export function PlayerCard({
  firstName,
  lastName,
  position,
  jerseyNumber,
  photoUrl,
  href,
  className,
}: PlayerCardProps) {
  const hasPhoto = photoUrl !== undefined && photoUrl !== "";

  const inner = (
    <>
      {/* 3:4 photo / illustration with number disc overlay. `bg-cream` is the
          backdrop the photo multiplies against — the same token the card
          already paints, so nothing moves, but the blend stops depending
          silently on <TapedCard> painting cream two levels up. */}
      <div
        data-testid="player-card-figure"
        data-state={hasPhoto ? "photo" : "illustration"}
        className="border-paper-edge bg-cream relative aspect-[3/4] overflow-hidden border"
      >
        {hasPhoto ? (
          /* Every photo this card renders blends: multiply drops a studio
             cutout's white matte onto the card's cream. No cutout branch and
             no coverage threshold (#2633, deciding #2590). */
          <Image
            src={photoUrl!}
            alt=""
            width={300}
            height={400}
            unoptimized
            className="block h-full w-full object-cover mix-blend-multiply"
            style={{ filter: "var(--filter-photo-newsprint)" }}
          />
        ) : (
          <JerseyIllustration
            variant="card"
            data-testid="player-card-illustration"
          />
        )}

        {jerseyNumber !== undefined ? (
          <span
            data-testid="player-card-number"
            aria-hidden="true"
            className="bg-jersey-deep text-cream border-ink font-display-big absolute top-1.5 left-1.5 grid h-[26px] w-[26px] place-items-center border-[1.5px] text-sm font-black tabular-nums"
          >
            {jerseyNumber}
          </span>
        ) : null}
      </div>

      {/* Name — first semibold + last italic (6.A rhythm) */}
      <p className="font-display text-ink mt-2 leading-[1.05]">
        <span className="font-semibold">{firstName}</span>{" "}
        <em className="font-normal italic">{lastName}</em>
      </p>

      {/* Position */}
      <p className="text-ink-muted mt-1 font-mono text-[9px] tracking-[0.06em] uppercase">
        {position}
      </p>
    </>
  );

  const card = (
    <TapedCard
      bg="cream"
      shadow="sm"
      padding="none"
      interactive={href ? "press" : false}
      className={cn("h-full p-2 pb-3", className)}
      dataAttrs={href ? undefined : { "data-testid": "player-card" }}
    >
      {inner}
    </TapedCard>
  );

  if (href) {
    return (
      <Link
        href={href}
        data-testid="player-card"
        aria-label={`${firstName} ${lastName} — ${position}`}
        className="block h-full"
      >
        {card}
      </Link>
    );
  }

  return card;
}
