#!/usr/bin/env bash
set -euo pipefail

# Build and push server and client images to ECR.
# Requires: aws CLI configured, Docker, jq, git
# Usage: ./scripts/build_and_push_images.sh [tag]

TAG=${1:-$(git rev-parse --short HEAD 2>/dev/null || date +%s)}
REGION=${AWS_REGION:-us-east-1}

echo "Using tag: $TAG"

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --region "$REGION")
REPO_API="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopsmart-api"
REPO_CLIENT="$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/shopsmart-client"

# Ensure repos exist (noop if created by Terraform)
aws ecr describe-repositories --repository-names shopsmart-api --region "$REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name shopsmart-api --region "$REGION" >/dev/null
aws ecr describe-repositories --repository-names shopsmart-client --region "$REGION" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name shopsmart-client --region "$REGION" >/dev/null

# Login to ECR
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Build server image
echo "Building server image..."
docker build -f docker/Dockerfile.server -t "$REPO_API:$TAG" .

# Build client image
echo "Building client image..."
# client build context is ./client; adjust if using Next.js build hooks
docker build -f docker/Dockerfile.client -t "$REPO_CLIENT:$TAG" ./client

# Push images
echo "Pushing images to ECR..."
docker push "$REPO_API:$TAG"
docker push "$REPO_CLIENT:$TAG"

echo "Images pushed:"
echo "  $REPO_API:$TAG"
echo "  $REPO_CLIENT:$TAG"

echo
echo "To deploy these images with Terraform run:"
echo "  cd terraform"
echo "  terraform apply -var \"api_image=$REPO_API:$TAG\" -var \"client_image=$REPO_CLIENT:$TAG\""

exit 0
