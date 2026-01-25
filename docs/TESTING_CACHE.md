# Test Caching & Performance Guide

This guide explains how to use Vitest's caching and smart test running features to speed up your development workflow.

## 🚀 Quick Start

### Run Only Changed Tests

```bash
# Run tests only for files that have changed (based on git)
npm run test:changed
```

This is the **fastest option** when you're actively developing. It only runs tests for files that:

- Have uncommitted changes in git
- Are new (untracked)
- Have been modified since the last commit

### Run Related Tests

```bash
# Run tests related to specific files
npm run test:related src/components/team/TeamRoster/TeamRoster.tsx
```

This runs:

- The test file for the component you changed
- Any other tests that import or depend on that file

### Standard Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## 📦 How Caching Works

Vitest automatically caches test results in `node_modules/.vitest/`. When you run tests:

1. **First run**: All tests execute normally
2. **Subsequent runs**: Only tests affected by code changes re-run
3. **Unchanged files**: Results are loaded from cache (instant!)

### Cache Location

```
node_modules/.vitest/
├── results.json      # Test results cache
└── deps/            # Dependency graph
```

## 🧹 Managing the Cache

### Clear Cache

If you encounter unexpected test behavior, clear the cache:

```bash
npm run test:clear-cache
```

This **deletes** the cache directory and forces a fresh start on the next test run.

### Bypass Cache (Without Deleting)

Run tests without using cache, but keep the cache intact:

```bash
npm run test:no-cache
```

This is useful for:

- **Debugging**: Verify if cache is causing issues
- **One-time verification**: Run fresh tests without affecting future runs
- **Comparison**: Compare cached vs non-cached results

### When to Clear Cache

- ✅ After updating dependencies
- ✅ After changing test configuration
- ✅ If tests are behaving unexpectedly
- ✅ After switching branches with significant changes
- ✅ After rebasing or merging

### When to Bypass Cache

- ✅ Debugging test failures
- ✅ Verifying cache isn't stale
- ✅ One-time fresh test run
- ❌ Don't use routinely (defeats the purpose!)

### Cache Commands Summary

| Command            | Action              | Use Case              |
| ------------------ | ------------------- | --------------------- |
| `test:clear-cache` | **Deletes** cache   | Fix persistent issues |
| `test:no-cache`    | **Bypasses** cache  | Debug/verify once     |
| `test`             | Uses cache normally | Standard workflow     |

## 🔄 Git Integration

### Pre-commit Hook

Your project already has `lint-staged` configured to run related tests before commits:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run"  // ← Runs only related tests!
  ]
}
```

This means when you commit files, only the tests related to those files will run.

## 💡 Best Practices

### During Active Development

```bash
# Use watch mode - fastest feedback loop
npm run test:watch
```

Watch mode automatically:

- Runs tests when files change
- Uses cache for unchanged files
- Shows only relevant test output

### Before Committing

```bash
# Run tests for changed files
npm run test:changed
```

This ensures your changes don't break existing tests without running the entire suite.

### Before Pushing / In CI

```bash
# Run full test suite
npm test

# Or with coverage
npm run test:coverage
```

Always run the full suite before pushing to ensure nothing is broken.

## 📊 Performance Tips

### 1. Use Specific Test Commands

| Command         | Use Case              | Speed          |
| --------------- | --------------------- | -------------- |
| `test:watch`    | Active development    | ⚡⚡⚡ Fastest |
| `test:changed`  | Quick validation      | ⚡⚡ Fast      |
| `test:related`  | Specific file changes | ⚡⚡ Fast      |
| `test`          | Full validation       | ⚡ Normal      |
| `test:coverage` | Coverage reports      | 🐌 Slower      |

### 2. Organize Tests Well

- Keep test files next to source files
- Use descriptive test names
- Group related tests in `describe` blocks

### 3. Avoid Unnecessary Coverage

Coverage reports are slower. Use them:

- Before committing major changes
- In CI/CD pipelines
- When analyzing test quality

Don't use coverage for:

- Quick development iterations
- Watch mode
- Individual test runs

## 🔍 Troubleshooting

### Tests Not Running

**Problem**: `test:changed` says "No test files found"

**Solution**: You have no uncommitted changes. Use `npm test` instead.

### Stale Results

**Problem**: Tests pass but code is broken

**Solution**: Clear the cache:

```bash
npm run test:clear-cache
npm test
```

### Slow Test Runs

**Problem**: Tests are slower than expected

**Solutions**:

1. Use `test:changed` instead of `test`
2. Clear cache if it's corrupted
3. Check if coverage is enabled (it's slower)

## 📈 Example Workflow

Here's a typical development workflow:

```bash
# 1. Start development with watch mode
npm run test:watch

# 2. Make changes to components
# → Tests auto-run for changed files

# 3. Before committing, run changed tests
npm run test:changed

# 4. Commit (lint-staged runs related tests automatically)
git commit -m "feat: add new feature"

# 5. Before pushing, run full suite
npm test

# 6. Push to remote
git push
```

## 🎯 Summary

- **Use `test:watch`** during active development
- **Use `test:changed`** for quick validation
- **Use `test`** before pushing
- **Clear cache** if tests behave unexpectedly
- **Let git hooks** handle pre-commit testing

The cache is automatic and transparent - you don't need to manage it manually in most cases!
