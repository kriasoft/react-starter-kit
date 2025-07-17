# Server

Alternative deployment option for hosting the tRPC API on Google Cloud Run.

## Overview

Bun-based server that hosts the tRPC API from the `api/` workspace. This provides an alternative to the primary Cloudflare Workers deployment (`edge/`) for teams using Google Cloud Platform.

## Tech Stack

- **Runtime**: Bun with ESM
- **Framework**: Hono
- **API**: tRPC (from `api/` workspace)
- **Deployment**: Google Cloud Run

## Quick Start

```bash
# Development
bun --cwd server dev         # Start with file watching
bun --cwd server start       # Production mode

# Build
bun --cwd server build       # Bundle for deployment
bun --cwd server typecheck   # Type checking
```

## Configuration

Environment variables:

```bash
PORT=8080                    # Server port (default: 8080)
DATABASE_URL=                # Database connection
AUTH_SECRET=                 # Authentication secret
```

## Endpoints

- `GET /health` - Health check for Cloud Run
- `POST /trpc/*` - tRPC API endpoints

## Deployment

### Docker

```bash
# Build and test locally
docker build -t gcr.io/[PROJECT_ID]/server .
docker run -p 8080:8080 gcr.io/[PROJECT_ID]/server

# Deploy to Cloud Run
docker push gcr.io/[PROJECT_ID]/server
gcloud run deploy server \
  --image gcr.io/[PROJECT_ID]/server \
  --platform managed \
  --region us-central1
```

### GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/setup-gcloud@v2
      - run: |
          gcloud builds submit --tag gcr.io/$PROJECT_ID/server
          gcloud run deploy server --image gcr.io/$PROJECT_ID/server
```

## Differences from Edge Deployment

| Feature             | Edge (Cloudflare)    | Server (Cloud Run)      |
| ------------------- | -------------------- | ----------------------- |
| Global distribution | ✅                   | ❌ (regional)           |
| Cold starts         | Minimal              | Possible                |
| Node.js APIs        | Limited              | Full access             |
| Monitoring          | Cloudflare Analytics | Google Cloud Monitoring |

## Related Documentation

- [API Documentation](../api/README.md)
- [Edge Deployment](../edge/README.md)
- [Main Project README](../README.md)
