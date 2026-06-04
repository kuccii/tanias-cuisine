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
