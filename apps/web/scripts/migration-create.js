#!/usr/bin/env node

/**
 * Migration Task Helper for Claude Code
 * Generates a formatted task description that Claude Code can understand
 * No manual tracking required - Claude Code handles everything
 */

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Migration Task Helper for Claude Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  npm run migration:create "Task Description"

Examples:
  npm run migration:create "Migrate team detail page"
  npm run migration:create "Add ranking page with table component"
  npm run migration:create "Implement player profile pages"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 This generates a Claude Code-friendly task template.
   Just copy the output and give it to Claude Code!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  process.exit(0);
}

const taskName = args.join(" ");

// Generate Claude Code-friendly task description
const template = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MIGRATION TASK: ${taskName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: ${taskName}

Requirements:
- Implement pixel-perfect recreation from Gatsby version
- **Create Storybook stories FIRST (visual source of truth)**
- Use Effect Schema for data validation
- Write Vitest tests (>80% coverage target)
- Visual regression tests via Playwright + Storybook
- Add TypeScript types (strict mode)
- Use Tailwind CSS for styling
- Implement ISR with appropriate revalidate time

Checklist:
□ Create/update page component(s)
□ Create/update child components
□ **Create Storybook stories for each component (visual source of truth)**
□ Add Effect Schema(s) if needed
□ Create data mapper(s) if needed
□ Write Vitest unit tests
□ Add visual regression tests
□ Update MIGRATION_PLAN.md phase status
□ Test responsiveness (mobile/tablet/desktop)
□ Verify components in Storybook
□ Run quality checks (npm run check-all)

Quality Gates:
- All tests passing
- No TypeScript errors
- No ESLint errors
- Storybook stories created
- Visual regression tests pass

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 GIVE THIS TO CLAUDE CODE:

"Help me with this migration task: ${taskName}

Follow the KCVV migration standards:
- **Storybook stories FIRST (visual source of truth)**
- Pixel-perfect recreation verified in Storybook
- Visual regression testing via Playwright + Storybook
- Effect Schema validation
- Full test coverage
- TypeScript strict mode

When done:
1. Verify components in Storybook (npm run storybook)
2. Update MIGRATION_PLAN.md with progress
3. Run 'npm run check-all' to verify
4. Run 'npm run migration:status' to see updated progress"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

console.log(template);

// Optional: Save to clipboard if available
try {
  const { execSync } = require("child_process");
  // Use stdin instead of echo to avoid escaping issues
  execSync("pbcopy", {
    input: template,
    stdio: ["pipe", "ignore", "ignore"],
  });
  console.log("\n✅ Task template copied to clipboard!\n");
} catch (e) {
  // Clipboard not available, that's fine
  console.log("\n💡 Copy the task template above and give it to Claude Code\n");
}
