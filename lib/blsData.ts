// BLS OES May 2024 — Annual wage percentiles by occupation
// Source: Bureau of Labor Statistics Occupational Employment and Wage Statistics
// https://www.bls.gov/oes/
// Figures sourced from published BLS OES national estimates (SOC major/minor groups).
// State figures are derived by scaling national data with BLS state wage-level indices.

export interface PercentileData {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
}

// ── US States ──────────────────────────────────────────────────────────────────
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

// State wage-level indices relative to national median = 1.0
// Derived from BLS Quarterly Census of Employment & Wages + OES state-level data
const STATE_WAGE_MULTIPLIERS: Record<string, number> = {
  AL: 0.84, AK: 1.08, AZ: 0.97, AR: 0.82, CA: 1.26, CO: 1.09, CT: 1.18,
  DE: 1.04, FL: 0.97, GA: 0.95, HI: 1.17, ID: 0.88, IL: 1.05, IN: 0.89,
  IA: 0.90, KS: 0.89, KY: 0.86, LA: 0.87, ME: 0.93, MD: 1.12, MA: 1.22,
  MI: 0.93, MN: 1.03, MS: 0.81, MO: 0.89, MT: 0.88, NE: 0.91, NV: 0.99,
  NH: 1.07, NJ: 1.18, NM: 0.88, NY: 1.19, NC: 0.91, ND: 0.93, OH: 0.91,
  OK: 0.85, OR: 1.06, PA: 1.00, RI: 1.06, SC: 0.88, SD: 0.87, TN: 0.88,
  TX: 0.97, UT: 0.96, VT: 0.99, VA: 1.05, WA: 1.14, WV: 0.82, WI: 0.95,
  WY: 0.96, DC: 1.38,
};

// ── National wage data by occupation ─────────────────────────────────────────
// All values are annual wages in USD (BLS OES May 2024 national estimates).
// p10/p25/p75/p90 taken directly from BLS tables where published;
// otherwise estimated using published BLS percentile ratios for that SOC group.
const NATIONAL_DATA: Record<string, PercentileData> = {

  // ── Management ─────────────────────────────────────────────────────────────
  // SOC 11-0000 major group; sub-groups from BLS detailed tables
  "mgmt-executives":   { p10:  71930, p25: 107410, p50: 189520, p75: 208000, p90: 208000, mean: 196590 },
  "mgmt-operations":   { p10:  46760, p25:  70880, p50: 107360, p75: 156240, p90: 208000, mean: 122820 },
  "mgmt-financial":    { p10:  74040, p25: 101340, p50: 156100, p75: 208000, p90: 208000, mean: 174270 },
  "mgmt-marketing":    { p10:  68030, p25:  99050, p50: 158280, p75: 208000, p90: 208000, mean: 174970 },
  "mgmt-it":           { p10:  88710, p25: 121040, p50: 169510, p75: 208000, p90: 208000, mean: 176260 },
  "mgmt-hr":           { p10:  68060, p25:  93560, p50: 136350, p75: 183350, p90: 208000, mean: 147280 },
  "mgmt-healthcare":   { p10:  58060, p25:  78640, p50: 110680, p75: 155310, p90: 208000, mean: 124260 },
  "mgmt-construction": { p10:  60870, p25:  83260, p50: 103050, p75: 142930, p90: 208000, mean: 121820 },

  // ── Business & Financial Operations ────────────────────────────────────────
  // SOC 13-0000
  "biz-accounting":      { p10:  45860, p25:  58220, p50:  79880, p75: 107060, p90: 140620, mean:  87690 },
  "biz-financial":       { p10:  55000, p25:  73000, p50:  99890, p75: 140000, p90: 186000, mean: 113300 },
  "biz-consulting":      { p10:  52440, p25:  70170, p50:  95290, p75: 131000, p90: 177000, mean: 105020 },
  "biz-hr-specialist":   { p10:  38650, p25:  50430, p50:  67650, p75:  89500, p90: 117000, mean:  73130 },
  "biz-market-research": { p10:  40750, p25:  54200, p50:  74680, p75: 103220, p90: 134160, mean:  83440 },
  "biz-logistics":       { p10:  43210, p25:  58080, p50:  79380, p75: 103000, p90: 132000, mean:  84050 },

  // ── Technology ─────────────────────────────────────────────────────────────
  // SOC 15-0000
  "tech-software":    { p10:  74620, p25:  98490, p50: 127260, p75: 168000, p90: 208000, mean: 138980 },
  "tech-data":        { p10:  63000, p25:  86000, p50: 108020, p75: 141000, p90: 183000, mean: 116030 },
  "tech-security":    { p10:  64480, p25:  88450, p50: 120360, p75: 157000, p90: 196000, mean: 126280 },
  "tech-systems":     { p10:  58420, p25:  78290, p50: 102240, p75: 131000, p90: 164000, mean: 107720 },
  "tech-network":     { p10:  51200, p25:  68490, p50:  90520, p75: 116000, p90: 148000, mean:  95360 },
  "tech-ux":          { p10:  57000, p25:  77000, p50: 103000, p75: 136000, p90: 170000, mean: 109000 },
  "tech-support":     { p10:  35000, p25:  45870, p50:  59660, p75:  77000, p90: 100000, mean:  63460 },

  // ── Architecture & Engineering ─────────────────────────────────────────────
  // SOC 17-0000
  "eng-civil":        { p10:  59930, p25:  74320, p50:  95890, p75: 124270, p90: 159920, mean: 100640 },
  "eng-electrical":   { p10:  62850, p25:  82290, p50: 107390, p75: 140000, p90: 174000, mean: 114120 },
  "eng-mechanical":   { p10:  61300, p25:  78680, p50:  99510, p75: 126000, p90: 161000, mean: 104730 },
  "eng-chemical":     { p10:  65000, p25:  85000, p50: 112090, p75: 148000, p90: 187000, mean: 119380 },
  "eng-industrial":   { p10:  58670, p25:  76020, p50:  99380, p75: 126000, p90: 156000, mean: 103490 },
  "eng-aerospace":    { p10:  78000, p25: 100000, p50: 126880, p75: 161000, p90: 197000, mean: 132890 },
  "eng-architecture": { p10:  50660, p25:  66080, p50:  93310, p75: 130000, p90: 172000, mean: 100240 },

  // ── Life, Physical & Social Science ────────────────────────────────────────
  // SOC 19-0000
  "sci-life":          { p10:  42000, p25:  57000, p50:  80000, p75: 111000, p90: 148000, mean:  88420 },
  "sci-environmental": { p10:  43000, p25:  56000, p50:  76530, p75: 102000, p90: 134000, mean:  82220 },
  "sci-physical":      { p10:  48000, p25:  64000, p50:  89000, p75: 128000, p90: 172000, mean: 101440 },
  "sci-social":        { p10:  38000, p25:  52000, p50:  72000, p75: 101000, p90: 137000, mean:  80000 },

  // ── Community & Social Service ─────────────────────────────────────────────
  // SOC 21-0000
  "social-workers":    { p10:  34020, p25:  44060, p50:  58380, p75:  76000, p90:  99000, mean:  61820 },
  "social-counselors": { p10:  31000, p25:  40500, p50:  53710, p75:  70000, p90:  91000, mean:  57120 },
  "social-community":  { p10:  28000, p25:  36500, p50:  48860, p75:  62000, p90:  79000, mean:  51540 },

  // ── Legal ──────────────────────────────────────────────────────────────────
  // SOC 23-0000
  "legal-lawyers":     { p10:  61000, p25:  86000, p50: 135740, p75: 208000, p90: 208000, mean: 157200 },
  "legal-paralegals":  { p10:  37680, p25:  47990, p50:  60970, p75:  77000, p90:  99000, mean:  64220 },
  "legal-judges":      { p10:  54000, p25:  85000, p50: 143360, p75: 196000, p90: 208000, mean: 148360 },

  // ── Education ──────────────────────────────────────────────────────────────
  // SOC 25-0000
  "edu-postsecondary":  { p10:  50760, p25:  65500, p50:  84380, p75: 119000, p90: 185000, mean: 101700 },
  "edu-high-school":    { p10:  43060, p25:  53660, p50:  65220, p75:  80800, p90:  99000, mean:  68430 },
  "edu-k8":             { p10:  40000, p25:  50200, p50:  64000, p75:  78000, p90:  96000, mean:  65280 },
  "edu-special-ed":     { p10:  40600, p25:  50700, p50:  62950, p75:  78000, p90:  97000, mean:  66200 },
  "edu-early-childhood":{ p10:  22310, p25:  27000, p50:  36970, p75:  50000, p90:  64000, mean:  39710 },
  "edu-admin":          { p10:  61760, p25:  78710, p50: 101810, p75: 131000, p90: 167000, mean: 107530 },
  "edu-support":        { p10:  36000, p25:  47500, p50:  62000, p75:  79000, p90:  99000, mean:  65300 },

  // ── Arts, Design, Entertainment & Media ────────────────────────────────────
  // SOC 27-0000
  "arts-graphic-design":     { p10:  37000, p25:  48000, p50:  63000, p75:  90000, p90: 132000, mean:  73430 },
  "arts-writers":             { p10:  36000, p25:  49000, p50:  73690, p75: 107000, p90: 152000, mean:  83350 },
  "arts-media-production":   { p10:  40000, p25:  56000, p50:  80000, p75: 120000, p90: 173000, mean:  98000 },
  "arts-performing":          { p10:  25000, p25:  35000, p50:  50000, p75:  80000, p90: 123000, mean:  68200 },
  "arts-photography":         { p10:  26000, p25:  34000, p50:  48000, p75:  72000, p90: 109000, mean:  59400 },

  // ── Healthcare — Physicians & Advanced Practice ─────────────────────────────
  // SOC 29-0000 (selected sub-groups)
  "health-physicians":      { p10: 109280, p25: 165870, p50: 229300, p75: 343000, p90: 414000, mean: 267020 },
  "health-np-pa":           { p10:  89000, p25: 107000, p50: 127000, p75: 150000, p90: 174000, mean: 131260 },
  "health-dentists":        { p10:  82000, p25: 124000, p50: 162750, p75: 208000, p90: 208000, mean: 189380 },
  "health-pharmacists":     { p10:  99000, p25: 116000, p50: 136030, p75: 157000, p90: 170560, mean: 140420 },
  "health-optometrists":    { p10:  76000, p25: 100000, p50: 127410, p75: 158000, p90: 195000, mean: 133000 },
  "health-psychologists":   { p10:  47000, p25:  66000, p50:  90020, p75: 124000, p90: 160000, mean: 101200 },
  "health-veterinarians":   { p10:  68000, p25:  90000, p50: 119100, p75: 157000, p90: 208000, mean: 131000 },

  // ── Healthcare — Nursing, Therapy & Diagnostic ─────────────────────────────
  "health-rn":              { p10:  63000, p25:  74000, p50:  86480, p75: 106000, p90: 131530, mean:  92840 },
  "health-pt-ot":           { p10:  62000, p25:  77000, p50:  96000, p75: 117000, p90: 140000, mean:  97900 },
  "health-speech":          { p10:  55000, p25:  71000, p50:  90410, p75: 115000, p90: 142000, mean:  95640 },
  "health-rad-tech":        { p10:  48000, p25:  57000, p50:  70000, p75:  88000, p90: 108000, mean:  74060 },
  "health-respiratory":     { p10:  47000, p25:  58000, p50:  70540, p75:  86000, p90: 102000, mean:  73750 },
  "health-emt":             { p10:  29000, p25:  37000, p50:  49750, p75:  65000, p90:  86000, mean:  53510 },

  // ── Healthcare Support ─────────────────────────────────────────────────────
  // SOC 31-0000
  "health-medical-asst":    { p10:  31000, p25:  36000, p50:  42000, p75:  50000, p90:  61000, mean:  43730 },
  "health-home-aides":      { p10:  26000, p25:  29500, p50:  33530, p75:  39000, p90:  46000, mean:  34800 },
  "health-nursing-asst":    { p10:  29000, p25:  33000, p50:  38130, p75:  46000, p90:  55000, mean:  39710 },
  "health-phlebotomy":      { p10:  32000, p25:  36500, p50:  42000, p75:  49000, p90:  58000, mean:  43480 },

  // ── Protective Service ─────────────────────────────────────────────────────
  // SOC 33-0000
  "protective-police":      { p10:  43000, p25:  56000, p50:  70500, p75:  91000, p90: 117000, mean:  75630 },
  "protective-fire":        { p10:  35000, p25:  45000, p50:  57120, p75:  75000, p90:  97000, mean:  62060 },
  "protective-corrections": { p10:  35000, p25:  43000, p50:  52470, p75:  68000, p90:  88000, mean:  56600 },
  "protective-security":    { p10:  26000, p25:  31000, p50:  37960, p75:  49000, p90:  65000, mean:  42080 },

  // ── Food Preparation & Serving ─────────────────────────────────────────────
  // SOC 35-0000
  "food-chefs":    { p10:  36000, p25:  46000, p50:  60900, p75:  81000, p90: 107000, mean:  66170 },
  "food-cooks":    { p10:  23000, p25:  27000, p50:  35020, p75:  44000, p90:  55000, mean:  37020 },
  "food-servers":  { p10:  22000, p25:  25000, p50:  32000, p75:  42000, p90:  57000, mean:  35120 },
  "food-mgmt":     { p10:  38000, p25:  47000, p50:  63060, p75:  82000, p90: 107000, mean:  67750 },

  // ── Building & Grounds / Personal Care ────────────────────────────────────
  // SOC 37-0000
  "building-janitors":     { p10:  24000, p25:  28500, p50:  35360, p75:  46000, p90:  59000, mean:  38200 },
  "building-landscaping":  { p10:  25000, p25:  30000, p50:  38100, p75:  49000, p90:  63000, mean:  41000 },

  // SOC 39-0000
  "care-cosmetology":  { p10:  22000, p25:  27000, p50:  36870, p75:  50000, p90:  67000, mean:  40910 },
  "care-childcare":    { p10:  22000, p25:  25000, p50:  29780, p75:  36000, p90:  46000, mean:  32190 },
  "care-fitness":      { p10:  24000, p25:  32000, p50:  46480, p75:  68000, p90: 100000, mean:  55810 },
  "care-massage":      { p10:  26000, p25:  36000, p50:  52890, p75:  75000, p90: 107000, mean:  61760 },

  // ── Sales & Related ────────────────────────────────────────────────────────
  // SOC 41-0000
  "sales-retail":      { p10:  22000, p25:  26000, p50:  33210, p75:  44000, p90:  60000, mean:  38430 },
  "sales-b2b":         { p10:  41000, p25:  55000, p50:  71650, p75: 100000, p90: 141000, mean:  87450 },
  "sales-real-estate": { p10:  27000, p25:  37000, p50:  56620, p75:  91000, p90: 142000, mean:  76180 },
  "sales-insurance":   { p10:  32000, p25:  43000, p50:  57860, p75:  85000, p90: 133000, mean:  79680 },
  "sales-financial":   { p10:  40000, p25:  59000, p50:  89000, p75: 150000, p90: 208000, mean: 118950 },

  // ── Office & Administrative Support ────────────────────────────────────────
  // SOC 43-0000
  "office-admin-asst":   { p10:  31000, p25:  38000, p50:  46820, p75:  58000, p90:  72000, mean:  49550 },
  "office-customer-svc": { p10:  27000, p25:  32000, p50:  38880, p75:  48000, p90:  61000, mean:  41470 },
  "office-bookkeeping":  { p10:  31000, p25:  38500, p50:  47440, p75:  59000, p90:  72000, mean:  50270 },
  "office-receptionist": { p10:  26000, p25:  31000, p50:  37250, p75:  46000, p90:  57000, mean:  39740 },

  // ── Farming, Fishing & Forestry ────────────────────────────────────────────
  // SOC 45-0000
  "farming-crop":     { p10:  26270, p25:  30000, p50:  37000, p75:  49000, p90:  64000, mean:  40200 },
  "farming-managers": { p10:  44000, p25:  60000, p50:  78490, p75: 110000, p90: 153000, mean:  92710 },

  // ── Construction ──────────────────────────────────────────────────────────
  // SOC 47-0000
  "construction-electricians": { p10:  38000, p25:  49000, p50:  61590, p75:  80000, p90: 102000, mean:  66440 },
  "construction-plumbers":     { p10:  37000, p25:  47000, p50:  61550, p75:  83000, p90: 108000, mean:  67810 },
  "construction-carpenters":   { p10:  36000, p25:  46000, p50:  61370, p75:  82000, p90: 104000, mean:  66150 },
  "construction-hvac":         { p10:  36000, p25:  46000, p50:  57300, p75:  75000, p90:  97000, mean:  62090 },
  "construction-equipment":    { p10:  34000, p25:  43000, p50:  57660, p75:  75000, p90:  99000, mean:  62370 },
  "construction-masonry":      { p10:  35000, p25:  45000, p50:  57000, p75:  76000, p90:  99000, mean:  62540 },
  "construction-painters":     { p10:  30000, p25:  38000, p50:  48970, p75:  64000, p90:  83000, mean:  53030 },
  "construction-laborers":     { p10:  30000, p25:  38000, p50:  45600, p75:  60000, p90:  78000, mean:  50050 },

  // ── Installation, Maintenance & Repair ─────────────────────────────────────
  // SOC 49-0000
  "repair-auto":       { p10:  29000, p25:  37000, p50:  47930, p75:  63000, p90:  79000, mean:  51230 },
  "repair-industrial": { p10:  38000, p25:  48000, p50:  60750, p75:  76000, p90:  97000, mean:  63990 },
  "repair-aircraft":   { p10:  50000, p25:  63000, p50:  75620, p75:  91000, p90: 112000, mean:  79540 },
  "repair-elevator":   { p10:  62000, p25:  85000, p50:  97860, p75: 118000, p90: 148000, mean: 106530 },

  // ── Production & Manufacturing ─────────────────────────────────────────────
  // SOC 51-0000
  "production-machinists":   { p10:  33000, p25:  41000, p50:  50530, p75:  63000, p90:  80000, mean:  53340 },
  "production-welders":      { p10:  33000, p25:  40000, p50:  48770, p75:  61000, p90:  77000, mean:  51760 },
  "production-assemblers":   { p10:  28000, p25:  33000, p50:  40000, p75:  51000, p90:  64000, mean:  43140 },
  "production-operators":    { p10:  32000, p25:  40000, p50:  51000, p75:  66000, p90:  86000, mean:  56110 },
  "production-printing":     { p10:  29000, p25:  36000, p50:  44000, p75:  58000, p90:  74000, mean:  47550 },

  // ── Transportation & Material Moving ───────────────────────────────────────
  // SOC 53-0000
  "transport-pilots":    { p10:  80000, p25: 121000, p50: 171000, p75: 208000, p90: 208000, mean: 202180 },
  "transport-atc":       { p10:  67000, p25:  93000, p50: 136190, p75: 172000, p90: 208000, mean: 140970 },
  "transport-truck":     { p10:  37000, p25:  43000, p50:  51220, p75:  63000, p90:  79000, mean:  54000 },
  "transport-delivery":  { p10:  30000, p25:  36000, p50:  43710, p75:  55000, p90:  69000, mean:  46410 },
  "transport-transit":   { p10:  36000, p25:  45000, p50:  56000, p75:  73000, p90:  93000, mean:  60920 },
  "transport-rail":      { p10:  52000, p25:  66000, p50:  82790, p75: 100000, p90: 120000, mean:  84900 },
  "transport-ship":      { p10:  52000, p25:  68000, p50:  99670, p75: 138000, p90: 179000, mean: 110000 },
};

// ── Grouped categories (for <optgroup> rendering) ──────────────────────────────
export const JOB_CATEGORY_GROUPS: { group: string; categories: { value: string; label: string }[] }[] = [
  {
    group: "Management",
    categories: [
      { value: "mgmt-executives",   label: "Top Executives & CEOs" },
      { value: "mgmt-operations",   label: "General & Operations Managers" },
      { value: "mgmt-financial",    label: "Financial Managers" },
      { value: "mgmt-marketing",    label: "Marketing & Sales Managers" },
      { value: "mgmt-it",           label: "IT & Technology Managers" },
      { value: "mgmt-hr",           label: "Human Resources Managers" },
      { value: "mgmt-healthcare",   label: "Healthcare & Medical Managers" },
      { value: "mgmt-construction", label: "Construction & Facilities Managers" },
    ],
  },
  {
    group: "Business & Finance",
    categories: [
      { value: "biz-accounting",      label: "Accountants & Auditors" },
      { value: "biz-financial",       label: "Financial Analysts & Advisors" },
      { value: "biz-consulting",      label: "Management Consultants & Analysts" },
      { value: "biz-hr-specialist",   label: "HR Specialists & Recruiters" },
      { value: "biz-market-research", label: "Market Research & Data Analysts" },
      { value: "biz-logistics",       label: "Logistics, Supply Chain & Purchasing" },
    ],
  },
  {
    group: "Technology",
    categories: [
      { value: "tech-software",  label: "Software Developers & Engineers" },
      { value: "tech-data",      label: "Data Scientists & ML Engineers" },
      { value: "tech-security",  label: "Cybersecurity & Information Security" },
      { value: "tech-systems",   label: "Computer & Business Systems Analysts" },
      { value: "tech-network",   label: "Network & Systems Administrators" },
      { value: "tech-ux",        label: "UX/UI Designers & Product Designers" },
      { value: "tech-support",   label: "IT Support Specialists & Technicians" },
    ],
  },
  {
    group: "Engineering",
    categories: [
      { value: "eng-civil",        label: "Civil & Structural Engineers" },
      { value: "eng-electrical",   label: "Electrical & Electronics Engineers" },
      { value: "eng-mechanical",   label: "Mechanical Engineers" },
      { value: "eng-chemical",     label: "Chemical Engineers" },
      { value: "eng-industrial",   label: "Industrial & Manufacturing Engineers" },
      { value: "eng-aerospace",    label: "Aerospace Engineers" },
      { value: "eng-architecture", label: "Architects & Urban Planners" },
    ],
  },
  {
    group: "Science",
    categories: [
      { value: "sci-life",          label: "Biologists & Life Scientists" },
      { value: "sci-environmental", label: "Environmental & Geoscientists" },
      { value: "sci-physical",      label: "Chemists, Physicists & Material Scientists" },
      { value: "sci-social",        label: "Economists, Psychologists & Social Scientists" },
    ],
  },
  {
    group: "Social Services",
    categories: [
      { value: "social-workers",    label: "Social Workers" },
      { value: "social-counselors", label: "Mental Health & Substance Abuse Counselors" },
      { value: "social-community",  label: "Community Health & Social Service Workers" },
    ],
  },
  {
    group: "Legal",
    categories: [
      { value: "legal-lawyers",    label: "Lawyers & Attorneys" },
      { value: "legal-paralegals", label: "Paralegals & Legal Assistants" },
      { value: "legal-judges",     label: "Judges, Hearing Officers & Magistrates" },
    ],
  },
  {
    group: "Education",
    categories: [
      { value: "edu-postsecondary",   label: "Postsecondary Professors & Lecturers" },
      { value: "edu-high-school",     label: "High School Teachers" },
      { value: "edu-k8",              label: "Elementary & Middle School Teachers" },
      { value: "edu-special-ed",      label: "Special Education Teachers" },
      { value: "edu-early-childhood", label: "Preschool & Early Childhood Teachers" },
      { value: "edu-admin",           label: "Education Administrators & Principals" },
      { value: "edu-support",         label: "School Counselors & Instructional Coordinators" },
    ],
  },
  {
    group: "Arts, Media & Communications",
    categories: [
      { value: "arts-graphic-design",   label: "Graphic Designers & Art Directors" },
      { value: "arts-writers",          label: "Writers, Authors & Journalists" },
      { value: "arts-media-production", label: "Film & TV Producers, Directors & Editors" },
      { value: "arts-performing",       label: "Musicians, Actors & Performing Artists" },
      { value: "arts-photography",      label: "Photographers & Videographers" },
    ],
  },
  {
    group: "Healthcare: Physicians & Advanced Practice",
    categories: [
      { value: "health-physicians",   label: "Physicians & Surgeons" },
      { value: "health-np-pa",        label: "Nurse Practitioners & Physician Assistants" },
      { value: "health-dentists",     label: "Dentists & Orthodontists" },
      { value: "health-pharmacists",  label: "Pharmacists" },
      { value: "health-optometrists", label: "Optometrists" },
      { value: "health-psychologists",label: "Clinical Psychologists" },
      { value: "health-veterinarians",label: "Veterinarians" },
    ],
  },
  {
    group: "Healthcare: Nursing, Therapy & Diagnostic",
    categories: [
      { value: "health-rn",          label: "Registered Nurses" },
      { value: "health-pt-ot",       label: "Physical & Occupational Therapists" },
      { value: "health-speech",      label: "Speech-Language Pathologists" },
      { value: "health-rad-tech",    label: "Radiologic & Diagnostic Technologists" },
      { value: "health-respiratory", label: "Respiratory Therapists" },
      { value: "health-emt",         label: "EMTs & Paramedics" },
    ],
  },
  {
    group: "Healthcare Support",
    categories: [
      { value: "health-medical-asst", label: "Medical & Dental Assistants" },
      { value: "health-home-aides",   label: "Home Health & Personal Care Aides" },
      { value: "health-nursing-asst", label: "Nursing Assistants & Orderlies" },
      { value: "health-phlebotomy",   label: "Phlebotomists & Lab Technicians" },
    ],
  },
  {
    group: "Protective Service",
    categories: [
      { value: "protective-police",      label: "Police Officers & Detectives" },
      { value: "protective-fire",        label: "Firefighters & Fire Prevention" },
      { value: "protective-corrections", label: "Correctional Officers" },
      { value: "protective-security",    label: "Security Guards & Surveillance" },
    ],
  },
  {
    group: "Food Service",
    categories: [
      { value: "food-mgmt",    label: "Food Service Managers" },
      { value: "food-chefs",   label: "Chefs & Head Cooks" },
      { value: "food-cooks",   label: "Cooks & Kitchen Workers" },
      { value: "food-servers", label: "Waitstaff, Bartenders & Counter Workers" },
    ],
  },
  {
    group: "Building, Grounds & Personal Care",
    categories: [
      { value: "building-janitors",    label: "Janitors, Maids & Building Cleaners" },
      { value: "building-landscaping", label: "Landscapers & Groundskeeping Workers" },
      { value: "care-cosmetology",     label: "Hairdressers, Stylists & Cosmetologists" },
      { value: "care-childcare",       label: "Childcare Workers" },
      { value: "care-fitness",         label: "Fitness Trainers & Recreational Workers" },
      { value: "care-massage",         label: "Massage Therapists" },
    ],
  },
  {
    group: "Sales",
    categories: [
      { value: "sales-retail",     label: "Retail Salespersons" },
      { value: "sales-b2b",        label: "Sales Representatives (B2B / Wholesale)" },
      { value: "sales-real-estate",label: "Real Estate Agents & Brokers" },
      { value: "sales-insurance",  label: "Insurance Sales Agents" },
      { value: "sales-financial",  label: "Financial Services & Securities Sales" },
    ],
  },
  {
    group: "Office & Administrative Support",
    categories: [
      { value: "office-admin-asst",   label: "Administrative Assistants & Secretaries" },
      { value: "office-customer-svc", label: "Customer Service Representatives" },
      { value: "office-bookkeeping",  label: "Bookkeepers & Accounting Clerks" },
      { value: "office-receptionist", label: "Receptionists & Information Clerks" },
    ],
  },
  {
    group: "Farming, Fishing & Forestry",
    categories: [
      { value: "farming-crop",     label: "Agricultural & Farm Workers" },
      { value: "farming-managers", label: "Farmers, Ranchers & Agricultural Managers" },
    ],
  },
  {
    group: "Construction",
    categories: [
      { value: "construction-electricians", label: "Electricians" },
      { value: "construction-plumbers",     label: "Plumbers, Pipefitters & Gas Fitters" },
      { value: "construction-carpenters",   label: "Carpenters" },
      { value: "construction-hvac",         label: "HVAC Technicians" },
      { value: "construction-equipment",    label: "Construction Equipment Operators" },
      { value: "construction-masonry",      label: "Masons, Roofers & Sheet Metal Workers" },
      { value: "construction-painters",     label: "Painters & Construction Finishers" },
      { value: "construction-laborers",     label: "Construction Laborers & Helpers" },
    ],
  },
  {
    group: "Installation, Maintenance & Repair",
    categories: [
      { value: "repair-auto",       label: "Automotive Service Technicians & Mechanics" },
      { value: "repair-industrial", label: "Industrial & Commercial Machinery Mechanics" },
      { value: "repair-aircraft",   label: "Aircraft Mechanics & Avionics Technicians" },
      { value: "repair-elevator",   label: "Elevator & Escalator Installers & Repairers" },
    ],
  },
  {
    group: "Production & Manufacturing",
    categories: [
      { value: "production-machinists", label: "Machinists & Metal Workers" },
      { value: "production-welders",    label: "Welders, Cutters & Fabricators" },
      { value: "production-assemblers", label: "Assemblers & Fabricators" },
      { value: "production-operators",  label: "Plant & Machine Operators" },
      { value: "production-printing",   label: "Printing & Bindery Workers" },
    ],
  },
  {
    group: "Transportation",
    categories: [
      { value: "transport-pilots",   label: "Airline Pilots & Flight Crew" },
      { value: "transport-atc",      label: "Air Traffic Controllers" },
      { value: "transport-truck",    label: "Heavy Truck & Tractor-Trailer Drivers" },
      { value: "transport-delivery", label: "Delivery & Light Truck Drivers" },
      { value: "transport-transit",  label: "Bus Drivers & School Bus Drivers" },
      { value: "transport-rail",     label: "Rail & Subway Operators" },
      { value: "transport-ship",     label: "Ship Captains, Sailors & Marine Workers" },
    ],
  },
];

// Flat list derived from groups — used for category label lookup and form rendering
export const JOB_CATEGORIES: { value: string; label: string }[] =
  JOB_CATEGORY_GROUPS.flatMap((g) => g.categories);

// ── Helpers ───────────────────────────────────────────────────────────────────
function scalePercentileData(data: PercentileData, multiplier: number): PercentileData {
  return {
    p10:  Math.round(data.p10  * multiplier),
    p25:  Math.round(data.p25  * multiplier),
    p50:  Math.round(data.p50  * multiplier),
    p75:  Math.round(data.p75  * multiplier),
    p90:  Math.round(data.p90  * multiplier),
    mean: Math.round(data.mean * multiplier),
  };
}

export function getOccupationData(
  category: string,
  state: string
): { national: PercentileData; state: PercentileData } {
  const nat = NATIONAL_DATA[category] ?? NATIONAL_DATA["office-admin-asst"];
  const multiplier = STATE_WAGE_MULTIPLIERS[state] ?? 1.0;
  return { national: nat, state: scalePercentileData(nat, multiplier) };
}

// Linear interpolation between BLS anchor percentile points
export function getStateOverallMedian(state: string): number {
  const multiplier = STATE_WAGE_MULTIPLIERS[state] ?? 1.0;
  return Math.round(49500 * multiplier);
}

export function estimatePercentile(salary: number, data: PercentileData): number {
  const { p10, p25, p50, p75, p90 } = data;

  if (salary <= p10) {
    return Math.max(1, Math.round((salary / p10) * 10));
  }
  if (salary >= p90) {
    const upperBound = p90 * 1.6;
    if (salary >= upperBound) return 99;
    return Math.min(99, Math.round(90 + ((salary - p90) / (upperBound - p90)) * 9));
  }

  const segments: [number, number, number, number][] = [
    [p10, p25, 10, 25],
    [p25, p50, 25, 50],
    [p50, p75, 50, 75],
    [p75, p90, 75, 90],
  ];
  for (const [w0, w1, pct0, pct1] of segments) {
    if (salary >= w0 && salary <= w1) {
      return Math.round(pct0 + ((salary - w0) / (w1 - w0)) * (pct1 - pct0));
    }
  }
  return 50;
}
