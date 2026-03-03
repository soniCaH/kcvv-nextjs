/**
 * Drupal Decoupled Router Schema
 *
 * Schema for the Decoupled Router module response.
 * Used to resolve path aliases to entity UUIDs for fast lookups.
 *
 * @see https://www.drupal.org/project/decoupled_router
 */

import { Schema as S } from "effect";

/**
 * Router redirect entry
 *
 * Present when the queried path differs from the canonical path.
 * For example, querying /team/u15 when the canonical path is /jeugd/u15.
 */
export const RouterRedirect = S.Struct({
  from: S.String,
  to: S.String,
  status: S.String,
});

/**
 * Router entity information
 *
 * Contains the resolved entity details including UUID for fetching.
 */
export const RouterEntity = S.Struct({
  canonical: S.String,
  type: S.String,
  bundle: S.String,
  id: S.String,
  uuid: S.String,
});

/**
 * Router JSON:API information
 *
 * Contains endpoints for fetching the entity via JSON:API.
 */
export const RouterJsonApi = S.Struct({
  individual: S.String,
  resourceName: S.String,
  pathPrefix: S.optional(S.String),
  basePath: S.String,
  entryPoint: S.String,
});

/**
 * Decoupled Router Response
 *
 * The router always returns entity info when the path resolves to content.
 * It may also include a `redirect` array if the queried path differs from
 * the canonical path (e.g., /team/u7 resolves to the same entity as /jeugd/u7).
 *
 * @example
 * ```typescript
 * // Query: /team/u15
 * // Response includes entity info AND redirect to canonical /jeugd/u15
 * const response = {
 *   resolved: "http://api.kcvvelewijt.be/jeugd/u15",
 *   isHomePath: false,
 *   entity: { uuid: "abc-123", type: "node", bundle: "team", ... },
 *   redirect: [{ from: "/team/u15", to: "/jeugd/u15", status: "301" }]
 * }
 * ```
 */
export const RouterResponse = S.Struct({
  resolved: S.String,
  isHomePath: S.Boolean,
  entity: RouterEntity,
  label: S.String,
  jsonapi: RouterJsonApi,
  // Optional redirect info - present when queried path differs from canonical
  redirect: S.optional(S.Array(RouterRedirect)),
});

export type RouterResponse = S.Schema.Type<typeof RouterResponse>;
export type RouterEntity = S.Schema.Type<typeof RouterEntity>;
