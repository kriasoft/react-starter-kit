# Hybrid stack: GCP backend with optional Cloudflare edge.
# Workers are deployed separately via Wrangler.

# Cloud SQL PostgreSQL
module "database" {
  source = "../../modules/gcp/cloud-sql"

  project_id    = var.gcp_project_id
  region        = var.gcp_region
  instance_name = "${var.project_slug}-${var.environment}"
  database_name = var.project_slug
  tier          = var.cloud_sql_tier
}

# GCS bucket for uploads
module "storage" {
  source = "../../modules/gcp/gcs"

  project_id  = var.gcp_project_id
  location    = var.gcp_region
  bucket_name = "${var.project_slug}-${var.environment}-uploads"
}

# Cloud Run API service
module "api" {
  source = "../../modules/gcp/cloud-run"

  project_id   = var.gcp_project_id
  region       = var.gcp_region
  service_name = "${var.project_slug}-api-${var.environment}"
  image        = var.api_image

  cloud_sql_connection = module.database.connection_name

  env_vars = {
    DATABASE_URL = module.database.connection_string
    GCS_BUCKET   = module.storage.bucket_name
  }
}

# Optional: Cloudflare DNS for edge routing.
# Deploy the edge proxy Worker separately via Wrangler.
module "dns" {
  count  = var.enable_edge_routing && var.hostname != "" ? 1 : 0
  source = "../../modules/cloudflare/dns"

  zone_id  = var.cloudflare_zone_id
  hostname = var.hostname
}
