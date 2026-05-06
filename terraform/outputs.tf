output "terraform_state_bucket" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "alb_dns_name" {
  value = aws_lb.app.dns_name
}

output "ecr_repository_api_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_repository_client_url" {
  value = aws_ecr_repository.client.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_api_name" {
  value = aws_ecs_service.api.name
}

output "ecs_service_client_name" {
  value = aws_ecs_service.client.name
}

output "execution_role_arn" {
  value = local.execution_role_arn
}

output "task_role_arn" {
  value = local.task_role_arn
}
