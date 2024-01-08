/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Firestore } from "@google-cloud/firestore";
import { env } from "./env";

let db: Firestore | undefined;

export function getFirestore() {
  if (!db) {
    db = new Firestore({
      projectId: env.GOOGLE_CLOUD_PROJECT,
      databaseId: env.GOOGLE_CLOUD_DATABASE,
    });
  }

  return db;
}
