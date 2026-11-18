"use client";

import React, { useState, useEffect } from "react";
import {
  MealWithResponse,
  FoodWasteItem,
  HostelOverviewStats,
  AttendanceDetailItem,
} from "@/types";
import { WeeklyWasteChart, AttendanceBarChart, ParticipationGauge } from "./Charts";
import { api } from "@/services/api";
import {
  Utensils,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  TrendingDown,
  BarChart3,
  Calendar,
  AlertCircle,
  Send,
  CloudRain,
  GraduationCap,
  Smile,
  Users,
} from "lucide-react";

// ==========================================
// 1. ADMIN DASHBOARD (MESS OVERVIEW)
// ==========================================
interface AdminDashboardProps {
  stats: HostelOverviewStats | null;
  todayMeals: MealWithResponse[];
  onOpenCreateMeal: () => void;
  onOpenLogWaste: () => void;
  onTabChange: (tab: string) => void;
  onBroadcastNotif: (title: string, message: string) => Promise<void>;
}

export function AdminDashboard({
  stats,
  todayMeals,
  onOpenCreateMeal,
  onOpenLogWaste,
  onTabChange,
  onBroadcastNotif,
}: AdminDashboardProps) {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const bf = stats?.todayBreakfastExpected ?? 135;
  const lu = stats?.todayLunchExpected ?? 162;
  const di = stats?.todayDinnerExpected ?? 148;
  const total = stats?.totalRegistered ?? 180;
  const participation = stats?.overallParticipationRate ?? 84;
  const weeklyWaste = stats?.weeklyFoodWasteKg ?? 12.8;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    setBroadcasting(true);
    try {
      await onBroadcastNotif(broadcastTitle, broadcastMsg);
      setBroadcastSuccess(true);
      setBroadcastTitle("");
      setBroadcastMsg("");
      setTimeout(() => setBroadcastSuccess(false), 3500);
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DC] text-xs font-semibold text-[#5A833E] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#5A833E]" />
            <span>Kaveri Mess Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F281B] tracking-tight">
            Mess Overview
          </h1>
          <p className="text-sm sm:text-base text-[#646E5E] mt-1">
            Monitor demand. Prepare smarter. Waste less.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateMeal}
            className="px-4 py-2.5 rounded-2xl bg-[#5A833E] hover:bg-[#4D7234] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Meal</span>
          </button>
          <button
            onClick={onOpenLogWaste}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF9F5] text-[#1F281B] border border-[#E8E5DC] text-xs font-semibold shadow-2xs flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4 text-[#D95D39]" />
            <span>Log Waste</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expected Attendance */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
            Today's Expected
          </span>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#646E5E]">Breakfast:</span>
              <strong className="text-[#1F281B]">{bf}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#646E5E]">Lunch:</span>
              <strong className="text-[#1F281B]">{lu}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#646E5E]">Dinner:</span>
              <strong className="text-[#1F281B]">{di}</strong>
            </div>
          </div>
          <span className="text-[11px] text-[#5A833E] font-medium mt-3 block pt-2 border-t border-[#E8E5DC]">
            Total hostel size: {total}
          </span>
        </div>

        {/* Participation Rate */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Participation Rate
            </span>
            <span className="text-3xl font-extrabold text-[#5A833E] mt-2 block">
              {participation}%
            </span>
            <span className="text-xs text-[#646E5E] mt-1 block">
              Active student submissions
            </span>
          </div>
          <span className="text-[11px] text-[#4D7234] font-medium block pt-2 border-t border-[#E8E5DC]">
            High compliance this week
          </span>
        </div>

        {/* Weekly Food Waste */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Waste This Week
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-[#D95D39]">{weeklyWaste}</span>
              <span className="text-sm font-semibold text-[#646E5E]">kg</span>
            </div>
            <span className="text-xs text-[#646E5E] mt-1 block">
              Across all recorded meals
            </span>
          </div>
          <span className="text-[11px] text-[#5A833E] font-medium block pt-2 border-t border-[#E8E5DC]">
            ↓ 22% lower than prior month
          </span>
        </div>

        {/* Meals Planned */}
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Total Portions Saved
            </span>
            <span className="text-3xl font-extrabold text-[#1F281B] mt-2 block">
              {stats?.totalMealsSkippedThisMonth ?? 42}
            </span>
            <span className="text-xs text-[#646E5E] mt-1 block">
              Advance skip portions saved
            </span>
          </div>
          <span className="text-[11px] text-[#5A833E] font-medium block pt-2 border-t border-[#E8E5DC]">
            Prevented kitchen over-prep
          </span>
        </div>
      </div>

      {/* Today's Meals Quick Status Bar */}
      <section className="bg-white rounded-3xl p-6 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1F281B]">Today's Kitchen Demand Summary</h3>
            <p className="text-xs text-[#646E5E]">
              Current confirmed headcount for kitchen batch sizing.
            </p>
          </div>
          <button
            onClick={() => onTabChange("admin-attendance")}
            className="text-xs font-semibold text-[#5A833E] hover:underline"
          >
            Inspect Detailed Student Roster →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayMeals.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold capitalize text-[#1F281B]">
                    {m.mealType}
                  </span>
                  <span className="text-[11px] text-[#646E5E]">{m.servingTime}</span>
                </div>
                <p className="text-xs text-[#646E5E] line-clamp-2 mb-3">{m.menu}</p>
              </div>

              <div className="pt-3 border-t border-[#E8E5DC] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5A833E] font-medium">Attending (Cook for):</span>
                  <strong className="text-[#1F281B]">{m.attendingCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#D95D39] font-medium">Skipping (Portions saved):</span>
                  <strong className="text-[#D95D39]">{m.skippingCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#646E5E]">Not Responded:</span>
                  <span className="text-[#646E5E]">{m.notRespondedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)]">
          <h3 className="text-base font-bold text-[#1F281B] mb-1">Weekly Waste Trend</h3>
          <p className="text-xs text-[#646E5E] mb-4">
            Day-by-day food waste (kg) showing preparation precision improvement.
          </p>
          <WeeklyWasteChart data={stats?.wasteTrend || []} />
        </div>

        {/* Broadcast Notification Form */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)]">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-[#5A833E]" />
            <h3 className="text-base font-bold text-[#1F281B]">Broadcast Student Reminder</h3>
          </div>
          <p className="text-xs text-[#646E5E] mb-4">
            Send an instant deadline notification or menu alert to all registered hostel residents.
          </p>

          {broadcastSuccess && (
            <div className="mb-4 text-xs text-[#4D7234] bg-[#D6E79D]/40 p-3 rounded-xl border border-[#D6E79D] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5A833E]" />
              <span>Broadcast alert delivered to all students!</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Alert Title (e.g. 🍽️ Lunch Cutoff in 30 mins)"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Message body (e.g. Please update your lunch preference before 10:30 AM so chefs can cook exact portions)."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
            <button
              type="submit"
              disabled={broadcasting}
              className="px-4 py-2 rounded-xl bg-[#5A833E] hover:bg-[#4D7234] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? "Sending..." : "Send Broadcast Alert"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADMIN MEAL MANAGEMENT
// ==========================================
interface AdminMealManagementProps {
  meals: MealWithResponse[];
  onOpenCreateMeal: () => void;
  onEditMeal: (meal: MealWithResponse) => void;
  onDeleteMeal: (mealId: number) => Promise<void>;
}

export function AdminMealManagement({
  meals,
  onOpenCreateMeal,
  onEditMeal,
  onDeleteMeal,
}: AdminMealManagementProps) {
  const [filterType, setFilterType] = useState("all");

  const filtered = meals.filter((m) => filterType === "all" || m.mealType === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
            Meal Schedule Management
          </h1>
          <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
            Create, update, or remove meal menus, serving times, and cutoff deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs rounded-xl border border-[#E8E5DC] bg-white px-3 py-2 text-[#1F281B]"
          >
            <option value="all">All Types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>

          <button
            onClick={onOpenCreateMeal}
            className="px-4 py-2 rounded-xl bg-[#5A833E] hover:bg-[#4D7234] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Meals Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-[#E8E5DC] text-[#646E5E] uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Meal</th>
                <th className="py-3.5 px-4">Menu Items</th>
                <th className="py-3.5 px-4">Serving Window</th>
                <th className="py-3.5 px-4">Cutoff Deadline</th>
                <th className="py-3.5 px-4">Current Turnout</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DC]/80">
              {filtered.map((meal) => (
                <tr key={meal.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1F281B] whitespace-nowrap">
                    {new Date(meal.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-[#1F281B]">
                    {meal.mealType}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-[#646E5E]" title={meal.menu}>
                    {meal.menu}
                  </td>
                  <td className="py-3.5 px-4 text-[#646E5E] whitespace-nowrap">
                    {meal.servingTime}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-medium text-[#1F281B]">
                      <Clock className="w-3 h-3 text-[#5A833E]" />
                      {meal.deadlineFormatted}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-[#5A833E]">
                      {meal.attendingCount} eating
                    </span>{" "}
                    • <span className="text-[#D95D39] font-medium">{meal.skippingCount} skip</span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEditMeal(meal)}
                        className="p-1.5 rounded-lg text-[#5A833E] hover:bg-[#FAF9F5]"
                        title="Edit meal"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="p-1.5 rounded-lg text-[#D95D39] hover:bg-[#FDF0EC]"
                        title="Delete meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

// ==========================================
// 3. ADMIN LIVE ATTENDANCE BREAKDOWN VIEW
// ==========================================
export function AdminAttendanceView() {
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [allMeals, setAllMeals] = useState<any[]>([]);
  const [currentMeal, setCurrentMeal] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [students, setStudents] = useState<AttendanceDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadAttendance = async (mealId?: number) => {
    setLoading(true);
    try {
      const data = await api.getAdminAttendance(mealId);
      setCurrentMeal(data.meal);
      setAllMeals(data.allMeals);
      setSummary(data.summary);
      setStudents(data.students);
      if (!selectedMealId && data.meal) {
        setSelectedMealId(data.meal.id);
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance(selectedMealId || undefined);
  }, [selectedMealId]);

  const filteredStudents = students.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Meal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
            Meal Attendance Roster
          </h1>
          <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
            Student-by-student headcount to scale kitchen cooking batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#1F281B]">Select Meal:</label>
          <select
            value={selectedMealId || ""}
            onChange={(e) => setSelectedMealId(parseInt(e.target.value, 10))}
            className="text-xs rounded-xl border border-[#E8E5DC] bg-white px-3 py-2 text-[#1F281B] font-medium"
          >
            {allMeals.map((m) => (
              <option key={m.id} value={m.id}>
                {m.date} — {m.mealType.toUpperCase()} ({m.servingTime})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards: Expected Attendance, Skipping, Not Responded */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#8FB86E] shadow-[0_4px_20px_rgba(90,131,62,0.08)] ring-1 ring-[#8FB86E]/20">
            <span className="text-xs font-semibold text-[#4D7234] uppercase tracking-wider block">
              Expected Attendance
            </span>
            <span className="text-3xl font-extrabold text-[#5A833E] mt-1 block">
              {summary.expectedAttendance}
            </span>
            <span className="text-[11px] text-[#646E5E] mt-1 block">
              Direct portion count to cook
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E0937D] shadow-[0_4px_20px_rgba(217,93,57,0.06)] ring-1 ring-[#E0937D]/20">
            <span className="text-xs font-semibold text-[#D95D39] uppercase tracking-wider block">
              Confirmed Skipping
            </span>
            <span className="text-3xl font-extrabold text-[#D95D39] mt-1 block">
              {summary.skipping}
            </span>
            <span className="text-[11px] text-[#646E5E] mt-1 block">
              Portions saved from waste
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              No Response
            </span>
            <span className="text-3xl font-extrabold text-[#7A8574] mt-1 block">
              {summary.notResponded}
            </span>
            <span className="text-[11px] text-[#7A8574] mt-1 block">
              Awaiting student choice
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Turnout Ratio
            </span>
            <span className="text-3xl font-extrabold text-[#1F281B] mt-1 block">
              {summary.attendanceRatePercent}%
            </span>
            <span className="text-[11px] text-[#646E5E] block">Of total hostel residents</span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E5DC]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#646E5E]" />
          <input
            type="text"
            placeholder="Search student or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl border border-[#E8E5DC] pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-[#646E5E]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-[#E8E5DC] bg-white px-3 py-2 text-[#1F281B]"
          >
            <option value="all">All ({students.length})</option>
            <option value="attending">Attending ({summary?.expectedAttendance || 0})</option>
            <option value="skipping">Skipping ({summary?.skipping || 0})</option>
            <option value="not_responded">No Response ({summary?.notResponded || 0})</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-[#E8E5DC] text-[#646E5E] uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Room & Hostel</th>
                <th className="py-3 px-4">Dietary Preference</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Student Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DC]/80">
              {filteredStudents.map((s) => (
                <tr key={s.studentId} className="hover:bg-[#FAF9F5]/70">
                  <td className="py-3 px-4 font-semibold text-[#1F281B]">{s.name}</td>
                  <td className="py-3 px-4 text-[#646E5E]">{s.studentCode}</td>
                  <td className="py-3 px-4 text-[#1F281B]">
                    {s.roomNumber} • {s.hostel}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-medium bg-[#FAF9F5] border border-[#E8E5DC] px-2 py-0.5 rounded-md text-[#5A833E]">
                      {s.dietaryPreference}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {s.status === "attending" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#4D7234] bg-[#D6E79D]/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Attending
                      </span>
                    ) : s.status === "skipping" ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#D95D39] bg-[#FDF0EC] px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Skipping
                      </span>
                    ) : (
                      <span className="text-[#A0A69D] bg-[#F0EDE3] px-2 py-0.5 rounded-full font-medium">
                        Not Responded
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#646E5E] italic">
                    {s.note || "—"}
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

// ==========================================
// 4. FOOD WASTE TRACKING VIEW
// ==========================================
interface FoodWasteTrackingProps {
  wasteRecords: FoodWasteItem[];
  onOpenLogWaste: () => void;
  onDeleteRecord: (id: number) => Promise<void>;
}

export function FoodWasteTracking({
  wasteRecords,
  onOpenLogWaste,
  onDeleteRecord,
}: FoodWasteTrackingProps) {
  let totalPrepared = 0;
  let totalServed = 0;
  let totalWasted = 0;
  let totalKg = 0;

  for (const r of wasteRecords) {
    totalPrepared += r.preparedQuantity;
    totalServed += r.servedQuantity;
    totalWasted += r.wastedQuantity;
    totalKg += r.wasteKg;
  }

  const avgWastePct =
    totalPrepared > 0 ? ((totalWasted / totalPrepared) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E5DC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
            Food Waste Tracking & Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
            Enter after-meal cooking and discard figures to verify efficiency gains.
          </p>
        </div>

        <button
          onClick={onOpenLogWaste}
          className="px-4 py-2.5 rounded-2xl bg-[#D95D39] hover:bg-[#C85338] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Log After-Meal Waste</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
            Total Prepared
          </span>
          <span className="text-3xl font-extrabold text-[#1F281B] mt-1 block">
            {totalPrepared}
          </span>
          <span className="text-[11px] text-[#646E5E]">Portions cooked</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
            Total Consumed
          </span>
          <span className="text-3xl font-extrabold text-[#5A833E] mt-1 block">
            {totalServed}
          </span>
          <span className="text-[11px] text-[#646E5E]">Portions eaten</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
            Total Wasted
          </span>
          <span className="text-3xl font-extrabold text-[#D95D39] mt-1 block">
            {totalKg.toFixed(1)} <span className="text-sm font-normal">kg</span>
          </span>
          <span className="text-[11px] text-[#646E5E]">{totalWasted} portions surplus</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)]">
          <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
            Mess Waste Rate
          </span>
          <span className="text-3xl font-extrabold text-[#5A833E] mt-1 block">
            {avgWastePct}%
          </span>
          <span className="text-[11px] text-[#5A833E] font-medium">Industry standard is 15-25%</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] overflow-hidden">
        <div className="p-4 border-b border-[#E8E5DC] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1F281B]">Historical Waste Entries</h3>
          <span className="text-xs text-[#646E5E]">{wasteRecords.length} entries recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-[#E8E5DC] text-[#646E5E] uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Meal</th>
                <th className="py-3 px-4">Prepared</th>
                <th className="py-3 px-4">Served</th>
                <th className="py-3 px-4">Wasted (Portions)</th>
                <th className="py-3 px-4">Waste (Kg)</th>
                <th className="py-3 px-4">Waste %</th>
                <th className="py-3 px-4">Kitchen Notes</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DC]/80">
              {wasteRecords.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9F5]/70">
                  <td className="py-3 px-4 font-semibold text-[#1F281B] whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 capitalize font-medium text-[#1F281B]">
                    {r.mealType}
                  </td>
                  <td className="py-3 px-4 text-[#1F281B]">{r.preparedQuantity}</td>
                  <td className="py-3 px-4 text-[#5A833E] font-medium">{r.servedQuantity}</td>
                  <td className="py-3 px-4 text-[#D95D39] font-medium">{r.wastedQuantity}</td>
                  <td className="py-3 px-4 font-semibold text-[#1F281B]">{r.wasteKg} kg</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        r.wastePercentage <= 5
                          ? "bg-[#D6E79D]/40 text-[#4D7234]"
                          : "bg-[#FDF0EC] text-[#D95D39]"
                      }`}
                    >
                      {r.wastePercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#646E5E] max-w-xs truncate">
                    {r.notes || "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteRecord(r.id)}
                      className="p-1 rounded-md text-[#D95D39] hover:bg-[#FDF0EC]"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

// ==========================================
// 5. SMART AI PREDICTION (SIMULATION)
// ==========================================
export function SmartAIPrediction() {
  const [examWeek, setExamWeek] = useState(false);
  const [weatherRaining, setWeatherRaining] = useState(false);
  const [menuSpecial, setMenuSpecial] = useState(true);

  // Dynamic calculation for simulated prediction
  const baseline = 152;
  const examFactor = examWeek ? 14 : 0; // students stay on campus during exams
  const rainFactor = weatherRaining ? 10 : 0; // rain discourages eating outside
  const specialFactor = menuSpecial ? 8 : -4; // paneer/dessert pulls more crowd

  const predictedAttendance = baseline + examFactor + rainFactor + specialFactor;
  const minRange = predictedAttendance - 6;
  const maxRange = predictedAttendance + 6;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-[#E8E5DC]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DC] text-xs font-semibold text-[#5A833E] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Demand Prediction Engine • Beta Preview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
          Smart Meal Turnout Forecast
        </h1>
        <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
          Predict expected attendance before students have even submitted their choices.
        </p>
      </div>

      {/* Simulation Banner Notice */}
      <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex items-start gap-3 text-xs text-[#646E5E]">
        <AlertCircle className="w-4 h-4 text-[#5A833E] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#1F281B]">Simulated Demonstration:</strong> In full production, this module connects to campus weather APIs, university academic timetables, and historical attendance regression algorithms. Adjust the scenario factors below to test how the forecast reacts!
        </p>
      </div>

      {/* Main Forecast Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8FB86E] shadow-[0_8px_30px_rgba(90,131,62,0.1)] ring-1 ring-[#8FB86E]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E5DC]">
          <div>
            <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider block">
              Tomorrow's Dinner Forecast
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#1F281B]">
                {minRange} – {maxRange}
              </span>
              <span className="text-sm font-semibold text-[#646E5E]">students predicted</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block text-xs font-bold text-[#4D7234] bg-[#D6E79D]/40 px-3 py-1 rounded-full border border-[#D6E79D]">
              93.4% Confidence Score
            </span>
            <span className="text-[11px] text-[#646E5E] block mt-1">
              Recommended prep: {maxRange} portions
            </span>
          </div>
        </div>

        {/* Interactive Scenario Modifiers */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-[#1F281B] uppercase tracking-wider mb-3">
            Simulate Campus Context Variables
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setWeatherRaining(!weatherRaining)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                weatherRaining
                  ? "bg-[#D6E79D]/30 border-[#8FB86E] ring-1 ring-[#8FB86E]/40"
                  : "bg-[#FAF9F5] border-[#E8E5DC]"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#1F281B] block">Weather: Heavy Rain</span>
                <span className="text-[11px] text-[#646E5E] block">+10 students (stay in)</span>
              </div>
              <CloudRain className={`w-5 h-5 ${weatherRaining ? "text-[#5A833E]" : "text-[#A0A69D]"}`} />
            </button>

            <button
              onClick={() => setExamWeek(!examWeek)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                examWeek
                  ? "bg-[#D6E79D]/30 border-[#8FB86E] ring-1 ring-[#8FB86E]/40"
                  : "bg-[#FAF9F5] border-[#E8E5DC]"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#1F281B] block">Midterm Exam Period</span>
                <span className="text-[11px] text-[#646E5E] block">+14 students (study halls)</span>
              </div>
              <GraduationCap className={`w-5 h-5 ${examWeek ? "text-[#5A833E]" : "text-[#A0A69D]"}`} />
            </button>

            <button
              onClick={() => setMenuSpecial(!menuSpecial)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                menuSpecial
                  ? "bg-[#D6E79D]/30 border-[#8FB86E] ring-1 ring-[#8FB86E]/40"
                  : "bg-[#FAF9F5] border-[#E8E5DC]"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#1F281B] block">Popular Special Menu</span>
                <span className="text-[11px] text-[#646E5E] block">+8 students (dessert pull)</span>
              </div>
              <Utensils className={`w-5 h-5 ${menuSpecial ? "text-[#5A833E]" : "text-[#A0A69D]"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
