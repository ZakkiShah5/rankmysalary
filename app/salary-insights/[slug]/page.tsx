import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SalaryCalculator from "@/components/SalaryCalculator";

const SITE_URL = "https://rankmysalary.com";

export const dynamicParams = false;

// ── Article definitions ───────────────────────────────────────────────────────
type Slug =
  | "what-is-a-good-salary"
  | "how-to-negotiate-salary"
  | "highest-paying-occupations"
  | "why-bls-data-is-reliable"
  | "salary-differences-by-state";

interface Section {
  heading?: string;
  body: string;
}

interface Article {
  tag: string;
  title: string;
  description: string;
  readingTime: string;
  sections: Section[];
}

const ARTICLES: Record<Slug, Article> = {
  "what-is-a-good-salary": {
    tag: "SALARY GUIDE",
    title: "What Is a Good Salary in the United States in 2024?",
    description:
      "The national median is $49,500, but 'good' depends on your occupation, state, and career stage. Learn how salary percentiles give you a far more meaningful benchmark.",
    readingTime: "4 min read",
    sections: [
      {
        body: "The national median annual wage in the United States is $49,500 according to BLS OES May 2024 data — but calling any single number “good” flattens enormous variation by occupation, geography, and career stage. A software developer earning $90,000 in Mississippi is doing very well; the same salary for a physician in California would be well below the 10th percentile for that profession. The national median is a starting point, not a verdict.",
      },
      {
        heading: "Think in Percentiles, Not Averages",
        body: "A more useful framework is percentile thinking. If you’re at or above the 75th percentile for your occupation and state, you’re earning more than the vast majority of your peers — that’s a strong benchmark for “good.” Between the 50th and 75th percentile, you’re above average but have meaningful upside. Below the 25th percentile for your field and location typically signals room to negotiate, switch employers, or pursue credentials that unlock higher pay. The 10th percentile is a clear red flag.",
      },
      {
        heading: "The Role of Cost of Living",
        body: "Cost of living complicates the picture further. A $70,000 salary in rural Tennessee has very different purchasing power than the same amount in San Francisco. BLS data captures wage distributions but not regional price levels — for a complete picture, combine your percentile rank with local cost-of-living data from sources like the Bureau of Economic Analysis. The calculator below uses your state selection to apply BLS regional wage indices, giving you the most accurate local comparison available.",
      },
      {
        heading: "The Right Question to Ask",
        body: "Stop asking “is my salary good?” and start asking “what percentile am I at in my specific occupation and state?” A 70th-percentile income in your field is objectively strong regardless of the absolute number. A 30th-percentile income in a high-paying field still leaves substantial upside on the table. Use the calculator below to find your exact position in the distribution — it’s the most useful data point you can have going into any salary conversation.",
      },
    ],
  },

  "how-to-negotiate-salary": {
    tag: "NEGOTIATION",
    title: "How to Use Salary Percentile Data to Negotiate Your Pay",
    description:
      "BLS percentile data is the strongest anchor you can bring to a salary negotiation. Here's how to use it effectively to get to market rate.",
    readingTime: "5 min read",
    sections: [
      {
        body: "Most salary negotiations fail before they begin because workers anchor on feelings rather than data. Percentile data changes that dynamic. Instead of saying “I feel underpaid,” you can say: “According to BLS OES May 2024 data, my salary places me at the 38th percentile for software developers in Texas — the median is $127,260, and I’m asking to move toward that benchmark.” That framing is far harder for a manager to dismiss than a subjective appeal.",
      },
      {
        heading: "Why Government Data Carries Weight",
        body: "Government data carries particular weight in these conversations. Unlike Glassdoor or Levels.fyi, the BLS surveys 1.1 million employer establishments directly — the sample is massive, the methodology is public, and it’s the same source the federal government uses for economic policy. Presenting BLS figures signals that you’ve done serious research, not just checked a crowdsourced site after a frustrating performance review.",
      },
      {
        heading: "Timing and Framing",
        body: "Timing and framing matter as much as the data itself. Bring your percentile result to annual reviews, not mid-cycle. Lead with your contributions, then use the data to justify the number: “Based on my impact over the past year and BLS benchmarks for this role in our market, I’m targeting $X — which would put me at the Nth percentile nationally.” If your employer pushes back, ask what percentile they’re targeting for the role; that question alone often reveals how far apart you actually are.",
      },
      {
        heading: "After the Negotiation",
        body: "Track the outcome. If you got a raise, note what moved the needle — data, timing, or framing. If you didn’t, document your current percentile and set a 6-month reminder to revisit. Most salary increases come through sustained, documented conversations rather than one-time asks. Your percentile is a living number; recalculate it after every major BLS data release (published annually in the fall) to stay current on where you stand.",
      },
    ],
  },

  "highest-paying-occupations": {
    tag: "SALARY DATA",
    title: "Highest Paying Occupations in America — BLS 2024 Data",
    description:
      "Physicians, top executives, and software developers dominate the top of the US wage distribution. Here's what the BLS OES May 2024 data actually shows.",
    readingTime: "4 min read",
    sections: [
      {
        body: "According to BLS OES May 2024 data, the highest-paying occupations in the United States are concentrated in three sectors: healthcare, technology, and executive management. Physicians and surgeons top the list with a national median exceeding $229,300, followed by oral and maxillofacial surgeons, orthodontists, and other dental specialists — all with medians above $160,000. The pattern is consistent: high barriers to entry through education and licensure translate directly into elevated wages.",
      },
      {
        heading: "Technology and Management",
        body: "In technology, chief executives and top executives earn a national median of $189,520, while IT managers reach $169,510. Software developers — the largest tech occupation by headcount — earn a median of $127,260 nationally, with the 90th percentile exceeding $208,000 in states like Washington and California. Data scientists and machine learning engineers cluster around the $108,000–$130,000 range at the median, with steep upward trajectories in major tech hubs.",
      },
      {
        heading: "What Separates Top Earners",
        body: "What separates the highest-paying roles isn’t just education — it’s leverage: over capital (executives), life-and-death decisions (physicians), or critical infrastructure (senior engineers). The fastest path to the top of the wage distribution within your field is usually specialization that’s difficult to automate or offshore, combined with experience in high-revenue industries. The BLS data shows that within any occupation, the gap between the 50th and 90th percentile is often 60–100% — meaning that reaching the top of your field pays far more than switching to a different field at the median.",
      },
      {
        heading: "Using the Data for Career Decisions",
        body: "Use the salary calculator below to find your percentile within any of these occupations. The gap between the median and the 90th percentile in high-paying fields is especially wide — a top software engineer in Washington earns 63% more than the state median for that role. Getting to the top of your field compounds significantly over a 20-year career. Compare your current occupation to alternatives to see whether a field switch makes financial sense given your career stage.",
      },
    ],
  },

  "why-bls-data-is-reliable": {
    tag: "DATA QUALITY",
    title: "Why Government Salary Data Is More Reliable Than Crowdsourced Estimates",
    description:
      "The BLS surveys 1.1 million employer establishments directly. Here's why that makes it more accurate than Glassdoor or PayScale, and what its limitations are.",
    readingTime: "5 min read",
    sections: [
      {
        body: "The core problem with crowdsourced salary sites is selection bias: only certain types of workers share their compensation. Research consistently shows that high earners — particularly in tech — are dramatically overrepresented on Glassdoor, Levels.fyi, and similar platforms. The workers who post their salaries are disproportionately in major metro areas, at name-brand companies, and have salaries worth sharing. The result is figures that can be 20–40% above what most workers in a given title actually earn.",
      },
      {
        heading: "How BLS Collects Its Data",
        body: "The BLS Occupational Employment and Wage Statistics program avoids this problem by surveying employers directly. The May 2024 release drew from approximately 1.1 million employer establishments across all industries, producing wage estimates that are statistically representative of actual employment. Methodology, sample sizes, and confidence intervals are all publicly documented and peer-reviewed — transparency that no crowdsourced platform can match. In states that participate in mandatory reporting, response rates exceed 75%.",
      },
      {
        heading: "Limitations to Know",
        body: "That said, BLS data has its own limitations. It reflects base wages only — bonuses, equity, and benefits are excluded. It’s also published with an 18-month lag (May 2024 data was collected through May 2024 and released in late 2024), so it may understate salaries in rapidly growing fields. And the occupation groupings are broad enough that a “software developer” ranges from a junior web developer to a principal engineer. These limitations are real and worth understanding.",
      },
      {
        heading: "How to Use Both Data Sources",
        body: "The right approach is to use BLS data as your floor — the reliable baseline — and supplement it with role-specific market data when negotiating for a specific position. BLS tells you where the market actually is; Levels.fyi or recruiter intel tells you where the ceiling is for your specific title and company tier. In salary negotiations, BLS is the defensible anchor. When evaluating offers, the more granular sources help you calibrate whether an offer is truly competitive for your exact situation.",
      },
    ],
  },

  "salary-differences-by-state": {
    tag: "BY STATE",
    title: "Salary Differences by State — What the BLS Data Shows",
    description:
      "California and D.C. lead US wages by 26–38%. Mississippi and West Virginia trail by 15–20%. Here's what BLS OES May 2024 data shows about geographic wage variation.",
    readingTime: "4 min read",
    sections: [
      {
        body: "Geographic wage variation in the United States is enormous, and it’s not simply explained by cost of living. According to BLS OES May 2024 data, workers in Washington state, California, and Washington D.C. earn 26–38% above the national median across all occupations — driven by high concentrations of technology and financial services employment, and the competitive labor markets those industries create. At the other end, Mississippi, West Virginia, and Arkansas wages sit 15–20% below the national median.",
      },
      {
        heading: "Occupation-Specific Variation",
        body: "The variation is even sharper within specific occupations. A software developer in San Francisco earns a state median around $160,000; the same role in Mississippi pays around $90,000 — a 78% gap. For nurses, New York and California medians are roughly 40% above those in the South. These gaps reflect both industry concentration and cost of living — but cost of living doesn’t scale linearly with wages, which creates genuine arbitrage opportunities for remote workers who can earn coastal salaries while living in lower-cost markets.",
      },
      {
        heading: "The Remote Work Effect",
        body: "Remote work has begun compressing these gaps, but more slowly than expected. Employers in high-wage states increasingly apply location-based pay adjustments, meaning a remote hire in Austin may earn 80–90% of the San Francisco rate rather than the full amount. The BLS data captures these dynamics with a lag — expect the 2025 and 2026 releases to show continued convergence in software, data, and other fully remote-friendly roles, even as in-person roles in healthcare, construction, and retail maintain their regional wage structures.",
      },
      {
        heading: "How to Use This for Career Decisions",
        body: "The salary calculator below lets you see your percentile in any state for any of our 116 occupation categories. Use it to compare your current location against states you’re considering — both for job searches and remote work negotiations. A 15% wage increase moving from Texas to Washington is significant, but so is a 15% decrease in housing costs moving the other direction. The calculator gives you the wage side of that equation; local cost-of-living data completes the picture.",
      },
    ],
  },
};

const RELATED: Record<Slug, Slug[]> = {
  "what-is-a-good-salary":       ["how-to-negotiate-salary", "salary-differences-by-state"],
  "how-to-negotiate-salary":     ["what-is-a-good-salary", "why-bls-data-is-reliable"],
  "highest-paying-occupations":  ["what-is-a-good-salary", "salary-differences-by-state"],
  "why-bls-data-is-reliable":    ["how-to-negotiate-salary", "highest-paying-occupations"],
  "salary-differences-by-state": ["what-is-a-good-salary", "highest-paying-occupations"],
};

// ── Next.js config ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return (Object.keys(ARTICLES) as Slug[]).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug as Slug];
  if (!article) return {};
  return {
    title: `${article.title} | RankMySalary`,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/salary-insights/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SalaryInsightPage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES[slug as Slug];
  if (!article) notFound();

  const relatedSlugs = RELATED[slug as Slug] ?? [];
  const relatedArticles = relatedSlugs.map((s) => ({ slug: s, ...ARTICLES[s] }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/salary-insights/${slug}`,
    author: { "@type": "Organization", name: "RankMySalary" },
    publisher: { "@type": "Organization", name: "RankMySalary" },
  };

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
          <Link href="/#salary-insights" className="hover:text-slate-400 transition-colors">
            Salary Insights
          </Link>
          <span>›</span>
          <span className="text-slate-500 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Article header */}
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#06b6d4" }}
        >
          {article.tag}
        </span>

        <h1 className="text-4xl font-black text-white mt-2 mb-3 leading-tight max-w-2xl">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs text-slate-600">{article.readingTime}</span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-600">BLS OES May 2024</span>
        </div>

        {/* Article body */}
        <article className="max-w-2xl space-y-6 text-sm text-slate-400 leading-relaxed mb-16">
          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="text-xl font-bold text-white mb-3 mt-2">{section.heading}</h2>
              )}
              <p>{section.body}</p>
            </div>
          ))}
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-5">
              Related Guides
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/salary-insights/${rel.slug}`}
                  className="flex flex-col gap-2 p-5 rounded-xl transition-all duration-200 hover:border-blue-500/30"
                  style={{
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "#06b6d4" }}
                  >
                    {rel.tag}
                  </span>
                  <span className="text-sm font-semibold text-white leading-snug">
                    {rel.title}
                  </span>
                  <span className="text-xs text-blue-400">Read more →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <SalaryCalculator />
    </>
  );
}
