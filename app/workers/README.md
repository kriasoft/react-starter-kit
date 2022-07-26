# Application Routing / Reverse Proxy

Light-weight reverse proxy implemented by using [Cloudflare Workers](https://workers.cloudflare.com/).

- `https://example.com/`, `/about`, `/pricing`, `/blog/*`, etc.<br>
  ↳ Routed to `https://example.webflow.io`

- `https://example.com/help/*`<br>
  ↳ Routed to `https://intercom.help`

- `https://example.com/graphql`, `/auth/google`, `/auth/google/return` etc.<br>
  ↳ Routed to the GraphQL API server (Google Cloud Function or Cloud Run)

- `https://example.com/admin/*`<br>
  ↳ Routed to the admin dashboard (Cloudflare Workers Site)

- `https://example.com/*` the rest of the pages<br>
  ↳ Routed to the main web application (Google Storage bucket or similar)
