import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { foodWaste, meals } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function GET() {
  await ensureDatabaseSeeded();

  try {
    const records = await db
      .select()
      .from(foodWaste)
      .orderBy(desc(foodWaste.date), desc(foodWaste.recordedAt));

    let totalPrepared = 0;
    let totalServed = 0;
    let totalWasted = 0;
    let totalKg = 0;

    const formattedRecords = records.map((r) => {
      totalPrepared += r.preparedQuantity;
      totalServed += r.servedQuantity;
      totalWasted += r.wastedQuantity;
      totalKg += r.wasteKg || 0;

      const wastePct =
        r.preparedQuantity > 0 ? (r.wastedQuantity / r.preparedQuantity) * 100 : 0;
      const effPct =
        r.preparedQuantity > 0 ? (r.servedQuantity / r.preparedQuantity) * 100 : 0;

      return {
        id: r.id,
        mealId: r.mealId,
        date: r.date,
        mealType: r.mealType,
        preparedQuantity: r.preparedQuantity,
        servedQuantity: r.servedQuantity,
        wastedQuantity: r.wastedQuantity,
        wasteKg: r.wasteKg || 0,
        wastePercentage: Number(wastePct.toFixed(1)),
        efficiencyPercentage: Number(effPct.toFixed(1)),
        notes: r.notes,
        recordedAt: r.recordedAt.toISOString(),
      };
    });

    const averageWastePercent =
      totalPrepared > 0 ? Number(((totalWasted / totalPrepared) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      records: formattedRecords,
      summary: {
        totalRecords: formattedRecords.length,
        totalPreparedPortions: totalPrepared,
        totalServedPortions: totalServed,
        totalWastedPortions: totalWasted,
        totalWasteKg: Number(totalKg.toFixed(1)),
        averageWastePercent,
      },
    });
  } catch (error: any) {
    console.error("Error fetching food waste:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch waste records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      mealId,
      date,
      mealType,
      preparedQuantity,
      servedQuantity,
      wastedQuantity,
      wasteKg,
      notes,
    } = body;

    if (!date || !mealType || preparedQuantity === undefined || servedQuantity === undefined) {
      return NextResponse.json(
        { error: "Date, meal type, prepared quantity, and served quantity are required" },
        { status: 400 }
      );
    }

    const prep = parseInt(preparedQuantity, 10);
    const serv = parseInt(servedQuantity, 10);
    const waste =
      wastedQuantity !== undefined ? parseInt(wastedQuantity, 10) : Math.max(0, prep - serv);
    // Rough estimate: each wasted portion is approx 0.25 to 0.35 kg
    const kg = wasteKg ? parseFloat(wasteKg) : Number((waste * 0.3).toFixed(1));

    const [record] = await db
      .insert(foodWaste)
      .values({
        mealId: mealId ? parseInt(mealId, 10) : null,
        date: date.trim(),
        mealType: mealType.toLowerCase().trim(),
        preparedQuantity: prep,
        servedQuantity: serv,
        wastedQuantity: waste,
        wasteKg: kg,
        notes: notes ? notes.trim() : null,
      })
      .returning();

    const wastePct = prep > 0 ? (waste / prep) * 100 : 0;
    const effPct = prep > 0 ? (serv / prep) * 100 : 0;

    return NextResponse.json({
      success: true,
      record: {
        ...record,
        wastePercentage: Number(wastePct.toFixed(1)),
        efficiencyPercentage: Number(effPct.toFixed(1)),
        recordedAt: record.recordedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error creating waste record:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record food waste" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    await db.delete(foodWaste).where(eq(foodWaste.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (error: any) {
    console.error("Error deleting waste record:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}
