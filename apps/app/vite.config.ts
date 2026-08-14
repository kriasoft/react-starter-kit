import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { TLSSocket } from "node:tls";
import { URL, fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineProject } from "vitest/config";

// Inlined into the client bundle, so nothing secret belongs here. Each entry is
// a hard build requirement – add one only once something reads it.
const publicEnvVars = ["APP_NAME"];

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
      rolldownOptions: {
        output: {
          assetFileNames: "_app/assets/[name]-[hash][extname]",
          chunkFileNames: "_app/assets/[name]-[hash].js",
          entryFileNames: "_app/assets/[name]-[hash].js",
          // Rolldown matches modules by resolved path, not package name.
          // Groups are evaluated in order, so keep them mutually exclusive.
          codeSplitting: {
            groups: [
              {
                name: "react",
                test: /node_modules\/(react|react-dom|scheduler)\//,
              },
              { name: "tanstack", test: /node_modules\/@tanstack\// },
              {
                // Not "ui": Rolldown also names source chunks after their
                // directory, and packages/ui would collide.
                name: "vendor-ui",
                test: /node_modules\/(@radix-ui|class-variance-authority|clsx|tailwind-merge|lucide-react)\//,
              },
            ],
          },
        },
      },
    },

    resolve: {
      conditions: ["module", "browser", "development|production"],
      // Native replacement for vite-tsconfig-paths (Vite 8+).
      tsconfigPaths: true,
    },

    plugins: [
      tailwindcss(),
      tanstackRouter({
        routesDirectory: "./routes",
        generatedRouteTree: "./lib/routeTree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "single",
        semicolons: false,
        autoCodeSplitting: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      // Oxc-based; Vite 8 recommends it over plugin-react-swc when no SWC
      // plugins are in use (one less toolchain in the build).
      react(),
    ],

    server: {
      proxy: {
        // Proxy API requests to the backend server during development
        "/api": {
          target: env.API_ORIGIN,
          changeOrigin: true,
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq, req) => {
              // Forward the frontend's origin to the API server
              // This allows the API to know the actual client origin for:
              // - CORS configuration
              // - Better Auth baseURL and trustedOrigins
              // - Redirect URLs and callbacks
              const proto = req.socket instanceof TLSSocket ? "https" : "http";
              const host = req.headers.host || "";
              const origin = req.headers.origin || `${proto}://${host}`;
              proxyReq.setHeader("x-forwarded-origin", origin);
            });
          },
        },
      },
    },

    test: {
      environment: "happy-dom",
      setupFiles: ["./vitest.setup.ts"],
    },
  };
});
