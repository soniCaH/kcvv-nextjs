/**
 * PSD gate — Effect service over the global {@link GateLogic}.
 *
 * The live layer talks to the `PsdGate` Durable Object (one global instance, see
 * gate-do.ts) so the token bucket and single-flight registry are shared across
 * every worker isolate. The DO class itself lives in a separate module because
 * it imports `cloudflare:workers`, which the Node test env can't resolve — this
 * file must stay importable by the unit tests, so it only references the stub
 * structurally.
 *
 * The gate is **best-effort**: if the DO is unreachable, every operation
 * degrades to "no coordination" (proceed without a token, act as leader) so a
 * gate hiccup never breaks the read path — the KV negative marker + SWR still
 * bound the storm.
 */
import { Context, Effect, Layer } from "effect";
import { WorkerEnvTag } from "../env";
import { GateLogic } from "./gate-logic";

export interface PsdGate {
  /** Await a global PSD-call token (≤5/s worldwide). Best-effort: proceeds on gate failure. */
  readonly acquireToken: Effect.Effect<void>;
  /** Become the single-flight leader for `key`? `true` = you run the work. */
  readonly beginFlight: (key: string) => Effect.Effect<boolean>;
  /** Release the flight for `key` (leader only). */
  readonly endFlight: (key: string) => Effect.Effect<void>;
  /** Resolve when the current leader for `key` finishes (bounded wait). */
  readonly awaitFlight: (key: string) => Effect.Effect<void>;
}

export class PsdGateService extends Context.Tag("PsdGateService")<
  PsdGateService,
  PsdGate
>() {}

/** Structural view of the DO stub's RPC surface (see PsdGate in gate-do.ts). */
interface PsdGateStub {
  acquireToken(): Promise<void>;
  beginFlight(key: string): Promise<boolean>;
  endFlight(key: string): Promise<void>;
  awaitFlight(key: string): Promise<void>;
}

/** Fixed name → one global DO instance for the whole worker. */
const GATE_DO_NAME = "global";

/** DO-backed gate. Every op degrades safely if the Durable Object is unreachable. */
export const PsdGateLive = Layer.effect(
  PsdGateService,
  Effect.gen(function* () {
    const env = yield* WorkerEnvTag;
    const stub = (): PsdGateStub =>
      env.PSD_GATE.get(
        env.PSD_GATE.idFromName(GATE_DO_NAME),
      ) as unknown as PsdGateStub;

    return {
      acquireToken: Effect.tryPromise(() => stub().acquireToken()).pipe(
        Effect.orElseSucceed(() => undefined),
      ),
      beginFlight: (key) =>
        Effect.tryPromise(() => stub().beginFlight(key)).pipe(
          // On gate failure, act as leader: the caller does the work rather than
          // waiting on coordination that isn't available.
          Effect.orElseSucceed(() => true),
        ),
      endFlight: (key) =>
        Effect.tryPromise(() => stub().endFlight(key)).pipe(
          Effect.orElseSucceed(() => undefined),
        ),
      awaitFlight: (key) =>
        Effect.tryPromise(() => stub().awaitFlight(key)).pipe(
          Effect.orElseSucceed(() => undefined),
        ),
    };
  }),
);

/**
 * In-memory gate backed by a caller-supplied {@link GateLogic}. For tests and as
 * a graceful fallback — NOT for production multi-isolate use (each isolate would
 * get its own limiter). Pass a shared `GateLogic` to exercise coalescing.
 */
export const makePsdGateLayer = (
  logic: GateLogic,
): Layer.Layer<PsdGateService> =>
  Layer.succeed(PsdGateService, {
    acquireToken: Effect.promise(() => logic.acquireToken()),
    beginFlight: (key) => Effect.sync(() => logic.beginFlight(key)),
    endFlight: (key) => Effect.sync(() => logic.endFlight(key)),
    awaitFlight: (key) => Effect.promise(() => logic.awaitFlight(key)),
  });

/** A gate with a very high rate — no throttling, real single-flight. Default test layer. */
export const PsdGateTest = makePsdGateLayer(
  new GateLogic({ ratePerSecond: 1e9 }),
);
