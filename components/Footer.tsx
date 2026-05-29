import Link from "next/link";
import Logo from "@/components/Logo";

const POPULAR_OCCUPATIONS = [
  { href: "/salary/software-developers-engineers", label: "Software Developers" },
  { href: "/salary/registered-nurses",             label: "Registered Nurses" },
  { href: "/salary/financial-analysts-advisors",   label: "Financial Analysts" },
];

const RESOURCES = [
  { href: "/",                               label: "Salary Calculator" },
  { href: "/am-i-underpaid",                 label: "Am I Underpaid?" },
  { href: "/salary-comparison-by-state",     label: "Salary by State" },
  { href: "/average-salary-by-occupation",   label: "Average Salary by Occupation" },
  { href: "/salary/is-100000-a-good-salary", label: "Is $100k a Good Salary?" },
  { href: "/#faq",                           label: "BLS Data Methodology" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-[1100px] mx-auto px-6 py-12">

        {/* ── 4-column grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-10">

          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Free salary percentile calculator powered by official US government wage data.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#06b6d4", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#06b6d4" }} />
              </span>
              <span className="text-xs text-slate-600">BLS OES May 2024 · 116 occupations</span>
            </div>
          </div>

          {/* Col 2 — Popular Occupations */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
              Popular Occupations
            </p>
            <ul className="space-y-2.5">
              {POPULAR_OCCUPATIONS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
              Resources
            </p>
            <ul className="space-y-2.5">
              {RESOURCES.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Data Source */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
              Data Source
            </p>
            <ul className="space-y-2.5">
              {[
                "Bureau of Labor Statistics",
                "OES May 2024 Release",
                "116 Occupations Covered",
                "All 50 US States + D.C.",
                "Employer-Reported Wages",
              ].map((item) => (
                <li key={item} className="text-sm text-slate-500">
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Copyright bar ───────────────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="pt-6 text-center">
          <p style={{ fontSize: "11px", lineHeight: "1.6" }} className="text-slate-700">
            &copy; 2026 RankMySalary. Built with official US government salary data. Not affiliated with the US Bureau of Labor Statistics.
          </p>
        </div>

      </div>
    </footer>
  );
}
