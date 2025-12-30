/**
 * Drupal Article (node--article) Schema
 *
 * News articles and blog posts from the Drupal CMS.
 *
 * Article entities include:
 * - Title, body text, publication dates
 * - Featured image (via media--image entity)
 * - Tags for categorization
 * - Author reference
 * - Related content references
 *
 * When fetched from JSON:API with include parameters, related entities
 * appear in the "included" array and can be resolved to get full data.
 */

import { Schema as S } from "effect";
import {
  BaseDrupalNodeAttributes,
  DateFromStringOrDate,
  DrupalImage,
  DrupalBody,
  DrupalTermReference,
  DrupalNodeReference,
  DrupalResource,
  JsonApiVersion,
  JsonApiLinks,
} from "./common.schema";
import { MediaImage } from "./media.schema";
import { File } from "./file.schema";
import { TaxonomyTerm } from "./taxonomy.schema";

/**
 * Article node attributes
 */
export class ArticleAttributes extends S.Class<ArticleAttributes>(
  "ArticleAttributes",
)({
  ...BaseDrupalNodeAttributes,
  body: S.optional(DrupalBody),
  publish_on: S.optional(S.NullOr(DateFromStringOrDate)),
  unpublish_on: S.optional(S.NullOr(DateFromStringOrDate)),
  field_featured: S.optional(S.Boolean),
}) {}

/**
 * Article relationships
 *
 * Defines relationships to other entities:
 * - field_media_article_image: Featured image (can be resolved DrupalImage or reference)
 * - field_tags: Taxonomy terms for categorization
 * - uid: Author user reference
 * - field_related_content: Related articles/content
 * - node_type: Drupal internal bundle reference
 * - revision_uid: User who created this revision
 */
export class ArticleRelationships extends S.Class<ArticleRelationships>(
  "ArticleRelationships",
)({
  /**
   * Featured article image
   * Can be either:
   * - DrupalImage: Fully resolved with uri.url (after mapIncluded processing)
   * - Reference: Just type/id that needs to be resolved from included
   */
  field_media_article_image: S.optional(
    S.Struct({
      data: S.optional(
        S.Union(
          DrupalImage,
          S.Struct({
            type: S.Literal("media--image"),
            id: S.String,
          }),
        ),
      ),
    }),
  ),

  /**
   * Article tags (taxonomy terms)
   * Array of term references that can be resolved from included
   */
  field_tags: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Array(
          S.Union(
            TaxonomyTerm, // Fully resolved term
            DrupalTermReference, // Just a reference
          ),
        ),
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    }),
  ),

  /**
   * Article author (user entity)
   */
  uid: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal("user--user"),
        }),
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    }),
  ),

  /**
   * Related articles/content
   * Array of node references
   */
  field_related_content: S.optional(
    S.Struct({
      data: S.Array(DrupalNodeReference),
      links: S.optional(S.Unknown),
    }),
  ),

  /**
   * Drupal internal node type reference
   * Points to node_type--node_type bundle config
   */
  node_type: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal("node_type--node_type"),
        }),
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    }),
  ),

  /**
   * User who created this revision
   */
  revision_uid: S.optional(
    S.Struct({
      data: S.NullOr(
        S.Struct({
          id: S.String,
          type: S.Literal("user--user"),
        }),
      ),
      links: S.optional(S.Unknown), // Drupal includes links even when data is null
    }),
  ),
}) {}

/**
 * Complete Article node
 */
export class Article extends S.Class<Article>("Article")({
  id: S.String,
  type: S.Literal("node--article"),
  attributes: ArticleAttributes,
  relationships: ArticleRelationships,
}) {}

/**
 * Array of articles
 */
export const ArticlesArray = S.Array(Article);

/**
 * Discriminated union of all possible included resource types for articles
 *
 * When fetching articles with ?include=field_media_article_image.field_media_image,field_tags
 * the response includes various entity types in the "included" array:
 * - MediaImage: Media entity wrapping the image
 * - File: The actual image file with URL
 * - TaxonomyTerm: Tag terms
 * - DrupalResource: Fallback for unknown/future types
 *
 * This union provides full type safety and runtime validation for included entities.
 *
 * @example
 * ```typescript
 * const included: ArticleIncludedResource[] = response.included || []
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
export const ArticleIncludedResource = S.Union(
  MediaImage,
  File,
  TaxonomyTerm,
  DrupalResource, // Fallback for unknown types
);

/**
 * Drupal JSON:API response for article collections
 *
 * Standard JSON:API response structure with:
 * - data: Array of article entities
 * - included: Related entities (media, files, terms)
 * - links: Pagination links
 * - meta: Response metadata (count, etc.)
 * - jsonapi: JSON:API version info
 *
 * @example
 * ```typescript
 * const response: ArticlesResponse = await fetch('/jsonapi/node/article')
 * const articles = response.data  // Article[]
 * const links = response.links     // JsonApiLinks
 * ```
 */
export class ArticlesResponse extends S.Class<ArticlesResponse>(
  "ArticlesResponse",
)({
  data: ArticlesArray,
  included: S.optional(S.Array(ArticleIncludedResource)), // ✅ Strongly typed
  jsonapi: S.optional(JsonApiVersion), // ✅ Strongly typed
  links: S.optional(JsonApiLinks), // ✅ Strongly typed
  meta: S.optional(
    S.Struct({
      count: S.optional(S.NumberFromString),
    }),
  ),
}) {}

/**
 * Drupal JSON:API response for single article
 *
 * Similar to ArticlesResponse but data is a single Article instead of array.
 * Used when fetching by slug/ID.
 *
 * @example
 * ```typescript
 * const response: ArticleResponse = await fetch('/jsonapi/node/article/abc-123')
 * const article = response.data  // Article (not array)
 * ```
 */
export class ArticleResponse extends S.Class<ArticleResponse>(
  "ArticleResponse",
)({
  data: Article,
  included: S.optional(S.Array(ArticleIncludedResource)), // ✅ Strongly typed
  jsonapi: S.optional(JsonApiVersion), // ✅ Strongly typed
  links: S.optional(JsonApiLinks), // ✅ Strongly typed
}) {}
