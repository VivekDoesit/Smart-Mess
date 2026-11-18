"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppNotification } from "@/types";
import {
  Leaf,
  Bell,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  Calendar,
  BarChart3,
  Utensils,
  Sparkles,
  ChevronDown,
  Trash2,
  Sliders,
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
  onOpenAuthModal: () => void;
}

export function Navbar({
  currentTab,
  onTabChange,
  notifications,
  onOpenNotifications,
  onOpenProfileModal,
  onOpenAuthModal,
}: NavbarProps) {
  const { user, role, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const studentNavItems = [
    { id: "dashboard", label: "Today's Meals", icon: Utensils },
    { id: "upcoming", label: "Upcoming Schedule", icon: Calendar },
    { id: "impact", label: "Impact & History", icon: Leaf },
    { id: "hostel-stats", label: "Hostel Sustainability", icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: "admin-dashboard", label: "Mess Overview", icon: BarChart3 },
    { id: "admin-meals", label: "Manage Meals", icon: Utensils },
    { id: "admin-attendance", label: "Live Attendance", icon: Calendar },
    { id: "admin-waste", label: "Food Waste Tracker", icon: Trash2 },
    { id: "admin-prediction", label: "AI Prediction", icon: Sparkles },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(isAdmin ? "admin-dashboard" : "dashboard")}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#5A833E] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1F281B]">
                    Smart Mess
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D6E79D]/50 text-[#4D7234] border border-[#D6E79D]">
                    {isAdmin ? "Admin Ops" : "Student"}
                  </span>
                </div>
                <p className="text-[11px] text-[#646E5E] -mt-0.5 font-medium hidden sm:block">
                  Eat Smart. Waste Less. 🌱
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0EDE3]/70 p-1 rounded-2xl border border-[#E8E5DC]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white text-[#1F281B] shadow-xs font-semibold"
                      : "text-[#646E5E] hover:text-[#1F281B] hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#5A833E]" : "text-[#7A8574]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 sm:p-2.5 rounded-2xl bg-white border border-[#E8E5DC] text-[#1F281B] hover:bg-[#FAF9F5] transition-colors shadow-2xs"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 text-[#1F281B]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D95D39] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white border border-[#E8E5DC] hover:border-[#D5D0C2] transition-colors shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#FAF9F5] text-[#5A833E] border border-[#E8E5DC] flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0) || "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-semibold text-[#1F281B] block leading-tight">
                      {user?.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-[#646E5E] block leading-none">
                      {isAdmin ? "Mess Warden" : user?.roomNumber || "Student"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#646E5E] hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E5DC] shadow-xl py-2 z-50 animate-fade-in"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-[#E8E5DC]/80">
                      <p className="text-xs font-bold text-[#1F281B]">{user?.name}</p>
                      <p className="text-[11px] text-[#646E5E] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium bg-[#FAF9F5] border border-[#E8E5DC] px-2 py-0.5 rounded-md text-[#5A833E]">
                        {user?.hostel}
                      </span>
                    </div>

                    <button
                      onClick={onOpenProfileModal}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#1F281B] hover:bg-[#FAF9F5] flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#5A833E]" />
                      Edit Profile & Preferences
                    </button>

                    <button
                      onClick={() => onTabChange("landing")}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#1F281B] hover:bg-[#FAF9F5] flex items-center gap-2"
                    >
                      <Leaf className="w-3.5 h-3.5 text-[#5A833E]" />
                      Public Landing Page
                    </button>

                    <div className="border-t border-[#E8E5DC]/80 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-[#D95D39] hover:bg-[#FDF0EC] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-2xl bg-[#5A833E] hover:bg-[#4D7234] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-white border border-[#E8E5DC] text-[#1F281B]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E8E5DC] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#5A833E] text-white font-semibold"
                      : "text-[#1F281B] hover:bg-[#FAF9F5]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#5A833E]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
