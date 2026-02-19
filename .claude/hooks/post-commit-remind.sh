#!/bin/bash
# Remind to track work in GitHub issues after commits
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check Bash tool calls that are git commits
[ "$TOOL_NAME" != "Bash" ] && exit 0
echo "$COMMAND" | grep -q "git commit" || exit 0

# Only remind on feature branches
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "$BRANCH" | grep -qE '^(feat|fix|migrate|refactor)/' || exit 0

echo "Reminder: If there's a related GitHub issue, comment on it with progress (gh issue comment)."
exit 0
