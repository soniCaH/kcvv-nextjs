/**
 * PSD gate — pure coordination logic.
 *
 * The PSD read path storms its own quota: without coordination, N concurrent
 * cache-misses each fire the ~19-call `getNextMatches` fan-out, and a failed
 * refresh never advances `fetchedAt`, so every subsequent request re-fans out
 * until PSD recovers (see #2320). PSD's published limits are 5 req/s + 2 000/day
 * (#2319), shared across every read endpoint — one fan-out already saturates the
 * per-second budget, so the 2nd concurrent miss 429s instantly.
 *
 * This module is the storm fix, expressed as framework-free logic so it can be
 * unit-tested in the Node test env (a real Durable Object cannot). The
 * `PsdGate` Durable Object (see gate.ts) hosts ONE instance of this class, which
 * makes both limiters **global across all worker isolates**:
 *
 *  - **Token bucket** — hands out ≤`ratePerSecond` PSD calls/second worldwide,
 *    so a fan-out can't burst past PSD's 5/s ceiling. In-memory per-isolate was
 *    ruled out (#2324): 8 isolates × 5/s = 40/s.
 *  - **Single-flight** — the first caller for a cache key becomes the leader and
 *    runs the fan-out; concurrent callers coalesce (N misses → 1 fan-out).
 *
 * The persisted negative marker that suppresses re-storming lives in KV (it must
 * outlive a single DO instance), not here — see cache/kv-cache.ts.
 */

export interface GateLogicOptions {
  /** Token-bucket rate & capacity (PSD calls/second). Default 5 (PSD's limit). */
  readonly ratePerSecond?: number;
  /** Injectable clock (ms). Default `Date.now`. */
  readonly now?: () => number;
  /** Injectable sleep. Default a real `setTimeout` promise. */
  readonly sleep?: (ms: number) => Promise<void>;
}

const realSleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class GateLogic {
  private readonly rate: number;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;

  private tokens: number;
  private lastRefill: number;

  /** key → promise that resolves when the current leader ends its flight. */
  private readonly inFlight = new Map<string, Promise<void>>();
  private readonly resolvers = new Map<string, () => void>();

  constructor(opts: GateLogicOptions = {}) {
    this.rate = opts.ratePerSecond ?? 5;
    this.now = opts.now ?? (() => Date.now());
    this.sleep = opts.sleep ?? realSleep;
    // Start full so a single cold fan-out isn't throttled from the first call.
    this.tokens = this.rate;
    this.lastRefill = this.now();
  }

  private refill(): void {
    const t = this.now();
    const elapsed = (t - this.lastRefill) / 1000;
    if (elapsed <= 0) return;
    this.tokens = Math.min(this.rate, this.tokens + elapsed * this.rate);
    this.lastRefill = t;
  }

  /**
   * Resolve when a PSD-call token is available, consuming it. Global ≤rate/s.
   * Callers `await` this immediately before every PSD fetch.
   */
  async acquireToken(): Promise<void> {
    // Loop rather than sleep-once: the injected clock may not advance by the
    // full deficit in one step (and refill is capped at capacity).
    for (;;) {
      this.refill();
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      const deficit = 1 - this.tokens;
      await this.sleep((deficit / this.rate) * 1000);
    }
  }

  /**
   * Single-flight leadership. Returns `true` to the first caller for `key`
   * (the leader — it must run the work, then call `endFlight(key)`), `false`
   * to every concurrent caller (they should `awaitFlight(key)` or serve stale).
   */
  beginFlight(key: string): boolean {
    if (this.inFlight.has(key)) return false;
    this.inFlight.set(
      key,
      new Promise<void>((resolve) => this.resolvers.set(key, resolve)),
    );
    return true;
  }

  /** Release the flight for `key`, waking every `awaitFlight` waiter. */
  endFlight(key: string): void {
    this.resolvers.get(key)?.();
    this.resolvers.delete(key);
    this.inFlight.delete(key);
  }

  /** Resolve when the current leader for `key` calls `endFlight`. No-op if idle. */
  async awaitFlight(key: string): Promise<void> {
    await this.inFlight.get(key);
  }

  /** True while a leader holds the flight for `key`. */
  isInFlight(key: string): boolean {
    return this.inFlight.has(key);
  }
}
