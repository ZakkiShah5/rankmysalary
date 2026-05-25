import type { MetadataRoute } from "next";
import { OCCUPATION_BY_SLUG, SLUG_BY_STATE } from "@/lib/slugs";
import { US_STATES } from "@/lib/blsData";

const BASE = "https://rankmysalary.com";

const SALARY_CHECK_AMOUNTS = [
  40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000,
  80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 150000, 200000,
];

const INSIGHT_SLUGS = [
  "what-is-a-good-salary",
  "how-to-negotiate-salary",
  "highest-paying-occupations",
  "why-bls-data-is-reliable",
  "salary-differences-by-state",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const occupationSlugs = Object.keys(OCCUPATION_BY_SLUG);
  const stateCodes = Object.keys(US_STATES);

  const home: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/am-i-underpaid`,               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/salary-comparison-by-state`,   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/average-salary-by-occupation`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const insightPages: MetadataRoute.Sitemap = INSIGHT_SLUGS.map((slug) => ({
    url: `${BASE}/salary-insights/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // /salary/[occupation-slug] — one per occupation (116 pages)
  const occupationPages: MetadataRoute.Sitemap = occupationSlugs.map((slug) => ({
    url: `${BASE}/salary/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // /salary/is-X-a-good-salary — 18 salary check pages
  const salaryCheckPages: MetadataRoute.Sitemap = SALARY_CHECK_AMOUNTS.map((amount) => ({
    url: `${BASE}/salary/is-${amount}-a-good-salary`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // /salary/[occupation-slug]/[state-slug] — one per occupation × state (~5,900 pages)
  const statePages: MetadataRoute.Sitemap = occupationSlugs.flatMap((occSlug) =>
    stateCodes.map((code) => {
      const stateSlug = SLUG_BY_STATE[code];
      return {
        url: `${BASE}/salary/${occSlug}/${stateSlug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    })
  );

  return [
    ...home,
    ...staticPages,
    ...insightPages,
    ...occupationPages,
    ...salaryCheckPages,
    ...statePages,
  ];
}
