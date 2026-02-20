#!/bin/bash
# Remind to track work in GitHub issues after commits
set -euo pipefail

INPUT=$(cat)

# Extract command field and check for git commit
COMMAND=$(echo "$INPUT" | sed -n 's/.*"command" *: *"\([^"]*\)".*/\1/p')
echo "$COMMAND" | grep -q 'git commit' || exit 0

# Only remind on feature branches
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "$BRANCH" | grep -qE '^(feat|fix|migrate|refactor|test|docs)/' || exit 0

echo "Reminder: If there's a related GitHub issue, comment on it with progress (gh issue comment)." >&2
exit 2
