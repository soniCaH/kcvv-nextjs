/**
 * Test DateFromStringOrDate encoding/decoding cycle
 */

import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import { DateFromStringOrDate } from './common.schema'

describe('DateFromStringOrDate', () => {
  it('should decode ISO string to Date', () => {
    const isoString = '2025-06-20T09:41:36.000Z'
    const result = S.decodeUnknownSync(DateFromStringOrDate)(isoString)

    expect(result).toBeInstanceOf(Date)
    expect(result.toISOString()).toBe(isoString)
  })

  it('should decode Date object to Date', () => {
    const date = new Date('2025-06-20T09:41:36.000Z')
    const result = S.decodeUnknownSync(DateFromStringOrDate)(date)

    expect(result).toBeInstanceOf(Date)
    expect(result).toBe(date)
  })

  it('should encode Date to ISO string', () => {
    const date = new Date('2025-06-20T09:41:36.000Z')
    const encoded = S.encodeSync(DateFromStringOrDate)(date)

    expect(typeof encoded).toBe('string')
    expect(encoded).toBe('2025-06-20T09:41:36.000Z')
  })

  it('should handle full encode-decode roundtrip', () => {
    const originalDate = new Date('2025-06-20T09:41:36.000Z')

    // Encode Date → string (simulates Next.js serialization)
    const encoded = S.encodeSync(DateFromStringOrDate)(originalDate)
    expect(typeof encoded).toBe('string')

    // Decode string → Date (simulates rehydration)
    const decoded = S.decodeUnknownSync(DateFromStringOrDate)(encoded)
    expect(decoded).toBeInstanceOf(Date)
    expect(decoded.toISOString()).toBe(originalDate.toISOString())
  })

  it('should handle decode-encode-decode cycle (simulating Next.js SSR)', () => {
    // 1. API returns ISO string
    const apiResponse = '2025-06-20T09:41:36.000Z'

    // 2. Server decodes to Date
    const serverDate = S.decodeUnknownSync(DateFromStringOrDate)(apiResponse)
    expect(serverDate).toBeInstanceOf(Date)

    // 3. Next.js serializes for client (Date → string)
    const serialized = S.encodeSync(DateFromStringOrDate)(serverDate)
    expect(typeof serialized).toBe('string')

    // 4. Client receives and decodes again
    const clientDate = S.decodeUnknownSync(DateFromStringOrDate)(serialized)
    expect(clientDate).toBeInstanceOf(Date)
    expect(clientDate.toISOString()).toBe(apiResponse)
  })
})
