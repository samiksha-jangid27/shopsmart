resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${local.name}"
  retention_in_days = 14
  tags              = local.tags
}

resource "aws_ecs_cluster" "main" {
  name = "${local.name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.tags
}

# ─────────────────────────────────────────────────────────────────────────────
# ALB
# ─────────────────────────────────────────────────────────────────────────────

resource "aws_lb" "app" {
  name               = "${local.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = local.tags
}

resource "aws_lb_target_group" "client" {
  name_prefix = "smcli-"
  port        = var.client_container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    enabled             = true
    path                = "/"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group" "api" {
  name_prefix = "smapi-"
  port        = var.api_container_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    enabled             = true
    path                = "/api/health"
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = local.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.client.arn
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

# ─────────────────────────────────────────────────────────────────────────────
# CLIENT TASK
# ─────────────────────────────────────────────────────────────────────────────

locals {
  client_task_definition = {
    family                  = "${local.name}-client"
    networkMode             = "awsvpc"
    requiresCompatibilities = ["FARGATE"]
    cpu                     = tostring(var.cpu)
    memory                  = tostring(var.memory)
    executionRoleArn        = local.execution_role_arn
    taskRoleArn             = local.task_role_arn

    containerDefinitions = [
      {
        name      = "${local.name}-client"
        image     = var.client_image
        essential = true

        portMappings = [
          {
            containerPort = var.client_container_port
            hostPort      = var.client_container_port
            protocol      = "tcp"
          }
        ]

        environment = [
          {
            name  = "PORT"
            value = tostring(var.client_container_port)
          }
        ]

        logConfiguration = {
          logDriver = "awslogs"

          options = {
            awslogs-group         = aws_cloudwatch_log_group.app.name
            awslogs-region        = var.aws_region
            awslogs-stream-prefix = "${local.name}-client"
          }
        }
      }
    ]
  }
}

resource "aws_ecs_task_definition" "client" {
  family                   = local.client_task_definition.family
  network_mode             = local.client_task_definition.networkMode
  requires_compatibilities = local.client_task_definition.requiresCompatibilities
  cpu                      = local.client_task_definition.cpu
  memory                   = local.client_task_definition.memory
  execution_role_arn       = local.client_task_definition.executionRoleArn
  task_role_arn            = local.client_task_definition.taskRoleArn
  container_definitions    = jsonencode(local.client_task_definition.containerDefinitions)

  tags = local.tags
}

resource "aws_ecs_service" "client" {
  name                              = "${local.name}-client-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.client.arn
  desired_count                     = var.desired_count
  launch_type                       = "FARGATE"
  enable_execute_command            = true
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.client.arn
    container_name   = "${local.name}-client"
    container_port   = var.client_container_port
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.http]

  lifecycle {
    ignore_changes = [desired_count]
  }

  tags = local.tags
}

# ─────────────────────────────────────────────────────────────────────────────
# API TASK
# ─────────────────────────────────────────────────────────────────────────────

locals {
  api_task_definition = {
    family                  = "${local.name}-api"
    networkMode             = "awsvpc"
    requiresCompatibilities = ["FARGATE"]
    cpu                     = tostring(var.cpu)
    memory                  = tostring(var.memory)
    executionRoleArn        = local.execution_role_arn
    taskRoleArn             = local.task_role_arn

    containerDefinitions = [
      {
        name      = "${local.name}-api"
        image     = var.api_image
        essential = true

        portMappings = [
          {
            containerPort = var.api_container_port
            hostPort      = var.api_container_port
            protocol      = "tcp"
          }
        ]

        environment = [
          {
            name  = "PORT"
            value = tostring(var.api_container_port)
          }
        ]

        logConfiguration = {
          logDriver = "awslogs"

          options = {
            awslogs-group         = aws_cloudwatch_log_group.app.name
            awslogs-region        = var.aws_region
            awslogs-stream-prefix = "${local.name}-api"
          }
        }
      }
    ]
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = local.api_task_definition.family
  network_mode             = local.api_task_definition.networkMode
  requires_compatibilities = local.api_task_definition.requiresCompatibilities
  cpu                      = local.api_task_definition.cpu
  memory                   = local.api_task_definition.memory
  execution_role_arn       = local.api_task_definition.executionRoleArn
  task_role_arn            = local.api_task_definition.taskRoleArn
  container_definitions    = jsonencode(local.api_task_definition.containerDefinitions)

  tags = local.tags
}

resource "aws_ecs_service" "api" {
  name                              = "${local.name}-api-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.api.arn
  desired_count                     = var.desired_count
  launch_type                       = "FARGATE"
  enable_execute_command            = true
  health_check_grace_period_seconds = 60

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "${local.name}-api"
    container_port   = var.api_container_port
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.http]

  lifecycle {
    ignore_changes = [desired_count]
  }

  tags = local.tags
}