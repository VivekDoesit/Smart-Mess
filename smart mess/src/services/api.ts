import {
  UserProfile,
  MealWithResponse,
  AttendanceDetailItem,
  FoodWasteItem,
  AppNotification,
  StudentImpactStats,
  HostelOverviewStats,
  AttendanceStatus,
} from "@/types";

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "An unexpected error occurred");
  }
  return data;
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: UserProfile }> {
    return fetchJson("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", email, password }),
    });
  },

  async signup(payload: {
    name: string;
    email: string;
    password?: string;
    studentId?: string;
    hostel?: string;
    roomNumber?: string;
    role?: "student" | "admin";
    dietaryPreference?: string;
  }): Promise<{ user: UserProfile }> {
    return fetchJson("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "signup", ...payload }),
    });
  },

  async getMe(email: string): Promise<{ user: UserProfile }> {
    return fetchJson(`/api/auth?email=${encodeURIComponent(email)}`);
  },

  async getAllDemoUsers(): Promise<{ users: UserProfile[] }> {
    return fetchJson("/api/auth");
  },

  // Meals
  async getMeals(params?: {
    view?: "today" | "upcoming" | "all";
    userId?: number;
    date?: string;
  }): Promise<{ meals: MealWithResponse[]; totalStudents: number }> {
    const q = new URLSearchParams();
    if (params?.view) q.set("view", params.view);
    if (params?.userId) q.set("userId", params.userId.toString());
    if (params?.date) q.set("date", params.date);
    return fetchJson(`/api/meals?${q.toString()}`);
  },

  async createMeal(payload: {
    mealType: string;
    date: string;
    menu: string;
    servingTime: string;
    selectionDeadline: string;
    specialNote?: string;
  }) {
    return fetchJson("/api/meals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateMeal(payload: {
    id: number;
    mealType?: string;
    date?: string;
    menu?: string;
    servingTime?: string;
    selectionDeadline?: string;
    specialNote?: string;
  }) {
    return fetchJson("/api/meals", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteMeal(id: number) {
    return fetchJson(`/api/meals?id=${id}`, {
      method: "DELETE",
    });
  },

  // Responses
  async submitResponse(payload: {
    studentId: number;
    mealId: number;
    status: AttendanceStatus;
    note?: string;
    forceOverride?: boolean;
  }): Promise<{
    success: boolean;
    counts: { attending: number; skipping: number; notResponded: number };
    message: string;
  }> {
    return fetchJson("/api/responses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Admin Attendance
  async getAdminAttendance(mealId?: number): Promise<{
    meal: any;
    allMeals: { id: number; mealType: string; date: string; menu: string; servingTime: string }[];
    summary: {
      totalStudents: number;
      expectedAttendance: number;
      skipping: number;
      notResponded: number;
      attendanceRatePercent: number;
    };
    students: AttendanceDetailItem[];
  }> {
    const q = mealId ? `?mealId=${mealId}` : "";
    return fetchJson(`/api/admin/attendance${q}`);
  },

  // Food Waste
  async getFoodWaste(): Promise<{
    records: FoodWasteItem[];
    summary: {
      totalRecords: number;
      totalPreparedPortions: number;
      totalServedPortions: number;
      totalWastedPortions: number;
      totalWasteKg: number;
      averageWastePercent: number;
    };
  }> {
    return fetchJson("/api/waste");
  },

  async createFoodWaste(payload: {
    mealId?: number;
    date: string;
    mealType: string;
    preparedQuantity: number;
    servedQuantity: number;
    wastedQuantity?: number;
    wasteKg?: number;
    notes?: string;
  }) {
    return fetchJson("/api/waste", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async deleteFoodWaste(id: number) {
    return fetchJson(`/api/waste?id=${id}`, {
      method: "DELETE",
    });
  },

  // Stats
  async getStats(userId?: number): Promise<{
    hostel: HostelOverviewStats;
    student: StudentImpactStats | null;
  }> {
    const q = userId ? `?userId=${userId}` : "";
    return fetchJson(`/api/stats${q}`);
  },

  // Notifications
  async getNotifications(userId?: number): Promise<{ notifications: AppNotification[] }> {
    const q = userId ? `?userId=${userId}` : "";
    return fetchJson(`/api/notifications${q}`);
  },

  async markNotificationRead(id?: number, markAllRead?: boolean, userId?: number) {
    return fetchJson("/api/notifications", {
      method: "PUT",
      body: JSON.stringify({ id, markAllRead, userId }),
    });
  },

  async broadcastNotification(payload: { title: string; message: string; type?: string }) {
    return fetchJson("/api/notifications", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Profile
  async updateProfile(payload: {
    id: number;
    name?: string;
    hostel?: string;
    roomNumber?: string;
    dietaryPreference?: string;
  }): Promise<{ success: boolean; user: UserProfile }> {
    return fetchJson("/api/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};
