/**
 * @file Public API surface for the backend package.
 *
 * Re-exports the Hono app, tRPC router, and core utilities.
 */

// Core utilities and services
export { createAuth } from "./lib/auth.js";
export { createDb } from "./lib/db.js";

// Application and router exports
export { default as app, appRouter } from "./lib/app.js";

// Type exports
export type { AppRouter } from "./lib/app.js";
// `AppContext` and `TRPCContext` both – declaration emit needs them nameable
// from this entry point, since the app's tRPC client infers through them.
export type * from "./lib/context.js";

// Default export is the core app
export { default } from "./lib/app.js";
