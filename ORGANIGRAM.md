# KCVV Organigram Feature

**Status:** ⚠️ Implemented but UNUSABLE - major UX issues
**Last Updated:** December 2025

---

## ⚠️ CRITICAL ISSUES

This feature **exists but is not usable** in its current state. See GitHub issues:

- #437 - Major usability issues (CRITICAL)
- #438 - Readability problems
- #439 - Navigation problems
- #440 - UX redesign needed

**Do NOT promote this feature until these issues are resolved.**

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Current Features](#current-features)
3. [Known Problems](#known-problems)
4. [File Structure](#file-structure)
5. [How to Customize the Organigram](#how-to-customize-the-organigram)
6. [Known Accessibility Improvements (v2)](#known-accessibility-improvements-v2)
7. [Future Enhancements](#future-enhancements)

---

## Overview

An interactive organizational chart (organigram) that displays the complete club structure including Hoofdbestuur and Jeugdbestuur. Built with d3-org-chart library.

### Concept

Good concept - visual representation of club hierarchy to help people find the right contact person.

### Reality

Currently not usable due to:

- Readability issues
- Navigation problems
- Unclear UX
- Can't return to overview

---

## Current Features

### Implemented (But Problematic)

- ✅ Interactive visualization (expand/collapse)
- ✅ Zoom and pan controls
- ✅ Search functionality
- ✅ Member detail modal
- ✅ Department filters (Hoofdbestuur/Jeugdbestuur)
- ✅ Mobile responsive (theoretically)
- ✅ KCVV branding
- ✅ Drupal integration ready

### Accessibility Features (v2)

Attempted improvements for elder users:

- Whole card is clickable (not just tiny button)
- Large +/− zoom buttons
- Visual hints ("Klik om uit te klappen")
- 3 levels expanded by default
- Clear instructions
- No scroll-to-zoom confusion
- 32px expand indicators

**Note:** These improvements may not be working as intended - needs verification.

---

## Known Problems

### 1. Not Readable

- Text too small or poor contrast
- Overlapping nodes
- Cards too cramped
- Doesn't adapt well to screen size
- Initial zoom level wrong

### 2. Navigation Broken

- Expand/collapse doesn't work reliably
- Can't return to overview
- No breadcrumb trail
- Lost in deep hierarchy
- Search doesn't highlight results
- Reset button not visible/working

### 3. Generally Unclear

- UX is confusing
- Not intuitive
- Instructions don't help enough
- Too complex for simple task (finding a contact)

### 4. Mobile Issues

- Likely worse on mobile
- Touch controls may not work well
- Layout problems on small screens

---

## File Structure

```text
src/
├── app/(main)/club/organigram/
│   └── page.tsx                     # Main organigram page
├── components/organigram/
│   ├── OrgChart.tsx                 # Interactive chart component
│   ├── OrganigramClient.tsx         # Client-side wrapper with filters
│   ├── MemberDetailsModal.tsx       # Member detail popup
│   └── index.ts                     # Component exports
├── data/
│   └── club-structure.ts            # ⭐ EDIT THIS: Club org data
├── types/
│   └── organigram.ts                # TypeScript interfaces
└── lib/effect/schemas/
    └── staff.schema.ts              # Drupal staff content type schema
```

---

## How to Customize the Organigram

**⚠️ WARNING:** Before customizing, fix the usability issues first! Otherwise you're just adding data to a broken feature.

### 1. Update Board Member Data

Edit `/src/data/club-structure.ts` and replace placeholder names with real names:

```typescript
{
  id: 'president',
  name: '[Naam Voorzitter]',          // ← Change this
  title: 'Voorzitter',
  positionShort: 'PRES',
  department: 'hoofdbestuur',
  responsibilities: 'Leiding geven...',
  email: 'voorzitter@kcvvelewijt.be', // ← Add real email
  phone: '+32 123 456 789',           // ← Add phone if available
  imageUrl: '/images/staff/john.jpg', // ← Add profile photo
  profileUrl: '/staff/john-doe',      // ← Link to Drupal profile
  parentId: 'club',
}
```

### 2. Add New Positions

Add new entries to the `clubStructure` array:

```typescript
{
  id: 'new-position',
  name: 'Jane Smith',
  title: 'New Role Title',
  positionShort: 'NRT',
  department: 'hoofdbestuur', // or 'jeugdbestuur' or 'general'
  responsibilities: 'Description of role...',
  parentId: 'president', // ← Set who this person reports to
}
```

### 3. Add Profile Photos

1. Place profile photos in `/public/images/staff/`
2. Update `imageUrl` in club-structure.ts:
   ```typescript
   imageUrl: "/images/staff/firstname-lastname.jpg";
   ```

### 4. Link to Drupal Staff Profiles

If the person has a Drupal staff profile:

```typescript
profileUrl: "/staff/firstname-lastname"; // This links to Drupal
```

The staff content type is already configured in `/src/lib/effect/schemas/staff.schema.ts`.

---

## Configuration Options

### Change Colors

Edit `/src/components/organigram/OrgChart.tsx`:

```typescript
// Line ~52: Change border/accent colors
border: 2px solid #4acf52;  // ← Your club color

// Line ~57-60: Change gradient bar
background: linear-gradient(90deg, #4acf52 0%, #41b147 100%);
```

### Adjust Initial View

Edit `/src/app/(main)/club/organigram/page.tsx`:

```typescript
const chartConfig: OrgChartConfig = {
  initialZoom: 0.7, // ← 0.5 = zoomed out, 1.0 = normal
  expandToDepth: 2, // ← How many levels to expand initially
};
```

### Change Node Size

Edit `/src/components/organigram/OrgChart.tsx`:

```typescript
.nodeWidth(() => 280)    // ← Card width in pixels
.nodeHeight(() => 140)   // ← Card height in pixels
```

---

## Navigation

The organigram is accessible via:

- **URL**: `/club/organigram`
- **Navigation**: De club → Organigram
- **Mobile Menu**: De club → Organigram

Both desktop and mobile navigation have been updated.

---

## Current Structure

Your current structure hierarchy (45 positions defined with placeholder names):

```text
KCVV Elewijt
├── Voorzitter (President)
│   ├── Ondervoorzitter (VP)
│   │   ├── Technisch Coördinator
│   │   │   ├── Hoofdtrainer Senioren
│   │   │   │   └── Assistent-trainer
│   │   │   └── Keeperstrainer
│   │   └── Infrastructuurbeheerder
│   │       ├── Terreinbeheerder
│   │       └── Kantinebeheerder
│   ├── Secretaris
│   │   ├── Communicatieverantwoordelijke
│   │   │   ├── Social Media Manager
│   │   │   └── Clubfotograaf
│   │   └── Evenementencoördinator
│   ├── Penningmeester
│   │   └── Verantwoordelijke Sponsoring
│   └── Jeugdcoördinator (Youth)
│       ├── Technisch Verantwoordelijke Jeugd
│       │   ├── Coördinator U6-U9
│       │   │   └── Trainer U8
│       │   ├── Coördinator U10-U12
│       │   │   └── Trainer U10
│       │   ├── Coördinator U13-U15
│       │   │   └── Trainer U13
│       │   └── Coördinator U16-U19
│       ├── Secretaris Jeugdbestuur
│       │   ├── Materiaalverantwoordelijke Jeugd
│       │   └── Vrijwilligerscoördinator Jeugd
│       ├── Penningmeester Jeugdbestuur
│       └── Jeugdevenementencoördinator
```

---

## Deployment Notes

1. ✅ No environment variables needed
2. ✅ All data is statically defined (fast performance)
3. ✅ No external API calls required
4. ✅ Works offline after initial load

---

## Future Enhancements

### Critical (Must Fix First)

See GitHub issues #437-440

### Option 1: Fetch from Drupal (Dynamic)

If you want to manage the org structure in Drupal CMS instead of the TypeScript file:

1. Create a "Board Member" content type in Drupal
2. Add a DrupalService method to fetch board members
3. Update the page to fetch data server-side
4. Benefits: Non-technical users can update via CMS

### Option 2: Keep Static (Current)

Advantages:

- ✅ Lightning fast (no API calls)
- ✅ Works offline
- ✅ No CMS complexity
- ✅ Version controlled

### Option 3: Alternative Visualization

Instead of d3-org-chart, consider:

- **Card-based hierarchy** - Collapsible sections like file explorer
- **Tab-based** - Tabs for departments, cards for people
- **Simple list** - Searchable/filterable list
- **Multi-view** - Offer different views for different needs

---

## Testing Checklist

**⚠️ DO NOT USE** these until usability issues are fixed:

- [ ] Verify all names are correct
- [ ] Check all email addresses work
- [ ] Test all profile photo URLs
- [ ] Confirm Drupal staff profile links
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test search functionality
- [ ] Test expand/collapse
- [ ] Test fullscreen mode
- [ ] Test department filters

---

## Support & Documentation

### For Developers

- Check code comments in each file
- The [d3-org-chart library docs](https://github.com/bumbeishvili/org-chart)
- TypeScript interfaces in `/src/types/organigram.ts` show all available fields

### For Issues

- See GitHub issues #437-440
- Component files in `src/components/organigram/`
- Data file: `src/data/club-structure.ts`

---

## Known Accessibility Improvements (v2)

The following improvements were **attempted** but need verification:

### 1. Entire Card is Clickable

**Before:** Tiny 24px button at bottom of card to expand/collapse
**After:** The whole 280x140px card should be clickable
**Status:** ⚠️ Needs verification - is this working?

### 2. Large, Clear Zoom Controls

**Before:** Scroll wheel zooms (confusing)
**After:** Large +/− buttons
**Status:** ⚠️ Are these visible and working?

### 3. Visual Hints on Cards

**Added:**

- 32px green circular indicator
- Text: "Klik om uit te klappen" / "Klik om in te klappen"
- Hover effects
  **Status:** ⚠️ Are these showing up?

### 4. More Context on Load

**Changed:** 3 levels expanded (was 2)
**Status:** ⚠️ Is this too much? Too cluttered?

### 5. Improved Instructions

**Added:** 3 info cards at top explaining usage
**Status:** ⚠️ Are these actually helpful or just clutter?

### 6. Better Visual Feedback

**Enhancements:**

- Card lifts 4px on hover
- Green shadow
- Pointer cursor
- Smooth transitions
  **Status:** ⚠️ Working or broken?

---

## What Needs to Happen

### Immediate (Before Any Other Work)

1. **User testing** - Watch real people try to use it
2. **Document specific issues** - What exactly breaks? When?
3. **Fix critical bugs** - Make basic navigation work
4. **Test on mobile** - Likely worse than desktop

### Short Term

1. Fix readability (issue #438)
2. Fix navigation (issue #439)
3. Add prominent back/reset button
4. Simplify initial view

### Long Term

1. User research - what do people actually need?
2. Consider alternative visualizations
3. Complete UX redesign (issue #440)
4. Comprehensive testing before launch

---

## Success Criteria

Before promoting this feature, it must:

- [ ] Be easily readable on mobile and desktop
- [ ] Have working navigation (expand/collapse/return)
- [ ] Be usable without instructions
- [ ] Actually help users find contacts faster than searching Google
- [ ] Pass user testing with 90%+ task completion
- [ ] Get positive feedback from non-technical users

---

**Status:** 🚧 DO NOT USE until issues #437-440 are resolved
**Last Updated:** December 2025
