/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { messageSchema } from "bun-ws-router/zod";
import { z } from "zod";

/**
 * Ping message for connection health checks.
 */
export type PingMessage = z.infer<typeof PingSchema>;
export const PingSchema = messageSchema("PING");

/**
 * Pong message sent in response to PING.
 */
export type PongMessage = z.infer<typeof PongSchema>;
export const PongSchema = messageSchema("PONG");

/**
 * Echo request - simple example of request/response pattern.
 */
export type EchoMessage = z.infer<typeof EchoSchema>;
export const EchoSchema = messageSchema("ECHO", {
  text: z.string(),
});

/**
 * Notification - simple example of server-to-client broadcast.
 */
export type NotificationMessage = z.infer<typeof NotificationSchema>;
export const NotificationSchema = messageSchema("NOTIFICATION", {
  level: z.enum(["info", "warning", "error"]),
  message: z.string(),
});

/**
 * Error message for communicating errors.
 */
export type ErrorMessage = z.infer<typeof ErrorSchema>;
export const ErrorSchema = messageSchema("ERROR", {
  code: z.enum(["INVALID_MESSAGE", "UNAUTHORIZED", "SERVER_ERROR"]),
  message: z.string(),
});

/**
 * All possible message types for easy discrimination.
 */
export const MessageSchema = z.discriminatedUnion("type", [
  PingSchema,
  PongSchema,
  EchoSchema,
  NotificationSchema,
  ErrorSchema,
]);

export type Message = z.infer<typeof MessageSchema>;
export type MessageType = Message["type"];
