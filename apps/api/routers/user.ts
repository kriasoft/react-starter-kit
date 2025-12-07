import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    // User is now directly available in context from Better Auth
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name,
    };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.email({ message: "Invalid email address" }).optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      // TODO: Implement user profile update logic
      return {
        id: ctx.user.id,
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
