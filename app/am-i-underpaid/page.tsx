import type { Metadata } from "next";
import Link from "next/link";
import SalaryCalculator from "@/components/SalaryCalculator";

const SITE_URL = "https://rankmysalary.com";

export const metadata: Metadata = {
  title: "Am I Underpaid? Check Your Salary Percentile | RankMySalary",
  description:
    "Find out if you're underpaid using official BLS OES May 2024 data. Enter your salary, job category, and state to see your percentile rank among US workers in your field.",
  alternates: { canonical: `${SITE_URL}/am-i-underpaid` },
  openGraph: {
    title: "Am I Underpaid? Check Your Salary Percentile",
    description:
      "Use official BLS data to find out where your salary ranks — nationally and in your state — for your specific occupation.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Am I Underpaid? How to Find Out Using Government Data",
  description:
    "How to use BLS OES salary percentile data to determine whether you are underpaid relative to your peers.",
  url: `${SITE_URL}/am-i-underpaid`,
  author: { "@type": "Organization", name: "RankMySalary" },
  publisher: { "@type": "Organization", name: "RankMySalary" },
};

export default function AmIUnderpaid() {
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
          <span className="text-slate-500">Am I Underpaid?</span>
        </nav>

        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#06b6d4" }}
        >
          SALARY GUIDE
        </span>

        <h1 className="text-4xl font-black text-white mt-2 mb-4 leading-tight">
          Am I Underpaid? How to Find Out Using Government Data
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-10">
          &ldquo;Underpaid&rdquo; isn&rsquo;t a feeling — it&rsquo;s a data question. Here&rsquo;s
          how to answer it with authority using official BLS wage statistics.
        </p>

        <article className="max-w-2xl space-y-6 text-sm text-slate-400 leading-relaxed mb-16">
          <p>
            Feeling underpaid is one of the most common workplace frustrations — but vague
            dissatisfaction rarely leads to better pay. What moves the needle is a specific,
            data-backed answer: relative to workers in the same occupation and state, where exactly
            does your salary fall? That&rsquo;s what salary percentiles tell you, and the Bureau of
            Labor Statistics provides the most reliable source for computing them.
          </p>

          <h2 className="text-xl font-bold text-white pt-2">Three Warning Signs You&rsquo;re Underpaid</h2>

          <p>
            <strong className="text-slate-200">Below the 25th percentile:</strong> You earn less than
            75% of workers in your occupation and state. This is a strong signal that your pay is below
            market — not just below average, but in the bottom quarter of the distribution. Unless
            you&rsquo;re early career in a high-growth role, this warrants a conversation.
          </p>

          <p>
            <strong className="text-slate-200">Below the 10th percentile:</strong> Fewer than 1 in 10
            workers in your field earn less than you. This is a clear underpayment signal. Employers
            rarely justify 10th-percentile wages with performance — it usually reflects a low-paying
            employer, a depressed local market, or an out-of-date compensation structure.
          </p>

          <p>
            <strong className="text-slate-200">Below your state median:</strong> Being below the 50th
            percentile in your specific field and state means half your professional peers out-earn you.
            It&rsquo;s a weaker signal than the 25th percentile, but important context when evaluating
            a raise request or a new offer.
          </p>

          <h2 className="text-xl font-bold text-white pt-2">How to Use the Calculator Below</h2>

          <p>
            Enter your annual base salary (before taxes, not including bonuses or equity), select your
            job category, and choose your state. The calculator will show your national and state
            percentile rank using BLS OES May 2024 data — the same dataset the federal government uses
            for labor market analysis. If your result is below the 25th percentile, you have a
            data-backed starting point for a salary negotiation.
          </p>

          <h2 className="text-xl font-bold text-white pt-2">What to Do If You Are Underpaid</h2>

          <p>
            Start by documenting your percentile and the BLS benchmark table (visible after you
            calculate). Then schedule a dedicated conversation with your manager — not during a busy
            sprint or review period — and frame it around market data rather than personal need.
            &ldquo;I&rsquo;ve researched BLS data and my salary is at the {"{"}Nth{"}"} percentile for
            {" "}[role] in [state]. I&rsquo;d like to discuss moving toward the [X]th percentile.&rdquo;
            That framing is harder to dismiss than &ldquo;I think I deserve a raise.&rdquo;
          </p>

          <p>
            If your employer can&rsquo;t close the gap, the BLS data also anchors your evaluation of
            competing offers. Knowing your current percentile makes it easy to judge whether an offer
            represents real upward movement or just lateral money in a different package. Track your
            percentile over time — it compounds. A 5-percentile improvement per year adds up
            significantly over a career.
          </p>
        </article>
      </div>

      <SalaryCalculator />
    </>
  );
}
