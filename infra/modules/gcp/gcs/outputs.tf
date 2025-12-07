output "bucket_name" {
  description = "Name of the GCS bucket"
  value       = google_storage_bucket.bucket.name
}

output "url" {
  description = "URL of the GCS bucket"
  value       = google_storage_bucket.bucket.url
}
