import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, hostel, roomNumber, dietaryPreference } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const [updated] = await db
      .update(users)
      .set({
        name: name !== undefined ? name.trim() : undefined,
        hostel: hostel !== undefined ? hostel.trim() : undefined,
        roomNumber: roomNumber !== undefined ? roomNumber.trim() : undefined,
        dietaryPreference: dietaryPreference !== undefined ? dietaryPreference : undefined,
      })
      .where(eq(users.id, id))
      .returning();

    const { password, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
