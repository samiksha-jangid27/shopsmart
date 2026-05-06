terraform {
  backend "s3" {
    bucket  = "shopsmart-tfstate-samiksha-20260505"
    key     = "shopsmart/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
