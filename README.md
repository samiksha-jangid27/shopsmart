# ShopSmart

ShopSmart is a premium, high-end e-commerce platform designed with an editorial, Dribbble-inspired UI aesthetic. It features a complete React frontend connected to a Node/Express backend, deployed on AWS ECS Fargate via Infrastructure as Code (Terraform).

## 1. Architecture

**Application Stack**:
- **Frontend**: React 18 + Vite 5 SPA, styled with Tailwind CSS v4, deployed as containerized nginx service on ECS Fargate
- **Backend**: Node.js 20 Express server providing RESTful APIs (`/api/health`, `/api/stats`), deployed as containerized service on ECS Fargate
- **Infrastructure**: AWS ECS Fargate (container orchestration), ECR (image registry), S3 (Terraform state), VPC (networking), ALB (load balancing), IAM (access control), CloudWatch (logging)

**Data Flow**: Frontend fetches dynamic stats from backend via centralized API service (`client/src/services/api.js`), using `VITE_API_URL` environment variable to point to ALB DNS name in production.

## 2. Infrastructure as Code (Terraform)

All AWS infrastructure is defined in `terraform/` as code and managed by Terraform:
- **`infra/state.tf`**: S3 bucket for Terraform state with versioning, encryption (AES256), and public access block
- **`infra/network.tf`**: VPC (10.40.0.0/16), 2 public subnets, Internet Gateway, security groups
- **`infra/ecr.tf`**: ECR repository for Docker images with lifecycle policy (retain 10 newest)
- **`infra/ecs.tf`**: ECS Fargate cluster, ALB, target groups, CloudWatch logs, ECS services
- **`infra/iam.tf`**: ECS task execution role and task role with required IAM policies
- **`infra/versions.tf`**: Terraform configuration (≥1.6) with AWS provider ~5.0
- **`infra/outputs.tf`**: Exported values (S3 state bucket, ECR URL, ECS cluster name, ALB DNS)

**Before first deploy**: Create S3 bucket manually:
```bash
aws s3api create-bucket --bucket shopsmart-tfstate-<unique-id> --region us-east-1
```

## Deploy to AWS (ECR + ECS)

This repo includes helper scripts to build container images and deploy via Terraform. Ensure `aws` CLI, `docker`, and `terraform` are installed and configured.

1. Build and push images to ECR:

```bash
./scripts/build_and_push_images.sh <optional-tag>
# example: ./scripts/build_and_push_images.sh sha-$(git rev-parse --short HEAD)
```

2. Deploy (apply Terraform) to have ECS use the pushed images:

```bash
./scripts/deploy_with_terraform.sh <api_image> <client_image>
# example: ./scripts/deploy_with_terraform.sh \
# 111111111111.dkr.ecr.us-east-1.amazonaws.com/shopsmart-api:sha-abc \
# 111111111111.dkr.ecr.us-east-1.amazonaws.com/shopsmart-client:sha-abc
```

Notes:
- Terraform state is configured in `terraform/backend.tf` to use an S3 backend and DynamoDB for locks. Make sure the S3 bucket and DynamoDB table exist (the `terraform` configuration includes resources to create them if running under the same AWS credentials).
- The Terraform variables `api_image` and `client_image` can be passed to `terraform apply` to set the image URIs used by ECS task definitions.

## 3. CI/CD Pipeline

GitHub Actions unified workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main`:

1. **Test**: `npm test` in server (Jest with junit-xml) and client (Vitest)
2. **Terraform**: `terraform init` → `plan` → `apply` (provisions/updates AWS infrastructure)
3. **Build & Push**: Docker multi-stage builds for server and client, pushed to ECR with `:latest` and `:sha-<commit>` tags
4. **Deploy**: ECS service update with new image, waits for stable deployment
5. **Health Check**: 20-retry loop curling `/api/health` via ALB DNS

**Secrets Required** (set in GitHub repo Settings → Secrets and variables → Actions):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (if using temporary credentials)
- `AWS_REGION` (e.g., `us-east-1`)

## 4. Design Decisions

- **Multi-Stage Docker Builds**: Each Dockerfile builds dependencies in a builder stage, then copies only artifacts to a minimal runtime stage (non-root user, healthcheck, reduced layer count)
- **Centralized API Service**: `client/src/services/api.js` abstracts HTTP calls (fetchStats, fetchHealth) and respects `VITE_API_URL` env var
- **Terraform Backend State**: S3 bucket with encryption and versioning ensures team collaboration and disaster recovery
- **No Kubernetes**: ECS Fargate chosen for simpler operational model (AWS-managed control plane, pay-per-use compute)
- **Testing Strategy**:
  - Jest (server): Unit + integration tests with jest-junit reporter for CI artifacts
  - Vitest (client): Component + integration tests with React Testing Library
  - Cypress (E2E): Full user flow validation against running application

## 4. Challenges

*   **Tailwind Compatibility**: Upgrading to Tailwind v4 midway resulted in deprecated `@tailwind` tags failing. We immediately migrated our `index.css` to adopt the new `@import "tailwindcss"` standards.
*   **EADDRINUSE (Port Conflicts)**: During backend testing, port collisions occurred. We engineered the Node server to dynamically bind `process.env.PORT` gracefully over fallback mechanisms.
*   **ESLint Flat Config Friction**: Upgrading to the modern ESLint v10 required a complete rewrite of `.eslintrc.json` into a modern ESM `.mjs` flat configuration resolving node/jest globals.
