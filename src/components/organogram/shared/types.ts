/**
 * Shared Types for Organogram Prototypes
 *
 * Common interfaces and types used across all 3 prototype implementations.
 * Extends the existing OrgChartNode type from @/types/organogram with
 * additional properties needed for enhanced UX.
 */

import type { OrgChartNode } from "@/types/organogram";

/**
 * Contact card display variants
 */
export type ContactCardVariant = "compact" | "detailed" | "grid";

/**
 * Props for ContactCard component
 */
export interface ContactCardProps {
  /** Member data */
  member: OrgChartNode;

  /** Display variant */
  variant?: ContactCardVariant;

  /** Show quick action buttons (email/phone) */
  showQuickActions?: boolean;

  /** Show department badge */
  showDepartment?: boolean;

  /** Show expand/collapse indicator */
  showExpandIndicator?: boolean;

  /** Is this card currently expanded (for hierarchy view) */
  isExpanded?: boolean;

  /** Click handler */
  onClick?: (member: OrgChartNode) => void;

  /** Optional CSS class name */
  className?: string;

  /** Optional test ID */
  testId?: string;

  /** Number of responsibility paths this member is responsible for */
  responsibilityCount?: number;
}

/**
 * Props for ContactQuickActions component
 */
export interface ContactQuickActionsProps {
  /** Email address */
  email?: string;

  /** Phone number */
  phone?: string;

  /** Name (for mailto/tel labels) */
  name: string;

  /** Display size */
  size?: "sm" | "md" | "lg";

  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for SearchBar component
 */
export interface SearchBarProps {
  /** Current search value */
  value: string;

  /** Change handler */
  onChange: (value: string) => void;

  /** Available members to search */
  members: OrgChartNode[];

  /** Placeholder text */
  placeholder?: string;

  /** Show autocomplete dropdown */
  showAutocomplete?: boolean;

  /** Max autocomplete results */
  maxResults?: number;

  /** Select handler for autocomplete */
  onSelect?: (member: OrgChartNode) => void;

  /** Optional CSS class name */
  className?: string;
}

/**
 * Search result with score
 */
export interface SearchResult {
  member: OrgChartNode;
  score: number;
  matchedFields: string[];
}

/**
 * Props for DepartmentFilter component
 */
export interface DepartmentFilterProps {
  /** Current active department */
  value: "all" | "hoofdbestuur" | "jeugdbestuur";

  /** Change handler */
  onChange: (value: "all" | "hoofdbestuur" | "jeugdbestuur") => void;

  /** All members (for counting) */
  members: OrgChartNode[];

  /** Show member counts */
  showCounts?: boolean;

  /** Display style (DEPRECATED - use size instead) */
  variant?: "tabs" | "pills" | "buttons";

  /** Size variant (sm | md | lg) */
  size?: "sm" | "md" | "lg";

  /** Optional CSS class name */
  className?: string;
}

/**
 * Department option with count
 */
export interface DepartmentOption {
  value: "all" | "hoofdbestuur" | "jeugdbestuur";
  label: string;
  count: number;
}

/**
 * Expanded state map (for hierarchy prototypes)
 */
export type ExpandedState = Record<string, boolean>;

/**
 * Member with hierarchy metadata
 */
export interface MemberWithHierarchy extends OrgChartNode {
  /** Calculated depth in hierarchy */
  depth: number;

  /** Direct children */
  children: MemberWithHierarchy[];

  /** Number of total descendants */
  descendantCount: number;

  /** Path from root (array of parent IDs) */
  path: string[];
}

/**
 * Prototype evaluation criteria
 */
export interface EvaluationCriteria {
  /** Mobile UX score (1-5) */
  mobileUX: number;

  /** Desktop UX score (1-5) */
  desktopUX: number;

  /** Dual purpose (lookup + hierarchy) score (1-5) */
  dualPurpose: number;

  /** Accessibility score (1-5) */
  accessibility: number;

  /** Maintainability score (1-5) */
  maintainability: number;

  /** Performance score (1-5) */
  performance: number;

  /** Total weighted score */
  totalScore: number;

  /** User preference votes */
  preferenceVotes: number;

  /** Notes */
  notes: string;
}

/**
 * User testing result
 */
export interface UserTestingResult {
  /** Participant ID */
  participantId: string;

  /** Task completion times (in seconds) */
  taskTimes: Record<string, number>;

  /** Task success rates */
  taskSuccess: Record<string, boolean>;

  /** Number of clicks per task */
  taskClicks: Record<string, number>;

  /** SUS score (System Usability Scale) */
  susScore: number;

  /** Preferred prototype */
  preferredPrototype: "A" | "B" | "C";

  /** Feedback comments */
  comments: string;
}
