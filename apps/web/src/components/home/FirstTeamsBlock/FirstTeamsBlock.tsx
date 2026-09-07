/**
 * <FirstTeamsBlock> — homepage "Eerste ploegen" eyecatcher (#2211).
 *
 * Full-bleed jersey-deep-dark matchday-desk band (StripedSeam top + bottom),
 * one full-width row per senior team: [team label] · [last result] ·
 * [next fixture]. Both the result and the next fixture render as the shared
 * unified <TeamAgendaRow> — the same match row used on team pages + /kalender
 * (#2301, Direction A): the result as a cream row, the next fixture as the
 * featured jersey-deep card. Each row owns its own press-down <Link> deep to
 * its match detail (`/wedstrijd/{id}`), so there is no bespoke card style left
 * to clash and no nested-interactive wrapper on touch.
 *
 * Design lock: docs/design/mockups/eerste-ploegen/eerste-ploegen-locked.md
 * (visual record: docs/design/mockups/eerste-ploegen/04-b3-ia.html).
 */
import Image from "next/image";
import Link from "next/link";
import { EditorialHeading, StripedSeam } from "@/components/design-system";
import type { MatchesSliderPlaceholderVM } from "@/lib/repositories/homepage.repository";
import { FirstTeamAgendaRow } from "./FirstTeamAgendaRow";
import type { FirstTeamVM } from "./first-teams";
import {
  formatDaysUntil,
  resolvePlaceholderState,
  type PlaceholderState,
} from "./placeholder-rule";

export interface FirstTeamsBlockProps {
  teams: FirstTeamVM[];
  /**
   * Section heading. The homepage passes a fixture-aware label (HP-4) derived
   * by `firstTeamsHeading`, which owns the rule — see its docblock in
   * `first-teams.ts`. Defaults to "Dit weekend." so stories/tests stay stable;
   * that default is an unconditional claim, so real callers must pass one.
   */
  heading?: string;
  /**
   * A match read failed (BFF/PSD down or quota-exhausted), as opposed to the
   * feed genuinely holding no matches. Only picks which copy the held-open
   * notice carries; it is read solely on the no-rows path. Wins over
   * `placeholder` below and suppresses its image with it (#2505/#2844) — a
   * "new season in 23 days" notice rendered during an outage would claim the
   * feed is empty when the truth is that it could not be read.
   */
  unavailable?: boolean;
  /**
   * The Studio-authored off-season notice (#2505) — countdown, mededeling and
   * highlight image, read only on the no-rows path and only when `unavailable`
   * is false. `null`/`undefined` when nothing is authored — the band falls
   * back to its unchanged "Nog geen wedstrijden ingepland." A failed
   * placeholder read degrades to `null` at the call site too
   * (`degradeSection`, `(landing)/page.tsx`), so it lands here
   * indistinguishable from "nothing authored" and produces the same
   * fallback copy — it is `unavailable` above, not this prop, that carries
   * the match-feed outage signal (review finding 2 on #2505/PR #2852).
   */
  placeholder?: MatchesSliderPlaceholderVM | null;
  /**
   * Render reference time for the countdown. Defaults to now; the homepage
   * passes the same `now` it already computed for `firstTeamsHeading` /
   * `deriveFirstTeamVM` so every date-derived value on the page agrees.
   * Stories and tests override it for a deterministic day count.
   */
  now?: Date;
}

/**
 * The held-open dashed frame — #2427's tier-2 register: an empty slot inside a
 * populated page keeps its shape so the absence reads as a known gap rather
 * than a render failure. Shared by the per-slot `<SkipCard>` and the whole-band
 * notice so the two can't drift, the way `FIRST_TEAMS_ROW_GRID` is below.
 *
 * **Parked: this is the dark-ground register `<EmptyState>` tier "slot"
 * doesn't have yet (#2690/#2804).** `<EmptyState tier="slot">` is ink-only
 * (`border-ink-muted` / `border-ink bg-cream-soft`) — both wrong on this
 * band's `jersey-deep-dark` ground. This file is the one place that would
 * adopt a dark axis if `<EmptyState>` grew one; see the admission-rule/parked
 * note in `EmptyState.tsx`'s own docblock for the other end of this hand-off.
 * **Not migrated here** — that is #2402's call. Values to carry verbatim if
 * it happens: frame `border-cream/40 border-2 border-dashed` (this const),
 * `SkipCard` `text-cream/65`, band note `text-cream/80`. VR guard to name:
 * this file's `NoMatches` and `FeedUnavailable` stories, three viewports
 * each — ink-on-dark-green would be a loud diff.
 */
const HELD_OPEN_FRAME = "border-cream/40 border-2 border-dashed text-center";

function SkipCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${HELD_OPEN_FRAME} text-cream/65 flex items-center justify-center px-4 py-3 font-mono text-xs tracking-wide uppercase`}
    >
      {children}
    </div>
  );
}

/**
 * Row grid, shared with the homepage route skeleton so the two can't drift.
 *
 * Three columns only from `xl`: at `md` each scoreboard fell below its own
 * min-content and the row overflowed the page (#2397). The label column is a
 * bounded 11rem rather than the old `0.72fr` (~263px) — "A-ploeg" plus a
 * division needs about 110px, and the ~90px that frees is what lets a 30-char
 * club name sit unclipped. Bounded, not content-sized, because `divisionFull`
 * is PSD-authored and would otherwise spend that width straight back.
 *
 * Coupled to `<TeamAgendaRow>`'s `fluidNames` threshold: three-up lands each
 * card near 520px, deliberately under that 560px mark, because the fluid split
 * is what seats a long opponent name in a card that narrow.
 */
export const FIRST_TEAMS_ROW_GRID =
  "border-cream/20 grid gap-3 border-t py-5 first:border-t-0 xl:grid-cols-[minmax(0,11rem)_1fr_1fr] xl:gap-5";

/**
 * Renders a mededeling as a link when the Studio editor authored an
 * `announcementHref` beside it, plain text otherwise (#2505). The authored
 * production value today points at `/kalender` — the same destination the
 * band's own "Volledige kalender →" already offers — so the link changes
 * nothing for that content and exists for a future summer whose mededeling
 * points elsewhere (a news item, say).
 */
function Mededeling({ text, href }: { text: string; href?: string }) {
  if (!href) return <>{text}</>;
  return (
    <Link
      href={href}
      className="decoration-cream/50 hover:decoration-cream underline underline-offset-2"
    >
      {text}
    </Link>
  );
}

/** The five non-outage states from #2844's copy table — the outage state is
 *  decided by `<FirstTeamsBlock>` itself and never reaches this function. */
function renderPlaceholderCopy(state: PlaceholderState): React.ReactNode {
  switch (state.kind) {
    case "today":
      return "Vandaag de aftrap van het nieuwe seizoen.";
    case "countdown":
      return (
        <>
          {`Nog ${formatDaysUntil(state.daysUntil)} tot de aftrap.`}
          {state.mededeling ? (
            <>
              {" "}
              <Mededeling text={state.mededeling} href={state.href} />
            </>
          ) : null}
        </>
      );
    case "mededeling":
      return <Mededeling text={state.text} href={state.href} />;
    case "empty":
      return "Nog geen wedstrijden ingepland.";
    default: {
      const _exhaustive: never = state;
      throw new Error(
        `renderPlaceholderCopy: unhandled state ${JSON.stringify(_exhaustive)}`,
      );
    }
  }
}

/**
 * The no-rows notice when the read succeeded (as opposed to `unavailable`,
 * handled by the caller before this is reached). Renders the authored
 * `highlightImage` inside the dashed frame, above the sentence, at a capped
 * height well under the populated band's three-row height — never a
 * decorative backdrop: `highlightImage.alt` is `rule.required()` in the
 * Studio schema, so a `role="presentation"` treatment would leave a required
 * editor field feeding nothing, which is this ticket's own bug one level
 * down (#2844).
 */
function PlaceholderNotice({
  placeholder,
  now,
}: {
  placeholder?: MatchesSliderPlaceholderVM | null;
  now: Date;
}) {
  const state = resolvePlaceholderState(placeholder, now);
  const image = placeholder?.highlightImage;

  return (
    <div className={`${HELD_OPEN_FRAME} px-4 py-8`}>
      {image ? (
        <div className="relative mx-auto mb-4 h-40 w-full max-w-2xl overflow-hidden">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            // `object-top`: a same-origin safety net for whatever the
            // server-side `fp-x`/`fp-y` crop (`homepage.repository.ts`) still
            // hands the browser to fit responsively — team/action photos put
            // their subject upper-frame far more often than centred, the
            // same reasoning `<YouthBackdrop>` already uses for its own
            // 16:9 crop (review finding 4 on #2505/PR #2852).
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 672px"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip ?? undefined}
          />
        </div>
      ) : null}
      <p className="text-cream/80">{renderPlaceholderCopy(state)}</p>
    </div>
  );
}

function FirstTeamRow({ team }: { team: FirstTeamVM }) {
  return (
    <div className={`${FIRST_TEAMS_ROW_GRID} xl:items-stretch`}>
      <div className="flex flex-col justify-center">
        <span className="font-display text-cream text-2xl leading-tight font-bold">
          {team.label}
        </span>
        {team.division ? (
          <span className="text-cream/70 text-label mt-1 font-mono uppercase">
            {team.division}
          </span>
        ) : null}
      </div>
      {team.result ? (
        <FirstTeamAgendaRow
          match={team.result}
          teamSlug={team.slug}
          kind="result"
        />
      ) : (
        <SkipCard>Nog geen uitslag</SkipCard>
      )}
      {team.fixture ? (
        <FirstTeamAgendaRow
          match={team.fixture}
          teamSlug={team.slug}
          kind="fixture"
          featured
        />
      ) : (
        <SkipCard>Geen geplande wedstrijd</SkipCard>
      )}
    </div>
  );
}

/**
 * Render the "Eerste ploegen" band. Teams with neither a result nor a fixture
 * are dropped; when that leaves no rows at all the band still renders — chrome
 * plus a held-open notice — instead of vanishing (#2399). A silently absent
 * band left the homepage looking finished during a BFF outage, so a supporter
 * concluded the club had never posted the result.
 */
export function FirstTeamsBlock({
  teams,
  heading = "Dit weekend.",
  unavailable = false,
  placeholder = null,
  now = new Date(),
}: FirstTeamsBlockProps) {
  const rows = teams.filter((t) => t.result || t.fixture);

  return (
    <section aria-label="Eerste ploegen" className="bg-jersey-deep-dark">
      <StripedSeam colorPair="cream-jersey-deep" height="md" />
      <div className="mx-auto max-w-[var(--container-index)] px-4 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <span className="text-warm text-label font-mono font-semibold uppercase">
              Eerste ploegen
            </span>
            <EditorialHeading
              level={2}
              size="display-md"
              tone="cream"
              className="mt-2"
            >
              {heading}
            </EditorialHeading>
          </div>
          <Link
            href="/kalender"
            // `py-2 -my-2` — hit area only, no layout shift (#2394).
            className="text-warm hover:text-cream -my-2 shrink-0 py-2 font-mono text-xs font-semibold tracking-wide uppercase transition-colors"
          >
            Volledige kalender <span aria-hidden="true">→</span>
          </Link>
        </div>
        {rows.length > 0 ? (
          <div className="flex flex-col">
            {rows.map((team) => (
              <FirstTeamRow key={team.slug} team={team} />
            ))}
          </div>
        ) : unavailable ? (
          // Body type rather than `<SkipCard>`'s mono uppercase — this is a
          // sentence, not a two-word label. This outage line wins over every
          // other no-rows state and is checked before `placeholder` is even
          // read, so a BFF outage never shows a "new season in N days"
          // notice the page cannot vouch for (#2505/#2844).
          <p className={`${HELD_OPEN_FRAME} text-cream/80 px-4 py-8`}>
            Uitslagen en wedstrijden zijn even niet beschikbaar. Probeer het
            later opnieuw.
          </p>
        ) : (
          // The mededeling can carry its own link (`announcementHref`), so
          // this notice is no longer only reachable via the band's own
          // "Volledige kalender →" above — see `Mededeling` (#2505).
          <PlaceholderNotice placeholder={placeholder} now={now} />
        )}
      </div>
      <StripedSeam colorPair="cream-jersey-deep" height="md" flip />
    </section>
  );
}
