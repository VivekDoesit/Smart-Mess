import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals, mealResponses, messSettings, notifications } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function POST(request: NextRequest) {
  await ensureDatabaseSeeded();

  try {
    const body = await request.json();
    const { studentId, mealId, status, note, forceOverride } = body;

    if (!studentId || !mealId || !status) {
      return NextResponse.json(
        { error: "Student ID, Meal ID, and status are required" },
        { status: 400 }
      );
    }

    if (!["attending", "skipping", "not_responded"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'attending', 'skipping', or 'not_responded'" },
        { status: 400 }
      );
    }

    // 1. Fetch meal to check deadline
    const mealList = await db.select().from(meals).where(eq(meals.id, mealId)).limit(1);
    if (mealList.length === 0) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    const meal = mealList[0];
    const deadline = new Date(meal.selectionDeadline);
    const now = new Date();

    // Check mess settings for late changes
    const settingsList = await db.select().from(messSettings).limit(1);
    const allowLateChanges = settingsList[0]?.allowLateChanges || false;

    if (now > deadline && !allowLateChanges && !forceOverride) {
      const deadlineStr = deadline.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return NextResponse.json(
        {
          error: `The selection deadline for this ${meal.mealType} passed at ${deadlineStr}. Preferences are now locked so kitchen preparation can proceed.`,
          locked: true,
        },
        { status: 403 }
      );
    }

    // 2. Check if an existing response exists
    const existing = await db
      .select()
      .from(mealResponses)
      .where(
        and(
          eq(mealResponses.studentId, studentId),
          eq(mealResponses.mealId, mealId)
        )
      )
      .limit(1);

    let updatedResponse;
    if (existing.length > 0) {
      const [res] = await db
        .update(mealResponses)
        .set({
          status: status,
          note: note !== undefined ? note : existing[0].note,
          updatedAt: new Date(),
        })
        .where(eq(mealResponses.id, existing[0].id))
        .returning();
      updatedResponse = res;
    } else {
      const [res] = await db
        .insert(mealResponses)
        .values({
          studentId: studentId,
          mealId: mealId,
          status: status,
          note: note || null,
        })
        .returning();
      updatedResponse = res;
    }

    // If student marked 'skipping', maybe add an encouragement notification if not already done today
    if (status === "skipping") {
      try {
        await db.insert(notifications).values({
          userId: studentId,
          title: `🌱 Meal Skipped: ${meal.mealType.toUpperCase()}`,
          message: `You marked skipping for ${meal.mealType} (${meal.date}). Kitchen counts have been adjusted to prevent overcooking!`,
          type: "impact",
          read: false,
        });
      } catch (e) {
        // notification is non-blocking
      }
    }

    // Return latest counts for this meal
    const aggregates = await db
      .select({
        status: mealResponses.status,
        count: sql<number>`count(*)::int`,
      })
      .from(mealResponses)
      .where(eq(mealResponses.mealId, mealId))
      .groupBy(mealResponses.status);

    const counts = { attending: 0, skipping: 0, notResponded: 0 };
    for (const agg of aggregates) {
      if (agg.status === "attending") counts.attending = agg.count;
      else if (agg.status === "skipping") counts.skipping = agg.count;
      else counts.notResponded = agg.count;
    }

    return NextResponse.json({
      success: true,
      response: updatedResponse,
      counts,
      message:
        status === "attending"
          ? `You're attending ${meal.mealType}!`
          : `You've skipped ${meal.mealType}. Kitchen demand updated.`,
    });
  } catch (error: any) {
    console.error("Error submitting response:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update response" },
      { status: 500 }
    );
  }
}
