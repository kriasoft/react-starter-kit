# ADR-002 Terraform provisions dependencies, Wrangler owns Workers

**Status:** Accepted

**Date:** 2026-08-09 **Tags:** infrastructure, terraform, cloudflare, deployment

## Problem

- Terraform and Wrangler both configured the same Workers. Terraform declared `subdomain.enabled` while every `wrangler.jsonc` set `workers_dev: false`, so each tool undid the other. Terraform also re-derived worker names with its own `-${environment}` suffix rule that had to stay in lockstep with Wrangler's.
- The split had no upside: Terraform created Workers without code, and `wrangler deploy` creates a missing Worker anyway.

## Decision

- Terraform provisions only what the Workers consume: two Hyperdrive configurations per environment, plus an opt-in R2 uploads bucket. Wrangler owns worker names, code, routes, custom domains, bindings, vars and secrets. No field is managed by both.
- The public hostname moves to a Wrangler [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), since the `web` worker is the origin. Wrangler creates the DNS record and certificate, so Terraform owns no DNS and needs no zone permissions.
- The only values crossing the boundary are stable, non-secret resource identifiers: the two Hyperdrive IDs, plus the R2 bucket name when the optional uploads bucket is enabled.

## Alternatives (brief)

- **Terraform owns Worker versions and deployments too** – couples every application deploy to an infrastructure apply, and Cloudflare requires replicating the whole Wrangler config into the uploading tool.
- **Drop Terraform, use `wrangler hyperdrive create`** – simpler onboarding, but loses declarative reproducibility and drift detection for the one durable, credential-bearing resource.
- **Keep the placeholder `AAAA 100::` DNS record and plain routes** – still workable, and still necessary if you split one hostname across several Workers by path. It reintroduces the ordering dependency where Terraform must create DNS before Wrangler can attach a route.

## Impact

- Positive: application deploys never run Terraform; Terraform's API token needs only Hyperdrive access, plus R2 when the uploads bucket is enabled – never workers, routes or DNS; there is one answer to "which tool owns this field".
- Negative/Risks: Hyperdrive IDs are copied into `wrangler.jsonc` by hand once per environment. A Custom Domain claims the whole hostname, so serving a second Worker from a path on it requires switching back to routes plus a DNS record.

## Links

- Code/Docs: `infra/README.md`, `infra/modules/cloudflare/`, [Deployment](/deployment/cloudflare)
- Related ADRs: [ADR-001](/adr/001-auth-hint-cookie)
