import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function GET(request: NextRequest) {
  await ensureDatabaseSeeded();

  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    // Return default student demo or all users for quick demo switch
    const allDemoUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        hostel: users.hostel,
        roomNumber: users.roomNumber,
        studentId: users.studentId,
        dietaryPreference: users.dietaryPreference,
      })
      .from(users);

    return NextResponse.json({ users: allDemoUsers });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { password, ...safeUser } = user[0];
  return NextResponse.json({ user: safeUser });
}

export async function POST(request: NextRequest) {
  await ensureDatabaseSeeded();

  try {
    const body = await request.json();
    const { action } = body;

    // Login action
    if (action === "login") {
      const { email, password } = body;
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      const found = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

      if (found.length === 0) {
        return NextResponse.json(
          { error: "No user found with this email address." },
          { status: 404 }
        );
      }

      const user = found[0];
      // For demo purposes, we accept 'demo', 'demo123', or matching password
      if (
        password &&
        password !== "demo" &&
        password !== "demo123" &&
        password !== user.password
      ) {
        return NextResponse.json(
          { error: "Invalid password. (Use 'demo' for quick access)" },
          { status: 401 }
        );
      }

      const { password: _, ...safeUser } = user;
      return NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: safeUser,
      });
    }

    // Signup action
    if (action === "signup") {
      const { name, email, password, studentId, hostel, roomNumber, role, dietaryPreference } =
        body;

      if (!name || !email) {
        return NextResponse.json(
          { error: "Full name and email are required" },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }

      const [newUser] = await db
        .insert(users)
        .values({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password || "demo123",
          studentId: studentId?.trim() || `2024-${Math.floor(100 + Math.random() * 900)}`,
          hostel: hostel?.trim() || "Kaveri Hostel",
          roomNumber: roomNumber?.trim() || "B-101",
          role: role === "admin" ? "admin" : "student",
          dietaryPreference: dietaryPreference || "Vegetarian",
        })
        .returning();

      const { password: _, ...safeUser } = newUser;
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: safeUser,
      });
    }

    return NextResponse.json({ error: "Invalid auth action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
