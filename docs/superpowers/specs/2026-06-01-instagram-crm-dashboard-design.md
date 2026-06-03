# Instagram Content CRM Dashboard — Design

## Purpose
A self-contained HTML dashboard to manage Tania's Cuisine & Lounge Instagram content pipeline — track posts, statuses, visuals, captions, hashtags, and engagement metrics.

## Format
Single HTML file (`instagram-crm.html`) with inline CSS + JS. Zero dependencies. Opens in any browser. Data persisted via localStorage.

## Views

### 1. Stats Bar
Summary cards: Total Posts, Draft, Scheduled, Posted. Auto-updates on data changes.

### 2. Table View
All posts in a sortable table. Columns: Date, Theme, Type, Status, Caption Preview, Actions. Click column header to sort. Click row to open full detail modal.

### 3. Kanban View
Four columns: Idea → Draft → Scheduled → Posted. Cards show title, date, type badge, theme. Change status via dropdown on each card.

### 4. Detail/Edit Modal
Full-screen overlay with all fields. Used for viewing, editing, and creating posts.

## Data Model

| Field | Type | Purpose |
|-------|------|---------|
| id | string (uuid) | Unique identifier |
| title | string | Post title |
| week | string | Week 1-4 |
| day | string | e.g. "Mon Jun 8" |
| theme | string | Menu Monday, Vibe Tuesday, etc. |
| type | string | Feed Carousel, Feed Single, Reel, Story |
| status | string | Idea, Draft, Scheduled, Posted, Archived |
| scheduledDate | string (date) | Posting date |
| postedDate | string (date) | Actual post date |
| images | string | Comma-separated filenames |
| audio | string | Reel audio track |
| textOverlay | string | Reel text overlay |
| caption | string | Post caption |
| hashtags | string | Hashtag string |
| cta | string | Call to action |
| likes | number | Engagement metric |
| comments | number | Engagement metric |
| views | number | Engagement metric |
| saves | number | Engagement metric |
| notes | string | Internal notes |

## Features
- Pre-seeded with 28 posts from the content calendar
- Add / Edit / Delete posts via modal
- Filter by status, type, theme
- Free-text search across title, caption
- Sort table by column headers
- Kanban view with status-change dropdowns
- Export to JSON
- localStorage persistence

## Styling
- Dark theme with gold/amber accents (Tania's brand)
- Clean, modern typography
- Responsive (laptop + tablet)
- Status color coding (Idea=gray, Draft=blue, Scheduled=amber, Posted=green)
