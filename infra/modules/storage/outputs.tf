output "main_bucket_name" {
  description = "The name of the main R2 bucket"
  value       = cloudflare_r2_bucket.main.name
}

output "main_bucket_id" {
  description = "The ID of the main R2 bucket"
  value       = cloudflare_r2_bucket.main.id
}

output "uploads_bucket_name" {
  description = "The name of the uploads R2 bucket"
  value       = cloudflare_r2_bucket.uploads.name
}

output "uploads_bucket_id" {
  description = "The ID of the uploads R2 bucket"
  value       = cloudflare_r2_bucket.uploads.id
}