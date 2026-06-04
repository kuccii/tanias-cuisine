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
