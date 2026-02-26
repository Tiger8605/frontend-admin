"use client";

import React from "react";

import { colors } from "../common/Colors";

export default function Analytics() {
  const cards = [
    { label: "Total Orders", value: "128" },
    { label: "Today Orders", value: "17" },
    { label: "Revenue", value: "₹ 24,560" },
    { label: "Most Ordered", value: "Paneer Butter Masala" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-3xl border p-5"
            style={{ backgroundColor: colors.white, borderColor: colors.border }}
          >
            <p className="text-xs font-semibold" style={{ color: colors.textMuted }}>
              {c.label}
            </p>
            <p className="mt-2 text-lg font-extrabold" style={{ color: colors.textPrimary }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts placeholder UI */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          className="rounded-3xl border p-5"
          style={{ backgroundColor: colors.white, borderColor: colors.border }}
        >
          <h3 className="text-sm font-extrabold" style={{ color: colors.textPrimary }}>
            Orders Trend (UI Placeholder)
          </h3>
          <div
            className="mt-4 h-[260px] rounded-2xl border flex items-center justify-center text-sm font-semibold"
            style={{ borderColor: colors.border, backgroundColor: colors.cardSoft, color: colors.textMuted }}
          >
            Chart will be here
          </div>
        </div>

        <div
          className="rounded-3xl border p-5"
          style={{ backgroundColor: colors.white, borderColor: colors.border }}
        >
          <h3 className="text-sm font-extrabold" style={{ color: colors.textPrimary }}>
            Category Share (UI Placeholder)
          </h3>
          <div
            className="mt-4 h-[260px] rounded-2xl border flex items-center justify-center text-sm font-semibold"
            style={{ borderColor: colors.border, backgroundColor: colors.cardSoft, color: colors.textMuted }}
          >
            Chart will be here
          </div>
        </div>
      </div>
    </div>
  );
}

