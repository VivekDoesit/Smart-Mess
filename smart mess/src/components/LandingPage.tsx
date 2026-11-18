"use client";

import React, { useState } from "react";
import {
  Leaf,
  Check,
  X,
  Clock,
  Shield,
  ArrowRight,
  TrendingDown,
  Users,
  Utensils,
  Sparkles,
  BarChart3,
  Scale,
  Compass,
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: (role?: "student" | "admin") => void;
}

export function LandingPage({ onEnterApp }: LandingPageProps) {
  // Interactive mini meal selector state inside hero
  const [heroChoice, setHeroChoice] = useState<"attending" | "skipping" | null>("attending");
  const [heroAttending, setHeroAttending] = useState(164);
  const [heroSkipping, setHeroSkipping] = useState(16);

  // Impact slider
  const [hostelSize, setHostelSize] = useState(250);

  const handleHeroChoice = (choice: "attending" | "skipping") => {
    if (choice === heroChoice) return;
    if (choice === "attending") {
      setHeroAttending((prev) => prev + 1);
      if (heroChoice === "skipping") setHeroSkipping((prev) => Math.max(0, prev - 1));
    } else {
      setHeroSkipping((prev) => prev + 1);
      if (heroChoice === "attending") setHeroAttending((prev) => Math.max(0, prev - 1));
    }
    setHeroChoice(choice);
  };

  const estFoodSavedKgPerMonth = Math.round(hostelSize * 0.18 * 4.2);
  const estPortionsSavedPerWeek = Math.round(hostelSize * 0.22 * 7);
  const estCo2PreventedKg = Math.round(estFoodSavedKgPerMonth * 1.8);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F281B] selection:bg-[#D6E79D] selection:text-[#1F281B]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#D6E79D]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E5DC] shadow-xs text-xs font-semibold text-[#4D7234] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5A833E] animate-pulse" />
              <span>Hostel Food Waste Reduction & Meal Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1F281B] leading-[1.12]">
              Eat Smart. <span className="text-[#5A833E]">Waste Less.</span>
            </h1>

            <p className="mt-5 text-base sm:text-xl text-[#646E5E] leading-relaxed max-w-2xl mx-auto">
              A smarter way for university hostel messes to plan meals, match real student turnout, and eliminate unnecessary food waste before it's ever cooked.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onEnterApp("student")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#5A833E] hover:bg-[#4D7234] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEnterApp("admin")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FAF9F5] text-[#1F281B] border border-[#E8E5DC] text-sm font-semibold shadow-2xs flex items-center justify-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-[#5A833E]" />
                <span>Admin Mess Ops</span>
              </button>
            </div>
          </div>

          {/* Interactive Hero Visual: Live Meal Card Simulator */}
          <div className="mt-14 max-w-xl mx-auto">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-[#646E5E] uppercase tracking-wider">
                ✨ Try the interactive student decision card:
              </span>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-[#E8E5DC] shadow-[0_12px_40px_rgba(35,45,30,0.08)] ring-1 ring-black/5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">🍲</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F281B]">Today's Lunch</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#646E5E]">
                      <Clock className="w-3.5 h-3.5 text-[#5A833E]" />
                      <span>12:30 PM – 2:30 PM</span>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4D7234] bg-[#D6E79D]/40 px-2.5 py-1 rounded-full border border-[#D6E79D]">
                  <Clock className="w-3 h-3" /> Cutoff: 10:30 AM
                </span>
              </div>

              {/* Menu items */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Jeera Rice", "Dal Tadka", "Paneer Butter Masala", "Cucumber Salad", "Tawa Roti"].map(
                  (item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#E8E5DC] text-[#1F281B] font-medium"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>

              {/* Status Banner */}
              <div className="mt-5 pt-4 border-t border-[#E8E5DC]/80">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-[#646E5E] font-medium">Your choice right now:</span>
                  {heroChoice === "attending" ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#4D7234] bg-[#D6E79D]/40 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> Eating this meal
                    </span>
                  ) : heroChoice === "skipping" ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-[#D95D39] bg-[#FDF0EC] px-2.5 py-0.5 rounded-full">
                      <X className="w-3.5 h-3.5" /> Skipped (Kitchen informed)
                    </span>
                  ) : (
                    <span className="text-[#646E5E]">Choose below</span>
                  )}
                </div>

                {/* 2 Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleHeroChoice("attending")}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      heroChoice === "attending"
                        ? "bg-[#5A833E] text-white shadow-sm ring-2 ring-[#5A833E]/30"
                        : "bg-[#FAF9F5] hover:bg-white text-[#1F281B] border border-[#E8E5DC]"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>✓ I'll Eat</span>
                  </button>

                  <button
                    onClick={() => handleHeroChoice("skipping")}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                      heroChoice === "skipping"
                        ? "bg-[#D95D39] text-white shadow-sm ring-2 ring-[#D95D39]/30"
                        : "bg-[#FAF9F5] hover:bg-white text-[#1F281B] border border-[#E8E5DC]"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>× I'll Skip</span>
                  </button>
                </div>

                {/* Live Demand Bar */}
                <div className="mt-4 pt-3 border-t border-[#E8E5DC]/60 flex items-center justify-between text-xs text-[#646E5E]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5A833E]" />
                    <span>
                      Kitchen demand: <strong className="text-[#1F281B]">{heroAttending}</strong> attending
                    </span>
                  </span>
                  <span className="text-[#D95D39] font-medium">{heroSkipping} skipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-20 bg-white border-y border-[#E8E5DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D95D39] block mb-2">
              The Hostel Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F281B] tracking-tight">
              Why Campus Messes Waste Huge Quantities of Food
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#646E5E]">
              Mess cooks prepare food blindly based on registered headcounts, unaware that students skip meals for countless valid daily reasons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-[#E8E5DC]">
              <div className="w-10 h-10 rounded-2xl bg-[#D95D39]/10 text-[#D95D39] flex items-center justify-center mb-4">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F281B]">Fixed Headcount Guesswork</h3>
              <p className="mt-2 text-xs text-[#646E5E] leading-relaxed">
                If 200 students are registered, chefs cook for 200. Yet on any given Friday evening, 40 students may be eating out or working in labs.
              </p>
            </div>

            <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-[#E8E5DC]">
              <div className="w-10 h-10 rounded-2xl bg-[#D95D39]/10 text-[#D95D39] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F281B]">No Advance Notice Channel</h3>
              <p className="mt-2 text-xs text-[#646E5E] leading-relaxed">
                Students had no structured, zero-friction way to alert the kitchen before raw grains and vegetables entered the boiling pots.
              </p>
            </div>

            <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-[#E8E5DC]">
              <div className="w-10 h-10 rounded-2xl bg-[#5A833E]/10 text-[#5A833E] flex items-center justify-center mb-4">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F281B]">Smart Mess Solution</h3>
              <p className="mt-2 text-xs text-[#646E5E] leading-relaxed">
                A simple 2-second tap locks in attendance before strict preparation cutoffs, allowing staff to scale batches down with total confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <section className="py-20 bg-[#FAF9F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A833E] block mb-2">
              Simple 4-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F281B] tracking-tight">
              How Smart Mess Closes the Food Waste Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Student Declares Choice",
                desc: "Check today's menu on mobile and tap 'Eat' or 'Skip' before the designated meal cutoff.",
                icon: "📱",
              },
              {
                step: "02",
                title: "Real-Time Demand Tabulation",
                desc: "The system calculates exact expected eaters, skipping students, and non-responders separately.",
                icon: "📊",
              },
              {
                step: "03",
                title: "Mess Prepares Exact Batches",
                desc: "Kitchen staff consult the admin dashboard to scale rice, curries, and rotis to exact required portions.",
                icon: "👨‍🍳",
              },
              {
                step: "04",
                title: "Waste Reduction & Impact",
                desc: "Surplus cooking drops dramatically. Students see their personal carbon & meal savings accumulate.",
                icon: "🌱",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white rounded-3xl p-6 border border-[#E8E5DC] shadow-[0_4px_20px_rgba(35,45,30,0.03)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl select-none">{st.icon}</span>
                    <span className="text-xs font-bold text-[#5A833E] bg-[#D6E79D]/40 px-2 py-0.5 rounded-md">
                      Step {st.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1F281B]">{st.title}</h3>
                  <p className="mt-2 text-xs text-[#646E5E] leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CAMPUS IMPACT CALCULATOR */}
      <section className="py-20 bg-white border-t border-[#E8E5DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A833E] block mb-2">
              Interactive Campus Simulator
            </span>
            <h2 className="text-3xl font-extrabold text-[#1F281B] tracking-tight">
              See the Impact on Your Hostel
            </h2>
            <p className="text-xs sm:text-sm text-[#646E5E] mt-2">
              Drag the slider to calculate estimated food and carbon emissions saved.
            </p>
          </div>

          <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 border border-[#E8E5DC]">
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm font-semibold text-[#1F281B] mb-2">
                <span>Hostel Capacity</span>
                <span className="text-[#5A833E] text-base font-bold">{hostelSize} students</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={hostelSize}
                onChange={(e) => setHostelSize(parseInt(e.target.value, 10))}
                className="w-full accent-[#5A833E] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#646E5E] mt-1">
                <span>50 (Small Wing)</span>
                <span>400 (Medium Hostel)</span>
                <span>800 (Large Campus Block)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E5DC]">
              <div className="bg-white p-4 rounded-2xl border border-[#E8E5DC] text-center">
                <span className="text-xs text-[#646E5E] block font-medium">Est. Food Saved</span>
                <span className="text-2xl font-extrabold text-[#5A833E] mt-1 block">
                  ~{estFoodSavedKgPerMonth} <span className="text-sm font-normal">kg/month</span>
                </span>
                <span className="text-[11px] text-[#646E5E]">from overcooked surplus</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E8E5DC] text-center">
                <span className="text-xs text-[#646E5E] block font-medium">Portions Preserved</span>
                <span className="text-2xl font-extrabold text-[#1F281B] mt-1 block">
                  ~{estPortionsSavedPerWeek} <span className="text-sm font-normal">portions/wk</span>
                </span>
                <span className="text-[11px] text-[#646E5E]">not wasted in bins</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E8E5DC] text-center">
                <span className="text-xs text-[#646E5E] block font-medium">CO₂e Averted</span>
                <span className="text-2xl font-extrabold text-[#4D7234] mt-1 block">
                  ~{estCo2PreventedKg} <span className="text-sm font-normal">kg CO₂e</span>
                </span>
                <span className="text-[11px] text-[#646E5E]">reduced campus footprint</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FUTURE AI PREDICTION VISION */}
      <section className="py-16 bg-[#FAF9F5] border-t border-[#E8E5DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E8E5DC] shadow-[0_4px_24px_rgba(35,45,30,0.04)] relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E5DC] text-xs font-semibold text-[#5A833E] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#5A833E]" />
              <span>Smart Demand Prediction — Future AI Model</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1F281B]">
              Predictive Meal Turnout Before Deadlines Even Close
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#646E5E] leading-relaxed">
              Future releases of Smart Mess integrate machine learning to analyze historical attendance patterns, weather forecasts (e.g. rain keeps students in), semester exam weeks, and holidays to forecast turnout accurately even for students who haven't responded yet.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-[#FAF9F5] border border-[#E8E5DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-[#1F281B] block">
                  Simulated Model Preview:
                </span>
                <span className="text-[#646E5E]">
                  Tomorrow's Dinner predicted turnout:{" "}
                  <strong className="text-[#5A833E]">154–168 students</strong> (92% confidence)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#646E5E] bg-white px-2.5 py-1 rounded-lg border border-[#E8E5DC]">
                Simulated Demonstration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER */}
      <section className="py-16 bg-[#1F281B] text-white text-center px-4">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#5A833E] flex items-center justify-center mx-auto mb-4 text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Start Making Every Meal Count
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-md mx-auto">
            Ready to test student attendance declaration or explore the mess kitchen administration dashboard?
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnterApp("student")}
              className="px-6 py-3 rounded-2xl bg-[#D6E79D] hover:bg-[#c8de84] text-[#1F281B] text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              Open Student Portal
            </button>
            <button
              onClick={() => onEnterApp("admin")}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all"
            >
              Open Mess Admin Dashboard
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/50 space-y-1">
            <p>
              <strong className="text-white">Smart Mess</strong> • <em>Eat Smart. Waste Less.</em>
            </p>
            <p>Built for a more sustainable campus 🌱</p>
          </div>
        </div>
      </section>
    </div>
  );
}
