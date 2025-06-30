/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { z } from "zod";
import { createMessageSchema } from "./base";

/**
 * User's request to join a chat room.
 *
 * Sent by users when they want to participate in a specific chat room.
 * The server should respond with room history and notifications to other users.
 */
export type JoinRoomMessage = z.infer<typeof JoinRoomSchema>;
export const JoinRoomSchema = createMessageSchema(
  z.literal("CHAT:JOIN_ROOM"),
  z.object({
    roomId: z.string().min(1, "Room ID is required"),
  }),
);

/**
 * Server notification about a user joining a room.
 *
 * Broadcast by the server to all room participants when a new user joins.
 * Allows clients to update their UI to show the new participant.
 */
export type UserJoinedRoomMessage = z.infer<typeof UserJoinedRoomSchema>;
export const UserJoinedRoomSchema = createMessageSchema(
  z.literal("CHAT:USER_JOINED_ROOM"),
  z.object({
    roomId: z.string(),
    userId: z.string(),
  }),
);

/**
 * User's request to leave a chat room.
 *
 * Sent by users when they want to stop participating in a specific chat room.
 * The server should notify other room participants about the departure.
 */
export type LeaveRoomMessage = z.infer<typeof LeaveRoomSchema>;
export const LeaveRoomSchema = createMessageSchema(
  z.literal("CHAT:LEAVE_ROOM"),
  z.object({
    roomId: z.string().min(1, "Room ID is required"),
  }),
);

/**
 * Server notification about a user leaving a room.
 *
 * Broadcast by the server to all room participants when a user leaves.
 * Allows clients to update their UI to remove the departed participant.
 */
export type UserLeftRoomMessage = z.infer<typeof UserLeftRoomSchema>;
export const UserLeftRoomSchema = createMessageSchema(
  z.literal("CHAT:USER_LEFT_ROOM"),
  z.object({
    roomId: z.string(),
    userId: z.string(),
  }),
);

/**
 * User's request to send a chat message.
 *
 * Sent by users when they want to post a message to a chat room.
 * The server should broadcast this message to all room participants.
 * Includes validation for message length and required fields.
 */
export type SendMessageMessage = z.infer<typeof SendMessageSchema>;
export const SendMessageSchema = createMessageSchema(
  z.literal("CHAT:SEND_MESSAGE"),
  z.object({
    roomId: z.string().min(1, "Room ID is required"),
    content: z
      .string()
      .min(1, "Message content is required")
      .max(2000, "Message too long"),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
);

/**
 * Server notification about a new chat message.
 *
 * Broadcast by the server to all room participants when a new message is posted.
 * Contains complete message details including sender, timestamp, and content.
 */
export type MessageReceivedMessage = z.infer<typeof MessageReceivedSchema>;
export const MessageReceivedSchema = createMessageSchema(
  z.literal("CHAT:MESSAGE_RECEIVED"),
  z.object({
    messageId: z.string(),
    roomId: z.string(),
    userId: z.string(),
    content: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
);

/**
 * User's notification about typing status.
 *
 * Sent by clients to indicate when a user starts or stops typing.
 * Helps implement typing indicators in the UI.
 */
export type TypingMessage = z.infer<typeof TypingSchema>;
export const TypingSchema = createMessageSchema(
  z.literal("CHAT:TYPING"),
  z.object({
    roomId: z.string(),
    isTyping: z.boolean(),
  }),
);

/**
 * Server broadcast about a user's typing status.
 *
 * Broadcast by the server to all room participants when a user's typing status changes.
 * Used by clients to show/hide typing indicators in the UI.
 */
export type UserTypingMessage = z.infer<typeof UserTypingSchema>;
export const UserTypingSchema = createMessageSchema(
  z.literal("CHAT:USER_TYPING"),
  z.object({
    roomId: z.string(),
    userId: z.string(),
    isTyping: z.boolean(),
  }),
);

/**
 * Chat-specific error codes.
 */
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;
export const ErrorCodeSchema = z.enum(["RATE_LIMIT_HIT"]);
