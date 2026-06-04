import { useState } from "react";
import { upsertPost, upsertWeeklyPlan } from "../data/store";
import type { Post, WeeklyMenuPlan } from "../data/types";
import { THEMES, TYPES } from "../data/types";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Planner() {
  const [weekLabel, setWeekLabel] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuItemsStr, setMenuItemsStr] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    const items = menuItemsStr.split(",").map(s => s.trim()).filter(Boolean);
    if (!weekLabel || items.length === 0) return;

    const planId = genId();
    const posts: Post[] = DAYS.map((day, i) => {
      const menuItem = items[i % items.length];
      return {
        id: genId(),
        weekPlanId: planId,
        title: `${menuItem} – ${THEMES[i]}`,
        week: weekLabel,
        day,
        theme: THEMES[i],
        type: TYPES[i % TYPES.length],
        status: "Idea" as const,
        scheduledDate: "",
        postedDate: "",
        images: "",
        audio: "",
        textOverlay: "",
        caption: `${menuItem} featured on ${THEMES[i]}\n📍 KG 8 Ave, Remera`,
        hashtags: "#KigaliFood #TaniaCuisine #KigaliEats",
        cta: "",
        likes: 0,
        comments: 0,
        views: 0,
        saves: 0,
        notes: "",
        assignedTo: "",
        approvedBy: "",
        approvedAt: "",
        reviewComments: [],
        editRequests: [],
        activityLog: [],
      };
    });
    setGeneratedPosts(posts);
    setSaved(false);
  };

  const updatePost = (idx: number, field: string, value: string) => {
    setGeneratedPosts(prev => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const handleSaveAll = () => {
    if (generatedPosts.length === 0) return;

    const plan: WeeklyMenuPlan = {
      id: generatedPosts[0].weekPlanId,
      weekLabel,
      mondayDate: "",
      specialMenuItems: menuItemsStr.split(",").map(s => s.trim()).filter(Boolean),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    upsertWeeklyPlan(plan);
    generatedPosts.forEach(p => upsertPost(p));
    setSaved(true);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Weekly Planner</h1>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <input
            placeholder="Week label (e.g. Week 3)"
            value={weekLabel}
            onChange={e => setWeekLabel(e.target.value)}
            style={{ flex: 1, minWidth: 150, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          <input
            placeholder="Menu name"
            value={menuName}
            onChange={e => setMenuName(e.target.value)}
            style={{ flex: 1, minWidth: 150, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
        </div>
        <input
          placeholder="Menu items (comma-separated)"
          value={menuItemsStr}
          onChange={e => setMenuItemsStr(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, marginBottom: 12 }}
        />
        <button
          onClick={handleGenerate}
          style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          Generate Week Plan
        </button>
      </div>

      {generatedPosts.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {generatedPosts.map((post, i) => (
              <div key={post.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <select
                    value={post.theme}
                    onChange={e => updatePost(i, "theme", e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}
                  >
                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select
                    value={post.type}
                    onChange={e => updatePost(i, "type", e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input
                    value={post.day}
                    onChange={e => updatePost(i, "day", e.target.value)}
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, width: 140 }}
                  />
                </div>
                <input
                  value={post.title}
                  onChange={e => updatePost(i, "title", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, marginBottom: 8 }}
                />
                <textarea
                  value={post.caption}
                  onChange={e => updatePost(i, "caption", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, minHeight: 60, resize: "vertical" }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSaveAll}
              style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "var(--green)", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 15 }}
            >
              Save All to CRM
            </button>
            {saved && <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 15 }}>✓ Saved!</span>}
          </div>
        </>
      )}
    </div>
  );
}
