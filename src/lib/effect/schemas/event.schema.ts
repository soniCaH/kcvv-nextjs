/**
 * Drupal Event (node--event) Schema
 *
 * Event pages with information about:
 * - Event name, date, location
 * - Event description/body
 * - Event image
 * - Start and end dates
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from 'effect'
import {
  BaseDrupalNodeAttributes,
  DateFromStringOrDate,
  DrupalBody,
  DrupalImage,
  JsonApiVersion,
  JsonApiLinks,
  DrupalResource,
} from './common.schema'
import { MediaImage } from './media.schema'
import { File } from './file.schema'

/**
 * Event node attributes
 */
export class EventAttributes extends S.Class<EventAttributes>('EventAttributes')({
  ...BaseDrupalNodeAttributes,
  field_event_date: S.optional(DateFromStringOrDate),
  field_event_end_date: S.optional(DateFromStringOrDate),
  field_location: S.optional(S.String),
  body: S.optional(DrupalBody),
}) {}

/**
 * Event relationships
 *
 * Defines relationships to other entities:
 * - field_image: Event photo (can be resolved DrupalImage or reference)
 */
export class EventRelationships extends S.Class<EventRelationships>('EventRelationships')({
  /**
   * Event image
   * Can be either:
   * - DrupalImage: Fully resolved with uri.url (after mapIncluded processing)
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_image: S.optional(
    S.Struct({
      data: S.optional(
        S.Union(
          DrupalImage,
          S.Struct({
            type: S.Literal('media--image'),
            id: S.String,
          })
        )
      ),
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
 * Discriminated union of all possible included resource types for events
 *
 * When fetching events with ?include=field_image.field_media_image
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the event image
 * - File: The actual image file with URL
 * - DrupalResource: Fallback for unknown/future types
 *
 * This union provides full type safety and runtime validation for included entities.
 *
 * @example
 * ```typescript
 * const included: EventIncludedResource[] = response.included || []
 *
 * included.forEach(resource => {
 *   if (resource.type === 'media--image') {
 *     // TypeScript knows this is MediaImage
 *     console.log(resource.attributes.name)
 *   } else if (resource.type === 'file--file') {
 *     // TypeScript knows this is File
 *     console.log(resource.attributes.uri.url)
 *   }
 * })
 * ```
 */
export const EventIncludedResource = S.Union(
  MediaImage,
  File,
  DrupalResource // Fallback for unknown types
)

/**
 * Drupal JSON:API response for event collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of event entities
 * - included: Related entities (media, files)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 *
 * @example
 * ```typescript
 * const response: EventsResponse = await fetch('/jsonapi/node/event')
 * const events = response.data  // Event[]
 * const links = response.links  // JsonApiLinks
 * ```
 */
export class EventsResponse extends S.Class<EventsResponse>('EventsResponse')({
  data: EventsArray,
  included: S.optional(S.Array(EventIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    })
  ),
}) {}

/**
 * Drupal JSON:API response for single event
 *
 * Similar to EventsResponse but data is a single Event instead of array.
 * Used when fetching by slug/ID.
 *
 * @example
 * ```typescript
 * const response: EventResponse = await fetch('/jsonapi/node/event/abc-123')
 * const event = response.data  // Event (not array)
 * ```
 */
export class EventResponse extends S.Class<EventResponse>('EventResponse')({
  data: Event,
  included: S.optional(S.Array(EventIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
