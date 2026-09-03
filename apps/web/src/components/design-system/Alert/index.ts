// `Alert` (the long-form ticket-stub) is deliberately NOT re-exported here
// (#2580 review finding E2). It has zero production consumers since
// SearchInterface.tsx moved onto <EmptyState> — re-exporting it through the
// barrel forces it into the shared webpack chunk on every route (no
// "sideEffects": false, no optimizePackageImports for this package), for a
// component nothing renders. Its stories/tests import "./Alert" directly,
// which is what keeps the file itself alive — see Alert.tsx's own docblock.
export { AlertBadge } from "./AlertBadge";
export type {
  AlertBadgeProps,
  AlertBadgeVariant,
  AlertBadgeSize,
} from "./AlertBadge";
