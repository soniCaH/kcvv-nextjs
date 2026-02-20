#!/bin/bash
# Block git commits on main branch
set -euo pipefail

INPUT=$(cat)

# Check if command contains git commit (tool_name filtering done by settings.json matcher)
echo "$INPUT" | grep -q 'git commit' || exit 0

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"BLOCKED: You are on the main branch. Create a feature branch first: git checkout -b <type>/<description>"}}
EOF
  exit 0
fi

exit 0
