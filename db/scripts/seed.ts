#!/usr/bin/env bun
// Usage: bun scripts/seed.ts        (ENVIRONMENT=staging to target staging)
//
// Development and staging only. These seeds create test accounts, so there is
// no production variant – put real reference data in a migration instead.

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import { seedUsers } from "../seeds/users";

// Import drizzle config to trigger environment loading
import "../drizzle.config";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema, casing: "snake_case" });

console.log("🌱 Starting database seeding...");

try {
  await seedUsers(db);
  console.log("✅ Database seeding completed successfully!");
} catch (error) {
  console.error("❌ Database seeding failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
