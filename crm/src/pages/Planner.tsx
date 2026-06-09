import { useState } from "react";
import { upsertPost, upsertWeeklyPlan } from "../data/store";
import type { Post, WeeklyMenuPlan, DayMenu, MenuDuJour } from "../data/types";
import { THEMES, TYPES } from "../data/types";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MDJ_DAYS: (keyof MenuDuJour)[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const FIELDS: { key: keyof DayMenu; label: string }[] = [
  { key: "starter", label: "Starter" },
  { key: "main", label: "Main" },
  { key: "accompaniment", label: "Accompaniment" },
  { key: "dessert", label: "Dessert" },
];

export default function Planner() {
  const [weekLabel, setWeekLabel] = useState("");
  const [menuItemsStr, setMenuItemsStr] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);
  const [saved, setSaved] = useState(false);
  const [genError, setGenError] = useState("");
  const [menuDuJour, setMenuDuJour] = useState<MenuDuJour>(() => ({
    monday: { starter: "Caesar salad", main: "Fish kebab", accompaniment: "Ginger yellow rice, Spicy French fries, Peas vegetable", dessert: "Crepes" },
    tuesday: { starter: "Vinaigrette Avocado salad", main: "Special Tania's Beef émincé", accompaniment: "Jolof rice, Minted potatoes, Mixed vegetables", dessert: "Fruit salad" },
    wednesday: { starter: "Mushroom soup", main: "Open chicken wings", accompaniment: "Steamed rice, French fries, Season vegetables", dessert: "Lemon cake" },
    thursday: { starter: "Vegetable soup", main: "Beef stew", accompaniment: "Steamed rice, Potatoes croquettes, Lengalenga (Greens)", dessert: "Season fruits" },
    friday: { starter: "Pumpkin soup", main: "Chicken stew", accompaniment: "Vegetable rice, Fried banana, Mixed vegetable", dessert: "Mousse au chocolat" },
  }));

  const updateDay = (day: keyof MenuDuJour, field: keyof DayMenu, value: string) => {
    setMenuDuJour(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleGenerate = () => {
    const items = menuItemsStr.split(",").map(s => s.trim()).filter(Boolean);
    if (!weekLabel || items.length === 0) {
      setGenError("Please enter a week label and at least one menu item");
      return;
    }
    setGenError("");
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
      menuDuJour,
    };
    upsertWeeklyPlan(plan);
    generatedPosts.forEach(p => upsertPost(p));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Weekly Planner</h1>

      {/* Week posts generator */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <input
            placeholder="Week label (e.g. Week 3)"
            value={weekLabel}
            onChange={e => setWeekLabel(e.target.value)}
            style={{ flex: 1, minWidth: 150, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
        </div>
        <input
          placeholder="Menu items (comma-separated)"
          value={menuItemsStr}
          onChange={e => setMenuItemsStr(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, marginBottom: 12 }}
        />
        {genError && (
          <div style={{ color: "var(--red)", fontSize: 13, marginTop: 8 }}>{genError}</div>
        )}
        <button
          onClick={handleGenerate}
          style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          Generate Week Plan
        </button>
      </div>

      {/* Menu du Jour */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Menu du Jour</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
          Fill in the daily rotating menu for Monday – Friday.
        </p>
        <div className="grid-mdj-days" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {MDJ_DAYS.map(day => (
            <div key={day} style={{ padding: 16, background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, textTransform: "capitalize", color: "var(--accent)" }}>{day}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FIELDS.map(field => (
                  <label key={field.key} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label}</span>
                    <input
                      value={menuDuJour[day][field.key]}
                      onChange={e => updateDay(day, field.key, e.target.value)}
                      placeholder={field.label}
                      style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 13 }}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated posts */}
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
