/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { z } from "zod";
import { createMessageSchema } from "bun-ws-router/zod";

/**
 * Factory instance for creating message schemas.
 * This ensures both the library and app use the same Zod instance,
 * avoiding dual package hazard issues with discriminated unions.
 */
export const {
  messageSchema,
  createMessage,
  ErrorMessage,
  ErrorCode,
  MessageMetadataSchema,
} = createMessageSchema(z);
