/**
 * Drupal Event (node--event) Schema
 * Club events and activities
 */

import { Schema as S } from 'effect'
import { BaseDrupalNodeAttributes, DrupalBody, DrupalImage } from './common.schema'

/**
 * Event node attributes
 */
export class EventAttributes extends S.Class<EventAttributes>('EventAttributes')({
  ...BaseDrupalNodeAttributes,
  field_event_date: S.optional(S.DateFromString),
  field_event_end_date: S.optional(S.DateFromString),
  field_location: S.optional(S.String),
  body: S.optional(DrupalBody),
}) {}

/**
 * Event relationships
 */
export class EventRelationships extends S.Class<EventRelationships>('EventRelationships')({
  field_image: S.optional(
    S.Struct({
      data: S.optional(DrupalImage),
    })
  ),
}) {}

/**
 * Complete Event node
 */
export class Event extends S.Class<Event>('Event')({
  id: S.String,
  type: S.Literal('node--event'),
  attributes: EventAttributes,
  relationships: EventRelationships,
}) {}

/**
 * Array of events
 */
export const EventsArray = S.Array(Event)

/**
 * Events response
 */
export class EventsResponse extends S.Class<EventsResponse>('EventsResponse')({
  data: EventsArray,
}) {}

/**
 * Single event response
 */
export class EventResponse extends S.Class<EventResponse>('EventResponse')({
  data: Event,
}) {}
