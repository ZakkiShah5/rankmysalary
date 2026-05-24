import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  OCCUPATION_BY_SLUG,
  STATE_BY_SLUG,
  SLUG_BY_STATE,
} from "@/lib/slugs";
import { getOccupationData, US_STATES } from "@/lib/blsData";
import { fmt, pct } from "@/lib/format";
import SalaryCalculator from "@/components/SalaryCalculator";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(OCCUPATION_BY_SLUG).map((slug) => ({
    "occupation-slug": slug,
  }));
}

type Props = { params: Promise<{ "occupation-slug": string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "occupation-slug": slug } = await params;
  const occ = OCCUPATION_BY_SLUG[slug];
  if (!occ) return {};
  const { national } = getOccupationData(occ.key, "CA");
  return {
    title: `${occ.label} Salary Percentiles — National Data (2024)`,
    description: `The median ${occ.label} salary is ${fmt(national.p50)} nationally. See full percentile breakdown and compare salaries across all 50 US states — BLS OES 2024 data.`,
    alternates: { canonical: `https://salary-percentile.vercel.app/salary/${slug}` },
    openGraph: {
      title: `${occ.label} Salary Percentiles (2024)`,
      description: `Median: ${fmt(national.p50)} · Top 10%: ${fmt(national.p90)} · BLS OES 2024`,
    },
  };
}

// ── Static benchmark table ─────────────────────────────────────────────────────
function BenchmarkRow({ label, value, salary }: { label: string; value: number; salary?: number }) {
  const isAbove = salary !== undefined && salary >= value;
  return (
    <tr className="border-b border-white/[0.05] last:border-0">
      <td className="py-3 pr-4 text-sm text-slate-400">{label}</td>
      <td className="py-3 text-sm font-semibold text-slate-200 tabular-nums">{fmt(value)}</td>
      {salary !== undefined && (
        <td className="py-3 pl-4 text-right">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              background: isAbove ? "rgba(74,222,128,0.14)" : "rgba(248,113,113,0.14)",
              color: isAbove ? "#4ade80" : "#f87171",
            }}
          >
            {isAbove ? "↑ above" : "↓ below"}
          </span>
        </td>
      )}
    </tr>
  );
}

export default async function OccupationPage({ params }: Props) {
  const { "occupation-slug": slug } = await params;
  const occ = OCCUPATION_BY_SLUG[slug];
  if (!occ) notFound();

  const { national } = getOccupationData(occ.key, "CA");

  // State comparison data, sorted by state median salary (desc)
  const stateRows = Object.entries(US_STATES)
    .map(([code, name]) => {
      const { state } = getOccupationData(occ.key, code);
      return {
        code,
        name,
        slug: SLUG_BY_STATE[code] ?? "",
        median: state.p50,
        vs: pct(state.p50, national.p50),
        isAbove: state.p50 >= national.p50,
      };
    })
    .sort((a, b) => b.median - a.median);

  const top5 = stateRows.slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://salary-percentile.vercel.app/" },
      { "@type": "ListItem", position: 2, name: `${occ.label} Salaries`, item: `https://salary-percentile.vercel.app/salary/${slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the median salary for ${occ.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The median salary for ${occ.label} in the United States is ${fmt(national.p50)} per year, according to BLS OES May 2024 data.`,
        },
      },
      {
        "@type": "Question",
        name: `What do the top 10% of ${occ.label} earn?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The top 10% of ${occ.label} in the US earn more than ${fmt(national.p90)} annually. The mean (average) salary is ${fmt(national.mean)}.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-[1100px] mx-auto">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="relative px-6 pt-20 pb-10 text-center overflow-hidden">
          <div className="relative">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-slate-600 mb-4">
              <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-500">{occ.label} Salaries</span>
            </nav>

            <h1 className="font-black tracking-tight text-white mb-3 leading-tight" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              {occ.label} Salary Percentiles
              <span className="block text-slate-400 font-semibold mt-1" style={{ fontSize: "clamp(15px, 2vw, 20px)" }}>
                National Data — BLS OES 2024
              </span>
            </h1>

            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              The median salary for <strong className="text-slate-200">{occ.label}</strong> in the United States
              is <strong className="text-white">{fmt(national.p50)}</strong>.
              The top 10% earn more than <strong className="text-white">{fmt(national.p90)}</strong> annually.
              Use the calculator below to see your personal percentile rank.
            </p>
          </div>
        </div>

        {/* ── Key stats strip ────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {[
                { label: "10th Pct", value: national.p10 },
                { label: "25th Pct", value: national.p25 },
                { label: "Median",   value: national.p50 },
                { label: "Mean",     value: national.mean },
                { label: "75th Pct", value: national.p75 },
                { label: "90th Pct", value: national.p90 },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
                  <span className="text-base font-bold text-white tabular-nums">{fmt(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Interactive calculator ─────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}>
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              Calculate Your Percentile — {occ.label}
            </h2>
            <SalaryCalculator initialCategory={occ.key} />
          </div>
        </div>

        {/* ── National benchmark detail ──────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              {occ.label} — National Salary Benchmarks (2024)
            </h2>
            <table className="w-full">
              <tbody>
                <BenchmarkRow label="10th percentile" value={national.p10} />
                <BenchmarkRow label="25th percentile" value={national.p25} />
                <BenchmarkRow label="Median (50th percentile)" value={national.p50} />
                <BenchmarkRow label="Mean (average)" value={national.mean} />
                <BenchmarkRow label="75th percentile" value={national.p75} />
                <BenchmarkRow label="90th percentile" value={national.p90} />
              </tbody>
            </table>
            <p className="mt-4 text-xs text-slate-600">
              Source: Bureau of Labor Statistics Occupational Employment and Wage Statistics (OES), May 2024.
            </p>
          </div>
        </div>

        {/* ── Top 5 highest-paying states ─────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              Top 5 Highest-Paying States for {occ.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {top5.map((s, i) => (
                <Link
                  key={s.code}
                  href={`/salary/${slug}/${s.slug}`}
                  className="flex flex-col gap-1.5 p-4 rounded-xl transition-all duration-200 group"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">#{i + 1}</span>
                    <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">{s.name}</span>
                  <span className="text-base font-bold tabular-nums" style={{ color: "#4ade80" }}>{fmt(s.median)}</span>
                  <span className="text-[10px] font-semibold text-green-500">{s.vs} vs national</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Salary by state table ─────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              {occ.label} Salary by State (2024)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">State</th>
                    <th className="py-2 pr-4 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">Median Salary</th>
                    <th className="py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">vs National</th>
                  </tr>
                </thead>
                <tbody>
                  {stateRows.map((s) => (
                    <tr key={s.code} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                      <td className="py-2.5 pr-4">
                        <Link
                          href={`/salary/${slug}/${s.slug}`}
                          className="text-sm text-slate-300 hover:text-blue-400 transition-colors font-medium"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-4 text-right text-sm font-semibold text-white tabular-nums">{fmt(s.median)}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className="text-xs font-semibold tabular-nums"
                          style={{ color: s.isAbove ? "#4ade80" : "#f87171" }}
                        >
                          {s.vs}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Occupation-specific FAQ ───────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-16">
          <h2 className="text-xl font-bold text-slate-200 mb-6">{occ.label} Salary — FAQ</h2>
          <FAQAccordion items={[
            {
              q: `What is the median salary for ${occ.label}?`,
              a: `According to BLS OES May 2024 data, the median annual salary for ${occ.label} in the United States is ${fmt(national.p50)}. Half of all ${occ.label} earn more than this, and half earn less.`,
            },
            {
              q: `What do the top 10% of ${occ.label} earn?`,
              a: `The top 10% of ${occ.label} in the US earn more than ${fmt(national.p90)} per year. The mean (average) salary is ${fmt(national.mean)}, which is ${national.mean > national.p50 ? "above" : "below"} the median because higher earners pull the average up.`,
            },
            {
              q: `What state pays ${occ.label} the most?`,
              a: `${top5[0]?.name ?? "Data unavailable"} pays ${occ.label} the most, with a median salary of ${fmt(top5[0]?.median ?? 0)} — ${top5[0]?.vs ?? ""} compared to the national median of ${fmt(national.p50)}.`,
            },
            {
              q: `Is ${fmt(national.p50)} a good salary for ${occ.label}?`,
              a: `${fmt(national.p50)} is the median salary for ${occ.label}, meaning it puts you exactly at the 50th percentile — right in the middle of all earners in this occupation. Whether it's "good" depends on your location, experience, and industry. Use the calculator above to see where you rank.`,
            },
            {
              q: `How much do entry-level ${occ.label} make?`,
              a: `Entry-level ${occ.label} typically earn around the 10th–25th percentile range. According to BLS data, that's approximately ${fmt(national.p10)} to ${fmt(national.p25)} per year nationally. Salaries vary significantly by state and employer.`,
            },
          ]} />
        </div>

      </div>
    </>
  );
}
