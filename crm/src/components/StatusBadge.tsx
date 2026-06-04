import type { PostStatus } from "../data/types";

interface StatusBadgeProps {
  status: PostStatus;
}

const baseStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "20px",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-${status}`} style={baseStyle}>
      {status === "PendingReview" ? "Review" : status === "EditsRequested" ? "Edits" : status}
    </span>
  );
}
