/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { CloudflareEnv } from "@root/core/types";

/**
 * Environment detection utilities for Cloudflare Workers.
 * Uses ENVIRONMENT variable with "development" as default.
 */

/**
 * Gets the current environment with proper defaults.
 * Defaults to "development" when ENVIRONMENT is not set (local dev).
 */
export function getEnvironment(env: CloudflareEnv): "development" | "production" | "preview" {
  return env.ENVIRONMENT ?? "development";
}

/**
 * Determines if running in development environment.
 */
export function isDevelopment(env: CloudflareEnv): boolean {
  return getEnvironment(env) === "development";
}

/**
 * Determines if running in production environment.
 */
export function isProduction(env: CloudflareEnv): boolean {
  return getEnvironment(env) === "production";
}

/**
 * Determines if running in preview environment.
 */
export function isPreview(env: CloudflareEnv): boolean {
  return getEnvironment(env) === "preview";
}

/**
 * Determines if the origin is from local development.
 */
export function isLocalDevelopment(origin?: string): boolean {
  if (!origin) return false;
  
  return (
    origin === "http://localhost:5173" ||
    origin === "http://127.0.0.1:5173" ||
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  );
}

/**
 * Gets comprehensive environment information.
 */
export function getEnvironmentInfo(env: CloudflareEnv, origin?: string) {
  const environment = getEnvironment(env);
  const isLocal = isLocalDevelopment(origin);
  
  return {
    environment,
    isDevelopment: environment === "development",
    isProduction: environment === "production",
    isPreview: environment === "preview",
    isLocalOrigin: isLocal,
    allowedOrigins: environment === "development" && isLocal
      ? ["localhost", "127.0.0.1"] 
      : env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || [],
  };
}