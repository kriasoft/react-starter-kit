/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { URL, fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineProject } from "vitest/config";

const publicEnvVars = [
  "APP_NAME",
  "APP_ORIGIN",
  "GOOGLE_CLOUD_PROJECT",
  "GA_MEASUREMENT_ID",
];

/**
 * Vite configuration.
 * https://vitejs.dev/config/
 */
export default defineProject(({ mode }) => {
  const envDir = fileURLToPath(new URL("../..", import.meta.url));
  const env = loadEnv(mode, envDir, "");

  publicEnvVars.forEach((key) => {
    if (!env[key]) throw new Error(`Missing environment variable: ${key}`);
    process.env[`VITE_${key}`] = env[key];
  });

  return {
    cacheDir: fileURLToPath(new URL("../../.cache/vite-app", import.meta.url)),

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            tanstack: ["@tanstack/react-router"],
            ui: [
              "@radix-ui/react-slot",
              "class-variance-authority",
              "clsx",
              "tailwind-merge",
            ],
          },
        },
      },
    },

    resolve: {
      conditions: ["module", "browser", "development|production"],
    },

    css: {
      postcss: "./postcss.config.js",
    },

    plugins: [
      tsconfigPaths(),
      tanstackRouter({
        routesDirectory: "./routes",
        generatedRouteTree: "./lib/routeTree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
        semicolons: false,
        autoCodeSplitting: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      // https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc
      react(),
    ],

    server: {
      port: 5180,
      proxy: {
        "/api": {
          target:
            process.env.API === "remote"
              ? "https://example.com"
              : env.API_ORIGIN,
          changeOrigin: true,
        },
      },
    },

    test: {
      ...{ cache: { dir: "../../.cache/vitest" } },
      environment: "happy-dom",
    },
  };
});
