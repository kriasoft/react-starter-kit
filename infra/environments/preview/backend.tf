# PREREQUISITE: Create R2 bucket first:
# bun wrangler r2 bucket create tfstate --location enam
# Must exist before terraform init, or backend initialization will fail
#
# INIT: After configuring credentials, run:
# terraform init -upgrade -reconfigure

terraform {
  # R2 backend: S3-compatible with zero egress fees for CF Workers
  backend "s3" {
    bucket = "example-terraform-state"
    key    = "preview/terraform.tfstate" # Isolates preview state from other environments

    # R2 compatibility flags (required - will fail with AWS S3 defaults)
    region                      = "auto" # R2 fixed requirement
    skip_credentials_validation = true   # R2 auth differs from AWS
    skip_metadata_api_check     = true   # R2 subset of S3 API
    skip_region_validation      = true   # "auto" invalid in AWS
    skip_requesting_account_id  = true   # R2 omits account ID
    skip_s3_checksum            = true   # R2 checksum format differs
    use_path_style              = true   # R2 endpoint requirement

    # REQUIRED: Configure credentials via one of these methods:
    #   1) Set up AWS_* env vars - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
    #   2) Use -backend-config flags, e.g. -backend-config="access_key=your-key"
    #   3) Create backend_terraform.tf with real values
    # WARNING: Never commit real credentials
    access_key = "<YOUR_R2_ACCESS_KEY_ID>"     # R2 token ID
    secret_key = "<YOUR_R2_SECRET_ACCESS_KEY>" # R2 token secret

    endpoints = {
      # REQUIRED: Replace <YOUR_R2_ACCOUNT_ID> with actual CF account ID
      s3 = "https://<YOUR_R2_ACCOUNT_ID>.r2.cloudflarestorage.com"
    }
  }
}
