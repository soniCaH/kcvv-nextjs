import { describe, it, expect } from "vitest";
import { GateLogic } from "./gate-logic";

/**
 * Deterministic fake scheduler: `now()` reads a mutable clock, `sleep(ms)`
 * advances it and resolves on a microtask. Lets us assert the token bucket's
 * pacing without real timers.
 */
function fakeScheduler() {
  let clock = 0;
  return {
    now: () => clock,
    sleep: async (ms: number) => {
      clock += ms;
    },
    advance: (ms: number) => {
      clock += ms;
    },
    get clock() {
      return clock;
    },
  };
}

describe("GateLogic — token bucket", () => {
  it("hands out the initial burst (capacity) without waiting", async () => {
    const s = fakeScheduler();
    const gate = new GateLogic({
      ratePerSecond: 5,
      now: s.now,
      sleep: s.sleep,
    });

    for (let i = 0; i < 5; i++) await gate.acquireToken();

    // Full burst granted at t=0 — no simulated sleep needed.
    expect(s.clock).toBe(0);
  });

  it("throttles sustained demand to ~rate per second", async () => {
    const s = fakeScheduler();
    const gate = new GateLogic({
      ratePerSecond: 5,
      now: s.now,
      sleep: s.sleep,
    });

    // 20 tokens: 5 free (burst) + 15 paced at 5/s → ≥3s of simulated time.
    for (let i = 0; i < 20; i++) await gate.acquireToken();

    expect(s.clock).toBeGreaterThanOrEqual(3000);
    // And not wildly more than the ideal (15 tokens / 5 per s = 3s).
    expect(s.clock).toBeLessThan(4000);
  });

  it("refills over wall-clock gaps so a later burst isn't throttled", async () => {
    const s = fakeScheduler();
    const gate = new GateLogic({
      ratePerSecond: 5,
      now: s.now,
      sleep: s.sleep,
    });

    for (let i = 0; i < 5; i++) await gate.acquireToken(); // drain
    s.advance(2000); // 2s idle → bucket refills to capacity (5)

    const before = s.clock;
    for (let i = 0; i < 5; i++) await gate.acquireToken();
    expect(s.clock).toBe(before); // served from refilled bucket, no wait
  });
});

describe("GateLogic — single-flight", () => {
  it("elects exactly one leader among concurrent callers for a key", () => {
    const gate = new GateLogic();
    const results = Array.from({ length: 50 }, () =>
      gate.beginFlight("matches:next"),
    );
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("a different key gets its own leader", () => {
    const gate = new GateLogic();
    expect(gate.beginFlight("a")).toBe(true);
    expect(gate.beginFlight("b")).toBe(true);
    expect(gate.beginFlight("a")).toBe(false);
  });

  it("endFlight releases the key so a later caller can lead again", () => {
    const gate = new GateLogic();
    expect(gate.beginFlight("k")).toBe(true);
    expect(gate.beginFlight("k")).toBe(false);
    gate.endFlight("k");
    expect(gate.beginFlight("k")).toBe(true);
  });

  it("awaitFlight resolves when the leader ends its flight", async () => {
    const gate = new GateLogic();
    gate.beginFlight("k");

    let resolved = false;
    const waiter = gate.awaitFlight("k").then(() => {
      resolved = true;
    });

    await Promise.resolve();
    expect(resolved).toBe(false); // still in flight

    gate.endFlight("k");
    await waiter;
    expect(resolved).toBe(true);
  });

  it("awaitFlight for an idle key resolves immediately", async () => {
    const gate = new GateLogic();
    await expect(gate.awaitFlight("idle")).resolves.toBeUndefined();
  });

  it("awaitFlight gives up after the lease if the leader never ends", async () => {
    // Dead-leader guard: a leader killed before endFlight must not hang waiters.
    const gate = new GateLogic({ leaseMs: 20 });
    gate.beginFlight("k"); // leader never calls endFlight
    await expect(gate.awaitFlight("k")).resolves.toBeUndefined();
  });

  it("reclaims leadership after the lease expires (dead-leader guard)", () => {
    let clock = 0;
    const gate = new GateLogic({ now: () => clock, leaseMs: 1000 });

    expect(gate.beginFlight("k")).toBe(true);
    expect(gate.beginFlight("k")).toBe(false); // live leader holds it
    expect(gate.isInFlight("k")).toBe(true);

    clock += 1500; // leader died without endFlight; lease lapses

    expect(gate.isInFlight("k")).toBe(false);
    expect(gate.beginFlight("k")).toBe(true); // reclaimed by the next caller
  });

  it("reclaiming a lapsed flight wakes anyone still awaiting it", async () => {
    let clock = 0;
    const gate = new GateLogic({ now: () => clock, leaseMs: 1000 });
    gate.beginFlight("k");

    let woken = false;
    const waiter = gate.awaitFlight("k").then(() => {
      woken = true;
    });
    await Promise.resolve();
    expect(woken).toBe(false);

    clock += 1500;
    gate.beginFlight("k"); // reclaim → resolves the abandoned flight's promise
    await waiter;
    expect(woken).toBe(true);
  });

  it("N concurrent misses coalesce onto ONE fan-out", async () => {
    const gate = new GateLogic();
    let fanOuts = 0;

    // Each caller: if leader → run the (single) fan-out; else await + reuse.
    const caller = async () => {
      if (gate.beginFlight("matches:next")) {
        fanOuts++;
        await Promise.resolve(); // simulate async fan-out
        gate.endFlight("matches:next");
      } else {
        await gate.awaitFlight("matches:next");
      }
    };

    await Promise.all(Array.from({ length: 30 }, caller));
    expect(fanOuts).toBe(1);
  });
});
