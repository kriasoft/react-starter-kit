# Core Package

Welcome to the core package, the foundational layer for shared utilities and WebSocket communication in our React Starter Kit. This package provides common functionality that can be shared across workspaces, with a focus on real-time communication patterns.

## Architecture Overview

The core package provides:

- **WebSocket communication utilities** using bun-ws-router for real-time features
- **Shared utilities** for common functionality across workspaces
- **Type-safe patterns** for cross-workspace communication

### Why a Core Package?

- **Real-time communication**: Centralized WebSocket patterns for chat, notifications, and live updates
- **Shared utilities**: Common functionality that multiple workspaces need
- **Type safety**: Consistent patterns across the application
- **Monorepo harmony**: Shared code that keeps workspaces in sync

## Project Structure

```
core/
├── ws/                     # WebSocket communication utilities
│   ├── index.ts            # Main WebSocket exports
│   ├── base.ts             # Base WebSocket connection handling
│   ├── chat.ts             # Chat-specific WebSocket patterns
│   └── common.ts           # Common WebSocket utilities
├── index.ts                # Package entry point and exports
├── package.json            # Dependencies and build scripts
└── tsconfig.json           # TypeScript configuration
```

## WebSocket Communication

### Real-time Features (`ws/`)

The core package provides WebSocket utilities using bun-ws-router for real-time communication:

```typescript
// Base WebSocket connection handling
import { WebSocketHandler } from "@root/core/ws/base";

// Chat-specific patterns
import { ChatHandler } from "@root/core/ws/chat";

// Common utilities
import { createWebSocketRouter } from "@root/core/ws/common";
```

These utilities provide:

- **Type-safe WebSocket connections** with automatic message serialization
- **Pub-sub patterns** for broadcasting to multiple clients
- **Room-based communication** for organized chat and collaboration
- **Connection management** with automatic reconnection and heartbeat

## Package Exports

Thanks to our carefully crafted package.json exports, you can import core utilities cleanly from any workspace:

```typescript
// Import WebSocket utilities
import { WebSocketHandler, ChatHandler } from "@root/core/ws";

// Import from main export
import { createWebSocketRouter } from "@root/core";

// Direct imports for specific functionality
import { ChatHandler } from "@root/core/ws/chat";
```

## Usage Across Workspaces

### In API Layer (`@root/api`)

The API layer can use WebSocket utilities for real-time features:

```typescript
import { WebSocketHandler } from "@root/core/ws";

// Handle WebSocket connections in your API
const wsHandler = new WebSocketHandler({
  onConnect: (client) => {
    console.log("Client connected:", client.id);
  },
  onMessage: (client, message) => {
    // Handle incoming messages
  },
});
```

### In Edge Functions (`@root/edge`)

Edge functions can integrate WebSocket handling for real-time communication:

```typescript
import { createWebSocketRouter } from "@root/core/ws";

const wsRouter = createWebSocketRouter({
  "/chat": ChatHandler,
  "/notifications": NotificationHandler,
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // WebSocket handling setup
    const wsHandler = createWebSocketRouter();
  },
};
```

### In Frontend (`@root/app`)

The frontend can connect to WebSocket endpoints for real-time updates:

```typescript
import { WebSocketClient } from "@root/core/ws";

const client = new WebSocketClient("ws://localhost:8787/chat");
client.on("message", (data) => {
  // Handle real-time messages
});
```

## Development Workflow

### Local Development

```bash
# Build core utilities
bun --filter core build

# Type checking
bun --filter core typecheck

# Run tests (when we add them)
bun --filter core test

# Watch mode for development
bun --filter core test --watch
```

### WebSocket Development

When developing WebSocket features:

```bash
# Test WebSocket connections locally
bun --filter core test:ws

# Debug WebSocket messages
bun --filter core debug:ws
```

### Adding New WebSocket Handlers

1. **Create a new handler** in the `ws/` directory:

   ```typescript
   // ws/notifications.ts
   import { WebSocketHandler } from "./base";

   export class NotificationHandler extends WebSocketHandler {
     async onConnect(client: WebSocketClient) {
       // Handle new connection
       await this.joinRoom(client, "notifications");
     }

     async onMessage(client: WebSocketClient, message: any) {
       // Handle incoming messages
       await this.broadcast("notifications", message);
     }
   }
   ```

2. **Export from the main index**:

   ```typescript
   // ws/index.ts
   export { NotificationHandler } from "./notifications";
   ```

3. **Register in your router**:
   ```typescript
   const wsRouter = createWebSocketRouter({
     "/notifications": NotificationHandler,
   });
   ```

## WebSocket Patterns

### Chat Implementation

```typescript
import { ChatHandler } from "@root/core/ws/chat";

const chatHandler = new ChatHandler({
  onJoinRoom: async (client, roomId) => {
    // User joined a chat room
    await chatHandler.broadcast(roomId, {
      type: "user_joined",
      userId: client.userId,
    });
  },
  onMessage: async (client, message) => {
    // New chat message
    await chatHandler.saveMessage(message);
    await chatHandler.broadcast(message.roomId, message);
  },
});
```

### Notification Broadcasting

```typescript
import { WebSocketHandler } from "@root/core/ws/base";

// Broadcast to all connected clients
await wsHandler.broadcastToAll({
  type: "system_notification",
  message: "Server maintenance in 5 minutes",
});

// Broadcast to specific users
await wsHandler.broadcastToUsers(["user1", "user2"], {
  type: "private_notification",
  message: "You have a new message",
});
```

## Testing Strategy

### WebSocket Testing

```typescript
// tests/ws.test.ts
import { describe, it, expect } from "vitest";
import { ChatHandler } from "../ws/chat";

describe("ChatHandler", () => {
  it("should handle new connections", async () => {
    const handler = new ChatHandler();
    const mockClient = createMockWebSocketClient();

    await handler.onConnect(mockClient);
    expect(handler.getConnectedClients()).toContain(mockClient);
  });
});
```

## Best Practices

### WebSocket Security

1. **Authenticate connections** before allowing WebSocket upgrades
2. **Validate all messages** with proper input validation
3. **Rate limit** to prevent abuse
4. **Use proper error handling** for connection failures

### Performance

1. **Use connection pooling** for multiple clients
2. **Implement heartbeat** to detect stale connections
3. **Clean up resources** when connections close
4. **Use efficient serialization** for message passing

### Maintainability

1. **Keep handlers focused** on single responsibilities
2. **Use consistent message formats** across all handlers
3. **Log important events** for debugging
4. **Handle reconnection gracefully** in clients

## Troubleshooting

### Common Issues

**WebSocket connection fails:**

- Check that the WebSocket endpoint is properly configured
- Verify authentication tokens are valid
- Ensure the server is running and accessible

**Messages not received:**

- Verify the client is properly subscribed to the right rooms
- Check for serialization/deserialization issues
- Look for network connectivity problems

**Performance issues:**

- Monitor connection counts and message frequency
- Check for memory leaks in connection handling
- Optimize message serialization

## Contributing

When adding new WebSocket features:

1. **Follow existing patterns** for consistency
2. **Add proper error handling** and logging
3. **Include comprehensive tests**
4. **Document message formats** and protocols
5. **Consider backwards compatibility**

## Resources

- [Bun WebSocket Documentation](https://bun.sh/docs/api/websockets)
- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Real-time Communication Patterns](https://web.dev/websocket/)

---

> _Real-time communication is like a good conversation — it should be responsive, meaningful, and not leave anyone hanging_ 💬  
> — 🔄 Ancient Chat Proverb
