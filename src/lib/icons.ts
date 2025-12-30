/**
 * Icon System - Lucide React
 *
 * Centralized icon configuration using Lucide React.
 * Professional outline icons with consistent stroke weight.
 *
 * @see https://lucide.dev
 */

import {
  // Navigation & UI
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Check,

  // Social
  Facebook,
  Twitter,
  Instagram,

  // Content & Document
  FileText,
  Clipboard,
  ClipboardList,
  Newspaper,
  Tag,
  Calendar,
  CalendarDays,
  Clock,

  // Communication
  Mail,
  Phone,
  Smartphone,

  // People & Organization
  User,
  Users,
  GraduationCap,
  UserSearch,

  // Sports & Activities
  Trophy,
  Activity,
  Dumbbell,

  // Medical & Safety
  Heart,
  HeartPulse,
  Shield,
  ShieldAlert,

  // Business
  Handshake,

  // Misc
  Plus,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Icon components map
 * Used to get icon component by name string
 */
export const icons = {
  // Navigation & UI
  menu: Menu,
  x: X,
  search: Search,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  'external-link': ExternalLink,
  check: Check,

  // Social
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,

  // Content & Document
  'file-text': FileText,
  clipboard: Clipboard,
  'clipboard-list': ClipboardList,
  newspaper: Newspaper,
  tag: Tag,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  clock: Clock,

  // Communication
  mail: Mail,
  phone: Phone,
  smartphone: Smartphone,

  // People & Organization
  user: User,
  users: Users,
  'graduation-cap': GraduationCap,
  'user-search': UserSearch,

  // Sports & Activities
  trophy: Trophy,
  activity: Activity,
  dumbbell: Dumbbell,

  // Medical & Safety
  heart: Heart,
  'heart-pulse': HeartPulse,
  shield: Shield,
  'shield-alert': ShieldAlert,

  // Business
  handshake: Handshake,

  // Misc
  plus: Plus,
  zap: Zap,
} as const

export type IconName = keyof typeof icons

/**
 * Get icon component by name
 */
export function getIcon(name: IconName): LucideIcon {
  return icons[name]
}

/**
 * Responsibility category icon mapping
 * Maps category to appropriate Lucide icon
 */
export const categoryIcons = {
  commercieel: 'handshake',
  medisch: 'heart',
  administratief: 'file-text',
  gedrag: 'shield',
  algemeen: 'users',
  sportief: 'trophy',
} as const satisfies Record<string, IconName>

/**
 * Emoji to Lucide icon mapping
 * Used for backward compatibility during migration
 */
export const emojiToIcon = {
  '🤝': 'handshake',
  '💪': 'zap',
  '📝': 'file-text',
  '⚽': 'trophy',
  '📋': 'clipboard-list',
  '🛡️': 'shield',
  '🏥': 'heart',
  '📱': 'smartphone',
  '👤': 'user',
  '🎓': 'graduation-cap',
  '📅': 'calendar',
  '🔍': 'search',
} as const satisfies Record<string, IconName>

/**
 * Export all icons for direct use
 */
export {
  // Navigation & UI
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Check,

  // Social
  Facebook,
  Twitter,
  Instagram,

  // Content & Document
  FileText,
  Clipboard,
  ClipboardList,
  Newspaper,
  Tag,
  Calendar,
  CalendarDays,
  Clock,

  // Communication
  Mail,
  Phone,
  Smartphone,

  // People & Organization
  User,
  Users,
  GraduationCap,
  UserSearch,

  // Sports & Activities
  Trophy,
  Activity,
  Dumbbell,

  // Medical & Safety
  Heart,
  HeartPulse,
  Shield,
  ShieldAlert,

  // Business
  Handshake,

  // Misc
  Plus,
  Zap,
  type LucideIcon,
}
