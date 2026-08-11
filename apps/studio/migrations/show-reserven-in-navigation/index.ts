import {defineMigration, at, set} from 'sanity/migrate'

/**
 * Set `showInNavigation = true` on the Reserven team (psdId 34). Part of #2414.
 *
 * `TEAMS_QUERY` and `TEAMS_LANDING_QUERY` both gate on
 * `showInNavigation != false`, so with the flag off Reserven renders on no
 * surface at all — not the Jeugd dropdown, not `/jeugd`, not `/ploegen`. That
 * contradicts the code around it: `layout.tsx` carries an explicit `NAV-1`
 * branch routing psdId 34 under Jeugd rather than the senior nav, and
 * `buildJeugdItem` labels it "Reserven" — both dead while the flag is false.
 *
 * #2414 adds the matching index-page surface (its own `Reserven` group in
 * `groupTeamsForLanding`, ahead of Bovenbouw). This migration is the data half:
 * without it that group is permanently empty in production.
 *
 * Scope is deliberately one document — `FC WEITSE GANS` and `KCVVE U5` are
 * hidden by the same flag and stay hidden.
 *
 * Blast radius beyond the two index pages: `showInNavigation` is the club-wide
 * visibility filter, not just a nav flag. `apps/api/src/sanity/projection.ts`
 * reads `*[_type == "team" && showInNavigation != false].psdId` and
 * `getNextMatches` fans out over that list, so flipping this also surfaces
 * Reserven's fixtures on the next-matches path and adds one more PSD
 * `/games/team/{id}/seasons/{id}` call per cold fetch. On the web side the same
 * `TEAMS_QUERY` gate feeds search, the ICS feed, /kalender and /scheurkalender.
 * All are correct outcomes for a team that plays real fixtures — but they are
 * consequences of this one field, so flip it deliberately.
 *
 * Note: the staging dataset has no `team-psd-34` document, so this is a no-op
 * there. Production is the target.
 *
 * Dry-run first:
 *   npx sanity@latest migration run show-reserven-in-navigation --project vhb33jaz --dataset production --dry-run
 *
 * Apply:
 *   npx sanity@latest migration run show-reserven-in-navigation --project vhb33jaz --dataset production
 */
export default defineMigration({
  title: 'Show the Reserven team in navigation and on the team index pages',
  documentTypes: ['team'],

  migrate: {
    document(doc) {
      if (doc.psdId !== '34') return undefined
      if (doc.showInNavigation === true) return undefined
      return [at('showInNavigation', set(true))]
    },
  },
})
