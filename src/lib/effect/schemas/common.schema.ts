/**
 * Common Drupal JSON:API Schema Types
 * Used across multiple content types
 */

import { Schema as S } from 'effect'

/**
 * Drupal JSON:API Image field structure
 */
export class DrupalImage extends S.Class<DrupalImage>('DrupalImage')({
  uri: S.Struct({
    url: S.String,
  }),
  alt: S.optional(S.String),
  title: S.optional(S.String),
  width: S.optional(S.Number),
  height: S.optional(S.Number),
}) {}

/**
 * Drupal path alias structure
 */
export class DrupalPath extends S.Class<DrupalPath>('DrupalPath')({
  alias: S.String,
  pid: S.optional(S.Number),
  langcode: S.optional(S.String),
}) {}

/**
 * Drupal body/text field with processed HTML
 */
export class DrupalBody extends S.Class<DrupalBody>('DrupalBody')({
  value: S.String,
  format: S.optional(S.String),
  processed: S.String,
  summary: S.optional(S.String),
}) {}

/**
 * Drupal taxonomy term reference
 */
export class DrupalTermReference extends S.Class<DrupalTermReference>('DrupalTermReference')({
  id: S.String,
  type: S.String,
}) {}

/**
 * Drupal node reference
 */
export class DrupalNodeReference extends S.Class<DrupalNodeReference>('DrupalNodeReference')({
  id: S.String,
  type: S.String,
}) {}

/**
 * Base attributes shared by all Drupal nodes
 */
export const BaseDrupalNodeAttributes = {
  drupal_internal__nid: S.optional(S.Number),
  drupal_internal__vid: S.optional(S.Number),
  langcode: S.optional(S.String),
  revision_timestamp: S.optional(S.DateFromString),
  status: S.optional(S.Boolean),
  title: S.String,
  created: S.DateFromString,
  changed: S.optional(S.DateFromString),
  promote: S.optional(S.Boolean),
  sticky: S.optional(S.Boolean),
  path: DrupalPath,
}

/**
 * JSON:API version object
 * Part of the JSON:API specification metadata
 * @see https://jsonapi.org/format/#document-jsonapi-object
 */
export class JsonApiVersion extends S.Class<JsonApiVersion>('JsonApiVersion')({
  version: S.String,
  meta: S.optional(S.Unknown), // Vendor-specific extensions
}) {}

/**
 * JSON:API link object
 * Individual link with href and optional metadata
 */
export class JsonApiLink extends S.Class<JsonApiLink>('JsonApiLink')({
  href: S.String,
  meta: S.optional(S.Unknown),
}) {}

/**
 * JSON:API links object
 * Pagination and self links for collections
 * @see https://jsonapi.org/format/#document-links
 */
export class JsonApiLinks extends S.Class<JsonApiLinks>('JsonApiLinks')({
  self: S.optional(JsonApiLink),
  next: S.optional(JsonApiLink),
  prev: S.optional(JsonApiLink),
  first: S.optional(JsonApiLink),
  last: S.optional(JsonApiLink),
}) {}

/**
 * Base JSON:API resource
 * Fallback type for resources that don't have a specific schema
 * Used in discriminated unions when the exact type isn't known
 */
export class DrupalResource extends S.Class<DrupalResource>('DrupalResource')({
  id: S.String,
  type: S.String,
  attributes: S.optional(S.Unknown), // Attributes vary by resource type
  relationships: S.optional(S.Unknown), // Relationships vary by resource type
  links: S.optional(S.Unknown),
}) {}
