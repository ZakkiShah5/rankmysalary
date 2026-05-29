import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  OCCUPATION_BY_SLUG,
  STATE_BY_SLUG,
  SLUG_BY_STATE,
  SLUG_BY_KEY,
  ALIAS_TO_CANONICAL,
} from "@/lib/slugs";
import { getOccupationData, US_STATES, JOB_CATEGORIES } from "@/lib/blsData";
import { fmt, pct } from "@/lib/format";
import SalaryCalculator from "@/components/SalaryCalculator";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamicParams = false;

export function generateStaticParams() {
  // Bottom-up: return all valid occupation × state combinations so Next.js
  // builds every state page at deploy time without needing a parent layout.tsx.
  return Object.keys(OCCUPATION_BY_SLUG).flatMap((occSlug) =>
    Object.keys(STATE_BY_SLUG).map((stateSlug) => ({
      "occupation-slug": occSlug,
      "state-slug": stateSlug,
    }))
  );
}

type Props = {
  params: Promise<{ "occupation-slug": string; "state-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "occupation-slug": occSlug, "state-slug": stateSlug } = await params;
  const occ = OCCUPATION_BY_SLUG[occSlug];
  const st = STATE_BY_SLUG[stateSlug];
  if (!occ || !st) return {};

  const { national, state } = getOccupationData(occ.key, st.code);
  const diff = pct(state.p50, national.p50);
  const dir = state.p50 >= national.p50 ? "above" : "below";

  return {
    title: `${occ.label} Salary in ${st.name} — Percentile Rankings (2024)`,
    description: `The median ${occ.label} salary in ${st.name} is ${fmt(state.p50)}, ${diff} ${dir} the national median of ${fmt(national.p50)}. See the full percentile breakdown — BLS OES 2024 data.`,
    alternates: {
      canonical: `https://rankmysalary.com/salary/${ALIAS_TO_CANONICAL[occSlug] ?? occSlug}/${stateSlug}`,
    },
    openGraph: {
      title: `${occ.label} Salary in ${st.name} (2024)`,
      description: `Median: ${fmt(state.p50)} · ${diff} vs national · BLS OES 2024`,
    },
  };
}

// Generates a unique ~100-word intro paragraph from live BLS data.
// Template variant is deterministic — same occupation+state always gets the same structure.
function generateStateIntro(
  occLabel: string,
  stName: string,
  national: { p50: number; p90: number },
  state: { p10: number; p25: number; p50: number; p75: number; p90: number; mean: number },
  stateRank: number,
  totalStates: number,
): string {
  const absDiff = Math.round(Math.abs(((state.p50 - national.p50) / national.p50) * 100));
  const dir = state.p50 >= national.p50 ? "above" : "below";
  const diffPhrase =
    absDiff === 0
      ? `right at the national median of ${fmt(national.p50)}`
      : `${absDiff}% ${dir} the national median of ${fmt(national.p50)}`;
  const meanDir = state.mean >= state.p50 ? "above" : "below";

  function rankPhrase(): string {
    const q = Math.round(totalStates / 4);
    if (stateRank === 1) return "the single highest-paying state";
    if (stateRank <= 3) return "one of the three highest-paying states";
    if (stateRank <= q) return "in the top quartile of states";
    if (stateRank <= q * 2) return "above the national average";
    if (stateRank <= q * 3) return "below the national average";
    if (stateRank >= totalStates - 2) return "one of the lowest-paying states";
    return "in the bottom quartile of states";
  }

  // Hash of occupation + state names → deterministic variant 0–2
  const h =
    occLabel.length * 7 +
    stName.length * 13 +
    occLabel.charCodeAt(0) +
    stName.charCodeAt(0);
  const v = h % 3;

  if (v === 0) {
    return (
      `With a median annual salary of ${fmt(state.p50)}, ${occLabel} in ${stName} earn ` +
      `${diffPhrase}, ranking #${stateRank} out of ${totalStates} states for this occupation. ` +
      `This makes ${stName} ${rankPhrase()} in the US. The middle 50% of ${occLabel} in ` +
      `${stName} fall between ${fmt(state.p25)} and ${fmt(state.p75)} annually, while the ` +
      `top 10% take home more than ${fmt(state.p90)}. Entry-level positions typically start ` +
      `near ${fmt(state.p10)}. The mean wage of ${fmt(state.mean)} sits ${meanDir} the ` +
      `median, reflecting the shape of the wage distribution in this state. Use the ` +
      `calculator above to find your exact percentile within ${stName}'s distribution.`
    );
  }

  if (v === 1) {
    return (
      `${stName} ranks #${stateRank} out of ${totalStates} states for ${occLabel} salaries, ` +
      `making it ${rankPhrase()} for this occupation nationwide. The median salary of ` +
      `${fmt(state.p50)} is ${diffPhrase}. Salaries span a wide range: the 10th percentile ` +
      `starts at ${fmt(state.p10)}, the 75th percentile reaches ${fmt(state.p75)}, and the ` +
      `top 10% of earners clear ${fmt(state.p90)}. The state mean of ${fmt(state.mean)} ` +
      `sits ${meanDir} the median, reflecting the spread of high earners at the top of the ` +
      `distribution. Use the percentile calculator above to see exactly where your salary ` +
      `ranks among ${occLabel} in ${stName}.`
    );
  }

  // v === 2
  return (
    `In ${stName}, ${occLabel} earn a median salary of ${fmt(state.p50)} — ${diffPhrase}. ` +
    `${stName} ranks #${stateRank} among all ${totalStates} states for this occupation, ` +
    `putting it ${rankPhrase()}. Workers between the 25th and 75th percentile earn ` +
    `${fmt(state.p25)} to ${fmt(state.p75)} annually, while the top 10% in ${stName} earn ` +
    `more than ${fmt(state.p90)}, compared to the national 90th-percentile of ` +
    `${fmt(national.p90)}. Entry-level salaries near the 10th percentile start around ` +
    `${fmt(state.p10)}. Use the calculator above to benchmark your pay against ` +
    `${stName}'s complete wage distribution for this role.`
  );
}

function BenchmarkRow({ label, value }: { label: string; value: number }) {
  return (
    <tr className="border-b border-white/[0.05] last:border-0">
      <td className="py-3 pr-4 text-sm text-slate-400">{label}</td>
      <td className="py-3 text-sm font-semibold text-white tabular-nums">{fmt(value)}</td>
    </tr>
  );
}

export default async function StatePage({ params }: Props) {
  const { "occupation-slug": occSlug, "state-slug": stateSlug } = await params;
  const occ = OCCUPATION_BY_SLUG[occSlug];
  const st = STATE_BY_SLUG[stateSlug];
  if (!occ || !st) notFound();

  const { national, state } = getOccupationData(occ.key, st.code);

  const diffPct = pct(state.p50, national.p50);
  const diffSign = state.p50 >= national.p50 ? "above" : "below";
  const diffColor = state.p50 >= national.p50 ? "#4ade80" : "#f87171";

  // All states sorted for context — where does this state rank?
  const allStates = Object.entries(US_STATES)
    .map(([code, name]) => ({
      code,
      name,
      slug: SLUG_BY_STATE[code] ?? "",
      median: getOccupationData(occ.key, code).state.p50,
    }))
    .sort((a, b) => b.median - a.median);

  const stateRank = allStates.findIndex((s) => s.code === st.code) + 1;

  // 5 nearby states for "explore other states" links
  const rankIdx = stateRank - 1;
  const nearbyStates = allStates
    .slice(Math.max(0, rankIdx - 2), rankIdx + 3)
    .filter((s) => s.code !== st.code)
    .slice(0, 4);

  // Top 5 highest-paying occupations in this state (excluding current occupation)
  const topOccupations = JOB_CATEGORIES
    .map((c) => {
      const d = getOccupationData(c.value, st.code);
      return {
        key: c.value,
        label: c.label,
        slug: SLUG_BY_KEY[c.value] ?? "",
        stateMedian: d.state.p50,
        vsNational: pct(d.state.p50, d.national.p50),
        isAbove: d.state.p50 >= d.national.p50,
      };
    })
    .filter((o) => o.key !== occ.key && o.slug)
    .sort((a, b) => b.stateMedian - a.stateMedian)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rankmysalary.com/" },
      { "@type": "ListItem", position: 2, name: `${occ.label} Salaries`, item: `https://rankmysalary.com/salary/${occSlug}` },
      { "@type": "ListItem", position: 3, name: st.name, item: `https://rankmysalary.com/salary/${occSlug}/${stateSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-[1100px] mx-auto">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="relative px-6 pt-20 pb-10 text-center overflow-hidden">
          <div className="relative">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-slate-600 mb-4">
              <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/salary/${occSlug}`} className="hover:text-slate-400 transition-colors">
                {occ.label}
              </Link>
              <span>/</span>
              <span className="text-slate-500">{st.name}</span>
            </nav>

            <h1
              className="font-black tracking-tight text-white mb-3 leading-tight"
              style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
            >
              {occ.label} Salary in {st.name}
              <span className="block text-slate-400 font-semibold mt-1" style={{ fontSize: "clamp(14px, 2vw, 19px)" }}>
                Percentile Rankings — BLS OES 2024
              </span>
            </h1>

            {/* Comparison chip */}
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <span className="text-slate-400">{st.name} median:</span>
                <span className="text-white font-bold">{fmt(state.p50)}</span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: state.p50 >= national.p50 ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                  border: `1px solid ${diffColor}33`,
                  color: diffColor,
                }}
              >
                {diffPct} {diffSign} national median
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}
              >
                #{stateRank} of {allStates.length} states
              </div>
            </div>
          </div>
        </div>

        {/* ── Salary overview paragraph ─────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            {generateStateIntro(
              occ.label,
              st.name,
              national,
              state,
              stateRank,
              allStates.length,
            )}
          </p>
        </div>

        {/* ── Key stats strip ────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
              {st.name} — {occ.label} Salary Percentiles
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {[
                { label: "10th Pct", value: state.p10 },
                { label: "25th Pct", value: state.p25 },
                { label: "Median",   value: state.p50 },
                { label: "Mean",     value: state.mean },
                { label: "75th Pct", value: state.p75 },
                { label: "90th Pct", value: state.p90 },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</span>
                  <span className="text-base font-bold text-white tabular-nums">{fmt(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two-column: calculator + benchmark ──────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Calculator pre-filled with occupation + state */}
          <div className="glass rounded-2xl p-6" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}>
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              Your {occ.label} Salary in {st.name}
            </h2>
            <SalaryCalculator initialCategory={occ.key} initialState={st.code} />
          </div>

          {/* State benchmark detail */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
              {st.name} Salary Benchmarks
            </h2>
            <table className="w-full mb-5">
              <tbody>
                <BenchmarkRow label="10th percentile" value={state.p10} />
                <BenchmarkRow label="25th percentile" value={state.p25} />
                <BenchmarkRow label="Median (50th)" value={state.p50} />
                <BenchmarkRow label="Mean (average)" value={state.mean} />
                <BenchmarkRow label="75th percentile" value={state.p75} />
                <BenchmarkRow label="90th percentile" value={state.p90} />
              </tbody>
            </table>

            {/* National comparison */}
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">vs National</p>
              {[
                { label: "Median", state: state.p50, nat: national.p50 },
                { label: "Mean",   state: state.mean, nat: national.mean },
                { label: "Top 10%", state: state.p90, nat: national.p90 },
              ].map(({ label, state: sv, nat: nv }) => {
                const isAbove = sv >= nv;
                return (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-slate-500">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300 tabular-nums">{fmt(sv)}</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: isAbove ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                          color: isAbove ? "#4ade80" : "#f87171",
                        }}
                      >
                        {pct(sv, nv)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Explore nearby-ranked states ──────────────────────────────────── */}
        {nearbyStates.length > 0 && (
          <div className="mx-4 md:mx-6 mb-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
                Compare to Nearby-Ranked States
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {nearbyStates.map((s) => (
                  <Link
                    key={s.code}
                    href={`/salary/${occSlug}/${s.slug}`}
                    className="flex flex-col gap-1 p-4 rounded-xl transition-all duration-200 hover:bg-white/[0.04] group"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-xs text-slate-500 font-medium">{s.name}</span>
                    <span className="text-base font-bold text-white tabular-nums">{fmt(s.median)}</span>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: s.median >= national.p50 ? "#4ade80" : "#f87171" }}
                    >
                      {pct(s.median, national.p50)} vs national
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <Link
                  href={`/salary/${occSlug}`}
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  ← View all states for {occ.label}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Highest paying jobs in this state ────────────────────────── */}
        {topOccupations.length > 0 && (
          <div className="mx-4 md:mx-6 mb-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-300 mb-5 tracking-wide">
                Highest Paying Jobs in {st.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {topOccupations.map((o, i) => (
                  <Link
                    key={o.key}
                    href={`/salary/${o.slug}/${stateSlug}`}
                    className="flex flex-col gap-1.5 p-4 rounded-xl transition-all duration-200 group"
                    style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">#{i + 1}</span>
                      <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-white leading-tight">{o.label}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: "#4ade80" }}>{fmt(o.stateMedian)}</span>
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: o.isAbove ? "#10b981" : "#f87171" }}
                    >
                      {o.vsNational} vs national
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── State-specific FAQ ────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-16">
          <h2 className="text-xl font-bold text-slate-200 mb-6">
            {occ.label} Salary in {st.name} — FAQ
          </h2>
          <FAQAccordion items={[
            {
              q: `What is the average ${occ.label} salary in ${st.name}?`,
              a: `According to BLS OES May 2024 data, the median ${occ.label} salary in ${st.name} is ${fmt(state.p50)} per year. The mean (average) is ${fmt(state.mean)}, which is ${state.mean > state.p50 ? "higher" : "lower"} than the median due to the distribution of wages in this state.`,
            },
            {
              q: `How does ${st.name} compare to the national average for ${occ.label}?`,
              a: `${st.name} pays ${occ.label} ${diffPct} ${diffSign} the national median of ${fmt(national.p50)}. At ${fmt(state.p50)}, ${st.name} ranks #${stateRank} out of ${allStates.length} states for this occupation.`,
            },
            {
              q: `What is the highest salary a ${occ.label} can earn in ${st.name}?`,
              a: `The 90th percentile salary for ${occ.label} in ${st.name} is ${fmt(state.p90)} per year — meaning the top 10% of earners make more than this. Only a small fraction of ${occ.label} in ${st.name} exceed this figure.`,
            },
            {
              q: `What is an entry-level ${occ.label} salary in ${st.name}?`,
              a: `Entry-level ${occ.label} in ${st.name} typically earn in the 10th–25th percentile range: approximately ${fmt(state.p10)} to ${fmt(state.p25)} per year. Salaries grow significantly with experience and specialization.`,
            },
          ]} />
        </div>

      </div>
    </>
  );
}
