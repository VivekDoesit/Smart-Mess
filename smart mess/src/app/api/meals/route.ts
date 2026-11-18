import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals, mealResponses, users, messSettings } from "@/db/schema";
import { eq, and, sql, gte, desc, asc } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function GET(request: NextRequest) {
  await ensureDatabaseSeeded();

  const url = new URL(request.url);
  const view = url.searchParams.get("view") || "all";
  const dateParam = url.searchParams.get("date");
  const userIdStr = url.searchParams.get("userId");
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    // Get total registered student count
    const settingsList = await db.select().from(messSettings).limit(1);
    const registeredCount = settingsList[0]?.totalRegisteredStudents || 180;

    // Fetch meals based on filter
    let query = db.select().from(meals);

    let mealRecords;
    if (dateParam) {
      mealRecords = await db
        .select()
        .from(meals)
        .where(eq(meals.date, dateParam))
        .orderBy(asc(meals.date), asc(meals.mealType));
    } else if (view === "today") {
      mealRecords = await db
        .select()
        .from(meals)
        .where(eq(meals.date, todayStr))
        .orderBy(asc(meals.mealType));
    } else if (view === "upcoming") {
      mealRecords = await db
        .select()
        .from(meals)
        .where(gte(meals.date, todayStr))
        .orderBy(asc(meals.date), asc(meals.mealType));
    } else {
      mealRecords = await db
        .select()
        .from(meals)
        .orderBy(desc(meals.date), asc(meals.mealType))
        .limit(30);
    }

    // Now gather user responses and aggregate statistics for these meals
    const mealIds = mealRecords.map((m) => m.id);

    // Fetch user responses for current user if userId provided
    let userResponsesMap = new Map<number, { status: string; note: string | null; updatedAt: Date }>();
    if (userId && mealIds.length > 0) {
      const userResp = await db
        .select()
        .from(mealResponses)
        .where(eq(mealResponses.studentId, userId));

      for (const r of userResp) {
        userResponsesMap.set(r.mealId, {
          status: r.status,
          note: r.note,
          updatedAt: r.updatedAt,
        });
      }
    }

    // Fetch aggregate responses for each meal
    const aggregates = await db
      .select({
        mealId: mealResponses.mealId,
        status: mealResponses.status,
        count: sql<number>`count(*)::int`,
      })
      .from(mealResponses)
      .groupBy(mealResponses.mealId, mealResponses.status);

    const countsMap = new Map<number, { attending: number; skipping: number; notResponded: number }>();
    for (const agg of aggregates) {
      if (!countsMap.has(agg.mealId)) {
        countsMap.set(agg.mealId, { attending: 0, skipping: 0, notResponded: 0 });
      }
      const entry = countsMap.get(agg.mealId)!;
      if (agg.status === "attending") entry.attending = agg.count;
      else if (agg.status === "skipping") entry.skipping = agg.count;
      else entry.notResponded = agg.count;
    }

    const now = new Date();

    const formattedMeals = mealRecords.map((meal) => {
      const userResp = userResponsesMap.get(meal.id);
      const counts = countsMap.get(meal.id) || { attending: 0, skipping: 0, notResponded: 0 };

      // Calculate not responded as either explicit records or remaining from total students
      const knownResponses = counts.attending + counts.skipping;
      const notResponded = Math.max(0, registeredCount - knownResponses);

      // Deadline check
      const deadlineDate = new Date(meal.selectionDeadline);
      const isDeadlinePassed = now > deadlineDate;

      const deadlineFormatted = deadlineDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return {
        id: meal.id,
        mealType: meal.mealType,
        date: meal.date,
        menu: meal.menu,
        servingTime: meal.servingTime,
        selectionDeadline: meal.selectionDeadline,
        specialNote: meal.specialNote,
        userStatus: (userResp?.status as any) || "not_responded",
        userNote: userResp?.note || null,
        updatedAt: userResp?.updatedAt ? userResp.updatedAt.toISOString() : null,
        attendingCount: counts.attending,
        skippingCount: counts.skipping,
        notRespondedCount: notResponded,
        totalStudents: registeredCount,
        isDeadlinePassed,
        deadlineFormatted,
      };
    });

    return NextResponse.json({ meals: formattedMeals, totalStudents: registeredCount });
  } catch (error: any) {
    console.error("Error fetching meals:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mealType, date, menu, servingTime, selectionDeadline, specialNote } = body;

    if (!mealType || !date || !menu || !servingTime || !selectionDeadline) {
      return NextResponse.json(
        { error: "Meal type, date, menu, serving time, and deadline are required" },
        { status: 400 }
      );
    }

    const [newMeal] = await db
      .insert(meals)
      .values({
        mealType: mealType.toLowerCase(),
        date: date.trim(),
        menu: menu.trim(),
        servingTime: servingTime.trim(),
        selectionDeadline: new Date(selectionDeadline).toISOString(),
        specialNote: specialNote ? specialNote.trim() : null,
      })
      .returning();

    return NextResponse.json({ success: true, meal: newMeal });
  } catch (error: any) {
    console.error("Error creating meal:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create meal" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, mealType, date, menu, servingTime, selectionDeadline, specialNote } = body;

    if (!id) {
      return NextResponse.json({ error: "Meal ID is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(meals)
      .set({
        mealType: mealType ? mealType.toLowerCase() : undefined,
        date: date ? date.trim() : undefined,
        menu: menu ? menu.trim() : undefined,
        servingTime: servingTime ? servingTime.trim() : undefined,
        selectionDeadline: selectionDeadline ? new Date(selectionDeadline).toISOString() : undefined,
        specialNote: specialNote !== undefined ? specialNote : undefined,
      })
      .where(eq(meals.id, id))
      .returning();

    return NextResponse.json({ success: true, meal: updated });
  } catch (error: any) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update meal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Meal ID is required" }, { status: 400 });
    }

    await db.delete(meals).where(eq(meals.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, message: "Meal deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting meal:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete meal" },
      { status: 500 }
    );
  }
}
