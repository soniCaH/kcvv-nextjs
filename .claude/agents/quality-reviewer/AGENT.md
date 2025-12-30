# Quality Review Agent

**Type:** Autonomous Validation & Quality Assurance Agent
**Purpose:** Review migrated code against KCVV standards and identify issues

## Overview

This agent performs comprehensive quality assurance on migrated components and pages, ensuring they meet KCVV Elewijt's high standards for code quality, testing, documentation, and maintainability.

## When to Use

Invoke this agent when you need to:

- Review a completed migration
- Validate code quality before PR
- Audit existing Next.js components
- Ensure standards compliance
- Identify technical debt
- Prepare quality report for stakeholders

## What This Agent Does

### 1. Code Quality Analysis

- TypeScript strict mode compliance
- ESLint rule adherence
- Code complexity metrics
- Dead code detection
- Import organization
- Naming convention validation

### 2. Effect Schema Validation

- Verify all data uses Effect Schema
- Check schema coverage
- Validate schema correctness
- Test schema decode/encode
- Ensure proper error handling

### 3. Storybook Validation

- **Critical:** Verify story exists for every component
- Check story completeness (all variants)
- Validate story documentation
- Test story rendering
- Check for visual regression setup

### 4. Test Coverage Analysis

- Unit test coverage >80% target
- Test quality assessment
- Edge case coverage
- Error handling tests
- Mock quality validation

### 5. ISR Configuration Review

- Verify revalidation settings
- Check generateStaticParams usage
- Validate dynamic routes
- Review caching strategy

### 6. Accessibility Audit

- ARIA labels present
- Semantic HTML usage
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

### 7. Performance Check

- Image optimization
- Bundle size impact
- Unnecessary re-renders
- Effect dependency arrays
- Next.js best practices

### 8. Documentation Review

- JSDoc completeness
- README accuracy
- MIGRATION_PLAN.md updated
- API documentation
- Usage examples

## Agent Workflow

```markdown
1. Receive component/page path or migration PR
2. Run automated checks:
   - TypeScript compilation
   - ESLint
   - Test suite
   - Build process
3. Analyze code quality:
   - Schema usage
   - Storybook stories
   - Test coverage
   - ISR config
4. Audit accessibility
5. Check documentation
6. Generate quality report
7. Create GitHub issues for problems
8. Return actionable recommendations
```

## Input Format

Multiple invocation patterns:

```text
Review the news article page
Quality check src/components/news/NewsCard.tsx
Audit PR #123
Review all components in src/components/teams/
Validate migration of ranking page
```

## Output Format

````markdown
# Quality Review Report: [Component/Page Name]

**Reviewed:** 2025-12-30
**Reviewer:** Quality Review Agent
**Overall Score:** 85/100 ⭐⭐⭐⭐

## Executive Summary

✅ **Passed:** 12 checks
⚠️ **Warnings:** 3 issues
❌ **Failed:** 1 critical issue

### Quick Stats

- Test Coverage: 92% (✅ Target: 80%)
- TypeScript: No errors ✅
- ESLint: 3 warnings ⚠️
- Build: Successful ✅
- Storybook: Stories exist ✅

## Critical Issues ❌

### 1. Missing Error Boundary

**Severity:** High
**Location:** src/app/news/[slug]/page.tsx
**Issue:** Page component has no error boundary for data fetching failures

**Impact:** Users will see unstyled error page on API failures

**Recommendation:**

```typescript
export default async function ArticlePage({ params }: PageProps) {
  try {
    const article = await DrupalAPI.getArticle(params.slug).pipe(
      Effect.runPromise
    )
    return <ArticleLayout article={article} />
  } catch (error) {
    return <ErrorPage error={error} />
  }
}
```
````

**Issue Created:** #456

---

## Warnings ⚠️

### 1. Test Coverage Below Target for Error Cases

**Location:** src/components/news/NewsCard.test.tsx
**Coverage:** Error handling: 60% (Target: 80%)

**Missing Tests:**

- Network timeout scenarios
- Schema validation failures
- Missing required fields

**Recommendation:** Add tests for error edge cases

---

### 2. Storybook Story Incomplete

**Location:** src/components/news/NewsCard.stories.tsx
**Issue:** Missing LoadingState and ErrorState stories

**Impact:** Visual states not documented

**Recommendation:**

```typescript
export const Loading: Story = {
  args: {
    article: null,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: new Error("Failed to load article"),
  },
};
```

---

### 3. ESLint Warnings

**Location:** src/lib/drupal-api.ts:45, 67, 89

**Issues:**

- Line 45: Unused variable 'retryCount'
- Line 67: Console.log in production code
- Line 89: Any type used without suppression comment

**Auto-fixable:** Partially

---

## Detailed Analysis

### Code Quality: 90/100 ✅

#### TypeScript Strict Mode: ✅ Pass

- No type errors
- Strict mode enabled
- All functions typed
- No 'any' without justification

#### ESLint Compliance: ⚠️ 3 warnings

- See warnings section above
- Overall clean code
- Follows conventions

#### Code Organization: ✅ Pass

- Proper file structure
- Logical component breakdown
- Clear separation of concerns

#### Complexity: ✅ Pass

- Cyclomatic complexity: Low (3.2 avg)
- No functions >50 lines
- Well-factored code

---

### Effect Schema Usage: 95/100 ✅

#### Schema Coverage: ✅ Complete

- All API data validated with schemas
- No untyped data
- Proper error handling

#### Schema Quality: ✅ High

```typescript
✅ ArticleSchema properly structured
✅ All fields typed correctly
✅ Optional fields marked
✅ Relationships handled
```

#### Decode/Encode: ✅ Correct

- Schema.decode used before consumption
- Error handling in place
- Type safety maintained

---

### Storybook: 85/100 ⚠️

#### Story Existence: ✅ Pass

- Story file exists
- Component rendered
- Basic variants covered

#### Story Completeness: ⚠️ Incomplete

**Existing Stories:**

- ✅ Default
- ✅ WithImage
- ✅ WithoutImage

**Missing Stories:**

- ❌ LoadingState
- ❌ ErrorState
- ❌ EmptyState

**Recommendation:** Add missing states for complete documentation

#### Documentation: ✅ Good

- Props documented
- Usage examples present
- Visual regression ready

---

### Test Coverage: 92/100 ✅

#### Overall Coverage: ✅ Exceeds Target

```text
Statements   : 92% (Target: 80%) ✅
Branches     : 88% (Target: 80%) ✅
Functions    : 95% (Target: 80%) ✅
Lines        : 92% (Target: 80%) ✅
```

#### Test Quality: ✅ High

- Comprehensive unit tests
- Good use of mocks
- Clear test descriptions
- Proper assertions

#### Coverage Gaps: ⚠️ Minor

**Uncovered Code:**

- Error recovery paths (10%)
- Edge cases in mapper (8%)

**Recommendation:** Add tests for uncovered branches

---

### ISR Configuration: 100/100 ✅

#### Revalidation: ✅ Correct

```typescript
export const revalidate = 3600; // 1 hour - appropriate for news
export const dynamicParams = true; // correct for dynamic routes
```

#### Static Generation: ✅ Implemented

```typescript
export async function generateStaticParams() {
  // Properly implemented
  // Fetches all article IDs
  // Returns correct format
}
```

#### Caching Strategy: ✅ Optimal

- Appropriate revalidation time
- Proper use of ISR
- Cache headers set correctly

---

### Accessibility: 88/100 ✅

#### ARIA Labels: ✅ Present

- All interactive elements labeled
- Proper landmark roles
- Screen reader friendly

#### Semantic HTML: ✅ Good

- Proper heading hierarchy
- Correct use of semantic tags
- Forms properly labeled

#### Keyboard Navigation: ✅ Works

- All interactive elements focusable
- Focus indicators visible
- Logical tab order

#### Color Contrast: ⚠️ One issue

- Most text passes WCAG AA
- One button has insufficient contrast (4.2:1, needs 4.5:1)

**Location:** src/components/news/NewsCard.tsx:45
**Fix:** Darken button color by one shade

---

### Performance: 90/100 ✅

#### Image Optimization: ✅ Excellent

```typescript
<Image
  src={article.fieldImage.url}
  alt={article.title}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  priority={false} // ✅ Correct for below-fold
  className="rounded-lg"
/>
```

#### Bundle Size: ✅ Good

- Component size: 4.2KB
- No unnecessary dependencies
- Tree-shaking optimized

#### Re-renders: ✅ Optimized

- No unnecessary re-renders detected
- Proper use of React patterns
- Effect dependencies correct

---

### Documentation: 80/100 ⚠️

#### JSDoc: ✅ Present

- All exports documented
- Prop types documented
- Return types documented

#### MIGRATION_PLAN.md: ✅ Updated

- Page marked as completed
- Status accurate
- Links to code present

#### README: ⚠️ Could Improve

- Basic usage documented
- Missing advanced usage examples
- No troubleshooting section

**Recommendation:** Add usage examples and common issues

---

## Comparison with Standards

| Standard          | Required | Actual    | Status |
| ----------------- | -------- | --------- | ------ |
| Test Coverage     | ≥80%     | 92%       | ✅     |
| Storybook Stories | Required | Present   | ✅     |
| TypeScript Strict | Yes      | Yes       | ✅     |
| Effect Schema     | All data | All data  | ✅     |
| ESLint Clean      | 0 errors | 0 errors  | ✅     |
| ISR Configured    | Yes      | Yes       | ✅     |
| Accessibility     | WCAG AA  | Mostly AA | ⚠️     |
| Documentation     | Complete | Good      | ⚠️     |

---

## Migration Compliance

### KCVV Workflow: ✅ Followed

- [x] Storybook created first
- [x] Effect Schema used
- [x] Vitest tests written
- [x] TypeScript strict mode
- [x] Tailwind CSS styling
- [x] Conventional commits
- [x] MIGRATION_PLAN.md updated

### Deviations: None

All KCVV standards followed correctly.

---

## Recommendations by Priority

### High Priority (Fix Before PR)

1. ❌ Add error boundary to page component
2. ⚠️ Fix color contrast issue in button
3. ⚠️ Remove console.log from production code

### Medium Priority (Fix Soon)

4. ⚠️ Add LoadingState and ErrorState stories
5. ⚠️ Increase error case test coverage to 80%
6. ⚠️ Fix ESLint warnings (unused variables)

### Low Priority (Nice to Have)

7. 📝 Add advanced usage examples to README
8. 📝 Add troubleshooting section
9. 🎨 Consider adding more Storybook documentation

---

## GitHub Issues Created

- #456: Add error boundary to news article page (High)
- #457: Fix button color contrast for WCAG AA compliance (High)
- #458: Complete Storybook stories for NewsCard (Medium)
- #459: Increase error handling test coverage (Medium)

---

## Automated Fixes Available

The following issues can be auto-fixed:

```bash
# Fix ESLint issues
npm run lint -- --fix

# Fix formatting
npm run format

# Remove unused imports
npm run organize-imports
```

**Estimated fix time:** 2 minutes

---

## Before/After Metrics

### Code Quality Improvements

- Test coverage: 75% → 92% (+17%)
- TypeScript coverage: 85% → 100% (+15%)
- ESLint warnings: 12 → 3 (-75%)
- Accessibility score: 70% → 88% (+18%)

### Outstanding Issues

- 1 critical (error handling)
- 3 warnings (non-blocking)
- 4 GitHub issues created

---

## Sign-off Recommendation

**Status:** ⚠️ **APPROVE WITH CONDITIONS**

This migration is high quality and follows KCVV standards well. However, the critical error handling issue should be addressed before merging to production.

### Required for Sign-off:

1. Add error boundary (15 minutes)
2. Fix color contrast (5 minutes)
3. Remove console.log (2 minutes)

**Estimated time to production-ready:** 30 minutes

### Optional Improvements:

- Complete Storybook stories
- Increase error test coverage
- Enhance documentation

---

## Next Steps

1. ✅ Review this report
2. ⏳ Fix critical issues (#456, color contrast)
3. ⏳ Address warnings (optional)
4. ⏳ Re-run quality review
5. ⏳ Create PR
6. ⏳ Merge to main

---

## Additional Notes

### Strengths

- Excellent test coverage
- Proper use of Effect Schema
- Clean TypeScript code
- Good component architecture
- ISR well configured

### Areas for Improvement

- Error handling completeness
- Storybook documentation depth
- README examples

### Overall Assessment

This is a solid migration that demonstrates good understanding of Next.js, Effect, and KCVV standards. With minor fixes, this will be production-ready code.

**Great job! 🎉**

---

_Generated by Quality Review Agent_
_For questions, review KCVV standards: `.claude/WORKFLOW.md`_

````

## Review Criteria

### TypeScript Quality
```typescript
interface TypeScriptChecks {
  strictMode: boolean
  noAnyWithoutComment: boolean
  allExportsTyped: boolean
  noImplicitAny: boolean
  properEnumUsage: boolean
}
````

### Effect Schema Checks

```typescript
interface SchemaChecks {
  allApiDataValidated: boolean;
  schemasProperlyStructured: boolean;
  errorHandlingPresent: boolean;
  noManualParsing: boolean;
  typeSafety: boolean;
}
```

### Storybook Checks

```typescript
interface StorybookChecks {
  storyExists: boolean;
  allVariantsDocumented: boolean;
  propsDocumented: boolean;
  visualRegressionReady: boolean;
  interactionTests: boolean;
}
```

### Test Coverage Checks

```typescript
interface TestChecks {
  overallCoverage: number; // Target: >80%
  branchCoverage: number;
  functionCoverage: number;
  lineCoverage: number;
  edgeCasesCovered: boolean;
  errorPathsTested: boolean;
}
```

## Automated Checks

The agent runs:

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Tests with coverage
npm run test -- --coverage

# Build
npm run build

# Storybook build
npm run build-storybook
```

## Manual Review Areas

What the agent manually reviews:

1. Code complexity and readability
2. Architecture and design patterns
3. Effect usage patterns
4. ISR strategy appropriateness
5. Accessibility beyond automated tools
6. Documentation quality
7. Component API design

## Scoring System

### Overall Score Calculation

```text
Overall Score = (
  Code Quality * 0.25 +
  Schema Usage * 0.15 +
  Storybook * 0.15 +
  Test Coverage * 0.20 +
  ISR Config * 0.10 +
  Accessibility * 0.10 +
  Documentation * 0.05
)
```

### Score Ranges

- 90-100: Excellent ✅
- 80-89: Good ✅
- 70-79: Acceptable ⚠️
- 60-69: Needs Improvement ⚠️
- <60: Requires Rework ❌

## Integration with Other Agents

### After component-migrator

```text
component-migrator completes
→ quality-reviewer validates
→ Reports issues
→ component-migrator fixes (if needed)
→ quality-reviewer re-validates
→ Approval
```

### Periodic Audits

```text
quality-reviewer can audit:
- Entire codebase
- Specific directory
- Recent PRs
- Pre-release validation
```

## GitHub Integration

### Issue Creation

For each problem found:

```markdown
**Title:** [Component] Issue description
**Labels:** quality, migration, [severity]
**Priority:** High/Medium/Low
**Assignee:** @current-user

**Description:**
[Detailed description]

**Current Code:**
[Code snippet]

**Recommended Fix:**
[Solution]

**Estimated Time:** X minutes
```

### PR Comments

Can comment on PRs with inline suggestions.

## Configuration

Create `.claude/agents/quality-reviewer/config.json`:

```json
{
  "strictMode": true,
  "testCoverageTarget": 80,
  "createGitHubIssues": true,
  "autoFix": false,
  "severityThresholds": {
    "critical": ["missing-error-handling", "accessibility-violation"],
    "warning": ["incomplete-stories", "low-coverage"],
    "info": ["documentation-improvements"]
  },
  "checks": {
    "typescript": true,
    "eslint": true,
    "tests": true,
    "storybook": true,
    "accessibility": true,
    "performance": true,
    "documentation": true
  }
}
```

## Reporting Options

### Console Report (Default)

Formatted markdown in terminal

### HTML Report

```bash
quality-reviewer --format=html --output=report.html
```

### JSON Report (CI/CD)

```bash
quality-reviewer --format=json --output=report.json
```

### GitHub PR Comment

Automatically comments on PR with review

## Continuous Quality

Can run automatically:

- On every commit (git hook)
- On PR creation
- Nightly audits
- Pre-release checks

## Limitations

- Cannot test actual user experience
- Limited to static analysis for some checks
- Cannot verify API correctness (only structure)
- Performance metrics are estimates
- Accessibility audit not exhaustive (manual testing still needed)

## Best Practices

1. Run quality review before creating PR
2. Address critical issues immediately
3. Plan warnings for next iteration
4. Use reports to track quality trends
5. Re-run after fixes
6. Keep standards configuration updated
