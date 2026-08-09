import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Load root .env variables for the Astro build process (side-effect: populates process.env)
loadEnv(process.env.NODE_ENV || "development", "../..", "");

export default defineConfig({
  site: process.env.PUBLIC_APP_ORIGIN,
  srcDir: ".",
  publicDir: "./public",
  outDir: "./dist",
  output: "static",
  integrations: [react()],
  // Astro recommends Tailwind v4's dedicated Vite plugin.
  vite: { plugins: [tailwindcss()] },
});
