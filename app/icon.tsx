import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          background: "#0f172a",
          borderRadius: 6,
          padding: 5,
          gap: 2,
        }}
      >
        <div style={{ flex: 1, height: 8,  background: "#3b82f6", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 14, background: "#3b82f6", borderRadius: 2 }} />
        <div style={{ flex: 1, height: 18, background: "#06b6d4", borderRadius: 2 }} />
      </div>
    ),
    { ...size }
  );
}
