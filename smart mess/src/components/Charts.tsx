"use client";

import React, { useState } from "react";

// 1. Weekly Food Waste Line/Area Chart
interface WasteTrendData {
  day: string;
  date: string;
  wastedPortions: number;
  wasteKg: number;
}

export function WeeklyWasteChart({ data }: { data: WasteTrendData[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-sm text-[#646E5E]">No waste records available yet.</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.wasteKg), 5);
  const chartHeight = 160;
  const chartWidth = 460;
  const paddingX = 40;
  const paddingY = 24;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.wasteKg / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5A833E]"></div>
          <span className="text-xs font-medium text-[#1F281B]">Daily Mess Waste (kg)</span>
        </div>
        <span className="text-xs text-[#646E5E]">Past 7 recorded days</span>
      </div>

      <div className="relative w-full aspect-[460/180]">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6E79D" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D6E79D" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="#E8E5DC"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="#E8E5DC"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area under curve */}
          <path d={areaD} fill="url(#wasteGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#5A833E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Labels */}
          {points.map((pt, i) => (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 6 : 4}
                className="fill-[#FFFFFF] stroke-[#5A833E] transition-all"
                strokeWidth="2.5"
              />
              <text
                x={pt.x}
                y={chartHeight - 6}
                textAnchor="middle"
                className="text-[10px] fill-[#646E5E] font-medium"
              >
                {pt.day}
              </text>
            </g>
          ))}
        </svg>

        {hoverIndex !== null && points[hoverIndex] && (
          <div
            className="absolute -top-3 bg-[#1F281B] text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg pointer-events-none transform -translate-x-1/2"
            style={{
              left: `${(points[hoverIndex].x / chartWidth) * 100}%`,
            }}
          >
            <div className="font-semibold text-[#D6E79D]">{points[hoverIndex].wasteKg} kg</div>
            <div className="text-[10px] text-white/70">{points[hoverIndex].wastedPortions} portions wasted</div>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Meal Attendance Comparison Bar Chart
interface MealDistItem {
  mealType: string;
  attending: number;
  skipping: number;
  notResponded: number;
}

export function AttendanceBarChart({ data }: { data: MealDistItem[] }) {
  const maxVal = Math.max(...data.map((d) => d.attending + d.skipping + d.notResponded), 180);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
        <span className="font-medium text-[#1F281B]">Attendance by Meal</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#5A833E]"></span> Attending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#D95D39]"></span> Skipping
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#D5D0C2]"></span> No Response
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const total = item.attending + item.skipping + item.notResponded || 1;
          const attendPct = Math.round((item.attending / total) * 100);
          const skipPct = Math.round((item.skipping / total) * 100);
          const noRespPct = 100 - attendPct - skipPct;

          return (
            <div key={item.mealType} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1F281B]">{item.mealType}</span>
                <span className="text-[#646E5E] text-[11px]">
                  <strong className="text-[#5A833E] font-medium">{item.attending}</strong> eating •{" "}
                  <strong className="text-[#D95D39] font-medium">{item.skipping}</strong> skipping
                </span>
              </div>

              {/* Stacked Progress Bar */}
              <div className="h-4 bg-[#F0EDE3] rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${attendPct}%` }}
                  className="bg-[#5A833E] h-full transition-all duration-500 hover:opacity-90"
                  title={`Attending: ${item.attending} (${attendPct}%)`}
                />
                <div
                  style={{ width: `${skipPct}%` }}
                  className="bg-[#D95D39] h-full transition-all duration-500 hover:opacity-90"
                  title={`Skipping: ${item.skipping} (${skipPct}%)`}
                />
                <div
                  style={{ width: `${Math.max(0, noRespPct)}%` }}
                  className="bg-[#D5D0C2] h-full transition-all duration-500 hover:opacity-90"
                  title={`Not responded: ${item.notResponded} (${noRespPct}%)`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Participation Donut / Radial Gauge
export function ParticipationGauge({ rate }: { rate: number }) {
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#E8E5DC"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#5A833E"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[#1F281B] leading-none">{rate}%</span>
          <span className="text-[9px] uppercase tracking-wider text-[#646E5E] font-medium mt-0.5">Active</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-[#1F281B]">Hostel Participation</h4>
        <p className="text-[11px] text-[#646E5E] leading-relaxed">
          Students regularly confirming preferences ahead of meal cutoffs.
        </p>
      </div>
    </div>
  );
}
