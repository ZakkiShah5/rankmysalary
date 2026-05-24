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

// ── Card data for the Salary Insights grid ────────────────────────────────────
const INSIGHT_CARDS = [
  {
    id: "article-good-salary",
    tag: "SALARY GUIDE",
    title: "What Is a Good Salary in the United States in 2024?",
    excerpt:
      "The national median annual wage is $49,500, but whether that figure is 'good' depends entirely on your occupation, state, and cost of living. Salary percentiles give you a far more meaningful benchmark — see exactly where you rank in your specific field.",
  },
  {
    id: "article-negotiation",
    tag: "NEGOTIATION",
    title: "How to Use Salary Percentile Data to Negotiate Your Pay",
    excerpt:
      "BLS data gives you an authoritative, hard-to-dispute benchmark for your next salary conversation — far stronger than crowdsourced sites like Glassdoor. If you're below the 50th percentile for your role, you have a concrete, data-backed case for a raise.",
  },
  {
    id: "article-highest-paying",
    tag: "SALARY DATA",
    title: "Highest Paying Occupations in America — BLS 2024 Data",
    excerpt:
      "Top executives earn a national median of $189,520, IT managers $169,510, and software developers $127,260 — the highest-paying roles all require advanced education or significant leverage over capital or teams. Technology, management, and healthcare dominate the top tier.",
  },
  {
    id: "article-bls-vs-crowdsourced",
    tag: "DATA QUALITY",
    title: "Why Government Salary Data Is More Reliable Than Crowdsourced Estimates",
    excerpt:
      "The BLS surveys 1.1 million employer establishments directly — not self-reported estimates — making it far more accurate than Glassdoor or PayScale. Selection bias systematically inflates crowdsourced figures, especially for tech workers in high-cost cities.",
  },
  {
    id: "article-salary-by-state",
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
                href={`#${card.id}`}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "#3b82f6" }}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        {/* ── Full articles ──────────────────────────────────────────────────── */}
        <div className="mt-16 space-y-14">

          <article id="article-good-salary" className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#06b6d4" }}>SALARY GUIDE</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-5 leading-snug">What Is a Good Salary in the United States in 2024?</h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>The national median annual wage in the United States is $49,500 according to BLS OES May 2024 data — but calling any single number &ldquo;good&rdquo; flattens enormous variation by occupation, geography, and career stage. A software developer earning $90,000 in Mississippi is doing very well; the same salary for a physician in California would be well below the 10th percentile for that profession.</p>
              <p>A more useful framework is percentile thinking. If you&rsquo;re at or above the 75th percentile for your occupation and state, you&rsquo;re earning more than the vast majority of your peers — that&rsquo;s a strong benchmark for &ldquo;good.&rdquo; Between the 50th and 75th percentile, you&rsquo;re above average but have meaningful upside. Below the 25th percentile for your field and location typically signals room to negotiate, switch employers, or pursue credentials that unlock higher pay.</p>
              <p>Cost of living complicates the picture further. A $70,000 salary in rural Tennessee has very different purchasing power than the same amount in San Francisco. BLS data captures wage distributions but not regional price levels — for a complete picture, combine your percentile rank with local cost-of-living data from sources like the Bureau of Economic Analysis. The calculator above uses your state selection to apply BLS regional wage indices, giving you the most accurate local comparison available.</p>
            </div>
          </article>

          <article id="article-negotiation" className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#06b6d4" }}>NEGOTIATION</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-5 leading-snug">How to Use Salary Percentile Data to Negotiate Your Pay</h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>Most salary negotiations fail before they begin because workers anchor on feelings rather than data. Percentile data changes that dynamic. Instead of saying &ldquo;I feel underpaid,&rdquo; you can say: &ldquo;According to BLS OES May 2024 data, my salary places me at the 38th percentile for software developers in Texas — the median is $127,260, and I&rsquo;m asking to move toward that benchmark.&rdquo; That framing is far harder for a manager to dismiss than a subjective appeal.</p>
              <p>Government data carries particular weight in these conversations. Unlike Glassdoor or Levels.fyi, the BLS surveys 1.1 million employer establishments directly — the sample is massive, the methodology is public, and it&rsquo;s the same source the federal government uses for economic policy. Presenting BLS figures signals that you&rsquo;ve done serious research, not just checked a crowdsourced site after a frustrating performance review.</p>
              <p>Timing and framing matter as much as the data itself. Bring your percentile result to annual reviews, not mid-cycle. Lead with your contributions, then use the data to justify the number: &ldquo;Based on my impact over the past year and BLS benchmarks for this role in our market, I&rsquo;m targeting $X — which would put me at the Nth percentile nationally.&rdquo; If your employer pushes back, ask what percentile they&rsquo;re targeting for the role; that question alone often reveals how far apart you actually are.</p>
            </div>
          </article>

          <article id="article-highest-paying" className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#06b6d4" }}>SALARY DATA</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-5 leading-snug">Highest Paying Occupations in America — BLS 2024 Data</h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>According to BLS OES May 2024 data, the highest-paying occupations in the United States are concentrated in three sectors: healthcare, technology, and executive management. Physicians and surgeons top the list with a national median exceeding $236,000, followed by oral and maxillofacial surgeons, orthodontists, and other dental specialists — all with medians above $200,000. The pattern is consistent: high barriers to entry through education and licensure translate directly into elevated wages.</p>
              <p>In technology, chief executives and top executives earn a national median of $189,520, while IT managers reach $169,510. Software developers — the largest tech occupation by headcount — earn a median of $127,260 nationally, with the 90th percentile exceeding $208,000 in states like Washington and California. Data scientists and machine learning engineers cluster around the $120,000–$140,000 range at the median, with steep upward trajectories in major tech hubs.</p>
              <p>What separates the highest-paying roles isn&rsquo;t just education — it&rsquo;s leverage: over capital (executives), life-and-death decisions (physicians), or critical infrastructure (senior engineers). The fastest path to the top of the wage distribution within your field is usually specialization that&rsquo;s difficult to automate or offshore, combined with experience in high-revenue industries. The BLS data shows that within any occupation, the gap between the 50th and 90th percentile is often 60–100% — meaning that reaching the top of your field pays far more than switching to a different field at the median.</p>
            </div>
          </article>

          <article id="article-bls-vs-crowdsourced" className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#06b6d4" }}>DATA QUALITY</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-5 leading-snug">Why Government Salary Data Is More Reliable Than Crowdsourced Estimates</h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>The core problem with crowdsourced salary sites is selection bias: only certain types of workers share their compensation. Research consistently shows that high earners — particularly in tech — are dramatically overrepresented on Glassdoor, Levels.fyi, and similar platforms. The workers who post their salaries are disproportionately in major metro areas, at name-brand companies, and have salaries worth sharing. The result is figures that can be 20–40% above what most workers in a given title actually earn.</p>
              <p>The BLS Occupational Employment and Wage Statistics program avoids this problem by surveying employers directly. The May 2024 release drew from approximately 1.1 million employer establishments across all industries, producing wage estimates that are statistically representative of actual employment. Methodology, sample sizes, and confidence intervals are all publicly documented and peer-reviewed — transparency that no crowdsourced platform can match.</p>
              <p>That said, BLS data has its own limitations. It reflects base wages only — bonuses, equity, and benefits are excluded. It&rsquo;s also published with an 18-month lag, so it may understate salaries in rapidly growing fields. And the occupation groupings are broad enough that a &ldquo;software developer&rdquo; ranges from a junior web developer to a principal engineer. The right approach is to use BLS data as your floor — the reliable baseline — and supplement it with role-specific market data when negotiating for a specific position.</p>
            </div>
          </article>

          <article id="article-salary-by-state" className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#06b6d4" }}>BY STATE</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-5 leading-snug">Salary Differences by State — What the BLS Data Shows</h2>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>Geographic wage variation in the United States is enormous, and it&rsquo;s not simply explained by cost of living. According to BLS OES May 2024 data, workers in Washington state, California, and Washington D.C. earn 26–38% above the national median across all occupations — driven by high concentrations of technology and financial services employment, and the competitive labor markets those industries create. At the other end, Mississippi, West Virginia, and Arkansas wages sit 15–20% below the national median.</p>
              <p>The variation is even sharper within specific occupations. A software developer in San Francisco earns a state median around $160,000; the same role in Mississippi pays around $90,000. For nurses, New York and California medians are roughly 40% above those in the South. These gaps reflect both industry concentration and cost of living — but cost of living doesn&rsquo;t scale linearly with wages, which creates genuine arbitrage opportunities for remote workers who can earn coastal salaries while living in lower-cost markets.</p>
              <p>Remote work has begun compressing these gaps, but more slowly than expected. Employers in high-wage states increasingly apply location-based pay adjustments, meaning a remote hire in Austin may earn 80–90% of the San Francisco rate rather than the full amount. The BLS data captures these dynamics with a lag — expect the 2025 and 2026 releases to show continued convergence in software, data, and other fully remote-friendly roles, even as in-person roles in healthcare, construction, and retail maintain their regional wage structures.</p>
            </div>
          </article>

        </div>
      </section>
    </main>
  );
}
