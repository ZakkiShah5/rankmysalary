"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface Category { value: string; label: string }
interface Group { group: string; categories: Category[] }

interface Props {
  groups: Group[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const re = new RegExp(`(${escapeRe(query)})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark key={i} className="bg-blue-500/30 text-blue-300 rounded-sm not-italic">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function SearchableSelect({
  groups,
  value,
  onChange,
  placeholder = "Select…",
  hasError = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allCats = useMemo(() => groups.flatMap((g) => g.categories), [groups]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        categories: g.categories.filter((c) => c.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.categories.length > 0);
  }, [groups, query]);

  const flatFiltered = useMemo(() => filtered.flatMap((g) => g.categories), [filtered]);

  const selectedLabel = useMemo(
    () => allCats.find((c) => c.value === value)?.label ?? "",
    [allCats, value]
  );

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openMenu() {
    setOpen(true);
    setQuery("");
    setHoveredIdx(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeMenu() {
    setOpen(false);
    setQuery("");
    setHoveredIdx(-1);
  }

  function pick(cat: Category) {
    onChange(cat.value);
    closeMenu();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHoveredIdx((i) => {
          const next = Math.min(i + 1, flatFiltered.length - 1);
          scrollToIdx(next);
          return next;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHoveredIdx((i) => {
          const next = Math.max(i - 1, 0);
          scrollToIdx(next);
          return next;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (hoveredIdx >= 0 && flatFiltered[hoveredIdx]) pick(flatFiltered[hoveredIdx]);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
    }
  }

  function scrollToIdx(idx: number) {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }

  const focusBorder = open
    ? "border-blue-500/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
    : hasError
    ? "border-red-500/50"
    : "border-white/10 hover:border-white/20";

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => (open ? closeMenu() : openMenu())}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-left ${focusBorder}`}
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid", outline: "none" }}
      >
        <span className={`text-sm font-medium truncate ${selectedLabel ? "text-slate-100" : "text-slate-500"}`}>
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute w-full mt-1.5 rounded-xl overflow-hidden anim-scale-in"
          style={{
            zIndex: 9999,
            background: "rgba(13, 18, 35, 0.97)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            letterSpacing: "normal",
            wordSpacing: "normal",
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-white/[0.07]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setHoveredIdx(-1); }}
                placeholder="Search occupations…"
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
          </div>

          {/* Option list */}
          <div ref={listRef} className="overflow-y-auto overscroll-contain py-1" style={{ maxHeight: "250px" }}>
            {flatFiltered.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((group) => (
                <div key={group.group}>
                  <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    {group.group}
                  </p>
                  {group.categories.map((cat) => {
                    const idx = flatFiltered.indexOf(cat);
                    const isActive = idx === hoveredIdx;
                    const isSelected = cat.value === value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        data-idx={idx}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onClick={() => pick(cat)}
                        className={`w-full flex items-center px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                          isActive ? "bg-white/[0.06]" : ""
                        } ${isSelected ? "text-blue-400" : "text-slate-300"}`}
                      >
                        <Highlight text={cat.label} query={query} />
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
