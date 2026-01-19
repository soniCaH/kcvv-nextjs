#!/usr/bin/env node

/**
 * Migration Status Tracker
 * Auto-detects migration progress from codebase + MIGRATION_PLAN.md
 * Designed to work with Claude Code's automated workflow
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

/**
 * Print messages to stdout using the provided ANSI color code and reset the color after output.
 * @param {string} color - ANSI escape sequence for the desired text color (e.g., from the `colors` map).
 * @param {...any} args - Values to print; forwarded to console.log.
 */
function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

/**
 * Detect migration-related file counts in the repository's src directory.
 *
 * Returns counts for commonly migrated artifact types so callers can infer
 * migration progress from the codebase.
 *
 * @returns {{components: number, pages: number, apiRoutes: number, schemas: number, tests: number, stories: number, mappers: number}}
 * An object with the following numeric properties:
 * - `components`: Number of `.tsx` files under `src/components` excluding test/spec/story files.
 * - `pages`: Number of `page.tsx` files under `src/app`.
 * - `apiRoutes`: Number of `route.ts` or `route.tsx` files under `src/app`.
 * - `schemas`: Number of `*.schema.ts` files under `src/lib/effect/schemas` excluding test files.
 * - `tests`: Number of test/spec files (`.test` or `.spec` with `.ts`/`.tsx`) under `src`.
 * - `stories`: Number of `.stories.ts` or `.stories.tsx` files under `src`.
 * - `mappers`: Number of `*.mapper.ts` files under `src/lib/mappers` excluding test files.
 */
function detectMigratedContent() {
  const srcDir = path.join(process.cwd(), "src");

  return {
    // Count components (excluding tests/stories)
    components: countFiles(
      path.join(srcDir, "components"),
      /\.tsx$/,
      /\.(test|spec|stories)\./,
    ),

    // Count pages in app directory
    pages: countFiles(path.join(srcDir, "app"), /page\.tsx$/),

    // Count API routes
    apiRoutes: countFiles(path.join(srcDir, "app"), /route\.tsx?$/),

    // Count schemas (Effect schemas)
    schemas: countFiles(
      path.join(srcDir, "lib/effect/schemas"),
      /\.schema\.ts$/,
      /\.test\./,
    ),

    // Count tests
    tests: countFiles(srcDir, /\.(test|spec)\.(ts|tsx)$/),

    // Count stories
    stories: countFiles(srcDir, /\.stories\.(ts|tsx)$/),

    // Count mappers
    mappers: countFiles(
      path.join(srcDir, "lib/mappers"),
      /\.mapper\.ts$/,
      /\.test\./,
    ),
  };
}

/**
 * Recursively counts files under a directory that match an include pattern and do not match an optional exclude pattern.
 * @param {string} dir - Path to the directory to scan.
 * @param {RegExp} includePattern - Regular expression that file names must match to be counted.
 * @param {RegExp|null} [excludePattern=null] - Optional regular expression; matching file names are excluded.
 * @returns {number} The number of files matching the criteria (returns 0 if the directory does not exist).
 */
function countFiles(dir, includePattern, excludePattern = null) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const walk = (directory) => {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filepath = path.join(directory, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory()) {
        walk(filepath);
      } else if (includePattern.test(file)) {
        if (!excludePattern || !excludePattern.test(file)) {
          count++;
        }
      }
    }
  };

  walk(dir);
  return count;
}

/**
 * Extract migration phases from MIGRATION_PLAN.md into a structured array.
 *
 * Reads MIGRATION_PLAN.md in the repository root and parses lines that match
 * phase headers (e.g., "## Phase 1: Name (Status) ✅"). For each matched phase
 * returns an object with the phase number, name, raw status text, derived
 * state, and the emoji found on the line.
 *
 * @returns {Array<{number: number, name: string, status: string, state: 'completed' | 'in-progress' | 'not-started', emoji: string}> | null}
 * An array of phase objects when the plan file exists and contains phase headers,
 * or `null` if MIGRATION_PLAN.md is not present. The `state` is one of
 * "completed", "in-progress", or "not-started" determined from the line content.
 */
function parseMigrationPlan() {
  const planPath = path.join(process.cwd(), "MIGRATION_PLAN.md");

  if (!fs.existsSync(planPath)) {
    return null;
  }

  const content = fs.readFileSync(planPath, "utf-8");
  const lines = content.split("\n");

  const phases = [];

  for (const line of lines) {
    // Match phase headers: ## Phase X: Name (Status) STATUS
    const phaseMatch = line.match(
      /^##\s+Phase\s+(\d+):\s+(.+?)\s+(.+?)\s+(✅|⏳|❌|🚧)/,
    );
    if (phaseMatch) {
      const [, number, name, status, emoji] = phaseMatch;

      let state = "not-started";
      if (line.includes("✅ COMPLETED") || line.includes("✅ COMPLETE"))
        state = "completed";
      else if (
        line.includes("🚧 IN PROGRESS") ||
        line.includes("✅ IN PROGRESS")
      )
        state = "in-progress";
      else if (line.includes("⏳ NOT STARTED")) state = "not-started";

      phases.push({
        number: parseInt(number),
        name: name.trim(),
        status: status.trim(),
        state,
        emoji,
      });
    }
  }

  return phases;
}

/**
 * Render a migration status dashboard to the console summarizing codebase metrics and migration phases.
 *
 * Displays auto-detected counts for components, pages, schemas, mappers, tests, and stories; computes and shows test and story coverage percentages; parses MIGRATION_PLAN.md to list migration phases with their states and overall progress; and prints quick command suggestions.
 */
function displayStatus() {
  log(
    colors.bold + colors.cyan,
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );
  log(colors.bold + colors.cyan, "  🚀 KCVV Next.js Migration Status");
  log(
    colors.bold + colors.cyan,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
  );

  // Auto-detect migrated content
  const detected = detectMigratedContent();
  const phases = parseMigrationPlan();

  // Display auto-detected stats
  log(colors.bold, "📊 Codebase Stats (Auto-Detected):");
  console.log();
  log(
    colors.green,
    `  ✅ Components:  ${colors.bold}${detected.components}${colors.reset}${colors.green} components`,
  );
  log(
    colors.green,
    `  ✅ Pages:       ${colors.bold}${detected.pages}${colors.reset}${colors.green} pages`,
  );
  log(
    colors.blue,
    `  📝 Schemas:     ${colors.bold}${detected.schemas}${colors.reset}${colors.blue} Effect schemas`,
  );
  log(
    colors.blue,
    `  🔄 Mappers:     ${colors.bold}${detected.mappers}${colors.reset}${colors.blue} mappers`,
  );
  log(
    colors.yellow,
    `  🧪 Tests:       ${colors.bold}${detected.tests}${colors.reset}${colors.yellow} test files`,
  );
  log(
    colors.yellow,
    `  📖 Stories:     ${colors.bold}${detected.stories}${colors.reset}${colors.yellow} Storybook stories`,
  );

  // Test coverage percentages
  const testCoverage =
    detected.components > 0
      ? Math.round((detected.tests / detected.components) * 100)
      : 0;
  const storyCoverage =
    detected.components > 0
      ? Math.round((detected.stories / detected.components) * 100)
      : 0;

  console.log();
  log(colors.bold, "📈 Quality Metrics:");
  console.log();
  const testColor =
    testCoverage >= 80
      ? colors.green
      : testCoverage >= 50
        ? colors.yellow
        : colors.red;
  const storyColor =
    storyCoverage >= 50
      ? colors.green
      : storyCoverage >= 30
        ? colors.yellow
        : colors.red;
  log(testColor, `  Test Coverage:  ${testCoverage}%`);
  log(storyColor, `  Story Coverage: ${storyCoverage}%`);

  // Display phase progress
  if (phases && phases.length > 0) {
    console.log();
    log(
      colors.bold + colors.cyan,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    log(colors.bold, "\n📋 Migration Phases:");
    console.log();

    const completed = phases.filter((p) => p.state === "completed");
    const inProgress = phases.filter((p) => p.state === "in-progress");
    const notStarted = phases.filter((p) => p.state === "not-started");

    completed.forEach((phase) => {
      log(colors.green, `  ✅ Phase ${phase.number}: ${phase.name}`);
    });

    inProgress.forEach((phase) => {
      log(
        colors.yellow,
        `  🚧 Phase ${phase.number}: ${phase.name} (IN PROGRESS)`,
      );
    });

    if (notStarted.length > 0) {
      console.log();
      log(colors.gray, "  Upcoming phases:");
      notStarted.slice(0, 3).forEach((phase) => {
        log(colors.gray, `  ⏳ Phase ${phase.number}: ${phase.name}`);
      });
      if (notStarted.length > 3) {
        log(colors.gray, `  ... and ${notStarted.length - 3} more phases`);
      }
    }

    // Overall phase progress
    const phasePercentage = Math.round(
      (completed.length / phases.length) * 100,
    );
    console.log();
    log(
      colors.bold,
      `Phase Progress: ${completed.length}/${phases.length} phases (${phasePercentage}%)`,
    );
  }

  // Tips and next steps
  console.log();
  log(
    colors.bold + colors.cyan,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );
  log(colors.bold, "\n💡 Quick Commands:");
  console.log();
  log(colors.gray, "  npm run test              Run all unit tests");
  log(colors.gray, "  npm run storybook         View component documentation");
  log(colors.gray, "  npm run type-check        TypeScript type checking");
  log(colors.gray, "  npm run check-all         Run all quality checks");
  console.log();
  log(
    colors.bold + colors.cyan,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
  );
}

// Run
displayStatus();
