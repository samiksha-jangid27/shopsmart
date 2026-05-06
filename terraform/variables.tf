variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix used for resource naming."
  type        = string
  default     = "shopsmart"
}

variable "tf_state_bucket_name" {
  description = "Unique S3 bucket used for Terraform state."
  type        = string
  default     = "shopsmart-tfstate-samiksha-20260505"
}

variable "vpc_cidr" {
  description = "CIDR block for the project VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "api_container_port" {
  description = "Port exposed by the API container."
  type        = number
  default     = 4000
}

variable "client_container_port" {
  description = "Port exposed by the client container."
  type        = number
  default     = 3000
}

variable "desired_count" {
  description = "Desired number of ECS tasks."
  type        = number
  default     = 1
}

variable "cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "placeholder_image" {
  description = "Public image used before the real ECR image is deployed."
  type        = string
  default     = "public.ecr.aws/docker/library/node:20-alpine"
}

variable "use_existing_iam_roles" {
  description = "If true, use provided IAM role ARNs instead of creating new roles. Helpful for limited-permission accounts."
  type        = bool
  default     = true
}

variable "ecs_task_execution_role_arn" {
  description = "ARN of an existing ECS task execution role. Empty string means derive LabRole ARN from current account ID."
  type        = string
  default     = ""
}

variable "ecs_task_role_arn" {
  description = "ARN of an existing ECS task role. Empty string means derive LabRole ARN from current account ID."
  type        = string
  default     = ""
}

variable "api_image" {
  description = "Full ECR image URI for the API (overrides placeholder when non-empty)."
  type        = string
  default     = ""
}

variable "client_image" {
  description = "Full ECR image URI for the client (overrides placeholder when non-empty)."
  type        = string
  default     = ""
}

variable "jwt_secret" {
  description = "Secret used to sign JWT auth tokens."
  type        = string
  default     = "change-me-shopsmart-demo-secret"
  sensitive   = true
}
