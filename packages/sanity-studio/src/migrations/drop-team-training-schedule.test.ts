import {at, unset} from 'sanity/migrate'
import {describe, expect, it} from 'vitest'
import {
  migrateDropTeamTrainingSchedule,
  type TeamWithTrainingScheduleDoc,
} from './drop-team-training-schedule'

describe('migrateDropTeamTrainingSchedule', () => {
  // Also covers idempotency — this doc's `trainingSchedule` is already
  // absent, whether because it never had one or a prior run already unset it.
  it('returns undefined when trainingSchedule is not present', () => {
    const doc: TeamWithTrainingScheduleDoc = {_id: 't-1', _type: 'team'}
    expect(migrateDropTeamTrainingSchedule(doc)).toBeUndefined()
  })

  it('unsets trainingSchedule when present', () => {
    const doc: TeamWithTrainingScheduleDoc = {
      _id: 't-1',
      _type: 'team',
      trainingSchedule: [{_key: 'a', day: 'Dinsdag', time: '19:30'}],
    }
    expect(migrateDropTeamTrainingSchedule(doc)).toEqual([at('trainingSchedule', unset())])
  })

  it('unsets a stored null value (Sanity treats null as a real value)', () => {
    const doc: TeamWithTrainingScheduleDoc = {_id: 't-1', _type: 'team', trainingSchedule: null}
    expect(migrateDropTeamTrainingSchedule(doc)).toEqual([at('trainingSchedule', unset())])
  })
})
