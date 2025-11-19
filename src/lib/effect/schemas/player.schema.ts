/**
 * Drupal Player (node--player) Schema
 * Player profiles
 */

import { Schema as S } from 'effect'
import { BaseDrupalNodeAttributes, DrupalBody, DrupalImage, DrupalNodeReference } from './common.schema'

/**
 * Player node attributes
 */
export class PlayerAttributes extends S.Class<PlayerAttributes>('PlayerAttributes')({
  ...BaseDrupalNodeAttributes,
  field_first_name: S.optional(S.String),
  field_last_name: S.optional(S.String),
  field_position: S.optional(S.String),
  field_number: S.optional(S.Number),
  field_birth_date: S.optional(S.DateFromString),
  field_nationality: S.optional(S.String),
  field_height: S.optional(S.Number),
  field_weight: S.optional(S.Number),
  body: S.optional(DrupalBody),
}) {}

/**
 * Player relationships
 */
export class PlayerRelationships extends S.Class<PlayerRelationships>('PlayerRelationships')({
  field_image: S.optional(
    S.Struct({
      data: S.optional(DrupalImage),
    })
  ),
  field_team: S.optional(
    S.Struct({
      data: S.optional(DrupalNodeReference),
    })
  ),
}) {}

/**
 * Complete Player node
 */
export class Player extends S.Class<Player>('Player')({
  id: S.String,
  type: S.Literal('node--player'),
  attributes: PlayerAttributes,
  relationships: PlayerRelationships,
}) {}

/**
 * Array of players
 */
export const PlayersArray = S.Array(Player)

/**
 * Players response
 */
export class PlayersResponse extends S.Class<PlayersResponse>('PlayersResponse')({
  data: PlayersArray,
}) {}

/**
 * Single player response
 */
export class PlayerResponse extends S.Class<PlayerResponse>('PlayerResponse')({
  data: Player,
}) {}
