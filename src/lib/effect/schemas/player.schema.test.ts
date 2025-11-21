import { describe, it, expect } from 'vitest'
import { Schema as S } from 'effect'
import {
  PlayerAttributes,
  PlayerRelationships,
  Player,
  PlayerIncludedResource,
  PlayersResponse,
  PlayerResponse,
} from './player.schema'

describe('player.schema', () => {
  describe('PlayerAttributes', () => {
    it('should decode valid player attributes', () => {
      const input = {
        drupal_internal__nid: 42,
        drupal_internal__vid: 101,
        langcode: 'nl',
        revision_timestamp: '2024-01-15T10:30:00+00:00',
        status: true,
        title: 'John Doe',
        created: '2024-01-15T10:30:00+00:00',
        changed: '2024-02-01T14:20:00+00:00',
        promote: false,
        sticky: false,
        path: {
          alias: '/player/john-doe',
          pid: 123,
          langcode: 'nl',
        },
        field_first_name: 'John',
        field_last_name: 'Doe',
        field_position: 'Midfielder',
        field_number: 10,
        field_birth_date: '2005-05-15T00:00:00+00:00',
        field_nationality: 'Belgian',
        field_height: 175,
        field_weight: 70,
        body: {
          value: '<p>Talented midfielder</p>',
          format: 'full_html',
          processed: '<p>Talented midfielder</p>',
          summary: 'Player bio',
        },
      }

      const result = S.decodeUnknownSync(PlayerAttributes)(input)

      expect(result.title).toBe('John Doe')
      expect(result.field_first_name).toBe('John')
      expect(result.field_last_name).toBe('Doe')
      expect(result.field_position).toBe('Midfielder')
      expect(result.field_number).toBe(10)
      expect(result.field_nationality).toBe('Belgian')
      expect(result.field_height).toBe(175)
      expect(result.field_weight).toBe(70)
      expect(result.body?.value).toBe('<p>Talented midfielder</p>')
    })

    it('should decode player attributes with minimal fields', () => {
      const input = {
        title: 'Jane Smith',
        created: '2024-01-15T10:30:00+00:00',
        path: {
          alias: '/player/jane-smith',
        },
      }

      const result = S.decodeUnknownSync(PlayerAttributes)(input)

      expect(result.title).toBe('Jane Smith')
      expect(result.field_first_name).toBeUndefined()
      expect(result.field_number).toBeUndefined()
    })
  })

  describe('PlayerRelationships', () => {
    it('should decode player relationships with resolved image', () => {
      const input = {
        field_image: {
          data: {
            uri: {
              url: 'https://example.com/images/player.jpg',
            },
            alt: 'Player photo',
            width: 800,
            height: 1000,
          },
        },
        field_team: {
          data: {
            id: 'team-1',
            type: 'node--team',
            attributes: {
              title: 'First Team',
              created: '2024-01-01T00:00:00+00:00',
              path: { alias: '/team/first' },
              field_team_id: 1,
            },
            relationships: {},
          },
        },
      }

      const result = S.decodeUnknownSync(PlayerRelationships)(input)

      expect(result.field_image?.data).toBeDefined()
      expect(result.field_team?.data).toBeDefined()
    })

    it('should decode player relationships with image and team references', () => {
      const input = {
        field_image: {
          data: {
            type: 'media--image',
            id: 'media-123',
          },
        },
        field_team: {
          data: {
            type: 'node--team',
            id: 'team-456',
          },
        },
      }

      const result = S.decodeUnknownSync(PlayerRelationships)(input)

      expect(result.field_image?.data).toBeDefined()
      expect(result.field_team?.data).toBeDefined()
    })

    it('should decode player relationships with empty data', () => {
      const input = {}

      const result = S.decodeUnknownSync(PlayerRelationships)(input)

      expect(result.field_image).toBeUndefined()
      expect(result.field_team).toBeUndefined()
    })
  })

  describe('Player', () => {
    it('should decode complete player entity', () => {
      const input = {
        id: 'player-abc-123',
        type: 'node--player',
        attributes: {
          title: 'Marc Janssens',
          created: '2024-01-15T10:30:00+00:00',
          path: {
            alias: '/player/marc-janssens',
          },
          field_first_name: 'Marc',
          field_last_name: 'Janssens',
          field_position: 'Striker',
          field_number: 9,
        },
        relationships: {
          field_image: {
            data: {
              uri: {
                url: 'https://example.com/images/marc.jpg',
              },
              alt: 'Marc Janssens',
            },
          },
        },
      }

      const result = S.decodeUnknownSync(Player)(input)

      expect(result.id).toBe('player-abc-123')
      expect(result.type).toBe('node--player')
      expect(result.attributes.title).toBe('Marc Janssens')
      expect(result.attributes.field_position).toBe('Striker')
      expect(result.attributes.field_number).toBe(9)
    })

    it('should reject invalid player type', () => {
      const input = {
        id: 'player-abc-123',
        type: 'node--article', // Invalid type
        attributes: {
          title: 'Marc Janssens',
          created: '2024-01-15T10:30:00+00:00',
          path: { alias: '/player/marc' },
        },
        relationships: {},
      }

      expect(() => S.decodeUnknownSync(Player)(input)).toThrow()
    })
  })

  describe('PlayerIncludedResource', () => {
    it('should decode media--image included resource', () => {
      const input = {
        id: 'media-123',
        type: 'media--image',
        attributes: {
          name: 'Player photo',
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

      const result = S.decodeUnknownSync(PlayerIncludedResource)(input)

      expect(result.type).toBe('media--image')
      expect(result.id).toBe('media-123')
    })

    it('should decode file--file included resource', () => {
      const input = {
        id: 'file-456',
        type: 'file--file',
        attributes: {
          filename: 'player.jpg',
          uri: {
            url: 'https://example.com/files/player.jpg',
          },
          filemime: 'image/jpeg',
          filesize: 51200,
        },
      }

      const result = S.decodeUnknownSync(PlayerIncludedResource)(input)

      expect(result.type).toBe('file--file')
      expect(result.id).toBe('file-456')
    })

    it('should decode node--team included resource', () => {
      const input = {
        id: 'team-789',
        type: 'node--team',
        attributes: {
          title: 'U17 Team',
          created: '2024-01-01T00:00:00+00:00',
          path: { alias: '/team/u17' },
          field_team_id: 17,
        },
        relationships: {},
      }

      const result = S.decodeUnknownSync(PlayerIncludedResource)(input)

      expect(result.type).toBe('node--team')
      expect(result.id).toBe('team-789')
    })

    it('should decode unknown resource type as DrupalResource', () => {
      const input = {
        id: 'unknown-123',
        type: 'node--unknown',
        attributes: {
          title: 'Unknown',
        },
      }

      const result = S.decodeUnknownSync(PlayerIncludedResource)(input)

      expect(result.type).toBe('node--unknown')
      expect(result.id).toBe('unknown-123')
    })
  })

  describe('PlayersResponse', () => {
    it('should decode complete players response', () => {
      const input = {
        data: [
          {
            id: 'player-1',
            type: 'node--player',
            attributes: {
              title: 'Player One',
              created: '2024-01-15T10:30:00+00:00',
              path: { alias: '/player/one' },
              field_number: 1,
            },
            relationships: {},
          },
          {
            id: 'player-2',
            type: 'node--player',
            attributes: {
              title: 'Player Two',
              created: '2024-01-16T11:00:00+00:00',
              path: { alias: '/player/two' },
              field_number: 2,
            },
            relationships: {},
          },
        ],
        included: [
          {
            id: 'media-123',
            type: 'media--image',
            attributes: {
              name: 'Player photo',
            },
          },
          {
            id: 'team-456',
            type: 'node--team',
            attributes: {
              title: 'First Team',
              created: '2024-01-01T00:00:00+00:00',
              path: { alias: '/team/first' },
              field_team_id: 1,
            },
            relationships: {},
          },
        ],
        jsonapi: {
          version: '1.0',
        },
        links: {
          self: {
            href: 'https://example.com/jsonapi/node/player',
          },
          next: {
            href: 'https://example.com/jsonapi/node/player?page[offset]=10',
          },
        },
        meta: {
          count: '50',
        },
      }

      const result = S.decodeUnknownSync(PlayersResponse)(input)

      expect(result.data).toHaveLength(2)
      expect(result.data[0].attributes.title).toBe('Player One')
      expect(result.data[1].attributes.title).toBe('Player Two')
      expect(result.included).toHaveLength(2)
      expect(result.jsonapi?.version).toBe('1.0')
      expect(result.links?.self?.href).toBe('https://example.com/jsonapi/node/player')
      expect(result.meta?.count).toBe(50)
    })

    it('should decode players response with minimal fields', () => {
      const input = {
        data: [
          {
            id: 'player-1',
            type: 'node--player',
            attributes: {
              title: 'Player',
              created: '2024-01-15T10:30:00+00:00',
              path: { alias: '/player/test' },
            },
            relationships: {},
          },
        ],
      }

      const result = S.decodeUnknownSync(PlayersResponse)(input)

      expect(result.data).toHaveLength(1)
      expect(result.included).toBeUndefined()
      expect(result.jsonapi).toBeUndefined()
      expect(result.links).toBeUndefined()
    })
  })

  describe('PlayerResponse', () => {
    it('should decode single player response', () => {
      const input = {
        data: {
          id: 'player-abc-123',
          type: 'node--player',
          attributes: {
            title: 'Kevin De Bruyne',
            created: '2024-01-15T10:30:00+00:00',
            path: { alias: '/player/kevin-de-bruyne' },
            field_first_name: 'Kevin',
            field_last_name: 'De Bruyne',
            field_position: 'Midfielder',
            field_number: 17,
            field_nationality: 'Belgian',
          },
          relationships: {
            field_image: {
              data: {
                type: 'media--image',
                id: 'media-789',
              },
            },
            field_team: {
              data: {
                type: 'node--team',
                id: 'team-999',
              },
            },
          },
        },
        included: [
          {
            id: 'media-789',
            type: 'media--image',
            attributes: {
              name: 'Kevin photo',
            },
            relationships: {
              field_media_image: {
                data: {
                  id: 'file-111',
                  type: 'file--file',
                },
              },
            },
          },
          {
            id: 'file-111',
            type: 'file--file',
            attributes: {
              uri: {
                url: 'https://example.com/files/kevin.jpg',
              },
              filename: 'kevin.jpg',
            },
          },
          {
            id: 'team-999',
            type: 'node--team',
            attributes: {
              title: 'First Team',
              created: '2024-01-01T00:00:00+00:00',
              path: { alias: '/team/first' },
              field_team_id: 1,
            },
            relationships: {},
          },
        ],
        jsonapi: {
          version: '1.0',
        },
        links: {
          self: {
            href: 'https://example.com/jsonapi/node/player/player-abc-123',
          },
        },
      }

      const result = S.decodeUnknownSync(PlayerResponse)(input)

      expect(result.data.id).toBe('player-abc-123')
      expect(result.data.attributes.title).toBe('Kevin De Bruyne')
      expect(result.data.attributes.field_position).toBe('Midfielder')
      expect(result.data.attributes.field_number).toBe(17)
      expect(result.included).toHaveLength(3)
      expect(result.jsonapi?.version).toBe('1.0')
    })
  })
})
