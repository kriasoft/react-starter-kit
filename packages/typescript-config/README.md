# TypeScript Configuration

Shared TypeScript configuration for the monorepo.

## Usage

Add this package as a development dependency:

```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*"
  }
}
```

Then extend from the appropriate configuration in your `tsconfig.json`:

### For React applications

```json
{
  "extends": "@repo/typescript-config/react.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### For Node.js/Bun applications

```json
{
  "extends": "@repo/typescript-config/node.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### For Cloudflare Workers

```json
{
  "extends": "@repo/typescript-config/cloudflare.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## Available Configurations

- `base.json` - Core configuration with strict mode and modern defaults
- `react.json` - React applications with DOM types and JSX support
- `node.json` - Node.js/Bun backend services
- `cloudflare.json` - Cloudflare Workers edge functions

## Features

- **Strict mode** enabled by default for maximum type safety
- **Modern module resolution** optimized for bundlers
- **Project references** support for better monorepo performance
- **Centralized path aliases** for consistent imports across the monorepo
- **Environment-specific** configurations for different runtime targets
