export type UserRole = "student" | "admin";

export type MealType = "breakfast" | "lunch" | "dinner";

export type AttendanceStatus = "attending" | "skipping" | "not_responded";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  studentId?: string | null;
  hostel?: string | null;
  roomNumber?: string | null;
  role: UserRole;
  dietaryPreference?: string | null;
  createdAt?: string;
}

export interface MealWithResponse {
  id: number;
  mealType: MealType;
  date: string;
  menu: string;
  servingTime: string;
  selectionDeadline: string;
  specialNote?: string | null;
  // Current user response
  userStatus: AttendanceStatus;
  userNote?: string | null;
  updatedAt?: string | null;
  // Aggregate counts
  attendingCount: number;
  skippingCount: number;
  notRespondedCount: number;
  totalStudents: number;
  // Computed helpers
  isDeadlinePassed: boolean;
  deadlineFormatted: string;
}

export interface AttendanceDetailItem {
  id: number;
  studentId: number;
  name: string;
  studentCode: string;
  hostel: string;
  roomNumber: string;
  dietaryPreference: string;
  status: AttendanceStatus;
  note?: string | null;
  updatedAt: string;
}

export interface FoodWasteItem {
  id: number;
  mealId?: number | null;
  date: string;
  mealType: string;
  preparedQuantity: number;
  servedQuantity: number;
  wastedQuantity: number;
  wasteKg: number;
  wastePercentage: number;
  efficiencyPercentage: number;
  notes?: string | null;
  recordedAt: string;
}

export interface AppNotification {
  id: number;
  userId?: number | null;
  title: string;
  message: string;
  type: "reminder" | "impact" | "alert" | "system" | "info";
  read: boolean;
  createdAt: string;
}

export interface StudentImpactStats {
  mealsPlanned: number;
  mealsSkipped: number;
  estimatedMealsSaved: number;
  attendanceRate: number;
  co2SavedKgEstimate: number; // approximate 0.45kg CO2e per meal portion prevented from food waste
  ecoLevel: string;
  ecoBadgeTitle: string;
  streakDays: number;
}

export interface HostelOverviewStats {
  totalRegistered: number;
  todayBreakfastExpected: number;
  todayLunchExpected: number;
  todayDinnerExpected: number;
  overallParticipationRate: number;
  totalMealsSkippedThisMonth: number;
  weeklyFoodWasteKg: number;
  averageWastePercent: number;
  wasteTrend: { day: string; date: string; wastedPortions: number; wasteKg: number }[];
  mealDistribution: { mealType: string; attending: number; skipping: number; notResponded: number }[];
}
