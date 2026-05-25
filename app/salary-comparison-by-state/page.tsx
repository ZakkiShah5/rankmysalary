import type { Metadata } from "next";
import Link from "next/link";
import { US_STATES, getStateOverallMedian } from "@/lib/blsData";
import { SLUG_BY_STATE } from "@/lib/slugs";
import { fmt, pct } from "@/lib/format";
import SalaryCalculator from "@/components/SalaryCalculator";

const SITE_URL = "https://rankmysalary.com";
const NATIONAL_MEDIAN = 49500;

export const metadata: Metadata = {
  title: "Salary Comparison by State — 2024 BLS Data | RankMySalary",
  description:
    "Compare median salaries across all 50 US states and Washington D.C. using official BLS OES May 2024 data. See which states pay the most and least across all occupations.",
  alternates: { canonical: `${SITE_URL}/salary-comparison-by-state` },
  openGraph: {
    title: "Salary Comparison by State — 2024 BLS Data",
    description:
      "D.C. leads at $68,310, Mississippi trails at $40,095. See full state salary rankings from BLS OES 2024.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "US Median Salary by State — BLS OES May 2024",
  description:
    "Median annual wages for all workers across all 50 US states and Washington D.C., derived from Bureau of Labor Statistics OES May 2024 data.",
  url: `${SITE_URL}/salary-comparison-by-state`,
  creator: { "@type": "Organization", name: "RankMySalary" },
  isBasedOn: "https://www.bls.gov/oes/",
};

export default function SalaryComparisonByState() {
  const rows = Object.entries(US_STATES)
    .map(([code, name]) => ({
      code,
      name,
      median: getStateOverallMedian(code),
      slug: SLUG_BY_STATE[code] ?? "",
    }))
    .sort((a, b) => b.median - a.median);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-14 pb-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-600 mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-slate-500">Salary by State</span>
        </nav>

        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#06b6d4" }}
        >
          BY STATE
        </span>

        <h1 className="text-4xl font-black text-white mt-2 mb-4 leading-tight">
          Salary Comparison by State — 2024 BLS Data
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-8">
          How does your state stack up? Official BLS OES May 2024 median wages across all 50 states
          and D.C. — ranked highest to lowest.
        </p>

        <article className="max-w-2xl space-y-4 text-sm text-slate-400 leading-relaxed mb-10">
          <p>
            State wages vary dramatically across the United States — from $40,095 in Mississippi to
            $68,310 in Washington D.C., a gap of more than 70%. These differences reflect industry
            concentration, labor market competition, and regional cost pressures. High-wage states like
            Washington and Massachusetts lead in technology and financial services; lower-wage states
            skew toward agriculture, retail, and hospitality.
          </p>
          <p>
            The table below shows the overall median annual wage for all workers in each state,
            derived from BLS OES May 2024 regional wage indices applied to the national all-occupation
            median of $49,500. These figures represent the midpoint of the full wage distribution —
            half of all workers in that state earn more, half earn less. For occupation-specific state
            comparisons, use the salary calculator below to see your exact percentile in any state.
          </p>
          <p>
            Cost of living complicates the picture. A $60,000 salary in Mississippi has substantially
            more purchasing power than the same amount in California. Remote workers can sometimes
            capture the arbitrage — earning wages benchmarked to a high-cost state while living
            somewhere more affordable. The BLS data gives you the wage side of that equation; pair it
            with regional cost-of-living indices for a complete picture.
          </p>
        </article>

        {/* State table */}
        <div
          className="rounded-xl overflow-hidden mb-16"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(15,23,42,0.9)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-12">
                  Rank
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  State
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Median Wage
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">
                  vs National
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const delta = ((row.median - NATIONAL_MEDIAN) / NATIONAL_MEDIAN) * 100;
                const isAbove = delta >= 0;
                return (
                  <tr
                    key={row.code}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background:
                        i % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent",
                    }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-600 tabular-nums text-xs">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-slate-200">{row.name}</td>
                    <td className="px-5 py-3 text-right text-slate-300 font-semibold tabular-nums">
                      {fmt(row.median)}
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          background: isAbove
                            ? "rgba(16,185,129,0.14)"
                            : "rgba(239,68,68,0.14)",
                          color: isAbove ? "#10b981" : "#ef4444",
                        }}
                      >
                        {isAbove ? "+" : ""}
                        {delta.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-600 mb-16 -mt-12">
          Source: BLS OES May 2024. State figures derived by applying BLS regional wage indices to
          the national all-occupation median of $49,500.
        </p>
      </div>

      <SalaryCalculator />
    </>
  );
}
