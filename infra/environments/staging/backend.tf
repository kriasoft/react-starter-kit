terraform {
  backend "s3" {
    bucket = "terraform-state-staging"
    key    = "react-starter/staging.tfstate"
    region = "us-east-1"
  }
}