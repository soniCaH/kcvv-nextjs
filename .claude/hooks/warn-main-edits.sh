#!/bin/bash
# Warn when editing files while on main branch
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"BLOCKED: You are editing files on the main branch. Create a feature branch first: git checkout -b <type>/<description>"}}
EOF
  exit 0
fi

exit 0
