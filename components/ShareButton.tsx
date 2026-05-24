"use client";

import { useState } from "react";

export interface ShareCardData {
  nationalPercentile: number;
  statePercentile: number;
  salary: number;
  stateName: string;
  categoryLabel: string;
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function fmtSalary(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function accentFor(pct: number): { hi: string; lo: string; glow: string } {
  if (pct >= 75) return { hi: "#4ade80", lo: "#166534", glow: "rgba(74,222,128,0.20)" };
  if (pct >= 50) return { hi: "#60a5fa", lo: "#1e40af", glow: "rgba(96,165,250,0.20)" };
  if (pct >= 25) return { hi: "#fbbf24", lo: "#92400e", glow: "rgba(251,191,36,0.20)" };
  return { hi: "#f87171", lo: "#991b1b", glow: "rgba(248,113,113,0.20)" };
}

async function generateCard(data: ShareCardData): Promise<Blob> {
  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const { nationalPercentile: np, statePercentile: sp, stateName, categoryLabel, salary } = data;
  const { hi, lo, glow } = accentFor(np);

  // ── Background ────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0f172a");
  bg.addColorStop(1, "#1a2540");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Radial glow top-right
  const g1 = ctx.createRadialGradient(W * 0.82, H * 0.1, 0, W * 0.82, H * 0.1, 420);
  g1.addColorStop(0, glow);
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Radial glow bottom-left
  const g2 = ctx.createRadialGradient(W * 0.1, H * 0.92, 0, W * 0.1, H * 0.92, 280);
  g2.addColorStop(0, "rgba(99,102,241,0.14)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const F = (size: number, weight = 400) =>
    `${weight} ${size}px system-ui,-apple-system,"Segoe UI",sans-serif`;

  function txt(
    str: string,
    x: number,
    y: number,
    font: string,
    color: string,
    align: CanvasTextAlign = "center",
    baseline: CanvasTextBaseline = "alphabetic"
  ) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillText(str, x, y);
  }

  function pill(x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // ── Top badge ─────────────────────────────────────────────────────────────
  const BADGE = "Salary Percentile Calculator";
  ctx.font = F(19, 600);
  const bw = ctx.measureText(BADGE).width + 28;
  pill(60, 30, bw, 36, 18, "rgba(255,255,255,0.07)", "rgba(255,255,255,0.12)");
  txt(BADGE, 74, 30 + 18, F(19, 600), "#64748b", "left", "middle");

  // ── "I earn more than" ────────────────────────────────────────────────────
  txt("I earn more than", W / 2, 108, F(40), "rgba(148,163,184,0.85)");

  // ── Big percentage ────────────────────────────────────────────────────────
  ctx.font = F(138, 800);
  ctx.fillStyle = hi;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${np}%`, W / 2, 252);

  // ── Occupation + state ────────────────────────────────────────────────────
  ctx.font = F(30, 600);
  let cat = categoryLabel;
  while (ctx.measureText(`of ${cat} workers`).width > W - 120) {
    cat = cat.slice(0, -4) + "…";
  }
  txt(`of ${cat} workers`, W / 2, 295, F(30, 600), "#e2e8f0");
  txt(`in ${stateName}`, W / 2, 335, F(26), "#94a3b8");

  // ── Progress bar ──────────────────────────────────────────────────────────
  const BX = 80, BW = W - 160;
  const NAT_BY = 388, NAT_BH = 28, NAT_BR = 14;
  const ST_BY = NAT_BY + NAT_BH + 10, ST_BH = 10, ST_BR = 5;

  // National track
  pill(BX, NAT_BY, BW, NAT_BH, NAT_BR, "rgba(255,255,255,0.07)");

  // National fill
  const natFW = Math.max(NAT_BR * 2, (np / 100) * BW);
  const natG = ctx.createLinearGradient(BX, 0, BX + natFW, 0);
  natG.addColorStop(0, lo);
  natG.addColorStop(1, hi);
  ctx.beginPath();
  ctx.roundRect(BX, NAT_BY, natFW, NAT_BH, NAT_BR);
  ctx.fillStyle = natG;
  ctx.fill();

  // State track + fill
  pill(BX, ST_BY, BW, ST_BH, ST_BR, "rgba(255,255,255,0.05)");
  const stFW = Math.max(ST_BR * 2, (sp / 100) * BW);
  pill(BX, ST_BY, stFW, ST_BH, ST_BR, "rgba(148,163,184,0.30)");

  // Tick marks
  for (const t of [25, 50, 75]) {
    const tx = BX + (t / 100) * BW;
    ctx.beginPath();
    ctx.moveTo(tx, NAT_BY - 6);
    ctx.lineTo(tx, ST_BY + ST_BH + 6);
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // National pointer (triangle above bar)
  const npX = BX + (np / 100) * BW;
  ctx.beginPath();
  ctx.moveTo(npX, NAT_BY - 4);
  ctx.lineTo(npX - 10, NAT_BY - 20);
  ctx.lineTo(npX + 10, NAT_BY - 20);
  ctx.closePath();
  ctx.fillStyle = hi;
  ctx.fill();

  // State pointer (outline triangle below state bar)
  const spX = BX + (sp / 100) * BW;
  ctx.beginPath();
  ctx.moveTo(spX, ST_BY + ST_BH + 4);
  ctx.lineTo(spX - 8, ST_BY + ST_BH + 16);
  ctx.lineTo(spX + 8, ST_BY + ST_BH + 16);
  ctx.closePath();
  ctx.strokeStyle = "rgba(148,163,184,0.55)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Axis labels
  const tlY = ST_BY + ST_BH + 34;
  ctx.font = F(17, 500);
  ctx.fillStyle = "rgba(71,85,105,0.9)";
  for (const [t, al] of [
    [0, "left"], [25, "center"], [50, "center"], [75, "center"], [100, "right"],
  ] as [number, CanvasTextAlign][]) {
    ctx.textAlign = al;
    ctx.textBaseline = "alphabetic";
    const lx = t === 0 ? BX : t === 100 ? BX + BW : BX + (t / 100) * BW;
    ctx.fillText(`${t}%`, lx, tlY);
  }

  // ── Legend row ────────────────────────────────────────────────────────────
  const LEG_Y = tlY + 52;
  const LEG_CX = W / 2;

  ctx.beginPath();
  ctx.arc(LEG_CX - 220, LEG_Y - 8, 7, 0, Math.PI * 2);
  ctx.fillStyle = hi;
  ctx.fill();
  txt(`National: ${ordinal(np)} percentile`, LEG_CX - 206, LEG_Y, F(21, 600), "#e2e8f0", "left");

  ctx.beginPath();
  ctx.arc(LEG_CX + 20, LEG_Y - 8, 7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(148,163,184,0.5)";
  ctx.fill();
  txt(`${stateName}: ${ordinal(sp)} percentile`, LEG_CX + 34, LEG_Y, F(21, 600), "#94a3b8", "left");

  // ── Salary chip ───────────────────────────────────────────────────────────
  const salLabel = `Your salary: ${fmtSalary(salary)}`;
  ctx.font = F(19, 600);
  const slw = ctx.measureText(salLabel).width;
  const SCX = W / 2 - slw / 2 - 16;
  const SCY = LEG_Y + 24;
  pill(SCX, SCY, slw + 32, 36, 18, "rgba(255,255,255,0.05)", "rgba(255,255,255,0.09)");
  txt(salLabel, W / 2, SCY + 18, F(19, 600), "#cbd5e1", "center", "middle");

  // ── Footer ────────────────────────────────────────────────────────────────
  ctx.font = F(16);
  ctx.fillStyle = "rgba(51,65,85,0.85)";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("salarypercentile.app", BX, H - 22);
  ctx.textAlign = "right";
  ctx.fillText("Data: BLS Occupational Employment & Wage Statistics (OES) 2024", BX + BW, H - 22);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function shareOrDownload(blob: Blob, data: ShareCardData) {
  const file = new File([blob], "my-salary-percentile.png", { type: "image/png" });
  const shareText = `I earn more than ${data.nationalPercentile}% of ${data.categoryLabel} workers in ${data.stateName}. Find out yours 👇`;

  if (
    typeof navigator !== "undefined" &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: "My Salary Percentile", text: shareText });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "cancelled";
    }
  }
  downloadBlob(blob, "my-salary-percentile.png");
  return "downloaded";
}

type Status = "idle" | "generating" | "done" | "error";

export default function ShareButton({ data }: { data: ShareCardData }) {
  const [status, setStatus] = useState<Status>("idle");
  const [lastAction, setLastAction] = useState<"share" | "download" | null>(null);

  async function handleAction(mode: "share" | "download") {
    setStatus("generating");
    setLastAction(mode);
    try {
      const blob = await generateCard(data);
      if (mode === "download") {
        downloadBlob(blob, "my-salary-percentile.png");
      } else {
        await shareOrDownload(blob, data);
      }
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const isLoading = status === "generating";

  return (
    <div
      className="glass rounded-2xl p-6 sm:p-8"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-1 tracking-wide">Share Your Result</h2>
      <p className="text-xs text-slate-500 mb-5">
        Generate a 1200×630 image card — ready for LinkedIn, Twitter, and Reddit.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Share button */}
        <button
          onClick={() => handleAction("share")}
          disabled={isLoading}
          className="btn-gradient flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading && lastAction === "share" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Generating…
            </>
          ) : status === "done" && lastAction === "share" ? (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Shared!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share Result
            </>
          )}
        </button>

        {/* Download button */}
        <button
          onClick={() => handleAction("download")}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#cbd5e1",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          {isLoading && lastAction === "download" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Generating…
            </>
          ) : status === "done" && lastAction === "download" ? (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Downloaded!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PNG
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 text-xs text-red-400 text-center">
          Something went wrong generating the card. Please try again.
        </p>
      )}

      <p className="mt-4 text-xs text-slate-600 text-center">
        Saves as a 1200×630 PNG — ready for Twitter, LinkedIn, and Instagram Stories.
      </p>
    </div>
  );
}
