import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

/**
 * VitePress configuration.
 *
 * @link {https://vitepress.dev/reference/site-config}
 * @link {https://emersonbottero.github.io/vitepress-plugin-mermaid/}
 */
export default withMermaid(
  defineConfig({
    title: "React Starter Kit",
    description: "Production-ready monorepo for building fast web apps",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "Home", link: "/" },
        { text: "Docs", link: "/getting-started" },
      ],

      sidebar: [
        {
          text: "Documentation",
          items: [
            { text: "Getting Started", link: "/getting-started" },
            { text: "Database Schema", link: "/database-schema" },
            { text: "Deployment", link: "/deployment" },
          ],
        },
        {
          text: "Security",
          items: [
            { text: "Security Checklist", link: "/security/checklist" },
            { text: "Incident Playbook", link: "/security/incident-playbook" },
            {
              text: "Security Policy Template",
              link: "/security/SECURITY.template",
            },
          ],
        },
      ],

      socialLinks: [
        {
          icon: "discord",
          link: "https://discord.gg/2nKEnKq",
        },
        {
          icon: "github",
          link: "https://github.com/kriasoft/react-starter-kit",
        },
      ],
    },
  }),
);
