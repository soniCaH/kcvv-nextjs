/**
 * Sponsor Schema
 * Effect Schema for sponsor data validation
 */

import { Schema as S } from 'effect'

/**
 * Sponsor Schema
 * Represents a sponsor with logo and optional link
 */
export const SponsorSchema = S.Struct({
  id: S.String,
  name: S.String,
  logo: S.String, // URL to sponsor logo
  url: S.optional(S.String), // Optional sponsor website
  order: S.optional(S.Number), // Display order
})

export type Sponsor = S.Schema.Type<typeof SponsorSchema>

/**
 * Sponsors Array Schema
 */
export const SponsorsArraySchema = S.Array(SponsorSchema)

export type SponsorsArray = S.Schema.Type<typeof SponsorsArraySchema>
