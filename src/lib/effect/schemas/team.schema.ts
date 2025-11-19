/**
 * Drupal Team (node--team) Schema
 * Football team pages
 */

import { Schema as S } from 'effect'
import { BaseDrupalNodeAttributes, DrupalBody, DrupalImage } from './common.schema'

/**
 * Team node attributes
 */
export class TeamAttributes extends S.Class<TeamAttributes>('TeamAttributes')({
  ...BaseDrupalNodeAttributes,
  field_team_id: S.Number,
  field_league_id: S.optional(S.Number),
  field_league: S.optional(S.String),
  field_division: S.optional(S.String),
  field_season: S.optional(S.String),
  body: S.optional(DrupalBody),
}) {}

/**
 * Team relationships
 */
export class TeamRelationships extends S.Class<TeamRelationships>('TeamRelationships')({
  field_image: S.optional(
    S.Struct({
      data: S.optional(DrupalImage),
    })
  ),
  field_players: S.optional(
    S.Struct({
      data: S.Array(
        S.Struct({
          id: S.String,
          type: S.Literal('node--player'),
        })
      ),
    })
  ),
}) {}

/**
 * Complete Team node
 */
export class Team extends S.Class<Team>('Team')({
  id: S.String,
  type: S.Literal('node--team'),
  attributes: TeamAttributes,
  relationships: TeamRelationships,
}) {}

/**
 * Array of teams
 */
export const TeamsArray = S.Array(Team)

/**
 * Teams response
 */
export class TeamsResponse extends S.Class<TeamsResponse>('TeamsResponse')({
  data: TeamsArray,
}) {}

/**
 * Single team response
 */
export class TeamResponse extends S.Class<TeamResponse>('TeamResponse')({
  data: Team,
}) {}
