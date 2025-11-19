/**
 * Effect Runtime Configuration
 * Provides managed runtime for running Effects in Next.js
 */

import { Effect, Layer, ManagedRuntime } from 'effect'
import { DrupalService, DrupalServiceLive } from './services/DrupalService'
import { FootbalistoService, FootbalistoServiceLive } from './services/FootbalistoService'

/**
 * Combined application layer with all services
 */
export const AppLayer = Layer.mergeAll(DrupalServiceLive, FootbalistoServiceLive)

/**
 * Managed runtime instance
 * Handles setup and teardown of all services
 */
export const runtime = ManagedRuntime.make(AppLayer)

/**
 * Run an Effect and return a Promise
 * Use this in Next.js Server Components and API routes
 *
 * @example
 * ```ts
 * const articles = await runPromise(
 *   Effect.gen(function* () {
 *     const drupal = yield* DrupalService
 *     return yield* drupal.getArticles({ limit: 10 })
 *   })
 * )
 * ```
 */
export const runPromise = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  runtime.runPromise(effect)

/**
 * Run an Effect and return a Promise, logging errors
 * Useful for debugging in development
 */
export const runPromiseWithLogging = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  runtime.runPromise(
    effect.pipe(
      Effect.tapError((error) =>
        Effect.sync(() => {
          console.error('[Effect Error]', error)
        })
      )
    )
  )

/**
 * Provide services to an Effect
 * Use when you want to manually control the service layer
 *
 * @example
 * ```ts
 * const effect = Effect.gen(function* () {
 *   const drupal = yield* DrupalService
 *   return yield* drupal.getArticles()
 * })
 *
 * const result = await runPromise(provideServices(effect))
 * ```
 */
export const provideServices = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.provide(effect, AppLayer)

/**
 * Export services for use in code
 */
export { DrupalService, FootbalistoService }
