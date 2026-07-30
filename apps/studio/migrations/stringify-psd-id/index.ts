import {defineMigration, at, set} from 'sanity/migrate'

/**
 * Coerce numeric `psdId` → string on player / staffMember / team documents.
 * Part of #2311.
 *
 * Background: `psdId` is authored as a string everywhere in the sync pipeline
 * (`transformStaff`/`transformMember`/`transformTeam` all do `String(psd.id)`),
 * but a handful of older docs had a numeric `psdId`. That broke the
 * `typeof id === "string"` filter in `getProtectedStaffPsdIds`, letting
 * reconciliation archive organigram-referenced staff.
 *
 * The data fix was already applied directly to both datasets on 2026-07-29
 * (staging: 11 docs, production: 10 docs), so this migration is a documented,
 * idempotent no-op safety net — it only touches docs whose `psdId` is still a
 * number, and re-running it changes nothing once all are strings.
 *
 * Run with (`sanity migration run` dry-runs by default — `--no-dry-run` applies):
 *   npx sanity@latest migration run stringify-psd-id --project vhb33jaz --dataset production --no-dry-run
 *   npx sanity@latest migration run stringify-psd-id --project vhb33jaz --dataset staging --no-dry-run
 */
export default defineMigration({
  title: 'Coerce numeric psdId → string on player/staffMember/team',
  documentTypes: ['player', 'staffMember', 'team'],

  migrate: {
    document(doc) {
      if (typeof doc.psdId === 'number') {
        return at('psdId', set(String(doc.psdId)))
      }
      return undefined
    },
  },
})
