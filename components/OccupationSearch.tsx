"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOB_CATEGORIES } from "@/lib/blsData";
import { SLUG_BY_KEY } from "@/lib/slugs";

function findSlug(query: string): string | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  // Priority: starts-with label word, then any contains match
  for (const cat of JOB_CATEGORIES) {
    const label = cat.label.toLowerCase();
    if (label.startsWith(q)) return SLUG_BY_KEY[cat.value] ?? null;
  }
  for (const cat of JOB_CATEGORIES) {
    if (cat.label.toLowerCase().includes(q)) return SLUG_BY_KEY[cat.value] ?? null;
  }
  return null;
}

export default function OccupationSearch() {
  const [query, setQuery] = useState("");
  const [noMatch, setNoMatch] = useState(false);
  const router = useRouter();

  function handleGo() {
    const slug = findSlug(query);
    if (slug) {
      router.push(`/salary/${slug}`);
    } else {
      setNoMatch(true);
      setTimeout(() => setNoMatch(false), 2500);
    }
  }

  return (
    <div
      className="glass rounded-2xl px-8 py-6 max-w-lg w-full mt-4"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">
        Search Occupations
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setNoMatch(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleGo()}
          placeholder="Search occupations…"
          className="input-glass flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600"
        />
        <button
          onClick={handleGo}
          className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap"
        >
          Go →
        </button>
      </div>
      {noMatch && (
        <p className="text-xs text-slate-500 mt-2">
          No match found — try a keyword like &ldquo;nurse&rdquo;, &ldquo;software&rdquo;, or &ldquo;teacher&rdquo;.
        </p>
      )}
    </div>
  );
}
