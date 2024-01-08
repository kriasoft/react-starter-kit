/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { app } from "./app";
import { logger } from "./core/logging";
import { createWsContext as createContext } from "./core/trpc";
import { router } from "./routes";

// Detect if running in Google Cloud environment
const isCloudRun = !!process.env.K_SERVICE;

/**
 * Starts the HTTP and WebSocket servers.
 */
export function listen(port: number) {
  const server = app.listen(port, () => {
    logger.info(`API listening on ${port}`);
  });

  const wss = new WebSocketServer({ server, path: "/trpc" });
  const handler = applyWSSHandler({ wss, router, createContext });

  wss.on("connection", (ws) => {
    logger.info({ clients: wss.clients.size }, "wss:connection");
    ws.once("close", () => {
      logger.info({ clients: wss.clients.size }, "wss:close");
    });
  });

  return function dispose(cb?: () => void) {
    handler.broadcastReconnectNotification();
    wss.close((err) => {
      if (err) logger.error(err);
      if (isCloudRun) logger.info("WebSocket server closed");
      server.close((err) => {
        if (err) logger.error(err);
        if (isCloudRun) logger.info("HTTP server closed");
        logger.flush((err) => {
          if (err) console.error(err);
          if (isCloudRun) {
            process.exit(0);
          } else {
            cb?.();
          }
        });
      });
    });
  };
}

if (process.env.PORT && process.env.K_SERVICE?.startsWith("server")) {
  const port = parseInt(process.env.PORT);
  const dispose = listen(port);

  /* eslint-disable-next-line no-inner-declarations */
  function handleClose(code: NodeJS.Signals) {
    logger.info(`${code} signal received`);
    dispose();
  }

  process.on("SIGINT", handleClose);
  process.on("SIGTERM", handleClose);
}
