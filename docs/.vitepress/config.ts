import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

/**
 * VitePress configuration.
 * @see https://vitepress.dev/reference/site-config
 */
export default defineConfig({
  title: "React Starter Kit",
  description: "Production-ready monorepo for building fast web apps",

  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if (token.info === "mermaid") {
          const code = md.utils.escapeHtml(token.content.trim());
          return `<Mermaid code="${code}" />`;
        }
        return fence(tokens, idx, options, env, self);
      };
    },
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  ignoreDeadLinks: [/%5B.*_URL%5D/],

  sitemap: {
    hostname: "https://reactstarter.com",
    transformItems: (items) => {
      items.push({ url: "llms.txt" }, { url: "llms-full.txt" });
      return items;
    },
  },

  head: [
    ["meta", { name: "theme-color", content: "#6366f1" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "React Starter Kit" }],
    [
      "link",
      {
        rel: "alternate",
        type: "text/plain",
        href: "/llms.txt",
        title: "LLM context",
      },
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "text/plain",
        href: "/llms-full.txt",
        title: "LLM context (full)",
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started/" },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern:
        "https://github.com/kriasoft/react-starter-kit/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message:
        'LLM context: <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a><br>Released under the MIT License.',
      copyright: "Copyright © 2014-present Kriasoft",
    },

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/getting-started/" },
          { text: "Quick Start", link: "/getting-started/quick-start" },
          {
            text: "Project Structure",
            link: "/getting-started/project-structure",
          },
          {
            text: "Environment Variables",
            link: "/getting-started/environment-variables",
          },
        ],
      },
      {
        text: "Architecture",
        items: [
          { text: "Overview", link: "/architecture/" },
          { text: "Edge", link: "/architecture/edge" },
        ],
      },
      {
        text: "Frontend",
        collapsed: true,
        items: [
          { text: "Routing", link: "/frontend/routing" },
          { text: "State & Data Fetching", link: "/frontend/state" },
          { text: "UI", link: "/frontend/ui" },
          { text: "Forms & Validation", link: "/frontend/forms" },
        ],
      },
      {
        text: "API",
        collapsed: true,
        items: [
          { text: "Overview", link: "/api/" },
          { text: "Procedures", link: "/api/procedures" },
          { text: "Validation & Errors", link: "/api/validation-errors" },
          { text: "Context & Middleware", link: "/api/context" },
        ],
      },
      {
        text: "Authentication",
        collapsed: true,
        items: [
          { text: "Overview", link: "/auth/" },
          { text: "Email & OTP", link: "/auth/email-otp" },
          { text: "Social Providers", link: "/auth/social-providers" },
          { text: "Passkeys", link: "/auth/passkeys" },
          { text: "Organizations & Roles", link: "/auth/organizations" },
          { text: "Sessions & Protected Routes", link: "/auth/sessions" },
        ],
      },
      {
        text: "Database",
        collapsed: true,
        items: [
          { text: "Overview", link: "/database/" },
          { text: "Schema", link: "/database/schema" },
          { text: "Migrations", link: "/database/migrations" },
          { text: "Seeding", link: "/database/seeding" },
          { text: "Query Patterns", link: "/database/queries" },
        ],
      },
      {
        text: "Billing",
        collapsed: true,
        items: [
          { text: "Overview", link: "/billing/" },
          { text: "Plans & Pricing", link: "/billing/plans" },
          { text: "Checkout Flow", link: "/billing/checkout" },
          { text: "Webhooks", link: "/billing/webhooks" },
        ],
      },
      { text: "Email", link: "/email" },
      { text: "Testing", link: "/testing" },
      {
        text: "Deployment",
        collapsed: true,
        items: [
          { text: "Overview", link: "/deployment/" },
          { text: "Cloudflare Workers", link: "/deployment/cloudflare" },
          {
            text: "Production Database",
            link: "/deployment/production-database",
          },
          { text: "CI/CD", link: "/deployment/ci-cd" },
          { text: "Monitoring", link: "/deployment/monitoring" },
        ],
      },
      {
        text: "Recipes",
        collapsed: true,
        items: [
          { text: "Add a Page", link: "/recipes/new-page" },
          { text: "Add a tRPC Procedure", link: "/recipes/new-procedure" },
          { text: "Add a Database Table", link: "/recipes/new-table" },
          { text: "Add Teams", link: "/recipes/teams" },
          { text: "WebSockets", link: "/recipes/websockets" },
          { text: "File Uploads", link: "/recipes/file-uploads" },
        ],
      },
      {
        text: "Security",
        collapsed: true,
        items: [
          { text: "Security Checklist", link: "/security/checklist" },
          { text: "Incident Playbook", link: "/security/incident-playbook" },
          {
            text: "Security Policy Template",
            link: "/security/policy-template",
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor"/></svg>',
        },
        link: "https://chatgpt.com/g/g-69564f0a23088191846aa4072bd9397d-react-starter-kit-assistant",
        ariaLabel: "Ask GPT",
      },
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

  vite: {
    plugins: [llmstxt()],
  },
});
