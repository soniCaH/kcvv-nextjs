# KCVV Organogram Feature

## Overview

A modern, interactive organizational chart (organogram) that displays the complete club structure including Hoofdbestuur and Jeugdbestuur. Built with d3-org-chart library and fully responsive for mobile, tablet, and desktop.

## 🎯 Features

- ✅ **Interactive Visualization**: Click, zoom, pan, and explore the org structure
- ✅ **Expand/Collapse**: Show/hide departments and teams - **entire card is clickable!**
- ✅ **Search**: Find any board member or position instantly
- ✅ **Member Details**: Click on anyone to see full profile, contact info, and responsibilities
- ✅ **Department Filters**: Toggle between full club, Hoofdbestuur, or Jeugdbestuur view
- ✅ **Mobile Optimized**: Touch-friendly controls and responsive layout
- ✅ **Elder-Friendly**: Large buttons, clear instructions, no confusing scroll-zoom behavior
- ✅ **Accessible Controls**: Zoom with + / − buttons, drag to pan, keyboard navigation
- ✅ **KCVV Branding**: Custom green theme matching club colors
- ✅ **Drupal Integration Ready**: Links to existing staff profiles in Drupal CMS

### 🎯 Accessibility Improvements (v2)

**Made for elder users and non-technical people:**
- **Whole card is clickable** - no tiny buttons needed
- **Large +/− zoom buttons** - clear and easy to use
- **Visual hints** - "Klik om uit te klappen" text on expandable cards
- **More context on load** - Shows 3 levels expanded by default
- **Clear instructions** - Info cards explain how to use the organogram
- **No scroll confusion** - Zoom with buttons, not mouse wheel
- **Bigger expand indicators** - 32px circular buttons, easy to see

## 📁 File Structure

```
src/
├── app/(main)/club/organogram/
│   └── page.tsx                     # Main organogram page
├── components/organogram/
│   ├── OrgChart.tsx                 # Interactive chart component
│   ├── OrganogramClient.tsx         # Client-side wrapper with filters
│   ├── MemberDetailsModal.tsx       # Member detail popup
│   └── index.ts                     # Component exports
├── data/
│   └── club-structure.ts            # ⭐ EDIT THIS: Club org data
├── types/
│   └── organogram.ts                # TypeScript interfaces
└── lib/effect/schemas/
    └── staff.schema.ts              # Drupal staff content type schema
```

## 🔧 How to Customize the Organogram

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
   imageUrl: '/images/staff/firstname-lastname.jpg'
   ```

### 4. Link to Drupal Staff Profiles

If the person has a Drupal staff profile:

```typescript
profileUrl: '/staff/firstname-lastname' // This links to Drupal
```

The staff content type is already configured in `/src/lib/effect/schemas/staff.schema.ts`.

## 🎨 Customization Options

### Change Colors

Edit `/src/components/organogram/OrgChart.tsx`:

```typescript
// Line ~52: Change border/accent colors
border: 2px solid #4acf52;  // ← Your club color

// Line ~57-60: Change gradient bar
background: linear-gradient(90deg, #4acf52 0%, #41b147 100%);
```

### Adjust Initial View

Edit `/src/app/(main)/club/organogram/page.tsx`:

```typescript
const chartConfig: OrgChartConfig = {
  initialZoom: 0.7,      // ← 0.5 = zoomed out, 1.0 = normal
  expandToDepth: 2,       // ← How many levels to expand initially
}
```

### Change Node Size

Edit `/src/components/organogram/OrgChart.tsx`:

```typescript
.nodeWidth(() => 280)    // ← Card width in pixels
.nodeHeight(() => 140)   // ← Card height in pixels
```

## 🔗 Navigation

The organogram is accessible via:
- **URL**: `/club/organogram`
- **Navigation**: De club → Organogram
- **Mobile Menu**: De club → Organogram

Both desktop and mobile navigation have been updated automatically.

## 📱 Mobile Experience

The organogram automatically adapts for mobile:
- Touch controls for zoom and pan
- Smaller node sizes for better fit
- Swipeable department filters
- Fullscreen mode button
- Responsive modal for member details

## 🧪 Testing Checklist

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

## 🚀 Deployment Notes

1. ✅ No environment variables needed
2. ✅ All data is statically defined (fast performance)
3. ✅ No external API calls required
4. ✅ Works offline after initial load

## 🔄 Future Enhancements

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

## 📞 Support

If you need help customizing:
1. Check the code comments in each file
2. The d3-org-chart library docs: https://github.com/bumbeishvili/org-chart
3. TypeScript interfaces in `/src/types/organogram.ts` show all available fields

## 📊 Example Structure

Your current structure hierarchy:

```
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

Total: **45 positions** defined (all with placeholder names ready to customize)

---

**Ready to go!** Just update the names in `club-structure.ts` and your organogram is live! 🎉
