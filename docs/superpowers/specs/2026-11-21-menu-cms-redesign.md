# Menu CMS Admin Redesign Specification

**Date:** 2026-11-21
**Project:** Tania's Cuisine & Lounge
**Route:** `/admin/menu`

---

## Overview

Complete redesign of the live-editable menu CMS at `/admin/menu` to address:
- No image upload capability for section headers or individual dishes
- Weak UI: basic forms, no preview, no drag-and-drop, poor visual hierarchy
- Missing delete functionality for sections

---

## Architecture

### Layout: Full-Width Editor with Collapsible Sidebar + Live Preview

```
┌─────────────────────────────────────────────────────────────────────┐
│ Sticky Header: Back | "Menu CMS" | Badges (No auth / Save immediate)│
├──────────┬──────────────────────────────────────────┬───────────────┤
│ Sidebar  │           Editor (flex-1)                │  Preview      │
│ (280px,  │  ┌────────────────────────────────────┐  │  (320px,     │
│ collaps) │  │ Tab Bar:                           │  │   sticky)    │
│          │  │ [General] [Items] [Groups]         │  │              │
│ Sections │  │ [Special] [Images]                 │  │  Rendered    │
│  List    │  ├────────────────────────────────────┤  │  section     │
│ + Search │  │                                    │  │  matches     │
│ + Drag   │  │  Tab Content (card-based forms)    │  │  /menu       │
│ reorder  │  │  - Drag-drop zones for reordering  │  │              │
│ + Delete │  │  - Image drop zones with thumbnails│  │  Updates     │
│          │  │  - Inline validation               │  │  on every    │
│          │  └────────────────────────────────────┘  │  keystroke   │
└──────────┴──────────────────────────────────────────┴───────────────┘
```

### Responsive Behavior
- **≥1280px**: Three-pane layout as above
- **1024–1279px**: Sidebar collapsible (icon-only), preview collapsible
- **<1024px**: Sidebar becomes slide-over drawer, preview becomes bottom sheet

---

## Components

### 1. SectionSidebar
**Props:** `sections`, `activeSlug`, `onSelect`, `onReorder`, `onDelete`, `onCreate`
**Responsibilities:**
- Searchable list of sections (filter by title/category)
- Drag-and-drop reordering (updates DB order via `updateSectionOrder` server fn)
- Delete with confirmation modal
- "New Section" button at bottom
- Collapse/expand toggle (persists in localStorage)

### 2. EditorTabs
**Tabs:**
| Tab | Fields |
|-----|--------|
| **General** | slug*, category*, title*, subtitle, header image (drop zone + preview), compact toggle |
| **Items** | Repeater: name*, price, description, note, 📷 image upload per item, drag handle, delete |
| **Groups** | Repeater groups: group name*, items repeater (name*, price, 📷 image), drag handles |
| **Special** | Special box title, items repeater (name*, price), drag handles |
| **Images** | Gallery of all images used in this section (header + item images), click to copy URL, delete from storage |

### 3. LivePreview
**Props:** `sectionData`, `isLoading`
**Responsibilities:**
- Renders section using exact same components as public `/menu` page
- Skeleton loader while data fetches
- Matches public styling 1:1 (Tailwind classes, CSS variables)
- Sticky in viewport while scrolling editor

### 4. ImageUploadZone (reusable)
**Props:** `value`, `onChange`, `slug`, `context` ('header' | 'item'), `itemName?`
**Features:**
- Drag-and-drop + click to select
- Shows thumbnail preview
- Uploads via `uploadMenuItemImageBase64` (items) or new `uploadSectionHeaderImage` (headers)
- Progress indicator
- Error toast on failure
- Returns public URL stored in form field

---

## Data Model

### MenuSection (DB → UI)
```typescript
interface MenuSection {
  id: string;           // slug (unique)
  category: string;     // "Appetizers", "Main Course", etc.
  title: string;
  subtitle: string;
  image: string;        // header image URL (uploaded)
  compact: boolean;
  items: MenuItem[];    // simple items
  groups: MenuGroup[];  // grouped items
  special_box: SpecialBox | null;
}

interface MenuItem {
  name: string;
  price: string;
  description: string;
  note: string;
  image?: string;       // NEW: optional per-item image
}

interface MenuGroup {
  name: string;
  items: MenuItem[];    // items can have images
}

interface SpecialBox {
  title: string;
  items: MenuItem[];    // items can have images
}
```

---

## Server Functions (Additions)

### `uploadSectionHeaderImage`
```typescript
// Input: { base64, slug, filename?, mimeType? }
// Output: { publicUrl }
// Storage path: menu/{slug}/header.{ext}
```

### `updateSectionOrder`
```typescript
// Input: { orderedSlugs: string[] }
// Updates `display_order` column (to be added to menu_sections table)
```

### `deleteMenuSection` (already exists)
- Used by sidebar delete action

---

## Database Migration

Add `display_order` column to `menu_sections`:
```sql
ALTER TABLE menu_sections ADD COLUMN display_order INTEGER DEFAULT 0;
CREATE INDEX idx_menu_sections_display_order ON menu_sections(display_order);
```

Seed with current order (1–10).

---

## UX Details

### Drag-and-Drop (using @dnd-kit)
- **Sidebar**: Reorder sections → calls `updateSectionOrder` on drop
- **Items tab**: Reorder simple items
- **Groups tab**: Reorder groups AND items within groups
- **Special tab**: Reorder special box items
- Visual feedback: ghost preview, drop indicators, smooth animations

### Image Upload Flow
1. User drops file or clicks zone
2. FileReader converts to base64
3. `uploadSectionHeaderImage` / `uploadMenuItemImageBase64` called
4. Supabase storage: `menu-uploads/menu/{slug}/header.webp` or `menu/{slug}/{item-name}.webp`
5. Public URL returned → form field updated → preview re-renders

### Validation
- Required fields marked with *
- Inline errors on blur/submit
- Slug uniqueness checked on blur (debounced)
- Save button disabled while saving

### Keyboard Shortcuts
- `Cmd/Ctrl + S`: Save
- `Escape`: Close sidebar (mobile) / cancel edit
- `Tab`: Navigate form fields
- Arrow keys in drag handles: move item up/down

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Supabase unreachable | Toast error, form retains data, "Retry" button |
| Image upload fails | Toast with error, zone shows retry button |
| Slug conflict | Inline error on slug field |
| Network error on save | Toast, data preserved in form |
| Preview render error | Fallback to "Preview unavailable" card, editor unaffected |

---

## Accessibility

- All form fields have labels
- Drag-drop has keyboard alternative (arrow keys in handles)
- Focus management: save returns focus to save button
- Color contrast meets WCAG AA
- Live region for toast announcements
- Sidebar drawer traps focus on mobile

---

## Performance

- Preview debounced (150ms) on form changes
- Image thumbnails lazy-loaded
- Sections list virtualized if >50 (not needed now)
- Server functions called via TanStack Start (no extra bundle)

---

## Implementation Order

1. **Database**: Add `display_order` column + index
2. **Server functions**: `uploadSectionHeaderImage`, `updateSectionOrder`
3. **Components**: `ImageUploadZone`, `SectionSidebar`, `EditorTabs`, `LivePreview`
4. **Layout**: Three-pane responsive layout with collapsible panels
5. **Drag-and-drop**: `@dnd-kit` integration across all reorderable lists
6. **Polish**: Toasts, skeletons, keyboard shortcuts, accessibility audit

---

## Out of Scope

- Authentication/authorization (remains no-auth)
- Multi-language support
- Version history / undo
- Bulk import/export
- Menu scheduling (future dates)