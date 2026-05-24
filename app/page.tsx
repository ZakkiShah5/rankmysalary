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
        url: `${SITE_URL}/#article-good-salary`,
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
        url: `${SITE_URL}/#article-negotiation`,
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
        url: `${SITE_URL}/#article-highest-paying`,
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
        url: `${SITE_URL}/#article-bls-vs-crowdsourced`,
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
        url: `${SITE_URL}/#article-salary-by-state`,
        description:
          "California and Washington top the state wage rankings. See which states pay the most and least, and what that means for your career.",
      },
    },
  ],
};

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

      {/* ── Salary Insights Blog Section ──────────────────────────────────────── */}
      <section
        id="salary-insights"
        aria-labelledby="insights-heading"
        className="max-w-[1100px] mx-auto px-4 md:px-6 pb-20"
      >
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
            Salary Insights
          </p>
          <h2
            id="insights-heading"
            className="text-2xl font-bold text-slate-100"
          >
            What the BLS Data Really Shows
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Research-backed salary guides powered by BLS OES May 2024 data.
          </p>
        </div>

        <div className="space-y-6">

          {/* ── Article 1 ───────────────────────────────────────────────────── */}
          <article
            id="article-good-salary"
            className="glass rounded-2xl p-7"
            aria-labelledby="article-1-title"
          >
            <h2
              id="article-1-title"
              className="text-xl font-bold text-white mb-4 leading-snug"
            >
              What Is a Good Salary in the United States in 2024?
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                The national median annual wage in the United States was{" "}
                <strong className="text-slate-200">$49,500</strong> according to
                BLS Occupational Employment and Wage Statistics (OES) May 2024
                data — meaning exactly half of all American workers earned above
                this figure and half earned below. But whether $49,500 is a
                "good salary" depends entirely on your occupation, your state,
                and your household's cost of living. A single benchmark number
                cannot answer that question on its own.
              </p>
              <p>
                Salary percentiles provide a far more useful framework.
                Earning at the{" "}
                <strong className="text-slate-200">75th percentile</strong> in
                your field means you out-earn 75% of workers in the same
                occupation — a genuinely strong position regardless of the raw
                number. For context,{" "}
                <Link
                  href="/salary/software-developers-engineers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  software developers and engineers
                </Link>{" "}
                at the national median earn{" "}
                <strong className="text-slate-200">$127,260</strong>, while{" "}
                <Link
                  href="/salary/registered-nurses"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  registered nurses
                </Link>{" "}
                at the median earn approximately{" "}
                <strong className="text-slate-200">$86,480</strong>. Both
                figures represent strong compensation — but the comparison is
                only meaningful within each occupation's national distribution.
              </p>
              <p>
                Geography reshapes the picture significantly. Workers in
                California earn wages roughly{" "}
                <strong className="text-slate-200">26% above</strong> the
                national median, while Mississippi workers earn about 19% below
                it. A $65,000 salary in Arkansas affords a very different
                lifestyle than the same figure in New York City. The true
                measure of a good salary in 2024 is not whether it clears some
                universal threshold — it's where you rank within your specific
                occupation and geographic market. Use the{" "}
                <a href="#calculator" className="text-blue-400 hover:text-blue-300 transition-colors">
                  RankMySalary calculator
                </a>{" "}
                above to find your exact percentile by job category and state.
              </p>
            </div>
          </article>

          {/* ── Article 2 ───────────────────────────────────────────────────── */}
          <article
            id="article-negotiation"
            className="glass rounded-2xl p-7"
            aria-labelledby="article-2-title"
          >
            <h2
              id="article-2-title"
              className="text-xl font-bold text-white mb-4 leading-snug"
            >
              How to Use Salary Percentile Data to Negotiate Your Pay
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                Salary negotiations that lean on concrete, third-party data win
                more often than those based on gut feel or anecdote. BLS
                Occupational Employment and Wage Statistics give you exactly the
                kind of authoritative benchmark that removes emotion from the
                conversation and puts the focus on market reality. Knowing your
                percentile before you walk into a negotiation is the single most
                powerful preparation you can do.
              </p>
              <p>
                Start by finding your current percentile using RankMySalary.
                Enter your salary, occupation, and state. If you're at the{" "}
                <strong className="text-slate-200">40th percentile</strong> in
                your field, you're being paid below the median for your role —
                an objective, data-backed case for a raise. If you're at the
                60th, you're above median but may still have room to negotiate
                toward the 75th percentile, especially if you've taken on
                additional responsibilities. Knowing your number puts you in
                control of the conversation.
              </p>
              <p>
                When presenting data, frame your case around BLS figures rather
                than crowdsourced sites. The Bureau of Labor Statistics surveys
                over{" "}
                <strong className="text-slate-200">
                  1.1 million employer establishments
                </strong>{" "}
                — not self-reported employee estimates — making the data far
                harder for a hiring manager to dispute. A strong opening might
                be: "According to May 2024 BLS data, the median salary for my
                role in this state is $X. I'm currently at the Yth percentile
                and would like to discuss moving toward the 75th." Time your ask
                to coincide with a recent achievement or your annual review
                cycle for maximum leverage.
              </p>
            </div>
          </article>

          {/* ── Article 3 ───────────────────────────────────────────────────── */}
          <article
            id="article-highest-paying"
            className="glass rounded-2xl p-7"
            aria-labelledby="article-3-title"
          >
            <h2
              id="article-3-title"
              className="text-xl font-bold text-white mb-4 leading-snug"
            >
              Highest Paying Occupations in America — BLS 2024 Data
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                The highest-paying occupations in America share a common thread:
                they require advanced education, specialized skills, or
                significant managerial responsibility — often all three.
                According to BLS OES May 2024 national data, the occupations
                commanding the highest median annual wages are concentrated in
                executive management, technology leadership, and healthcare.
              </p>
              <p>
                At the top of the distribution,{" "}
                <Link
                  href="/salary/top-executives-ceos"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  top executives and CEOs
                </Link>{" "}
                earn a national median of{" "}
                <strong className="text-slate-200">$189,520</strong>, with the
                top 10% exceeding $208,000.{" "}
                <Link
                  href="/salary/it-technology-managers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  IT managers
                </Link>{" "}
                follow at{" "}
                <strong className="text-slate-200">$169,510</strong>, and{" "}
                <Link
                  href="/salary/marketing-sales-managers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  marketing managers
                </Link>{" "}
                reach a median of{" "}
                <strong className="text-slate-200">$158,280</strong>.{" "}
                <Link
                  href="/salary/financial-managers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Financial managers
                </Link>{" "}
                earn a median of{" "}
                <strong className="text-slate-200">$156,100</strong>. In
                technology,{" "}
                <Link
                  href="/salary/software-developers-engineers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  software developers and engineers
                </Link>{" "}
                command{" "}
                <strong className="text-slate-200">$127,260</strong> at the
                median, with the top 10% exceeding $208,000.
              </p>
              <p>
                The common denominator across all top-paying occupations is
                leverage: these roles either manage large sums of capital, lead
                teams of other high-value workers, or possess technical skills
                that are genuinely scarce in the labor market. Workers pursuing
                high-paying careers without a medical degree will find the
                strongest returns in technology leadership, financial management,
                and specialized engineering. If you're already in one of these
                fields, check your precise percentile on any occupation page to
                see exactly how your pay compares to your peers nationally and
                in your state.
              </p>
            </div>
          </article>

          {/* ── Article 4 ───────────────────────────────────────────────────── */}
          <article
            id="article-bls-vs-crowdsourced"
            className="glass rounded-2xl p-7"
            aria-labelledby="article-4-title"
          >
            <h2
              id="article-4-title"
              className="text-xl font-bold text-white mb-4 leading-snug"
            >
              Why Government Salary Data Is More Reliable Than Crowdsourced Estimates
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                When you search for salary information online, you'll encounter
                two types of data: government-collected statistics from the
                Bureau of Labor Statistics, and crowdsourced estimates from
                sites like Glassdoor, PayScale, or Levels.fyi. Understanding
                the difference matters when you're using salary data to make
                real financial decisions — like whether to accept a job offer or
                ask for a raise.
              </p>
              <p>
                The BLS Occupational Employment and Wage Statistics program
                surveys approximately{" "}
                <strong className="text-slate-200">
                  1.1 million employer establishments
                </strong>{" "}
                across all industries each year. Employers report the actual
                wages they pay — not what employees think they're paid. This
                removes a fundamental source of bias: people tend to overreport
                their compensation on voluntary surveys, particularly when
                bonuses, equity, and variable compensation blur the line between
                base salary and total comp. The BLS specifically measures annual
                base wages, giving you a clean, consistent, and comparable
                figure across all occupations.
              </p>
              <p>
                Crowdsourced platforms also suffer from selection bias. The
                workers most motivated to report salaries on Glassdoor are those
                who are either very satisfied or very dissatisfied — the middle
                of the distribution is systematically underrepresented.
                High-paid tech workers in San Francisco are overrepresented
                relative to workers in lower-cost regions. The result is a
                skewed picture of what most Americans actually earn. BLS OES
                data covers all 50 states, all wage levels, and all industries
                with a methodology standardized over decades. Every figure on
                RankMySalary comes directly from BLS OES May 2024 national
                estimates — not from anonymous self-reports.
              </p>
            </div>
          </article>

          {/* ── Article 5 ───────────────────────────────────────────────────── */}
          <article
            id="article-salary-by-state"
            className="glass rounded-2xl p-7"
            aria-labelledby="article-5-title"
          >
            <h2
              id="article-5-title"
              className="text-xl font-bold text-white mb-4 leading-snug"
            >
              Salary Differences by State — What the BLS Data Shows
            </h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                The United States does not have a single labor market — it has
                fifty of them, each with distinct wage levels, industry
                concentrations, and costs of living. BLS OES May 2024 data
                reveals a striking spread: workers in the highest-paying states
                earn wages{" "}
                <strong className="text-slate-200">26–38% above</strong> the
                national median, while workers in the lowest-paying states earn
                15–20% below it — a difference that compounds dramatically over
                a career.
              </p>
              <p>
                California and Washington state consistently rank at the top
                across most occupations, driven by the concentration of
                technology, finance, and healthcare employers in the Bay Area,
                Seattle, and Los Angeles. The District of Columbia is an outlier
                in white-collar occupations, paying wages roughly{" "}
                <strong className="text-slate-200">38% above</strong> the
                national median due to the density of federal government and
                consulting roles. Massachusetts and New York round out the top
                tier, particularly in financial services and healthcare. At the
                other end, Mississippi, Arkansas, and West Virginia rank in the
                bottom five across nearly every major occupation category.
              </p>
              <p>
                Raw wage comparisons without cost-of-living adjustment can
                mislead, however. A{" "}
                <Link
                  href="/salary/software-developers-engineers"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  software developer
                </Link>{" "}
                earning $130,000 in Seattle faces significantly higher housing
                costs than the same developer earning $100,000 in Austin, Texas
                — and the after-tax, after-housing take-home may favor Texas.
                Remote work has added a new dimension: workers who earn
                California-level wages while living in lower-cost states can
                capture genuine geographic arbitrage. Use the state comparison
                tables on any occupation page to see how your state stacks up
                against the national median and whether relocating could
                materially improve your financial position.
              </p>
            </div>
          </article>

        </div>
      </section>
    </main>
  );
}
