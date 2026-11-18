"use client";

import React from "react";
import { HostelOverviewStats } from "@/types";
import { WeeklyWasteChart, AttendanceBarChart, ParticipationGauge } from "./Charts";
import { Users, TrendingDown, Scale, Utensils } from "lucide-react";

interface HostelStatsOverviewProps {
  stats: HostelOverviewStats | null;
}

export function HostelStatsOverview({ stats }: HostelStatsOverviewProps) {
  const bf = stats?.todayBreakfastExpected ?? 135;
  const lu = stats?.todayLunchExpected ?? 162;
  const di = stats?.todayDinnerExpected ?? 148;
  const total = stats?.totalRegistered ?? 180;
  const participation = stats?.overallParticipationRate ?? 84;
  const weeklyWaste = stats?.weeklyFoodWasteKg ?? 12.8;

  return (
    <div className="space-y-6">
      {/* 3 Today's Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Breakfast Planning
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#1F281B]">{bf}</span>
              <span className="text-xs text-[#646E5E]">/ {total} students</span>
            </div>
            <span className="text-[11px] text-[#5A833E] font-medium mt-1 block">
              {Math.round((bf / total) * 100)}% expected turnout
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-center justify-center text-2xl select-none">
            🍳
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Lunch Planning
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#1F281B]">{lu}</span>
              <span className="text-xs text-[#646E5E]">/ {total} students</span>
            </div>
            <span className="text-[11px] text-[#5A833E] font-medium mt-1 block">
              {Math.round((lu / total) * 100)}% expected turnout
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-center justify-center text-2xl select-none">
            🍲
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Dinner Planning
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#1F281B]">{di}</span>
              <span className="text-xs text-[#646E5E]">/ {total} students</span>
            </div>
            <span className="text-[11px] text-[#5A833E] font-medium mt-1 block">
              {Math.round((di / total) * 100)}% expected turnout
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-center justify-center text-2xl select-none">
            🍽️
          </div>
        </div>
      </div>

      {/* Two Column Charts: Trend & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Waste Trend */}
        <div className="rounded-3xl bg-white p-6 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1F281B]">Food Waste Reduction Trend</h3>
              <p className="text-xs text-[#646E5E] mt-0.5">
                Total weekly mess discard: <strong className="text-[#1F281B]">{weeklyWaste} kg</strong> (down 22% vs baseline)
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A833E] bg-[#D6E79D]/40 px-2.5 py-1 rounded-full border border-[#D6E79D]">
              <TrendingDown className="w-3.5 h-3.5" /> -22% Waste
            </span>
          </div>

          <WeeklyWasteChart data={stats?.wasteTrend || []} />
        </div>

        {/* Attendance Distribution & Participation */}
        <div className="rounded-3xl bg-white p-6 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1F281B] mb-1">Meal Attendance Distribution</h3>
            <p className="text-xs text-[#646E5E] mb-5">
              Breakdown of today's active meal preferences across all hostel wings.
            </p>
            <AttendanceBarChart data={stats?.mealDistribution || []} />
          </div>

          <div className="mt-6 pt-5 border-t border-[#E8E5DC]">
            <ParticipationGauge rate={participation} />
          </div>
        </div>
      </div>
    </div>
  );
}
