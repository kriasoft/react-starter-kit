/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import "vite/client";

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

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGElement>>;
  export default content;
}
