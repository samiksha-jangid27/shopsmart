data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

locals {
  name       = var.project_name
  account_id = data.aws_caller_identity.current.account_id
  lab_role_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  tags = {
    Project = var.project_name
    Managed = "terraform"
  }
}
