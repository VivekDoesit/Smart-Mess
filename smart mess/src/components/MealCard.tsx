"use client";

import React, { useState } from "react";
import { MealWithResponse, AttendanceStatus } from "@/types";
import { Check, X, Clock, AlertCircle, Utensils, Sparkles, Lock } from "lucide-react";

interface MealCardProps {
  meal: MealWithResponse;
  onStatusChange: (mealId: number, status: AttendanceStatus, note?: string) => Promise<void>;
  disabled?: boolean;
}

export function MealCard({ meal, onStatusChange, disabled }: MealCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState<AttendanceStatus>(meal.userStatus);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "breakfast":
        return "🍳";
      case "lunch":
        return "🍲";
      case "dinner":
        return "🍽️";
      default:
        return "🥣";
    }
  };

  const menuItems = meal.menu.split(",").map((item) => item.trim());

  const handleSelect = async (status: AttendanceStatus) => {
    if (disabled || meal.isDeadlinePassed || isUpdating) return;

    // Toggle off if already selected
    const nextStatus: AttendanceStatus = localStatus === status ? "not_responded" : status;

    setLocalStatus(nextStatus);
    setIsUpdating(true);
    setErrorMsg(null);

    try {
      await onStatusChange(meal.id, nextStatus);
    } catch (err: any) {
      // Revert on error
      setLocalStatus(meal.userStatus);
      setErrorMsg(err.message || "Failed to update preference");
    } finally {
      setIsUpdating(false);
    }
  };

  const isAttending = localStatus === "attending";
  const isSkipping = localStatus === "skipping";

  return (
    <div
      className={`relative rounded-3xl bg-white p-5 sm:p-6 transition-all duration-200 border ${
        isAttending
          ? "border-[#8FB86E] shadow-[0_8px_30px_rgba(90,131,62,0.1)] ring-1 ring-[#8FB86E]/40"
          : isSkipping
          ? "border-[#E0937D] shadow-[0_8px_30px_rgba(217,93,57,0.08)] ring-1 ring-[#E0937D]/30"
          : "border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.04)] hover:border-[#D5D0C2]"
      }`}
    >
      {/* Top Banner: Meal Type, Icon, Timings */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl select-none" role="img" aria-label={meal.mealType}>
            {getMealIcon(meal.mealType)}
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#1F281B] capitalize tracking-tight">
              {meal.mealType}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#646E5E] mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#8FB86E]" />
              <span>{meal.servingTime}</span>
            </div>
          </div>
        </div>

        {/* Deadline Status Tag */}
        <div className="text-right">
          {meal.isDeadlinePassed ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A8574] bg-[#F0EDE3] px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3 text-[#7A8574]" />
              Locked ({meal.deadlineFormatted})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4D7234] bg-[#D6E79D]/40 px-2.5 py-1 rounded-full border border-[#D6E79D]">
              <Clock className="w-3 h-3" />
              Cutoff: {meal.deadlineFormatted}
            </span>
          )}
        </div>
      </div>

      {/* Special Chef Note */}
      {meal.specialNote && (
        <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-center gap-2 text-xs text-[#5A833E]">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#5A833E]" />
          <span className="font-medium">{meal.specialNote}</span>
        </div>
      )}

      {/* Menu Item Pills */}
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#646E5E] mb-2">
          Today's Menu
        </p>
        <div className="flex flex-wrap gap-1.5">
          {menuItems.map((item, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E8E5DC] text-[#1F281B] font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Error display if any */}
      {errorMsg && (
        <div className="mt-3 text-xs text-[#D95D39] bg-[#FDF0EC] p-2.5 rounded-xl border border-[#F3C5B7] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Current Choice Status Banner */}
      <div className="mt-5 pt-4 border-t border-[#E8E5DC]/70">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-[#646E5E] font-medium">Your Attendance Status:</span>
          {isAttending ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#4D7234] bg-[#D6E79D]/45 px-2.5 py-0.5 rounded-full">
              <Check className="w-3.5 h-3.5" /> Eating this meal
            </span>
          ) : isSkipping ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#D95D39] bg-[#FDF0EC] px-2.5 py-0.5 rounded-full">
              <X className="w-3.5 h-3.5" /> Skipped this meal
            </span>
          ) : (
            <span className="font-medium text-[#7A8574] bg-[#F0EDE3] px-2.5 py-0.5 rounded-full">
              Not yet selected
            </span>
          )}
        </div>

        {/* Action Buttons: ✓ I'll Eat | × I'll Skip */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => handleSelect("attending")}
            disabled={disabled || meal.isDeadlinePassed || isUpdating}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isAttending
                ? "bg-[#5A833E] text-white shadow-sm ring-2 ring-[#5A833E]/20"
                : meal.isDeadlinePassed
                ? "bg-[#FAF9F5] text-[#A0A69D] border border-[#E8E5DC] cursor-not-allowed"
                : "bg-white hover:bg-[#FAF9F5] text-[#1F281B] border border-[#E8E5DC] hover:border-[#5A833E]"
            }`}
          >
            <Check className={`w-4 h-4 ${isAttending ? "text-white" : "text-[#5A833E]"}`} />
            <span>I'll Eat</span>
          </button>

          <button
            onClick={() => handleSelect("skipping")}
            disabled={disabled || meal.isDeadlinePassed || isUpdating}
            className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isSkipping
                ? "bg-[#D95D39] text-white shadow-sm ring-2 ring-[#D95D39]/20"
                : meal.isDeadlinePassed
                ? "bg-[#FAF9F5] text-[#A0A69D] border border-[#E8E5DC] cursor-not-allowed"
                : "bg-white hover:bg-[#FAF9F5] text-[#1F281B] border border-[#E8E5DC] hover:border-[#D95D39]"
            }`}
          >
            <X className={`w-4 h-4 ${isSkipping ? "text-white" : "text-[#D95D39]"}`} />
            <span>I'll Skip</span>
          </button>
        </div>

        {/* Demand Info & Deadline warning */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#646E5E]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5A833E]" />
            <span>
              <strong className="text-[#1F281B]">{meal.attendingCount}</strong> expected
            </span>
            <span>•</span>
            <span className="text-[#D95D39] font-medium">{meal.skippingCount} skipping</span>
          </span>

          {meal.isDeadlinePassed ? (
            <span className="text-[#7A8574]">Closed for prep</span>
          ) : (
            <span className="text-[#5A833E] font-medium">Editable until cutoff</span>
          )}
        </div>
      </div>
    </div>
  );
}
