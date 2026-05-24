import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          background: "#0f172a",
          borderRadius: 112,
          padding: 96,
          gap: 28,
        }}
      >
        <div style={{ flex: 1, height: 154, background: "#3b82f6", borderRadius: 18 }} />
        <div style={{ flex: 1, height: 231, background: "#3b82f6", borderRadius: 18 }} />
        <div style={{ flex: 1, height: 320, background: "#06b6d4", borderRadius: 18 }} />
      </div>
    ),
    { ...size }
  );
}
