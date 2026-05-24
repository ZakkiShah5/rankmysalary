"use client";

import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQAccordion({ items }: { items: readonly FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={item.q}
            className="glass rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              borderLeft: isOpen ? "3px solid #3b82f6" : "3px solid transparent",
              boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
            >
              <span className="text-sm font-semibold text-slate-200 pr-4">{item.q}</span>
              <span
                className="shrink-0 text-slate-400 text-lg font-light transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
            >
              <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
