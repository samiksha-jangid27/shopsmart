#!/bin/bash

set -e

REGION="us-east-1"
KEY_NAME="vockey"
INSTANCE_TYPE="t3.micro"
VPC_ID="vpc-0171c7489699ae305"
SG_NAME="ubuntu-auto-sg"
TAG_NAME="Ubuntu-CLI-Auto"

echo "Fetching latest Ubuntu 24.04 AMI..."

AMI_ID=$(aws ec2 describe-images \
  --region $REGION \
  --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*" \
           "Name=state,Values=available" \
  --query 'reverse(sort_by(Images, &CreationDate))[0].ImageId' \
  --output text)

echo "Using AMI: $AMI_ID"

echo "Checking for existing security group..."

SG_ID=$(aws ec2 describe-security-groups \
  --region $REGION \
  --filters "Name=group-name,Values=$SG_NAME" \
  --query "SecurityGroups[0].GroupId" \
  --output text)

if [ "$SG_ID" = "None" ] || [ -z "$SG_ID" ]; then
  echo "Creating security group..."
  SG_ID=$(aws ec2 create-security-group \
    --region $REGION \
    --group-name $SG_NAME \
    --description "Auto-created SG for Ubuntu EC2" \
    --vpc-id $VPC_ID \
    --query "GroupId" \
    --output text)

  aws ec2 authorize-security-group-ingress \
    --region $REGION \
    --group-id $SG_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0
else
  echo "Using existing security group: $SG_ID"
fi

echo "Launching EC2 instance..."

aws ec2 run-instances \
  --region $REGION \
  --image-id $AMI_ID \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SG_ID \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$TAG_NAME}]"

echo "EC2 instance launched successfully 🚀"
