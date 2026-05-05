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

resource "aws_lb" "app" {
  name               = "${local.name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = local.tags
}

resource "aws_lb_target_group" "app" {
  name_prefix = "smtg-"
  port        = var.container_port
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
    target_group_arn = aws_lb_target_group.app.arn
  }
  lifecycle {
    create_before_destroy = true
  }
}

locals {
  placeholder_task_definition = {
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
        image     = var.placeholder_image
        essential = true
        portMappings = [
          {
            containerPort = var.container_port
            hostPort      = var.container_port
            protocol      = "tcp"
          }
        ]
        environment = [
          {
            name  = "PORT"
            value = tostring(var.container_port)
          }
        ]
        command = [
          "sh",
          "-c",
          "node -e \"const http=require('http');http.createServer((req,res)=>{const body=req.url==='/api/health'?JSON.stringify({status:'ok',message:'ShopSmart placeholder',timestamp:new Date().toISOString()}):req.url==='/api/stats'?JSON.stringify({orders:42,period:'Last 7 days'}):JSON.stringify({status:'ok'});res.writeHead(200,{'Content-Type':'application/json'});res.end(body);}).listen(process.env.PORT||4000);setInterval(()=>{},1000);\""
        ]
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.app.name
            awslogs-region        = var.aws_region
            awslogs-stream-prefix = local.name
          }
        }
      }
    ]
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = local.placeholder_task_definition.family
  network_mode             = local.placeholder_task_definition.networkMode
  requires_compatibilities = local.placeholder_task_definition.requiresCompatibilities
  cpu                      = local.placeholder_task_definition.cpu
  memory                   = local.placeholder_task_definition.memory
  execution_role_arn       = local.placeholder_task_definition.executionRoleArn
  task_role_arn            = local.placeholder_task_definition.taskRoleArn
  container_definitions    = jsonencode(local.placeholder_task_definition.containerDefinitions)

  tags = local.tags
}

resource "aws_ecs_service" "app" {
  name                              = "${local.name}-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.app.arn
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
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${local.name}-api"
    container_port   = var.container_port
  }

  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  depends_on = [aws_lb_listener.http]

  tags = local.tags
}
