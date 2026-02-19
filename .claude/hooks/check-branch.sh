#!/bin/bash
# Block git commits on main branch
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check Bash tool calls
[ "$TOOL_NAME" != "Bash" ] && exit 0

# Only check git commit commands
echo "$COMMAND" | grep -q "git commit" || exit 0

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  cat <<EOF
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"BLOCKED: You are on the main branch. Create a feature branch first: git checkout -b <type>/<description>"}}
EOF
  exit 0
fi

exit 0
