import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

// Better Auth already exposes organization operations through
// `auth.organization.*`. These optional tRPC scaffolds throw until implemented
// so they cannot report false success. See docs/auth/organizations.md.
const notImplemented = (procedure: string, authMethod = procedure): never => {
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: `organization.${procedure} is not implemented. Use auth.organization.${authMethod} from @repo/app/lib/auth, or implement this procedure.`,
  });
};

export const organizationRouter = router({
  list: protectedProcedure.query(() => notImplemented("list")),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(() => notImplemented("create")),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(() => notImplemented("update")),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(() => notImplemented("delete")),

  members: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(() => notImplemented("members", "listMembers")),

  invite: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        email: z.email({ error: "Invalid email address" }),
        role: z.enum(["admin", "member"]).default("member"),
      }),
    )
    .mutation(() => notImplemented("invite", "inviteMember")),
});
