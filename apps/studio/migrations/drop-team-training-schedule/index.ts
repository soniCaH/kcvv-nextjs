/**
 * Production counterpart to
 * `apps/studio-staging/migrations/drop-team-training-schedule/`.
 * See `packages/sanity-studio/src/migrations/drop-team-training-schedule.ts`
 * for the full contract.
 *
 * #2582: unsets `trainingSchedule` on team documents — the field (and its
 * `trainingSession` object type) is dropped from the schema; training
 * times live in PSD. 0 of 26 production docs carry a value. Idempotent —
 * re-runs are safe.
 *
 * Run against production AFTER staging has been verified:
 *   npx sanity@latest migration run drop-team-training-schedule --project vhb33jaz --dataset production --dry-run
 *   npx sanity@latest migration run drop-team-training-schedule --project vhb33jaz --dataset production --no-dry-run --no-confirm
 */
import {dropTeamTrainingScheduleMigration} from '@kcvv/sanity-studio/migrations'

export default dropTeamTrainingScheduleMigration
