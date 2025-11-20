/**
 * Drupal Taxonomy Term Schemas
 *
 * Taxonomy terms are used for categorization and tagging in Drupal.
 * Common vocabularies include:
 * - taxonomy_term--tags: Article tags
 * - taxonomy_term--categories: Content categories
 * - taxonomy_term--regions: Geographic regions
 *
 * Terms can have hierarchical relationships (parent/child) and be used
 * for filtering, organizing, and navigating content.
 *
 * In JSON:API, taxonomy terms appear in relationships and can be included
 * in the response to get full term data (name, description, etc.)
 *
 * @see https://www.drupal.org/docs/8/core/modules/taxonomy
 */

import { Schema as S } from 'effect'
import { DrupalPath } from './common.schema'

/**
 * Taxonomy term attributes
 *
 * Contains the term's name, description, weight (for sorting),
 * and other metadata.
 *
 * @example
 * ```typescript
 * {
 *   drupal_internal__tid: 5,
 *   name: "Eerste Elftal",
 *   description: "News and updates about the first team",
 *   weight: 0,
 *   path: { alias: "/tags/eerste-elftal" }
 * }
 * ```
 */
export class TaxonomyTermAttributes extends S.Class<TaxonomyTermAttributes>('TaxonomyTermAttributes')({
  /**
   * Internal Drupal taxonomy term ID
   */
  drupal_internal__tid: S.optional(S.Number),

  /**
   * Revision ID for this term
   */
  drupal_internal__revision_id: S.optional(S.Number),

  /**
   * Language code (e.g., 'nl', 'en')
   */
  langcode: S.optional(S.String),

  /**
   * Term name/label
   * This is the human-readable term name displayed to users
   */
  name: S.String,

  /**
   * Term description (optional, can be rich text)
   * Drupal may return null values for empty descriptions
   */
  description: S.optional(
    S.Struct({
      value: S.optional(S.NullOr(S.String)),
      format: S.optional(S.NullOr(S.String)),
      processed: S.optional(S.NullOr(S.String)),
    })
  ),

  /**
   * Term weight for sorting
   * Lower weights appear first in lists
   */
  weight: S.optional(S.Number),

  /**
   * Publication status (true = published)
   */
  status: S.optional(S.Boolean),

  /**
   * Creation timestamp
   */
  created: S.optional(S.DateFromString),

  /**
   * Last changed timestamp
   */
  changed: S.optional(S.DateFromString),

  /**
   * Whether the term is the default term in its vocabulary
   */
  default_langcode: S.optional(S.Boolean),

  /**
   * Path alias for this term
   */
  path: S.optional(DrupalPath),
}) {}

/**
 * Taxonomy term relationships
 *
 * Terms can have parent/child relationships within their vocabulary.
 * They can also be related to the vocabulary (bundle) they belong to.
 */
export class TaxonomyTermRelationships extends S.Class<TaxonomyTermRelationships>('TaxonomyTermRelationships')({
  /**
   * Parent term(s) in the vocabulary hierarchy
   * A term can have multiple parents
   */
  parent: S.optional(
    S.Struct({
      data: S.Array(
        S.Struct({
          id: S.String,
          type: S.String, // Usually matches the term's own type
        })
      ),
    })
  ),

  /**
   * Vocabulary/bundle this term belongs to
   */
  vid: S.optional(S.Unknown),
}) {}

/**
 * Complete Taxonomy Term entity
 *
 * Represents a taxonomy term as it appears in JSON:API included section.
 * The type field is dynamic based on the vocabulary (e.g., "taxonomy_term--tags").
 *
 * Common term types in KCVV:
 * - taxonomy_term--tags: Article tags
 * - taxonomy_term--categories: Content categories
 *
 * @example
 * ```typescript
 * // From JSON:API response
 * const term: TaxonomyTerm = {
 *   id: "abc-123",
 *   type: "taxonomy_term--tags",
 *   attributes: {
 *     name: "Eerste Elftal",
 *     weight: 0,
 *     status: true
 *   },
 *   relationships: {
 *     parent: {
 *       data: []  // Top-level term (no parents)
 *     }
 *   }
 * }
 *
 * // Use the term name
 * const tagName = term.attributes.name  // "Eerste Elftal"
 * ```
 */
export class TaxonomyTerm extends S.Class<TaxonomyTerm>('TaxonomyTerm')({
  id: S.String,
  /**
   * Type is dynamic: taxonomy_term--{vocabulary}
   * We use S.String to support any vocabulary
   * Common values: "taxonomy_term--tags", "taxonomy_term--categories"
   */
  type: S.String,
  attributes: TaxonomyTermAttributes,
  relationships: S.optional(TaxonomyTermRelationships),
  links: S.optional(S.Unknown),
}) {}
