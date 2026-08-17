#!/bin/bash
# Print the `ready` issues that have no open blockers, ascending, one per line.
#
# Single source of truth for "what can be worked on right now". Consumed by
# scripts/ralph.sh, .claude/commands/ralph.md, and .claude/skills/ralph-afk/.
#
# Blocking is GitHub's native `blockedBy` relationship, set with the addBlockedBy
# mutation — not a label and not a markdown section. An issue can be `ready`
# (well-specified) and blocked at the same time; both gates must pass.
#
# Usage:
#   ./scripts/unblocked-issues.sh                       # every unblocked ready issue
#   ./scripts/unblocked-issues.sh --first               # stop at the first one
#   ./scripts/unblocked-issues.sh --milestone typed-kv  # one milestone only
#   ./scripts/unblocked-issues.sh --exclude "12 34"     # skip these numbers
#
# Exits 1 if any blockedBy query failed, so a caller can never mistake an API
# failure for "nothing is blocked". Prints nothing and exits 0 when the queue
# is genuinely empty.
set -euo pipefail

OWNER="soniCaH"
REPO="www.kcvvelewijt.be"

MILESTONE=""
EXCLUDE=""
FIRST_ONLY=false

while [ $# -gt 0 ]; do
  case "$1" in
    --milestone) shift; MILESTONE="${1:-}" ;;
    --milestone=*) MILESTONE="${1#*=}" ;;
    --exclude) shift; EXCLUDE="${1:-}" ;;
    --exclude=*) EXCLUDE="${1#*=}" ;;
    --first) FIRST_ONLY=true ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
  shift || true
done

# --limit is required: gh caps at 30 silently, and a capped list is
# indistinguishable from a complete one.
ARGS=(--label "ready" --state open --limit 200 --json number --jq 'sort_by(.number) | .[].number')
if [ -n "$MILESTONE" ]; then
  ARGS+=(--milestone "$MILESTONE")
fi

if ! CANDIDATES=$(gh issue list "${ARGS[@]}" 2>&1); then
  echo "gh issue list failed: ${CANDIDATES}" >&2
  exit 1
fi

[ -z "$CANDIDATES" ] && exit 0

ANY_FAILED=false

for num in $CANDIDATES; do
  skip=false
  for e in $EXCLUDE; do
    if [ "$num" = "$e" ]; then skip=true; break; fi
  done
  [ "$skip" = true ] && continue

  if ! open_blockers=$(gh api graphql -f query="
    query {
      repository(owner: \"${OWNER}\", name: \"${REPO}\") {
        issue(number: ${num}) {
          blockedBy(first: 50) { nodes { state } }
        }
      }
    }" --jq '[.data.repository.issue.blockedBy.nodes[] | select(.state == "OPEN")] | length' 2>&1); then
    echo "warning: blockedBy query failed for #${num}: ${open_blockers}" >&2
    ANY_FAILED=true
    continue
  fi

  if [ "$open_blockers" = "0" ]; then
    echo "$num"
    # break, not `exit 0` — fall through to the ANY_FAILED check below. A
    # --first pick made after an earlier blocker query failed is not the first
    # unblocked issue, only the first one we could confirm.
    [ "$FIRST_ONLY" = true ] && break
  fi
done

if [ "$ANY_FAILED" = true ]; then
  echo "one or more blockedBy queries failed — the unblocked set is incomplete" >&2
  exit 1
fi
