---
url: /recipes/websockets.md
---
# WebSockets

This recipe adds real-time WebSocket communication using the `@repo/ws-protocol` package and [WS-Kit](https://github.com/kriasoft/ws-kit).

## 1. Define a message

Add a new message schema in `packages/ws-protocol/messages.ts`:

```ts
// packages/ws-protocol/messages.ts
import { message, z } from "@ws-kit/zod";

export const ChatMessage = message("CHAT_MESSAGE", {
  channelId: z.string(),
  text: z.string().min(1).max(2000),
  sentAt: z.number(),
});
```

Messages follow the envelope structure `{ type, meta, payload }` and are validated with Zod at runtime. For request/response patterns, use `rpc()` instead:

```ts
import { rpc, z } from "@ws-kit/zod";

export const GetMessages = rpc(
  "GET_MESSAGES",
  { channelId: z.string(), limit: z.number().default(50) },
  "MESSAGES",
  { messages: z.array(z.object({ id: z.string(), text: z.string() })) },
);
```

## 2. Add a handler

Register the message handler in `packages/ws-protocol/router.ts`:

```ts
// packages/ws-protocol/router.ts
import { ChatMessage } from "./messages";

export function createAppRouter(): Router<AppData> {
  const router = createRouter<AppData>()
    .plugin(withZod())
    // ... existing handlers
    .on(ChatMessage, (ctx) => {
      // Broadcast to all clients subscribed to this channel
      ctx.publish(`channel:${ctx.payload.channelId}`, ChatMessage, {
        channelId: ctx.payload.channelId,
        text: ctx.payload.text,
        sentAt: ctx.payload.sentAt,
      });
    });

  return router;
}
```

Publishing requires the pub/sub plugin – see step 3.

## 3. Start the server

Create a WebSocket server entry point using Bun's native WebSocket support:

```ts
import { createBunHandler } from "@ws-kit/bun";
import { memoryPubSub } from "@ws-kit/memory";
import { withPubSub } from "@ws-kit/pubsub";
import { createAppRouter } from "@repo/ws-protocol/router";

const router = createAppRouter().plugin(
  withPubSub({ adapter: memoryPubSub() }),
);

const { fetch: handleWebSocket, websocket } = createBunHandler(router, {
  authenticate(req) {
    // Validate auth token, return initial connection data
    return { connectedAt: Date.now() };
  },
});

Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (new URL(req.url).pathname === "/ws") {
      return handleWebSocket(req, server);
    }
    return new Response("WebSocket server");
  },
  websocket,
});
```

For Cloudflare Workers, use `@ws-kit/cloudflare` with Durable Objects instead of `@ws-kit/bun`.

## 4. Connect from the frontend

```ts
import { Ping, Pong, ChatMessage } from "@repo/ws-protocol";

const ws = new WebSocket("ws://localhost:3001/ws");

// Listen for messages
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === ChatMessage.type) {
    console.log("Chat:", msg.payload.text);
  }
});

// Send a message
ws.send(
  JSON.stringify({
    type: "CHAT_MESSAGE",
    meta: {},
    payload: {
      channelId: "general",
      text: "Hello!",
      sentAt: Date.now(),
    },
  }),
);
```

For a type-safe client with automatic reconnection, use `@ws-kit/client`:

```ts
import { wsClient } from "@ws-kit/client/zod";
import { ChatMessage, Pong } from "@repo/ws-protocol";

const client = wsClient({
  url: "ws://localhost:3001/ws",
  reconnect: { enabled: true },
});

client.on(ChatMessage, (msg) => {
  console.log("Chat:", msg.payload.text);
});

await client.connect();
client.send(ChatMessage, {
  channelId: "general",
  text: "Hello!",
  sentAt: Date.now(),
});
```

## 5. Run the example

The `packages/ws-protocol/` workspace includes a working example server:

```bash
bun --filter @repo/ws-protocol example
```

Connect with any WebSocket client (e.g., `wscat -c ws://localhost:3000/ws`) and send:

```json
{"type": "PING", "meta": {}, "payload": {}}
{"type": "ECHO", "meta": {}, "payload": {"text": "Hello"}}
```

## Reference

* [WS-Kit documentation](https://github.com/kriasoft/ws-kit) – message schemas, router API, pub/sub
* [Architecture Overview](/architecture/) – worker boundaries and service bindings
* [Add a tRPC Procedure](/recipes/new-procedure) – for HTTP-based API endpoints
