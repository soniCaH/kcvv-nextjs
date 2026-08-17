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

# Open PRs, as their head branch names.
# ponytail: while-read, not `mapfile` — macOS ships bash 3.2, which has no mapfile.
BRANCHES=()
while IFS= read -r line; do
  [ -n "$line" ] && BRANCHES+=("$line")
done < <(gh pr list --state open --limit 100 --json headRefName --jq '.[].headRefName' | sort)

if [ ${#BRANCHES[@]-0} -eq 0 ]; then
  echo "No open PRs."
  exit 0
fi

echo "Open PR branches: ${#BRANCHES[@]}"
echo ""

# ── 1. Does each branch still merge cleanly into main? ────────────────────────
echo "── vs origin/main ──"
CLEAN=()
for b in ${BRANCHES[@]+"${BRANCHES[@]}"}; do
  if git merge-tree --write-tree "origin/main" "origin/${b}" >/dev/null 2>&1; then
    printf "  clean     %s\n" "$b"
    CLEAN+=("$b")
  else
    printf "  CONFLICTS %s  → rebase on main before merging\n" "$b"
  fi
done
echo ""

# ── 2. Do any two of the clean ones fight each other? ─────────────────────────
if [ ${#CLEAN[@]-0} -lt 2 ]; then
  echo "Fewer than two mergeable branches — nothing to compare."
  exit 0
fi

echo "── pairwise ──"
FOUND=0
for ((i = 0; i < ${#CLEAN[@]}; i++)); do
  for ((j = i + 1; j < ${#CLEAN[@]}; j++)); do
    a="${CLEAN[$i]}"
    b="${CLEAN[$j]}"
    if ! git merge-tree --write-tree "origin/${a}" "origin/${b}" >/dev/null 2>&1; then
      printf "  COLLIDE   %s  ↔  %s\n" "$a" "$b"
      # Name the files, so you can see whether it is a real fight or the lockfile.
      # Output shape: OID line, then conflicted paths, then a blank line and
      # git's own prose. Drop the OID, stop at the blank line.
      git merge-tree --write-tree --name-only "origin/${a}" "origin/${b}" 2>/dev/null |
        tail -n +2 | sed -e '/^$/q' -e '/^$/d' -e 's/^/              /'
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
