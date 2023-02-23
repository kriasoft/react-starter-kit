/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import react from "@vitejs/plugin-react";
import envars from "envars";
import { defineConfig } from "vitest/config";

// Load environment variables for the target environment
envars.config();

// Tells Vite which environment variables need to be injected into the app
// https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes
[
  "APP_ENV",
  "APP_NAME",
  "APP_ORIGIN",
  "APP_HOSTNAME",
  "GOOGLE_CLOUD_PROJECT",
  "FIREBASE_APP_ID",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "GA_MEASUREMENT_ID",
].forEach((key) => (process.env[`VITE_${key}`] = process.env[key]));

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig({
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
    // https://github.com/vitejs/vite/tree/main/packages/plugin-react
    react({
      jsxRuntime: "classic",
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: process.env.API_ORIGIN,
        changeOrigin: true,
      },
    },
  },

  test: {
    cache: {
      dir: "../.cache/vitest-app",
    },
  },
});
