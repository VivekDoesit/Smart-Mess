import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, or, isNull, desc } from "drizzle-orm";
import { ensureDatabaseSeeded } from "@/lib/ensureSeed";

export async function GET(request: NextRequest) {
  await ensureDatabaseSeeded();

  const url = new URL(request.url);
  const userIdStr = url.searchParams.get("userId");
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  try {
    let query;
    if (userId) {
      query = db
        .select()
        .from(notifications)
        .where(or(eq(notifications.userId, userId), isNull(notifications.userId)))
        .orderBy(desc(notifications.createdAt))
        .limit(20);
    } else {
      query = db
        .select()
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(20);
    }

    const items = await query;
    const formatted = items.map((n) => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type as any,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }));

    return NextResponse.json({ notifications: formatted });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, markAllRead, userId } = body;

    if (markAllRead && userId) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(or(eq(notifications.userId, userId), isNull(notifications.userId)));
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (id) {
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, id));
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ error: "Missing id or markAllRead" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    const [newNotif] = await db
      .insert(notifications)
      .values({
        title: title.trim(),
        message: message.trim(),
        type: type || "info",
        userId: userId ? parseInt(userId, 10) : null,
        read: false,
      })
      .returning();

    return NextResponse.json({ success: true, notification: newNotif });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 500 }
    );
  }
}
