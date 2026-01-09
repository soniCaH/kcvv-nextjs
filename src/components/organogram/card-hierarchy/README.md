# Option A: Card Hierarchy Prototype

**Pattern:** Vertical accordion-style cards with expand/collapse

## Overview

Option A presents the organizational structure through expandable/collapsible cards arranged vertically. Each card can expand to reveal its direct reports, creating a progressive disclosure pattern that's familiar to mobile users.

## Strengths ✅

- **Shows Hierarchical Relationships**: Clear parent-child connections with visual indicators
- **Progressive Disclosure**: Start partially expanded, users dig deeper as needed
- **Mobile-Native Pattern**: Expandable cards are familiar from mobile apps
- **Clear Parent-Child Connections**: Visual hierarchy with indentation and connector lines
- **Search Auto-Expand**: Automatically expands ancestors to reveal search results
- **Keyboard Accessible**: Full keyboard navigation support
- **Touch-Friendly**: Large touch targets for expand/collapse buttons

## Weaknesses ❌

- **Harder to See Big Picture**: Can't see entire structure at once
- **Deep Hierarchies Require More Clicks**: More interaction needed to explore
- **Can Lose Context**: Deep nesting may lose sight of where you are in the hierarchy
- **Vertical Space**: Takes more vertical scrolling to browse

## Best For

- **Contact-First Users**: People who know what they're looking for
- **Mobile Users**: Touch-friendly expandable pattern
- **Deep Exploration**: Users who want to drill down into specific branches
- **Progressive Discovery**: Revealing information gradually

## Components

### 1. **CardHierarchy.tsx**

Main component orchestrating the entire hierarchy.

**Props:**

- `members`: All organization members
- `onMemberClick`: Click handler for opening details modal
- `initialExpandedDepth`: How many levels to expand initially (default: 2)
- `maxDepth`: Maximum hierarchy depth to render (default: 10)
- `isLoading`: Loading state
- `className`: Additional CSS classes

**Features:**

- Department filtering with counts
- Fuzzy search with auto-expand to results
- Expand All / Collapse All controls
- Results count display
- Empty state handling
- Progressive disclosure (starts partially expanded)

### 2. **HierarchyLevel.tsx**

Recursive component for rendering hierarchical levels.

**Props:**

- `members`: Members to render at this level
- `allMembers`: All members (for finding children)
- `depth`: Current nesting depth
- `maxDepth`: Maximum depth to render
- `expandedIds`: Set of expanded member IDs
- `onToggle`: Toggle handler
- `onMemberClick`: Member click handler
- `className`: Additional CSS classes

**Features:**

- Recursive rendering
- Depth limiting for performance
- Maintains parent-child relationships
- Supports controlled expansion state

### 3. **ExpandableCard.tsx**

Single expandable/collapsible card with expand button.

**Props:**

- `member`: The member to display
- `children`: Direct reports of this member
- `depth`: Nesting depth (0 = root)
- `isExpanded`: Controlled expanded state
- `onToggle`: Toggle handler (memberId, newState)
- `onMemberClick`: Click handler for member card
- `renderChildren`: Function to render nested children
- `className`: Additional CSS classes

**Features:**

- Smooth expand/collapse animation (300ms transition)
- Visual hierarchy indicators (indentation, connectors)
- Expand/collapse button (changes icon based on state)
- Keyboard accessible (Enter/Space to toggle)
- Touch-friendly (44px button)
- Uses ContactCard for consistent styling

## Storybook Stories

18 comprehensive stories covering:

### Default & Expansion States

- `Default`: 2 levels expanded initially
- `PartiallyExpanded`: Same as default
- `AllCollapsed`: All cards collapsed (depth 0)
- `AllExpanded`: All cards expanded (depth 10)
- `ThreeLevelsExpanded`: First 3 levels expanded

### Deep Hierarchy

- `DeepHierarchy`: 7-level deep hierarchy for testing

### Search

- `SearchWithAutoExpand`: Auto-expands ancestors to show results

### Responsive Viewports

- `Mobile`: Touch-friendly buttons
- `Tablet`: Balanced view

### Loading & Empty

- `Loading`: Skeleton cards at various depths
- `EmptyState`: No members

### Department Filtering

- `FilteredHoofdbestuur`: Hoofdbestuur only

### Interaction

- `InteractionExample`: Click tracking
- `AnimationShowcase`: Smooth animations

### Data Scenarios

- `LargeDataset`: 50 members performance test
- `SingleMember`: Edge case
- `FlatHierarchy`: No parent-child relationships

### Accessibility

- `AccessibilityTest`: a11y validation

## Usage Example

```tsx
import { CardHierarchy } from "@/components/organogram/option-a/CardHierarchy";
import { clubStructure } from "@/data/club-structure";
import { MemberDetailsModal } from "@/components/organogram/MemberDetailsModal";

export default function OrganogramPage() {
  const [selectedMember, setSelectedMember] = useState<OrgChartNode | null>(
    null,
  );

  return (
    <>
      <CardHierarchy
        members={clubStructure}
        onMemberClick={setSelectedMember}
        initialExpandedDepth={2}
      />

      <MemberDetailsModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}
```

## User Testing Scenarios

### Task 1: Find Youth Coordinator's Email

**Expected Flow:**

1. Search for "jeugdcoördinator" OR
2. Expand "Jeugdbestuur" cards until finding it
3. Click email button OR click card for details

**Success Metrics:**

- Time to completion < 20 seconds
- < 5 clicks
- Users understand expand/collapse pattern

### Task 2: See Who U10 Trainer Reports To

**Expected Flow:**

1. Search for "U10 trainer" (auto-expands to result)
2. Visually trace up the hierarchy using indentation
3. Identify parent from expanded cards

**Success Metrics:**

- Can identify reporting relationship
- Understand visual hierarchy indicators
- No confusion about parent-child connections

### Task 3: Browse Hoofdbestuur Structure

**Expected Flow:**

1. Click "Hoofdbestuur" filter
2. Expand cards to explore structure
3. Use Expand All if wanting full view

**Success Metrics:**

- Users can name 3+ Hoofdbestuur roles
- Feel comfortable with expand/collapse
- Understand hierarchical structure

## Evaluation Criteria

### Mobile UX (25%): ⭐⭐⭐⭐

- Good touch targets
- Familiar expandable pattern
- Smooth animations
- Minor issue: Takes more scrolling

### Desktop UX (20%): ⭐⭐⭐⭐

- Clear visual hierarchy
- Good use of indentation
- Expand/collapse easy to use
- Professional appearance

### Dual Purpose - Lookup + Hierarchy (20%): ⭐⭐⭐⭐

- **Lookup**: ⭐⭐⭐⭐ (Good - search auto-expands)
- **Hierarchy**: ⭐⭐⭐⭐ (Good - shows relationships)
- **Average**: ⭐⭐⭐⭐ (Balanced)

### Accessibility (15%): ⭐⭐⭐⭐⭐

- Full keyboard navigation
- ARIA labels for expand/collapse
- Screen reader friendly
- High color contrast

### Maintainability (10%): ⭐⭐⭐⭐

- Moderate complexity (recursion)
- Well-structured components
- Clear separation of concerns
- Reusable ExpandableCard

### Performance (10%): ⭐⭐⭐⭐⭐

- Fast rendering
- Efficient recursion
- Smooth animations (300ms)
- No lag with 50+ members

**Overall Score: 4.3/5** ⭐⭐⭐⭐

## Comparison to Other Options

| Criteria        | Option A   | Option B   | Option C   |
| --------------- | ---------- | ---------- | ---------- |
| Mobile UX       | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Desktop UX      | ⭐⭐⭐⭐   | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ |
| Contact Lookup  | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Hierarchy Viz   | ⭐⭐⭐⭐   | ⭐         | ⭐⭐⭐⭐⭐ |
| Accessibility   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| Maintainability | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐     |
| Performance     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |

**Sweet Spot:** Option A is the **best balanced** option - it excels at both contact lookup AND hierarchy visualization, making it ideal for dual-purpose use.

## Implementation Notes

### Visual Hierarchy Indicators

**Indentation:**

- Depth 0: `ml-0` (0px)
- Depth 1: `ml-4` (16px)
- Depth 2: `ml-8` (32px)
- Depth 3: `ml-12` (48px)
- Depth 4+: `ml-16` (64px max)

**Connector Lines:**

- 2px vertical line at left edge
- Gray color (#edeff4)
- Only shown for depth > 0

### Expand/Collapse Button

**Size:** 32px × 32px (w-8 h-8)
**Touch Target:** Meets 44px minimum (with padding)
**Icons:** ChevronDown (collapsed) / ChevronUp (expanded)
**Hover:** Green background (#4acf52) with white icon
**Focus:** 2px green ring with offset

### Animation

**Expand/Collapse:**

- Duration: 300ms
- Easing: ease-in-out
- Properties: max-height, opacity
- Implementation: CSS transitions

**Smooth Behavior:**

- max-height: 10000px (arbitrary large value for expand)
- max-height: 0 (collapse)
- opacity: 1 → 0

### Shared Components Used

- `ContactCard` (detailed variant)
- `SearchBar` (fuzzy search + autocomplete)
- `DepartmentFilter` (pills variant)
- `ContactQuickActions` (email/phone buttons)

### Design System Compliance

- ✅ Green accent color: `#4acf52`
- ✅ Typography: Quasimoda for headings, Montserrat for body
- ✅ Spacing: 4px grid system (ml-4, ml-8, etc.)
- ✅ Rounded corners: `rounded-lg` (8px) for cards, `rounded-full` for buttons
- ✅ Hover effects: Green background with white text
- ✅ Touch targets: 44px minimum (32px button + padding)

### State Management

**Expansion State:**

- Controlled via `expandedIds` Set in CardHierarchy
- Each member ID stored if expanded
- Auto-expand on search (expands all ancestors)
- Collapse All: Clears expandedIds
- Expand All: Adds all member IDs

**Initial State:**

- Calculated based on `initialExpandedDepth` prop
- Recursively expands from root to specified depth
- Default: depth 2 (good balance)

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Smooth animations require CSS transitions support

## Next Steps

1. **User Testing**: Test with 8-10 board members/parents
2. **Collect Feedback**: SUS score, task completion time, preference
3. **Compare to Options B & C**: Which best meets dual goals?
4. **Decision**: Choose winner based on evaluation criteria
5. **Production**: Implement winning prototype

## Files

```
src/components/organogram/prototypes/option-a/
├── CardHierarchy.tsx           # Main component (313 lines)
├── CardHierarchy.stories.tsx   # 18 Storybook stories (624 lines)
├── HierarchyLevel.tsx          # Recursive level renderer (86 lines)
├── ExpandableCard.tsx          # Single expandable card (161 lines)
└── README.md                   # This file (350 lines)
```

**Total:** ~1,534 lines of code
