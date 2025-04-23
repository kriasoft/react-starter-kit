/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { z } from "zod";
import { createMessageSchema } from "./base";
import * as Chat from "./chat";

/**
 * Sent by either client or server to verify that the connection is active.
 * Should be responded to with a PONG message.
 */
export type PingMessage = z.infer<typeof PingSchema>;
export const PingSchema = createMessageSchema(z.literal("PING"));

/**
 * Sent in response to a PING message to confirm the connection is active.
 */
export type PongMessage = z.infer<typeof PongSchema>;
export const PongSchema = createMessageSchema(z.literal("PONG"));

/**
 * Error codes that can be returned by the server.
 */
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export const ErrorCodeSchema = z.union([
  z.enum([
    "INVALID_MESSAGE", // Message format is incorrect or cannot be parsed
    "INVALID_PAYLOAD", // Payload doesn't match expected schema for the message type
    "UNAUTHORIZED", // User is not authenticated
    "FORBIDDEN", // User is authenticated but doesn't have required permissions
    "NOT_FOUND", // Requested resource does not exist
    "SERVER_ERROR", // Unexpected error on the server side
  ]),
  Chat.ErrorCodeSchema,
]);

/**
 * Error message sent by the server when an error occurs.
 */
export type ErrorMessage = z.infer<typeof ErrorSchema>;
export const ErrorSchema = createMessageSchema(
  z.literal("ERROR"),
  z.object({
    /** Standard error type */
    code: ErrorCodeSchema,
    /** Human-readable description of the error */
    message: z.string(),
    /** Optional additional data to help diagnose the error */
    context: z.record(z.string(), z.unknown()).optional(),
  }),
);

/**
 * Messages sent from client to server.
 *
 * This union type defines all valid message formats that can be sent from
 * the client to the server. Each message has a discriminating "type" property
 * and message-specific data fields.
 */
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
export type ClientMessageType = ClientMessage["type"];
export type ClientMessageSchemaType = typeof ClientMessageSchema;
export const ClientMessageSchema = z.discriminatedUnion("type", [
  PingSchema,
  PongSchema,
  ErrorSchema,
  Chat.JoinRoomSchema,
  Chat.LeaveRoomSchema,
  Chat.SendMessageSchema,
  Chat.TypingSchema,
]);

/**
 * Messages sent from server to client.
 *
 * This union type defines all valid message formats that can be sent from
 * the server to the client. Each message has a discriminating "type" property
 * and message-specific data fields.
 */
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
export type ServerMessageType = ServerMessage["type"];
export type ServerMessageSchemaType = typeof ServerMessageSchema;
export const ServerMessageSchema = z.discriminatedUnion("type", [
  PingSchema,
  PongSchema,
  ErrorSchema,
  Chat.UserJoinedRoomSchema,
  Chat.UserLeftRoomSchema,
  Chat.MessageReceivedSchema,
  Chat.UserTypingSchema,
]);

/**
 * Union of all possible message types in the WebSocket protocol.
 * Combines both client and server message types.
 */
export type MessageType = ClientMessageType | ServerMessageType;

export type AnyServerMessageSchema =
  (typeof ServerMessageSchema)["options"][number];
export type AnyClientMessageSchema =
  (typeof ClientMessageSchema)["options"][number];

/**
 * Specific client schema type for a given client message type.
 */
export type ExtractClientMessageSchema<T extends ClientMessageType> = Extract<
  (typeof ClientMessageSchema)["options"][number],
  { shape: { type: { _def: { value: T } } } }
>;

/**
 * Specific server schema type for a given client message type.
 */
export type ExtractServerMessageSchema<T extends ServerMessageType> = Extract<
  (typeof ServerMessageSchema)["options"][number],
  { shape: { type: { _def: { value: T } } } }
>;
