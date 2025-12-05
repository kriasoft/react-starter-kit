/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/**
 * WebSocket protocol definitions for the application.
 *
 * @example
 * ```ts
 * import { createAppRouter, Ping, Pong, Echo } from "@repo/ws-protocol";
 *
 * const router = createAppRouter();
 * ```
 */

export * from "./messages";
export * from "./router";
