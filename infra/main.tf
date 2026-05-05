data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name = var.project_name
  tags = {
    Project = var.project_name
    Managed = "terraform"
  }
}
