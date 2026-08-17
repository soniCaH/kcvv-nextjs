/**
 * Staging counterpart to `apps/studio/migrations/drop-team-season/`.
 *
 * See that file for the full contract — both migrations share the same
 * source in `@kcvv/sanity-studio/migrations`.
 *
 * Run against staging first:
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset staging --dry-run
 *   npx sanity@latest migration run drop-team-season --project vhb33jaz --dataset staging --no-dry-run --no-confirm
 */
import {dropTeamSeasonMigration} from '@kcvv/sanity-studio/migrations'

export default dropTeamSeasonMigration
