/**
 * Main exports for the API package.
 *
 * This file serves as the public interface for the API package, exporting
 * utilities, routers, types, and the core application for library usage.
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

// Core utilities and services
export { getOpenAI } from "./lib/ai.js";
export { createAuth } from "./lib/auth.js";
export { createDb } from "./lib/db.js";

// Application and router exports
export { default as app, appRouter } from "./lib/app.js";

// Type exports
export type { AppRouter } from "./lib/app.js";
export type { AppContext } from "./lib/context.js";
// Re-export context type to fix TypeScript portability issues
export type * from "./lib/context.js";

// Default export is the core app
export { default } from "./lib/app.js";
