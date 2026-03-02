/**
 * Drupal Event (node--event) Schema
 *
 * Event pages with information about:
 * - Event name, date range, external link
 * - Event image (via field_media_image relationship)
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from "effect";
import {
  BaseDrupalNodeAttributes,
  DrupalImage,
  JsonApiVersion,
  JsonApiLinks,
  DrupalResource,
} from "./common.schema";
import { MediaImage } from "./media.schema";
import { File } from "./file.schema";

/**
 * Event date range (start + optional end)
 */
export const EventDateRange = S.Struct({
  value: S.String,
  end_value: S.optional(S.String),
});

/**
 * Event external link
 */
export const EventLink = S.Struct({
  uri: S.optional(S.String),
  title: S.optional(S.String),
});

/**
 * Event node attributes
 */
export class EventAttributes extends S.Class<EventAttributes>(
  "EventAttributes",
)({
  ...BaseDrupalNodeAttributes,
  field_daterange: S.optional(S.NullOr(EventDateRange)),
  field_event_link: S.optional(S.NullOr(EventLink)),
}) {}

/**
 * Event relationships
 *
 * Defines relationships to other entities:
 * - field_media_image: Event photo (can be resolved DrupalImage or reference)
 */
export class EventRelationships extends S.Class<EventRelationships>(
  "EventRelationships",
)({
  field_media_image: S.optional(
    S.Struct({
      data: S.optional(
        S.NullOr(
          S.Union(
            DrupalImage,
            S.Struct({
              type: S.Literal("media--image"),
              id: S.String,
            }),
          ),
        ),
      ),
    }),
  ),
}) {}

/**
 * Complete Event node
 */
export class Event extends S.Class<Event>("Event")({
  id: S.String,
  type: S.Literal("node--event"),
  attributes: EventAttributes,
  relationships: EventRelationships,
}) {}

/**
 * Array of events
 */
export const EventsArray = S.Array(Event);

/**
 * Discriminated union of all possible included resource types for events
 *
 * When fetching events with ?include=field_media_image.field_media_image
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the event image
 * - File: The actual image file with URL
 * - DrupalResource: Fallback for unknown/future types
 */
export const EventIncludedResource = S.Union(
  MediaImage,
  File,
  DrupalResource, // Fallback for unknown types
);

/**
 * Drupal JSON:API response for event collections
 */
export class EventsResponse extends S.Class<EventsResponse>("EventsResponse")({
  data: EventsArray,
  included: S.optional(S.Array(EventIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    }),
  ),
}) {}

/**
 * Drupal JSON:API response for single event
 */
export class EventResponse extends S.Class<EventResponse>("EventResponse")({
  data: Event,
  included: S.optional(S.Array(EventIncludedResource)),
  jsonapi: S.optional(JsonApiVersion),
  links: S.optional(JsonApiLinks),
}) {}
