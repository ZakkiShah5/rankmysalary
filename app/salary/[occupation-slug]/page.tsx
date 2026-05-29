import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  OCCUPATION_BY_SLUG,
  STATE_BY_SLUG,
  SLUG_BY_STATE,
  ALIAS_TO_CANONICAL,
} from "@/lib/slugs";
import {
  getOccupationData,
  US_STATES,
  JOB_CATEGORIES,
  estimatePercentile,
  getStateOverallMedian,
} from "@/lib/blsData";
import { fmt, pct } from "@/lib/format";
import SalaryCalculator from "@/components/SalaryCalculator";
import FAQAccordion from "@/components/FAQAccordion";

export const dynamicParams = false;

// ── Salary-check pages ────────────────────────────────────────────────────────
const SALARY_CHECK_AMOUNTS = [
  40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 150000, 200000,
];
const SALARY_CHECK_RE = /^is-(\d+)-a-good-salary$/;

// BLS OES May 2024 all-worker annual wage percentile anchors
const OVERALL_PERCENTILES = {
  p10: 31200, p25: 40560, p50: 49500, p75: 74880, p90: 113880, mean: 61900,
};

function estimateNationalPercentile(salary: number): number {
  return estimatePercentile(salary, OVERALL_PERCENTILES);
}

function ordinalLocal(n: number): string {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

// ── Occupation page content helpers ───────────────────────────────────────────
const NATIONAL_MEDIAN_ALL = OVERALL_PERCENTILES.p50; // 49,500

function vsAllWorkersLabel(occMedian: number): string {
  const ratio = occMedian / NATIONAL_MEDIAN_ALL;
  if (ratio >= 1.30) return "significantly above";
  if (ratio >= 1.05) return "above";
  if (ratio >= 0.95) return "near";
  if (ratio >= 0.70) return "below";
  return "significantly below";
}

function generateOccupationIntro(
  occLabel: string,
  national: { p10: number; p25: number; p50: number; p75: number; p90: number; mean: number },
  workerPercentile: number,
): string {
  const { p10, p25, p50: median, p75, p90, mean } = national;
  const pctVsAll = Math.round(Math.abs((median - NATIONAL_MEDIAN_ALL) / NATIONAL_MEDIAN_ALL) * 100);
  const dir = median >= NATIONAL_MEDIAN_ALL ? "above" : "below";
  const meanIsAbove = mean > median;
  const meanPct = Math.round(Math.abs((mean - median) / median) * 100);

  if (workerPercentile >= 75) {
    return [
      `${occLabel} ranks among the higher-paying occupations in the United States, with a national median annual salary of ${fmt(median)} — ${pctVsAll}% ${dir} the all-occupation median of ${fmt(NATIONAL_MEDIAN_ALL)}.`,
      `Professionals in this field sit at the ${ordinalLocal(workerPercentile)} percentile of all US workers, outearning the vast majority of the American workforce.`,
      `Entry-level positions typically start around ${fmt(p10)} per year, while experienced workers in the top 10% earn over ${fmt(p90)} annually.`,
      `The middle 50% of ${occLabel} earn between ${fmt(p25)} and ${fmt(p75)} — a range that reflects income growth with experience and specialization.`,
      `The mean salary of ${fmt(mean)} is ${meanPct}% ${meanIsAbove ? "above" : "below"} the median, ${meanIsAbove ? "driven upward by high earners at the top of the pay scale" : "suggesting a compressed wage distribution at the top end"}.`,
    ].join(" ");
  }

  if (workerPercentile >= 45) {
    return [
      `${occLabel} salaries align broadly with the national workforce average, with a median annual wage of ${fmt(median)} placing this occupation at the ${ordinalLocal(workerPercentile)} percentile of all US workers.`,
      `This puts ${occLabel} within ${pctVsAll}% of the all-occupation national median of ${fmt(NATIONAL_MEDIAN_ALL)}.`,
      `Earnings span from ${fmt(p10)} at the entry level to ${fmt(p90)} for top earners — a ${fmt(p90 - p10)} spread that reflects the impact of experience, specialization, and geography.`,
      `Workers between the 25th and 75th percentile earn ${fmt(p25)} to ${fmt(p75)} annually.`,
      `The mean wage of ${fmt(mean)} is ${meanPct}% ${meanIsAbove ? "above" : "below"} the median, ${meanIsAbove ? "indicating a right-skewed distribution where high earners pull the average upward" : "suggesting wages are relatively evenly distributed across experience levels"}.`,
    ].join(" ");
  }

  return [
    `${occLabel} salaries are ${vsAllWorkersLabel(median)} the national median for all US workers.`,
    `At a median annual wage of ${fmt(median)}, professionals in this field rank at the ${ordinalLocal(workerPercentile)} percentile nationally — ${pctVsAll}% ${dir} the all-occupation median of ${fmt(NATIONAL_MEDIAN_ALL)}.`,
    `Salaries span from ${fmt(p10)} at the 10th percentile to ${fmt(p90)} for the top 10% of earners, with the middle half earning ${fmt(p25)} to ${fmt(p75)}.`,
    `Entry-level positions start near ${fmt(p10)}, with meaningful income growth available with experience.`,
    `The mean salary of ${fmt(mean)} ${meanIsAbove ? `is ${meanPct}% above the median, reflecting high earners at the top of the distribution` : `closely tracks the median, indicating a relatively even wage spread`}.`,
  ].join(" ");
}

export function generateStaticParams() {
  const occSlugs = Object.keys(OCCUPATION_BY_SLUG).map((slug) => ({
    "occupation-slug": slug,
  }));
  const salarySlugs = SALARY_CHECK_AMOUNTS.map((amount) => ({
    "occupation-slug": `is-${amount}-a-good-salary`,
  }));
  return [...occSlugs, ...salarySlugs];
}

type Props = { params: Promise<{ "occupation-slug": string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "occupation-slug": slug } = await params;

  const salaryMatch = SALARY_CHECK_RE.exec(slug);
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1], 10);
    const percentile = estimateNationalPercentile(amount);
    const fmtAmount = fmt(amount);
    return {
      title: `Is ${fmtAmount} a Good Salary in 2024? — RankMySalary`,
      description: `${fmtAmount} puts you at the ${ordinalLocal(percentile)} percentile of all US workers. See occupation and state comparisons using BLS OES May 2024 data.`,
      alternates: { canonical: `https://rankmysalary.com/salary/${slug}` },
      openGraph: {
        title: `Is ${fmtAmount} a Good Salary? (${ordinalLocal(percentile)} Percentile)`,
        description: `BLS OES May 2024 — see percentile, occupation & state comparisons for ${fmtAmount}.`,
      },
    };
  }

  const occ = OCCUPATION_BY_SLUG[slug];
  if (!occ) return {};
  const { national } = getOccupationData(occ.key, "CA");
  const canonicalSlug = ALIAS_TO_CANONICAL[slug] ?? slug;
  return {
    title: `${occ.label} Salary Percentiles — National & State Data (2024 BLS)`,
    description: `See where your ${occ.label} salary ranks nationally and in your state. Based on official BLS OES 2024 data. Median salary: ${fmt(national.p50)}. Free percentile calculator.`,
    alternates: { canonical: `https://rankmysalary.com/salary/${canonicalSlug}` },
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

// ── Salary-check page content ─────────────────────────────────────────────────
function SalaryCheckContent({ amount, slug }: { amount: number; slug: string }) {
  const percentile = estimateNationalPercentile(amount);
  const fmtAmount = fmt(amount);
  const nationalMedian = 49500;
  const aboveNationalMedian = amount >= nationalMedian;
  const vsMedianPct = Math.round(Math.abs((amount - nationalMedian) / nationalMedian) * 100);

  // Occupation comparison
  const occData = JOB_CATEGORIES.map((c) => {
    const { national } = getOccupationData(c.value, "CA");
    return { label: c.label, median: national.p50, isAbove: amount >= national.p50 };
  }).sort((a, b) => b.median - a.median);
  const occAboveCount = occData.filter((o) => o.isAbove).length;

  // State comparison
  const stateData = Object.entries(US_STATES).map(([code, name]) => {
    const stateMedian = getStateOverallMedian(code);
    return { code, name, stateMedian, isAbove: amount >= stateMedian };
  }).sort((a, b) => b.stateMedian - a.stateMedian);
  const statesAboveCount = stateData.filter((s) => s.isAbove).length;

  // Article copy helpers
  const closestAbove = occData.filter((o) => o.isAbove).sort((a, b) => b.median - a.median).slice(0, 3);
  const closestBelow = occData.filter((o) => !o.isAbove).sort((a, b) => a.median - b.median).slice(0, 3);
  const rankPhrase =
    percentile >= 90 ? "top 10% of" :
    percentile >= 75 ? "top quartile of" :
    percentile >= 50 ? "above the median for" :
    percentile >= 25 ? "below the median for" :
    "bottom quartile of";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Is ${fmtAmount} a Good Salary in 2024?`,
    description: `${fmtAmount} is at the ${ordinalLocal(percentile)} percentile of US workers nationally, based on BLS OES May 2024 data.`,
    url: `https://rankmysalary.com/salary/${slug}`,
    author: { "@type": "Organization", name: "RankMySalary" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rankmysalary.com/" },
      { "@type": "ListItem", position: 2, name: `Is ${fmtAmount} a Good Salary?`, item: `https://rankmysalary.com/salary/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-[1100px] mx-auto">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="relative px-6 pt-20 pb-10 text-center overflow-hidden">
          <div className="relative">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-slate-600 mb-4">
              <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-500">Is {fmtAmount} a Good Salary?</span>
            </nav>
            <h1 className="font-black tracking-tight text-white mb-3 leading-tight" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              Is {fmtAmount} a Good Salary in 2024?
            </h1>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              <strong className="text-white">{fmtAmount}</strong> places you at the{" "}
              <strong className="text-white">{ordinalLocal(percentile)} percentile</strong> of all US workers —{" "}
              <span style={{ color: aboveNationalMedian ? "#4ade80" : "#f87171" }}>
                {vsMedianPct}% {aboveNationalMedian ? "above" : "below"}
              </span>{" "}
              the national median of $49,500.
            </p>
          </div>
        </div>

        {/* ── Key stats strip ────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Percentile (All Workers)</span>
                <span className="text-2xl font-black text-white tabular-nums">{ordinalLocal(percentile)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">vs National Median</span>
                <span className="text-2xl font-black tabular-nums" style={{ color: aboveNationalMedian ? "#4ade80" : "#f87171" }}>
                  {aboveNationalMedian ? "+" : "-"}{vsMedianPct}%
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">States Above Median</span>
                <span className="text-2xl font-black text-white tabular-nums">{statesAboveCount}<span className="text-base font-semibold text-slate-500">/51</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Occupations Above Median</span>
                <span className="text-2xl font-black text-white tabular-nums">{occAboveCount}<span className="text-base font-semibold text-slate-500">/116</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Article ───────────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <article className="glass rounded-2xl p-7">
            <h2 className="text-xl font-bold text-white mb-4 leading-snug">
              Is {fmtAmount} a Good Salary? What BLS Data Shows
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                A salary of <strong className="text-slate-200">{fmtAmount}</strong> puts you in the{" "}
                <strong className="text-slate-200">{rankPhrase}</strong> all US workers, ranking at the{" "}
                <strong className="text-slate-200">{ordinalLocal(percentile)} percentile</strong> nationally according
                to Bureau of Labor Statistics Occupational Employment and Wage Statistics (OES) May 2024 data.
                The national median annual wage across all occupations is{" "}
                <strong className="text-slate-200">$49,500</strong>, so {fmtAmount} is{" "}
                <strong style={{ color: aboveNationalMedian ? "#4ade80" : "#f87171" }}>
                  {vsMedianPct}% {aboveNationalMedian ? "above" : "below"}
                </strong>{" "}
                that benchmark. {aboveNationalMedian
                  ? `You out-earn roughly ${percentile}% of American workers across all occupations.`
                  : `Roughly ${100 - percentile}% of American workers across all occupations earn more.`
                }
              </p>
              <p>
                Geography reshapes what {fmtAmount} means in practice.{" "}
                {fmtAmount} exceeds the overall state median wage in{" "}
                <strong className="text-slate-200">{statesAboveCount} of 51 US states and jurisdictions</strong>.
                In lower-wage states like Mississippi (state median ~{fmt(getStateOverallMedian("MS"))}),
                Arkansas (~{fmt(getStateOverallMedian("AR"))}), and West Virginia (~{fmt(getStateOverallMedian("WV"))}),
                {fmtAmount} represents a strong above-average income. However, in high-wage states
                like California (~{fmt(getStateOverallMedian("CA"))}), Massachusetts (~{fmt(getStateOverallMedian("MA"))}),
                and Washington (~{fmt(getStateOverallMedian("WA"))}), the state median is{" "}
                {amount >= getStateOverallMedian("CA") ? "still below" : "above"} {fmtAmount}.
              </p>
              <p>
                Occupation matters as much as geography. {fmtAmount} is{" "}
                <strong className="text-slate-200">above the national median</strong> for{" "}
                <strong className="text-slate-200">{occAboveCount} of 116</strong> occupation categories tracked by BLS.
                {closestAbove.length > 0 && (
                  <> This includes occupations like{" "}
                    {closestAbove.map((o, i) => (
                      <span key={o.label}>
                        <strong className="text-slate-200">{o.label}</strong> (median {fmt(o.median)})
                        {i < closestAbove.length - 1 ? ", " : ""}
                      </span>
                    ))}.
                  </>
                )}
                {closestBelow.length > 0 && (
                  <> For higher-paying roles like{" "}
                    {closestBelow.map((o, i) => (
                      <span key={o.label}>
                        <strong className="text-slate-200">{o.label}</strong> (median {fmt(o.median)})
                        {i < closestBelow.length - 1 ? ", " : ""}
                      </span>
                    ))}, {fmtAmount} falls below the typical midpoint.
                  </>
                )}
              </p>
              <p>
                Whether {fmtAmount} is a good salary ultimately depends on your specific occupation,
                state, experience level, and household cost of living. A{" "}
                <strong className="text-slate-200">percentile within your field</strong> is far more
                meaningful than a cross-occupation average. Use the calculator below to enter your job
                category and state and see exactly where you rank among peers in the same occupation.
              </p>
            </div>
          </article>
        </div>

        {/* ── Calculator ────────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.45)" }}>
            <h2 className="text-sm font-semibold text-slate-300 mb-1 tracking-wide">
              See Your Exact Percentile by Occupation &amp; State
            </h2>
            <p className="text-xs text-slate-600 mb-5">Pre-filled with {fmtAmount} — select your job and state to rank yourself</p>
            <SalaryCalculator initialSalary={amount} />
          </div>
        </div>

        {/* ── Occupation comparison ─────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-1 tracking-wide">
              Is {fmtAmount} Above or Below Median by Occupation?
            </h2>
            <p className="text-xs text-slate-600 mb-5">
              {fmtAmount} is above the national median for {occAboveCount} of 116 BLS occupation groups.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">Occupation</th>
                    <th className="py-2 pr-4 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">Median Salary</th>
                    <th className="py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">Your Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {occData.map((o) => (
                    <tr key={o.label} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 pr-4 text-sm text-slate-300">{o.label}</td>
                      <td className="py-2 pr-4 text-right text-sm font-semibold text-white tabular-nums">{fmt(o.median)}</td>
                      <td className="py-2 text-right">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            background: o.isAbove ? "rgba(74,222,128,0.14)" : "rgba(248,113,113,0.14)",
                            color: o.isAbove ? "#4ade80" : "#f87171",
                          }}
                        >
                          {o.isAbove ? "↑ above" : "↓ below"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── State comparison ──────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-16">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-1 tracking-wide">
              Is {fmtAmount} Above or Below the State Median?
            </h2>
            <p className="text-xs text-slate-600 mb-5">
              Comparing {fmtAmount} to each state&apos;s overall median wage (BLS OES 2024, all occupations).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-2 pr-4 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600">State</th>
                    <th className="py-2 pr-4 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">State Median</th>
                    <th className="py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-600">Your Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {stateData.map((s) => (
                    <tr key={s.code} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 pr-4 text-sm text-slate-300">{s.name}</td>
                      <td className="py-2 pr-4 text-right text-sm font-semibold text-white tabular-nums">{fmt(s.stateMedian)}</td>
                      <td className="py-2 text-right">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            background: s.isAbove ? "rgba(74,222,128,0.14)" : "rgba(248,113,113,0.14)",
                            color: s.isAbove ? "#4ade80" : "#f87171",
                          }}
                        >
                          {s.isAbove ? "↑ above" : "↓ below"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default async function OccupationPage({ params }: Props) {
  const { "occupation-slug": slug } = await params;

  const salaryMatch = SALARY_CHECK_RE.exec(slug);
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1], 10);
    if (!SALARY_CHECK_AMOUNTS.includes(amount)) notFound();
    return <SalaryCheckContent amount={amount} slug={slug} />;
  }

  const occ = OCCUPATION_BY_SLUG[slug];
  if (!occ) notFound();

  const { national } = getOccupationData(occ.key, "CA");
  const workerPercentile = estimatePercentile(national.p50, OVERALL_PERCENTILES);

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
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rankmysalary.com/" },
      { "@type": "ListItem", position: 2, name: `${occ.label} Salaries`, item: `https://rankmysalary.com/salary/${slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the average salary for ${occ.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `According to BLS OES May 2024 data, the median annual wage for ${occ.label} in the United States is ${fmt(national.p50)}. The mean (average) salary is ${fmt(national.mean)}, which is ${national.mean > national.p50 ? "higher" : "lower"} than the median.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${occ.label} a well-paying career?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `At a median of ${fmt(national.p50)}, ${occ.label} pays ${national.p50 >= NATIONAL_MEDIAN_ALL ? "above" : "below"} the national median of ${fmt(NATIONAL_MEDIAN_ALL)} for all occupations. Workers in this field rank at the ${ordinalLocal(workerPercentile)} percentile of all US workers.`,
        },
      },
      {
        "@type": "Question",
        name: `What state pays ${occ.label} the most?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${top5[0]?.name ?? "Data unavailable"} offers the highest salaries for ${occ.label}, with a median of ${fmt(top5[0]?.median ?? 0)} — ${top5[0]?.vs ?? ""} above the national median of ${fmt(national.p50)}.`,
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
              {generateOccupationIntro(occ.label, national, workerPercentile)}
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

        {/* ── Key Insights ───────────────────────────────────────────────────── */}
        <div className="mx-4 md:mx-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">
              Key Salary Insights — {occ.label}
            </h2>
            <ul className="space-y-3">
              {[
                `Median salary of ${fmt(national.p50)} — ${Math.round(Math.abs((national.p50 - NATIONAL_MEDIAN_ALL) / NATIONAL_MEDIAN_ALL) * 100)}% ${national.p50 >= NATIONAL_MEDIAN_ALL ? "above" : "below"} the national median of ${fmt(NATIONAL_MEDIAN_ALL)} across all occupations`,
                `Salary range spans ${fmt(national.p10)} to ${fmt(national.p90)} — a ${fmt(national.p90 - national.p10)} difference between entry-level and top earners`,
                `Workers at the 75th percentile earn ${fmt(national.p75)} or more annually`,
              ].map((insight) => (
                <li key={insight} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
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
            <p className="mt-5 pt-4 border-t border-white/[0.06] text-xs text-slate-500 leading-relaxed">
              Top paying states for {occ.label} include {top5[0].name} ({fmt(top5[0].median)}),{" "}
              {top5[1].name} ({fmt(top5[1].median)}), and {top5[2].name} ({fmt(top5[2].median)}) — all
              significantly above the national median of {fmt(national.p50)} for this occupation.
              {" "}{top5[3].name} ({fmt(top5[3].median)}) and {top5[4].name} ({fmt(top5[4].median)}) round
              out the five highest-paying states.
            </p>
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
              q: `What is the average salary for ${occ.label}?`,
              a: `According to BLS OES May 2024 data, the median annual wage for ${occ.label} in the United States is ${fmt(national.p50)}. The mean (average) salary is ${fmt(national.mean)}, which is ${national.mean > national.p50 ? "higher" : "lower"} than the median — ${national.mean > national.p50 ? "high earners at the top of the distribution pull the average upward" : "reflecting a relatively compressed wage distribution at the upper end"}. Half of all ${occ.label} earn more than ${fmt(national.p50)} and half earn less.`,
            },
            {
              q: `Is ${occ.label} a well-paying career?`,
              a: `At a median of ${fmt(national.p50)}, ${occ.label} pays ${national.p50 >= NATIONAL_MEDIAN_ALL ? "above" : "below"} the national median of ${fmt(NATIONAL_MEDIAN_ALL)} for all occupations. Workers in this field rank at the ${ordinalLocal(workerPercentile)} percentile of all US workers nationally, meaning ${workerPercentile}% of all employed Americans earn less. ${national.p50 >= NATIONAL_MEDIAN_ALL ? `The top 10% of ${occ.label} earn over ${fmt(national.p90)}, making this a strong career choice for those who reach senior levels.` : `With experience and specialization, top earners in this field can reach ${fmt(national.p75)} to ${fmt(national.p90)} annually.`}`,
            },
            {
              q: `What state pays ${occ.label} the most?`,
              a: `${top5[0]?.name ?? "Data unavailable"} offers the highest salaries for ${occ.label}, with a median of ${fmt(top5[0]?.median ?? 0)} — ${top5[0]?.vs ?? ""} compared to the national median of ${fmt(national.p50)} for this occupation. ${top5[1]?.name} (${fmt(top5[1]?.median ?? 0)}) and ${top5[2]?.name} (${fmt(top5[2]?.median ?? 0)}) also rank among the top-paying states. Geographic variation in ${occ.label} salaries reflects regional differences in industry concentration, cost of living, and local labor market competition.`,
            },
          ]} />
        </div>

      </div>
    </>
  );
}
