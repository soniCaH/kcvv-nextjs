/**
 * Markdown Parser for Responsibility Q&A Files
 *
 * Parses markdown files with YAML frontmatter into ResponsibilityPath objects.
 *
 * Format:
 * - YAML frontmatter for metadata (id, roles, keywords, etc.)
 * - Markdown H1 for summary
 * - Markdown H2 "Steps" section
 * - Markdown H3 for individual steps (e.g., "### 1. Description")
 * - Bold labels for optional step metadata (**Contact:**, **Email:**, **Link:**)
 */

import matter from "gray-matter";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { Root, Heading, Paragraph, Text, Strong } from "mdast";

/**
 * Parsed frontmatter structure
 */
interface Frontmatter {
  id: string;
  roles: string[];
  question: string;
  keywords: string[];
  category: string;
  icon?: string;
  primaryContact: {
    role: string;
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    orgLink?: string;
  };
}

/**
 * Contact extracted from step metadata
 */
interface StepContact {
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Parsed solution step
 */
interface ParsedStep {
  order: number;
  description: string;
  link?: string;
  contact?: StepContact;
}

/**
 * Complete parsed responsibility path
 */
export interface ParsedResponsibilityPath {
  id: string;
  role: string[];
  question: string;
  keywords: string[];
  summary: string;
  category: string;
  icon?: string;
  primaryContact: {
    role: string;
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    orgLink?: string;
  };
  steps: ParsedStep[];
}

/**
 * Type guard to check if a partial step is complete
 */
function isCompleteStep(step: Partial<ParsedStep> | null): step is ParsedStep {
  return (
    step !== null &&
    typeof step.order === "number" &&
    typeof step.description === "string"
  );
}

/**
 * Parse markdown content to extract summary and steps
 */
function parseMarkdownContent(content: string): {
  summary: string;
  steps: ParsedStep[];
} {
  const tree = remark.parse(content);
  let summary = "";
  const steps: ParsedStep[] = [];
  let inStepsSection = false;
  let currentStep: Partial<ParsedStep> | null = null;

  visit(tree, (node, index, parent) => {
    // Extract summary from first H1
    if (node.type === "heading" && (node as Heading).depth === 1 && !summary) {
      // Get next paragraph as summary
      if (parent && index !== undefined) {
        const nextNode = (parent as Root).children[index + 1];
        if (nextNode && nextNode.type === "paragraph") {
          summary = extractText(nextNode as Paragraph);
        }
      }
    }

    // Detect Steps section
    if (node.type === "heading" && (node as Heading).depth === 2) {
      const headingText = extractText(node as Heading);
      if (headingText.toLowerCase() === "steps") {
        inStepsSection = true;
      }
    }

    // Parse individual steps (H3 headings)
    if (
      inStepsSection &&
      node.type === "heading" &&
      (node as Heading).depth === 3
    ) {
      // Save previous step if exists
      if (isCompleteStep(currentStep)) {
        steps.push(currentStep);
      }

      // Parse step heading (e.g., "### 1. Description")
      const headingText = extractText(node as Heading);
      const match = headingText.match(/^(\d+)\.\s+(.+)$/);

      if (match) {
        const [, orderStr, description] = match;
        currentStep = {
          order: parseInt(orderStr, 10),
          description: description.trim(),
        };
      } else {
        console.warn(
          `Warning: Step heading doesn't match expected format: "${headingText}"`,
        );
        currentStep = null;
      }
    }

    // Parse step metadata (paragraphs with bold labels after step heading)
    if (inStepsSection && currentStep && node.type === "paragraph" && parent) {
      const para = node as Paragraph;
      const metadata = extractStepMetadata(para);

      if (metadata.contact) currentStep.contact = metadata.contact;
      if (metadata.link) currentStep.link = metadata.link;
    }
  });

  // Save last step
  if (isCompleteStep(currentStep)) {
    steps.push(currentStep);
  }

  return { summary, steps };
}

/**
 * Extract plain text from markdown node
 */
function extractText(node: Heading | Paragraph | Text | Strong): string {
  if (node.type === "text") {
    return node.value;
  }

  if ("children" in node) {
    return node.children
      .map((child) => {
        if (child.type === "text") return child.value;
        if ("children" in child) {
          // Recursively extract text from any node with children
          return extractText(child as Heading | Paragraph | Text | Strong);
        }
        return "";
      })
      .join("");
  }

  return "";
}

/**
 * Extract metadata from paragraph with bold labels
 *
 * Looks for patterns like:
 * - **Contact:** Role Name
 * - **Email:** email@example.com
 * - **Link:** /path/to/page
 */
function extractStepMetadata(para: Paragraph): {
  contact?: StepContact;
  link?: string;
} {
  const result: { contact?: StepContact; link?: string } = {};
  const contact: StepContact = {};

  // Convert paragraph to text for easier parsing
  const lines: string[] = [];
  let currentLine = "";

  para.children.forEach((child) => {
    if (child.type === "strong") {
      // Bold text - likely a label
      currentLine += `**${extractText(child as Strong)}**`;
    } else if (child.type === "text") {
      currentLine += child.value;
    }

    // Split on newlines if present
    if (child.type === "text" && child.value.includes("\n")) {
      const parts = child.value.split("\n");
      currentLine += parts[0];
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = parts.slice(1).join("\n");
    }
  });

  if (currentLine.trim()) lines.push(currentLine.trim());

  // Parse each line for metadata
  lines.forEach((line) => {
    const contactMatch = line.match(/\*\*Contact:\*\*\s*(.+)/);
    const nameMatch = line.match(/\*\*Name:\*\*\s*(.+)/);
    const emailMatch = line.match(/\*\*Email:\*\*\s*(.+)/);
    const phoneMatch = line.match(/\*\*Phone:\*\*\s*(.+)/);
    const linkMatch = line.match(/\*\*Link:\*\*\s*(.+)/);

    if (contactMatch) contact.role = contactMatch[1].trim();
    if (nameMatch) contact.name = nameMatch[1].trim();
    if (emailMatch) contact.email = emailMatch[1].trim();
    if (phoneMatch) contact.phone = phoneMatch[1].trim();
    if (linkMatch) result.link = linkMatch[1].trim();
  });

  if (Object.keys(contact).length > 0) {
    result.contact = contact;
  }

  return result;
}

/**
 * Parse a single markdown file
 *
 * @param content - Raw markdown file content
 * @param filename - Filename for error messages
 * @returns Parsed ResponsibilityPath object
 * @throws Error if parsing fails
 */
export function parseResponsibilityMarkdown(
  content: string,
  filename: string,
): ParsedResponsibilityPath {
  try {
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    const frontmatter = data as Frontmatter;

    // Validate required frontmatter fields
    if (!frontmatter.id) {
      throw new Error("Missing required field: id");
    }
    if (!frontmatter.roles || !Array.isArray(frontmatter.roles)) {
      throw new Error("Missing or invalid field: roles (must be array)");
    }
    if (!frontmatter.question) {
      throw new Error("Missing required field: question");
    }
    if (!frontmatter.keywords || !Array.isArray(frontmatter.keywords)) {
      throw new Error("Missing or invalid field: keywords (must be array)");
    }
    if (!frontmatter.category) {
      throw new Error("Missing required field: category");
    }
    if (!frontmatter.primaryContact || !frontmatter.primaryContact.role) {
      throw new Error("Missing required field: primaryContact.role");
    }

    // Parse markdown content
    const { summary, steps } = parseMarkdownContent(markdownContent);

    if (!summary) {
      throw new Error(
        "No summary found (expected H1 heading followed by paragraph)",
      );
    }

    if (steps.length === 0) {
      throw new Error(
        "No steps found (expected ## Steps section with ### step headings)",
      );
    }

    // Construct result
    return {
      id: frontmatter.id,
      role: frontmatter.roles,
      question: frontmatter.question,
      keywords: frontmatter.keywords,
      summary,
      category: frontmatter.category,
      icon: frontmatter.icon,
      primaryContact: frontmatter.primaryContact,
      steps,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse ${filename}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
