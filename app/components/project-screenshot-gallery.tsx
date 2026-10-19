"use client";

import React, { useState, useEffect } from "react";

interface ProjectScreenshotGalleryProps {
  title: string;
  coverImage?: string;
  screenshots?: string[];
}

export default function ProjectScreenshotGallery({
  title,
  coverImage,
  screenshots = [],
}: ProjectScreenshotGalleryProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Combine cover image (if present) with screenshots for the lightbox pool
  const allImages = React.useMemo(() => {
    const list: { url: string; label: string }[] = [];
    if (coverImage) {
      list.push({ url: coverImage, label: `${title} - Primary Cover` });
    }
    screenshots.forEach((url, i) => {
      list.push({ url, label: `${title} - System Architecture / Screenshot ${i + 1}` });
    });
    return list;
  }, [coverImage, screenshots, title]);

  // Handle keyboard events for lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : 0));
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0
        );
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, allImages.length]);

  if (!coverImage && (!screenshots || screenshots.length === 0)) {
    return null;
  }

  return (
    <div style={{ marginTop: "24px", marginBottom: "28px" }}>
      {/* Primary Cover Banner */}
      {coverImage && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #cbd5e1",
              backgroundColor: "#051121",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              cursor: "pointer",
            }}
            onClick={() => setActiveLightboxIndex(0)}
            title="Click to view full-resolution cover image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={`${title} Cover`}
              style={{
                width: "100%",
                maxHeight: "440px",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "rgba(5, 48, 86, 0.85)",
                color: "#ffffff",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🔍 Enlarge Cover</span>
            </div>
          </div>
        </div>
      )}

      {/* Screenshots Gallery Strip */}
      {screenshots && screenshots.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h3
              style={{
                color: "#053056",
                fontSize: "18px",
                margin: 0,
                borderBottom: "none",
                paddingBottom: 0,
              }}
            >
              📷 System Architecture &amp; Production Screenshots ({screenshots.length})
            </h3>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              Click any image to expand
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "14px",
            }}
          >
            {screenshots.map((url, idx) => {
              const imageIndex = coverImage ? idx + 1 : idx;
              return (
                <div
                  key={`${url}-${idx}`}
                  onClick={() => setActiveLightboxIndex(imageIndex)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                  }}
                >
                  <div
                    style={{
                      height: "120px",
                      backgroundColor: "#071324",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Architecture Screenshot ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect fill='%230a192f' width='200' height='120'/%3E%3Ctext fill='%2394a3b8' font-size='12' font-family='sans-serif' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EPreview Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div
                    style={{
                      padding: "8px 10px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#053056",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f8fafc",
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <span>View Screenshot #{idx + 1}</span>
                    <span style={{ color: "#9CBE41", fontSize: "14px" }}>↗</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && allImages[activeLightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(5, 15, 30, 0.95)",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Top Bar with Counter and Close Button */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "20px",
              right: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#ffffff",
              zIndex: 100000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "14px", fontWeight: "600" }}>
              {allImages[activeLightboxIndex].label} ({activeLightboxIndex + 1} of{" "}
              {allImages.length})
            </div>
            <button
              type="button"
              onClick={() => setActiveLightboxIndex(null)}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                color: "#ffffff",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Main Zoomed Image */}
          <div
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeLightboxIndex].url}
              alt={allImages[activeLightboxIndex].label}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "6px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

          {/* Prev / Next Controls */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex(
                    (activeLightboxIndex - 1 + allImages.length) % allImages.length
                  );
                }}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  fontSize: "22px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((activeLightboxIndex + 1) % allImages.length);
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "50%",
                  width: "44px",
                  height: "44px",
                  fontSize: "22px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
