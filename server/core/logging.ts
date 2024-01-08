/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Request, Response } from "express";
import { pino } from "pino";
import { pinoHttp } from "pino-http";
import { env } from "./env";

/**
 * Low overhead Node.js logger.
 *
 * @see https://github.com/pinojs/pino
 */
export const logger = pino({
  // Custom formatter to set the "severity" property in the JSON payload
  // to the log level to be automatically parsed.
  // https://cloud.google.com/run/docs/logging#special-fields
  formatters: {
    level(label) {
      return { severity: label };
    },
  },
  transport: {
    // Enable pretty printing in development.
    // https://github.com/pinojs/pino-pretty#readme
    target: env.isProduction ? "pino/file" : "pino-pretty",
    options: {
      ...(!env.isProduction && { colorize: true }),
      ignore: env.isProduction
        ? "pid,hostname"
        : "pid,hostname,req.headers,req.remoteAddress,req.remotePort,res.headers",
    },
  },
});

/**
 * Creates a request-based logger with trace ID field for logging correlation.
 *
 * @see https://cloud.google.com/run/docs/logging#correlate-logs
 */
export const loggerMiddleware = pinoHttp<Request, Response>({
  logger,
  customProps(req) {
    const traceHeader = req.header("X-Cloud-Trace-Context");

    let trace;

    if (traceHeader) {
      const [traceId] = traceHeader.split("/");
      trace = `projects/${env.GOOGLE_CLOUD_PROJECT}/traces/${traceId}`;
    }

    return {
      "logging.googleapis.com/trace": trace,
    };
  },
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
  },
});
