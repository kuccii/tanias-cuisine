import { useState } from "react";
import { getPosts, upsertPost, getActiveTeamMember, addActivity } from "../data/store";
import type { Post, EditField } from "../data/types";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export default function Review() {
  const [posts, setPosts] = useState(getPosts);
  const member = getActiveTeamMember();
  const [editModal, setEditModal] = useState<Post | null>(null);
  const [editField, setEditField] = useState<EditField>("caption");
  const [editValue, setEditValue] = useState("");
  const [editReason, setEditReason] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const pendingPosts = posts.filter(p => p.status === "PendingReview");
  const activePosts = posts.filter(p => p.status !== "PendingReview" && p.status !== "Idea" && p.status !== "Archived");

  const refresh = () => setPosts(getPosts());

  const handleConfirm = (post: Post) => {
    const updated: Post = {
      ...post,
      status: "Scheduled",
      approvedBy: member.id,
      approvedAt: new Date().toISOString(),
      activityLog: [
        ...post.activityLog,
        {
          id: genId(),
          postId: post.id,
          authorId: member.id,
          action: "Confirmed",
          detail: `Approved by ${member.name}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    upsertPost(updated);
    addActivity({
      id: genId(),
      postId: post.id,
      authorId: member.id,
      action: "Confirmed",
      detail: `"${post.title}" approved by ${member.name}`,
      createdAt: new Date().toISOString(),
    });
    refresh();
  };

  const handleSuggestEdits = () => {
    if (!editModal || !editValue) return;
    const updated: Post = {
      ...editModal,
      status: "EditsRequested",
      editRequests: [
        ...editModal.editRequests,
        {
          id: genId(),
          authorId: member.id,
          field: editField,
          suggestedValue: editValue,
          reason: editReason,
          status: "open",
          createdAt: new Date().toISOString(),
        },
      ],
      activityLog: [
        ...editModal.activityLog,
        {
          id: genId(),
          postId: editModal.id,
          authorId: member.id,
          action: "Edits Requested",
          detail: `${editField} edit suggested by ${member.name}`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    upsertPost(updated);
    addActivity({
      id: genId(),
      postId: editModal.id,
      authorId: member.id,
      action: "Edits Requested",
      detail: `"${editModal.title}" — ${editField} edit suggested by ${member.name}`,
      createdAt: new Date().toISOString(),
    });
    setEditModal(null);
    setEditValue("");
    setEditReason("");
    refresh();
  };

  const handleComment = (post: Post) => {
    const text = commentInputs[post.id]?.trim();
    if (!text) return;
    const updated: Post = {
      ...post,
      reviewComments: [
        ...post.reviewComments,
        {
          id: genId(),
          authorId: member.id,
          text,
          createdAt: new Date().toISOString(),
        },
      ],
      activityLog: [
        ...post.activityLog,
        {
          id: genId(),
          postId: post.id,
          authorId: member.id,
          action: "Comment",
          detail: `${member.name}: "${text}"`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    upsertPost(updated);
    addActivity({
      id: genId(),
      postId: post.id,
      authorId: member.id,
      action: "Comment",
      detail: `${member.name} commented on "${post.title}"`,
      createdAt: new Date().toISOString(),
    });
    setCommentInputs(prev => ({ ...prev, [post.id]: "" }));
    refresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Review Portal</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
          <span>{member.avatar}</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{member.name}</span>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>{member.role}</span>
        </div>
      </div>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Pending Review ({pendingPosts.length})</h2>
        {pendingPosts.length === 0 ? (
          <p style={{ color: "var(--text2)", fontSize: 14 }}>No posts pending review</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendingPosts.map(post => (
              <div key={post.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{post.title}</h3>
                  <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
                    <span>{post.theme}</span>
                    <span>{post.day}</span>
                    <StatusBadge status={post.status} />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4, whiteSpace: "pre-line" }}>{post.caption}</p>
                <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: 12 }}>{post.hashtags}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleConfirm(post)}
                    style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#22c55e", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => { setEditModal(post); setEditValue(""); setEditReason(""); }}
                    style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#f59e0b", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                  >
                    Suggest Edits
                  </button>
                  <button
                    onClick={() => setCommentInputs(prev => ({ ...prev, [post.id]: prev[post.id] ?? "" }))}
                    style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontWeight: 500, cursor: "pointer", fontSize: 13 }}
                  >
                    Comment
                  </button>
                </div>

                {commentInputs[post.id] !== undefined && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <input
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a comment..."
                      style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}
                    />
                    <button
                      onClick={() => handleComment(post)}
                      style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--gray)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>All Active Posts ({activePosts.length})</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {activePosts.map(post => {
            const openEdits = post.editRequests.filter(e => e.status === "open");
            return (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{post.title}</span>
                  {openEdits.length > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 12, color: "var(--orange)", fontWeight: 600 }}>
                      ({openEdits.length} edit request{openEdits.length > 1 ? "s" : ""})
                    </span>
                  )}
                </div>
                <StatusBadge status={post.status} />
              </div>
            );
          })}
        </div>
      </section>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Suggest Edits">
        {editModal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4, display: "block" }}>Field</label>
              <select
                value={editField}
                onChange={e => setEditField(e.target.value as EditField)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
              >
                <option value="caption">Caption</option>
                <option value="hashtags">Hashtags</option>
                <option value="images">Images</option>
                <option value="type">Type</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4, display: "block" }}>Suggested Value</label>
              <textarea
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, minHeight: 80, resize: "vertical" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4, display: "block" }}>Reason</label>
              <input
                value={editReason}
                onChange={e => setEditReason(e.target.value)}
                placeholder="Why is this change needed?"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
              />
            </div>
            <button
              onClick={handleSuggestEdits}
              disabled={!editValue}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: editValue ? "var(--orange)" : "var(--surface2)",
                color: "#111",
                fontWeight: 600,
                cursor: editValue ? "pointer" : "not-allowed",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Submit
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
