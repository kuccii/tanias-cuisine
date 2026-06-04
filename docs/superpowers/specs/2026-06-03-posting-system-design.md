# Posting System — Instagram CRM Multi-Page App Design

## Overview
A React + Vite multi-page web app for Tania's Cuisine & Lounge Instagram content production. Replaces the existing single-HTML CRM with a full workflow system: weekly menu planning, visual asset library, and collaborative review/approval pipeline.

## Architecture
- **Stack:** React 19 + Vite + Tailwind CSS + React Router
- **Location:** `/crm/` directory in the same repo (standalone Vite app)
- **Persistence:** localStorage (same pattern as existing CRM)
- **Auth:** Simulated team roles (no real authentication)
- **Deployment:** Separate Vercel project or subdirectory

## Pages

### 1. Dashboard
Weekly overview of the current active week:
- Active weekly menu plan (Monday special menu items)
- Progress bar: posts by status (Draft → Pending Review → Approved → Scheduled → Posted)
- Pending reviews count (quick link to Review page)
- Recent activity feed (who approved/edited/commented on what)
- Quick stats: total posts this week, assets in library

### 2. Weekly Planner
Input Monday's special menu → auto-generate a week of content:
- Form: enter menu name + list of special dishes
- "Generate Plan" button creates 7 draft posts (Mon-Sun) following the content pillars
- Each generated post is editable (title, caption, type, images) before saving
- Posts go into "Idea" status until explicitly moved to "Draft"

### 3. Asset Library
Visual media management:
- Grid view of all uploaded assets (photos + videos)
- Upload via file input → stored as base64 data URL in localStorage
- Each asset: name, type (photo/video), tags (dish name, theme, week), upload date
- Filter by tag or type
- Click to preview in lightbox
- Drag-and-drop reordering (optional)

### 4. Review Portal
Collaborative approval workflow:
- Queue of posts in "Pending Review" status
- Two-column layout: post preview (image, caption, hashtags) on left, actions on right
- Three actions per post:
  - **Confirm** → moves to "Scheduled" status, logs approval
  - **Suggest Edits** → form: pick field (caption/hashtags/images/type), enter suggestion + reason → post moves to "Edits Requested"
  - **Comment** → free-text note attached to post, no status change
- Team switcher affects available actions (manager can Confirm, marketer can Suggest, etc.)
- Activity log per post showing all actions with timestamps and author

### 5. Calendar
Migrated from existing CRM:
- Table view (sortable, filterable)
- Kanban view (Idea → Draft → Pending Review → Approved → Scheduled → Posted)
- Posts now include review status in filtering

## Data Model

### Post (enhanced from existing CRM)
```
id, title, week, day, theme, type, status
scheduledDate, postedDate, images, audio, textOverlay
caption, hashtags, cta, likes, comments, views, saves, notes
weekPlanId (links to weekly plan)
assignedTo (team member id)
approvedBy, approvedAt
reviewComments: [{ id, authorId, text, createdAt }]
editRequests: [{ id, authorId, field, suggestedValue, reason, status: open|resolved, createdAt }]
activityLog: [{ id, authorId, action, detail, createdAt }]
```

### WeeklyMenuPlan
```
id, weekLabel, mondayDate, specialMenuItems: string[], status: draft|active|completed, createdAt
```

### VisualAsset
```
id, name, type: photo|video, data: base64 string, tags: string[], weekPlanId, dishName, uploadedAt
```

### TeamMember
```
id, name, role: manager|chef|marketing|photographer, avatar (initials/emoji)
```

## Status Flow
```
Idea → Draft → Pending Review → ┬─→ Approved → Scheduled → Posted
                                 └─→ Edits Requested → Draft (revised)
```
Archived can be reached from any status except Posted.

## UI / Styling
- Dark theme: `#0d0d0d` background, `#c4943d` gold accent (Tania's brand)
- Tailwind CSS for styling
- React Router for page navigation
- Shared layout: top nav bar with page links + team switcher dropdown
- Status color coding: Idea (gray), Draft (blue), Pending Review (amber), Edits Requested (orange), Approved (teal), Scheduled (gold), Posted (green)
- Responsive: optimized for laptop + tablet

## localStorage Keys
- `tania_posts` — all posts with review fields
- `tania_assets` — visual asset library
- `tania_team` — simulated team members
- `tania_weeks` — weekly menu plans
- `tania_activity` — cross-app activity log

## Migration
Seed initial data from existing CRM (if `tania_instagram_crm` exists in localStorage, migrate posts on first launch). Otherwise seed with the 28 content calendar posts.
