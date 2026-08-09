import { TRPCError } from "@trpc/server";
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
        email: z.email({ error: "Invalid email address" }).optional(),
      }),
    )
    .mutation(() => {
      // Better Auth owns profile changes: use `auth.updateUser` for `name` and
      // enable/use `auth.changeEmail` for `email`. Throwing prevents this stub
      // from reporting a successful save.
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message:
          "user.updateProfile is not implemented. Use the Better Auth profile APIs from @repo/app/lib/auth, or implement this procedure.",
      });
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(() => {
      // Prefer `auth.organization.listMembers`. A custom implementation must
      // verify the caller's active-organization membership, then paginate
      // `Db.member` joined with `Db.user`. Throwing avoids a false empty page.
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "user.list is not implemented.",
      });
    }),
});
