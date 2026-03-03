#!/usr/bin/env tsx

/**
 * Migration Script: TypeScript → Markdown
 *
 * Converts existing responsibility-paths.ts to markdown files
 * for easier editing by non-technical users.
 *
 * Usage: npx tsx scripts/migrate-responsibility-to-markdown.ts
 */

import fs from "fs/promises";
import path from "path";
import { responsibilityPaths } from "../src/data/responsibility-paths";
import type {
  ResponsibilityPath,
  Contact,
  SolutionStep,
} from "../src/types/responsibility";

const CONTENT_DIR = path.join(process.cwd(), "content/responsibility");

/**
 * Generate markdown content from a ResponsibilityPath object
 */
function generateMarkdown(item: ResponsibilityPath): string {
  const parts: string[] = [];

  // YAML Frontmatter
  parts.push("---");
  parts.push(`id: ${item.id}`);

  // Roles array
  parts.push("roles:");
  item.role.forEach((role) => {
    parts.push(`  - ${role}`);
  });

  parts.push(`question: ${item.question}`);

  // Keywords array
  parts.push("keywords:");
  item.keywords.forEach((keyword) => {
    parts.push(`  - ${keyword}`);
  });

  parts.push(`category: ${item.category}`);

  if (item.icon) {
    parts.push(`icon: ${item.icon}`);
  }

  // Primary contact
  parts.push("primaryContact:");
  parts.push(`  role: ${item.primaryContact.role}`);
  if (item.primaryContact.name) {
    parts.push(`  name: ${item.primaryContact.name}`);
  }
  if (item.primaryContact.email) {
    parts.push(`  email: ${item.primaryContact.email}`);
  }
  if (item.primaryContact.phone) {
    parts.push(`  phone: ${item.primaryContact.phone}`);
  }
  if (item.primaryContact.department) {
    parts.push(`  department: ${item.primaryContact.department}`);
  }
  if (item.primaryContact.orgLink) {
    parts.push(`  orgLink: ${item.primaryContact.orgLink}`);
  }

  parts.push("---");
  parts.push("");

  // Summary section
  parts.push("# Summary");
  parts.push("");
  parts.push(item.summary);
  parts.push("");

  // Steps section
  if (item.steps.length > 0) {
    parts.push("## Steps");
    parts.push("");

    item.steps.forEach((step) => {
      // Step heading with number
      parts.push(`### ${step.order}. ${step.description}`);
      parts.push("");

      // Optional contact for this step
      if (step.contact) {
        if (step.contact.role) {
          parts.push(`**Contact:** ${step.contact.role}`);
        }
        if (step.contact.name) {
          parts.push(`**Name:** ${step.contact.name}`);
        }
        if (step.contact.email) {
          parts.push(`**Email:** ${step.contact.email}`);
        }
        if (step.contact.phone) {
          parts.push(`**Phone:** ${step.contact.phone}`);
        }
        parts.push("");
      }

      // Optional link for this step
      if (step.link) {
        parts.push(`**Link:** ${step.link}`);
        parts.push("");
      }
    });
  }

  return parts.join("\n");
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🚀 Starting migration: TypeScript → Markdown\n");

  // Ensure content directory exists
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  console.log(`✅ Created directory: ${CONTENT_DIR}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const item of responsibilityPaths) {
    try {
      const markdown = generateMarkdown(item);
      const filename = `${item.id}.md`;
      const filepath = path.join(CONTENT_DIR, filename);

      await fs.writeFile(filepath, markdown, "utf-8");
      console.log(`✅ ${filename}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to migrate ${item.id}:`, error);
      errorCount++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Migration Complete!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Success: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} files`);
  }
  console.log(`📁 Output: ${CONTENT_DIR}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

// Run migration
migrate().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
