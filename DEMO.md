# ShopSmart — Viva Demo Guide

Step-by-step script for demonstrating the full project in your viva. Read each section's "What to say" out loud while you run the commands shown.

---

## 1. Architecture (1 min — say this first, no commands)

> "ShopSmart is a full-stack e-commerce app. The **frontend** is Next.js 15 / React 19 with Tailwind. The **backend** is Node.js + Express + Prisma ORM with a SQLite database. Both run as containers on **AWS ECS Fargate**, behind one **Application Load Balancer**, all provisioned by **Terraform** as Infrastructure-as-Code, and built/pushed via **GitHub Actions CI/CD** to **Amazon ECR**."

Diagram to draw on whiteboard:

```
 Browser ─► ALB (port 80)
              │
              ├── /api/*  ─► Target Group: smapi-* ─► ECS Service: shopsmart-api-service     (port 4000)
              │                                       └─► container: Express + Prisma + SQLite
              │
              └── /        ─► Target Group: smcli-* ─► ECS Service: shopsmart-client-service  (port 3000)
                                                      └─► container: Next.js
```

---

## 2. Show the source code (2 min)

```bash
ls
```
> "Top-level layout: `client/` is the Next.js app, `server/` is the Express API, `docker/` has the two multi-stage Dockerfiles, `terraform/` is the IaC, `scripts/` has helper deploy scripts, `.github/workflows/` has the CI and CD pipelines."

Point at:

| File | What it does |
|---|---|
| `client/app/layout.tsx` + `app/(store)/page.tsx` | Next.js App Router — server-rendered pages |
| `server/src/app.ts` | Express app: `helmet`, `cors`, `cookie-parser`, routes mounted under `/api` |
| `server/src/routes/*.routes.ts` | Auth, catalog, customer, admin route handlers |
| `server/prisma/schema.prisma` | SQLite schema — User, Product, Category, Order, etc. |
| `docker/Dockerfile.client` | Multi-stage: build Next.js → minimal Alpine runtime, non-root user, healthcheck |
| `docker/Dockerfile.server` | Multi-stage: TypeScript build + Prisma generate → runtime; runs `prisma db push` then starts server |
| `terraform/network.tf` | VPC `10.40.0.0/16`, 2 public subnets across AZs, IGW, security groups |
| `terraform/ecs.tf` | ALB, listener, two target groups, two task definitions, two ECS services |
| `terraform/ecr.tf` | Two ECR repos with image-retention lifecycle policy |
| `terraform/iam.tf` + `main.tf` | Uses AWS Lab Role; account ID derived dynamically from caller identity |

---

## 3. Run the app locally (skip if no time — 2 min)

```bash
# Terminal 1 - server
cd server && npm install && npm run prisma:generate
DATABASE_URL=file:./dev.db npx prisma db push
npm run dev

# Terminal 2 - client
cd client && npm install && npm run dev
```
> "The server runs on port 4000, the Next.js client on port 3000. Visiting `localhost:3000` shows the homepage; the client calls `localhost:4000/api/home` for products."

---

## 4. Show the CI pipeline passing (1 min)

```bash
gh run list --workflow=ci.yml --limit 5
```
or open the GitHub Actions tab.

> "Every push to `main` runs `ShopSmart CI`: Jest tests for the server, Vitest tests for the client, and uploads JUnit XML test artifacts."

---

## 5. Build and push container images to ECR (5 min — runs live)

```bash
./scripts/build_and_push_images.sh demo shopsmart-alb-XXXXX.us-east-1.elb.amazonaws.com
```

What this script does, step-by-step (explain while it runs):

1. Reads the AWS account ID via `aws sts get-caller-identity`.
2. **Creates the two ECR repos** (`shopsmart-api`, `shopsmart-client`) if missing.
3. **Logs Docker into ECR** with a temporary token from `aws ecr get-login-password`.
4. Sets up a **Docker buildx builder** for cross-platform builds.
5. **Builds the server image** for `linux/amd64` (Fargate's architecture, *not* the Mac's native arm64).
6. **Builds the client image** for `linux/amd64`, baking the ALB DNS into `NEXT_PUBLIC_API_URL` so the browser knows where to call the API.
7. **Pushes both images** with two tags: `:demo` and `:latest`.

> "Critically, we pass `--platform linux/amd64`. Without this, on an Apple Silicon Mac the image would be arm64-only, and Fargate would refuse to run it with `image Manifest does not contain descriptor matching platform 'linux/amd64'`. This was actually the root cause of our earlier deployment failure."

---

## 6. Provision the AWS infrastructure with Terraform (5 min)

```bash
cd terraform
terraform init
terraform plan -var "api_image=440121789364.dkr.ecr.us-east-1.amazonaws.com/shopsmart-api:demo" \
               -var "client_image=440121789364.dkr.ecr.us-east-1.amazonaws.com/shopsmart-client:demo"
```

Explain each resource block as the plan output scrolls:

| Resource | Purpose |
|---|---|
| `aws_vpc.main` | Isolated network, CIDR `10.40.0.0/16` |
| `aws_subnet.public[0,1]` | Two public subnets across two AZs (required for ALB high availability) |
| `aws_internet_gateway.main` + `aws_route_table.public` | Internet egress for Fargate tasks (so they can pull from ECR) |
| `aws_security_group.alb` | Allows port 80 from `0.0.0.0/0` |
| `aws_security_group.ecs` | Only allows ports 3000 and 4000 from the ALB SG |
| `aws_lb.app` | Application Load Balancer, internet-facing, in both subnets |
| `aws_lb_target_group.client` (port 3000) | Health-checks `GET /` on the Next.js container |
| `aws_lb_target_group.api` (port 4000) | Health-checks `GET /api/health` on the Express container |
| `aws_lb_listener.http` | Listens on port 80; default-forwards `/` to client TG |
| `aws_lb_listener_rule.api` | Path-pattern `/api/*` → forwards to API TG (priority 10) |
| `aws_ecs_cluster.main` | Logical Fargate cluster with Container Insights enabled |
| `aws_cloudwatch_log_group.app` | Centralised logs for both containers (14-day retention) |
| `aws_ecs_task_definition.client` / `api` | Container specs: image, CPU/memory, env vars, log driver |
| `aws_ecs_service.client` / `api` | Maintains 1 desired task each, registers tasks with their target group |
| `aws_ecr_repository.api` / `client` | Container image registries with retain-newest-10 lifecycle |
| `aws_s3_bucket.terraform_state` + `aws_dynamodb_table.terraform_locks` | Remote backend for Terraform state with locking |

Then apply:

```bash
terraform apply -var "api_image=...:demo" -var "client_image=...:demo" -auto-approve
```

> "Terraform creates everything in dependency order. The ALB is created first because the listener/target groups need its ARN. The ECS services are created last because they need both the task definition ARN and the listener ARN — the `depends_on` makes that explicit."

When apply finishes, show the outputs:

```bash
terraform output
```

> "We export the ALB DNS name, the ECR URLs, the ECS service names, and the role ARNs — these are everything anyone needs to interact with the deployment."

---

## 7. Watch ECS roll the new tasks out (2 min)

```bash
ALB=$(terraform -chdir=terraform output -raw alb_dns_name)
echo "ALB: $ALB"

aws ecs describe-services \
  --cluster shopsmart-cluster \
  --services shopsmart-client-service shopsmart-api-service \
  --query 'services[*].[serviceName,desiredCount,runningCount,pendingCount]' \
  --output table
```

> "Each service shows desired=1, running=1 once Fargate has pulled the image and the container has passed its healthcheck. The healthcheck on the client target group hits `/`; on the API it hits `/api/health`."

Tail the logs to prove the containers booted:

```bash
aws logs tail /ecs/shopsmart --follow --since 5m
```

> "We use the awslogs driver, so every `console.log` from Express and every Next.js request log lands in CloudWatch."

---

## 8. Demonstrate the live app (3 min)

```bash
# Health endpoint
curl http://$ALB/api/health
# → {"ok":true,"service":"shopsmart-api"}

# Homepage HTML
curl -I http://$ALB/
# → HTTP/1.1 200 OK
```

Then open `http://$ALB/` in a browser. Walk through:

1. **Homepage** — hero carousel, collections, new arrivals, best sellers, reviews.
2. **Catalog page** — `/catalog` (or click into a category).
3. **Product detail** — pick a product; show the gallery, variants, "Add to cart".
4. **Cart** — the cart sidebar uses the `CartProvider` React context.
5. **Auth** — `/auth/login` and `/auth/signup`. Show the Zod-validated form.
6. **Account** — once logged in, `/account` shows orders, addresses, wishlist.
7. **Admin** — log in as admin (created by the seed); show `/admin` dashboard, products list, image upload via Cloudinary integration.

> "Notice the URL stays on the same ALB DNS for everything. The ALB routes `/api/*` to the Express API and everything else to Next.js. The browser never knows two services exist — that's what an L7 load balancer gives you."

---

## 9. Show the security model (1 min)

> "The ECS security group only accepts traffic from the ALB security group on the container ports — nothing on the public internet can hit a Fargate task directly. Tasks run as a non-root `appuser` inside the container (see the Dockerfiles). The Lab Role is used as both task execution role and task role; in production we'd split these and grant least-privilege."

---

## 10. Show CD (3 min — optional but great)

```bash
cat .github/workflows/cd.yml
```

Walk through:

1. Configure AWS creds from GitHub Secrets.
2. `terraform init` against the S3 backend.
3. Build and push both images via `docker/build-push-action`.
4. `terraform plan` → `terraform apply` with the new image tags.
5. **Verification step** — curl `/api/health` 20 times until it returns 200.

> "So a `git push` to main rebuilds, redeploys, and verifies in roughly 5 minutes. If the healthcheck step fails, the workflow fails and we know production is broken before anyone tells us."

---

## 11. Tear-down (mention but don't run)

```bash
cd terraform
terraform destroy -auto-approve
```

> "Because everything is in Terraform, tearing the entire stack down is one command. The state S3 bucket and ECR repos are protected by `prevent_destroy` so we don't accidentally lose the build artifacts."

---

## Likely viva questions and answers

**Q: Why ECS Fargate and not EC2 / Kubernetes?**
A: Fargate gives serverless containers — no EC2 to patch, no kube-control-plane to operate. We pay per second of vCPU/memory used. For a small e-commerce demo it removes a whole layer of ops work. EKS would only make sense if we needed multi-cloud or advanced scheduling.

**Q: Why two services instead of one combined image?**
A: Independent scaling and independent deploys. If checkout traffic spikes we scale only the API; if marketing pushes a campaign we scale only the client. They have different healthchecks, different memory profiles, and different release cadences.

**Q: How does the client know the API URL?**
A: At image **build time** we bake `NEXT_PUBLIC_API_URL` (the ALB DNS + `/api`) into the JS bundle — Next.js inlines `NEXT_PUBLIC_*` vars at compile time, so they reach the browser. At **runtime** the same value is also passed as an env var so server-side rendering uses it.

**Q: What about the database?**
A: Currently SQLite inside the container — it's wiped on every redeploy because Fargate has no persistent disk. For a real deployment we'd swap the Prisma datasource to `postgresql` and add an `aws_db_instance` (RDS) resource to Terraform, plus a security-group rule allowing the ECS SG to reach port 5432. The Prisma schema would not change.

**Q: How is Terraform state shared between teammates / CI?**
A: S3 backend with `encrypt = true` and bucket versioning. DynamoDB table for state locking so two people can't apply at the same time.

**Q: What's in the CI test step?**
A: Jest with the `jest-junit` reporter for the server (unit + integration), Vitest for the client (component + integration). JUnit XML uploaded as workflow artifacts so we can see test history in the Actions UI.

**Q: How would you add HTTPS?**
A: Request an ACM certificate for a domain, add an `aws_lb_listener` on port 443 with `protocol = "HTTPS"` and the cert ARN, and an `aws_lb_listener` redirect on port 80 → 443.

**Q: How do you debug a failed deployment?**
A: Three places — `aws ecs describe-services` to see service events ("CannotPullContainerError" etc.), `aws logs tail /ecs/shopsmart` for application logs, and the ALB target group health page in the EC2 console for healthcheck failures.

---

## One-liner cheat sheet (laminate this)

```bash
# Login
aws sts get-caller-identity

# Build + push images (linux/amd64 — important on Apple Silicon!)
./scripts/build_and_push_images.sh $(git rev-parse --short HEAD) <alb-dns>

# Provision / update infra
cd terraform && terraform apply \
  -var "api_image=$ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/shopsmart-api:$TAG" \
  -var "client_image=$ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/shopsmart-client:$TAG" \
  -auto-approve

# Get the URL
terraform output -raw alb_dns_name

# Watch services come up
aws ecs describe-services --cluster shopsmart-cluster \
  --services shopsmart-client-service shopsmart-api-service \
  --query 'services[*].[serviceName,desiredCount,runningCount]' --output table

# Watch logs
aws logs tail /ecs/shopsmart --follow

# Verify
curl http://$(terraform -chdir=terraform output -raw alb_dns_name)/api/health
```
