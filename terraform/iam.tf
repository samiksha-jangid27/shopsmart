data "aws_iam_policy_document" "ecs_task_execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution" {
  count              = var.use_existing_iam_roles ? 0 : 1
  name               = "${local.name}-ecs-task-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
  tags               = local.tags
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  count      = var.use_existing_iam_roles ? 0 : 1
  role       = aws_iam_role.ecs_task_execution[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  count              = var.use_existing_iam_roles ? 0 : 1
  name               = "${local.name}-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_assume_role.json
  tags               = local.tags
}

// Local outputs to expose ARNs whether created here or provided via variables.
// When use_existing_iam_roles is true and the variable is empty, derive
// the LabRole ARN from the current AWS account (sandbox/lab environment default).
locals {
  execution_role_arn = var.use_existing_iam_roles ? (length(trimspace(var.ecs_task_execution_role_arn)) > 0 ? var.ecs_task_execution_role_arn : local.lab_role_arn) : (length(aws_iam_role.ecs_task_execution) > 0 ? aws_iam_role.ecs_task_execution[0].arn : "")
  task_role_arn      = var.use_existing_iam_roles ? (length(trimspace(var.ecs_task_role_arn)) > 0 ? var.ecs_task_role_arn : local.lab_role_arn) : (length(aws_iam_role.ecs_task) > 0 ? aws_iam_role.ecs_task[0].arn : "")
}
