/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Timestamp } from "@google-cloud/firestore";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authorize, t } from "../core/trpc";

/**
 * Workspace API.
 */
export const workspace = t.router({
  /**
   * Updates the workspace.
   */
  update: t.procedure
    .use(authorize)
    .input(
      z.object({
        id: z.string(),
        name: z.string().max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { db } = ctx;
      const doc = await db.doc(`workspace/${input.id}`).get();

      if (!doc.exists || doc.data()?.ownerId !== ctx.token.uid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await doc.ref.update({
        name: input.name,
        updated: Timestamp.now(),
      });
    }),
});

export type WorkspaceRouter = typeof workspace;
