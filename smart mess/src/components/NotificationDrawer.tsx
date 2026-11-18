"use client";

import React from "react";
import { AppNotification } from "@/types";
import { Bell, Check, Clock, Leaf, AlertTriangle, Info, X } from "lucide-react";

interface NotificationDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id?: number, markAll?: boolean) => void;
}

export function NotificationDrawer({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "impact":
        return <Leaf className="w-4 h-4 text-[#5A833E]" />;
      case "reminder":
        return <Clock className="w-4 h-4 text-[#E68A2E]" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-[#D95D39]" />;
      default:
        return <Info className="w-4 h-4 text-[#5A833E]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E8E5DC]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E5DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#E8E5DC] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#1F281B]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F281B]">Notifications</h3>
              <p className="text-xs text-[#646E5E]">
                {unreadCount > 0 ? `${unreadCount} unread update(s)` : "You're all caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => onMarkRead(undefined, true)}
                className="text-xs text-[#5A833E] hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#646E5E] hover:bg-[#FAF9F5] hover:text-[#1F281B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] text-[#8FB86E] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-[#1F281B]">No notifications yet</h4>
              <p className="text-xs text-[#646E5E] mt-1">
                You will receive cutoff reminders and meal savings updates here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && onMarkRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? "bg-white border-[#E8E5DC] opacity-75"
                    : "bg-[#FAF9F5] border-[#D6E79D] shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white border border-[#E8E5DC] shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1F281B] truncate">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#5A833E] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#646E5E] mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-[#A0A69D] mt-2 block">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E5DC] bg-[#FAF9F5] text-center">
          <p className="text-[11px] text-[#646E5E]">
            Smart Mess automated hostel notifications 🌱
          </p>
        </div>
      </div>
    </div>
  );
}
