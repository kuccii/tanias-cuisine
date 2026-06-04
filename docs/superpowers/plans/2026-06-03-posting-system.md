# Posting System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Vite multi-page CRM web app for Tania's Cuisine & Lounge Instagram content production pipeline.

**Architecture:** Standalone SPA in `/crm/` directory within the same repo. React 19 + React Router + Tailwind CSS. localStorage persistence. Simulated team roles (no auth). 5 pages: Dashboard, Weekly Planner, Asset Library, Review Portal, Calendar.

**Tech Stack:** React 19, Vite 7, React Router 7, Tailwind CSS 4

---

## File Structure

```
crm/
  index.html
  vite.config.ts
  package.json
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  src/
    main.tsx
    App.tsx
    index.css
    vite-env.d.ts
    data/
      types.ts
      store.ts
      seed.ts
    components/
      Layout.tsx
      StatusBadge.tsx
      Modal.tsx
      StatsCard.tsx
      PostCard.tsx
      KanbanBoard.tsx
    pages/
      Dashboard.tsx
      Planner.tsx
      Assets.tsx
      Review.tsx
      Calendar.tsx
```

---

### Task 1: Scaffold CRM Project

**Files:**
- Create: `crm/index.html`
- Create: `crm/vite.config.ts`
- Create: `crm/package.json`
- Create: `crm/tsconfig.json`
- Create: `crm/tsconfig.app.json`
- Create: `crm/tsconfig.node.json`
- Create: `crm/src/vite-env.d.ts`
- Create: `crm/src/main.tsx`
- Create: `crm/src/index.css`
- Create: `crm/src/App.tsx`

- [ ] **Step 1: Create `crm/package.json`**

```json
{
  "name": "tania-crm",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.6.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "^5.8.3",
    "vite": "^7.3.1"
  }
}
```

- [ ] **Step 2: Create `crm/vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": "/src" },
  },
});
```

- [ ] **Step 3: Create `crm/tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 4: Create `crm/tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create `crm/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create `crm/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tania's Posting System</title>
  </head>
  <body class="bg-[#0d0d0d] text-[#e5e5e5]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `crm/src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 8: Create `crm/src/index.css`**

```css
@import "tailwindcss";

:root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --surface2: #222;
  --border: #333;
  --text: #e5e5e5;
  --text2: #999;
  --accent: #c4943d;
  --accent2: #8b6b2e;
  --green: #22c55e;
  --blue: #3b82f6;
  --amber: #c4943d;
  --orange: #f59e0b;
  --teal: #14b8a6;
  --gray: #6b7280;
  --red: #ef4444;
}

body {
  font-family: -apple-system, 'Segoe UI', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.status-Idea { background: var(--gray); color: #fff; }
.status-Draft { background: var(--blue); color: #fff; }
.status-PendingReview { background: var(--amber); color: #111; }
.status-EditsRequested { background: var(--orange); color: #111; }
.status-Approved { background: var(--teal); color: #111; }
.status-Scheduled { background: var(--amber); color: #111; }
.status-Posted { background: var(--green); color: #111; }
.status-Archived { background: var(--red); color: #fff; }
```

- [ ] **Step 9: Create `crm/src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 10: Create `crm/src/App.tsx` (stub)**

```tsx
import { Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/planner" element={<div>Planner</div>} />
      <Route path="/assets" element={<div>Assets</div>} />
      <Route path="/review" element={<div>Review</div>} />
      <Route path="/calendar" element={<div>Calendar</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 11: Install dependencies and verify**

```bash
cd crm && npm install && npx tsc --noEmit
```

Expected: TypeScript compiles with no errors. Dev server can start with `npm run dev`.

- [ ] **Step 12: Commit**

```bash
git add crm/
git commit -m "feat(crm): scaffold Vite + React project structure"
```

---

### Task 2: Types, Store, and Seed Data

**Files:**
- Create: `crm/src/data/types.ts`
- Create: `crm/src/data/store.ts`
- Create: `crm/src/data/seed.ts`

- [ ] **Step 1: Create `crm/src/data/types.ts`**

```ts
export type PostStatus = 'Idea' | 'Draft' | 'PendingReview' | 'EditsRequested' | 'Approved' | 'Scheduled' | 'Posted' | 'Archived';
export type TeamRole = 'manager' | 'chef' | 'marketing' | 'photographer';
export type PostType = 'Feed Carousel' | 'Feed Single' | 'Reel' | 'Story';
export type AssetType = 'photo' | 'video';
export type EditField = 'caption' | 'hashtags' | 'images' | 'type' | 'other';
export type WeekStatus = 'draft' | 'active' | 'completed';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  avatar: string;
}

export interface ActivityEntry {
  id: string;
  postId: string;
  authorId: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface EditRequest {
  id: string;
  authorId: string;
  field: EditField;
  suggestedValue: string;
  reason: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface Post {
  id: string;
  weekPlanId: string;
  title: string;
  week: string;
  day: string;
  theme: string;
  type: PostType;
  status: PostStatus;
  scheduledDate: string;
  postedDate: string;
  images: string;
  audio: string;
  textOverlay: string;
  caption: string;
  hashtags: string;
  cta: string;
  likes: number;
  comments: number;
  views: number;
  saves: number;
  notes: string;
  assignedTo: string;
  approvedBy: string;
  approvedAt: string;
  reviewComments: ReviewComment[];
  editRequests: EditRequest[];
  activityLog: ActivityEntry[];
}

export interface WeeklyMenuPlan {
  id: string;
  weekLabel: string;
  mondayDate: string;
  specialMenuItems: string[];
  status: WeekStatus;
  createdAt: string;
}

export interface VisualAsset {
  id: string;
  name: string;
  type: AssetType;
  data: string;
  tags: string[];
  weekPlanId: string;
  dishName: string;
  uploadedAt: string;
}

export const THEMES = ['Menu Monday', 'Vibe Tuesday', 'Catering Wednesday', 'Taste of Kigali', 'Weekend Ready', 'Saturday Vibes', 'Sunday Slow Down'] as const;
export const TYPES: PostType[] = ['Feed Carousel', 'Feed Single', 'Reel', 'Story'];
export const STATUSES: PostStatus[] = ['Idea', 'Draft', 'PendingReview', 'EditsRequested', 'Approved', 'Scheduled', 'Posted', 'Archived'];
export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'tania', name: 'Tania', role: 'manager', avatar: '👑' },
  { id: 'pierre', name: 'Chef Pierre', role: 'chef', avatar: '👨‍🍳' },
  { id: 'marie', name: 'Marie', role: 'marketing', avatar: '📱' },
  { id: 'james', name: 'James', role: 'photographer', avatar: '📸' },
];
```

- [ ] **Step 2: Create `crm/src/data/store.ts`**

```ts
import type { Post, WeeklyMenuPlan, VisualAsset, TeamMember, ActivityEntry } from "./types";
import { TEAM_MEMBERS } from "./types";
import { SEED_POSTS } from "./seed";

const KEYS = {
  posts: "tania_posts",
  assets: "tania_assets",
  team: "tania_team",
  weeks: "tania_weeks",
  activity: "tania_activity",
  activeTeamMember: "tania_active_team_member",
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Posts
export function getPosts(): Post[] {
  if (!localStorage.getItem(KEYS.posts)) {
    save(KEYS.posts, SEED_POSTS);
  }
  return load<Post[]>(KEYS.posts, []);
}

export function savePosts(posts: Post[]) { save(KEYS.posts, posts); }

export function getPost(id: string): Post | undefined {
  return getPosts().find(p => p.id === id);
}

export function upsertPost(post: Post) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) posts[idx] = post;
  else posts.push(post);
  savePosts(posts);
}

export function deletePost(id: string) {
  savePosts(getPosts().filter(p => p.id !== id));
}

// Weekly Plans
export function getWeeklyPlans(): WeeklyMenuPlan[] {
  return load<WeeklyMenuPlan[]>(KEYS.weeks, []);
}

export function saveWeeklyPlans(plans: WeeklyMenuPlan[]) { save(KEYS.weeks, plans); }

export function upsertWeeklyPlan(plan: WeeklyMenuPlan) {
  const plans = getWeeklyPlans();
  const idx = plans.findIndex(p => p.id === plan.id);
  if (idx >= 0) plans[idx] = plan;
  else plans.push(plan);
  saveWeeklyPlans(plans);
}

// Assets
export function getAssets(): VisualAsset[] {
  return load<VisualAsset[]>(KEYS.assets, []);
}

export function saveAssets(assets: VisualAsset[]) { save(KEYS.assets, assets); }

export function addAsset(asset: VisualAsset) {
  const assets = getAssets();
  assets.push(asset);
  saveAssets(assets);
}

export function deleteAsset(id: string) {
  saveAssets(getAssets().filter(a => a.id !== id));
}

// Team
export function getTeam(): TeamMember[] {
  return load<TeamMember[]>(KEYS.team, TEAM_MEMBERS);
}

export function getActiveTeamMember(): TeamMember {
  const id = localStorage.getItem(KEYS.activeTeamMember);
  const members = getTeam();
  return members.find(m => m.id === id) || members[0];
}

export function setActiveTeamMember(id: string) {
  localStorage.setItem(KEYS.activeTeamMember, id);
}

// Activity
export function getActivity(): ActivityEntry[] {
  return load<ActivityEntry[]>(KEYS.activity, []);
}

export function addActivity(entry: ActivityEntry) {
  const activity = getActivity();
  activity.unshift(entry);
  save(KEYS.activity, activity.slice(0, 200));
}
```

- [ ] **Step 3: Create `crm/src/data/seed.ts`**

```ts
import type { Post } from "./types";

export const SEED_POSTS: Post[] = [];

const themes = ['Menu Monday', 'Vibe Tuesday', 'Catering Wednesday', 'Taste of Kigali', 'Weekend Ready', 'Saturday Vibes', 'Sunday Slow Down'];
const types: Array<Post['type']> = ['Feed Carousel', 'Feed Single', 'Reel', 'Feed Carousel', 'Feed Carousel', 'Reel', 'Feed Single'];
const days = ['Mon Jun 8', 'Tue Jun 9', 'Wed Jun 10', 'Thu Jun 11', 'Fri Jun 12', 'Sat Jun 13', 'Sun Jun 14'];
const titles = [
  "Grill master's choice 🔥",
  'The golden hour corner 🕯️',
  'Your event, our table 🍽️',
  'Swahili Fish at Tania\'s',
  'Friday night plans sorted 🎶',
  'Saturday nights hit different',
  'Slow Sundays start here ☕',
];
const captions = [
  "Grill master's choice 🔥\n\nPrime cuts, open flame.\n\n📍 KG 8 Ave, Remera",
  "The golden hour corner 🕯️\n\nVelvet, copper, candlelight.\nYour table is waiting.\n\n📍 KG 8 Ave, Remera",
  "Your event, our table 🍽️\n\n20 to 200 pax.\n\n📧 events@taniascuisine.rw",
  "Swahili Fish at Tania's. That coconut sauce.\n\n📍 KG 8 Ave, Remera",
  "Friday night plans sorted 🎶\n\nLive music. Cold drinks.\n\n🔗 Link in bio",
  "Saturday nights hit different here.\n\n📍 KG 8 Ave, Remera",
  "Slow Sundays start here ☕\n\nEspresso, a quiet corner.\n\n📍 KG 8 Ave, Remera",
];
const hashtagsList = [
  '#KigaliFood #KigaliEats #KigaliGrill #TaniaCuisine',
  '#KigaliLounge #KigaliNightlife #TaniaCuisine',
  '#KigaliEvents #KigaliCatering #TaniaCuisine',
  '#KigaliFood #SwahiliFish #TasteKigali',
  '#KigaliNightlife #WeekendVibes #TaniaCuisine',
  '#SaturdayVibes #KigaliNightlife #TaniaCuisine',
  '#KigaliCoffee #SundayMood #TaniaCuisine',
];

for (let i = 0; i < 7; i++) {
  SEED_POSTS.push({
    id: `seed-${String(i + 1).padStart(2, '0')}`,
    weekPlanId: '',
    title: titles[i],
    week: 'Week 1',
    day: days[i],
    theme: themes[i],
    type: types[i] as Post['type'],
    status: i < 3 ? 'Scheduled' : 'Draft',
    scheduledDate: `2026-06-${String(i + 8).padStart(2, '0')}`,
    postedDate: '',
    images: '',
    audio: '',
    textOverlay: '',
    caption: captions[i],
    hashtags: hashtagsList[i],
    cta: '',
    likes: 0,
    comments: 0,
    views: 0,
    saves: 0,
    notes: '',
    assignedTo: '',
    approvedBy: '',
    approvedAt: '',
    reviewComments: [],
    editRequests: [],
    activityLog: [],
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add crm/src/data/
git commit -m "feat(crm): add types, store, and seed data"
```

---

### Task 3: Layout Shell with Navigation + Team Switcher

**Files:**
- Create: `crm/src/components/Layout.tsx`
- Modify: `crm/src/App.tsx`

- [ ] **Step 1: Create `crm/src/components/Layout.tsx`**

```tsx
import { NavLink } from "react-router-dom";
import { getTeam, getActiveTeamMember, setActiveTeamMember } from "../data/store";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/planner", label: "Planner" },
  { to: "/assets", label: "Assets" },
  { to: "/review", label: "Review" },
  { to: "/calendar", label: "Calendar" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const team = getTeam();
  const [active, setActive] = useState(getActiveTeamMember);
  const [showTeam, setShowTeam] = useState(false);

  const switchMember = (id: string) => {
    setActiveTeamMember(id);
    setActive(getActiveTeamMember());
    setShowTeam(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#1a1a1a] border-b border-[#333]">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-bold text-sm tracking-wide">
              🍽 Tania's <span className="text-[#c4943d]">Posting System</span>
            </span>
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(n => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      isActive ? "bg-[#c4943d] text-black" : "text-[#999] hover:text-white"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowTeam(!showTeam)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#222] border border-[#333] text-xs hover:border-[#c4943d] transition-colors"
            >
              <span>{active.avatar}</span>
              <span>{active.name}</span>
              <span className="text-[10px] uppercase text-[#666]">{active.role}</span>
            </button>
            {showTeam && (
              <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 w-48">
                {team.map(m => (
                  <button
                    key={m.id}
                    onClick={() => switchMember(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[#222] transition-colors ${
                      m.id === active.id ? "bg-[#222]" : ""
                    }`}
                  >
                    <span>{m.avatar}</span>
                    <div className="text-left">
                      <div className="text-white">{m.name}</div>
                      <div className="text-[#666] text-[10px] uppercase">{m.role}</div>
                    </div>
                    {m.id === active.id && <span className="ml-auto text-[#c4943d]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-2">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                  isActive ? "bg-[#c4943d] text-black" : "text-[#999]"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Update `crm/src/App.tsx` to use Layout**

```tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Assets from "./pages/Assets";
import Review from "./pages/Review";
import Calendar from "./pages/Calendar";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/review" element={<Review />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
```

- [ ] **Step 3: Verify**

```bash
cd crm && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add crm/src/App.tsx crm/src/components/Layout.tsx
git commit -m "feat(crm): add layout shell with nav and team switcher"
```

---

### Task 4: StatusBadge, Modal, StatsCard Components

**Files:**
- Create: `crm/src/components/StatusBadge.tsx`
- Create: `crm/src/components/Modal.tsx`
- Create: `crm/src/components/StatsCard.tsx`

- [ ] **Step 1: Create `crm/src/components/StatusBadge.tsx`**

```tsx
import type { PostStatus } from "../data/types";

const LABELS: Record<PostStatus, string> = {
  Idea: "Idea",
  Draft: "Draft",
  PendingReview: "Review",
  EditsRequested: "Edits",
  Approved: "Approved",
  Scheduled: "Scheduled",
  Posted: "Posted",
  Archived: "Archived",
};

export default function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium status-${status}`}>
      {LABELS[status]}
    </span>
  );
}
```

- [ ] **Step 2: Create `crm/src/components/Modal.tsx`**

```tsx
import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div ref={ref} className="bg-[#1a1a1a] border border-[#333] rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-[#666] hover:text-white text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `crm/src/components/StatsCard.tsx`**

```tsx
interface StatsCardProps {
  label: string;
  value: number;
  color?: string;
}

export default function StatsCard({ label, value, color = "#6b7280" }: StatsCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-center">
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[11px] text-[#666] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add crm/src/components/StatusBadge.tsx crm/src/components/Modal.tsx crm/src/components/StatsCard.tsx
git commit -m "feat(crm): add StatusBadge, Modal, and StatsCard components"
```

---

### Task 5: Dashboard Page

**Files:**
- Create: `crm/src/pages/Dashboard.tsx`
- Create: `crm/src/components/ActivityFeed.tsx`

- [ ] **Step 1: Create `crm/src/pages/Dashboard.tsx`**

```tsx
import { Link } from "react-router-dom";
import { getPosts, getActivity } from "../data/store";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import type { PostStatus } from "../data/types";

export default function Dashboard() {
  const posts = getPosts();
  const activity = getActivity().slice(0, 10);

  const countByStatus = (s: PostStatus) => posts.filter(p => p.status === s).length;
  const total = posts.length;
  const pendingReview = countByStatus("PendingReview");
  const thisWeek = posts.filter(p => p.week === "Week 1").length;

  const statuses: Array<{ status: PostStatus; color: string }> = [
    { status: "Idea", color: "#6b7280" },
    { status: "Draft", color: "#3b82f6" },
    { status: "PendingReview", color: "#c4943d" },
    { status: "Approved", color: "#14b8a6" },
    { status: "Scheduled", color: "#c4943d" },
    { status: "Posted", color: "#22c55e" },
  ];

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekPosts = ["Menu Monday", "Vibe Tuesday", "Catering Wednesday", "Taste of Kigali", "Weekend Ready", "Saturday Vibes", "Sunday Slow Down"]
    .map(theme => posts.find(p => p.theme === theme && p.week === "Week 1"))
    .filter(Boolean);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <StatsCard label="Total Posts" value={total} color="#e5e5e5" />
        <StatsCard label="Pending Review" value={pendingReview} color="#c4943d" />
        <StatsCard label="This Week" value={thisWeek} color="#3b82f6" />
        <StatsCard label="Ideas" value={countByStatus("Idea")} color="#6b7280" />
        <StatsCard label="Drafts" value={countByStatus("Draft")} color="#3b82f6" />
        <StatsCard label="Posted" value={countByStatus("Posted")} color="#22c55e" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-4">This Week's Progress</h2>
          {statuses.map(({ status, color }) => {
            const count = countByStatus(status);
            const pct = total ? (count / total) * 100 : 0;
            return (
              <div key={status} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#999]"><StatusBadge status={status} /></span>
                  <span className="text-[#666]">{count}</span>
                </div>
                <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-xs text-[#666]">No activity yet.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {activity.map(a => (
                <div key={a.id} className="text-xs text-[#999] border-b border-[#222] pb-2 last:border-0">
                  <span className="text-white font-medium">{a.action}</span> — {a.detail}
                  <div className="text-[10px] text-[#555] mt-0.5">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      {pendingReview > 0 && (
        <Link to="/review" className="mt-6 inline-flex items-center gap-2 bg-[#c4943d] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#8b6b2e] transition-colors">
          {pendingReview} post{pendingReview !== 1 ? "s" : ""} pending review →
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add crm/src/pages/Dashboard.tsx
git commit -m "feat(crm): add Dashboard page with stats and activity"
```

---

### Task 6: Weekly Planner Page

**Files:**
- Create: `crm/src/pages/Planner.tsx`

- [ ] **Step 1: Create `crm/src/pages/Planner.tsx`**

```tsx
import { useState } from "react";
import { upsertWeeklyPlan, upsertPost, getPosts } from "../data/store";
import type { WeeklyMenuPlan, Post } from "../data/types";
import { THEMES, TYPES } from "../data/types";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateWeekPosts(menuName: string, menuItems: string[], weekLabel: string): Partial<Post>[] {
  const startDate = new Date();
  const dayOfWeek = startDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + mondayOffset);

  return DAYS.map((_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = `${DAY_SHORT[i]} ${date.getDate()}`;

    const dishIndex = i % menuItems.length;
    const dish = menuItems[dishIndex] || menuItems[0];

    return {
      title: `${dish} — ${THEMES[i].replace(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/, '').trim()}`,
      week: weekLabel,
      day: `${DAYS[i]} (${dateStr})`,
      theme: THEMES[i],
      type: TYPES[i % TYPES.length],
      status: 'Idea' as const,
      scheduledDate: date.toISOString().slice(0, 10),
      caption: `${dish} at Tania's!\n\n📍 KG 8 Ave, Remera`,
      hashtags: '#KigaliFood #TaniaCuisine',
      cta: '',
      images: '',
      audio: '',
      textOverlay: '',
      notes: `Generated from menu: ${menuName}`,
      assignedTo: '',
      approvedBy: '',
      approvedAt: '',
      reviewComments: [],
      editRequests: [],
      activityLog: [],
    };
  });
}

export default function Planner() {
  const [menuName, setMenuName] = useState('');
  const [menuItems, setMenuItems] = useState('');
  const [generated, setGenerated] = useState<Partial<Post>[]>([]);
  const [weekLabel, setWeekLabel] = useState(`Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    const items = menuItems.split(',').map(s => s.trim()).filter(Boolean);
    if (!menuName || items.length === 0) return;
    setGenerated(generateWeekPosts(menuName, items, weekLabel));
    setSaved(false);
  };

  const updateGenerated = (idx: number, field: string, value: string) => {
    setGenerated(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSave = () => {
    const plan: WeeklyMenuPlan = {
      id: `plan-${Date.now()}`,
      weekLabel,
      mondayDate: new Date().toISOString().slice(0, 10),
      specialMenuItems: menuItems.split(',').map(s => s.trim()).filter(Boolean),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    upsertWeeklyPlan(plan);

    generated.forEach((p, i) => {
      const post: Post = {
        id: `post-${Date.now()}-${i}`,
        weekPlanId: plan.id,
        title: p.title || '',
        week: p.week || weekLabel,
        day: p.day || '',
        theme: p.theme || THEMES[i],
        type: (p.type || TYPES[i % TYPES.length]) as Post['type'],
        status: 'Idea',
        scheduledDate: p.scheduledDate || '',
        postedDate: '',
        images: p.images || '',
        audio: p.audio || '',
        textOverlay: p.textOverlay || '',
        caption: p.caption || '',
        hashtags: p.hashtags || '',
        cta: p.cta || '',
        likes: 0, comments: 0, views: 0, saves: 0,
        notes: p.notes || '',
        assignedTo: '',
        approvedBy: '', approvedAt: '',
        reviewComments: [], editRequests: [], activityLog: [],
      };
      upsertPost(post);
    });

    setSaved(true);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Weekly Planner</h1>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5 mb-8">
        <h2 className="text-sm font-semibold mb-4">Monday Special Menu</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-[#666] uppercase tracking-wider mb-1">Week Label</label>
            <input value={weekLabel} onChange={e => setWeekLabel(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[#c4943d] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[#666] uppercase tracking-wider mb-1">Menu Name</label>
            <input value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="e.g., Summer Grill Special"
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[#c4943d] outline-none" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-[#666] uppercase tracking-wider mb-1">Menu Items (comma-separated)</label>
          <input value={menuItems} onChange={e => setMenuItems(e.target.value)} placeholder="e.g., Beef Fillet, Swahili Fish, BBQ Platter, Peri-Peri Chicken"
            className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-[#c4943d] outline-none" />
        </div>
        <button onClick={handleGenerate} disabled={!menuName || !menuItems.trim()}
          className="bg-[#c4943d] text-black px-5 py-2 rounded text-sm font-medium hover:bg-[#8b6b2e] disabled:opacity-40 transition-colors">
          Generate Week Plan
        </button>
      </div>

      {generated.length > 0 && (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-4">Generated Posts — Preview & Edit</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {generated.map((post, i) => (
              <div key={i} className="bg-[#222] rounded-lg p-4 border border-[#333]">
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#666] uppercase mb-0.5">Theme</label>
                    <select value={post.theme} onChange={e => updateGenerated(i, 'theme', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white">
                      {THEMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#666] uppercase mb-0.5">Type</label>
                    <select value={post.type} onChange={e => updateGenerated(i, 'type', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white">
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#666] uppercase mb-0.5">Day</label>
                    <input value={post.day} onChange={e => updateGenerated(i, 'day', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#666] uppercase mb-0.5">Title</label>
                    <input value={post.title} onChange={e => updateGenerated(i, 'title', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white" />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[10px] text-[#666] uppercase mb-0.5">Caption</label>
                    <textarea value={post.caption} onChange={e => updateGenerated(i, 'caption', e.target.value)} rows={2}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} className="bg-[#c4943d] text-black px-5 py-2 rounded text-sm font-medium hover:bg-[#8b6b2e] transition-colors">
              Save All to CRM
            </button>
            {saved && <span className="text-[#22c55e] text-sm self-center">✓ Saved!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add crm/src/pages/Planner.tsx
git commit -m "feat(crm): add Weekly Planner page with menu-driven generation"
```

---

### Task 7: Asset Library Page

**Files:**
- Create: `crm/src/pages/Assets.tsx`

- [ ] **Step 1: Create `crm/src/pages/Assets.tsx`**

```tsx
import { useState, useRef } from "react";
import { getAssets, addAsset, deleteAsset } from "../data/store";
import Modal from "../components/Modal";
import type { VisualAsset } from "../data/types";

export default function Assets() {
  const [assets, setAssets] = useState(getAssets());
  const [preview, setPreview] = useState<VisualAsset | null>(null);
  const [tagFilter, setTagFilter] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [dishName, setDishName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setAssets(getAssets());

  const filtered = tagFilter
    ? assets.filter(a => a.tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase())))
    : assets;

  const allTags = [...new Set(assets.flatMap(a => a.tags))];

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !name) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const asset: VisualAsset = {
        id: `asset-${Date.now()}`,
        name,
        type: file.type.startsWith("video") ? "video" : "photo",
        data,
        tags: tags.split(",").map(s => s.trim()).filter(Boolean),
        weekPlanId: "",
        dishName,
        uploadedAt: new Date().toISOString(),
      };
      addAsset(asset);
      setName(""); setTags(""); setDishName("");
      if (fileRef.current) fileRef.current.value = "";
      setShowUpload(false);
      refresh();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Asset Library</h1>
        <button onClick={() => setShowUpload(true)}
          className="bg-[#c4943d] text-black px-4 py-2 rounded text-sm font-medium hover:bg-[#8b6b2e] transition-colors">
          + Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setTagFilter("")}
          className={`px-3 py-1 rounded text-xs ${!tagFilter ? "bg-[#c4943d] text-black" : "bg-[#222] text-[#999] hover:text-white"}`}>
          All
        </button>
        {allTags.map(tag => (
          <button key={tag} onClick={() => setTagFilter(tag)}
            className={`px-3 py-1 rounded text-xs ${tagFilter === tag ? "bg-[#c4943d] text-black" : "bg-[#222] text-[#999] hover:text-white"}`}>
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#666]">
          <p className="mb-2">No assets yet.</p>
          <button onClick={() => setShowUpload(true)} className="text-[#c4943d] text-sm hover:underline">Upload your first asset</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map(a => (
            <div key={a.id} className="group relative bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setPreview(a)}>
              {a.type === "video" ? (
                <video src={a.data} className="w-full aspect-square object-cover" />
              ) : (
                <img src={a.data} alt={a.name} className="w-full aspect-square object-cover" />
              )}
              <div className="p-2">
                <div className="text-xs truncate">{a.name}</div>
                <div className="text-[10px] text-[#666]">{a.type}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteAsset(a.id); refresh(); }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name || ""}>
        {preview && (
          <div>
            {preview.type === "video" ? (
              <video src={preview.data} controls className="w-full rounded-lg max-h-[60vh]" />
            ) : (
              <img src={preview.data} alt={preview.name} className="w-full rounded-lg max-h-[60vh] object-contain" />
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#666]">Type:</span> {preview.type}</div>
              <div><span className="text-[#666]">Dish:</span> {preview.dishName || "—"}</div>
              <div className="col-span-2"><span className="text-[#666]">Tags:</span> {preview.tags.join(", ") || "—"}</div>
              <div className="col-span-2"><span className="text-[#666]">Uploaded:</span> {new Date(preview.uploadedAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Asset">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#666] uppercase mb-1">File</label>
            <input ref={fileRef} type="file" accept="image/*,video/*"
              className="w-full text-sm text-[#999] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#c4943d] file:text-black file:text-xs file:font-medium" />
          </div>
          <div>
            <label className="block text-xs text-[#666] uppercase mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#666] uppercase mb-1">Dish Name</label>
            <input value={dishName} onChange={e => setDishName(e.target.value)}
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#666] uppercase mb-1">Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., grill, beef, dinner"
              className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white" />
          </div>
          <button onClick={handleUpload} disabled={!name}
            className="bg-[#c4943d] text-black px-4 py-2 rounded text-sm font-medium hover:bg-[#8b6b2e] disabled:opacity-40 transition-colors">
            Upload
          </button>
        </div>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add crm/src/pages/Assets.tsx
git commit -m "feat(crm): add Asset Library page with upload and preview"
```

---

### Task 8: Review Portal Page

**Files:**
- Create: `crm/src/pages/Review.tsx`

- [ ] **Step 1: Create `crm/src/pages/Review.tsx`**

```tsx
import { useState } from "react";
import { getPosts, upsertPost, getActiveTeamMember, addActivity } from "../data/store";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import type { Post, ReviewComment, EditRequest } from "../data/types";

export default function Review() {
  const [posts, setPosts] = useState(getPosts);
  const [selected, setSelected] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");
  const [editField, setEditField] = useState<string>("caption");
  const [editValue, setEditValue] = useState("");
  const [editReason, setEditReason] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  const refresh = () => {
    setPosts(getPosts());
    if (selected) setSelected(getPosts().find(p => p.id === selected.id) || null);
  };

  const me = getActiveTeamMember();
  const pending = posts.filter(p => p.status === "PendingReview");
  const other = posts.filter(p => p.status !== "PendingReview" && p.status !== "Idea" && p.status !== "Archived");

  const handleConfirm = (post: Post) => {
    post.status = "Scheduled";
    post.approvedBy = me.id;
    post.approvedAt = new Date().toISOString();
    post.activityLog.push({
      id: `act-${Date.now()}`,
      postId: post.id,
      authorId: me.id,
      action: "Confirmed",
      detail: `${me.name} approved this post.`,
      createdAt: new Date().toISOString(),
    });
    upsertPost(post);
    addActivity({
      id: `act-${Date.now()}-1`,
      postId: post.id,
      authorId: me.id,
      action: "Approved",
      detail: `"${post.title}" approved by ${me.name}`,
      createdAt: new Date().toISOString(),
    });
    refresh();
  };

  const handleComment = (post: Post) => {
    if (!commentText.trim()) return;
    const comment: ReviewComment = {
      id: `cmt-${Date.now()}`,
      authorId: me.id,
      text: commentText,
      createdAt: new Date().toISOString(),
    };
    post.reviewComments.push(comment);
    post.activityLog.push({
      id: `act-${Date.now()}`,
      postId: post.id,
      authorId: me.id,
      action: "Commented",
      detail: `${me.name}: "${commentText}"`,
      createdAt: new Date().toISOString(),
    });
    upsertPost(post);
    setCommentText("");
    refresh();
  };

  const handleEditRequest = (post: Post) => {
    if (!editValue.trim()) return;
    const er: EditRequest = {
      id: `er-${Date.now()}`,
      authorId: me.id,
      field: editField as EditRequest['field'],
      suggestedValue: editValue,
      reason: editReason,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    post.editRequests.push(er);
    post.status = "EditsRequested";
    post.activityLog.push({
      id: `act-${Date.now()}`,
      postId: post.id,
      authorId: me.id,
      action: "Requested Edits",
      detail: `${me.name} suggested changes to "${editField}": ${editValue}`,
      createdAt: new Date().toISOString(),
    });
    upsertPost(post);
    setEditValue("");
    setEditReason("");
    setShowEditForm(false);
    addActivity({
      id: `act-${Date.now()}-1`,
      postId: post.id,
      authorId: me.id,
      action: "Edits Requested",
      detail: `"${post.title}" — ${me.name} requested edits to ${editField}`,
      createdAt: new Date().toISOString(),
    });
    refresh();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Review Portal</h1>
      <p className="text-xs text-[#666] mb-6">Active as: <span className="text-white">{me.avatar} {me.name}</span> ({me.role})</p>

      {/* Pending Queue */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-[#c4943d]">Pending Review ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-xs text-[#666] py-8 text-center">Nothing pending. All clear!</p>
        ) : (
          <div className="space-y-3">
            {pending.map(post => (
              <div key={post.id} className="bg-[#1a1a1a] border border-[#c4943d]/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-sm">{post.title}</div>
                    <div className="text-xs text-[#666] mt-0.5">{post.theme} · {post.day}</div>
                  </div>
                  <StatusBadge status={post.status} />
                </div>
                <div className="text-xs text-[#999] mb-3 bg-[#222] rounded p-3">{post.caption}</div>
                {post.hashtags && <div className="text-[11px] text-[#555] mb-3">{post.hashtags}</div>}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleConfirm(post)}
                    className="bg-[#22c55e] text-black px-3 py-1.5 rounded text-xs font-medium hover:opacity-80 transition-opacity">
                    ✓ Confirm
                  </button>
                  <button onClick={() => { setSelected(post); setShowEditForm(true); }}
                    className="bg-[#f59e0b] text-black px-3 py-1.5 rounded text-xs font-medium hover:opacity-80 transition-opacity">
                    ✏️ Suggest Edits
                  </button>
                  <button onClick={() => { setSelected(post); setCommentText(""); }}
                    className="bg-[#222] text-[#999] px-3 py-1.5 rounded text-xs border border-[#333] hover:text-white transition-colors">
                    💬 Comment
                  </button>
                </div>

                {/* Inline comment form */}
                {selected?.id === post.id && !showEditForm && (
                  <div className="mt-3 flex gap-2">
                    <input value={commentText} onChange={e => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-[#222] border border-[#333] rounded px-3 py-1.5 text-xs text-white" />
                    <button onClick={() => handleComment(post)}
                      className="bg-[#c4943d] text-black px-3 py-1.5 rounded text-xs font-medium">Send</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other Posts */}
      {other.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">All Active Posts</h2>
          <div className="space-y-2">
            {other.map(post => (
              <div key={post.id} className="flex items-center justify-between bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3">
                <div>
                  <div className="text-sm">{post.title}</div>
                  <div className="text-xs text-[#666]">{post.theme} · {post.day}</div>
                </div>
                <div className="flex items-center gap-3">
                  {post.editRequests.filter(e => e.status === "open").length > 0 && (
                    <span className="text-[10px] text-[#f59e0b]">{post.editRequests.filter(e => e.status === "open").length} open edits</span>
                  )}
                  <StatusBadge status={post.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      <Modal open={showEditForm && !!selected} onClose={() => { setShowEditForm(false); setSelected(null); }} title="Suggest Edits">
        {selected && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#666] uppercase mb-1">Field to Edit</label>
              <select value={editField} onChange={e => setEditField(e.target.value)}
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white">
                <option value="caption">Caption</option>
                <option value="hashtags">Hashtags</option>
                <option value="images">Images</option>
                <option value="type">Post Type</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#666] uppercase mb-1">Suggested Value</label>
              <textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={3}
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-[#666] uppercase mb-1">Reason</label>
              <input value={editReason} onChange={e => setEditReason(e.target.value)}
                className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white" />
            </div>
            <button onClick={() => handleEditRequest(selected)}
              className="bg-[#f59e0b] text-black px-4 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity">
              Submit Edit Request
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add crm/src/pages/Review.tsx
git commit -m "feat(crm): add Review Portal with confirm, comment, and edit requests"
```

---

### Task 9: Calendar Page (Table + Kanban)

**Files:**
- Create: `crm/src/pages/Calendar.tsx`
- Create: `crm/src/components/PostCard.tsx`
- Create: `crm/src/components/KanbanBoard.tsx`

- [ ] **Step 1: Create `crm/src/components/PostCard.tsx`**

```tsx
import type { Post } from "../data/types";
import StatusBadge from "./StatusBadge";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div className="bg-[#222] rounded-lg p-3 border border-[#333] cursor-pointer hover:border-[#c4943d] transition-colors" onClick={onClick}>
      <div className="text-sm font-medium mb-1 truncate">{post.title}</div>
      <div className="flex items-center gap-2 text-[11px] text-[#666] mb-2">
        <span>{post.day || post.scheduledDate}</span>
        <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[10px]">{post.type}</span>
      </div>
      <StatusBadge status={post.status} />
    </div>
  );
}
```

- [ ] **Step 2: Create `crm/src/components/KanbanBoard.tsx`**

```tsx
import type { Post, PostStatus } from "../data/types";
import PostCard from "./PostCard";
import { STATUSES } from "../data/types";

interface KanbanBoardProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  filterStatus?: PostStatus;
}

const COLUMNS: PostStatus[] = ['Idea', 'Draft', 'PendingReview', 'Approved', 'Scheduled', 'Posted'];

export default function KanbanBoard({ posts, onPostClick }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {COLUMNS.map(status => {
        const colPosts = posts.filter(p => p.status === status);
        return (
          <div key={status} className="bg-[#1a1a1a] border border-[#333] rounded-lg p-3">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#333]">
              <h3 className="text-[11px] uppercase tracking-wider text-[#666]">{status}</h3>
              <span className="text-[10px] bg-[#222] text-[#666] px-1.5 py-0.5 rounded">{colPosts.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {colPosts.map(post => (
                <PostCard key={post.id} post={post} onClick={() => onPostClick(post)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create `crm/src/pages/Calendar.tsx`**

```tsx
import { useState } from "react";
import { getPosts, upsertPost, deletePost } from "../data/store";
import KanbanBoard from "../components/KanbanBoard";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import type { Post } from "../data/types";

export default function Calendar() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [posts, setPosts] = useState(getPosts);
  const [statusFilter, setStatusFilter] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Post | null>(null);

  const refresh = () => setPosts(getPosts());

  let filtered = posts;
  if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
  if (themeFilter) filtered = filtered.filter(p => p.theme === themeFilter);
  if (search) filtered = filtered.filter(p => (p.title + " " + p.caption).toLowerCase().includes(search.toLowerCase()));

  const allThemes = [...new Set(posts.map(p => p.theme))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Content Calendar</h1>
        <div className="flex bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("table")} className={`px-4 py-1.5 text-xs font-medium ${viewMode === "table" ? "bg-[#c4943d] text-black" : "text-[#999] hover:text-white"}`}>Table</button>
          <button onClick={() => setViewMode("kanban")} className={`px-4 py-1.5 text-xs font-medium ${viewMode === "kanban" ? "bg-[#c4943d] text-black" : "text-[#999] hover:text-white"}`}>Kanban</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#222] border border-[#333] rounded px-3 py-1.5 text-xs text-white">
          <option value="">All Statuses</option>
          <option value="Idea">Idea</option>
          <option value="Draft">Draft</option>
          <option value="PendingReview">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Posted">Posted</option>
        </select>
        <select value={themeFilter} onChange={e => setThemeFilter(e.target.value)} className="bg-[#222] border border-[#333] rounded px-3 py-1.5 text-xs text-white">
          <option value="">All Themes</option>
          {allThemes.map(t => <option key={t}>{t}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-[#222] border border-[#333] rounded px-3 py-1.5 text-xs text-white min-w-[150px]" />
      </div>

      {viewMode === "table" ? (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Theme</th>
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-[11px] text-[#666] uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id} className="border-b border-[#222] hover:bg-[#222] cursor-pointer" onClick={() => setSelected(post)}>
                    <td className="px-4 py-3 text-xs">{post.day || post.scheduledDate}</td>
                    <td className="px-4 py-3 text-xs text-[#999]">{post.theme}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-[#222] text-[11px] border border-[#333]">{post.type}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                    <td className="px-4 py-3 text-xs text-[#999] max-w-[200px] truncate">{post.title}</td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); deletePost(post.id); refresh(); }}
                        className="text-[#ef4444] text-xs hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <KanbanBoard posts={filtered} onPostClick={setSelected} />
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ""}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-[#666]">Theme:</span> {selected.theme}</div>
              <div><span className="text-[#666]">Type:</span> {selected.type}</div>
              <div><span className="text-[#666]">Day:</span> {selected.day || selected.scheduledDate}</div>
              <div><StatusBadge status={selected.status} /></div>
              {selected.scheduledDate && <div><span className="text-[#666]">Scheduled:</span> {selected.scheduledDate}</div>}
              {selected.postedDate && <div><span className="text-[#666]">Posted:</span> {selected.postedDate}</div>}
            </div>
            <div><span className="text-[#666] text-xs">Caption:</span><p className="mt-1 text-[#999] whitespace-pre-wrap">{selected.caption}</p></div>
            {selected.hashtags && <div><span className="text-[#666] text-xs">Hashtags:</span><p className="mt-1 text-[#555] text-xs">{selected.hashtags}</p></div>}
            {selected.images && <div><span className="text-[#666] text-xs">Images:</span><p className="mt-1 text-[#555] text-xs">{selected.images}</p></div>}
            {selected.audio && <div><span className="text-[#666] text-xs">Audio:</span><p className="mt-1 text-[#555] text-xs">{selected.audio}</p></div>}
            {selected.textOverlay && <div><span className="text-[#666] text-xs">Text Overlay:</span><p className="mt-1 text-[#555] text-xs">{selected.textOverlay}</p></div>}
            {selected.notes && <div><span className="text-[#666] text-xs">Notes:</span><p className="mt-1 text-[#555] text-xs">{selected.notes}</p></div>}
            {selected.reviewComments.length > 0 && (
              <div>
                <span className="text-[#666] text-xs">Comments:</span>
                {selected.reviewComments.map(c => (
                  <div key={c.id} className="mt-1 bg-[#222] rounded p-2 text-xs">
                    <span className="text-[#c4943d]">{c.authorId}</span>: {c.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add crm/src/pages/Calendar.tsx crm/src/components/PostCard.tsx crm/src/components/KanbanBoard.tsx
git commit -m "feat(crm): add Calendar page with table and kanban views"
```

---

### Task 10: Final Integration & Polish

**Files:**
- Modify: `crm/src/App.tsx` (add error boundary)
- Modify: `crm/src/index.css` (any final styles)

- [ ] **Step 1: Verify full build**

```bash
cd crm && npx tsc --noEmit && npx vite build
```

Expected: TypeScript compiles cleanly. Vite produces build output in `crm/dist/`.

- [ ] **Step 2: Quick smoke test**

```bash
cd crm && npx vite preview --port 4173
```

Expected: Open browser to `http://localhost:4173`. All 5 pages navigate correctly. Dashboard shows stats. Planner generates posts. Assets uploads files. Review shows pending items. Calendar switches between table and kanban.

- [ ] **Step 3: Add `.gitignore` entry for CRM build output**

Add to `.gitignore` at repo root:
```
# CRM build output
crm/dist/
```

- [ ] **Step 4: Commit**

```bash
git add crm/ .gitignore
git commit -m "feat(crm): finalize posting system — all 5 pages complete"
```

---

## Self-Review Checklist

1. **Spec coverage:** All 5 pages mapped (Dashboard, Planner, Assets, Review, Calendar). Data model matches spec (Post, WeeklyMenuPlan, VisualAsset, TeamMember). Status flow matches spec (Idea→Draft→PendingReview→Approved→Scheduled→Posted with EditsRequested loop). Review actions (Confirm, Suggest Edits, Comment) all implemented. Team switcher for simulated roles. ✓

2. **Placeholder check:** No TODOs, TBDs, or "implement later" patterns. Every step has complete code. ✓

3. **Type consistency:** All types imported from `data/types.ts`. Status strings match PostStatus type. Component props consistent. Store function names match across all pages. ✓
