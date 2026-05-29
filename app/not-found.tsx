import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import OccupationSearch from "@/components/OccupationSearch";

export const metadata: Metadata = {
  title: "Page Not Found — RankMySalary",
  description: "The page you're looking for doesn't exist. Find salary percentile data for any US occupation.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col p-6 items-center justify-center min-h-[70vh] px-6 text-center">

      <Logo size="lg" className="mb-10" />

      {/* 404 number */}
      <p
        className="font-black leading-none tracking-tight gradient-text select-none"
        style={{ fontSize: "clamp(80px, 16vw, 140px)" }}
        aria-hidden="true"
      >
        404
      </p>

      <h1 className="text-2xl font-bold text-white mt-4 mb-3">
        Page Not Found
      </h1>
      <p className="text-slate-400 text-base max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Use the
        calculator to look up salary data for any occupation and state.
      </p>

      {/* Primary CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        <Link
          href="/#calculator"
          className="btn-gradient px-7 py-3 rounded-xl font-semibold text-sm text-white"
        >
          Go to Salary Calculator
        </Link>
        <Link
          href="/salary/software-developers-engineers"
          className="px-7 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:text-white transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Browse Salary Data
        </Link>
      </div>

      {/* Popular pages */}
      <div
        className="glass rounded-2xl px-8 py-6 max-w-lg w-full"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
          Popular Salary Pages
        </p>
        <ul className="space-y-2.5 text-left">
          {[
            { href: "/salary/software-developers-engineers", label: "Software Developer & Engineer Salaries" },
            { href: "/salary/registered-nurses",             label: "Registered Nurse Salaries" },
            { href: "/salary/financial-analysts-advisors",   label: "Financial Analyst & Advisor Salaries" },
            { href: "/salary/top-executives-ceos",           label: "Top Executive & CEO Salaries" },
            { href: "/salary/it-technology-managers",        label: "IT & Technology Manager Salaries" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group"
              >
                <span className="text-slate-700 group-hover:text-blue-500 transition-colors">→</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <OccupationSearch />

    </div>
  );
}
