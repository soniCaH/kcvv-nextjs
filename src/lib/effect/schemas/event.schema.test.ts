import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import {
  EventAttributes,
  EventRelationships,
  Event,
  EventIncludedResource,
  EventsResponse,
  EventResponse,
} from './event.schema'

describe('event.schema', () => {
  describe('EventAttributes', () => {
    it('should decode valid event attributes', () => {
      const input = {
        drupal_internal__nid: 42,
        drupal_internal__vid: 101,
        langcode: 'nl',
        revision_timestamp: '2024-01-15T10:30:00+00:00',
        status: true,
        title: 'Annual Club Dinner',
        created: '2024-01-15T10:30:00+00:00',
        changed: '2024-02-01T14:20:00+00:00',
        promote: false,
        sticky: false,
        path: {
          alias: '/events/annual-dinner',
          pid: 123,
          langcode: 'nl',
        },
        field_event_date: '2024-03-15T18:00:00+00:00',
        field_event_end_date: '2024-03-15T23:00:00+00:00',
        field_location: 'Club House',
        body: {
          value: '<p>Join us for our annual dinner</p>',
          format: 'full_html',
          processed: '<p>Join us for our annual dinner</p>',
          summary: 'Event details',
        },
      }

      const result = S.decodeUnknownSync(EventAttributes)(input)

      expect(result.title).toBe('Annual Club Dinner')
      expect(result.field_event_date).toBeInstanceOf(Date)
      expect(result.field_event_end_date).toBeInstanceOf(Date)
      expect(result.field_location).toBe('Club House')
      expect(result.body?.value).toBe('<p>Join us for our annual dinner</p>')
    })

    it('should decode event attributes with minimal fields', () => {
      const input = {
        title: 'Youth Training',
        created: '2024-01-15T10:30:00+00:00',
        path: {
          alias: '/events/youth-training',
        },
      }

      const result = S.decodeUnknownSync(EventAttributes)(input)

      expect(result.title).toBe('Youth Training')
      expect(result.field_event_date).toBeUndefined()
      expect(result.field_location).toBeUndefined()
    })
  })

  describe('EventRelationships', () => {
    it('should decode event relationships with resolved image', () => {
      const input = {
        field_image: {
          data: {
            uri: {
              url: 'https://example.com/images/event.jpg',
            },
            alt: 'Event photo',
            width: 1920,
            height: 1080,
          },
        },
      }

      const result = S.decodeUnknownSync(EventRelationships)(input)

      expect(result.field_image?.data).toBeDefined()
    })

    it('should decode event relationships with image reference', () => {
      const input = {
        field_image: {
          data: {
            type: 'media--image',
            id: 'media-123',
          },
        },
      }

      const result = S.decodeUnknownSync(EventRelationships)(input)

      expect(result.field_image?.data).toBeDefined()
    })

    it('should decode event relationships with empty data', () => {
      const input = {}

      const result = S.decodeUnknownSync(EventRelationships)(input)

      expect(result.field_image).toBeUndefined()
    })
  })

  describe('Event', () => {
    it('should decode complete event entity', () => {
      const input = {
        id: 'event-abc-123',
        type: 'node--event',
        attributes: {
          title: 'Summer Tournament',
          created: '2024-01-15T10:30:00+00:00',
          path: {
            alias: '/events/summer-tournament',
          },
          field_event_date: '2024-07-15T09:00:00+00:00',
          field_location: 'Main Stadium',
        },
        relationships: {
          field_image: {
            data: {
              uri: {
                url: 'https://example.com/images/tournament.jpg',
              },
              alt: 'Summer tournament',
            },
          },
        },
      }

      const result = S.decodeUnknownSync(Event)(input)

      expect(result.id).toBe('event-abc-123')
      expect(result.type).toBe('node--event')
      expect(result.attributes.title).toBe('Summer Tournament')
      expect(result.attributes.field_location).toBe('Main Stadium')
    })

    it('should reject invalid event type', () => {
      const input = {
        id: 'event-abc-123',
        type: 'node--article', // Invalid type
        attributes: {
          title: 'Summer Tournament',
          created: '2024-01-15T10:30:00+00:00',
          path: { alias: '/events/tournament' },
        },
        relationships: {},
      }

      expect(() => S.decodeUnknownSync(Event)(input)).toThrow()
    })
  })

  describe('EventIncludedResource', () => {
    it('should decode media--image included resource', () => {
      const input = {
        id: 'media-123',
        type: 'media--image',
        attributes: {
          name: 'Event photo',
          status: true,
        },
        relationships: {
          field_media_image: {
            data: {
              id: 'file-456',
              type: 'file--file',
            },
          },
        },
      }

      const result = S.decodeUnknownSync(EventIncludedResource)(input)

      expect(result.type).toBe('media--image')
      expect(result.id).toBe('media-123')
    })

    it('should decode file--file included resource', () => {
      const input = {
        id: 'file-456',
        type: 'file--file',
        attributes: {
          filename: 'event.jpg',
          uri: {
            url: 'https://example.com/files/event.jpg',
          },
          filemime: 'image/jpeg',
          filesize: 204800,
        },
      }

      const result = S.decodeUnknownSync(EventIncludedResource)(input)

      expect(result.type).toBe('file--file')
      expect(result.id).toBe('file-456')
    })

    it('should decode unknown resource type as DrupalResource', () => {
      const input = {
        id: 'unknown-123',
        type: 'node--unknown',
        attributes: {
          title: 'Unknown',
        },
      }

      const result = S.decodeUnknownSync(EventIncludedResource)(input)

      expect(result.type).toBe('node--unknown')
      expect(result.id).toBe('unknown-123')
    })
  })

  describe('EventsResponse', () => {
    it('should decode complete events response', () => {
      const input = {
        data: [
          {
            id: 'event-1',
            type: 'node--event',
            attributes: {
              title: 'Club Meeting',
              created: '2024-01-15T10:30:00+00:00',
              path: { alias: '/events/meeting' },
              field_event_date: '2024-02-20T19:00:00+00:00',
            },
            relationships: {},
          },
          {
            id: 'event-2',
            type: 'node--event',
            attributes: {
              title: 'Training Camp',
              created: '2024-01-16T11:00:00+00:00',
              path: { alias: '/events/training' },
              field_event_date: '2024-03-10T08:00:00+00:00',
            },
            relationships: {},
          },
        ],
        included: [
          {
            id: 'media-123',
            type: 'media--image',
            attributes: {
              name: 'Event photo',
            },
          },
        ],
        jsonapi: {
          version: '1.0',
        },
        links: {
          self: {
            href: 'https://example.com/jsonapi/node/event',
          },
          next: {
            href: 'https://example.com/jsonapi/node/event?page[offset]=10',
          },
        },
        meta: {
          count: '15',
        },
      }

      const result = S.decodeUnknownSync(EventsResponse)(input)

      expect(result.data).toHaveLength(2)
      expect(result.data[0].attributes.title).toBe('Club Meeting')
      expect(result.data[1].attributes.title).toBe('Training Camp')
      expect(result.included).toHaveLength(1)
      expect(result.jsonapi?.version).toBe('1.0')
      expect(result.links?.self?.href).toBe('https://example.com/jsonapi/node/event')
      expect(result.meta?.count).toBe(15)
    })

    it('should decode events response with minimal fields', () => {
      const input = {
        data: [
          {
            id: 'event-1',
            type: 'node--event',
            attributes: {
              title: 'Event',
              created: '2024-01-15T10:30:00+00:00',
              path: { alias: '/events/test' },
            },
            relationships: {},
          },
        ],
      }

      const result = S.decodeUnknownSync(EventsResponse)(input)

      expect(result.data).toHaveLength(1)
      expect(result.included).toBeUndefined()
      expect(result.jsonapi).toBeUndefined()
      expect(result.links).toBeUndefined()
    })
  })

  describe('EventResponse', () => {
    it('should decode single event response', () => {
      const input = {
        data: {
          id: 'event-abc-123',
          type: 'node--event',
          attributes: {
            title: 'Championship Final',
            created: '2024-01-15T10:30:00+00:00',
            path: { alias: '/events/championship-final' },
            field_event_date: '2024-06-01T15:00:00+00:00',
            field_event_end_date: '2024-06-01T17:00:00+00:00',
            field_location: 'National Stadium',
          },
          relationships: {
            field_image: {
              data: {
                type: 'media--image',
                id: 'media-789',
              },
            },
          },
        },
        included: [
          {
            id: 'media-789',
            type: 'media--image',
            attributes: {
              name: 'Championship photo',
            },
            relationships: {
              field_media_image: {
                data: {
                  id: 'file-999',
                  type: 'file--file',
                },
              },
            },
          },
          {
            id: 'file-999',
            type: 'file--file',
            attributes: {
              uri: {
                url: 'https://example.com/files/championship.jpg',
              },
              filename: 'championship.jpg',
            },
          },
        ],
        jsonapi: {
          version: '1.0',
        },
        links: {
          self: {
            href: 'https://example.com/jsonapi/node/event/event-abc-123',
          },
        },
      }

      const result = S.decodeUnknownSync(EventResponse)(input)

      expect(result.data.id).toBe('event-abc-123')
      expect(result.data.attributes.title).toBe('Championship Final')
      expect(result.data.attributes.field_location).toBe('National Stadium')
      expect(result.included).toHaveLength(2)
      expect(result.jsonapi?.version).toBe('1.0')
    })
  })
})
