import { EditorialHeading } from "@/components/design-system/EditorialHeading";
import { LeaderDotRow } from "@/components/design-system/LeaderDotRow";
import type { ContentsGroup } from "@/lib/utils/site-contents";

export interface SiteContentsProps {
  /** The assembled contents view model — see `buildSiteContents`. */
  groups: ContentsGroup[];
}

/**
 * The printed contents page (`/inhoud`, decision D8), rendered from the view
 * model `buildSiteContents` assembles. Server component: nothing here is
 * interactive beyond the links themselves.
 *
 * **Group heading, not `<SectionHeader>`.** These are the four divisions of one
 * contents page, not four page sections — the device is a display-serif title
 * with its count ranged right over a 2px rule, which is what the mockup
 * (`docs/design/mockups/research-d-series/d8-index-page.html`) prints and what
 * `<SectionHeader>` (kicker + heading + optional CTA, `mb-10`) does not
 * express. `<SectionHeader>` still owns section-heading air everywhere it *is*
 * the right composition (#2552).
 *
 * **The columns wrap the entries, not the groups.** The mockup flowed all four
 * groups through one 3-column block, which works on the 8-row samples it drew
 * and does not work on the 125 articles production holds — one group that long
 * either splits away from its own heading or leaves the other two columns
 * empty. So each group keeps a full-width heading and flows its own rows
 * 1 → 2 → 3 columns.
 *
 * With no groups the component renders nothing at all: `/inhoud` is derived
 * from the content platform, so an empty site is an empty page rather than a
 * page of authored placeholders.
 *
 * **One chapter break (#2614).** `/inhoud` is the long index page the
 * manila tint (`bg-manila`, DESIGN.md → Colors → Neutral) exists for — index
 * pages only, once per page. `nieuws` is the largest group and the second in
 * print order, so it is the one section given the warmer stock; the other
 * three keep the page's own cream ground, the same "literal class string per
 * site" mechanism `bg-cream-soft` already uses (#2571) — no new `ground` prop.
 */
export function SiteContents({ groups }: SiteContentsProps) {
  if (groups.length === 0) return null;

  return (
    // Gap on the parent rather than a bottom margin per section: a
    // `last:mb-0` would lose to `sm:mb-16` in the cascade and leave the last
    // group carrying air the page container already supplies.
    <div className="flex flex-col gap-12 sm:gap-16">
      {groups.map((group) => (
        <section
          key={group.id}
          className={
            group.id === "nieuws" ? "bg-manila py-12 sm:py-16" : undefined
          }
        >
          <div className="border-ink flex items-baseline justify-between gap-4 border-b-2 pb-2">
            <EditorialHeading level={2} size="display-sm">
              {group.title}
            </EditorialHeading>
            <span className="text-ink-muted text-label shrink-0 font-mono">
              {group.entries.length}
            </span>
          </div>

          <ul className="mt-4 columns-1 gap-x-10 sm:columns-2 lg:columns-3">
            {group.entries.map((entry, index) => (
              <li
                key={entry.id}
                // Inert markers read by `<SiteContentsAnalytics>`'s one
                // delegated listener — the rows themselves stay server-rendered.
                data-contents-group={group.id}
                data-contents-position={index + 1}
                className="break-inside-avoid"
              >
                <LeaderDotRow
                  href={entry.href}
                  label={entry.label}
                  value={entry.value}
                  className="text-body-sm"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
