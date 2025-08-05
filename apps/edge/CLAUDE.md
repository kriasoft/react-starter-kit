## Purpose

Cloudflare Workers edge deployment layer for the React app and API.

## Commands

- `bun wrangler dev` - Start the development server with live reload (run from root: `bun --filter @repo/edge dev`)
- `bun wrangler deploy --config apps/edge/wrangler.jsonc` - Deploy to Cloudflare Workers (run from root)
