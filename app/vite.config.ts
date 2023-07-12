/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import react from "@vitejs/plugin-react";
import envars from "envars";
import { resolve } from "node:path";
import { URL } from "node:url";
import { defineProject } from "vitest/config";
import { Config, EnvName } from "./core/config.js";

// The list of supported environments
const envNames: EnvName[] = ["prod", "test", "local"];

// Bootstrap client-side configuration from environment variables
const configs = envNames.map((envName): [EnvName, Config] => {
  const envDir = resolve(__dirname, "../env");
  const env = envars.config({ env: envName, cwd: envDir });
  return [
    envName,
    {
      app: {
        env: envName,
        name: env.APP_NAME,
        origin: env.APP_ORIGIN,
        hostname: new URL(env.APP_ORIGIN).hostname,
      },
      firebase: {
        projectId: env.GOOGLE_CLOUD_PROJECT,
        appId: env.FIREBASE_APP_ID,
        apiKey: env.FIREBASE_API_KEY,
        authDomain: env.FIREBASE_AUTH_DOMAIN,
        measurementId: env.GA_MEASUREMENT_ID,
      },
    },
  ];
});

// Pass client-side configuration to the web app
// https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes
process.env.VITE_CONFIG = JSON.stringify(Object.fromEntries(configs));

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineProject({
  cacheDir: `../.cache/vite-app`,

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/analytics", "firebase/app", "firebase/auth"],
          react: ["react", "react-dom", "react-router-dom", "recoil"],
        },
      },
    },
  },

  plugins: [
    // The default Vite plugin for React projects
    // https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: process.env.LOCAL_API_ORIGIN ?? process.env.API_ORIGIN,
        changeOrigin: true,
      },
    },
  },

  test: {
    ...{ cache: { dir: "../.cache/vitest" } },
    environment: "happy-dom",
  },
});
