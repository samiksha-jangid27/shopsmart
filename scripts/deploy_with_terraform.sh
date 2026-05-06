#!/usr/bin/env bash
set -euo pipefail

# Run terraform init and apply with provided image variables.
# Usage: ./scripts/deploy_with_terraform.sh <api_image> <client_image>

API_IMAGE=${1:-}
CLIENT_IMAGE=${2:-}
TF_DIR="terraform"

if [ -z "$API_IMAGE" ] || [ -z "$CLIENT_IMAGE" ]; then
  echo "Usage: $0 <api_image> <client_image>"
  exit 2
fi

pushd "$TF_DIR" >/dev/null
terraform init
terraform apply -auto-approve -var "api_image=$API_IMAGE" -var "client_image=$CLIENT_IMAGE"
popd >/dev/null

echo "Terraform apply finished. Verify ECS services and ALB health as needed."
