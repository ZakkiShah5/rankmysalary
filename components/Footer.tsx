import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Col 1 — Brand */}
          <div>
            <Logo className="mb-3" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Free salary percentile calculator powered by official US government wage data.
            </p>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">Explore</p>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Salary Calculator
                </Link>
              </li>
              <li>
                <Link href="/salary/software-developers-engineers" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Software Developer Salaries
                </Link>
              </li>
              <li>
                <Link href="/salary/registered-nurses" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Registered Nurse Salaries
                </Link>
              </li>
              <li>
                <Link href="/salary/financial-analysts-advisors" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Financial Analyst Salaries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Data source */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">Data Source</p>
            <p className="text-sm text-slate-500 leading-relaxed">
              All wage data comes from the{" "}
              <span className="text-slate-400 font-medium">Bureau of Labor Statistics</span>{" "}
              Occupational Employment and Wage Statistics (OES) program, May 2024 release.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="relative flex h-2 w-2 shrink-0"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#06b6d4", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#06b6d4" }} />
              </span>
              <span className="text-xs text-slate-600">BLS OES May 2024 · 116 occupations</span>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} className="pt-6 text-center">
          <p style={{ fontSize: "11px", lineHeight: "1.6" }} className="text-slate-700">
            &copy; 2026 RankMySalary. Built with official US government salary data. Not affiliated with the US Bureau of Labor Statistics.
          </p>
        </div>
      </div>
    </footer>
  );
}
