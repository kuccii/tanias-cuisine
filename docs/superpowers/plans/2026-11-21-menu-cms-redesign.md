# Menu CMS Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/admin/menu` CMS with improved UI including image upload for headers and items, live preview, drag-and-drop reordering, and delete functionality.

**Architecture:** Three-pane layout with collapsible sidebar for section list, full-width editor with tabbed interface, and sticky live preview panel. Uses TanStack Start server functions, dnd-kit for drag-and-drop, and sonner for toasts.

**Tech Stack:** React 19, TanStack Router, TanStack Start, dnd-kit, Tailwind CSS, zod, react-hook-form, sonner

**Spec:** docs/superpowers/specs/2026-11-21-menu-cms-redesign.md

## Global Constraints

- Server runs on port 3002
- Supabase URL: `https://n8n.qivook.com/supabase/` (Kong proxy)
- Storage bucket: `menu-uploads` (public, 50MB limit, image/* mime types)
- Package.json uses `react-hook-form` v7.71.2, `zod` v3.24.2
- Never change `nitro.preset` in vite.config.ts
- No authentication required
- Images uploaded via base64 encoding

## Review Focus

- Image upload URL format: `menu/{sectionSlug}/header.{ext}` for headers, `menu/{slug}/{itemName}.{ext}` for items
- Display order column must be added to menu_sections table or use slug as sort key
- Preview must match exact styling of public `/menu` page items
- Drag-and-drop keyboard accessibility alternative (arrow keys + Enter to move)

---

## File Map

**New Files:**
- `src/components/admin/ImageUploadZone.tsx` - Reusable image upload drag-drop zone
- `src/components/admin/SectionList.tsx` - Sidebar section list with drag-drop
- `src/components/admin/EditorTabs.tsx` - Tabbed editor interface
- `src/components/admin/LivePreview.tsx` - Renders section as it appears on public menu
- `src/routes/admin/menu.tsx` - Complete redesign (replace existing)

**Modified Files:**
- `src/lib/menu-cms.server.ts` - Add `uploadSectionHeaderImage` function
- `package.json` - Add `@dnd-kit/core` and `@dnd-kit/sortable` dependencies

---

### Task 1: Add dnd-kit dependencies and uploadSectionHeaderImage server function

**Files:**
- Modify: `package.json`
- Modify: `src/lib/menu-cms.server.ts`
- Test: N/A (no tests)

**Interfaces:**
- Consumes: Nothing (new function)
- Produces: `uploadSectionHeaderImage(input: { base64: string, slug: string, filename?: string, mimeType?: string }) => { publicUrl: string }`

- [ ] **Step 1: Install dnd-kit dependencies**

```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

- [ ] **Step 2: Run install to verify it succeeds**

Run: `npm install`
Expected: No errors

- [ ] **Step 3: Add uploadSectionHeaderImage server function in menu-cms.server.ts**

Add function after `uploadMenuItemImageBase64`:
```typescript
export const uploadSectionHeaderImage = createServerFn({ method: "POST" })
  .inputValidator(imageUploadSchema)
  .handler(async ({ data }) => {
    const supabase = await createServiceClient();
    const { base64, slug, filename, mimeType } = data;
    
    const ext = filename?.split(".").pop() || "webp";
    const storageFilename = `menu/${slug}/header.${ext}`;
    
    const binaryString = Buffer.from(base64, "base64").toString("binary");
    const buffer = Buffer.from(binaryString, "binary");
    
    const { error } = await supabase.storage
      .from("menu-uploads")
      .upload(storageFilename, buffer, {
        contentType: mimeType || "image/webp",
        upsert: true,
      });
    
    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    const { data: publicUrl } = supabase.storage
      .from("menu-uploads")
      .getPublicUrl(storageFilename);
    
    return { publicUrl: publicUrl.publicUrl };
  });
```

- [ ] **Step 4: Verify build compiles**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 5: Commit changes**

```bash
git add package.json package-lock.json src/lib/menu-cms.server.ts
git commit -m "feat: add dnd-kit dependencies and uploadSectionHeaderImage function"
```

---

### Task 2: Create ImageUploadZone component

**Files:**
- Create: `src/components/admin/ImageUploadZone.tsx`
- Test: N/A

**Interfaces:**
- Consumes: `value?: string`, `onChange: (url: string) => void`, `slug: string`, `context: 'header' | 'item'`, `itemName?: string`
- Produces: UI component with drag-drop zone, file picker, thumbnail preview

- [ ] **Step 1: Write the ImageUploadZone component interface**

```tsx
interface ImageUploadZoneProps {
  value?: string;
  onChange: (url: string) => void;
  slug: string;
  context: 'header' | 'item';
  itemName?: string;
  className?: string;
}
```

- [ ] **Step 2: Implement ImageUploadZone with drag-drop, preview, upload**

Component features:
- Drag-and-drop area with `react-dropzone` pattern (without external lib)
- Click-to-select file input
- Thumbnail preview for existing `value`
- Progress indicator during upload
- Error handling with sonner toast
- Uses `uploadSectionHeaderImage` for header context, `uploadMenuItemImageBase64` for item context

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit src/components/admin/ImageUploadZone.tsx`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/ImageUploadZone.tsx
git commit -m "feat: add ImageUploadZone component for drag-drop image uploads"
```

---

### Task 3: Create SectionList component (sidebar)

**Files:**
- Create: `src/components/admin/SectionList.tsx`
- Test: N/A

**Interfaces:**
- Consumes: `sections`, `activeSlug`, `onSelect`, `onReorder`, `onDelete`, `onCreate`
- Produces: Collapsible sidebar with searchable drag-drop section list

- [ ] **Step 1: Write SectionList component with drag-drop sorting**

Use `@dnd-kit` for reordering:
- Vertical drag handles on each section
- Delete button per section with confirmation
- Search/filter input
- "New Section" button at bottom
- Collapsible state in localStorage

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/SectionList.tsx
git commit -m "feat: add SectionList sidebar component with drag-drop and delete"
```

---

### Task 4: Create LivePreview component

**Files:**
- Create: `src/components/admin/LivePreview.tsx`
- Test: N/A

**Interfaces:**
- Consumes: `section: MenuSection | null`
- Produces: Rendered section matching public `/menu` styling

- [ ] **Step 1: Copy public section rendering logic from menu.tsx**

Extract the `Section`, `ItemGrid`, `ItemCard` components (without cart functionality) into a reusable `PreviewSection` component.

- [ ] **Step 2: Create LivePreview that renders a single section**

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/LivePreview.tsx
git commit -m "feat: add LivePreview component matching public menu styling"
```

---

### Task 5: Create EditorTabs component

**Files:**
- Create: `src/components/admin/EditorTabs.tsx`
- Test: N/A

**Interfaces:**
- Consumes: `section`, `onSave`, `onImageUpload`, `isLoading`
- Produces: Tabbed editor with General, Items, Groups, Special, Images tabs

- [ ] **Step 1: Create tabbed interface with Radix Tabs**

Tabs:
- **General**: slug*, category*, title*, subtitle*, header image, compact toggle
- **Items**: Repeater for simple items (name*, price, description, note, image)
- **Groups**: Repeater for groups (name*, items with images)
- **Special**: Special box (title, items)
- **Images**: Gallery of all images used in section

- [ ] **Step 2: Implement drag-drop within Items and Groups tabs**

Use `sortable` from dnd-kit for:
- Items list (drag to reorder)
- Groups list (drag to reorder groups)
- Group items (drag to reorder within group)

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/EditorTabs.tsx
git commit -m "feat: add EditorTabs component with tabbed form interface"
```

---

### Task 6: Rewrite Admin menu route (main orchestrator)

**Files:**
- Rewrite: `src/routes/admin/menu.tsx`
- Test: Manual browser testing

**Interfaces:**
- Consumes: Loader data from Supabase, user interactions
- Produces: Three-pane admin interface

- [ ] **Step 1: Create layout structure with resizable panels**

```tsx
<div className="h-screen flex">
  <Sidebar />
  <Editor />
  <Preview />
</div>
```

- [ ] **Step 2: Wire up state management**

- `editingSlug` state
- Form data with react-hook-form
- Watch items/groups for drag-drop
- Handle image uploads via Zustand or useState

- [ ] **Step 3: Connect all sub-components**

- SectionList ↔ EditorTabs ↔ LivePreview
- State flow: Select section → populate form → preview updates

- [ ] **Step 4: Add save handler with optimistic UI**

- Disable save while saving
- Show toast on success
- Refresh sections list after save

- [ ] **Step 5: Test manually in browser**

Run: `npm run dev`
Navigate to: `http://localhost:3002/admin/menu`
Test: Select section, edit, save, upload image, drag-drop reorder

- [ ] **Step 6: Commit**

```bash
git add src/routes/admin/menu.tsx
git commit -m "feat: complete admin menu CMS with three-pane layout"
```

---

### Task 7: Database migration for display_order

**Files:**
- Create: `scripts/add-display-order.sql` (optional)
- Test: Manual SQL check

- [ ] **Step 1: Create migration SQL**

```sql
-- Add display_order column
ALTER TABLE menu_sections ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial order based on existing slugs
UPDATE menu_sections SET display_order = 
  CASE id
    WHEN 'snacks-starters' THEN 1
    WHEN 'soups-salads' THEN 2
    WHEN 'beef-pork' THEN 3
    WHEN 'goat-specialties' THEN 4
    WHEN 'chicken' THEN 5
    WHEN 'fish' THEN 6
    WHEN 'extras-sides' THEN 7
    WHEN 'coffee-tea' THEN 8
    WHEN 'smoothies-juices' THEN 9
    WHEN 'desserts' THEN 10
    ELSE 0
  END;

-- Create index
CREATE INDEX IF NOT EXISTS idx_menu_sections_display_order ON menu_sections(display_order);
```

- [ ] **Step 2: Run migration on Supabase server**

SSH to server and run:
```bash
PGPASSWORD=PostgRestPass123 psql -h 127.0.0.1 -U postgres -d postgres -f scripts/add-display-order.sql
```

- [ ] **Step 3: Update upsertMenuSection to handle display_order**

Modify server function to set `display_order` based on slug or allow explicit value.

- [ ] **Step 4: Commit**

```bash
git add scripts/add-display-order.sql src/lib/menu-cms.server.ts
git commit -m "feat: add display_order column to menu_sections for ordering"
```

---

### Task 8: Final build and deploy

**Files:**
- N/A (build step)

- [ ] **Step 1: Build production**

```bash
npm run build
```

- [ ] **Step 2: Package for server**

```bash
tar -czvf deploy.tar.gz dist/
```

- [ ] **Step 3: Deploy to server via pscp**

```bash
pscp -P 22 deploy.tar.gz root@72.60.188.94:/var/www/tanias-cuisine/
```

- [ ] **Step 4: Extract and restart PM2**

SSH:
```bash
cd /var/www/tanias-cuisine
tar -xzf deploy.tar.gz
pm2 reload tanias
pm2 logs tanias --lines 20
```

- [ ] **Step 5: Verify in browser**

Navigate to `http://72.60.188.94:3002/admin/menu` and test all features.

---

## Summary

This plan decomposes the CMS redesign into 8 tasks:
1. Dependencies and server function
2. ImageUploadZone component
3. SectionList sidebar
4. LivePreview component
5. EditorTabs component
6. Main admin route
7. Database migration
8. Build and deploy

Each task produces testable changes with clear interfaces. The plan follows existing project patterns (shibui-ui components, server functions, file-based routing).