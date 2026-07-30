/**
 * PsdGate Durable Object — hosts ONE global {@link GateLogic} instance so the
 * PSD token bucket and single-flight registry are shared across every worker
 * isolate (the whole point: in-memory per-isolate limiters would multiply the
 * rate by the isolate count — see #2324).
 *
 * Thin RPC wrapper: all real logic is in the framework-free, unit-tested
 * GateLogic. This module imports `cloudflare:workers`, so it must only ever be
 * imported by the worker entry (index.ts), never by code the Node tests load.
 */
import { DurableObject } from "cloudflare:workers";
import { GateLogic } from "./gate-logic";

/** Max time a cross-isolate waiter blocks on a leader before giving up (dead-leader guard). */
const AWAIT_FLIGHT_TIMEOUT_MS = 10_000;

export class PsdGate extends DurableObject {
  // Instance-lifetime state: survives across requests while the DO stays warm.
  private readonly logic = new GateLogic();

  acquireToken(): Promise<void> {
    return this.logic.acquireToken();
  }

  beginFlight(key: string): boolean {
    return this.logic.beginFlight(key);
  }

  endFlight(key: string): void {
    this.logic.endFlight(key);
  }

  async awaitFlight(key: string): Promise<void> {
    // Bound the wait: if the leader isolate died without endFlight, waiters must
    // not hang. On timeout the caller falls back to serving stale / its own fetch.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, AWAIT_FLIGHT_TIMEOUT_MS);
    });
    try {
      await Promise.race([this.logic.awaitFlight(key), timeout]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
