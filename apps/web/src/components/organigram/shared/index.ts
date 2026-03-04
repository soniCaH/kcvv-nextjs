/**
 * Shared Organigram Prototype Components
 *
 * Reusable components used across all 3 organigram prototypes.
 * These provide a consistent foundation and visual design.
 */

export { ContactCard } from "./ContactCard";
export { ContactQuickActions } from "./ContactQuickActions";
export { SearchBar } from "./SearchBar";
export { DepartmentFilter } from "./DepartmentFilter";
export { MobileBottomNav } from "./MobileBottomNav";
export { KeyboardShortcuts } from "./KeyboardShortcuts";
export { SkipLink } from "./SkipLink";
export {
  ScreenReaderAnnouncer,
  useScreenReaderAnnouncement,
} from "./ScreenReaderAnnouncer";

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
