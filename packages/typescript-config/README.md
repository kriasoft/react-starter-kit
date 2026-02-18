# TypeScript Configuration

Shared TypeScript configuration for the monorepo.

## Usage

Extend from the appropriate configuration in your `tsconfig.json`:

```jsonc
// React applications
{ "extends": "@repo/typescript-config/react.jsonc" }

// Node.js/Bun applications
{ "extends": "@repo/typescript-config/node.jsonc" }

// Cloudflare Workers
{ "extends": "@repo/typescript-config/cloudflare.jsonc" }
```

## Available Configurations

- `base.jsonc` -- Core strict-mode configuration shared by all targets
- `react.jsonc` -- React applications with DOM types and JSX support
- `node.jsonc` -- Node.js/Bun backend services
- `cloudflare.jsonc` -- Cloudflare Workers edge functions
