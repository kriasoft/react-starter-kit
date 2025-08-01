#!/usr/bin/env bun

/**
 * Database seeding script
 *
 * Usage:
 *   bun scripts/seed.ts
 *   bun --env ENVIRONMENT=staging scripts/seed.ts
 *   bun --env ENVIRONMENT=prod scripts/seed.ts
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "../schema";
import { seedUsers } from "../seeds/users";

// Import drizzle config to trigger environment loading
import "../drizzle.config";

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

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
