import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 84,
          background: "#0b132b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38bdf8",
          fontWeight: 900,
          borderRadius: "36px",
          border: "4px solid #2563eb",
          fontFamily: "monospace",
        }}
      >
        AH
      </div>
    ),
    {
      ...size,
    }
  );
}
