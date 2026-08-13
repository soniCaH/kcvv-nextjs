import {at, set} from 'sanity/migrate'
import {describe, expect, it} from 'vitest'
import {
  CANONICAL_TAGS,
  canonicaliseTags,
  migrateNormalizeArticleTagCasing,
  type TaggedArticleDoc,
} from './normalize-article-tag-casing'

describe('canonicaliseTags', () => {
  it('rewrites the production collision A-ploeg → A-Ploeg', () => {
    expect(canonicaliseTags(['A-ploeg'])).toEqual(['A-Ploeg'])
  })

  it('returns null when every tag is already canonical', () => {
    expect(canonicaliseTags(['A-Ploeg', 'Jeugd'])).toBeNull()
  })

  it('collapses a doc carrying both casings into one entry', () => {
    expect(canonicaliseTags(['A-Ploeg', 'A-ploeg'])).toEqual(['A-Ploeg'])
  })

  it('preserves the original order of untouched tags', () => {
    expect(canonicaliseTags(['Jeugd', 'a-ploeg', 'Sponsor'])).toEqual([
      'Jeugd',
      'A-Ploeg',
      'Sponsor',
    ])
  })

  it('catches casing variants that do not exist in production yet', () => {
    expect(canonicaliseTags(['A-PLOEG', 'jeugd'])).toEqual(['A-Ploeg', 'Jeugd'])
  })

  it('capitalises B-ploeg → B-Ploeg to match A-Ploeg (club decision)', () => {
    expect(canonicaliseTags(['B-ploeg'])).toEqual(['B-Ploeg'])
  })

  it('normalises both team tags in one pass', () => {
    expect(canonicaliseTags(['A-ploeg', 'B-ploeg'])).toEqual([
      'A-Ploeg',
      'B-Ploeg',
    ])
  })

  it('never invents a rename for an unknown tag', () => {
    expect(canonicaliseTags(['Kampioenenviering'])).toBeNull()
  })

  it('keeps an unknown tag verbatim while fixing a known one beside it', () => {
    expect(canonicaliseTags(['a-ploeg', 'Kampioenenviering'])).toEqual([
      'A-Ploeg',
      'Kampioenenviering',
    ])
  })
})

describe('migrateNormalizeArticleTagCasing', () => {
  it('patches tags[] when a variant is present', () => {
    const doc: TaggedArticleDoc = {_type: 'article', tags: ['A-ploeg', 'Jeugd']}
    expect(migrateNormalizeArticleTagCasing(doc)).toEqual([
      at('tags', set(['A-Ploeg', 'Jeugd'])),
    ])
  })

  it('is idempotent — a second run produces no patch', () => {
    const doc: TaggedArticleDoc = {_type: 'article', tags: ['A-Ploeg', 'Jeugd']}
    expect(migrateNormalizeArticleTagCasing(doc)).toBeUndefined()
  })

  it('skips documents with no tags field', () => {
    expect(migrateNormalizeArticleTagCasing({_type: 'article'})).toBeUndefined()
  })

  it('skips an empty tags array', () => {
    expect(
      migrateNormalizeArticleTagCasing({_type: 'article', tags: []}),
    ).toBeUndefined()
  })

  it('skips a non-array tags value rather than coercing it', () => {
    expect(
      migrateNormalizeArticleTagCasing({_type: 'article', tags: 'A-ploeg'}),
    ).toBeUndefined()
  })

  it('bails out when tags[] holds a non-string, leaving it for a human', () => {
    expect(
      migrateNormalizeArticleTagCasing({
        _type: 'article',
        tags: ['A-ploeg', 42],
      }),
    ).toBeUndefined()
  })
})

describe('CANONICAL_TAGS', () => {
  it('maps every key to a value whose lowercase form is that key', () => {
    for (const [key, value] of Object.entries(CANONICAL_TAGS)) {
      expect(value.toLowerCase()).toBe(key)
    }
  })
})
