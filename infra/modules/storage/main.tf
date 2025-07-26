resource "cloudflare_r2_bucket" "main" {
  account_id = var.account_id
  name       = "${var.project_name}-${var.environment}"
  location   = var.r2_location
}

resource "cloudflare_r2_bucket" "uploads" {
  account_id = var.account_id
  name       = "${var.project_name}-uploads-${var.environment}"
  location   = var.r2_location
}
