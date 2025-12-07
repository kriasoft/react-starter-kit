/**
 * Minimal WebSocket server example using WS-Kit.
 *
 * Run with: bun run example.ts
 */

import { createBunHandler } from "@ws-kit/bun";
import { memoryPubSub } from "@ws-kit/memory";
import { withPubSub } from "@ws-kit/pubsub";
import { createAppRouter, Notification } from "./index";

// Create the router with pub/sub support
const router = createAppRouter().plugin(
  withPubSub({ adapter: memoryPubSub() }),
);

// Create Bun WebSocket handlers
const { fetch: handleWebSocket, websocket } = createBunHandler(router, {
  authenticate() {
    return { connectedAt: Date.now() };
  },
});

const server = Bun.serve({
  port: 3000,

  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      return handleWebSocket(req, server);
    }

    // Broadcast endpoint for testing pub/sub
    if (url.pathname === "/broadcast" && req.method === "POST") {
      router.publish("notifications", Notification, {
        level: "info",
        message: "Hello to all connected clients!",
      });
      return new Response("Broadcast sent");
    }

    return new Response(
      `
WebSocket Server Example

Connect to ws://localhost:3000/ws

Try sending:
- {"type": "PING", "meta": {}, "payload": {}}
- {"type": "ECHO", "meta": {}, "payload": {"text": "Hello"}}
- {"type": "GET_USER", "meta": {"correlationId": "1"}, "payload": {"id": "123"}}

Broadcast to all clients:
- curl -X POST http://localhost:3000/broadcast
    `,
      {
        headers: { "content-type": "text/plain" },
      },
    );
  },

  websocket,
});

console.log(`
WebSocket server running at:
   HTTP: http://localhost:${server.port}
   WebSocket: ws://localhost:${server.port}/ws

Test with:
   wscat -c ws://localhost:${server.port}/ws
`);

// ============================================================================
// Example Client Code (for reference)
// ============================================================================
/*
import { wsClient, message, z } from "@ws-kit/client/zod";
import { Ping, Pong, Echo, GetUser } from "@repo/ws-protocol/messages";

// Create typed client
const client = wsClient({
  url: "ws://localhost:3000/ws",
  reconnect: { enabled: true },
});

// Handle incoming messages
client.on(Pong, (msg) => {
  console.log("Received Pong");
});

client.on(Echo, (msg) => {
  console.log("Echo response:", msg.payload.text);
});

// Connect and send messages
await client.connect();

// Send ping
client.send(Ping);

// Send echo
client.send(Echo, { text: "Hello server!" });

// RPC request with typed response
const user = await client.request(
  GetUser,
  { id: "123" },
  GetUser.response,
  { timeoutMs: 5000 }
);
console.log("User:", user.payload.name);

// Cleanup
await client.close();
*/
