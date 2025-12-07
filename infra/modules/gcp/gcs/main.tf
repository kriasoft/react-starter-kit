resource "google_storage_bucket" "bucket" {
  name          = var.bucket_name
  location      = var.location
  force_destroy = false

  uniform_bucket_level_access = true

  dynamic "cors" {
    for_each = length(var.cors_origins) > 0 ? [1] : []
    content {
      origin = var.cors_origins
      method = ["GET", "PUT", "POST", "OPTIONS"]
      response_header = [
        "Content-Type",
        "Access-Control-Allow-Origin",
        "x-goog-resumable"
      ]
      max_age_seconds = 3600
    }
  }
}
