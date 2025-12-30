#!/usr/bin/env tsx

/**
 * Build Script: Markdown → TypeScript
 *
 * Reads markdown files from content/responsibility/
 * Parses and validates them with Effect Schema
 * Generates TypeScript file: src/data/responsibility-paths.ts
 *
 * Usage: npx tsx scripts/generate-responsibility-data.ts
 * Watch: npx tsx watch scripts/generate-responsibility-data.ts
 */

import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { Schema as S } from "effect";
import { parseResponsibilityMarkdown } from "./parsers/responsibility-markdown";
import {
  ResponsibilityPathsArraySchema,
  type ResponsibilityPath,
  type SolutionStep,
} from "../src/lib/effect/schemas/responsibility.schema";

const CONTENT_DIR = path.join(process.cwd(), "content/responsibility");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "src/data/responsibility-paths.ts",
);

/**
 * Read all markdown files from content directory
 */
async function readMarkdownFiles(): Promise<
  Array<{ filename: string; content: string }>
> {
  const files = await fs.readdir(CONTENT_DIR);
  const markdownFiles = files.filter(
    (file) => file.endsWith(".md") && file !== "README.md",
  );

  const contents = await Promise.all(
    markdownFiles.map(async (filename) => {
      const filepath = path.join(CONTENT_DIR, filename);
      const content = await fs.readFile(filepath, "utf-8");
      return { filename, content };
    }),
  );

  return contents;
}

/**
 * Parse all markdown files
 */
async function parseAllFiles() {
  console.log("📖 Reading markdown files...\n");

  const files = await readMarkdownFiles();
  console.log(`Found ${files.length} markdown files\n`);

  const parsed = [];
  let errorCount = 0;

  for (const { filename, content } of files) {
    try {
      const result = parseResponsibilityMarkdown(content, filename);
      parsed.push(result);
      console.log(`✅ ${filename}`);
    } catch (error) {
      console.error(`❌ ${filename}`);
      console.error(
        `   ${error instanceof Error ? error.message : String(error)}\n`,
      );
      errorCount++;
    }
  }

  if (errorCount > 0) {
    throw new Error(
      `\n❌ Failed to parse ${errorCount} file(s). Fix errors and try again.`,
    );
  }

  console.log(`\n✅ Successfully parsed ${parsed.length} files\n`);

  return parsed;
}

/**
 * Validate parsed data with Effect Schema
 */
function validateData(data: unknown) {
  console.log("🔍 Validating with Effect Schema...\n");

  const result = S.decodeUnknownEither(ResponsibilityPathsArraySchema)(data);

  if (result._tag === "Left") {
    console.error("❌ Validation failed:\n");
    console.error(result.left);
    throw new Error("Schema validation failed");
  }

  console.log("✅ Validation passed\n");

  return result.right;
}

/**
 * Generate TypeScript file content
 */
function generateTypeScriptFile(data: readonly ResponsibilityPath[]): string {
  const lines: string[] = [];

  // Header comment
  lines.push("/**");
  lines.push(" * Responsibility Paths Data");
  lines.push(" *");
  lines.push(" * AUTO-GENERATED - DO NOT EDIT MANUALLY");
  lines.push(" *");
  lines.push(
    " * This file is generated from markdown files in content/responsibility/",
  );
  lines.push(
    " * To update, edit the markdown files and run: npm run build:responsibility",
  );
  lines.push(" *");
  lines.push(" * Source: content/responsibility/*.md");
  lines.push(" * Generator: scripts/generate-responsibility-data.ts");
  lines.push(" * Schema: src/lib/effect/schemas/responsibility.schema.ts");
  lines.push(" */");
  lines.push("");

  // Import types
  lines.push(
    "import type { ResponsibilityPath } from '@/types/responsibility'",
  );
  lines.push("");

  // Export array
  lines.push("export const responsibilityPaths: ResponsibilityPath[] = [");

  // Generate each item
  data.forEach((item, index) => {
    if (index > 0) lines.push("");

    lines.push("  {");
    lines.push(`    id: '${item.id}',`);
    lines.push(
      `    role: [${item.role.map((r: string) => `'${r}'`).join(", ")}],`,
    );
    lines.push(`    question: '${escapeString(item.question)}',`);
    lines.push(
      `    keywords: [${item.keywords.map((k: string) => `'${escapeString(k)}'`).join(", ")}],`,
    );
    lines.push(`    summary: '${escapeString(item.summary)}',`);
    lines.push(`    category: '${item.category}',`);

    if (item.icon) {
      lines.push(`    icon: '${item.icon}',`);
    }

    // Primary contact
    lines.push("    primaryContact: {");
    lines.push(`      role: '${escapeString(item.primaryContact.role)}',`);
    if (item.primaryContact.name) {
      lines.push(`      name: '${escapeString(item.primaryContact.name)}',`);
    }
    if (item.primaryContact.email) {
      lines.push(`      email: '${escapeString(item.primaryContact.email)}',`);
    }
    if (item.primaryContact.phone) {
      lines.push(`      phone: '${escapeString(item.primaryContact.phone)}',`);
    }
    if (item.primaryContact.department) {
      lines.push(
        `      department: '${escapeString(item.primaryContact.department)}',`,
      );
    }
    if (item.primaryContact.orgLink) {
      lines.push(
        `      orgLink: '${escapeString(item.primaryContact.orgLink)}',`,
      );
    }
    lines.push("    },");

    // Steps
    lines.push("    steps: [");
    item.steps.forEach((step: SolutionStep) => {
      lines.push("      {");
      lines.push(`        order: ${step.order},`);
      lines.push(`        description: '${escapeString(step.description)}',`);

      if (step.link) {
        lines.push(`        link: '${escapeString(step.link)}',`);
      }

      if (step.contact) {
        lines.push("        contact: {");
        if (step.contact.role) {
          lines.push(`          role: '${escapeString(step.contact.role)}',`);
        }
        if (step.contact.name) {
          lines.push(`          name: '${escapeString(step.contact.name)}',`);
        }
        if (step.contact.email) {
          lines.push(`          email: '${escapeString(step.contact.email)}',`);
        }
        if (step.contact.phone) {
          lines.push(`          phone: '${escapeString(step.contact.phone)}',`);
        }
        lines.push("        },");
      }

      lines.push("      },");
    });
    lines.push("    ],");

    lines.push("  },");
  });

  lines.push("]");
  lines.push("");

  // Add userRoles export (static list)
  lines.push("/**");
  lines.push(" * User roles with labels");
  lines.push(" * Used for role selector UI");
  lines.push(" */");
  lines.push("export const userRoles: { value: string; label: string }[] = [");
  lines.push("  { value: 'speler', label: 'Speler' },");
  lines.push("  { value: 'ouder', label: 'Ouder' },");
  lines.push("  { value: 'trainer', label: 'Trainer' },");
  lines.push("  { value: 'supporter', label: 'Supporter' },");
  lines.push("  { value: 'niet-lid', label: 'Niet-lid' },");
  lines.push("]");
  lines.push("");

  return lines.join("\n");
}

/**
 * Escape string for TypeScript string literal
 */
function escapeString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

/**
 * Write generated TypeScript to file
 */
async function writeTypeScriptFile(content: string) {
  console.log(`📝 Writing TypeScript file...\n`);
  console.log(`   Output: ${OUTPUT_FILE}\n`);

  await fs.writeFile(OUTPUT_FILE, content, "utf-8");

  console.log("✅ File written successfully\n");
}

/**
 * Format file with Prettier
 */
async function formatWithPrettier(filePath: string): Promise<void> {
  console.log("🎨 Formatting with Prettier...\n");

  return new Promise((resolve, reject) => {
    const prettier = spawn("npx", ["prettier", "--write", filePath], {
      stdio: "inherit",
    });

    prettier.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Formatting complete\n");
        resolve();
      } else {
        reject(new Error(`Prettier exited with code ${code}`));
      }
    });

    prettier.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Responsibility Q&A Build Script");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // Parse markdown files
    const parsed = await parseAllFiles();

    // Validate with Effect Schema
    const validated = validateData(parsed);

    // Generate TypeScript
    const typescript = generateTypeScriptFile(validated);

    // Write to file
    await writeTypeScriptFile(typescript);

    // Format with Prettier
    await formatWithPrettier(OUTPUT_FILE);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ✅ Build Complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Generated: ${validated.length} responsibility paths`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("  ❌ Build Failed!");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(error);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
}

// Run the build
main();
