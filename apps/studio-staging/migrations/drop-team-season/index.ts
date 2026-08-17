/**
 * Staging counterpart to `apps/studio/migrations/drop-team-season/`.
 * See `packages/sanity-studio/src/migrations/drop-team-season.ts`
 * for the full contract — both studios share the same source.
 *
 * #2567: unsets `season` on team documents — the field is dropped from the
 * schema (never had a writer; 0 of 23 staging docs carry a value).
 * Idempotent — re-runs are safe.
 *
 * Run against staging first. Note: the current Sanity CLI defaults
 * `migration run` to dry mode even without `--dry-run` — pass `--no-dry-run`
 * (and `--no-confirm` for a non-interactive run) to actually commit:
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset staging --dry-run
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset staging --no-dry-run --no-confirm
 */
import {dropTeamSeasonMigration} from '@kcvv/sanity-studio/migrations'

export default dropTeamSeasonMigration
