/**
 * Staging counterpart to
 * `apps/studio/migrations/drop-team-training-schedule/`.
 *
 * See that file for the full contract — both migrations share the same
 * source in `@kcvv/sanity-studio/migrations`.
 *
 * Staging carries 1 team document with `trainingSchedule` data (measured
 * 2026-09-07, 2 sessions) — run this first:
 *   npx sanity@latest migration run drop-team-training-schedule --project vhb33jaz --dataset staging --dry-run
 *   npx sanity@latest migration run drop-team-training-schedule --project vhb33jaz --dataset staging --no-dry-run --no-confirm
 */
import {dropTeamTrainingScheduleMigration} from '@kcvv/sanity-studio/migrations'

export default dropTeamTrainingScheduleMigration
