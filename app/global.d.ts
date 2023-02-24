/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

interface Window {
  dataLayer: unknown[];
}

interface ImportMetaEnv {
  /**
   * Client-side configuration for the production, test/QA, and local
   * development environments. See `core/config.ts`, `vite.config.ts`.
   */
  readonly VITE_CONFIG: string;
}

declare module "relay-runtime" {
  interface PayloadError {
    errors?: Record<string, string[] | undefined>;
  }
}

declare module "*.css";
