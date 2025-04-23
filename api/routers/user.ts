/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userById } from "../lib/loaders.js";
import { protectedProcedure, router } from "../lib/trpc.js";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await userById(ctx).load(ctx.session.userId);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      // TODO: Implement user profile update logic
      return {
        id: ctx.session.userId,
        ...input,
      };
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(() => {
      // TODO: Implement user listing logic
      return {
        users: [],
        nextCursor: null,
      };
    }),
});
