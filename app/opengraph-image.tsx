import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #0f172a 0%, #1a2540 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Purple radial glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(139,92,246,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Indigo glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 72px",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(99,102,241,0.18)",
                border: "1px solid rgba(99,102,241,0.35)",
                borderRadius: 24,
                padding: "8px 18px",
                color: "#818cf8",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#6366f1",
                }}
              />
              BLS OES 2024 · 116 Occupations · All 50 States
            </div>
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-2px",
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#f1f5f9" }}>Salary</span>
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Percentile Calculator
            </span>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 26,
              color: "#94a3b8",
              lineHeight: 1.5,
              maxWidth: 680,
              marginBottom: 48,
            }}
          >
            See what percentile your salary ranks in nationally and in your state
            — free, instant, and powered by official BLS data.
          </div>

          {/* Sample result card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: "rgba(30,41,59,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "24px 32px",
              maxWidth: 680,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Sample · Software Developer · California
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#f1f5f9",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                }}
              >
                You earn more than{" "}
                <span style={{ color: "#4ade80", fontSize: 40 }}>73%</span>
                {" "}of workers
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 72px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(15,23,42,0.6)",
          }}
        >
          <span style={{ color: "#334155", fontSize: 16 }}>rankmysalary.com</span>
          <span style={{ color: "#334155", fontSize: 16 }}>
            Free · No signup · Instant results
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
