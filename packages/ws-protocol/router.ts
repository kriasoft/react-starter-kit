/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { WebSocketRouter } from "bun-ws-router/zod";
import { PingSchema, PongSchema, EchoSchema, ErrorSchema } from "./messages";
import { createMessage } from "./schema";

/**
 * Basic connection metadata. Extend this interface as needed.
 */
export interface ConnectionMeta extends Record<string, unknown> {
  connectedAt: number;
}

/**
 * Creates a WebSocket router with basic message handlers.
 *
 * @example
 * ```typescript
 * const router = createWSRouter();
 *
 * Bun.serve({
 *   port: 3000,
 *   fetch(req, server) {
 *     if (req.url.endsWith("/ws")) {
 *       return router.upgrade(req, { server });
 *     }
 *     return new Response("WebSocket server");
 *   },
 *   websocket: router.websocket
 * });
 * ```
 */
export function createWSRouter() {
  const router = new WebSocketRouter<ConnectionMeta>();

  // Connection lifecycle
  router.onOpen((c) => {
    // Set connectedAt when connection opens
    c.ws.data.connectedAt = Date.now();
    console.log(`[WS] Client connected: ${c.ws.data.clientId}`);
  });

  router.onClose((c) => {
    const duration = Date.now() - (c.ws.data.connectedAt || Date.now());
    console.log(
      `[WS] Client disconnected: ${c.ws.data.clientId} after ${Math.round(duration / 1000)}s`,
    );
  });

  // Handle PING messages
  router.onMessage(PingSchema, (c) => {
    const pong = createMessage(PongSchema, undefined);
    if (pong.success) {
      c.ws.send(JSON.stringify(pong.data));
    }
  });

  // Handle ECHO messages
  router.onMessage(EchoSchema, (c) => {
    // Echo back the same message
    const echo = createMessage(EchoSchema, { text: c.payload.text });
    if (echo.success) {
      c.ws.send(JSON.stringify(echo.data));
    }
  });

  return router;
}

/**
 * Helper to send an error message.
 */
export function sendError(
  ws: { send: (data: string) => void },
  code: "INVALID_MESSAGE" | "UNAUTHORIZED" | "SERVER_ERROR",
  message: string,
) {
  const error = createMessage(ErrorSchema, { code, message });
  if (error.success) {
    ws.send(JSON.stringify(error.data));
  }
}
