#!/usr/bin/env bash
set -euo pipefail

# Build and push server and client images to ECR for linux/amd64 (Fargate).
# Requires: aws CLI configured, Docker (with buildx), git
# Usage: ./scripts/build_and_push_images.sh [tag] [alb_dns]
#   tag      - image tag (defaults to short git SHA)
#   alb_dns  - ALB DNS name to bake into NEXT_PUBLIC_API_URL (optional;
#              defaults to /api which only works for browser-side calls)

TAG=${1:-$(git rev-parse --short HEAD 2>/dev/null || date +%s)}
ALB_DNS=${2:-}
REGION=${AWS_REGION:-us-east-1}

echo "Using tag: $TAG"

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --region "$REGION")
REPO_API="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopsmart-api"
REPO_CLIENT="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopsmart-client"

# Ensure ECR repos exist (idempotent)
aws ecr describe-repositories --repository-names shopsmart-api --region "$REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name shopsmart-api --region "$REGION" >/dev/null
aws ecr describe-repositories --repository-names shopsmart-client --region "$REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name shopsmart-client --region "$REGION" >/dev/null

# Login to ECR
aws ecr get-login-password --region "$REGION" | \
  docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Ensure a buildx builder exists
docker buildx inspect shopsmart-builder >/dev/null 2>&1 || \
  docker buildx create --name shopsmart-builder --use >/dev/null
docker buildx use shopsmart-builder

if [ -n "$ALB_DNS" ]; then
  CLIENT_API_URL="http://${ALB_DNS}/api"
  CLIENT_APP_URL="http://${ALB_DNS}"
else
  # First-pass build before ALB exists. Use placeholder URLs that are
  # syntactically valid (so `new URL()` doesn't throw at build time).
  CLIENT_API_URL="http://localhost:4000/api"
  CLIENT_APP_URL="http://localhost:3000"
fi

echo "Building server image (linux/amd64) -> $REPO_API:$TAG"
docker buildx build \
  --platform linux/amd64 \
  -f docker/Dockerfile.server \
  -t "$REPO_API:$TAG" \
  -t "$REPO_API:latest" \
  --push \
  .

echo "Building client image (linux/amd64) -> $REPO_CLIENT:$TAG"
echo "  NEXT_PUBLIC_API_URL=$CLIENT_API_URL"
docker buildx build \
  --platform linux/amd64 \
  -f docker/Dockerfile.client \
  --build-arg "NEXT_PUBLIC_API_URL=$CLIENT_API_URL" \
  --build-arg "NEXT_PUBLIC_APP_URL=$CLIENT_APP_URL" \
  -t "$REPO_CLIENT:$TAG" \
  -t "$REPO_CLIENT:latest" \
  --push \
  .

echo
echo "Images pushed:"
echo "  $REPO_API:$TAG"
echo "  $REPO_CLIENT:$TAG"
echo
echo "To deploy with Terraform:"
echo "  cd terraform"
echo "  terraform apply -var \"api_image=$REPO_API:$TAG\" -var \"client_image=$REPO_CLIENT:$TAG\""

exit 0
