"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  MealWithResponse,
  FoodWasteItem,
  AppNotification,
  StudentImpactStats,
  HostelOverviewStats,
  AttendanceStatus,
} from "@/types";
import { api } from "@/services/api";
import { QuickDemoBar } from "@/components/QuickDemoBar";
import { Navbar } from "@/components/Navbar";
import { NotificationDrawer } from "@/components/NotificationDrawer";
import {
  MealModal,
  WasteModal,
  ProfileModal,
  AuthModal,
} from "@/components/Modals";
import { LandingPage } from "@/components/LandingPage";
import {
  StudentDashboard,
  UpcomingMealsTab,
  StudentImpactTab,
} from "@/components/StudentViews";
import { HostelStatsOverview } from "@/components/HostelStatsOverview";
import {
  AdminDashboard,
  AdminMealManagement,
  AdminAttendanceView,
  FoodWasteTracking,
  SmartAIPrediction,
} from "@/components/AdminViews";
import { Leaf, Loader2 } from "lucide-react";

export default function SmartMessApp() {
  const { user, role, isAdmin, isStudent, isAuthenticated, login, signup, quickSwitchDemo, updateUserContext } =
    useAuth();

  // Navigation tab state
  // Default to 'dashboard' for student, or 'admin-dashboard' for admin
  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Sync tab with role changes
  useEffect(() => {
    if (isAdmin && (currentTab === "dashboard" || currentTab === "upcoming" || currentTab === "impact")) {
      setCurrentTab("admin-dashboard");
    } else if (isStudent && (currentTab === "admin-dashboard" || currentTab === "admin-meals" || currentTab === "admin-attendance" || currentTab === "admin-waste")) {
      setCurrentTab("dashboard");
    }
  }, [isAdmin, isStudent]);

  // Data states
  const [todayMeals, setTodayMeals] = useState<MealWithResponse[]>([]);
  const [upcomingMeals, setUpcomingMeals] = useState<MealWithResponse[]>([]);
  const [allMeals, setAllMeals] = useState<MealWithResponse[]>([]);
  const [historyMeals, setHistoryMeals] = useState<MealWithResponse[]>([]);
  const [hostelStats, setHostelStats] = useState<HostelOverviewStats | null>(null);
  const [studentImpact, setStudentImpact] = useState<StudentImpactStats | null>(null);
  const [wasteRecords, setWasteRecords] = useState<FoodWasteItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<MealWithResponse | null>(null);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch all necessary data
  const loadData = useCallback(async () => {
    try {
      const userId = user?.id;

      // 1. Fetch Today's meals
      const todayRes = await api.getMeals({ view: "today", userId });
      setTodayMeals(todayRes.meals);

      // 2. Fetch Upcoming meals
      const upRes = await api.getMeals({ view: "upcoming", userId });
      setUpcomingMeals(upRes.meals);

      // 3. Fetch All meals (for admin and history)
      const allRes = await api.getMeals({ view: "all", userId });
      setAllMeals(allRes.meals);
      setHistoryMeals(allRes.meals);

      // 4. Fetch Stats
      const statsRes = await api.getStats(userId);
      setHostelStats(statsRes.hostel);
      if (statsRes.student) {
        setStudentImpact(statsRes.student);
      }

      // 5. Fetch Waste records
      const wasteRes = await api.getFoodWaste();
      setWasteRecords(wasteRes.records);

      // 6. Fetch Notifications
      const notifRes = await api.getNotifications(userId);
      setNotifications(notifRes.notifications);
    } catch (err) {
      console.error("Error loading Smart Mess data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleMealStatusChange = async (
    mealId: number,
    status: AttendanceStatus,
    note?: string
  ) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Optimistic update across all meal lists
    const updateList = (prev: MealWithResponse[]) =>
      prev.map((m) =>
        m.id === mealId
          ? {
              ...m,
              userStatus: status,
              attendingCount:
                status === "attending" && m.userStatus !== "attending"
                  ? m.attendingCount + 1
                  : m.userStatus === "attending" && status !== "attending"
                  ? Math.max(0, m.attendingCount - 1)
                  : m.attendingCount,
              skippingCount:
                status === "skipping" && m.userStatus !== "skipping"
                  ? m.skippingCount + 1
                  : m.userStatus === "skipping" && status !== "skipping"
                  ? Math.max(0, m.skippingCount - 1)
                  : m.skippingCount,
            }
          : m
      );

    setTodayMeals(updateList);
    setUpcomingMeals(updateList);
    setAllMeals(updateList);
    setHistoryMeals(updateList);

    // Call API
    await api.submitResponse({
      studentId: user.id,
      mealId,
      status,
      note,
    });

    // Refresh stats & notifications in background
    api.getStats(user.id).then((statsRes) => {
      setHostelStats(statsRes.hostel);
      if (statsRes.student) setStudentImpact(statsRes.student);
    });

    api.getNotifications(user.id).then((nRes) => {
      setNotifications(nRes.notifications);
    });
  };

  // Admin Meal CRUD
  const handleSaveMeal = async (mealData: any) => {
    if (mealData.id) {
      await api.updateMeal(mealData);
    } else {
      await api.createMeal(mealData);
    }
    await loadData();
  };

  const handleDeleteMeal = async (mealId: number) => {
    if (window.confirm("Are you sure you want to remove this meal from the schedule?")) {
      await api.deleteMeal(mealId);
      await loadData();
    }
  };

  // Admin Waste Logging
  const handleSaveWaste = async (wasteData: any) => {
    await api.createFoodWaste(wasteData);
    const wasteRes = await api.getFoodWaste();
    setWasteRecords(wasteRes.records);
    const statsRes = await api.getStats(user?.id);
    setHostelStats(statsRes.hostel);
  };

  const handleDeleteWaste = async (id: number) => {
    if (window.confirm("Delete this waste entry?")) {
      await api.deleteFoodWaste(id);
      const wasteRes = await api.getFoodWaste();
      setWasteRecords(wasteRes.records);
    }
  };

  // Admin Broadcast notification
  const handleBroadcastNotif = async (title: string, message: string) => {
    await api.broadcastNotification({ title, message, type: "reminder" });
    const nRes = await api.getNotifications(user?.id);
    setNotifications(nRes.notifications);
  };

  // Notifications
  const handleMarkNotificationRead = async (id?: number, markAll?: boolean) => {
    await api.markNotificationRead(id, markAll, user?.id);
    if (markAll) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } else if (id) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  // Profile update
  const handleUpdateProfile = async (profileData: any) => {
    const res = await api.updateProfile(profileData);
    updateUserContext(res.user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1F281B]">
      {/* 1. Quick Demo Switcher Bar */}
      <QuickDemoBar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* 2. Top Navigation */}
      {currentTab !== "landing" && (
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          notifications={notifications}
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* 3. Main Views Container */}
      <main className="flex-1">
        {currentTab === "landing" ? (
          <LandingPage
            onEnterApp={async (preferredRole) => {
              if (preferredRole) {
                await quickSwitchDemo(preferredRole);
                setCurrentTab(preferredRole === "admin" ? "admin-dashboard" : "dashboard");
              } else {
                setCurrentTab(isAdmin ? "admin-dashboard" : "dashboard");
              }
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#5A833E] animate-spin" />
                <p className="text-xs font-medium text-[#646E5E]">
                  Connecting to Smart Mess database...
                </p>
              </div>
            ) : (
              <>
                {/* Student Views */}
                {currentTab === "dashboard" && (
                  <StudentDashboard
                    todayMeals={todayMeals}
                    upcomingMeals={upcomingMeals}
                    impactStats={studentImpact}
                    onStatusChange={handleMealStatusChange}
                    onTabChange={setCurrentTab}
                  />
                )}

                {currentTab === "upcoming" && (
                  <UpcomingMealsTab
                    meals={upcomingMeals}
                    onStatusChange={handleMealStatusChange}
                  />
                )}

                {currentTab === "impact" && (
                  <StudentImpactTab
                    stats={studentImpact}
                    historyMeals={historyMeals}
                  />
                )}

                {currentTab === "hostel-stats" && (
                  <div className="space-y-6">
                    <div className="pb-2 border-b border-[#E8E5DC]">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F281B] tracking-tight">
                        Hostel Sustainability Analytics
                      </h1>
                      <p className="text-xs sm:text-sm text-[#646E5E] mt-1">
                        Anonymized data showing meal demand estimation and campus food waste reduction.
                      </p>
                    </div>
                    <HostelStatsOverview stats={hostelStats} />
                  </div>
                )}

                {/* Admin Views */}
                {currentTab === "admin-dashboard" && (
                  <AdminDashboard
                    stats={hostelStats}
                    todayMeals={todayMeals}
                    onOpenCreateMeal={() => {
                      setMealToEdit(null);
                      setIsMealModalOpen(true);
                    }}
                    onOpenLogWaste={() => setIsWasteModalOpen(true)}
                    onTabChange={setCurrentTab}
                    onBroadcastNotif={handleBroadcastNotif}
                  />
                )}

                {currentTab === "admin-meals" && (
                  <AdminMealManagement
                    meals={allMeals}
                    onOpenCreateMeal={() => {
                      setMealToEdit(null);
                      setIsMealModalOpen(true);
                    }}
                    onEditMeal={(meal) => {
                      setMealToEdit(meal);
                      setIsMealModalOpen(true);
                    }}
                    onDeleteMeal={handleDeleteMeal}
                  />
                )}

                {currentTab === "admin-attendance" && <AdminAttendanceView />}

                {currentTab === "admin-waste" && (
                  <FoodWasteTracking
                    wasteRecords={wasteRecords}
                    onOpenLogWaste={() => setIsWasteModalOpen(true)}
                    onDeleteRecord={handleDeleteWaste}
                  />
                )}

                {currentTab === "admin-prediction" && <SmartAIPrediction />}
              </>
            )}
          </div>
        )}
      </main>

      {/* 4. Footer */}
      {currentTab !== "landing" && (
        <footer className="bg-white border-t border-[#E8E5DC] py-6 text-center text-xs text-[#646E5E]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#5A833E] text-white flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[#1F281B]">Smart Mess</span>
              <span>•</span>
              <span className="italic">Eat Smart. Waste Less.</span>
            </div>

            <p className="text-[11px] text-[#646E5E]">
              Built for a more sustainable campus 🌱
            </p>
          </div>
        </footer>
      )}

      {/* 5. Modals & Drawers */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onMarkRead={handleMarkNotificationRead}
      />

      <MealModal
        isOpen={isMealModalOpen}
        onClose={() => {
          setIsMealModalOpen(false);
          setMealToEdit(null);
        }}
        onSubmit={handleSaveMeal}
        mealToEdit={mealToEdit}
      />

      <WasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
        onSubmit={handleSaveWaste}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onSignup={signup}
        onDemoSwitch={async (targetRole) => {
          await quickSwitchDemo(targetRole);
          setCurrentTab(targetRole === "admin" ? "admin-dashboard" : "dashboard");
        }}
      />
    </div>
  );
}
