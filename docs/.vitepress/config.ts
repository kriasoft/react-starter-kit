import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";

/**
 * VitePress configuration.
 * @see https://vitepress.dev/reference/site-config
 */
export default defineConfig({
  title: "Clara",
  description:
    "Guided classroom routine assistant with coordination review and assisted ActiveSoft launch",

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

  head: [
    ["meta", { name: "theme-color", content: "#6366f1" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Clara" }],
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
      { text: "Product", link: "/product/" },
      { text: "Roadmap", link: "/product/roadmap" },
      { text: "ActiveSoft", link: "/integrations/activesoft" },
      { text: "Docs", link: "/getting-started/" },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message:
        'LLM context: <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a><br>Released under the MIT License.',
      copyright: "Clara",
    },

    sidebar: [
      {
        text: "Product",
        items: [
          { text: "Brief", link: "/product/" },
          { text: "Roadmap", link: "/product/roadmap" },
          { text: "ActiveSoft Boundary", link: "/integrations/activesoft" },
        ],
      },
      {
        text: "Decision Records",
        collapsed: true,
        items: [
          { text: "Overview", link: "/adr/" },
          { text: "Template", link: "/adr/000-template" },
          { text: "Auth Hint Cookie", link: "/adr/001-auth-hint-cookie" },
          {
            text: "PWA-First Capture",
            link: "/adr/002-clara-pwa-first-guided-capture",
          },
          {
            text: "ActiveSoft Assisted Launch",
            link: "/adr/003-activesoft-assisted-launch-before-api-automation",
          },
          {
            text: "Student Privacy Boundary",
            link: "/adr/004-student-record-privacy-boundary",
          },
        ],
      },
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
  },

  vite: {
    plugins: [llmstxt()],
  },
});
