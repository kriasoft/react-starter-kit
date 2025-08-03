# WebSocket Protocol

A minimal WebSocket protocol template using TypeScript, Zod, and bun-ws-router.

## Quick Start

```bash
# Install dependencies
bun install

# Run example server
bun run example.ts
```

## Basic Usage

### 1. Define Messages

```typescript
import { messageSchema } from "bun-ws-router/zod";
import { z } from "zod";

// Simple message (no payload)
const PingSchema = messageSchema("PING");

// Message with payload
const GreetingSchema = messageSchema("GREETING", {
  name: z.string(),
  message: z.string(),
});
```

### 2. Create Messages

```typescript
import { createMessage } from "bun-ws-router/zod";

const ping = createMessage(PingSchema, undefined);
if (ping.success) {
  ws.send(JSON.stringify(ping.data));
}

const greeting = createMessage(GreetingSchema, {
  name: "Alice",
  message: "Hello!",
});
if (greeting.success) {
  ws.send(JSON.stringify(greeting.data));
}
```

### 3. Set Up Server

```typescript
import { createWSRouter } from "@repo/ws-protocol";

const router = createWSRouter();

// Add custom handlers
router.onMessage(GreetingSchema, (c) => {
  console.log(`${c.payload.name}: ${c.payload.message}`);
});

Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (req.url.endsWith("/ws")) {
      return router.upgrade(req, { server });
    }
    return new Response("WebSocket server");
  },
  websocket: router.websocket,
});
```

## Built-in Messages

- `PING` / `PONG` - Connection heartbeat
- `ECHO` - Echo server (example request/response)
- `NOTIFICATION` - Server-to-client broadcast example
- `ERROR` - Error reporting

## Extending

1. Add new messages to `messages.ts`
2. Update `MessageSchema` discriminated union
3. Add handlers in your router

## Project Structure

```bash
ws-protocol/
├── messages.ts   # Message definitions
├── router.ts     # WebSocket router setup
├── example.ts    # Example server
└── index.ts      # Public exports
```
