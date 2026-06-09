import { useState, useRef } from "react";
import { getAssets, addAsset, deleteAsset } from "../data/store";
import type { VisualAsset } from "../data/types";
import Modal from "../components/Modal";

export default function Assets() {
  const [assets, setAssets] = useState(getAssets);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<VisualAsset | null>(null);
  const [name, setName] = useState("");
  const [dishName, setDishName] = useState("");
  const [tags, setTags] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileType, setFileType] = useState<"photo" | "video">("photo");
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const allTags = [...new Set(assets.flatMap(a => a.tags))];
  const filtered = activeTag ? assets.filter(a => a.tags.includes(activeTag)) : assets;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileType(file.type.startsWith("video/") ? "video" : "photo");
    const reader = new FileReader();
    reader.onload = () => setFileData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!fileData || !name) return;
    const asset: VisualAsset = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name,
      type: fileType,
      data: fileData,
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      weekPlanId: "",
      dishName,
      uploadedAt: new Date().toISOString(),
    };
    addAsset(asset);
    setAssets(getAssets());
    setUploadOpen(false);
    setName("");
    setDishName("");
    setTags("");
    setFileData("");
    if (fileRef.current) fileRef.current.value = "";
    setToast("Asset uploaded");
    setTimeout(() => setToast(""), 2500);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this asset?")) return;
    deleteAsset(id);
    setAssets(getAssets());
    if (previewAsset?.id === id) setPreviewAsset(null);
  };

  const tagBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: "1px solid var(--border)",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#111" : "var(--text)",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Assets</h1>
        <button
          onClick={() => setUploadOpen(true)}
          style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
        >
          + Upload
        </button>
      </div>

      {toast && (
        <div style={{ marginBottom: 16, padding: "10px 16px", borderRadius: 8, background: "var(--green)", color: "#111", fontWeight: 600, fontSize: 14, display: "inline-block" }}>
          {toast}
        </div>
      )}

      {allTags.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {tagBtn("All", activeTag === null, () => setActiveTag(null))}
          {allTags.map(tag => tagBtn(tag, activeTag === tag, () => setActiveTag(tag)))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text2)" }}>
          <p style={{ fontSize: 16, marginBottom: 12 }}>No assets yet</p>
          <button
            onClick={() => setUploadOpen(true)}
            style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#111", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
          >
            + Upload
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {filtered.map(asset => (
            <div
              key={asset.id}
              style={{ position: "relative", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", cursor: "pointer" }}
              onClick={() => setPreviewAsset(asset)}
            >
              {asset.type === "video" ? (
                <video src={asset.data} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : (
                <img src={asset.data} alt={asset.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              )}
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{asset.name}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>{asset.type === "video" ? "Video" : "Photo"}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(asset.id); }}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
                className="asset-delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`.asset-delete { opacity: 0.5; transition: opacity 0.15s; } .asset-delete:hover, .asset-delete:focus { opacity: 1; } div:hover > .asset-delete { opacity: 1; } @media (hover: none) { .asset-delete { opacity: 0.8; } }`}</style>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Asset">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ fontSize: 13, color: "var(--text)" }} />
          <input
            placeholder="Asset name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          <input
            placeholder="Dish name (optional)"
            value={dishName}
            onChange={e => setDishName(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          <input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14 }}
          />
          <button
            onClick={handleUpload}
            disabled={!fileData || !name}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: fileData && name ? "var(--accent)" : "var(--surface2)",
              color: "#111",
              fontWeight: 600,
              cursor: fileData && name ? "pointer" : "not-allowed",
              fontSize: 14,
              marginTop: 8,
            }}
          >
            Upload
          </button>
        </div>
      </Modal>

      <Modal open={!!previewAsset} onClose={() => setPreviewAsset(null)} title={previewAsset?.name || ""}>
        {previewAsset && (
          <div>
            {previewAsset.type === "video" ? (
              <video src={previewAsset.data} controls style={{ width: "100%", maxHeight: 400, borderRadius: 8 }} />
            ) : (
              <img src={previewAsset.data} alt={previewAsset.name} style={{ width: "100%", maxHeight: 400, objectFit: "contain", borderRadius: 8 }} />
            )}
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--text2)", display: "flex", flexDirection: "column", gap: 4 }}>
              <span>Type: {previewAsset.type === "video" ? "Video" : "Photo"}</span>
              {previewAsset.dishName && <span>Dish: {previewAsset.dishName}</span>}
              {previewAsset.tags.length > 0 && <span>Tags: {previewAsset.tags.join(", ")}</span>}
              <span>Uploaded: {new Date(previewAsset.uploadedAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
