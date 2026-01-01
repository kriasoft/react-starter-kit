/**
 * Custom theme for VitePress documentation.
 * @see https://vitepress.dev/guide/custom-theme
 */

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import GitHubStats from "./components/GitHubStats.vue";
import Mermaid from "./components/Mermaid.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "nav-bar-content-after": () => h(GitHubStats),
    });
  },
  enhanceApp({ app }) {
    app.component("Mermaid", Mermaid);
  },
} satisfies Theme;
