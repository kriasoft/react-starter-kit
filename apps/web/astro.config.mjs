import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Astro does not expose the root .env to this config file, so load it explicitly.
const env = loadEnv(process.env.NODE_ENV || "development", "../..", "");

export default defineConfig({
  // The edge worker serves marketing, app, and API routes on one public origin.
  site: env.APP_ORIGIN,
  srcDir: ".",
  publicDir: "./public",
  outDir: "./dist",
  output: "static",
  integrations: [react()],
  // Astro recommends Tailwind v4's dedicated Vite plugin.
  vite: { plugins: [tailwindcss()] },
});
