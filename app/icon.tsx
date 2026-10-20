import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "#0b132b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38bdf8",
          fontWeight: 900,
          borderRadius: "6px",
          border: "1px solid #2563eb",
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
