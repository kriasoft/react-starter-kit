/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Firestore } from "@google-cloud/firestore";
import { configDotenv } from "dotenv";
import { relative, resolve } from "node:path";
import { oraPromise } from "ora";

const rootDir = resolve(__dirname, "../..");

// Load environment variables from .env files.
configDotenv({ path: resolve(rootDir, ".env.local") });
configDotenv({ path: resolve(rootDir, ".env") });

let db: Firestore | null = null;

// Seed the database with test / sample data.
try {
  db = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    databaseId: process.env.GOOGLE_CLOUD_DATABASE,
  });

  // Import all seed modules from the `/seeds` folder.
  const files = import.meta.glob<boolean, string, SeedModule>("../seeds/*.ts");

  // Sequentially seed the database with data from each module.
  for (const [path, load] of Object.entries(files)) {
    const message = `Seeding ${relative("../seeds", path)}`;
    const action = (async () => {
      const { seed } = await load();
      await seed(db);
    })();

    await oraPromise(action, message);
  }
} finally {
  await db?.terminate();
}

type SeedModule = {
  seed: (db: Firestore) => Promise<void>;
};
