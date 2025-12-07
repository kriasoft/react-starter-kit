/**
 * WebSocket message schemas for the application protocol.
 *
 * Uses @ws-kit/zod for type-safe message definitions with Zod validation.
 * All messages follow the envelope structure: { type, meta, payload }.
 *
 * @example
 * ```ts
 * import { Ping, Pong, Echo } from "@repo/ws-protocol";
 *
 * // Send a ping
 * ctx.send(Ping);
 *
 * // Send an echo with payload
 * ctx.send(Echo, { text: "Hello" });
 * ```
 */

import { message, rpc, z } from "@ws-kit/zod";

// ============================================================================
// Connection Health
// ============================================================================

/**
 * Ping message for connection health checks.
 * Server responds with Pong.
 */
export const Ping = message("PING", { timestamp: z.number().optional() });

/**
 * Pong message sent in response to Ping.
 */
export const Pong = message("PONG", { timestamp: z.number().optional() });

// ============================================================================
// Echo (Simple Request/Response)
// ============================================================================

/**
 * Echo message - simple example demonstrating request/response pattern.
 * Server echoes back the same text.
 */
export const Echo = message("ECHO", { text: z.string() });

// ============================================================================
// Notifications
// ============================================================================

/**
 * Server notification broadcast to clients.
 */
export const Notification = message("NOTIFICATION", {
  level: z.enum(["info", "warning", "error"]),
  message: z.string(),
});

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Error message for communicating protocol-level errors.
 */
export const ErrorMessage = message("ERROR", {
  code: z.enum(["INVALID_MESSAGE", "UNAUTHORIZED", "SERVER_ERROR"]),
  message: z.string(),
});

// ============================================================================
// RPC Examples
// ============================================================================

/**
 * Get user by ID - example RPC with request/response pattern.
 * Request: GET_USER with { id }
 * Response: USER with { id, name, email }
 */
export const GetUser = rpc("GET_USER", { id: z.string() }, "USER", {
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type { InferMessage, InferPayload, InferResponse } from "@ws-kit/zod";
