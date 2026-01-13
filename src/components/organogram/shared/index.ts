/**
 * Shared Organogram Prototype Components
 *
 * Reusable components used across all 3 organogram prototypes.
 * These provide a consistent foundation and visual design.
 */

export { ContactCard } from "./ContactCard";
export { ContactQuickActions } from "./ContactQuickActions";
export { SearchBar } from "./SearchBar";
export { DepartmentFilter } from "./DepartmentFilter";
export { MobileBottomNav } from "./MobileBottomNav";

export type {
  ContactCardProps,
  ContactCardVariant,
  ContactQuickActionsProps,
  SearchBarProps,
  SearchResult,
  DepartmentFilterProps,
  DepartmentOption,
  ExpandedState,
  MemberWithHierarchy,
  EvaluationCriteria,
  UserTestingResult,
} from "./types";
