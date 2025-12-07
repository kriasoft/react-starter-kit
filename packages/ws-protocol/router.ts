/**
 * WebSocket router factory for the application.
 *
 * Uses @ws-kit/zod for type-safe message routing with Zod validation.
 * Supports middleware, lifecycle hooks, and pub/sub patterns.
 *
 * @example
 * ```ts
 * import { createBunHandler } from "@ws-kit/bun";
 * import { createAppRouter } from "@repo/ws-protocol/router";
 *
 * const router = createAppRouter();
 * const { fetch, websocket } = createBunHandler(router);
 *
 * Bun.serve({
 *   port: 3000,
 *   fetch(req, server) {
 *     if (new URL(req.url).pathname === "/ws") {
 *       return fetch(req, server);
 *     }
 *     return new Response("WebSocket server");
 *   },
 *   websocket,
 * });
 * ```
 */

import { createRouter, withZod, type Router } from "@ws-kit/zod";
import { Ping, Pong, Echo, GetUser } from "./messages";

/**
 * Connection data stored per WebSocket connection.
 */
export interface AppData extends Record<string, unknown> {
  connectedAt?: number;
  userId?: string;
}

/**
 * Creates the application WebSocket router with message handlers.
 *
 * The router is configured with:
 * - Zod validation plugin for type-safe payload validation
 * - Ping/Pong handlers for connection health checks
 * - Echo handler for testing
 * - GetUser RPC handler as an example
 *
 * @example
 * ```ts
 * const router = createAppRouter();
 *
 * // Add custom handlers
 * router.on(CustomMessage, (ctx) => {
 *   // Handle custom message
 * });
 * ```
 */
export function createAppRouter(): Router<AppData> {
  const router = createRouter<AppData>()
    .plugin(withZod())

    // =========================================================================
    // Lifecycle Hooks
    // =========================================================================

    .onOpen((ctx) => {
      ctx.assignData({ connectedAt: Date.now() });
      console.log(`[WS] Client connected: ${ctx.clientId}`);
    })

    .onClose((ctx) => {
      const connectedAt = ctx.data.connectedAt ?? Date.now();
      const duration = Math.round((Date.now() - connectedAt) / 1000);
      console.log(
        `[WS] Client disconnected: ${ctx.clientId} after ${duration}s`,
      );
    })

    .onError((error) => {
      console.error("[WS] Error:", error);
    })

    // =========================================================================
    // Message Handlers
    // =========================================================================

    .on(Ping, (ctx) => {
      ctx.send(Pong, { timestamp: Date.now() });
    })

    .on(Echo, (ctx) => {
      ctx.send(Echo, { text: ctx.payload.text });
    })

    // =========================================================================
    // RPC Handlers
    // =========================================================================

    .rpc(GetUser, async (ctx) => {
      // Example: fetch user from database
      // const user = await db.query.users.findFirst({
      //   where: eq(users.id, ctx.payload.id),
      // });

      // Mock response for demonstration
      ctx.reply({
        id: ctx.payload.id,
        name: `User ${ctx.payload.id}`,
        email: `user-${ctx.payload.id}@example.com`,
      });
    });

  return router;
}

// Re-export for convenience
export { createRouter, withZod } from "@ws-kit/zod";
