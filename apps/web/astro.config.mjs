import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Allows sharing root .env variables with Astro build process
loadEnv(process.env.NODE_ENV || "development", "../..", "");

export default defineConfig({
  srcDir: ".",
  publicDir: "./public",
  outDir: "./dist",
  output: "static",
  integrations: [react()],
  vite: {
    css: {
      postcss: "./postcss.config.js",
    },
  },
});
