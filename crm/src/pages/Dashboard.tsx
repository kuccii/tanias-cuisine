import { Link } from "react-router-dom";
import { getPosts, getActivity } from "../data/store";
import type { PostStatus } from "../data/types";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const progressStatuses: PostStatus[] = ["Idea", "Draft", "PendingReview", "Approved", "Scheduled", "Posted"];

export default function Dashboard() {
  const posts = getPosts();
  const activity = getActivity();

  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const ws = fmtDate(weekStart);
  const we = fmtDate(weekEnd);

  const total = posts.length;
  const pendingReview = posts.filter(p => p.status === "PendingReview").length;
  const thisWeek = posts.filter(p => p.scheduledDate >= ws && p.scheduledDate < we).length;
  const ideas = posts.filter(p => p.status === "Idea").length;
  const drafts = posts.filter(p => p.status === "Draft").length;
  const posted = posts.filter(p => p.status === "Posted").length;

  const recentActivity = activity.slice(0, 10);

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatsCard label="Total Posts" value={total} color="var(--accent)" />
        <StatsCard label="Pending Review" value={pendingReview} color="var(--orange)" />
        <StatsCard label="This Week" value={thisWeek} color="var(--blue)" />
        <StatsCard label="Ideas" value={ideas} color="var(--gray)" />
        <StatsCard label="Drafts" value={drafts} color="var(--blue)" />
        <StatsCard label="Posted" value={posted} color="var(--green)" />
      </div>

      {pendingReview > 0 && (
        <div style={{ marginBottom: 24, padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
          <Link to="/review" style={{ color: "var(--accent)", textDecoration: "none", fontSize: 14 }}>
            {pendingReview} post{pendingReview > 1 ? "s" : ""} pending review — click to review →
          </Link>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Weekly Progress</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {progressStatuses.map(status => {
              const count = posts.filter(p => p.status === status).length;
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <StatusBadge status={status} />
                    <span style={{ fontSize: 13, color: "var(--text2)" }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--text2)" }}>No activity yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentActivity.map(entry => (
                <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{entry.action}</span>
                    <span style={{ color: "var(--text2)", marginLeft: 8 }}>{entry.detail}</span>
                  </div>
                  <span style={{ color: "var(--text2)", whiteSpace: "nowrap", marginLeft: 12 }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
