/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { z } from "zod";
import { messageSchema } from "./schema";

/**
 * Ping message for connection health checks.
 */
export const PingSchema = messageSchema("PING");
export type PingMessage = z.infer<typeof PingSchema>;

/**
 * Pong message sent in response to PING.
 */
export const PongSchema = messageSchema("PONG");
export type PongMessage = z.infer<typeof PongSchema>;

/**
 * Echo request - simple example of request/response pattern.
 */
export const EchoSchema = messageSchema("ECHO", {
  text: z.string(),
});
export type EchoMessage = z.infer<typeof EchoSchema>;

/**
 * Notification - simple example of server-to-client broadcast.
 */
export const NotificationSchema = messageSchema("NOTIFICATION", {
  level: z.enum(["info", "warning", "error"]),
  message: z.string(),
});
export type NotificationMessage = z.infer<typeof NotificationSchema>;

/**
 * Error message for communicating errors.
 */
export const ErrorSchema = messageSchema("ERROR", {
  code: z.enum(["INVALID_MESSAGE", "UNAUTHORIZED", "SERVER_ERROR"]),
  message: z.string(),
});
export type ErrorMessage = z.infer<typeof ErrorSchema>;

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
