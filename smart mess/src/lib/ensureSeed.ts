import { db } from "@/db";
import { users } from "@/db/schema";
import { seedDatabase } from "@/db/seed";

let seedPromise: Promise<any> | null = null;

export async function ensureDatabaseSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const existing = await db.select({ id: users.id }).from(users).limit(1);
      if (existing.length === 0) {
        console.log("No users found. Seeding database with demo data...");
        await seedDatabase();
        console.log("Database seeded successfully.");
      }
    } catch (err) {
      console.error("Auto-seed error:", err);
    }
  })();

  return seedPromise;
}
