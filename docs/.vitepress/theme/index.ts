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

    // By default, production Vue logs a render error and renders a placeholder,
    // so
    // `vitepress build` writes a broken page and still exits 0 – `{{ }}` in
    // prose resolving against no data is the usual way in. SSR only: the
    // browser keeps Vue's normal behaviour, where one bad component should not
    // blank the page.
    if (import.meta.env.SSR) {
      app.config.throwUnhandledErrorInProduction = true;
    }
  },
} satisfies Theme;
