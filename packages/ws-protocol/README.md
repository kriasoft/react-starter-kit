# WebSocket Protocol

Type-safe WebSocket protocol definitions using [WS-Kit](https://github.com/kriasoft/ws-kit).

[Documentation](https://reactstarter.com/recipes/websockets)

## Quick Start

```bash
bun run example       # Run example server
```

## Usage

```typescript
import { z, message, rpc } from "@ws-kit/zod";
import { createRouter, withZod } from "@ws-kit/zod";

const Ping = message("PING", { timestamp: z.number().optional() });
const Pong = message("PONG", { timestamp: z.number() });

const router = createRouter<{ userId?: string }>()
  .plugin(withZod())
  .on(Ping, (ctx) => {
    ctx.send(Pong, { timestamp: Date.now() });
  });
```

## Structure

```bash
messages.ts   # Message schema definitions
router.ts     # Router factory with handlers
example.ts    # Example server
index.ts      # Public exports
```
