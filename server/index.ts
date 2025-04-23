/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

const server = Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  hostname: process.env.HOST || "localhost",

  fetch(req, server) {
    if (req.url === "/") {
      return new Response("Bun WebSocket Server is running!");
    }

    if (new URL(req.url).pathname === "/ws") {
      const clientId = crypto.randomUUID();
      const success = server.upgrade(req, { data: { clientId } });
      return success
        ? undefined
        : new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not Found", { status: 404 });
  },

  // WebSocket handlers
  websocket: {
    open(ws) {
      const { clientId } = ws.data;
      console.log(`Client connected: ${clientId}`);
      ws.send(
        JSON.stringify({
          type: "welcome",
          message: "Connected to WebSocket server",
          clientId,
        }),
      );
    },

    message(ws, message) {
      const { clientId } = ws.data;
      console.log(`Message from ${clientId}: ${message}`);

      try {
        // Try to parse the message as JSON
        const data = JSON.parse(message as string);

        // Echo the message back
        ws.send(
          JSON.stringify({
            type: "echo",
            message: data,
            clientId,
          }),
        );
      } catch (e) {
        // If it's not JSON, just echo it back as text
        ws.send(
          JSON.stringify({
            type: "echo",
            message: message.toString(),
            clientId,
          }),
        );
      }
    },

    close(ws, code, reason) {
      const { clientId } = ws.data;
      console.log(
        `Client disconnected: ${clientId}. Code: ${code}, Reason: ${reason}`,
      );
    },

    drain(ws) {
      // Called when the buffer is drained (all messages sent)
      console.log(`Buffer drained for client: ${ws.data.clientId}`);
    },
  },
});

export default server;
