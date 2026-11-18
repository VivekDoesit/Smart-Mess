"use client";

import React, { useState } from "react";
import { UserProfile, MealWithResponse, MealType } from "@/types";
import { X, Check, Utensils, Trash2, Calendar, Clock, User, Shield, AlertCircle, Sparkles } from "lucide-react";

// ==========================================
// 1. ADMIN CREATE / EDIT MEAL MODAL
// ==========================================
interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mealData: any) => Promise<void>;
  mealToEdit?: MealWithResponse | null;
}

export function MealModal({ isOpen, onClose, onSubmit, mealToEdit }: MealModalProps) {
  const isEditing = !!mealToEdit;
  const todayStr = new Date().toISOString().split("T")[0];

  const [mealType, setMealType] = useState<MealType>(mealToEdit?.mealType || "lunch");
  const [date, setDate] = useState<string>(mealToEdit?.date || todayStr);
  const [servingTime, setServingTime] = useState<string>(
    mealToEdit?.servingTime || "12:30 PM – 2:30 PM"
  );
  const [selectionDeadline, setSelectionDeadline] = useState<string>(
    mealToEdit?.selectionDeadline
      ? new Date(mealToEdit.selectionDeadline).toISOString().slice(0, 16)
      : `${todayStr}T10:30`
  );
  const [menu, setMenu] = useState<string>(
    mealToEdit?.menu || "Jeera Rice, Yellow Dal Tadka, Paneer Butter Masala, Phulka Roti, Salad"
  );
  const [specialNote, setSpecialNote] = useState<string>(mealToEdit?.specialNote || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        id: mealToEdit?.id,
        mealType,
        date,
        servingTime,
        selectionDeadline: new Date(selectionDeadline).toISOString(),
        menu,
        specialNote: specialNote.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-[#E8E5DC] shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#646E5E] hover:bg-[#FAF9F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#5A833E]/10 text-[#5A833E] flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F281B]">
              {isEditing ? "Edit Meal Schedule" : "Add Scheduled Meal"}
            </h3>
            <p className="text-xs text-[#646E5E]">
              Configure menu, serving window, and cutoff deadline for students.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#D95D39] bg-[#FDF0EC] p-3 rounded-xl border border-[#F3C5B7]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              >
                <option value="breakfast">🍳 Breakfast</option>
                <option value="lunch">🍲 Lunch</option>
                <option value="dinner">🍽️ Dinner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">
                Serving Time
              </label>
              <input
                type="text"
                value={servingTime}
                onChange={(e) => setServingTime(e.target.value)}
                placeholder="e.g. 12:30 PM – 2:30 PM"
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">
                Cutoff Deadline
              </label>
              <input
                type="datetime-local"
                value={selectionDeadline}
                onChange={(e) => setSelectionDeadline(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">
              Menu Items (comma-separated)
            </label>
            <textarea
              rows={3}
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              placeholder="e.g. Jeera Rice, Yellow Dal, Paneer Butter Masala, Cucumber Salad, Phulka"
              required
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">
              Special Chef Note (optional)
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Fresh Seasonal Mango Kulfi included"
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#646E5E] hover:bg-[#FAF9F5] border border-[#E8E5DC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#5A833E] hover:bg-[#4D7234] text-white shadow-xs transition-colors"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. ADMIN RECORD FOOD WASTE MODAL
// ==========================================
interface WasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wasteData: any) => Promise<void>;
  availableMeals?: { id: number; mealType: string; date: string }[];
}

export function WasteModal({ isOpen, onClose, onSubmit, availableMeals = [] }: WasteModalProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(todayStr);
  const [mealType, setMealType] = useState("lunch");
  const [preparedQuantity, setPreparedQuantity] = useState("170");
  const [servedQuantity, setServedQuantity] = useState("162");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const prep = parseInt(preparedQuantity, 10) || 0;
  const serv = parseInt(servedQuantity, 10) || 0;
  const calcWaste = Math.max(0, prep - serv);
  const wastePct = prep > 0 ? ((calcWaste / prep) * 100).toFixed(1) : "0.0";
  const approxKg = (calcWaste * 0.28).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        date,
        mealType,
        preparedQuantity: prep,
        servedQuantity: serv,
        wastedQuantity: calcWaste,
        wasteKg: parseFloat(approxKg),
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to record waste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md border border-[#E8E5DC] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#646E5E] hover:bg-[#FAF9F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#D95D39]/10 text-[#D95D39] flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F281B]">Log Meal Food Waste</h3>
            <p className="text-xs text-[#646E5E]">
              Track prepared vs served quantities to measure mess preparation efficiency.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#D95D39] bg-[#FDF0EC] p-3 rounded-xl border border-[#F3C5B7]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Meal</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">
                Portions Prepared
              </label>
              <input
                type="number"
                min="0"
                value={preparedQuantity}
                onChange={(e) => setPreparedQuantity(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">
                Portions Served
              </label>
              <input
                type="number"
                min="0"
                value={servedQuantity}
                onChange={(e) => setServedQuantity(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
          </div>

          {/* Automatic Calculation Preview */}
          <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E8E5DC] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[#646E5E] block text-[10px] uppercase">Wasted</span>
              <span className="text-sm font-bold text-[#D95D39]">{calcWaste} portions</span>
            </div>
            <div>
              <span className="text-[#646E5E] block text-[10px] uppercase">Approx Kg</span>
              <span className="text-sm font-bold text-[#1F281B]">{approxKg} kg</span>
            </div>
            <div>
              <span className="text-[#646E5E] block text-[10px] uppercase">Waste %</span>
              <span className="text-sm font-bold text-[#5A833E]">{wastePct}%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">
              Kitchen Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Accurate attendance notice from students"
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#646E5E] hover:bg-[#FAF9F5] border border-[#E8E5DC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D95D39] hover:bg-[#C85338] text-white shadow-xs transition-colors"
            >
              {loading ? "Recording..." : "Record Waste Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. STUDENT PROFILE & PREFERENCES MODAL
// ==========================================
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdate: (data: any) => Promise<void>;
}

export function ProfileModal({ isOpen, onClose, user, onUpdate }: ProfileModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [hostel, setHostel] = useState(user?.hostel || "Block B - Kaveri");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "B-204");
  const [dietaryPreference, setDietaryPreference] = useState(
    user?.dietaryPreference || "Vegetarian"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onUpdate({
        id: user.id,
        name,
        hostel,
        roomNumber,
        dietaryPreference,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md border border-[#E8E5DC] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#646E5E] hover:bg-[#FAF9F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#5A833E]/10 text-[#5A833E] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F281B]">Profile & Preferences</h3>
            <p className="text-xs text-[#646E5E]">Manage hostel room details and dietary tags.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#D95D39] bg-[#FDF0EC] p-3 rounded-xl border border-[#F3C5B7]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Hostel Block</label>
              <input
                type="text"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">
              Dietary Preference
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#646E5E] hover:bg-[#FAF9F5] border border-[#E8E5DC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#5A833E] hover:bg-[#4D7234] text-white shadow-xs transition-colors"
            >
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. AUTH MODAL (LOGIN & SIGN UP)
// ==========================================
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string) => Promise<void>;
  onSignup: (payload: any) => Promise<void>;
  onDemoSwitch: (role: "student" | "admin") => Promise<void>;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  onDemoSwitch,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [hostel, setHostel] = useState("Kaveri Hostel");
  const [roomNumber, setRoomNumber] = useState("B-101");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await onLogin(email, password || "demo");
      } else {
        await onSignup({
          name,
          email,
          password: password || "demo",
          studentId,
          hostel,
          roomNumber,
          role,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md border border-[#E8E5DC] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#646E5E] hover:bg-[#FAF9F5]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#5A833E]/10 text-[#5A833E] flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#1F281B]">
            {mode === "login" ? "Sign In to Smart Mess" : "Join Smart Mess"}
          </h3>
          <p className="text-xs text-[#646E5E] mt-1">
            Eat smart, declare preferences, and stop campus food waste.
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick Select */}
        <div className="mb-4 bg-[#FAF9F5] p-3 rounded-2xl border border-[#E8E5DC]">
          <span className="text-[11px] font-semibold text-[#646E5E] uppercase tracking-wider block mb-2 text-center">
            ⚡ Quick 1-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                await onDemoSwitch("student");
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-white border border-[#E8E5DC] hover:border-[#5A833E] text-xs font-semibold text-[#1F281B] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#5A833E]" />
              Student (Aarav)
            </button>
            <button
              type="button"
              onClick={async () => {
                await onDemoSwitch("admin");
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-white border border-[#E8E5DC] hover:border-[#5A833E] text-xs font-semibold text-[#1F281B] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#5A833E]" />
              Mess Admin (Rajesh)
            </button>
          </div>
        </div>

        <div className="flex border-b border-[#E8E5DC] mb-4">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              mode === "login"
                ? "border-[#5A833E] text-[#5A833E]"
                : "border-transparent text-[#646E5E] hover:text-[#1F281B]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
              mode === "signup"
                ? "border-[#5A833E] text-[#5A833E]"
                : "border-transparent text-[#646E5E] hover:text-[#1F281B]"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-[#D95D39] bg-[#FDF0EC] p-3 rounded-xl border border-[#F3C5B7]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#1F281B] mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Ananya Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. student@smartmess.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F281B] mb-1">
              Password <span className="font-normal text-[#646E5E]">(Optional for demo)</span>
            </label>
            <input
              type="password"
              placeholder="demo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#5A833E]"
            />
          </div>

          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1F281B] mb-1">Hostel Block</label>
                  <input
                    type="text"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F281B] mb-1">Room No.</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F281B] mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-[#E8E5DC] p-2.5 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="admin">Mess Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#5A833E] hover:bg-[#4D7234] text-white shadow-xs transition-colors"
            >
              {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
