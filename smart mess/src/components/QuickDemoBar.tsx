"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Shield, User, Globe, RefreshCw } from "lucide-react";

interface QuickDemoBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function QuickDemoBar({ currentTab, onTabChange }: QuickDemoBarProps) {
  const { user, isAdmin, isStudent, quickSwitchDemo } = useAuth();

  return (
    <aside aria-label="Demo switcher bar" className="bg-[#1F281B] text-[#E8E5DC] text-xs py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-[#D6E79D] uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Mess Live Demo
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-white/70">
            Currently logged in as:{" "}
            <strong className="text-white font-medium">
              {user ? user.name : "Guest"}{" "}
              {user && (
                <span className="text-[#D6E79D]">
                  ({user.role === "admin" ? "Admin" : "Student"})
                </span>
              )}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white/60 hidden md:inline">Quick switch:</span>

          <button
            onClick={async () => {
              await quickSwitchDemo("student");
              onTabChange("dashboard");
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              isStudent && currentTab !== "landing"
                ? "bg-[#D6E79D] text-[#1F281B] font-semibold shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <User className="w-3 h-3" />
            Student View (Aarav)
          </button>

          <button
            onClick={async () => {
              await quickSwitchDemo("admin");
              onTabChange("admin-dashboard");
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              isAdmin && currentTab !== "landing"
                ? "bg-[#D6E79D] text-[#1F281B] font-semibold shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin Ops (Rajesh)
          </button>

          <button
            onClick={() => onTabChange("landing")}
            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              currentTab === "landing"
                ? "bg-[#D6E79D] text-[#1F281B] font-semibold shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <Globe className="w-3 h-3" />
            Public Home
          </button>
        </div>
      </div>
    </aside>
  );
}
