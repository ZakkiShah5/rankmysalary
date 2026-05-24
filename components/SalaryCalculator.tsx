"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  JOB_CATEGORIES,
  JOB_CATEGORY_GROUPS,
  US_STATES,
  getOccupationData,
  estimatePercentile,
  type PercentileData,
} from "@/lib/blsData";
import { SLUG_BY_KEY, SLUG_BY_STATE } from "@/lib/slugs";
import SearchableSelect from "@/components/SearchableSelect";
import GaugeArc from "@/components/GaugeArc";
import ShareButton from "@/components/ShareButton";
import FAQAccordion from "@/components/FAQAccordion";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Results {
  nationalPercentile: number;
  statePercentile: number;
  national: PercentileData;
  state: PercentileData;
  salary: number;
  stateName: string;
  categoryLabel: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function ordinal(n: number) {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

function accentFor(pct: number) {
  if (pct >= 75) return {
    hi: "#10b981", lo: "#064e3b",
    glow: "rgba(16,185,129,0.25)", ring: "rgba(16,185,129,0.12)",
    badge: "rgba(16,185,129,0.15)", badgeText: "#10b981",
  };
  if (pct >= 25) return {
    hi: "#3b82f6", lo: "#1e3a5f",
    glow: "rgba(59,130,246,0.25)", ring: "rgba(59,130,246,0.12)",
    badge: "rgba(59,130,246,0.15)", badgeText: "#60a5fa",
  };
  if (pct >= 10) return {
    hi: "#f59e0b", lo: "#78350f",
    glow: "rgba(245,158,11,0.25)", ring: "rgba(245,158,11,0.12)",
    badge: "rgba(245,158,11,0.15)", badgeText: "#f59e0b",
  };
  return {
    hi: "#ef4444", lo: "#7f1d1d",
    glow: "rgba(239,68,68,0.25)", ring: "rgba(239,68,68,0.12)",
    badge: "rgba(239,68,68,0.15)", badgeText: "#ef4444",
  };
}

// ── Animated counter ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let start: number | null = null;
    const run = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return val;
}

// ── Benchmark bars ─────────────────────────────────────────────────────────────
function BenchmarkBars({
  data,
  salary,
  label,
}: {
  data: PercentileData;
  salary: number;
  label: string;
}) {
  const maxVal = Math.max(data.p90, salary) * 1.12;
  const userPct = Math.min((salary / maxVal) * 100, 99);

  const rows: { name: string; value: number }[] = [
    { name: "10th pct",  value: data.p10  },
    { name: "25th pct",  value: data.p25  },
    { name: "Median",    value: data.p50  },
    { name: "Mean",      value: data.mean },
    { name: "75th pct",  value: data.p75  },
    { name: "90th pct",  value: data.p90  },
  ];

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-5">{label}</p>
      <div className="space-y-4">
        {rows.map((row) => {
          const barPct = (row.value / maxVal) * 100;
          const isAbove = salary >= row.value;
          return (
            <div key={row.name} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs text-slate-500 text-right tabular-nums">{row.name}</span>
              <div className="flex-1 relative h-3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${barPct}%`,
                    background: "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #06b6d4 100%)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.4)",
                    transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[3px] h-[22px] rounded-full"
                  style={{
                    left: `${userPct}%`,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.35)",
                  }}
                />
              </div>
              <div className="w-24 shrink-0 flex items-center justify-end gap-1.5">
                <span className="text-xs font-semibold text-slate-300 tabular-nums">{fmt(row.value)}</span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    background: isAbove ? "rgba(16,185,129,0.14)" : "rgba(239,68,68,0.14)",
                    color:      isAbove ? "#10b981"               : "#ef4444",
                  }}
                >
                  {isAbove ? "↑" : "↓"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2 ml-[5.75rem] mr-[7.5rem]">
        <div
          className="absolute -translate-x-1/2 text-[10px] text-white/40 font-medium whitespace-nowrap pt-1"
          style={{ left: `${userPct}%` }}
        >
          ▲ You ({fmt(salary)})
        </div>
      </div>
    </div>
  );
}

// ── Stat cards ─────────────────────────────────────────────────────────────────
function StatCard({ percentile, label }: { percentile: number; label: string }) {
  const a = accentFor(percentile);
  return (
    <div
      className="flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl"
      style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-3xl font-black tabular-nums" style={{ color: a.hi, textShadow: `0 0 24px ${a.glow}` }}>
        {ordinal(percentile)}
      </span>
      <span
        className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
        style={{ background: a.badge, color: a.badgeText }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Field label ────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
      {children}
    </label>
  );
}

// ── FAQ data ───────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "What is a salary percentile?",
    a: "A salary percentile tells you what percentage of workers in a given occupation earn less than you. For example, if you're at the 70th percentile, you earn more than 70% of workers in that field. It's a more useful benchmark than a simple average because it shows where you stand across the full distribution of wages.",
  },
  {
    q: "How is my salary percentile calculated?",
    a: "We use linear interpolation between the BLS wage anchor points (10th, 25th, 50th, 75th, and 90th percentiles) to estimate your exact percentile rank. State figures are derived by applying BLS regional wage indices to the national data. For salaries below the 10th or above the 90th percentile, we flag this clearly rather than extrapolating an unreliable estimate.",
  },
  {
    q: "What data does this calculator use?",
    a: "All data comes from the Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OES) program, May 2024 release. This is the most comprehensive, official source of US occupational wage data, covering over 800 occupations and nearly every industry. We cover 116 occupation groups across all 50 states and Washington D.C.",
  },
  {
    q: "How do I use this to negotiate my salary?",
    a: "If you're below the median (50th percentile) for your occupation in your state, you have a data-backed argument for a raise. Come prepared with your percentile result and the BLS benchmark figures from the table below the gauge. Framing your ask around official government data — rather than salary sites — is often more persuasive to employers and hiring managers.",
  },
  {
    q: "What is the median salary in the United States?",
    a: "According to BLS OES May 2024 data, the median annual wage across all occupations in the United States is approximately $49,500. However, this varies enormously by occupation — from around $30,000 for food preparation workers to over $236,000 for physicians and surgeons. That's why comparing within your specific occupation is far more meaningful than a national cross-occupation average.",
  },
] as const;

// ── Main component ────────────────────────────────────────────────────────────
interface SalaryCalculatorProps {
  initialCategory?: string;
  initialState?: string;
  initialSalary?: number;
}

export default function SalaryCalculator({
  initialCategory = "",
  initialState = "",
  initialSalary,
}: SalaryCalculatorProps = {}) {
  const [salary, setSalary]       = useState(initialSalary ? String(initialSalary) : "");
  const [state, setState]         = useState(initialState);
  const [category, setCategory]   = useState(initialCategory);
  const [results, setResults]     = useState<Results | null>(null);
  const [error, setError]         = useState("");
  const [benchTab, setBenchTab]   = useState<"national" | "state">("national");
  const resultsRef                = useRef<HTMLDivElement>(null);

  // Top 4 highest-paying states for the current occupation (excluding selected state)
  const relatedStates = useMemo(() => {
    if (!results) return [];
    const occSlug = SLUG_BY_KEY[category] ?? "";
    if (!occSlug) return [];
    return (Object.keys(US_STATES) as string[])
      .map((code) => ({
        code,
        name: US_STATES[code] ?? code,
        median: getOccupationData(category, code).state.p50,
        slug: SLUG_BY_STATE[code] ?? "",
        occSlug,
      }))
      .filter((s) => s.code !== state && s.slug)
      .sort((a, b) => b.median - a.median)
      .slice(0, 4);
  }, [results, category, state]);

  const isReadyToCalculate = !!salary && !!state && !!category && !results;

  const displaySalary = salary
    ? new Intl.NumberFormat("en-US").format(parseInt(salary, 10) || 0)
    : "";

  function handleSalaryInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSalary(e.target.value.replace(/[^0-9]/g, ""));
    setError("");
  }

  const calculate = useCallback(() => {
    const sal = parseInt(salary, 10);
    if (!salary || isNaN(sal) || sal <= 0) { setError("Enter a valid annual salary."); return; }
    if (!state)    { setError("Select your state."); return; }
    if (!category) { setError("Select your job category."); return; }

    const { national, state: stateData } = getOccupationData(category, state);
    const nationalPercentile = estimatePercentile(sal, national);
    const statePercentile    = estimatePercentile(sal, stateData);
    const categoryLabel      = JOB_CATEGORIES.find((c) => c.value === category)?.label ?? category;

    setResults({
      nationalPercentile, statePercentile,
      national, state: stateData,
      salary: sal,
      stateName: US_STATES[state] ?? state,
      categoryLabel,
    });
    setError("");

    setTimeout(() => {
      if (window.innerWidth < 768 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  }, [salary, state, category]);

  const displayPct  = useCountUp(results?.nationalPercentile ?? 0);
  const accent      = accentFor(results?.nationalPercentile ?? 0);
  const isBelowP10  = results !== null && results.salary < results.national.p10;

  // ── Input form ─────────────────────────────────────────────────────────────
  const inputForm = (
    <div className="space-y-5">
      <div>
        <Label>Annual Salary</Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold pointer-events-none select-none">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={displaySalary}
            onChange={handleSalaryInput}
            onKeyDown={(e) => e.key === "Enter" && calculate()}
            placeholder="85,000"
            className="input-glass w-full pl-8 pr-4 py-3.5 rounded-xl text-lg font-semibold text-white"
          />
        </div>
      </div>

      <div>
        <Label>Job Category</Label>
        <SearchableSelect
          groups={JOB_CATEGORY_GROUPS}
          value={category}
          onChange={(v) => { setCategory(v); setError(""); }}
          placeholder="Search 116 occupations…"
          hasError={!!error && !category}
        />
      </div>

      <div>
        <Label>State</Label>
        <div className="relative">
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setError(""); }}
            className="input-glass w-full px-4 py-3.5 rounded-xl text-sm font-medium appearance-none cursor-pointer pr-10"
          >
            <option value="" style={{ background: "#0f172a" }}>Select your state…</option>
            {Object.entries(US_STATES).map(([code, name]) => (
              <option key={code} value={code} style={{ background: "#0f172a" }}>{name}</option>
            ))}
          </select>
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#ef4444" }}>{error}</p>
      )}

      <button
        onClick={calculate}
        className="btn-gradient w-full md:max-w-[400px] md:mx-auto py-4 rounded-xl text-base cursor-pointer block"
      >
        Calculate My Percentile →
      </button>
    </div>
  );

  // ── Results hero ───────────────────────────────────────────────────────────
  const resultsHero = results && (
    <div ref={resultsRef} className="glass rounded-2xl p-6 text-center anim-fade-up" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
      <h2 className="sr-only">Your Salary Ranking</h2>

      <div className="relative w-full max-w-[17rem] mx-auto -mb-2">
        <GaugeArc
          percentile={results.nationalPercentile}
          color={accent.hi}
          colorDim={accent.lo}
        />
      </div>

      {isBelowP10 ? (
        <div
          className="mb-4 px-4 py-3.5 rounded-xl text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.28)", color: "#fca5a5" }}
        >
          <div className="flex items-center justify-center gap-2 font-semibold mb-1" style={{ color: "#ef4444" }}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Below 10th Percentile
          </div>
          Your salary of {fmt(results.salary)} is below the 10th percentile for{" "}
          <span className="font-semibold text-white">{results.categoryLabel}</span> workers.
          <div className="mt-1.5 text-xs" style={{ color: "#94a3b8" }}>
            The 10th percentile earns {fmt(results.national.p10)} nationally.
          </div>
        </div>
      ) : (
        <>
          <div className="mb-0.5">
            <span
              className="font-black tabular-nums leading-none text-white"
              style={{ fontSize: "72px", textShadow: `0 0 48px ${accent.glow}` }}
            >
              {displayPct}
            </span>
            <span className="font-black text-white align-super" style={{ fontSize: "36px" }}>
              {ordinal(displayPct).replace(String(displayPct), "")}
            </span>
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Percentile Rank
          </p>

          <p className="text-white text-base font-semibold mb-0.5">
            You earn more than{" "}
            <span style={{ color: accent.hi }}>{results.nationalPercentile}%</span>
          </p>
          <p className="text-slate-400 text-sm mb-6">
            of{" "}
            <span className="text-slate-200 font-medium">{results.categoryLabel}</span>{" "}
            workers in the US
          </p>
        </>
      )}

      <div className="flex gap-3">
        <StatCard percentile={results.nationalPercentile} label="Nationally" />
        <StatCard percentile={results.statePercentile}    label={results.stateName} />
      </div>

      <div
        className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
      >
        <span className="text-slate-500 text-xs">Your salary</span>
        <span className="text-slate-200 font-semibold">{fmt(results.salary)}</span>
      </div>

      {/* Share / Download — inside the results card */}
      <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <ShareButton
          data={{
            nationalPercentile: results.nationalPercentile,
            statePercentile:    results.statePercentile,
            salary:             results.salary,
            stateName:          results.stateName,
            categoryLabel:      results.categoryLabel,
          }}
        />
      </div>
    </div>
  );

  // ── Empty state — right column before calculate ────────────────────────────
  const emptyState = (
    <div
      className="hidden md:flex glass rounded-2xl p-6 items-center justify-center transition-all duration-500"
      style={{
        minHeight: "420px",
        boxShadow: isReadyToCalculate ? "0 0 0 2px rgba(59,130,246,0.4), 0 8px 40px rgba(59,130,246,0.12)" : "none",
        borderColor: isReadyToCalculate ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)",
      }}
    >
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500"
          style={{
            background: isReadyToCalculate ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)",
            border: isReadyToCalculate ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(59,130,246,0.18)",
          }}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="rgba(59,130,246,0.7)" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          {isReadyToCalculate ? "Ready — click Calculate" : "Your results will appear here"}
        </p>
        <p className="text-slate-600 text-xs mt-1">
          {isReadyToCalculate ? "All fields complete" : "Fill in the form and click Calculate"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto">

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <div className="relative text-center px-6 pt-20 pb-12 overflow-hidden">
        <div className="relative">
          {/* BLS badge */}
          <div
            className="inline-flex items-center gap-2 text-[11px] font-semibold px-3.5 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.28)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#06b6d4" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#06b6d4" }} />
            </span>
            BLS OES 2024 · 116 Occupations
          </div>

          {/* Title */}
          <h1 className="font-black tracking-tight text-white mb-3 leading-tight" style={{ fontSize: "clamp(36px, 6vw, 56px)" }}>
            Salary <span className="gradient-text">Percentile</span> Calculator
          </h1>

          <p className="text-slate-400 text-[15px] max-w-xl mx-auto leading-relaxed mb-2">
            See exactly where your salary ranks among{" "}
            <span className="text-slate-200 font-medium">US workers</span> in your field and state.
          </p>

          <p className="text-slate-600 text-[13px] max-w-md mx-auto">
            Based on official BLS data for 116 occupations across all 50 US states.
          </p>
        </div>
      </div>

      {/* ── Main content panel ───────────────────────────────────────────────── */}
      <div className="mx-4 md:mx-6 mb-8">
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left: Input card */}
            <div
              className="glass rounded-2xl p-7 anim-fade-up"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}
            >
              <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
                Enter Your Details
              </h2>
              {inputForm}
            </div>

            {/* Right: Results or empty state */}
            <div>
              {results ? resultsHero : emptyState}
            </div>
          </div>

          {/* Full-width below both columns */}
          {results && (
            <div className="mt-8 space-y-6">

              {/* Benchmark bars */}
              <div
                className="glass rounded-2xl p-7 anim-fade-up delay-1"
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}
              >
                <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
                  Salary Benchmarks
                </h2>
                <div
                  className="inline-flex p-1 rounded-xl mb-6"
                  style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {(["national", "state"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBenchTab(tab)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer capitalize"
                      style={
                        benchTab === tab
                          ? { background: "rgba(59,130,246,0.22)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.35)" }
                          : { color: "#475569", border: "1px solid transparent" }
                      }
                    >
                      {tab === "national" ? "National" : results.stateName}
                    </button>
                  ))}
                </div>

                <BenchmarkBars
                  data={benchTab === "national" ? results.national : results.state}
                  salary={results.salary}
                  label={
                    benchTab === "national"
                      ? `US benchmarks — ${results.categoryLabel}`
                      : `${results.stateName} benchmarks — ${results.categoryLabel}`
                  }
                />
              </div>

              {/* Related: See salaries in other states */}
              {relatedStates.length > 0 && (
                <div className="glass rounded-2xl p-6 anim-fade-up delay-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                    Related
                  </p>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">
                    See {results.categoryLabel} Salaries in Other States
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {relatedStates.map((s) => (
                      <Link
                        key={s.code}
                        href={`/salary/${s.occSlug}/${s.slug}`}
                        className="flex flex-col gap-1 p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.04] group"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <span className="text-xs text-slate-400 font-medium group-hover:text-blue-400 transition-colors">{s.name}</span>
                        <span className="text-sm font-bold text-white tabular-nums">{fmt(s.median)}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Link
                      href={`/salary/${SLUG_BY_KEY[category] ?? ""}`}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View all states for {results.categoryLabel} →
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-slate-700 pb-2 anim-fade-up delay-2">
                Data: Bureau of Labor Statistics OES May 2024 · State figures use BLS regional wage indices
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── FAQ section ─────────────────────────────────────────────────────── */}
      <section aria-label="Frequently Asked Questions" className="mx-4 md:mx-6 mb-16 mt-2">
        <h2 className="text-xl font-bold text-slate-200 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <FAQAccordion items={FAQ_ITEMS} />
      </section>

    </div>
  );
}
