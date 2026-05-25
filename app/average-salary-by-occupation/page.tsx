import type { Metadata } from "next";
import Link from "next/link";
import { JOB_CATEGORIES, getOccupationData } from "@/lib/blsData";
import { SLUG_BY_KEY } from "@/lib/slugs";
import { fmt } from "@/lib/format";
import SalaryCalculator from "@/components/SalaryCalculator";

const SITE_URL = "https://rankmysalary.com";

export const metadata: Metadata = {
  title: "Average Salary by Occupation 2024 — All 116 Jobs Ranked | RankMySalary",
  description:
    "Full ranking of median salaries across 116 occupation categories using BLS OES May 2024 data. Physicians lead at $229,300; food servers trail at $32,000.",
  alternates: { canonical: `${SITE_URL}/average-salary-by-occupation` },
  openGraph: {
    title: "Average Salary by Occupation 2024 — 116 Jobs Ranked",
    description:
      "From physicians at $229,300 to food servers at $32,000 — full BLS OES 2024 median salary rankings for 116 occupation categories.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "US Median Salary by Occupation — BLS OES May 2024",
  description:
    "National median annual wages for 116 occupation categories, sourced from Bureau of Labor Statistics OES May 2024 national estimates.",
  url: `${SITE_URL}/average-salary-by-occupation`,
  creator: { "@type": "Organization", name: "RankMySalary" },
  isBasedOn: "https://www.bls.gov/oes/",
};

export default function AverageSalaryByOccupation() {
  const rows = JOB_CATEGORIES.map((cat) => {
    const { national } = getOccupationData(cat.value, "AL");
    return {
      key: cat.value,
      label: cat.label,
      slug: SLUG_BY_KEY[cat.value] ?? "",
      p10: national.p10,
      median: national.p50,
      p90: national.p90,
    };
  }).sort((a, b) => b.median - a.median);

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
          <span className="text-slate-500">Average Salary by Occupation</span>
        </nav>

        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#06b6d4" }}
        >
          SALARY DATA
        </span>

        <h1 className="text-4xl font-black text-white mt-2 mb-4 leading-tight">
          Average Salary by Occupation 2024
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-8">
          All 116 occupation categories ranked by national median salary — official BLS OES May 2024
          data. Click any occupation for a full state-by-state breakdown.
        </p>

        <article className="max-w-2xl space-y-4 text-sm text-slate-400 leading-relaxed mb-10">
          <p>
            The spread between the highest- and lowest-paying occupations in the United States is
            enormous. Physicians and surgeons earn a national median of $229,300 — more than seven
            times the $32,000 median for food servers and waitstaff. Three sectors dominate the top of
            the table: healthcare (physicians, dentists, pharmacists), management (executives, IT
            managers, financial managers), and technology (software developers, data scientists,
            cybersecurity).
          </p>
          <p>
            The 10th–90th percentile range shown below illustrates how wide wage distributions are
            within a single occupation category. Software developers span from $74,620 (10th
            percentile) to $208,000+ (90th percentile) — a nearly 3x range that reflects differences
            in specialization, employer size, and geography. Knowing your median isn&rsquo;t enough;
            knowing your percentile within that occupation tells you far more about your market
            position.
          </p>
          <p>
            All figures are national estimates from BLS OES May 2024. State-level wages differ
            significantly — California and Washington salaries can run 20–30% above national medians
            in technology roles, while Southern and Midwestern states often pay 10–20% below national
            for the same occupations. Click any occupation in the table to see the full state
            breakdown and calculate your exact percentile.
          </p>
        </article>

        {/* Occupation table */}
        <div
          className="rounded-xl overflow-hidden mb-4"
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
                  #
                </th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Occupation
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Median
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  10th Pct
                </th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">
                  90th Pct
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.key}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background:
                      i % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent",
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 text-slate-600 tabular-nums text-xs">{i + 1}</td>
                  <td className="px-5 py-3">
                    {row.slug ? (
                      <Link
                        href={`/salary/${row.slug}`}
                        className="text-slate-200 hover:text-blue-400 transition-colors font-medium"
                      >
                        {row.label}
                      </Link>
                    ) : (
                      <span className="text-slate-200 font-medium">{row.label}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-300 tabular-nums">
                    {fmt(row.median)}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-500 tabular-nums hidden md:table-cell">
                    {fmt(row.p10)}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-500 tabular-nums hidden md:table-cell">
                    {fmt(row.p90)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-600 mb-16">
          Source: BLS OES May 2024 national estimates. 116 occupation groups covering all major SOC
          categories. Click an occupation to see state breakdowns and calculate your personal
          percentile.
        </p>
      </div>

      <SalaryCalculator />
    </>
  );
}
