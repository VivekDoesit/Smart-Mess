"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole } from "@/types";
import { api } from "@/services/api";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (payload: {
    name: string;
    email: string;
    password?: string;
    studentId?: string;
    hostel?: string;
    roomNumber?: string;
    role?: UserRole;
    dietaryPreference?: string;
  }) => Promise<void>;
  logout: () => void;
  quickSwitchDemo: (role: "student" | "admin") => Promise<void>;
  updateUserContext: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STUDENT_EMAIL = "student@smartmess.demo";
const DEMO_ADMIN_EMAIL = "admin@smartmess.demo";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage or default to demo student
  useEffect(() => {
    async function initAuth() {
      try {
        const storedEmail = typeof window !== "undefined" ? localStorage.getItem("smartmess_user_email") : null;
        const targetEmail = storedEmail || DEMO_STUDENT_EMAIL;

        const res = await api.getMe(targetEmail);
        if (res.user) {
          setUser(res.user);
        }
      } catch (err) {
        console.warn("Could not load stored user, falling back to demo student:", err);
        try {
          const res = await api.getMe(DEMO_STUDENT_EMAIL);
          if (res.user) setUser(res.user);
        } catch (e) {
          console.error("Auth init fallback failed:", e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("smartmess_user_email", res.user.email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password?: string;
    studentId?: string;
    hostel?: string;
    roomNumber?: string;
    role?: UserRole;
    dietaryPreference?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.signup(payload);
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("smartmess_user_email", res.user.email);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("smartmess_user_email");
    }
  };

  const quickSwitchDemo = async (targetRole: "student" | "admin") => {
    setIsLoading(true);
    try {
      const email = targetRole === "admin" ? DEMO_ADMIN_EMAIL : DEMO_STUDENT_EMAIL;
      const res = await api.getMe(email);
      if (res.user) {
        setUser(res.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("smartmess_user_email", res.user.email);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserContext = (updated: UserProfile) => {
    setUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartmess_user_email", updated.email);
    }
  };

  const role: UserRole = user?.role || "student";
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        isStudent,
        isLoading,
        login,
        signup,
        logout,
        quickSwitchDemo,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
