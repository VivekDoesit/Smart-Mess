import "dotenv/config";
import { seedDatabase } from "../src/db/seed";

async function main() {
  console.log("Starting seed...");
  const result = await seedDatabase();
  console.log("Seed result:", result);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
