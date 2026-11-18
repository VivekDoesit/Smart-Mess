"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MealWithResponse,
  StudentImpactStats,
  HostelOverviewStats,
  AttendanceStatus,
} from "@/types";
import { MealCard } from "./MealCard";
import { ImpactCard } from "./ImpactCard";
import { HostelStatsOverview } from "./HostelStatsOverview";
import {
  Sparkles,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Leaf,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";

// ==========================================
// 1. TODAY'S MEALS (STUDENT DASHBOARD)
// ==========================================
interface StudentDashboardProps {
  todayMeals: MealWithResponse[];
  upcomingMeals: MealWithResponse[];
  impactStats: StudentImpactStats | null;
  onStatusChange: (mealId: number, status: AttendanceStatus, note?: string) => Promise<void>;
  onTabChange: (tab: string) => void;
}

export function StudentDashboard({
  todayMeals,
  upcomingMeals,
  impactStats,
  onStatusChange,
  onTabChange,
}: StudentDashboardProps) {
  const { user } = useAuth();

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const studentFirstName = user?.name ? user.name.split(" ")[0] : "Student";

  // Check if any meal deadline is approaching today
  const activeUnresponded = todayMeals.filter(
    (m) => !m.isDeadlinePassed && m.userStatus === "not_responded"
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DC] text-xs font-semibold text-[#5A833E] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#5A833E]" />
            <span>Hostel: {user?.hostel || "Kaveri Hostel"} • Room {user?.roomNumber || "B-204"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F281B] tracking-tight">
            {getGreeting()}, {studentFirstName} 👋
          </h1>
          <p className="text-sm sm:text-base text-[#646E5E] mt-1 font-normal">
            Let's make today's meals count.
          </p>
        </div>

        {/* Quick Impact summary pill */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E8E5DC] shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-center justify-center text-xl select-none">
            🌱
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#646E5E] block">Your Contribution</span>
            <span className="text-xs font-bold text-[#5A833E]">
              {impactStats?.estimatedMealsSaved ?? 7} portions saved
            </span>
          </div>
        </div>
      </div>

      {/* Approaching Cutoff Notice if unresponded */}
      {activeUnresponded.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#D6E79D]/30 border border-[#D6E79D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4D7234]">
            <Clock className="w-4 h-4 shrink-0 text-[#5A833E]" />
            <span>
              <strong>Action needed:</strong> You have {activeUnresponded.length} pending meal choice(s) for today. Please confirm before kitchen cutoffs!
            </span>
          </div>
        </div>
      )}

      {/* Today's Meals Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1F281B] tracking-tight">
              Today's Meals
            </h2>
            <p className="text-xs text-[#646E5E]">
              Tap "I'll Eat" or "I'll Skip" to declare your attendance before each cutoff.
            </p>
          </div>
          <span className="text-xs font-medium text-[#646E5E] bg-white px-3 py-1 rounded-xl border border-[#E8E5DC]">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>

        {todayMeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E8E5DC] p-6">
            <div className="text-3xl mb-2">🍽️</div>
            <h4 className="text-sm font-semibold text-[#1F281B]">No meals scheduled for today yet</h4>
            <p className="text-xs text-[#646E5E] mt-1">
              Check back soon or view upcoming meals for the week.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {todayMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* Student Personal Impact Section */}
      <section>
        <ImpactCard stats={impactStats} />
      </section>

      {/* Tomorrow's Sneak Peek */}
      {upcomingMeals.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1F281B]">Plan Ahead for Tomorrow</h3>
              <p className="text-xs text-[#646E5E]">
                Set advance preferences to help the kitchen procure exact fresh ingredients.
              </p>
            </div>
            <button
              onClick={() => onTabChange("upcoming")}
              className="text-xs font-semibold text-[#5A833E] hover:underline flex items-center gap-1"
            >
              <span>View Full Weekly Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMeals.slice(0, 3).map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==========================================
// 2. UPCOMING MEALS SCHEDULE
// ==========================================
interface UpcomingMealsTabProps {
  meals: MealWithResponse[];
  onStatusChange: (mealId: number, status: AttendanceStatus, note?: string) => Promise<void>;
}

export function UpcomingMealsTab({ meals, onStatusChange }: UpcomingMealsTabProps) {
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filteredMeals = meals.filter((m) => {
    if (selectedMealType !== "all" && m.mealType !== selectedMealType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
            Upcoming Meal Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
            Plan your attendance in advance for upcoming days of the week.
          </p>
        </div>

        {/* Filters and View toggles */}
        <div className="flex items-center gap-2">
          {/* Meal type filter */}
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="text-xs rounded-xl border border-[#E8E5DC] bg-white px-3 py-2 text-[#1F281B] focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast Only</option>
            <option value="lunch">Lunch Only</option>
            <option value="dinner">Dinner Only</option>
          </select>

          {/* Card / Table Toggle */}
          <div className="flex bg-[#F0EDE3] p-1 rounded-xl border border-[#E8E5DC]">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "cards" ? "bg-white text-[#1F281B] shadow-2xs" : "text-[#646E5E]"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table" ? "bg-white text-[#1F281B] shadow-2xs" : "text-[#646E5E]"
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DC] p-6">
          <Calendar className="w-10 h-10 text-[#8FB86E] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1F281B]">No upcoming meals matching filter</h3>
          <p className="text-xs text-[#646E5E] mt-1">
            Check back later as new weekly menus are published by the mess administration.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="flex flex-col">
              <div className="text-xs font-semibold text-[#646E5E] mb-2 px-1 flex items-center justify-between">
                <span>
                  {new Date(meal.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[11px] text-[#A0A69D] capitalize">{meal.mealType}</span>
              </div>
              <MealCard meal={meal} onStatusChange={onStatusChange} />
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E8E5DC] text-[#646E5E] uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Meal</th>
                  <th className="py-3.5 px-4">Menu</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Your Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DC]/80">
                {filteredMeals.map((m) => {
                  const isAttending = m.userStatus === "attending";
                  const isSkipping = m.userStatus === "skipping";

                  return (
                    <tr key={m.id} className="hover:bg-[#FAF9F5]/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#1F281B] whitespace-nowrap">
                        {new Date(m.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold text-[#1F281B]">
                        {m.mealType}
                      </td>
                      <td className="py-3 px-4 text-[#646E5E] max-w-xs truncate" title={m.menu}>
                        {m.menu}
                      </td>
                      <td className="py-3 px-4 text-[#646E5E] whitespace-nowrap">
                        {m.deadlineFormatted}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isAttending ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#4D7234] bg-[#D6E79D]/40 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Attending
                          </span>
                        ) : isSkipping ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#D95D39] bg-[#FDF0EC] px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> Skipping
                          </span>
                        ) : (
                          <span className="text-[#A0A69D] bg-[#F0EDE3] px-2 py-0.5 rounded-full font-medium">
                            Not Selected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => onStatusChange(m.id, isAttending ? "not_responded" : "attending")}
                            disabled={m.isDeadlinePassed}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isAttending
                                ? "bg-[#5A833E] text-white"
                                : "bg-[#FAF9F5] hover:bg-white text-[#1F281B] border border-[#E8E5DC]"
                            }`}
                          >
                            ✓ Eat
                          </button>
                          <button
                            onClick={() => onStatusChange(m.id, isSkipping ? "not_responded" : "skipping")}
                            disabled={m.isDeadlinePassed}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isSkipping
                                ? "bg-[#D95D39] text-white"
                                : "bg-[#FAF9F5] hover:bg-white text-[#1F281B] border border-[#E8E5DC]"
                            }`}
                          >
                            × Skip
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. STUDENT IMPACT & HISTORY TAB
// ==========================================
interface StudentImpactTabProps {
  stats: StudentImpactStats | null;
  historyMeals: MealWithResponse[];
}

export function StudentImpactTab({ stats, historyMeals }: StudentImpactTabProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
          Your Sustainability Impact & History
        </h1>
        <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
          Review your attendance track record and measurable contribution to reducing campus food waste.
        </p>
      </div>

      {/* Main Impact Card */}
      <ImpactCard stats={stats} />

      {/* Sustainability Milestone Badge Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-[#D6E79D]/40 text-[#4D7234] flex items-center justify-center text-xl mb-3">
            🌱
          </div>
          <h4 className="text-sm font-bold text-[#1F281B]">Eco Starter</h4>
          <p className="text-xs text-[#646E5E] mt-1">
            Achieved by submitting your first advance meal preferences.
          </p>
          <span className="inline-block mt-3 text-[11px] font-semibold text-[#5A833E]">
            ✓ Completed
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-[#D6E79D]/40 text-[#4D7234] flex items-center justify-center text-xl mb-3">
            ⭐
          </div>
          <h4 className="text-sm font-bold text-[#1F281B]">Waste Reducer</h4>
          <p className="text-xs text-[#646E5E] mt-1">
            Prevented 3+ surplus meal portions from mess overcooking.
          </p>
          <span className="inline-block mt-3 text-[11px] font-semibold text-[#5A833E]">
            ✓ Completed
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#8FB86E] shadow-[0_4px_20px_rgba(90,131,62,0.1)] ring-1 ring-[#8FB86E]/30">
          <div className="w-10 h-10 rounded-2xl bg-[#5A833E] text-white flex items-center justify-center text-xl mb-3">
            🏆
          </div>
          <h4 className="text-sm font-bold text-[#1F281B]">Zero-Waste Hero</h4>
          <p className="text-xs text-[#646E5E] mt-1">
            Consistent attendance declaration, saving 7+ portions of kitchen preparation.
          </p>
          <span className="inline-block mt-3 text-[11px] font-semibold text-[#5A833E]">
            ✓ Active Badge
          </span>
        </div>
      </div>

      {/* Attendance History Log Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F281B]">Recent Attendance Activity</h3>
            <p className="text-xs text-[#646E5E]">
              Chronological log of your recorded responses across hostel meals.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#646E5E]">
            {historyMeals.length} records logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-[#E8E5DC] text-[#646E5E] uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Meal</th>
                <th className="py-3 px-4">Your Preference</th>
                <th className="py-3 px-4">Mess Preparation Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DC]/80">
              {historyMeals.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF9F5]/70">
                  <td className="py-3 px-4 font-medium text-[#1F281B]">
                    {new Date(m.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-[#1F281B]">
                    {m.mealType}
                  </td>
                  <td className="py-3 px-4">
                    {m.userStatus === "attending" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#4D7234] bg-[#D6E79D]/40 px-2 py-0.5 rounded-md">
                        ✓ Attending
                      </span>
                    ) : m.userStatus === "skipping" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#D95D39] bg-[#FDF0EC] px-2 py-0.5 rounded-md">
                        × Skipped
                      </span>
                    ) : (
                      <span className="text-[#A0A69D] bg-[#F0EDE3] px-2 py-0.5 rounded-md">
                        Not Responded
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#646E5E]">
                    {m.userStatus === "skipping" ? (
                      <span className="text-[#5A833E] font-medium flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" /> 1 portion saved from waste
                      </span>
                    ) : m.userStatus === "attending" ? (
                      <span>Portion counted in kitchen preparation</span>
                    ) : (
                      <span className="text-[#A0A69D]">No advance notice provided</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
