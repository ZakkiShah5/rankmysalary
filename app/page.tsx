import SalaryCalculator from "@/components/SalaryCalculator";
import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://rankmysalary.com";

export const metadata: Metadata = {
  title: "Salary Percentile Calculator — See Where You Rank by Job & State (2024 BLS Data)",
  description:
    "Free salary percentile calculator using official BLS OES 2024 data. Enter your salary, job, and state to instantly see your percentile nationally and in your state. Covers 116 occupations.",
  alternates: { canonical: SITE_URL },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "RankMySalary — Salary Percentile Calculator",
  "url": `${SITE_URL}`,
  "description":
    "Free salary percentile calculator using official BLS OES May 2024 data. Enter your salary, job, and state to instantly see your percentile nationally and in your state. Covers 116 occupations across all 50 states.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "RankMySalary", "url": `${SITE_URL}` },
  "featureList": [
    "Salary percentile calculation for 116 occupation categories",
    "National and state-level salary rankings",
    "BLS OES May 2024 official wage data",
    "All 50 US states and Washington D.C.",
    "Shareable salary result cards",
  ],
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Find Your Salary Percentile",
  "description":
    "Use the RankMySalary calculator to see where your salary ranks among US workers in your occupation and state, using official BLS OES 2024 data.",
  "totalTime": "PT1M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Enter your annual salary",
      "text":
        "Type your current gross annual salary (before taxes) into the salary field. Use your base annual wage, not including bonuses or equity.",
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Select your job category",
      "text":
        "Choose the occupation group that best matches your role from 116 BLS occupation categories. Use the search box to filter by keyword.",
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Select your state",
      "text":
        "Choose the US state where you work. State selection applies BLS regional wage indices to show how your salary ranks locally.",
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Click Calculate My Percentile",
      "text":
        "Press the Calculate button to instantly see your national and state percentile rank on a gauge, alongside full BLS salary benchmarks for your occupation.",
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Review and share your results",
      "text":
        "Your percentile is shown on a gauge with 10th–90th percentile benchmarks. Download your result card or share it on LinkedIn, X, or Reddit.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a salary percentile?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "A salary percentile tells you what percentage of workers in a given occupation earn less than you. For example, if you're at the 70th percentile, you earn more than 70% of workers in that field. It's a more useful benchmark than a simple average because it shows where you stand across the full distribution of wages.",
      },
    },
    {
      "@type": "Question",
      "name": "How is my salary percentile calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "We use linear interpolation between the BLS wage anchor points (10th, 25th, 50th, 75th, and 90th percentiles) to estimate your exact percentile rank. State figures are derived by applying BLS regional wage indices to the national data. For salaries below the 10th or above the 90th percentile, we flag this clearly rather than extrapolating an unreliable estimate.",
      },
    },
    {
      "@type": "Question",
      "name": "What data does this calculator use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "All data comes from the Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics (OES) program, May 2024 release. This is the most comprehensive, official source of US occupational wage data, covering over 800 occupations and nearly every industry. We cover 116 occupation groups across all 50 states and Washington D.C.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I use this to negotiate my salary?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "If you're below the median (50th percentile) for your occupation in your state, you have a data-backed argument for a raise. Come prepared with your percentile result and the BLS benchmark figures from the table below the gauge. Framing your ask around official government data — rather than salary sites — is often more persuasive to employers and hiring managers.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the median salary in the United States?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "According to BLS OES May 2024 data, the median annual wage across all occupations in the United States is approximately $49,500. However, this varies enormously by occupation — from around $30,000 for food preparation workers to over $236,000 for physicians and surgeons. That's why comparing within your specific occupation is far more meaningful than a national cross-occupation average.",
      },
    },
  ],
};

const insightsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Salary Insights",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Article",
        headline: "What Is a Good Salary in the United States in 2024?",
        url: `${SITE_URL}/salary-insights/what-is-a-good-salary`,
        description:
          "The national median salary is $49,500. Understand what percentile benchmarks mean for your pay and how location changes the picture.",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Article",
        headline: "How to Use Salary Percentile Data to Negotiate Your Pay",
        url: `${SITE_URL}/salary-insights/how-to-negotiate-salary`,
        description:
          "A practical guide to using BLS percentile data to make a compelling case for a raise or a better offer.",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Article",
        headline: "Highest Paying Occupations in America — BLS 2024 Data",
        url: `${SITE_URL}/salary-insights/highest-paying-occupations`,
        description:
          "The top 10 highest-paying occupations by median annual wage according to BLS OES May 2024 national data.",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Article",
        headline: "Why Government Salary Data Is More Reliable Than Crowdsourced Estimates",
        url: `${SITE_URL}/salary-insights/why-bls-data-is-reliable`,
        description:
          "BLS surveys 1.1 million employer establishments. Understand why that makes it more accurate than Glassdoor or PayScale.",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Article",
        headline: "Salary Differences by State — What the BLS Data Shows",
        url: `${SITE_URL}/salary-insights/salary-differences-by-state`,
        description:
          "California and Washington top the state wage rankings. See which states pay the most and least, and what that means for your career.",
      },
    },
  ],
};

// ── Card data for the Salary Insights grid ────────────────────────────────────
const INSIGHT_CARDS = [
  {
    id: "what-is-a-good-salary",
    tag: "SALARY GUIDE",
    title: "What Is a Good Salary in the United States in 2024?",
    excerpt:
      "The national median annual wage is $49,500, but whether that figure is 'good' depends entirely on your occupation, state, and cost of living. Salary percentiles give you a far more meaningful benchmark — see exactly where you rank in your specific field.",
  },
  {
    id: "how-to-negotiate-salary",
    tag: "NEGOTIATION",
    title: "How to Use Salary Percentile Data to Negotiate Your Pay",
    excerpt:
      "BLS data gives you an authoritative, hard-to-dispute benchmark for your next salary conversation — far stronger than crowdsourced sites like Glassdoor. If you're below the 50th percentile for your role, you have a concrete, data-backed case for a raise.",
  },
  {
    id: "highest-paying-occupations",
    tag: "SALARY DATA",
    title: "Highest Paying Occupations in America — BLS 2024 Data",
    excerpt:
      "Top executives earn a national median of $189,520, IT managers $169,510, and software developers $127,260 — the highest-paying roles all require advanced education or significant leverage over capital or teams. Technology, management, and healthcare dominate the top tier.",
  },
  {
    id: "why-bls-data-is-reliable",
    tag: "DATA QUALITY",
    title: "Why Government Salary Data Is More Reliable Than Crowdsourced Estimates",
    excerpt:
      "The BLS surveys 1.1 million employer establishments directly — not self-reported estimates — making it far more accurate than Glassdoor or PayScale. Selection bias systematically inflates crowdsourced figures, especially for tech workers in high-cost cities.",
  },
  {
    id: "salary-differences-by-state",
    tag: "BY STATE",
    title: "Salary Differences by State — What the BLS Data Shows",
    excerpt:
      "Workers in California and DC earn 26–38% above the national median, while Mississippi and West Virginia sit 15–20% below — a gap that compounds dramatically over a career. Remote work lets some workers capture the arbitrage between high-wage salaries and low-cost locations.",
  },
] as const;

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsJsonLd) }} />
      <div id="calculator">
        <SalaryCalculator />
      </div>

      {/* ── Salary Insights Card Grid ──────────────────────────────────────────── */}
      <section
        id="salary-insights"
        aria-labelledby="insights-heading"
        className="max-w-[1100px] mx-auto px-4 md:px-6 pt-10 pb-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Section header */}
        <div className="mb-10">
          <h2
            id="insights-heading"
            className="text-3xl font-bold text-white mb-2"
          >
            Salary Insights
          </h2>
          <p className="text-sm text-slate-400">
            Research-backed guides powered by official BLS 2024 data
          </p>
        </div>

        {/* Card grid — 2 col desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INSIGHT_CARDS.map((card) => (
            <article
              key={card.id}
              className="flex flex-col gap-4 rounded-xl p-6 border transition-all duration-200 hover:border-blue-500/30 hover:shadow-[0_0_24px_rgba(59,130,246,0.07)]"
              style={{
                background: "#1e293b",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#06b6d4" }}
              >
                {card.tag}
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                {card.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                {card.excerpt}
              </p>
              <Link
                href={`/salary-insights/${card.id}`}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "#3b82f6" }}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}
