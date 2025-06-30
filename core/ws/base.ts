/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { v7 as randomUUIDv7 } from "uuid";
import { z } from "zod";

/**
 * WebSocket message metadata schema that contains supplementary
 * information about the message.
 */
export type MessageMetadata = z.infer<typeof MessageMetadataSchema>;
export const MessageMetadataSchema = z.object({
  /** When the message was created (Unix timestamp) */
  timestamp: z.number().int().min(0).optional(),
  /** Used to correlate request/response pairs */
  correlationId: z.string().uuid().optional(),
  /** Message version for protocol compatibility */
  version: z.string().optional(),
});

/**
 * Base WebSocket message schema to be used for all messages.
 */
export type BaseMessage = z.infer<typeof BaseSchema>;
export const BaseSchema = z.object({
  /** Unique identifier for the message in UUID v7 format */
  id: z.string().uuid().optional(),
  /** Discriminator field to determine message handling */
  type: z.string(),
  /** Optional metadata about the message */
  meta: MessageMetadataSchema.optional(),
});

/**
 * Factory function to create a message schema with a specific type and payload.
 */
export function createMessageSchema<
  Type extends z.ZodLiteral<string>,
  PayloadSchema extends z.ZodTypeAny,
>(
  type: Type,
  payloadSchema: PayloadSchema, // Payload schema is required here
): z.ZodObject<
  // Define the exact shape expected as the return type
  {
    id: typeof BaseSchema.shape.id;
    type: Type; // Use the specific literal type
    payload: PayloadSchema; // Use the specific payload schema
    meta: typeof BaseSchema.shape.meta;
  },
  z.UnknownKeysParam,
  z.ZodTypeAny
>;

/**
 * Factory function to create a message schema with a specific type and no payload.
 */
export function createMessageSchema<Type extends z.ZodLiteral<string>>(
  type: Type,
): z.ZodObject<
  {
    id: typeof BaseSchema.shape.id;
    type: Type;
    payload: z.ZodUndefined;
    meta: typeof BaseSchema.shape.meta;
  },
  z.UnknownKeysParam,
  z.ZodTypeAny
>;

/**
 * Implementation (covers both overloads)
 */
export function createMessageSchema<
  Type extends z.ZodLiteral<string>,
  PayloadSchema extends z.ZodTypeAny = z.ZodUndefined,
>(type: Type, payloadSchema?: PayloadSchema) {
  return BaseSchema.extend({
    type,
    payload: payloadSchema ?? z.undefined(),
    meta: MessageMetadataSchema.optional(),
  });
}

/**
 * Result of the createMessage function, containing either a valid message or error information.
 */
export type MessageResult<T> =
  | { success: true; message: T; error: undefined }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { success: false; message: undefined; error: z.ZodError<any> }; // Can refine error type if needed

/**
 * Creates a properly typed WebSocket message with schema validation and payload auto-completion.
 *
 * This function constructs a message that follows the WebSocket protocol format,
 * validates it against the schema, and returns a result object with either
 * the valid message or validation errors. Uses safeParse for functional error handling.
 *
 * @template TSchema The specific Zod object schema for the message, expected to have id, type, payload, meta shapes.
 * @param schema - The message schema (e.g., created with createMessageSchema).
 * @param payload - The payload for the message. Auto-completion works based on the schema's payload definition.
 * @param metadata - Optional metadata to include with the message.
 * @returns A result object containing the message or validation error.
 */
export function createMessage<
  // Adjust TSchema constraint to reflect that payload might not always exist
  // It will exist if the specific schema returned by createMessageSchema has it.
  TSchema extends z.ZodObject<
    {
      id: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<string>;
      // Payload might be z.ZodUndefined or the specific PayloadSchema
      payload: z.ZodTypeAny;
      meta: z.ZodOptional<typeof MessageMetadataSchema>;
    },
    z.UnknownKeysParam,
    z.ZodTypeAny
  >,
>(
  schema: TSchema,
  // Use z.input on the specific payload shape from the final schema
  payload: z.input<TSchema["shape"]["payload"]>,
  metadata?: MessageMetadata,
): MessageResult<z.output<TSchema>> {
  const messageData = {
    id: randomUUIDv7(),
    type: schema.shape.type.value,
    payload,
    ...(metadata !== undefined && {
      meta: {
        timestamp: Math.floor(Date.now() / 1000),
        ...metadata,
      },
    }),
  };

  // Validate the message using safeParse
  const result = schema.safeParse(messageData);

  // Return structured result, correctly typed
  if (result.success) {
    return {
      success: true,
      message: result.data, // data is z.output<TSchema>
      error: undefined,
    };
  } else {
    return {
      success: false,
      message: undefined,
      error: result.error, // error is z.ZodError<TSchema>
    };
  }
}
