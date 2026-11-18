import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals, mealResponses, users, messSettings } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function GET(request: NextRequest) {
  await ensureDatabaseSeeded();

  const url = new URL(request.url);
  const mealIdParam = url.searchParams.get("mealId");

  try {
    // If no mealId provided, pick today's lunch or nearest meal
    let mealId: number;
    if (mealIdParam) {
      mealId = parseInt(mealIdParam, 10);
    } else {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayMeals = await db
        .select()
        .from(meals)
        .where(eq(meals.date, todayStr))
        .limit(1);

      if (todayMeals.length > 0) {
        mealId = todayMeals[0].id;
      } else {
        const anyMeal = await db.select().from(meals).limit(1);
        if (anyMeal.length === 0) {
          return NextResponse.json({ error: "No meals found" }, { status: 404 });
        }
        mealId = anyMeal[0].id;
      }
    }

    // Get the meal details
    const mealList = await db.select().from(meals).where(eq(meals.id, mealId)).limit(1);
    if (mealList.length === 0) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }
    const currentMeal = mealList[0];

    // Get all students
    const allStudents = await db
      .select({
        id: users.id,
        name: users.name,
        studentCode: users.studentId,
        hostel: users.hostel,
        roomNumber: users.roomNumber,
        dietaryPreference: users.dietaryPreference,
      })
      .from(users)
      .where(eq(users.role, "student"));

    // Get responses for this meal
    const responses = await db
      .select()
      .from(mealResponses)
      .where(eq(mealResponses.mealId, mealId));

    const responseMap = new Map<number, { status: string; note: string | null; updatedAt: Date }>();
    for (const r of responses) {
      responseMap.set(r.studentId, {
        status: r.status,
        note: r.note,
        updatedAt: r.updatedAt,
      });
    }

    // Format student attendance breakdown
    let attendingCount = 0;
    let skippingCount = 0;
    let notRespondedCount = 0;

    const studentRows = allStudents.map((s) => {
      const resp = responseMap.get(s.id);
      const status = (resp?.status || "not_responded") as "attending" | "skipping" | "not_responded";

      if (status === "attending") attendingCount++;
      else if (status === "skipping") skippingCount++;
      else notRespondedCount++;

      return {
        studentId: s.id,
        name: s.name,
        studentCode: s.studentCode || `STU-${s.id}`,
        hostel: s.hostel || "Kaveri Hostel",
        roomNumber: s.roomNumber || "N/A",
        dietaryPreference: s.dietaryPreference || "Vegetarian",
        status: status,
        note: resp?.note || null,
        updatedAt: resp?.updatedAt ? resp.updatedAt.toISOString() : currentMeal.createdAt.toISOString(),
      };
    });

    // Also get all available meals for the dropdown selector
    const allMeals = await db
      .select({
        id: meals.id,
        mealType: meals.mealType,
        date: meals.date,
        menu: meals.menu,
        servingTime: meals.servingTime,
      })
      .from(meals)
      .orderBy(sql`${meals.date} DESC, ${meals.mealType} ASC`)
      .limit(20);

    return NextResponse.json({
      meal: currentMeal,
      allMeals,
      summary: {
        totalStudents: allStudents.length,
        expectedAttendance: attendingCount,
        skipping: skippingCount,
        notResponded: notRespondedCount,
        attendanceRatePercent:
          allStudents.length > 0 ? Math.round((attendingCount / allStudents.length) * 100) : 0,
      },
      students: studentRows,
    });
  } catch (error: any) {
    console.error("Error fetching admin attendance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch attendance data" },
      { status: 500 }
    );
  }
}
