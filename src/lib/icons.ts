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
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Check,
  CircleHelp,

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
  MessageCircle,

  // People & Organization
  User,
  Users,
  UserPlus,
  GraduationCap,
  UserSearch,

  // Location & Measurement
  MapPin,
  Ruler,

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

  // Layout & Views
  LayoutGrid,
  Network,

  // Misc
  Plus,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon components map
 * Used to get icon component by name string
 */
export const icons = {
  // Navigation & UI
  menu: Menu,
  x: X,
  search: Search,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "arrow-right": ArrowRight,
  "external-link": ExternalLink,
  check: Check,
  "circle-help": CircleHelp,

  // Social
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,

  // Content & Document
  "file-text": FileText,
  clipboard: Clipboard,
  "clipboard-list": ClipboardList,
  newspaper: Newspaper,
  tag: Tag,
  calendar: Calendar,
  "calendar-days": CalendarDays,
  clock: Clock,

  // Communication
  mail: Mail,
  phone: Phone,
  smartphone: Smartphone,
  "message-circle": MessageCircle,

  // People & Organization
  user: User,
  users: Users,
  "user-plus": UserPlus,
  "graduation-cap": GraduationCap,
  "user-search": UserSearch,

  // Location & Measurement
  "map-pin": MapPin,
  ruler: Ruler,

  // Sports & Activities
  trophy: Trophy,
  activity: Activity,
  dumbbell: Dumbbell,

  // Medical & Safety
  heart: Heart,
  "heart-pulse": HeartPulse,
  shield: Shield,
  "shield-alert": ShieldAlert,

  // Business
  handshake: Handshake,

  // Layout & Views
  "layout-grid": LayoutGrid,
  network: Network,

  // Misc
  plus: Plus,
  zap: Zap,
} as const;

export type IconName = keyof typeof icons;

/**
 * Get icon component by name with fallback
 * @param name - Icon name from IconName type
 * @returns Lucide icon component, or CircleHelp as fallback if name is invalid
 */
export function getIcon(name: string): LucideIcon {
  // Type-safe lookup with fallback for runtime safety
  const icon = icons[name as IconName];
  if (!icon) {
    console.warn(`Icon "${name}" not found, using fallback icon`);
    return CircleHelp;
  }
  return icon;
}

/**
 * Responsibility category icon mapping
 * Maps category to appropriate Lucide icon
 */
export const categoryIcons = {
  commercieel: "handshake",
  medisch: "heart",
  administratief: "file-text",
  gedrag: "shield",
  algemeen: "users",
  sportief: "trophy",
} as const satisfies Record<string, IconName>;

/**
 * Emoji to Lucide icon mapping
 * Used for backward compatibility during migration
 */
export const emojiToIcon = {
  "🤝": "handshake",
  "💪": "zap",
  "📝": "file-text",
  "⚽": "trophy",
  "📋": "clipboard-list",
  "🛡️": "shield",
  "🏥": "heart",
  "📱": "smartphone",
  "👤": "user",
  "🎓": "graduation-cap",
  "📅": "calendar",
  "🔍": "search",
} as const satisfies Record<string, IconName>;

/**
 * Export all icons for direct use
 */
export {
  // Navigation & UI
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Check,
  CircleHelp,

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
  MessageCircle,

  // People & Organization
  User,
  Users,
  UserPlus,
  GraduationCap,
  UserSearch,

  // Location & Measurement
  MapPin,
  Ruler,

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

  // Layout & Views
  LayoutGrid,
  Network,

  // Misc
  Plus,
  Zap,
  type LucideIcon,
};
