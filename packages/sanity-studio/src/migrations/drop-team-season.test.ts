import {at, unset} from 'sanity/migrate'
import {describe, expect, it} from 'vitest'
import {migrateDropTeamSeason, type TeamWithSeasonDoc} from './drop-team-season'

describe('migrateDropTeamSeason', () => {
  it('returns undefined when season is not present', () => {
    const doc: TeamWithSeasonDoc = {_id: 't-1', _type: 'team'}
    expect(migrateDropTeamSeason(doc)).toBeUndefined()
  })

  it('unsets season when present', () => {
    const doc: TeamWithSeasonDoc = {_id: 't-1', _type: 'team', season: '25/26'}
    expect(migrateDropTeamSeason(doc)).toEqual([at('season', unset())])
  })

  it('unsets a stored null value (Sanity treats null as a real value)', () => {
    const doc: TeamWithSeasonDoc = {_id: 't-1', _type: 'team', season: null}
    expect(migrateDropTeamSeason(doc)).toEqual([at('season', unset())])
  })

  it('is idempotent — re-running on an already-migrated doc is a no-op', () => {
    const doc: TeamWithSeasonDoc = {
      _id: 't-1',
      _type: 'team',
      // season already unset upstream.
    }
    expect(migrateDropTeamSeason(doc)).toBeUndefined()
  })
})
