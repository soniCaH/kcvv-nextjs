/**
 * Shared test-only narrowing helper for the `isPlaceholder` discriminant
 * (#2606/#2688). Every reservation-aware row type (`ScheduleRow`,
 * `UpcomingRow`, ...) discriminates on `isPlaceholder: false | true`, so one
 * generic assertion covers all of them instead of a copy per test file.
 */
export function asNonPlaceholder<T extends { isPlaceholder: boolean }>(
  row: T | undefined,
  message = "expected a non-placeholder row",
): Extract<T, { isPlaceholder: false }> {
  if (!row || row.isPlaceholder) throw new Error(message);
  return row as Extract<T, { isPlaceholder: false }>;
}
