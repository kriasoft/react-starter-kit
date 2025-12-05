# WebSocket Protocol

Type-safe WebSocket protocol definitions using [WS-Kit](https://github.com/kriasoft/ws-kit).

## Quick Start

```bash
# Run example server
bun run example
```

## Usage

### Define Messages

```typescript
import { z, message, rpc } from "@ws-kit/zod";

// Message with optional payload
const Ping = message("PING", { timestamp: z.number().optional() });

// Message with required payload
const Greeting = message("GREETING", {
  name: z.string(),
  text: z.string(),
});

// RPC with request/response
const GetUser = rpc("GET_USER", { id: z.string() }, "USER", {
  id: z.string(),
  name: z.string(),
});
```

### Create Router

```typescript
import { createRouter, withZod } from "@ws-kit/zod";

const router = createRouter<{ userId?: string }>()
  .plugin(withZod())
  .on(Ping, (ctx) => {
    ctx.send(Pong, { timestamp: Date.now() });
  })
  .on(Greeting, (ctx) => {
    console.log(`${ctx.payload.name}: ${ctx.payload.text}`);
  })
  .rpc(GetUser, async (ctx) => {
    ctx.reply({ id: ctx.payload.id, name: "Alice" });
  });
```

### Start Server

```typescript
import { createBunHandler } from "@ws-kit/bun";

const { fetch, websocket } = createBunHandler(router);

Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (new URL(req.url).pathname === "/ws") {
      return fetch(req, server);
    }
    return new Response("WebSocket server");
  },
  websocket,
});
```

## Built-in Messages

| Message         | Description                     |
| --------------- | ------------------------------- |
| `PING` / `PONG` | Connection heartbeat            |
| `ECHO`          | Echo server example             |
| `NOTIFICATION`  | Server-to-client broadcast      |
| `ERROR`         | Protocol-level error reporting  |
| `GET_USER`      | Example RPC with typed response |

## Project Structure

```
ws-protocol/
├── messages.ts   # Message schema definitions
├── router.ts     # Router factory with handlers
├── example.ts    # Example server
└── index.ts      # Public exports
```
