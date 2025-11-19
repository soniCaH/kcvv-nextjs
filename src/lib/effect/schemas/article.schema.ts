/**
 * Drupal Article (node--article) Schema
 * News articles and blog posts
 */

import { Schema as S } from 'effect'
import { BaseDrupalNodeAttributes, DrupalImage, DrupalBody, DrupalTermReference } from './common.schema'

/**
 * Article node attributes
 */
export class ArticleAttributes extends S.Class<ArticleAttributes>('ArticleAttributes')({
  ...BaseDrupalNodeAttributes,
  body: S.optional(DrupalBody),
}) {}

/**
 * Article relationships
 */
export class ArticleRelationships extends S.Class<ArticleRelationships>('ArticleRelationships')({
  field_image: S.optional(
    S.Struct({
      data: S.optional(DrupalImage),
    })
  ),
  field_category: S.optional(
    S.Struct({
      data: S.Array(DrupalTermReference),
    })
  ),
  uid: S.optional(
    S.Struct({
      data: S.optional(
        S.Struct({
          id: S.String,
          type: S.Literal('user--user'),
        })
      ),
    })
  ),
}) {}

/**
 * Complete Article node
 */
export class Article extends S.Class<Article>('Article')({
  id: S.String,
  type: S.Literal('node--article'),
  attributes: ArticleAttributes,
  relationships: ArticleRelationships,
}) {}

/**
 * Array of articles
 */
export const ArticlesArray = S.Array(Article)

/**
 * Drupal JSON:API response for articles
 */
export class ArticlesResponse extends S.Class<ArticlesResponse>('ArticlesResponse')({
  data: ArticlesArray,
  links: S.optional(
    S.Struct({
      self: S.optional(S.Struct({ href: S.String })),
      next: S.optional(S.Struct({ href: S.String })),
      prev: S.optional(S.Struct({ href: S.String })),
      first: S.optional(S.Struct({ href: S.String })),
      last: S.optional(S.Struct({ href: S.String })),
    })
  ),
  meta: S.optional(
    S.Struct({
      count: S.optional(S.Number),
    })
  ),
}) {}

/**
 * Single article response
 */
export class ArticleResponse extends S.Class<ArticleResponse>('ArticleResponse')({
  data: Article,
}) {}
