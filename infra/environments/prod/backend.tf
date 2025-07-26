terraform {
  backend "s3" {
    bucket = "terraform-state-prod"
    key    = "react-starter/prod.tfstate"
    region = "us-east-1"
  }
}