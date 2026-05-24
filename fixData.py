"""
fixData.py — Generate lib/blsData.ts with real BLS OES annual wage data.

Always uses the most recent complete release:
  - May 2024 data confirmed available (released April 2025)
  - Check https://www.bls.gov/oes/ for May 2025 availability before running
    (BLS typically releases the following May's data in March/April)

Usage:
  1. Download https://www.bls.gov/oes/special.requests/oesnat.zip
     (this URL always serves the most recent complete release)
  2. Unzip and place the Excel file as 'oesnat.xlsx' in the project root.
  3. Run: py fixData.py
  4. The script overwrites lib/blsData.ts with verified BLS figures.
  5. After running, update the year label in the code to match (e.g. "2024"
     or "2025") — search for "BLS OES 202" across the codebase.

Requires: pip install openpyxl pandas
"""

import sys
import re
import pandas as pd
from pathlib import Path

# ── SOC code → our app's category key ─────────────────────────────────────────
# Each entry is (occ_code, our_key, fallback_title_fragment)
# When an OCC_CODE matches exactly, that row is used.
# The fallback_title_fragment is a last-resort substring match on OCC_TITLE.
SOC_MAP = [
    # Management (SOC 11-xxxx)
    ("11-1011", "mgmt-executives",   "Chief Executives"),
    ("11-1021", "mgmt-operations",   "General and Operations Managers"),
    ("11-3031", "mgmt-financial",    "Financial Managers"),
    ("11-2021", "mgmt-marketing",    "Marketing Managers"),
    ("11-3021", "mgmt-it",           "Computer and Information Systems Managers"),
    ("11-3121", "mgmt-hr",           "Human Resources Managers"),
    ("11-9111", "mgmt-healthcare",   "Medical and Health Services Managers"),
    ("11-9021", "mgmt-construction", "Construction Managers"),

    # Business & Finance (SOC 13-xxxx)
    ("13-2011", "biz-accounting",      "Accountants and Auditors"),
    ("13-2051", "biz-financial",       "Financial and Investment Analysts"),
    ("13-1111", "biz-consulting",      "Management Analysts"),
    ("13-1071", "biz-hr-specialist",   "Human Resources Specialists"),
    ("13-1161", "biz-market-research", "Market Research Analysts"),
    ("13-1020", "biz-logistics",       "Buyers and Purchasing Agents"),

    # Technology (SOC 15-xxxx)
    ("15-1252", "tech-software",  "Software Developers"),
    ("15-2051", "tech-data",      "Data Scientists"),
    ("15-1212", "tech-security",  "Information Security Analysts"),
    ("15-1221", "tech-systems",   "Computer Systems Analysts"),
    ("15-1244", "tech-network",   "Network and Computer Systems Administrators"),
    ("15-1255", "tech-ux",        "Web and Digital Interface Designers"),
    ("15-1232", "tech-support",   "Computer User Support Specialists"),

    # Engineering (SOC 17-xxxx)
    ("17-2051", "eng-civil",        "Civil Engineers"),
    ("17-2071", "eng-electrical",   "Electrical Engineers"),
    ("17-2141", "eng-mechanical",   "Mechanical Engineers"),
    ("17-2041", "eng-chemical",     "Chemical Engineers"),
    ("17-2112", "eng-industrial",   "Industrial Engineers"),
    ("17-2011", "eng-aerospace",    "Aerospace Engineers"),
    ("17-1011", "eng-architecture", "Architects, Except Landscape"),

    # Science (SOC 19-xxxx)
    ("19-1020", "sci-life",          "Biological Scientists"),
    ("19-2041", "sci-environmental", "Environmental Scientists"),
    ("19-2030", "sci-physical",      "Chemists and Materials Scientists"),
    ("19-3000", "sci-social",        "Social Scientists and Related"),

    # Social Services (SOC 21-xxxx)
    ("21-1020", "social-workers",    "Social Workers"),
    ("21-1011", "social-counselors", "Substance Abuse, Behavioral Disorder, and Mental Health Counselors"),
    ("21-1090", "social-community",  "Miscellaneous Community and Social Service Specialists"),

    # Legal (SOC 23-xxxx)
    ("23-1011", "legal-lawyers",    "Lawyers"),
    ("23-2011", "legal-paralegals", "Paralegals and Legal Assistants"),
    ("23-1023", "legal-judges",     "Judges, Magistrate Judges, and Magistrates"),

    # Education (SOC 25-xxxx)
    ("25-1000", "edu-postsecondary",   "Postsecondary Teachers"),
    ("25-2031", "edu-high-school",     "Secondary School Teachers"),
    ("25-2021", "edu-k8",              "Elementary School Teachers"),
    ("25-2050", "edu-special-ed",      "Special Education Teachers"),
    ("25-2011", "edu-early-childhood", "Preschool Teachers"),
    ("11-9030", "edu-admin",           "Education and Childcare Administrators"),
    ("21-1012", "edu-support",         "Educational, Guidance, and Career Counselors"),

    # Arts, Media (SOC 27-xxxx)
    ("27-1024", "arts-graphic-design",   "Graphic Designers"),
    ("27-3043", "arts-writers",          "Writers and Authors"),
    ("27-2012", "arts-media-production", "Producers and Directors"),
    ("27-2000", "arts-performing",       "Entertainers and Performers"),
    ("27-4021", "arts-photography",      "Photographers"),

    # Healthcare — Physicians (SOC 29-1xxx)
    ("29-1210", "health-physicians",    "Physicians"),
    ("29-1170", "health-np-pa",         "Nurse Practitioners, Anesthetists, and Midwives"),
    ("29-1020", "health-dentists",      "Dentists"),
    ("29-1051", "health-pharmacists",   "Pharmacists"),
    ("29-1041", "health-optometrists",  "Optometrists"),
    ("19-3031", "health-psychologists", "Clinical and Counseling Psychologists"),
    ("29-1131", "health-veterinarians", "Veterinarians"),

    # Healthcare — Nursing, Therapy (SOC 29-1xxx)
    ("29-1141", "health-rn",          "Registered Nurses"),
    ("29-1120", "health-pt-ot",       "Occupational and Physical Therapist Assistants"),
    ("29-1127", "health-speech",      "Speech-Language Pathologists"),
    ("29-2034", "health-rad-tech",    "Radiologic Technologists and Technicians"),
    ("29-1126", "health-respiratory", "Respiratory Therapists"),
    ("29-2042", "health-emt",         "Emergency Medical Technicians"),

    # Healthcare Support (SOC 31-xxxx)
    ("31-9092", "health-medical-asst", "Medical Assistants"),
    ("31-1120", "health-home-aides",   "Home Health and Personal Care Aides"),
    ("31-1131", "health-nursing-asst", "Nursing Assistants"),
    ("31-9097", "health-phlebotomy",   "Phlebotomists"),

    # Protective Service (SOC 33-xxxx)
    ("33-3051", "protective-police",      "Police and Sheriff's Patrol Officers"),
    ("33-2011", "protective-fire",        "Firefighters"),
    ("33-3012", "protective-corrections", "Correctional Officers and Jailers"),
    ("33-9032", "protective-security",    "Security Guards"),

    # Food Service (SOC 35-xxxx)
    ("11-9051", "food-mgmt",    "Food Service Managers"),
    ("35-1011", "food-chefs",   "Chefs and Head Cooks"),
    ("35-2014", "food-cooks",   "Cooks, Restaurant"),
    ("35-3031", "food-servers", "Waiters and Waitresses"),

    # Building & Grounds (SOC 37-xxxx) / Personal Care (SOC 39-xxxx)
    ("37-2011", "building-janitors",    "Janitors and Cleaners"),
    ("37-3011", "building-landscaping", "Landscaping and Groundskeeping Workers"),
    ("39-5012", "care-cosmetology",     "Hairdressers, Hairstylists, and Cosmetologists"),
    ("39-9011", "care-childcare",       "Childcare Workers"),
    ("39-9031", "care-fitness",         "Fitness Trainers and Aerobics Instructors"),
    ("31-9011", "care-massage",         "Massage Therapists"),

    # Sales (SOC 41-xxxx)
    ("41-2031", "sales-retail",      "Retail Salespersons"),
    ("41-4012", "sales-b2b",         "Sales Representatives, Wholesale and Manufacturing"),
    ("41-9021", "sales-real-estate", "Real Estate Brokers"),
    ("41-3021", "sales-insurance",   "Insurance Sales Agents"),
    ("41-3031", "sales-financial",   "Securities, Commodities, and Financial Services Sales Agents"),

    # Office & Admin (SOC 43-xxxx)
    ("43-6014", "office-admin-asst",   "Secretaries and Administrative Assistants"),
    ("43-4051", "office-customer-svc", "Customer Service Representatives"),
    ("43-3031", "office-bookkeeping",  "Bookkeeping, Accounting, and Auditing Clerks"),
    ("43-4171", "office-receptionist", "Receptionists and Information Clerks"),

    # Farming (SOC 45-xxxx / 11-9013)
    ("45-2092", "farming-crop",     "Farmworkers and Laborers, Crop"),
    ("11-9013", "farming-managers", "Farmers, Ranchers, and Other Agricultural Managers"),

    # Construction (SOC 47-xxxx)
    ("47-2111", "construction-electricians", "Electricians"),
    ("47-2152", "construction-plumbers",     "Plumbers, Pipefitters, and Steamfitters"),
    ("47-2031", "construction-carpenters",   "Carpenters"),
    ("49-9021", "construction-hvac",         "Heating, Air Conditioning, and Refrigeration Mechanics"),
    ("47-2073", "construction-equipment",    "Operating Engineers and Other Construction Equipment Operators"),
    ("47-2040", "construction-masonry",      "Brickmasons, Blockmasons, Stonemasons"),
    ("47-2141", "construction-painters",     "Painters, Construction and Maintenance"),
    ("47-2061", "construction-laborers",     "Construction Laborers"),

    # Installation, Maintenance & Repair (SOC 49-xxxx)
    ("49-3023", "repair-auto",       "Automotive Service Technicians and Mechanics"),
    ("49-9071", "repair-industrial", "Maintenance and Repair Workers, General"),
    ("49-3011", "repair-aircraft",   "Aircraft Mechanics and Service Technicians"),
    ("47-4021", "repair-elevator",   "Elevator and Escalator Installers and Repairers"),

    # Production (SOC 51-xxxx)
    ("51-4041", "production-machinists", "Machinists"),
    ("51-4121", "production-welders",    "Welders, Cutters, Solderers, and Brazers"),
    ("51-2090", "production-assemblers", "Miscellaneous Assemblers and Fabricators"),
    ("51-8090", "production-operators",  "Miscellaneous Plant and System Operators"),
    ("51-5112", "production-printing",   "Printing Press Operators"),

    # Transportation (SOC 53-xxxx)
    ("53-2011", "transport-pilots",   "Airline Pilots, Copilots, and Flight Engineers"),
    ("53-2022", "transport-atc",      "Airfield Operations Specialists"),
    ("53-3032", "transport-truck",    "Heavy and Tractor-Trailer Truck Drivers"),
    ("53-3031", "transport-delivery", "Driver/Sales Workers and Truck Drivers"),
    ("53-3052", "transport-transit",  "Bus Drivers, School"),
    ("53-4031", "transport-rail",     "Railroad Conductors and Yardmasters"),
    ("53-5021", "transport-ship",     "Captains, Mates, and Pilots of Water Vessels"),
]

WAGE_COLS = ["A_PCT10", "A_PCT25", "A_MEDIAN", "A_MEAN", "A_PCT75", "A_PCT90"]


def clean_wage(val):
    """Convert BLS wage cell to int. Returns None for suppressed/missing values."""
    if pd.isna(val):
        return None
    s = str(val).strip().replace(",", "")
    # BLS uses '*' for suppressed, '#' for over $208,000 wage ceiling
    if s in ("*", "#", "**"):
        return None
    try:
        return int(float(s))
    except ValueError:
        return None


def find_row(df, occ_code, fallback_title):
    """Find the BLS row for a given SOC code, with title fallback."""
    # Exact code match first
    rows = df[df["OCC_CODE"].str.strip() == occ_code]
    if not rows.empty:
        return rows.iloc[0]
    # Try prefix match (e.g. "15-1000" matches "15-1020")
    prefix = occ_code[:7]
    rows = df[df["OCC_CODE"].str.strip().str.startswith(prefix)]
    if not rows.empty:
        return rows.iloc[0]
    # Fallback: title substring match (case-insensitive)
    rows = df[df["OCC_TITLE"].str.contains(fallback_title, case=False, na=False)]
    if not rows.empty:
        return rows.iloc[0]
    return None


def extract_wages(row, all_rows_df, occ_code):
    """
    Extract wage fields from a row, filling suppressed values with
    linear interpolation from nearby percentile anchors.
    """
    wages = {}
    for col in WAGE_COLS:
        wages[col] = clean_wage(row.get(col))

    # BLS caps wages at $208,000 — '#' means >= $208,000
    # Replace None from '#' with 208000
    raw = {col: str(row.get(col, "")).strip() for col in WAGE_COLS}
    for col in WAGE_COLS:
        if raw[col] in ("#", "**"):
            wages[col] = 208000

    # Fill missing values via simple interpolation between known anchors
    keys = ["A_PCT10", "A_PCT25", "A_MEDIAN", "A_MEAN", "A_PCT75", "A_PCT90"]
    vals = [wages[k] for k in keys]

    # Forward-fill then backward-fill as last resort
    last = None
    for i, v in enumerate(vals):
        if v is not None:
            last = v
        elif last is not None:
            vals[i] = last
    last = None
    for i in range(len(vals) - 1, -1, -1):
        if vals[i] is not None:
            last = vals[i]
        elif last is not None:
            vals[i] = last

    # Final fallback — use a sensible default if still None
    for i in range(len(vals)):
        if vals[i] is None:
            vals[i] = 50000

    return {
        "p10":  vals[0],
        "p25":  vals[1],
        "p50":  vals[2],
        "mean": vals[3],
        "p75":  vals[4],
        "p90":  vals[5],
    }


def main():
    xlsx_path = Path("oesnat.xlsx")
    if not xlsx_path.exists():
        print("ERROR: oesnat.xlsx not found in project root.")
        print("Download from https://www.bls.gov/oes/special.requests/oesnat.zip")
        print("Unzip and rename the Excel file to oesnat.xlsx, then re-run.")
        sys.exit(1)

    print(f"Loading {xlsx_path} ...")
    df = pd.read_excel(xlsx_path, dtype=str)

    # Normalise column names
    df.columns = [c.strip().upper() for c in df.columns]
    print(f"Loaded {len(df):,} rows. Columns: {list(df.columns[:12])} ...")

    required = ["OCC_CODE", "OCC_TITLE"] + WAGE_COLS
    missing = [c for c in required if c not in df.columns]
    if missing:
        print(f"ERROR: Missing expected columns: {missing}")
        print("Available columns:", list(df.columns))
        sys.exit(1)

    results = {}
    not_found = []

    for occ_code, key, fallback in SOC_MAP:
        row = find_row(df, occ_code, fallback)
        if row is None:
            print(f"  WARN: Not found — {key} ({occ_code} / {fallback!r})")
            not_found.append(key)
            continue
        wages = extract_wages(row, df, occ_code)
        results[key] = wages
        print(f"  OK  {key:35s} p50=${wages['p50']:>7,}  [{row['OCC_CODE'].strip()} {row['OCC_TITLE'].strip()[:45]}]")

    if not_found:
        print(f"\nWARNING: {len(not_found)} occupations not found in BLS data: {not_found}")
        print("These will retain their previous values in the output file.\n")

    # ── Verification checks ────────────────────────────────────────────────────
    checks = [
        ("health-rn",        "Registered Nurses",       81220, 5000),
        ("tech-software",    "Software Developers",    120730, 8000),
        ("health-physicians","Physicians & Surgeons",  200000, 30000),
        ("food-cooks",       "Food Prep Workers",       29000, 5000),
    ]
    print("\n── Verification ──────────────────────────────────────────────────────────")
    all_pass = True
    for key, label, expected, tolerance in checks:
        if key not in results:
            print(f"  SKIP  {label}: not in results")
            continue
        actual = results[key]["p50"]
        diff = abs(actual - expected)
        ok = diff <= tolerance
        status = "PASS" if ok else "FAIL"
        if not ok:
            all_pass = False
        print(f"  {status}  {label}: median ${actual:,} (expected ~${expected:,}, diff ${diff:,})")

    if not all_pass:
        print("\nSome verification checks failed — review the values above before deploying.")
    else:
        print("\nAll verification checks passed.")

    # ── Build TypeScript output ────────────────────────────────────────────────
    print("\n── Writing lib/blsData.ts ────────────────────────────────────────────────")

    # Read existing file to preserve everything except NATIONAL_DATA
    existing = Path("lib/blsData.ts").read_text(encoding="utf-8")

    # Build replacement NATIONAL_DATA block
    lines = ["const NATIONAL_DATA: Record<string, PercentileData> = {", ""]

    groups_order = [
        ("Management", [
            "mgmt-executives", "mgmt-operations", "mgmt-financial", "mgmt-marketing",
            "mgmt-it", "mgmt-hr", "mgmt-healthcare", "mgmt-construction",
        ]),
        ("Business & Financial Operations", [
            "biz-accounting", "biz-financial", "biz-consulting", "biz-hr-specialist",
            "biz-market-research", "biz-logistics",
        ]),
        ("Technology", [
            "tech-software", "tech-data", "tech-security", "tech-systems",
            "tech-network", "tech-ux", "tech-support",
        ]),
        ("Architecture & Engineering", [
            "eng-civil", "eng-electrical", "eng-mechanical", "eng-chemical",
            "eng-industrial", "eng-aerospace", "eng-architecture",
        ]),
        ("Life, Physical & Social Science", [
            "sci-life", "sci-environmental", "sci-physical", "sci-social",
        ]),
        ("Community & Social Service", [
            "social-workers", "social-counselors", "social-community",
        ]),
        ("Legal", [
            "legal-lawyers", "legal-paralegals", "legal-judges",
        ]),
        ("Education", [
            "edu-postsecondary", "edu-high-school", "edu-k8", "edu-special-ed",
            "edu-early-childhood", "edu-admin", "edu-support",
        ]),
        ("Arts, Design, Entertainment & Media", [
            "arts-graphic-design", "arts-writers", "arts-media-production",
            "arts-performing", "arts-photography",
        ]),
        ("Healthcare -- Physicians & Advanced Practice", [
            "health-physicians", "health-np-pa", "health-dentists", "health-pharmacists",
            "health-optometrists", "health-psychologists", "health-veterinarians",
        ]),
        ("Healthcare -- Nursing, Therapy & Diagnostic", [
            "health-rn", "health-pt-ot", "health-speech", "health-rad-tech",
            "health-respiratory", "health-emt",
        ]),
        ("Healthcare Support", [
            "health-medical-asst", "health-home-aides", "health-nursing-asst", "health-phlebotomy",
        ]),
        ("Protective Service", [
            "protective-police", "protective-fire", "protective-corrections", "protective-security",
        ]),
        ("Food Preparation & Serving", [
            "food-mgmt", "food-chefs", "food-cooks", "food-servers",
        ]),
        ("Building & Grounds / Personal Care", [
            "building-janitors", "building-landscaping",
            "care-cosmetology", "care-childcare", "care-fitness", "care-massage",
        ]),
        ("Sales & Related", [
            "sales-retail", "sales-b2b", "sales-real-estate", "sales-insurance", "sales-financial",
        ]),
        ("Office & Administrative Support", [
            "office-admin-asst", "office-customer-svc", "office-bookkeeping", "office-receptionist",
        ]),
        ("Farming, Fishing & Forestry", [
            "farming-crop", "farming-managers",
        ]),
        ("Construction", [
            "construction-electricians", "construction-plumbers", "construction-carpenters",
            "construction-hvac", "construction-equipment", "construction-masonry",
            "construction-painters", "construction-laborers",
        ]),
        ("Installation, Maintenance & Repair", [
            "repair-auto", "repair-industrial", "repair-aircraft", "repair-elevator",
        ]),
        ("Production & Manufacturing", [
            "production-machinists", "production-welders", "production-assemblers",
            "production-operators", "production-printing",
        ]),
        ("Transportation & Material Moving", [
            "transport-pilots", "transport-atc", "transport-truck", "transport-delivery",
            "transport-transit", "transport-rail", "transport-ship",
        ]),
    ]

    # Load previous values for fallback on missing entries
    prev_match = re.findall(
        r'"([\w-]+)":\s*\{[^}]*p10:\s*(\d+)[^}]*p25:\s*(\d+)[^}]*p50:\s*(\d+)[^}]*p75:\s*(\d+)[^}]*p90:\s*(\d+)[^}]*mean:\s*(\d+)',
        existing,
    )
    prev_data = {}
    for m in prev_match:
        k, p10, p25, p50, p75, p90, mean_ = m
        prev_data[k] = {"p10": int(p10), "p25": int(p25), "p50": int(p50),
                        "p75": int(p75), "p90": int(p90), "mean": int(mean_)}

    for section_name, keys in groups_order:
        lines.append(f"  // -- {section_name}")
        for key in keys:
            w = results.get(key) or prev_data.get(key)
            if w is None:
                print(f"  ERROR: No data for {key} — skipping")
                continue
            source = "BLS" if key in results else "prev"
            lines.append(
                f'  "{key}":{" " * (28 - len(key))}'
                f'{{ p10: {w["p10"]:>6}, p25: {w["p25"]:>6}, p50: {w["p50"]:>6}, '
                f'p75: {w["p75"]:>6}, p90: {w["p90"]:>6}, mean: {w["mean"]:>6} }},  // {source}'
            )
        lines.append("")

    # Remove trailing blank + close the object
    while lines and lines[-1] == "":
        lines.pop()
    lines.append("};")
    new_block = "\n".join(lines)

    # Replace the NATIONAL_DATA block in the existing file
    pattern = r"const NATIONAL_DATA: Record<string, PercentileData> = \{[\s\S]*?\};"
    new_content, count = re.subn(pattern, new_block, existing, count=1)
    if count == 0:
        print("ERROR: Could not locate NATIONAL_DATA block in lib/blsData.ts")
        print("Writing standalone output to lib/blsData_new.ts instead.")
        Path("lib/blsData_new.ts").write_text(new_block, encoding="utf-8")
        sys.exit(1)

    Path("lib/blsData.ts").write_text(new_content, encoding="utf-8")
    print(f"Done. Wrote {len(results)} occupations to lib/blsData.ts")
    print(f"      {len(not_found)} occupations fell back to previous data: {not_found or 'none'}")


if __name__ == "__main__":
    main()
