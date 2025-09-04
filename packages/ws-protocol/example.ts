/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { createWSRouter } from "./router";
import { NotificationSchema } from "./messages";
import { createMessage } from "./schema";

/**
 * Minimal WebSocket server example.
 *
 * Run with: bun run example.ts
 */

const router = createWSRouter();

// Track connections for broadcasting
const connections = new Set<{ send: (data: string) => void }>();

// Add connection tracking to existing handlers
// Note: This creates additional handlers alongside the ones in createWSRouter()
// The warnings about "Handler for message type undefined" can be safely ignored
router.onOpen((c) => {
  connections.add(c.ws);
});

router.onClose((c) => {
  connections.delete(c.ws);
});

// Add handler for echo messages with broadcast feature
import { EchoSchema } from "./messages";

router.onMessage(EchoSchema, (c) => {
  console.log(`[WS] Echo message:`, c.payload.text);

  // Broadcast notification if text is "broadcast"
  if (c.payload.text === "broadcast") {
    const notification = createMessage(NotificationSchema, {
      level: "info",
      message: "Hello to all connected clients!",
    });

    if (notification.success) {
      const message = JSON.stringify(notification.data);
      connections.forEach((ws) => ws.send(message));
      console.log(`Broadcast sent to ${connections.size} clients`);
    }
  }
});

const server = Bun.serve({
  port: 3000,

  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      return router.upgrade(req, { server });
    }

    // Simple HTTP endpoint for testing
    return new Response(
      `
WebSocket Server Example

Connect to ws://localhost:3000/ws

Try sending:
- {"type": "PING", "meta": {}}
- {"type": "ECHO", "payload": {"text": "Hello"}, "meta": {}}
- {"type": "ECHO", "payload": {"text": "broadcast"}, "meta": {}}
    `,
      {
        headers: { "content-type": "text/plain" },
      },
    );
  },

  websocket: router.websocket,
});

console.log(`
🚀 WebSocket server running at:
   HTTP: http://localhost:${server.port}
   WebSocket: ws://localhost:${server.port}/ws

Test with:
   wscat -c ws://localhost:${server.port}/ws
`);

// Example client code (for reference)
/*
import { createMessage, PingSchema, EchoSchema, MessageSchema } from "@repo/ws-protocol";

const ws = new WebSocket("ws://localhost:3000/ws");

ws.onopen = () => {
  // Send ping
  const ping = createMessage(PingSchema, undefined);
  if (ping.success) {
    ws.send(JSON.stringify(ping.data));
  }
  
  // Send echo
  const echo = createMessage(EchoSchema, { text: "Hello server!" });
  if (echo.success) {
    ws.send(JSON.stringify(echo.data));
  }
};

ws.onmessage = (event) => {
  const message = MessageSchema.safeParse(JSON.parse(event.data));
  if (message.success) {
    console.log("Received:", message.data);
  }
};
*/
