/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Firestore, Timestamp } from "@google-cloud/firestore";
import { WorkspaceInput } from "../models";
import { testUsers as users } from "./01-users";

/**
 * Test workspaces.
 */
export const testWorkspaces: (WorkspaceInput & { id: string })[] = [
  {
    id: "DwYchGFGpk",
    ownerId: users[0].localId!,
    name: "Personal workspace",
    created: Timestamp.fromDate(new Date(+users[0].createdAt!)),
    updated: Timestamp.fromDate(new Date(+users[0].createdAt!)),
    archived: null,
  },
  {
    id: "YfYKTcO9q9",
    ownerId: users[1].localId!,
    name: "Personal workspace",
    created: Timestamp.fromDate(new Date(+users[1].createdAt!)),
    updated: Timestamp.fromDate(new Date(+users[1].createdAt!)),
    archived: null,
  },
  {
    id: "c2OsmUvFMY",
    ownerId: users[2].localId!,
    name: "Personal workspace",
    created: Timestamp.fromDate(new Date(+users[2].createdAt!)),
    updated: Timestamp.fromDate(new Date(+users[2].createdAt!)),
    archived: null,
  },
  {
    id: "uTqcGw4qn7",
    ownerId: users[3].localId!,
    name: "Personal workspace",
    created: Timestamp.fromDate(new Date(+users[3].createdAt!)),
    updated: Timestamp.fromDate(new Date(+users[3].createdAt!)),
    archived: null,
  },
  {
    id: "vBHHgg5ydn",
    ownerId: users[4].localId!,
    name: "Personal workspace",
    created: Timestamp.fromDate(new Date(+users[4].createdAt!)),
    updated: Timestamp.fromDate(new Date(+users[4].createdAt!)),
    archived: null,
  },
];

export async function seed(db: Firestore) {
  const batch = db.batch();

  for (const { id, ...workspace } of testWorkspaces) {
    const ref = db.doc(`workspace/${id}`);
    batch.set(ref, workspace, { merge: true });
  }

  await batch.commit();
}
