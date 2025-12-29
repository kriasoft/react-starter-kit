import { initTRPC, TRPCError, type TRPCProcedureBuilder } from "@trpc/server";
import { flattenError, ZodError } from "zod";
import type { TRPCContext } from "./context.js";

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? flattenError(error.cause) : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Derive type from publicProcedure to stay in sync with initTRPC config.
// Explicit annotation required to avoid TS2742 (non-portable inferred type).
type ProtectedProcedure =
  typeof publicProcedure extends TRPCProcedureBuilder<
    infer TContext,
    infer TMeta,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TContextOverrides,
    infer TInputIn,
    infer TInputOut,
    infer TOutputIn,
    infer TOutputOut,
    infer TCaller
  >
    ? TRPCProcedureBuilder<
        TContext,
        TMeta,
        {
          session: NonNullable<TRPCContext["session"]>;
          user: NonNullable<TRPCContext["user"]>;
        },
        TInputIn,
        TInputOut,
        TOutputIn,
        TOutputOut,
        TCaller
      >
    : never;

export const protectedProcedure: ProtectedProcedure = t.procedure.use(
  ({ ctx, next }) => {
    if (!ctx.session || !ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        user: ctx.user,
      },
    });
  },
);
