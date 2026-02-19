#!/bin/bash
# Inject branch + changes context at session start
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

OUTPUT="Branch: $BRANCH"

if [ "$UNCOMMITTED" -gt 0 ]; then
  OUTPUT="$OUTPUT | Uncommitted changes: $UNCOMMITTED files"
fi

# Extract scope from branch name for issue context
if echo "$BRANCH" | grep -qE '^(feat|fix|migrate|refactor|test|docs)/'; then
  SCOPE=$(echo "$BRANCH" | sed 's|^[^/]*/||')
  OUTPUT="$OUTPUT | Scope: $SCOPE"
fi

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  OUTPUT="$OUTPUT | WARNING: on main — create a feature branch before making changes"
fi

echo "$OUTPUT"
exit 0
