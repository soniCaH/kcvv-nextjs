/**
 * Production counterpart to `apps/studio-staging/migrations/drop-team-season/`.
 * See `packages/sanity-studio/src/migrations/drop-team-season.ts`
 * for the full contract.
 *
 * #2567: unsets `season` on team documents — the field is dropped from the
 * schema (never had a writer; 0 of 26 production docs carry a value).
 * Idempotent — re-runs are safe.
 *
 * Run against production AFTER staging has been verified:
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset production --dry-run
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset production --no-dry-run --no-confirm
 */
import {dropTeamSeasonMigration} from '@kcvv/sanity-studio/migrations'

export default dropTeamSeasonMigration
