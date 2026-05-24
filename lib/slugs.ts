import { JOB_CATEGORIES, US_STATES } from "./blsData";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export type OccupationMeta = { key: string; label: string };
export type StateMeta = { code: string; name: string };

// Occupation slug → { key, label }
export const OCCUPATION_BY_SLUG: Record<string, OccupationMeta> = {};
// Occupation key → slug
export const SLUG_BY_KEY: Record<string, string> = {};

for (const cat of JOB_CATEGORIES) {
  const slug = slugify(cat.label);
  if (!OCCUPATION_BY_SLUG[slug]) {
    OCCUPATION_BY_SLUG[slug] = { key: cat.value, label: cat.label };
  }
  SLUG_BY_KEY[cat.value] = slug;
}

// State slug → { code, name }
export const STATE_BY_SLUG: Record<string, StateMeta> = {};
// State code → slug
export const SLUG_BY_STATE: Record<string, string> = {};

for (const [code, name] of Object.entries(US_STATES)) {
  const slug = slugify(name);
  STATE_BY_SLUG[slug] = { code, name };
  SLUG_BY_STATE[code] = slug;
}
