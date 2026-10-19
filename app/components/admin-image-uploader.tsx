"use client";

import React, { useState, useRef } from "react";

interface AdminImageUploaderProps {
  label: string;
  helperText?: string;
  mode?: "single" | "multiple";
  value?: string;
  values?: string[];
  onChangeSingle?: (url: string) => void;
  onChangeMultiple?: (urls: string[]) => void;
  onClearSingle?: () => void;
}

export default function AdminImageUploader({
  label,
  helperText,
  mode = "single",
  value = "",
  values = [],
  onChangeSingle,
  onChangeMultiple,
  onClearSingle,
}: AdminImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Direct File Upload handler
  async function handleFileUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      if (mode === "multiple") {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      } else {
        formData.append("file", files[0]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image upload failed.");
      }

      if (mode === "single") {
        if (onChangeSingle) {
          onChangeSingle(data.url);
        }
      } else {
        const uploadedUrls = data.files
          ? data.files.map((f: any) => f.url)
          : [data.url];
        if (onChangeMultiple) {
          onChangeMultiple([...values, ...uploadedUrls]);
        }
      }
    } catch (err: any) {
      console.error("Direct upload error:", err);
      // Fallback: Convert small images (< 1.5MB) to client Base64 Data URL if API fails
      try {
        const fallbackFile = files[0];
        if (fallbackFile && fallbackFile.size < 1.5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64Url = e.target?.result as string;
            if (base64Url) {
              if (mode === "single" && onChangeSingle) {
                onChangeSingle(base64Url);
              } else if (mode === "multiple" && onChangeMultiple) {
                onChangeMultiple([...values, base64Url]);
              }
              setErrorMessage("Upload saved via client-side base64 fallback.");
            }
          };
          reader.readAsDataURL(fallbackFile);
          return;
        }
      } catch {
        // ignore fallback error
      }
      setErrorMessage(err.message || "Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Add Image URL handler
  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setErrorMessage("Please enter a valid URL starting with https://, http://, or /");
      return;
    }

    setErrorMessage(null);
    if (mode === "single") {
      if (onChangeSingle) onChangeSingle(trimmed);
      setUrlInput("");
    } else {
      if (onChangeMultiple) {
        onChangeMultiple([...values, trimmed]);
      }
      setUrlInput("");
    }
  }

  // Remove Screenshot at index
  function handleRemoveScreenshot(index: number) {
    if (onChangeMultiple) {
      const updated = values.filter((_, i) => i !== index);
      onChangeMultiple(updated);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#071324",
        border: "1px solid #1e293b",
        borderRadius: "6px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <div>
          <label style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0", display: "block" }}>
            {label}
            {mode === "multiple" && (
              <span style={{ fontSize: "11px", color: "#38bdf8", marginLeft: "8px", fontWeight: "normal" }}>
                ({values.length} attached)
              </span>
            )}
          </label>
          {helperText && (
            <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "2px" }}>
              {helperText}
            </span>
          )}
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", backgroundColor: "#0b1d38", borderRadius: "4px", padding: "2px", border: "1px solid #1e293b" }}>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "600",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              backgroundColor: activeTab === "upload" ? "#2563eb" : "transparent",
              color: activeTab === "upload" ? "#ffffff" : "#94a3b8",
            }}
          >
            📁 File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "600",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              backgroundColor: activeTab === "url" ? "#2563eb" : "transparent",
              color: activeTab === "url" ? "#ffffff" : "#94a3b8",
            }}
          >
            🔗 Image Link
          </button>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#7f1d1d33",
            border: "1px solid #991b1b",
            borderRadius: "4px",
            color: "#fca5a5",
            fontSize: "12px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{ background: "none", border: "none", color: "#fca5a5", cursor: "pointer", fontSize: "14px" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: DIRECT FILE UPLOAD */}
      {activeTab === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              handleFileUpload(e.dataTransfer.files);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? "2px dashed #38bdf8" : "2px dashed #1e293b",
            borderRadius: "6px",
            padding: "20px 14px",
            textAlign: "center",
            backgroundColor: isDragging ? "#0b2347" : "#051121",
            cursor: isUploading ? "wait" : "pointer",
            transition: "all 0.15s ease",
            marginBottom: "12px",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            multiple={mode === "multiple"}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(e.target.files);
              }
            }}
          />

          {isUploading ? (
            <div style={{ color: "#38bdf8", fontSize: "13px", fontWeight: "600" }}>
              ⏳ Uploading image to storage pipeline...
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>☁️</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>
                Click to browse or drag &amp; drop {mode === "multiple" ? "images / screenshots" : "project cover"}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                Supports JPG, PNG, WebP, GIF, SVG (up to 10MB)
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IMAGE LINK / URL INPUT */}
      {activeTab === "url" && (
        <form onSubmit={handleAddUrl} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image link: https://images.unsplash.com/... or /images/..."
            style={{
              flex: 1,
              padding: "8px 12px",
              backgroundColor: "#051121",
              border: "1px solid #1e293b",
              borderRadius: "4px",
              color: "#ffffff",
              fontSize: "13px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "600",
              fontSize: "12px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {mode === "multiple" ? "+ Add Screenshot" : "Set Cover"}
          </button>
        </form>
      )}

      {/* PREVIEW SECTION: SINGLE MODE */}
      {mode === "single" && value && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px",
            backgroundColor: "#051121",
            borderRadius: "4px",
            border: "1px solid #1e293b",
          }}
        >
          {/* Thumbnail */}
          <div
            style={{
              width: "72px",
              height: "48px",
              borderRadius: "4px",
              overflow: "hidden",
              backgroundColor: "#000",
              flexShrink: 0,
              position: "relative",
              border: "1px solid #334155",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Project Cover Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect fill='%231e293b' width='100' height='60'/%3E%3Ctext fill='%2394a3b8' font-size='10' font-family='sans-serif' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EBroken URL%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", color: "#10b981", fontWeight: "700" }}>✓ Cover Image Active</div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "380px",
              }}
              title={value}
            >
              {value}
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => {
              if (onClearSingle) onClearSingle();
              else if (onChangeSingle) onChangeSingle("");
            }}
            style={{
              padding: "4px 10px",
              backgroundColor: "#ef444422",
              color: "#f87171",
              border: "1px solid #ef444444",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* PREVIEW SECTION: MULTIPLE MODE (SCREENSHOTS GALLERY) */}
      {mode === "multiple" && values.length > 0 && (
        <div>
          <div style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "600", marginBottom: "8px" }}>
            Attached Screenshots ({values.length}):
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "10px",
            }}
          >
            {values.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                style={{
                  position: "relative",
                  backgroundColor: "#051121",
                  border: "1px solid #1e293b",
                  borderRadius: "4px",
                  overflow: "hidden",
                  padding: "4px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    position: "relative",
                    borderRadius: "3px",
                    overflow: "hidden",
                    backgroundColor: "#000",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect fill='%231e293b' width='100' height='60'/%3E%3Ctext fill='%2394a3b8' font-size='10' font-family='sans-serif' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EBroken URL%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "4px",
                    padding: "0 2px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveScreenshot(idx)}
                    title="Remove this screenshot"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "0 2px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
