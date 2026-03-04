#!/bin/bash
# Inject branch + changes context at session start
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
UNCOMMITTED=$( (git status --porcelain 2>/dev/null || echo "") | wc -l | tr -d ' ')

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

# Warn when on a feature branch outside a git worktree.
# git-dir == git-common-dir means we are in the main working tree, not a linked worktree.
if echo "$BRANCH" | grep -qE '^(feat|fix|migrate|refactor|test|docs)/'; then
  GIT_DIR=$(git rev-parse --git-dir 2>/dev/null || echo "")
  GIT_COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null || echo "")
  if [ -n "$GIT_DIR" ] && [ "$GIT_DIR" = "$GIT_COMMON_DIR" ]; then
    OUTPUT="$OUTPUT | WARNING: feature branch running in main worktree — invoke superpowers:using-git-worktrees to isolate this branch before making changes"
  fi
fi

echo "$OUTPUT"
exit 0
