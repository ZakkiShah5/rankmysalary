/**
 * Parses BLS OES national (oesnat.zip) and state (oesm23st.zip) data files
 * and writes real percentile data into lib/blsData.ts
 *
 * Usage:
 *   node scripts/parseBLS.mjs
 *
 * Place oesnat.zip and oesm23st.zip in the project root before running.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const AdmZip = require("adm-zip");
const XLSX = require("xlsx");
const ROOT = join(__dirname, "..");

// Map BLS SOC minor-group codes → our category keys.
// Minor groups (XX-N000) give sub-occupation level detail.
// Major groups (XX-0000) are used as fallbacks for categories without a minor-group match.
const SOC_TO_CATEGORY = {
  // Management (11)
  "11-1000": "mgmt-executives",
  "11-1021": "mgmt-operations",
  "11-3031": "mgmt-financial",
  "11-2000": "mgmt-marketing",
  "11-3021": "mgmt-it",
  "11-3120": "mgmt-hr",
  "11-9111": "mgmt-healthcare",
  "11-9021": "mgmt-construction",
  // Business & Financial (13)
  "13-2011": "biz-accounting",
  "13-2050": "biz-financial",
  "13-1110": "biz-consulting",
  "13-1070": "biz-hr-specialist",
  "13-1161": "biz-market-research",
  "13-1080": "biz-logistics",
  // Technology (15)
  "15-1250": "tech-software",
  "15-2050": "tech-data",
  "15-1212": "tech-security",
  "15-1211": "tech-systems",
  "15-1241": "tech-network",
  "15-1255": "tech-ux",
  "15-1232": "tech-support",
  // Engineering (17)
  "17-2051": "eng-civil",
  "17-2071": "eng-electrical",
  "17-2141": "eng-mechanical",
  "17-2041": "eng-chemical",
  "17-2112": "eng-industrial",
  "17-2011": "eng-aerospace",
  "17-1011": "eng-architecture",
  // Science (19)
  "19-1000": "sci-life",
  "19-2040": "sci-environmental",
  "19-2030": "sci-physical",
  "19-3000": "sci-social",
  // Social Service (21)
  "21-1020": "social-workers",
  "21-1010": "social-counselors",
  "21-1090": "social-community",
  // Legal (23)
  "23-1011": "legal-lawyers",
  "23-2011": "legal-paralegals",
  "23-1023": "legal-judges",
  // Education (25)
  "25-1000": "edu-postsecondary",
  "25-2031": "edu-high-school",
  "25-2020": "edu-k8",
  "25-2050": "edu-special-ed",
  "25-2010": "edu-early-childhood",
  "11-9030": "edu-admin",
  "25-9030": "edu-support",
  // Arts & Media (27)
  "27-1024": "arts-graphic-design",
  "27-3040": "arts-writers",
  "27-2000": "arts-media-production",
  "27-2090": "arts-performing",
  "27-4021": "arts-photography",
  // Healthcare — Physicians (29)
  "29-1210": "health-physicians",
  "29-1171": "health-np-pa",
  "29-1021": "health-dentists",
  "29-1051": "health-pharmacists",
  "29-1041": "health-optometrists",
  "19-3031": "health-psychologists",
  "29-1131": "health-veterinarians",
  // Healthcare — Nursing/Therapy (29)
  "29-1141": "health-rn",
  "29-1120": "health-pt-ot",
  "29-1127": "health-speech",
  "29-2030": "health-rad-tech",
  "29-1126": "health-respiratory",
  "29-2040": "health-emt",
  // Healthcare Support (31)
  "31-9092": "health-medical-asst",
  "31-1120": "health-home-aides",
  "31-1131": "health-nursing-asst",
  "31-9097": "health-phlebotomy",
  // Protective Service (33)
  "33-3050": "protective-police",
  "33-2011": "protective-fire",
  "33-3012": "protective-corrections",
  "33-9032": "protective-security",
  // Food Service (35)
  "35-1011": "food-chefs",
  "35-2000": "food-cooks",
  "35-3000": "food-servers",
  "11-9051": "food-mgmt",
  // Building & Grounds (37)
  "37-2011": "building-janitors",
  "37-3011": "building-landscaping",
  // Personal Care (39)
  "39-5010": "care-cosmetology",
  "39-9011": "care-childcare",
  "39-9031": "care-fitness",
  "39-5020": "care-massage",
  // Sales (41)
  "41-2031": "sales-retail",
  "41-4000": "sales-b2b",
  "41-9022": "sales-real-estate",
  "41-3021": "sales-insurance",
  "41-3031": "sales-financial",
  // Office & Admin (43)
  "43-6014": "office-admin-asst",
  "43-4051": "office-customer-svc",
  "43-3031": "office-bookkeeping",
  "43-4171": "office-receptionist",
  // Farming (45)
  "45-2090": "farming-crop",
  "11-9013": "farming-managers",
  // Construction (47)
  "47-2111": "construction-electricians",
  "47-2152": "construction-plumbers",
  "47-2031": "construction-carpenters",
  "47-2110": "construction-hvac",
  "47-2073": "construction-equipment",
  "47-2040": "construction-masonry",
  "47-2141": "construction-painters",
  "47-2061": "construction-laborers",
  // Maintenance (49)
  "49-3023": "repair-auto",
  "49-9041": "repair-industrial",
  "49-3011": "repair-aircraft",
  "49-9021": "repair-elevator",
  // Production (51)
  "51-4041": "production-machinists",
  "51-4121": "production-welders",
  "51-2090": "production-assemblers",
  "51-9000": "production-operators",
  "51-5110": "production-printing",
  // Transportation (53)
  "53-2011": "transport-pilots",
  "53-2022": "transport-atc",
  "53-3032": "transport-truck",
  "53-3031": "transport-delivery",
  "53-3050": "transport-transit",
  "53-4000": "transport-rail",
  "53-5020": "transport-ship",
};

// BLS state FIPS / area codes → our 2-letter state codes
const FIPS_TO_STATE = {
  "0100000": "AL", "0200000": "AK", "0400000": "AZ", "0500000": "AR",
  "0600000": "CA", "0800000": "CO", "0900000": "CT", "1000000": "DE",
  "1100000": "DC", "1200000": "FL", "1300000": "GA", "1500000": "HI",
  "1600000": "ID", "1700000": "IL", "1800000": "IN", "1900000": "IA",
  "2000000": "KS", "2100000": "KY", "2200000": "LA", "2300000": "ME",
  "2400000": "MD", "2500000": "MA", "2600000": "MI", "2700000": "MN",
  "2800000": "MS", "2900000": "MO", "3000000": "MT", "3100000": "NE",
  "3200000": "NV", "3300000": "NH", "3400000": "NJ", "3500000": "NM",
  "3600000": "NY", "3700000": "NC", "3800000": "ND", "3900000": "OH",
  "4000000": "OK", "4100000": "OR", "4200000": "PA", "4400000": "RI",
  "4500000": "SC", "4600000": "SD", "4700000": "TN", "4800000": "TX",
  "4900000": "UT", "5000000": "VT", "5100000": "VA", "5300000": "WA",
  "5400000": "WV", "5500000": "WI", "5600000": "WY",
};

function parseNum(val) {
  if (val === undefined || val === null) return null;
  const s = String(val).replace(/,/g, "").trim();
  if (s === "" || s === "*" || s === "#" || s === "**") return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : Math.round(n);
}

function extractSheet(zipPath) {
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  // Find the first .xlsx or .xls file
  const entry = entries.find((e) => /\.(xlsx|xls)$/i.test(e.entryName));
  if (!entry) throw new Error(`No Excel file found in ${zipPath}`);
  console.log(`  Reading: ${entry.entryName}`);
  const buf = entry.getData();
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: null });
}

function rowToPercentile(row) {
  // BLS column names for annual wages
  const p10  = parseNum(row["A_PCT10"]);
  const p25  = parseNum(row["A_PCT25"]);
  const p50  = parseNum(row["A_MEDIAN"]);
  const p75  = parseNum(row["A_PCT75"]);
  const p90  = parseNum(row["A_PCT90"]);
  const mean = parseNum(row["A_MEAN"]);
  if (!p50) return null; // skip rows with no median
  return {
    p10:  p10  ?? Math.round(p50 * 0.55),
    p25:  p25  ?? Math.round(p50 * 0.75),
    p50,
    p75:  p75  ?? Math.round(p50 * 1.35),
    p90:  p90  ?? Math.round(p50 * 1.70),
    mean: mean ?? p50,
  };
}

// ── 1. Parse national data ────────────────────────────────────────────────────
const natZip = join(ROOT, "oesnat.zip");
if (!existsSync(natZip)) {
  console.error("ERROR: oesnat.zip not found in project root.");
  process.exit(1);
}
console.log("Parsing national data (oesnat.zip)...");
const natRows = extractSheet(natZip);

const national = {};
for (const row of natRows) {
  const code = String(row["OCC_CODE"] ?? "").trim();
  const group = String(row["O_GROUP"] ?? "").trim().toLowerCase();
  const cat = SOC_TO_CATEGORY[code];
  // Only grab major-group rows
  if (!cat || (group !== "major" && group !== "major group")) continue;
  const pd = rowToPercentile(row);
  if (pd) national[cat] = pd;
}
console.log(`  Found ${Object.keys(national).length} national categories`);

// ── 2. Parse state data ───────────────────────────────────────────────────────
const stZip = join(ROOT, "oesm23st.zip");
const stateData = {}; // stateData[stateCode][category] = PercentileData

if (!existsSync(stZip)) {
  console.warn("WARNING: oesm23st.zip not found — state data will be skipped.");
} else {
  console.log("Parsing state data (oesm23st.zip)...");
  const stRows = extractSheet(stZip);

  for (const row of stRows) {
    const code  = String(row["OCC_CODE"]  ?? "").trim();
    const group = String(row["O_GROUP"]   ?? "").trim().toLowerCase();
    const area  = String(row["AREA"]      ?? row["STATE"] ?? "").trim();
    const cat   = SOC_TO_CATEGORY[code];
    if (!cat || (group !== "major" && group !== "major group")) continue;

    // Try FIPS lookup first, then direct 2-letter match
    const st = FIPS_TO_STATE[area] ?? (area.length === 2 ? area : null);
    if (!st) continue;

    const pd = rowToPercentile(row);
    if (!pd) continue;
    if (!stateData[st]) stateData[st] = {};
    stateData[st][cat] = pd;
  }
  console.log(`  Found data for ${Object.keys(stateData).length} states`);
}

// ── 3. Emit TypeScript ────────────────────────────────────────────────────────
function fmtObj(pd) {
  return `{ p10: ${pd.p10}, p25: ${pd.p25}, p50: ${pd.p50}, p75: ${pd.p75}, p90: ${pd.p90}, mean: ${pd.mean} }`;
}

let ts = `// AUTO-GENERATED by scripts/parseBLS.mjs — DO NOT EDIT MANUALLY
// Source: BLS Occupational Employment & Wage Statistics (OES) May 2023
// https://www.bls.gov/oes/

export interface PercentileData {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
}

export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

export const JOB_CATEGORIES: { value: string; label: string }[] = [
  { value: "management",                label: "Management" },
  { value: "business-financial",        label: "Business & Financial Operations" },
  { value: "computer-math",             label: "Computer & Mathematical" },
  { value: "architecture-engineering",  label: "Architecture & Engineering" },
  { value: "life-physical-social-science", label: "Life, Physical & Social Science" },
  { value: "community-social-service",  label: "Community & Social Service" },
  { value: "legal",                     label: "Legal" },
  { value: "education-training",        label: "Education, Training & Library" },
  { value: "arts-design-entertainment", label: "Arts, Design, Entertainment & Media" },
  { value: "healthcare-practitioners",  label: "Healthcare Practitioners & Technical" },
  { value: "healthcare-support",        label: "Healthcare Support" },
  { value: "protective-service",        label: "Protective Service" },
  { value: "food-preparation",          label: "Food Preparation & Serving" },
  { value: "building-grounds",          label: "Building & Grounds Cleaning" },
  { value: "personal-care",             label: "Personal Care & Service" },
  { value: "sales",                     label: "Sales & Related" },
  { value: "office-administrative",     label: "Office & Administrative Support" },
  { value: "farming-fishing-forestry",  label: "Farming, Fishing & Forestry" },
  { value: "construction-extraction",   label: "Construction & Extraction" },
  { value: "installation-maintenance-repair", label: "Installation, Maintenance & Repair" },
  { value: "production",                label: "Production" },
  { value: "transportation",            label: "Transportation & Material Moving" },
];

// BLS OES May 2023 — national annual wage percentiles by major occupation group
export const NATIONAL_DATA: Record<string, PercentileData> = {
`;

for (const [cat, pd] of Object.entries(national)) {
  ts += `  "${cat}": ${fmtObj(pd)},\n`;
}
ts += `};\n\n`;

// State data block
ts += `// BLS OES May 2023 — state-level annual wage percentiles\n`;
ts += `// Keys: state abbreviation → category → percentile data\n`;
ts += `export const STATE_DATA: Record<string, Record<string, PercentileData>> = {\n`;
for (const [st, cats] of Object.entries(stateData).sort()) {
  ts += `  ${st}: {\n`;
  for (const [cat, pd] of Object.entries(cats)) {
    ts += `    "${cat}": ${fmtObj(pd)},\n`;
  }
  ts += `  },\n`;
}
ts += `};\n\n`;

// Helper functions
ts += `// State-level lookup with national fallback
export function getOccupationData(
  category: string,
  state: string
): { national: PercentileData; state: PercentileData } {
  const nat = NATIONAL_DATA[category] ?? NATIONAL_DATA["office-administrative"];
  const st  = STATE_DATA[state]?.[category] ?? nat;
  return { national: nat, state: st };
}

// Linear interpolation between BLS percentile anchor points
export function estimatePercentile(salary: number, data: PercentileData): number {
  const { p10, p25, p50, p75, p90 } = data;

  if (salary <= p10) {
    const ratio = salary / p10;
    return Math.max(1, Math.round(ratio * 10));
  }
  if (salary >= p90) {
    const upperBound = p90 * 1.6;
    if (salary >= upperBound) return 99;
    const ratio = (salary - p90) / (upperBound - p90);
    return Math.min(99, Math.round(90 + ratio * 9));
  }

  const segments: [number, number, number, number][] = [
    [p10, p25, 10, 25],
    [p25, p50, 25, 50],
    [p50, p75, 50, 75],
    [p75, p90, 75, 90],
  ];
  for (const [w0, w1, pct0, pct1] of segments) {
    if (salary >= w0 && salary <= w1) {
      const ratio = (salary - w0) / (w1 - w0);
      return Math.round(pct0 + ratio * (pct1 - pct0));
    }
  }
  return 50;
}
`;

const outPath = join(ROOT, "lib", "blsData.ts");
writeFileSync(outPath, ts, "utf8");
console.log(`\nWrote ${outPath}`);
console.log(`National categories: ${Object.keys(national).length}/22`);
console.log(`States with data:    ${Object.keys(stateData).length}/51`);
