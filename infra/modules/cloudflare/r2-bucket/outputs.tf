output "name" {
  description = "R2 bucket name"
  value       = cloudflare_r2_bucket.bucket.name
}

output "id" {
  description = "R2 bucket ID"
  value       = cloudflare_r2_bucket.bucket.id
}
