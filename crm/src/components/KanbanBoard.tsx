import type { Post, PostStatus } from "../data/types";
import PostCard from "./PostCard";

interface KanbanBoardProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const KANBAN_COLUMNS: PostStatus[] = [
  "Idea",
  "Draft",
  "PendingReview",
  "Approved",
  "Scheduled",
  "Posted",
];

const boardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 12,
};

const columnStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const headerStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  paddingBottom: 8,
  borderBottom: "1px solid var(--border)",
  marginBottom: 4,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const countStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text2)",
  background: "var(--surface2)",
  padding: "0 8px",
  borderRadius: 999,
  lineHeight: "20px",
};

export default function KanbanBoard({ posts, onPostClick }: KanbanBoardProps) {
  return (
    <div style={boardStyle}>
      {KANBAN_COLUMNS.map((status) => {
        const columnPosts = posts.filter((p) => p.status === status);
        return (
          <div key={status} style={columnStyle}>
            <div style={headerStyle}>
              <span>{status === "PendingReview" ? "Review" : status}</span>
              <span style={countStyle}>{columnPosts.length}</span>
            </div>
            {columnPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onPostClick(post)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
