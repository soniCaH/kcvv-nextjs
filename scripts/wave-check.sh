#!/bin/bash
# Wave check — do the open PR branches collide with main, or with each other?
#
# Run this after a /ralph-afk wave opens its PRs, BEFORE you start merging.
# It tells you which PRs are safe to merge in any order, and which pairs will
# fight, so you merge the fighters one at a time instead of discovering the
# conflict halfway through.
#
# Usage: ./scripts/wave-check.sh
#
# ponytail: pairwise O(n²) on merge-tree. Fine to ~15 open PRs; if a wave ever
# gets bigger than that, group by changed-file sets first.
set -euo pipefail

git fetch --quiet --prune origin

# ── merge-tree, run once, with the three outcomes kept apart ──────────────────
# Exit 0 = clean, 1 = conflict, anything else = git could not answer. A missing
# ref also exits 1, which is why refs are verified before this is trusted.
# Sets MT_OUT to the conflicted paths (empty when clean).
MT_OUT=""
merge_check() {
  local rc=0 out
  out=$(git merge-tree --write-tree --name-only "$1" "$2" 2>&1) || rc=$?
  if [ "$rc" -gt 1 ]; then
    echo "git merge-tree failed (exit ${rc}) comparing $1 and $2:" >&2
    echo "$out" >&2
    exit 1
  fi
  # Output shape: OID line, then conflicted paths, then a blank line and git's
  # own prose. Drop the OID, stop at the blank line.
  MT_OUT=$(printf '%s\n' "$out" | tail -n +2 | sed -e '/^$/q' -e '/^$/d')
  return "$rc"
}

# ── collect the open PR head branches ─────────────────────────────────────────
# Capture first and check the exit status: a gh failure inside a process
# substitution would otherwise read as "no open PRs" and report all-clear.
if ! PR_BRANCHES=$(gh pr list --state open --limit 100 --json headRefName --jq '.[].headRefName' 2>&1); then
  echo "gh pr list failed: ${PR_BRANCHES}" >&2
  exit 1
fi

# ponytail: while-read, not `mapfile` — macOS ships bash 3.2, which has no mapfile.
BRANCHES=()
while IFS= read -r line; do
  [ -n "$line" ] || continue
  # A PR from a fork has no branch on origin; merge-tree would exit 1 on the
  # missing ref and be misread as a conflict. Say so instead.
  if git rev-parse --verify --quiet "origin/${line}^{commit}" >/dev/null; then
    BRANCHES+=("$line")
  else
    printf "  skipped   %s — no such branch on origin (fork PR?)\n" "$line"
  fi
done <<<"$(printf '%s\n' "$PR_BRANCHES" | sort)"

if [ ${#BRANCHES[@]} -eq 0 ]; then
  echo "No open PRs with a branch on origin."
  exit 0
fi

echo "Open PR branches: ${#BRANCHES[@]}"
echo ""

# ── 1. Does each branch still merge cleanly into main? ────────────────────────
echo "── vs origin/main ──"
CLEAN=()
for b in "${BRANCHES[@]}"; do
  if merge_check "origin/main" "origin/${b}"; then
    printf "  clean     %s\n" "$b"
    CLEAN+=("$b")
  else
    printf "  CONFLICTS %s  → rebase on main before merging\n" "$b"
    printf '%s\n' "$MT_OUT" | sed 's/^/              /'
  fi
done
echo ""

# ── 2. Do any two of the clean ones fight each other? ─────────────────────────
if [ ${#CLEAN[@]} -lt 2 ]; then
  echo "Fewer than two mergeable branches — nothing to compare."
  exit 0
fi

echo "── pairwise ──"
FOUND=0
for ((i = 0; i < ${#CLEAN[@]}; i++)); do
  for ((j = i + 1; j < ${#CLEAN[@]}; j++)); do
    a="${CLEAN[$i]}"
    b="${CLEAN[$j]}"
    if ! merge_check "origin/${a}" "origin/${b}"; then
      printf "  COLLIDE   %s  ↔  %s\n" "$a" "$b"
      # The filenames say whether this is a real fight or just the lockfile.
      printf '%s\n' "$MT_OUT" | sed 's/^/              /'
      FOUND=1
    fi
  done
done

if [ "$FOUND" -eq 0 ]; then
  echo "  none — merge them in any order."
else
  echo ""
  echo "Merge one of each colliding pair, then rebase the other before merging it."
fi
