import { pgTable, serial, text, integer, timestamp, boolean, real, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().default("demo123"),
  studentId: text("student_id"),
  hostel: text("hostel").default("Block B - Kaveri"),
  roomNumber: text("room_number").default("B-204"),
  role: text("role").notNull().default("student"), // 'student' | 'admin'
  dietaryPreference: text("dietary_preference").default("Vegetarian"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner'
  date: text("date").notNull(), // 'YYYY-MM-DD'
  menu: text("menu").notNull(), // e.g. "Aloo Paratha, Curd, Tea, Seasonal Fruit"
  servingTime: text("serving_time").notNull(), // e.g. "8:00 AM - 10:00 AM"
  selectionDeadline: text("selection_deadline").notNull(), // ISO string e.g. "2026-04-18T07:30:00Z"
  specialNote: text("special_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mealResponses = pgTable(
  "meal_responses",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mealId: integer("meal_id")
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    status: text("status").notNull(), // 'attending' | 'skipping' | 'not_responded'
    note: text("note"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("student_meal_unique_idx").on(table.studentId, table.mealId),
  ]
);

export const foodWaste = pgTable("food_waste", {
  id: serial("id").primaryKey(),
  mealId: integer("meal_id").references(() => meals.id, { onDelete: "set null" }),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(),
  preparedQuantity: integer("prepared_quantity").notNull(), // in portions
  servedQuantity: integer("served_quantity").notNull(), // in portions
  wastedQuantity: integer("wasted_quantity").notNull(), // in portions
  wasteKg: real("waste_kg").default(0), // in kg
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }), // null means for all users
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // 'reminder' | 'impact' | 'alert' | 'system'
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messSettings = pgTable("mess_settings", {
  id: serial("id").primaryKey(),
  hostelName: text("hostel_name").notNull().default("Kaveri Hostel Mess"),
  campusName: text("campus_name").notNull().default("National Institute of Technology"),
  totalRegisteredStudents: integer("total_registered_students").notNull().default(220),
  defaultBreakfastDeadline: text("default_breakfast_deadline").notNull().default("07:30"),
  defaultLunchDeadline: text("default_lunch_deadline").notNull().default("10:30"),
  defaultDinnerDeadline: text("default_dinner_deadline").notNull().default("17:00"),
  allowLateChanges: boolean("allow_late_changes").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type MealResponse = typeof mealResponses.$inferSelect;
export type FoodWasteRecord = typeof foodWaste.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type MessSetting = typeof messSettings.$inferSelect;
