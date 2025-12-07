bucket = "tf-state"
key    = "prod/edge/terraform.tfstate"

endpoints = {
  s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
}

# Do not hard-code secrets here. Set credentials via environment variables:
# access_key = "..." → AWS_ACCESS_KEY_ID
# secret_key = "..." → AWS_SECRET_ACCESS_KEY

skip_credentials_validation = true
skip_metadata_api_check     = true
skip_region_validation      = true
skip_requesting_account_id  = true
skip_s3_checksum            = true
region                      = "auto"
