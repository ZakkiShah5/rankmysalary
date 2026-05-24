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

const SITE = "https://rankmysalary.com";

function utmUrl(source: string) {
  return `${SITE}/?utm_source=${source}&utm_medium=social&utm_campaign=result_share`;
}

function buildShareUrl(platform: "twitter" | "linkedin" | "reddit", data: ShareCardData) {
  const text = `I earn more than ${data.nationalPercentile}% of ${data.categoryLabel} workers in ${data.stateName}. Find out where you rank 👇`;
  const title = `My Salary Percentile — ${data.categoryLabel} in ${data.stateName}`;

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(utmUrl("twitter"))}`;
    case "linkedin":
      return (
        `https://www.linkedin.com/shareArticle?mini=true` +
        `&url=${encodeURIComponent(utmUrl("linkedin"))}` +
        `&title=${encodeURIComponent(title)}` +
        `&summary=${encodeURIComponent(text)}`
      );
    case "reddit":
      return (
        `https://reddit.com/submit` +
        `?url=${encodeURIComponent(utmUrl("reddit"))}` +
        `&title=${encodeURIComponent(title)}`
      );
  }
}

type DownloadStatus = "idle" | "generating" | "done" | "error";
type CopyStatus = "idle" | "copied";

export default function ShareButton({ data }: { data: ShareCardData }) {
  const [dlStatus, setDlStatus] = useState<DownloadStatus>("idle");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function handleDownload() {
    setDlStatus("generating");
    try {
      const blob = await generateCard(data);
      downloadBlob(blob, "my-salary-percentile.png");
      setDlStatus("done");
      setTimeout(() => setDlStatus("idle"), 2500);
    } catch {
      setDlStatus("error");
      setTimeout(() => setDlStatus("idle"), 2500);
    }
  }

  function handleSocialShare(platform: "twitter" | "linkedin" | "reddit") {
    const url = buildShareUrl(platform, data);
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function handleProductHuntCopy() {
    try {
      await navigator.clipboard.writeText(utmUrl("producthunt"));
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      // clipboard not available — silently ignore
    }
  }

  const isGenerating = dlStatus === "generating";

  return (
    <div
      className="glass rounded-2xl p-6 sm:p-8"
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      <h2 className="text-sm font-semibold text-slate-300 mb-1 tracking-wide">Share Your Result</h2>
      <p className="text-xs text-slate-500 mb-5">
        Download the result card, then share it on your platform of choice.
      </p>

      {/* Download card */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="btn-gradient w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Generating…
          </>
        ) : dlStatus === "done" ? (
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
            Download Result Card (PNG)
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Share on</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Platform buttons */}
      <div className="grid grid-cols-2 gap-2.5">

        {/* Twitter / X */}
        <button
          onClick={() => handleSocialShare("twitter")}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#e2e8f0" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
        >
          {/* X (Twitter) icon */}
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Post on X
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleSocialShare("linkedin")}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
          style={{ background: "rgba(10,102,194,0.15)", border: "1px solid rgba(10,102,194,0.35)", color: "#60a5fa" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,102,194,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,102,194,0.15)"; }}
        >
          {/* LinkedIn icon */}
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </button>

        {/* Reddit */}
        <button
          onClick={() => handleSocialShare("reddit")}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
          style={{ background: "rgba(255,69,0,0.12)", border: "1px solid rgba(255,69,0,0.3)", color: "#fb923c" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,69,0,0.22)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,69,0,0.12)"; }}
        >
          {/* Reddit icon */}
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
          </svg>
          Post on Reddit
        </button>

        {/* Product Hunt — copies UTM link */}
        <button
          onClick={handleProductHuntCopy}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer"
          style={{ background: "rgba(218,74,25,0.12)", border: "1px solid rgba(218,74,25,0.3)", color: "#fb923c" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(218,74,25,0.22)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(218,74,25,0.12)"; }}
        >
          {copyStatus === "copied" ? (
            <>
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Link Copied!
            </>
          ) : (
            <>
              {/* Product Hunt icon */}
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 000-3.6zM12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12zm1.604 14.4h-3.405V18H7.8V6h5.804a4.2 4.2 0 010 8.4z" />
              </svg>
              Copy PH Link
            </>
          )}
        </button>

      </div>

      {dlStatus === "error" && (
        <p className="mt-3 text-xs text-red-400 text-center">
          Something went wrong generating the card. Please try again.
        </p>
      )}

      <p className="mt-4 text-xs text-slate-600 text-center">
        Download the card first, then attach it when posting.
      </p>
    </div>
  );
}
