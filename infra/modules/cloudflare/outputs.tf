# Outputs are the handoff to Wrangler: IDs are stable and non-secret, so they
# are safe to print, commit into wrangler.jsonc, and read from CI.

output "hyperdrive_cached_id" {
  description = "Hyperdrive ID for the HYPERDRIVE_CACHED binding."
  value       = cloudflare_hyperdrive_config.cached.id
}

output "hyperdrive_uncached_id" {
  description = "Hyperdrive ID for the HYPERDRIVE_UNCACHED binding."
  value       = cloudflare_hyperdrive_config.uncached.id
}

output "uploads_bucket_name" {
  description = "R2 uploads bucket name, or null when uploads_enabled is false."
  value       = one(cloudflare_r2_bucket.uploads[*].name)
}

output "wrangler_hyperdrive_bindings" {
  description = "Ready to paste into the matching environment block of apps/api/wrangler.jsonc."
  value = jsonencode([
    { binding = "HYPERDRIVE_CACHED", id = cloudflare_hyperdrive_config.cached.id },
    { binding = "HYPERDRIVE_UNCACHED", id = cloudflare_hyperdrive_config.uncached.id },
  ])
}
