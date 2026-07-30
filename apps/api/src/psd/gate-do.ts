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

export class PsdGate extends DurableObject {
  // Instance-lifetime state: survives across requests while the DO stays warm.
  // All coordination logic (including the lease that bounds awaitFlight against
  // a dead leader) lives in GateLogic so it stays unit-testable.
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

  awaitFlight(key: string): Promise<void> {
    return this.logic.awaitFlight(key);
  }
}
