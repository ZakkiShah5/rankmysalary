"use client";

import { useEffect, useRef } from "react";

const CX = 140;
const CY = 128;
const R  = 112;
const ARC_LEN = Math.PI * R; // ≈ 351.9

// sweep=1 = clockwise in SVG = draws the arch going UP through the top ✓
// (sweep=0 was wrong — it drew downward, placing the arc outside the viewBox)
const ARC_PATH = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

// Convert 0-100% to (x,y) on the arc
function ptOnArc(pct: number, radius: number) {
  const deg = 180 - pct * 1.8; // 0%=180° (left), 100%=0° (right)
  const rad = (deg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

interface Props {
  percentile: number;
  color: string;
  colorDim: string;
}

export default function GaugeArc({ percentile, color, colorDim }: Props) {
  const fillRef  = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  // Stable IDs — color hex without "#"
  const gradId = `g-${color.replace("#", "")}`;
  const filtId = `f-${color.replace("#", "")}`;

  useEffect(() => {
    const fill  = fillRef.current;
    const group = groupRef.current;
    if (!fill || !group) return;

    // Snap to start without transition
    fill.style.transition  = "none";
    group.style.transition = "none";
    fill.style.strokeDashoffset = String(ARC_LEN);
    group.style.transform = "rotate(-90deg)";

    // Force reflow so the reset commits before the transition starts
    void fill.getBoundingClientRect();

    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    fill.style.transition  = `stroke-dashoffset 1.6s ${ease}`;
    group.style.transition = `transform 1.6s ${ease}`;

    requestAnimationFrame(() => {
      fill.style.strokeDashoffset = String(ARC_LEN * (1 - percentile / 100));
      group.style.transform = `rotate(${-90 + (percentile / 100) * 180}deg)`;
    });
  }, [percentile]);

  const ticks = [0, 25, 50, 75, 100];

  return (
    <svg
      viewBox="0 0 280 148"
      className="w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={colorDim} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>

        <filter id={filtId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background track */}
      <path
        d={ARC_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Colored fill arc (animated via useEffect) */}
      <path
        ref={fillRef}
        d={ARC_PATH}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={ARC_LEN}
        strokeDashoffset={ARC_LEN}
        filter={`url(#${filtId})`}
      />

      {/* Tick marks */}
      {ticks.map((t) => {
        const inner = ptOnArc(t, R - 11);
        const outer = ptOnArc(t, R + 11);
        return (
          <line
            key={t}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={t === 0 || t === 100 ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Axis labels */}
      <text x={CX - R - 10} y={CY + 18} fill="rgba(255,255,255,0.28)" fontSize="11" textAnchor="middle">0</text>
      <text x={CX + R + 10} y={CY + 18} fill="rgba(255,255,255,0.28)" fontSize="11" textAnchor="middle">100</text>
      <text x={CX}           y={CY - R - 12} fill="rgba(255,255,255,0.28)" fontSize="11" textAnchor="middle">50</text>

      {/* Needle — rotates around (CX, CY) */}
      <g
        ref={groupRef}
        style={{ transform: "rotate(-90deg)", transformOrigin: `${CX}px ${CY}px` }}
      >
        <line
          x1={CX} y1={CY}
          x2={CX} y2={CY - 82}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={8}   fill="rgba(255,255,255,0.9)" />
      <circle cx={CX} cy={CY} r={4}   fill="#0f172a" />
    </svg>
  );
}
