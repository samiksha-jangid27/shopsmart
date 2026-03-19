#!/bin/bash

# Idempotent Deployment Script
# It ensures predictable state regardless of how many times it is executed.

echo "Starting Idempotent EC2 Deployment Process..."

# 1. Idempotent directory creation
echo "Ensuring log directory exists..."
mkdir -p /var/log/shopsmart

# 2. Idempotent file creation
echo "Ensuring node production environment variable is locked..."
touch .env.production
if ! grep -q "NODE_ENV=production" .env.production; then
  echo "NODE_ENV=production" >> .env.production
fi

# 3. Dependencies
echo "Installing/Updating Dependencies..."
cd server
npm ci --production --loglevel=error || npm install --production
cd ..

cd client
npm ci --loglevel=error || npm install
npm run build
cd ..

# 4. Idempotent PM2 Process Restart
# Only installs PM2 globally if not already installed
if ! command -v pm2 &> /dev/null
then
    echo "PM2 not found. Installing..."
    npm install -g pm2
fi

# Restart or Start the application safely
echo "Booting backend daemon..."
cd server
pm2 describe shopsmart-api > /dev/null
if [ $? -eq 0 ]; then
    pm2 restart shopsmart-api
else
    pm2 start src/index.js --name shopsmart-api
fi
cd ..

echo "Deployment completed successfully. The system is live."
