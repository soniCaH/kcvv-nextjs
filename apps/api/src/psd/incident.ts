/**
 * PSD incident tracker — pure, debounced outage state machine.
 *
 * PSD failures were silent (WARN-only). This tracks whether PSD is currently in
 * an outage so the gate can emit exactly ONE Slack "outage started" ping per
 * incident and ONE "recovered" ping — never one-per-429 (see #2329, #2322).
 *
 * Framework-free (like {@link GateLogic}) so it unit-tests in the Node env; a
 * real Durable Object cannot. The `PsdGate` DO (gate-do.ts) hosts ONE global
 * instance so the incident view is shared across every worker isolate, and does
 * the actual Slack POST — this module only decides *when* to alert.
 *
 * Debounce: an incident opens on the first failure after ≥`healthWindowMs` of
 * health, and only closes (recovery) on the first success after ≥`healthWindowMs`
 * with no failure. That window absorbs flapping into a single incident.
 */

/** Health window: failures/successes within this of a failure don't flip state. */
export const HEALTH_WINDOW_MS = 60_000; // 60 s (#2329)

export type IncidentAlert =
  | { readonly kind: "outage-start"; readonly startedAt: number }
  | {
      readonly kind: "recovery";
      readonly startedAt: number;
      readonly recoveredAt: number;
      readonly durationMs: number;
    };

export interface IncidentTrackerOptions {
  /** Injectable clock (ms). Default `Date.now`. */
  readonly now?: () => number;
  /** Debounce window (ms). Default {@link HEALTH_WINDOW_MS}. */
  readonly healthWindowMs?: number;
}

export class IncidentTracker {
  private readonly now: () => number;
  private readonly healthWindowMs: number;

  private open = false;
  private startedAt = 0;
  // Boot state is "healthy since forever" so the very first failure opens an
  // incident (it follows ≥healthWindowMs of implied health).
  private lastFailureAt = Number.NEGATIVE_INFINITY;

  constructor(opts: IncidentTrackerOptions = {}) {
    this.now = opts.now ?? (() => Date.now());
    this.healthWindowMs = opts.healthWindowMs ?? HEALTH_WINDOW_MS;
  }

  /** True while an outage is open (drives WARN→ERROR log escalation). */
  get isOpen(): boolean {
    return this.open;
  }

  /**
   * Report one PSD refresh outcome. Returns the alert to emit, or null when the
   * outcome doesn't flip incident state (the common case — most reports are
   * "still healthy" or "still down").
   */
  report(ok: boolean, at: number = this.now()): IncidentAlert | null {
    const healthyForWindow = at - this.lastFailureAt >= this.healthWindowMs;

    if (ok) {
      if (this.open && healthyForWindow) {
        this.open = false;
        return {
          kind: "recovery",
          startedAt: this.startedAt,
          recoveredAt: at,
          durationMs: at - this.startedAt,
        };
      }
      return null;
    }

    // Failure.
    const wasHealthy = healthyForWindow;
    this.lastFailureAt = at;
    if (!this.open && wasHealthy) {
      this.open = true;
      this.startedAt = at;
      return { kind: "outage-start", startedAt: at };
    }
    return null;
  }
}
