import type { Database } from "@repo/db";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { Auth, AuthSession, AuthUser } from "./auth.js";
import type { Env } from "./env.js";

/** Per-request context for every tRPC procedure. */
export type TRPCContext = {
  req: Request;

  /** tRPC request metadata (headers, connection info) */
  info: CreateHTTPContextOptions["info"];

  /** Always-fresh reads. The default choice. */
  db: Database;

  /**
   * Reads served from Hyperdrive's cache window and never invalidated on
   * write. Opt in only where that staleness is acceptable – never for auth,
   * permissions, billing state, or a read after a write.
   */
  dbCached: Database;

  /** Null until authenticated; `protectedProcedure` narrows both. */
  session: AuthSession | null;
  user: AuthUser | null;

  /** Set only where Hono owns the response, e.g. for cookies. */
  res?: Response;
  resHeaders?: Headers;

  env: Env;
};

/**
 * Hono application context. `auth` is the Better Auth instance, not a resolved
 * identity: session and user are absent on purpose, because only
 * `createContext` resolves them, and declaring them here would promise Hono
 * handlers a value nothing assigns.
 */
export type AppContext = {
  Bindings: Env;
  Variables: {
    db: Database;
    dbCached: Database;
    auth: Auth;
  };
};
