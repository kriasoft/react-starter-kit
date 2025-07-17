# Server Workspace

Node.js/Bun server for Google Cloud Run, serving tRPC API from `api/` workspace.

## Commands

- `bun --cwd server dev` - Development server
- `bun --cwd server build` - Production build
- `bun --cwd server start` - Start production

## Config

- `PORT` - Server port (default: 8080)
- Endpoints: `/health`, `/trpc/*`
