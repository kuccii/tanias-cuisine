import { useState } from "react";
import { getPosts, deletePost } from "../data/store";
import KanbanBoard from "../components/KanbanBoard";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import type { Post } from "../data/types";
import { THEMES, STATUSES } from "../data/types";

type ViewMode = "table" | "kanban";
type SortField = "day" | "theme" | "type" | "status" | "title";
type SortDir = "asc" | "desc";

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "var(--text2)",
  minWidth: 100,
};

const valueStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text)",
};

const sectionStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  padding: "8px 0",
  borderBottom: "1px solid var(--border)",
};

const detailContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  maxHeight: "60vh",
  overflowY: "auto",
};

export default function Calendar() {
  const [posts, setPosts] = useState(getPosts);
  const [view, setView] = useState<ViewMode>("table");
  const [statusFilter, setStatusFilter] = useState("");
  const [themeFilter, setThemeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("day");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [detailPost, setDetailPost] = useState<Post | null>(null);

  const refresh = () => setPosts(getPosts());

  const filtered = posts.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (themeFilter && p.theme !== themeFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortArrow = (field: SortField) => {
    if (sortField !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    deletePost(id);
    refresh();
    if (detailPost?.id === id) setDetailPost(null);
  };

  const thBtn = (field: SortField, label: string) => (
    <th
      onClick={() => toggleSort(field)}
      style={{
        padding: "8px 12px",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text2)",
        cursor: "pointer",
        userSelect: "none",
        borderBottom: "1px solid var(--border)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <span style={{ color: "var(--accent)" }}>{sortArrow(field)}</span>
    </th>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Calendar</h1>

        <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
          <button
            onClick={() => setView("table")}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              background: view === "table" ? "var(--accent)" : "transparent",
              color: view === "table" ? "#111" : "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Table
          </button>
          <button
            onClick={() => setView("kanban")}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: "none",
              background: view === "kanban" ? "var(--accent)" : "transparent",
              color: view === "kanban" ? "#111" : "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Kanban
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 13 }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 13 }}
        >
          <option value="">All Themes</option>
          {THEMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 13, minWidth: 180 }}
        />
        {filtered.length > 0 && (
          <span style={{ fontSize: 13, color: "var(--text2)", alignSelf: "center" }}>
            {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {view === "table" ? (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {thBtn("day", "Date")}
                {thBtn("theme", "Theme")}
                {thBtn("type", "Type")}
                {thBtn("status", "Status")}
                {thBtn("title", "Title")}
                <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 13, fontWeight: 600, color: "var(--text2)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => setDetailPost(post)}
                  style={{ cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{post.day}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" }}>{post.theme}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" }}>{post.type}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                    <StatusBadge status={post.status} />
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid var(--border)" }}>{post.title}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "1px solid var(--red)",
                        background: "transparent",
                        color: "var(--red)",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "var(--text2)", fontSize: 14 }}>
              No posts match your filters
            </div>
          )}
        </div>
      ) : (
        <KanbanBoard posts={filtered} onPostClick={(post) => setDetailPost(post)} />
      )}

      <Modal open={!!detailPost} onClose={() => setDetailPost(null)} title={detailPost?.title || ""}>
        {detailPost && (
          <div style={detailContainer}>
            <div style={sectionStyle}>
              <span style={labelStyle}>Theme</span>
              <span style={valueStyle}>{detailPost.theme}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Type</span>
              <span style={valueStyle}>{detailPost.type}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Day</span>
              <span style={valueStyle}>{detailPost.day}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Status</span>
              <StatusBadge status={detailPost.status} />
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Scheduled</span>
              <span style={valueStyle}>{detailPost.scheduledDate || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Posted</span>
              <span style={valueStyle}>{detailPost.postedDate || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Caption</span>
              <span style={{ ...valueStyle, whiteSpace: "pre-line" }}>{detailPost.caption || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Hashtags</span>
              <span style={valueStyle}>{detailPost.hashtags || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Images</span>
              <span style={valueStyle}>{detailPost.images || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Audio</span>
              <span style={valueStyle}>{detailPost.audio || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Text Overlay</span>
              <span style={valueStyle}>{detailPost.textOverlay || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Notes</span>
              <span style={{ ...valueStyle, whiteSpace: "pre-line" }}>{detailPost.notes || "—"}</span>
            </div>
            <div style={sectionStyle}>
              <span style={labelStyle}>Comments</span>
              <span style={valueStyle}>{detailPost.reviewComments.length} comment{detailPost.reviewComments.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
