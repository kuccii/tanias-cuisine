import type { Post } from "../data/types";
import StatusBadge from "./StatusBadge";

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
  transition: "border-color 0.15s",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const titleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const typeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "1px 8px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 500,
  background: "var(--border)",
  color: "var(--text2)",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <div style={titleStyle}>{post.title}</div>
      <div style={rowStyle}>
        <span style={{ fontSize: 12, color: "var(--text2)" }}>
          {post.day}{post.scheduledDate ? ` ${post.scheduledDate}` : ""}
        </span>
        <span style={typeStyle}>{post.type}</span>
      </div>
      <div>
        <StatusBadge status={post.status} />
      </div>
    </div>
  );
}
