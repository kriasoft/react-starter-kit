# Worker resource without code. Deploy via Wrangler.
# Routes managed via wrangler.jsonc (routes live with code, not infra).

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = ">= 5.15.0"
    }
  }
}

resource "cloudflare_worker" "worker" {
  account_id = var.account_id
  name       = var.name

  observability = var.observability_enabled ? {
    enabled            = true
    head_sampling_rate = var.head_sampling_rate
  } : null

  subdomain = var.subdomain_enabled ? {
    enabled          = true
    previews_enabled = var.previews_enabled
  } : null

  tags = var.tags
}
