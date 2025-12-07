import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../schema";
import { type NewUser, user } from "../schema";

/**
 * Seeds the database with test user accounts.
 */
export async function seedUsers(db: PostgresJsDatabase<typeof schema>) {
  console.log("Seeding users...");

  // Test user data with realistic names and email addresses
  const users: NewUser[] = [
    { name: "Alice Johnson", email: "alice@example.com", emailVerified: true },
    { name: "Bob Smith", email: "bob@example.com", emailVerified: true },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      emailVerified: false,
    },
    { name: "Diana Prince", email: "diana@example.com", emailVerified: true },
    { name: "Eve Davis", email: "eve@example.com", emailVerified: true },
    { name: "Frank Miller", email: "frank@example.com", emailVerified: false },
    { name: "Grace Lee", email: "grace@example.com", emailVerified: true },
    { name: "Henry Wilson", email: "henry@example.com", emailVerified: true },
    { name: "Ivy Chen", email: "ivy@example.com", emailVerified: false },
    { name: "Jack Thompson", email: "jack@example.com", emailVerified: true },
  ];

  for (const u of users) {
    await db.insert(user).values(u).onConflictDoNothing();
  }

  console.log(`✅ Seeded ${users.length} test users`);
}
