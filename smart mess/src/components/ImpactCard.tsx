"use client";

import React from "react";
import { StudentImpactStats } from "@/types";
import { Leaf, Award, TrendingDown, Info, CheckCircle2 } from "lucide-react";

interface ImpactCardProps {
  stats: StudentImpactStats | null;
}

export function ImpactCard({ stats }: ImpactCardProps) {
  const planned = stats?.mealsPlanned ?? 24;
  const skipped = stats?.mealsSkipped ?? 7;
  const saved = stats?.estimatedMealsSaved ?? 7;
  const co2 = stats?.co2SavedKgEstimate ?? 3.15;
  const badgeTitle = stats?.ecoBadgeTitle ?? "Zero-Waste Hero 🏆";
  const ecoLevel = stats?.ecoLevel ?? "Waste Reducer";

  return (
    <div className="rounded-3xl bg-white border border-[#E8E5DC] p-6 shadow-[0_4px_24px_rgba(35,45,30,0.04)] relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D6E79D]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6E79D]/40 text-[#4D7234] border border-[#D6E79D] text-xs font-semibold mb-2">
            <Leaf className="w-3.5 h-3.5" />
            <span>Your Sustainability Impact</span>
          </div>
          <h3 className="text-xl font-bold text-[#1F281B] tracking-tight">
            You're helping make your hostel more sustainable.
          </h3>
          <p className="text-xs text-[#646E5E] mt-1 max-w-md">
            Every advance meal skip helps our kitchen staff prepare exact quantities instead of overcooking.
          </p>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-[#646E5E]">Current Rank</span>
          <span className="text-xs font-semibold text-[#5A833E] bg-[#FAF9F5] border border-[#E8E5DC] px-2.5 py-1 rounded-xl mt-1">
            {badgeTitle}
          </span>
        </div>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 relative z-10">
        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DC]">
          <span className="text-xs text-[#646E5E] font-medium block">Meals Planned</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] mt-1 block">
            {planned}
          </span>
          <span className="text-[11px] text-[#646E5E] mt-1 block">Total preferences set</span>
        </div>

        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DC]">
          <span className="text-xs text-[#646E5E] font-medium block">Meals Skipped</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#D95D39] mt-1 block">
            {skipped}
          </span>
          <span className="text-[11px] text-[#646E5E] mt-1 block">Advance notices</span>
        </div>

        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DC] ring-1 ring-[#5A833E]/20">
          <span className="text-xs text-[#5A833E] font-semibold block flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Est. Meals Saved
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#5A833E] mt-1 block">
            {saved}
          </span>
          <span className="text-[11px] text-[#646E5E] mt-1 block">Portions prevented</span>
        </div>

        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#E8E5DC]">
          <span className="text-xs text-[#646E5E] font-medium block">Est. CO₂e Averted</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] mt-1 block">
            {co2} <span className="text-sm font-semibold text-[#646E5E]">kg</span>
          </span>
          <span className="text-[11px] text-[#646E5E] mt-1 block">Carbon footprint cut</span>
        </div>
      </div>

      {/* Callout Footer */}
      <div className="mt-5 pt-4 border-t border-[#E8E5DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#646E5E]">
        <div className="flex items-center gap-2">
          <span className="text-base select-none">🌱</span>
          <span className="font-medium text-[#1F281B]">Your Contribution:</span>
          <span>Helping eliminate hostel food waste one meal at a time.</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#7A8574]">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Savings calculated from timely kitchen cutoff adjustments.</span>
        </div>
      </div>
    </div>
  );
}
