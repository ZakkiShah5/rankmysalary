import type { MetadataRoute } from "next";
import { OCCUPATION_BY_SLUG, SLUG_BY_STATE } from "@/lib/slugs";
import { US_STATES } from "@/lib/blsData";

const BASE = "https://rankmysalary.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const occupationSlugs = Object.keys(OCCUPATION_BY_SLUG);
  const stateCodes = Object.keys(US_STATES);

  // Home page
  const home: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
  ];

  // /salary/[occupation-slug] — one per occupation (116 pages)
  const occupationPages: MetadataRoute.Sitemap = occupationSlugs.map((slug) => ({
    url: `${BASE}/salary/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
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

  return [...home, ...occupationPages, ...statePages];
}
